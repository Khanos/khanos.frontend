import { afterEach, expect, it, vi } from 'vitest';
import { authorizeOwner, ownerBoundary } from '../../src/server/ownerAuth';
import { backendJson, originalUrlBody, apiResult } from '../../src/server/backend';
import { isUrlRecord } from '../../src/services/contracts';

const env = { URL_ADMIN_USERNAME: 'fixture-owner', URL_ADMIN_PASSWORD: 'synthetic-browser-owner-password-00000', OWNER_API_TOKEN: 'synthetic-backend-owner-token-0000000000', PUBLIC_BACKEND_API_URL: 'https://example.com/api/' };
const basic = `Basic ${Buffer.from(`${env.URL_ADMIN_USERNAME}:${env.URL_ADMIN_PASSWORD}`).toString('base64')}`;
const request = (method = 'GET', authorization = basic, origin?: string) => new Request('https://frontend.example/api/url-admin', { method, headers: { authorization, ...(origin ? { origin } : {}) } });
afterEach(() => vi.unstubAllGlobals());
it.each(['', 'Bearer synthetic', 'Basic !!!', `Basic ${Buffer.from('wrong:owner').toString('base64')}`])('rejects missing/incorrect owner credentials %#', value => {
  const denied = authorizeOwner(request('GET', value), env)!;
  expect(denied.status).toBe(401);
  expect(denied.headers.get('www-authenticate')).toMatch(/^Basic/);
  expect(denied.headers.get('cache-control')).toBe('no-store');
});
it('fails closed when deployment secrets are missing or malformed', () => {
  expect(authorizeOwner(request(), {})?.status).toBe(503);
  expect(authorizeOwner(request(), { ...env, OWNER_API_TOKEN: '' })?.status).toBe(503);
  expect(authorizeOwner(request(), { ...env, URL_ADMIN_PASSWORD: 'short' })?.status).toBe(503);
  expect(authorizeOwner(request(), { ...env, URL_ADMIN_PASSWORD: env.OWNER_API_TOKEN })?.status).toBe(503);
});
it.each(['POST', 'DELETE'])('rejects missing/cross-origin %s even with correct owner credentials', method => {
  expect(authorizeOwner(request(method), env)?.status).toBe(403);
  expect(authorizeOwner(request(method, basic, 'https://other.example'), env)?.status).toBe(403);
  expect(authorizeOwner(request(method, basic, 'https://frontend.example'), env)).toBeNull();
});
it('protects the page, trailing slashes, encoded paths and every admin route before reaching the backend', async () => {
  for (const path of ['/url', '/url/', '/%75rl', '/api/url-admin', '/api/%75rl-admin/create', '/api/url-admin/delete/42']) {
    const next = vi.fn();
    expect((await ownerBoundary(new Request(`https://frontend.example${path}`), next, env)).status).toBe(401);
    expect(next).not.toHaveBeenCalled();
  }
  const next = vi.fn().mockResolvedValue(new Response('public'));
  expect((await ownerBoundary(new Request('https://frontend.example/0042'), next, env)).status).toBe(200);
  expect(next).toHaveBeenCalledOnce();
});
it('prevents caching/framing of the authorized owner page', async () => {
  const response = await ownerBoundary(request(), async () => new Response('owner'), env);
  expect(response.headers.get('cache-control')).toBe('no-store');
  expect(response.headers.get('vary')).toContain('Authorization');
  expect(response.headers.get('content-security-policy')).toBe("frame-ancestors 'none'");
});
it('forwards only the server bearer token, never browser credentials or cookies', async () => {
  const record = { _id: '012345678901234567890abc', original_url: 'https://example.com', short_url: 42, creation_date: '2026-01-01' };
  const fetch = vi.fn().mockResolvedValue(Response.json(record));
  vi.stubGlobal('fetch', fetch);
  await backendJson('url/42', request(), isUrlRecord, {}, env);
  const [, options] = fetch.mock.calls[0];
  expect(options.headers.Authorization).toBe(`Bearer ${env.OWNER_API_TOKEN}`);
  expect(JSON.stringify(options.headers)).not.toContain(basic);
  expect(new Headers(options.headers).has('cookie')).toBe(false);
});
it('masks provider/body failures and rejects malformed owner bodies', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('synthetic-private-detail')));
  const response = await apiResult(() => backendJson('url', request(), isUrlRecord, {}, env));
  expect(response.status).toBe(502);
  expect(await response.text()).not.toContain('synthetic-private-detail');
  const body = (value: string) => new Request('https://frontend.example', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: value });
  await expect(originalUrlBody(body('{'))).rejects.toMatchObject({ status: 400 });
  await expect(originalUrlBody(body(JSON.stringify({ original_url: 42 })))).rejects.toMatchObject({ status: 400 });
  await expect(originalUrlBody(body('x'.repeat(20000)))).rejects.toMatchObject({ status: 413 });
  expect(await originalUrlBody(body(JSON.stringify({ original_url: 'https://example.com', ignored: 'value' })))).toEqual({ original_url: 'https://example.com' });
});
