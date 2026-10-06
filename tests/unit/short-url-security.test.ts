import { afterEach, expect, it, vi } from 'vitest';
import { enforceRateLimit } from '../../src/server/rateLimit';
import { ownerBoundary } from '../../src/server/ownerAuth';
import { resolveShortUrl } from '../../src/server/shortUrl';
import { apiResult, backendJson } from '../../src/server/backend';
import { ApiRequestError, URL_RECORD_BYTES } from '../../src/services/api';
import { urlRecordForOriginal, urlRecordForCode } from '../../src/services/contracts';
import { POST } from '../../src/pages/api/url-admin/create';
import { DELETE } from '../../src/pages/api/url-admin/delete/[short_url]';

const env = {
  NODE_ENV: 'production', VERCEL: '1', VERCEL_ENV: 'production', VERCEL_URL: 'fixture.vercel.app',
  RATE_LIMIT_SECRET: 'synthetic-firewall-counter-secret-000000000000',
  URL_ADMIN_USERNAME: 'fixture-owner', URL_ADMIN_PASSWORD: 'synthetic-browser-owner-password-00000', OWNER_API_TOKEN: 'synthetic-backend-owner-token-0000000000', PUBLIC_BACKEND_API_URL: 'https://example.com/api/',
};
const basic = `Basic ${Buffer.from(`${env.URL_ADMIN_USERNAME}:${env.URL_ADMIN_PASSWORD}`).toString('base64')}`;
const request = (path = '/url', authorization = '', method = 'GET') => new Request(`https://frontend.example${path}`, {
  method, headers: { 'x-real-ip': '192.0.2.1', authorization, 'host': 'attacker.example', 'x-forwarded-for': '198.51.100.1', cookie: 'private=fixture', origin: 'https://frontend.example' },
});
const record = { _id: '012345678901234567890abc', original_url: 'https://example.com/', short_url: 42, creation_date: '2026-01-01T00:00:00Z' };
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

it('uses only trusted Vercel identity with a fixed admission kind', async () => {
  const check = vi.fn().mockResolvedValue({ rateLimited: false });
  expect(await enforceRateLimit(request(), 'owner', env, check)).toBeNull();
  const [id, options] = check.mock.calls[0];
  expect(id).toBe('owner');
  expect(options.clientIp).toBe('192.0.2.1');
  expect(options.signal).toBeInstanceOf(AbortSignal);
  await enforceRateLimit(request(), 'aggregate', env, check);
  expect(check.mock.calls[1][0]).toBe('aggregate');
});
it('fails closed for missing platform settings, provider failures, unsupported ingress and invalid identity', async () => {
  for (const result of [{ rateLimited: false, error: 'not-found' }, { rateLimited: true, error: 'blocked' }, {}]) {
    const denied = await enforceRateLimit(request(), 'owner', env, vi.fn().mockResolvedValue(result));
    expect(denied?.status).toBe(503);
    expect(await denied?.text()).not.toContain('not-found');
  }
  expect((await enforceRateLimit(request(), 'owner', env, vi.fn().mockRejectedValue(new Error('private-provider-detail'))))?.status).toBe(503);
  for (const settings of [{ ...env, VERCEL_ENV: '' }, { ...env, VERCEL: '' }, { ...env, VERCEL_URL: 'evil.example/path' }, { ...env, NODE_ENV: 'development' }]) {
    const check = vi.fn();
    expect((await enforceRateLimit(request(), 'owner', settings, check))?.status).toBe(503);
    expect(check).not.toHaveBeenCalled();
  }
  const check = vi.fn();
  expect((await enforceRateLimit(new Request('https://frontend.example/url', { headers: { 'x-real-ip': 'bad', 'x-forwarded-for': '192.0.2.1' } }), 'owner', env, check))?.status).toBe(503);
  expect(check).not.toHaveBeenCalled();
});
it('times out an unavailable provider without allowing the request', async () => {
  vi.useFakeTimers();
  try {
    const pending = enforceRateLimit(request(), 'owner', env, () => new Promise(() => {}));
    await vi.advanceTimersByTimeAsync(2001);
    expect((await pending)?.status).toBe(503);
  } finally { vi.useRealTimers(); }
});
it('requires an independent server-only admission secret before any provider call', async () => {
  for (const secret of ['', 'short', 'x'.repeat(257), 'x'.repeat(32) + '\n', env.OWNER_API_TOKEN, env.URL_ADMIN_PASSWORD, env.URL_ADMIN_USERNAME]) {
    const check = vi.fn();
    expect((await enforceRateLimit(request(), 'resolver', { ...env, RATE_LIMIT_SECRET: secret }, check))?.status).toBe(503);
    expect(check).not.toHaveBeenCalled();
  }
});
it('returns uncached 429 without inventing retry timing', async () => {
  const denied = await enforceRateLimit(request(), 'resolver', env, vi.fn().mockResolvedValue({ rateLimited: true }));
  expect(denied?.status).toBe(429);
  expect(denied?.headers.get('retry-after')).toBeNull();
  expect(denied?.headers.get('cache-control')).toBe('no-store');
});
it('uses the actual HTTPS admission adapter with only its credential and validated IP', async () => {
  const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
  vi.stubGlobal('fetch', fetch);
  expect(await enforceRateLimit(request(), 'resolver', env)).toBeNull();
  const [url, options] = fetch.mock.calls[0];
  expect(String(url)).toBe('https://example.com/api/admission');
  expect(options.method).toBe('POST');
  expect(options.redirect).toBe('error');
  expect(options.credentials).toBe('omit');
  expect(options.headers).toEqual({ 'Content-Type': 'application/json', Authorization: `Bearer ${env.RATE_LIMIT_SECRET}` });
  expect(JSON.parse(options.body)).toEqual({ kind: 'resolver', clientIp: '192.0.2.1', environment: 'production' });
  for (const status of [200, 301, 401, 404, 500, 503]) {
    fetch.mockResolvedValueOnce(new Response('private-provider-detail', { status }));
    const denied = await enforceRateLimit(request(), 'resolver', env);
    expect(denied?.status).toBe(503);
    expect(await denied?.text()).not.toContain('private-provider-detail');
  }
  fetch.mockResolvedValueOnce(new Response('private-provider-detail', { status: 429, headers: { 'Retry-After': '12' } }));
  const limited = await enforceRateLimit(request(), 'resolver', env);
  expect(limited?.status).toBe(429);
  expect(limited?.headers.get('retry-after')).toBe('12');
  fetch.mockResolvedValueOnce(new Response(null, { status: 429, headers: { 'Retry-After': 'unsafe' } }));
  expect((await enforceRateLimit(request(), 'resolver', env))?.headers.get('retry-after')).toBeNull();
  fetch.mockRejectedValueOnce(new Error('private-provider-detail'));
  expect((await enforceRateLimit(request(), 'resolver', env))?.status).toBe(503);
  const before = fetch.mock.calls.length;
  expect((await enforceRateLimit(request(), 'resolver', { ...env, PUBLIC_BACKEND_API_URL: 'http://evil.example/api/' }))?.status).toBe(503);
  expect(fetch).toHaveBeenCalledTimes(before);
});
it('cancels stalled admission HTTP requests at the application deadline without retries', async () => {
  vi.useFakeTimers();
  try {
    const fetch = vi.fn().mockImplementation(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetch);
    const pending = enforceRateLimit(request(), 'owner', env);
    await vi.advanceTimersByTimeAsync(2001);
    expect((await pending)?.status).toBe(503);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
  } finally { vi.useRealTimers(); }
});
it('enforces pre-auth safety and separate failed/cross-origin attempt budgets on every shared owner path', async () => {
  for (const path of ['/url', '/%75rl/', '/api/%75rl-admin/create', '/admin/blog/new', '/api/blog-admin/upload']) {
    const next = vi.fn();
    const limit = vi.fn().mockResolvedValue(null);
    const denied = await ownerBoundary(request(path), next, env, limit);
    expect(denied.status).toBe(401);
    expect(limit.mock.calls.map(call => call[1])).toEqual(['aggregate', 'owner', 'failure']);
    expect(next).not.toHaveBeenCalled();
    expect(denied.headers.get('x-frame-options')).toBe('DENY');
  }
  const next = vi.fn();
  const limit = vi.fn().mockResolvedValue(new Response('limited', { status: 429 }));
  expect((await ownerBoundary(request('/url', basic), next, env, limit)).status).toBe(429);
  expect(next).not.toHaveBeenCalled();
  const good = vi.fn().mockResolvedValue(null);
  expect((await ownerBoundary(request('/url', basic), async () => new Response('owner'), env, good)).status).toBe(200);
  expect(good.mock.calls.map(call => call[1])).toEqual(['aggregate', 'owner']);
  const cross = new Request('https://frontend.example/api/blog-admin', { method: 'POST', headers: { authorization: basic, origin: 'null' } });
  expect((await ownerBoundary(cross, next, env, good)).status).toBe(403);
  expect(good.mock.calls[good.mock.calls.length - 1]?.[1]).toBe('failure');
});
it('gates normalized numeric resolution before invoking the server-only relay', async () => {
  for (const path of ['/0042', '/%30%30%34%32', '/200000000000001']) {
    const next = vi.fn();
    const limit = vi.fn().mockResolvedValue(new Response('limited', { status: 429 }));
    expect((await ownerBoundary(request(path), next, env, limit)).status).toBe(429);
    expect(limit.mock.calls.map(call => call[1])).toEqual(['resolver']);
    expect(next).not.toHaveBeenCalled();
  }
});
it('isolates clients using the shared enforcement result and recovers after provider failure', async () => {
  const check = vi.fn().mockImplementation((_id, options) => Promise.resolve({ rateLimited: options.clientIp === '192.0.2.1' }));
  const other = new Request('https://frontend.example/0042', { headers: { 'x-real-ip': '192.0.2.2' } });
  expect((await enforceRateLimit(request(), 'resolver', env, check))?.status).toBe(429);
  expect(await enforceRateLimit(other, 'resolver', env, check)).toBeNull();
  check.mockRejectedValueOnce(new Error('store-down'));
  expect((await enforceRateLimit(other, 'resolver', env, check))?.status).toBe(503);
  expect(await enforceRateLimit(other, 'resolver', env, check)).toBeNull();
});
it('uses server bearer lookup with no visitor Basic/cookie/forwarding relay and binds returned code', async () => {
  const fetch = vi.fn().mockImplementation(() => Response.json(record));
  vi.stubGlobal('fetch', fetch);
  expect((await resolveShortUrl('0042', request('/0042'), env)).short_url).toBe(42);
  const options = fetch.mock.calls[0][1];
  expect(new Headers(options.headers).get('authorization')).toBe(`Bearer ${env.OWNER_API_TOKEN}`);
  for (const name of ['cookie', 'x-forwarded-for', 'x-real-ip', 'origin']) expect(new Headers(options.headers).has(name)).toBe(false);
  await expect(resolveShortUrl('42', request('/42'), { ...env, OWNER_API_TOKEN: '' })).rejects.toMatchObject({ status: 503 });
  fetch.mockImplementation(() => Response.json({ ...record, short_url: 43 }));
  await expect(resolveShortUrl('42', request('/42'), env)).rejects.toMatchObject({ status: 502 });
});
it('preserves validated 429 metadata in the bridge and omits unsafe or non-429 timing', async () => {
  for (const [status, retry, expected] of [[429, '30', '30'], [429, '3601', null], [503, '30', null]] as const) {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Response.json({ error: 'private-provider-detail' }, { status, headers: { 'Retry-After': retry } })));
    const response = await apiResult(() => backendJson('url/42', request(), urlRecordForCode(42), {}, env, URL_RECORD_BYTES));
    expect(response.status).toBe(status);
    expect(response.headers.get('retry-after')).toBe(expected);
    expect(await response.text()).not.toContain('private-provider-detail');
  }
  expect((await apiResult(() => Promise.reject(new ApiRequestError(429)))).headers.get('retry-after')).toBeNull();
});
it('validates identity inside direct create/delete bridge routes before returning success', async () => {
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
  vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Response.json(record)));
  const create = new Request('https://frontend.example/api/url-admin/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ original_url: 'https://other.example/' }) });
  const context = { request: create } as Parameters<typeof POST>[0];
  expect((await POST(context)).status).toBe(502);
  expect((await DELETE({ request: request(), params: { short_url: '0043' } } as unknown as Parameters<typeof DELETE>[0])).status).toBe(502);
  expect(urlRecordForOriginal(record.original_url)(record)).toBe(true);
});
it('rejects unsafe owner originals before forwarding and preserves valid exact Unicode input', async () => {
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
  const fetch = vi.fn().mockImplementation((_url, init) => Response.json({ ...record, original_url: JSON.parse(init.body).original_url }));
  vi.stubGlobal('fetch', fetch);
  const create = (original_url: string) => POST({ request: new Request('https://frontend.example/api/url-admin/create', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ original_url }),
  }) } as Parameters<typeof POST>[0]);
  for (const value of ['https://example.com/\u0001', 'https://example.com/\u007f', 'https://example.com/a b', 'https://user@example.com/', 'javascript:alert(1)']) expect((await create(value)).status).toBe(400);
  expect(fetch).not.toHaveBeenCalled();
  const original = 'HTTPS://example.com/漢?q=Raw%2f#A';
  expect((await (await create(original)).json()).original_url).toBe(original);
});
