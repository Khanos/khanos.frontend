import { afterEach, expect, it, vi } from 'vitest';
import { addShortUrl, deleteShortUrl, gerUrlList, getUrlData, searchGithubCommits } from '../../src/services';
import { apiJson, backendBase, validatedRetryAfter, URL_LIST_BYTES, URL_RECORD_BYTES } from '../../src/services/api';
import { isUrlRecord, normalizedCode, isUrlList, isGithubSearch, validOriginalUrl } from '../../src/services/contracts';
import { highlightParts } from '../../src/utils/github';

const record = { _id: '012345678901234567890abc', original_url: 'https://example.com', short_url: 42, creation_date: '2026-01-01' };
afterEach(() => vi.unstubAllGlobals());
it('encodes literal GitHub text and keeps public requests credential-free', async () => {
  const fetch = vi.fn().mockResolvedValue(Response.json({ total_count: 0, incomplete_results: false, items: [] }));
  vi.stubGlobal('fetch', fetch);
  await searchGithubCommits('fix/parser?bug#[]');
  const [url, options] = fetch.mock.calls[0];
  expect(url.pathname).toBe('/api/github/getCommits/fix%2Fparser%3Fbug%23%5B%5D');
  expect(url.search).toBe('');
  expect(options.credentials).toBe('omit');
});
it('normalizes legacy padding and preserves large codes in public lookup', async () => {
  const fetch = vi.fn().mockResolvedValue(Response.json(record));
  vi.stubGlobal('fetch', fetch);
  await getUrlData('0042');
  expect(fetch.mock.calls[0][0].pathname).toBe('/api/url/42');
  expect(normalizedCode('200000000000001')).toBe('200000000000001');
  expect(normalizedCode('0000')).toBe('0');
  for (const code of ['-1', '1e3', '9007199254740992', '00000000000000000', 'abc']) expect(normalizedCode(code)).toBeNull();
});
it('sends owner operations only to the same-origin bridge without a bearer token', async () => {
  const fetch = vi.fn().mockImplementation(url => Promise.resolve(Response.json(String(url).includes('?') ? {
    error: false, message: 'URLs found', data: [record], pagination: { limit: 25, next: null },
  } : record)));
  vi.stubGlobal('fetch', fetch);
  await gerUrlList('012345678901234567890abc');
  await addShortUrl(record.original_url);
  await deleteShortUrl(42);
  expect(fetch.mock.calls.map(([url]) => url)).toEqual(['/api/url-admin?after=012345678901234567890abc', '/api/url-admin/create', '/api/url-admin/delete/42']);
  for (const [, options] of fetch.mock.calls) {
    expect(options.credentials).toBe('same-origin');
    expect(new Headers(options.headers).has('authorization')).toBe(false);
  }
});
it.each([401, 404, 429, 503])('rejects HTTP %s without trusting its body', async status => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ error: 'synthetic-private-provider-detail' }, { status })));
  await expect(gerUrlList()).rejects.toMatchObject({ status, message: 'API request failed' });
});
it('rejects malformed success JSON and provider contracts', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>unavailable</html>')));
  await expect(gerUrlList()).rejects.toMatchObject({ status: 502 });
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ data: undefined })));
  await expect(gerUrlList()).rejects.toMatchObject({ status: 502 });
  expect(isUrlList({ error: false, data: [record], pagination: { limit: 25, next: 'bad' } })).toBe(false);
  expect(isUrlRecord({ ...record, original_url: 'javascript:alert(1)' })).toBe(false);
  expect(isGithubSearch({ items: [], total_count: -1, incomplete_results: false })).toBe(false);
  expect(isGithubSearch({ items: [null], total_count: 1, incomplete_results: false })).toBe(false);
});
it('enforces a deadline through bounded streamed body decoding and cancels the read', async () => {
  const cancelled = vi.fn();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(new ReadableStream({ cancel: cancelled }), { headers: { 'Content-Type': 'application/json' } })));
  await expect(apiJson('https://example.com', {}, isUrlRecord, 20, URL_RECORD_BYTES)).rejects.toMatchObject({ status: 504 });
  expect(cancelled).toHaveBeenCalledOnce();
});
it('binds lookup, create and delete success records to their request identity', async () => {
  vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Response.json({ ...record, short_url: 43 })));
  await expect(getUrlData('0042')).rejects.toMatchObject({ status: 502 });
  await expect(deleteShortUrl(42)).rejects.toMatchObject({ status: 502 });
  vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Response.json({ ...record, original_url: 'https://other.example/' })));
  await expect(addShortUrl(record.original_url)).rejects.toMatchObject({ status: 502 });
});
it('preserves exact input text and aligns control-byte guards without changing URL policy', async () => {
  for (const original of ['http://localhost/path', 'https://example.com/é?q=Raw%2f#A']) expect(validOriginalUrl(original)).toBe(true);
  for (const original of ['https://example.com/\u0000', 'https://example.com/\u0001', 'https://example.com/\u007f', 'https://example.com/\r\nX:1', 'https://user:pass@example.com', 'file:///tmp/x', 'https://example.com/a b']) expect(validOriginalUrl(original)).toBe(false);
  const fetch = vi.fn().mockImplementation((_url, init) => Response.json({ ...record, original_url: JSON.parse(init.body).original_url }));
  vi.stubGlobal('fetch', fetch);
  const original = 'HTTPS://example.com/é?q=Raw%2f#A';
  expect((await addShortUrl(original)).original_url).toBe(original);
  expect(JSON.parse(fetch.mock.calls[0][1].body).original_url).toBe(original);
});
it('validates safe retry timing without guessing or forwarding provider bodies', async () => {
  const now = Date.parse('2026-10-05T12:00:00Z');
  expect(validatedRetryAfter('15', now)).toBe(15);
  expect(validatedRetryAfter('Mon, 05 Oct 2026 12:00:30 GMT', now)).toBe(30);
  for (const value of ['0', '3601', '-1', '1.5', '2e2', '2026-10-05', 'invalid', '1'.repeat(100), 'Mon, 05 Oct 2026 11:59:30 GMT']) expect(validatedRetryAfter(value, now)).toBeUndefined();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ error: 'private' }, { status: 429, headers: { 'Retry-After': '60' } })));
  await expect(gerUrlList()).rejects.toMatchObject({ status: 429, retryAfter: 60, message: 'API request failed' });
});
it.each([undefined, '1'])('bounds streamed bytes with missing or lying Content-Length (%s)', async length => {
  const cancel = vi.fn();
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(URL_RECORD_BYTES + 1)); }, cancel });
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(stream, { headers: { 'Content-Type': 'application/json', ...(length ? { 'Content-Length': length } : {}) } })));
  await expect(getUrlData('42')).rejects.toMatchObject({ status: 502 });
  expect(cancel).toHaveBeenCalledOnce();
});
it('rejects oversized declared bytes, non-JSON media types, malformed UTF-8 and invalid JSON', async () => {
  for (const response of [
    new Response('{}', { headers: { 'Content-Type': 'application/json', 'Content-Length': String(URL_RECORD_BYTES + 1) } }),
    new Response(JSON.stringify(record), { headers: { 'Content-Type': 'text/html' } }),
    new Response(new Uint8Array([0xff]), { headers: { 'Content-Type': 'application/json' } }),
    new Response('{', { headers: { 'Content-Type': 'application/json' } }),
  ]) {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    await expect(getUrlData('42')).rejects.toMatchObject({ status: 502 });
  }
});
it('cancels a stalled bounded read when its caller aborts', async () => {
  const cancelled = vi.fn();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(new ReadableStream({ cancel: cancelled }), { headers: { 'Content-Type': 'application/json' } })));
  const controller = new AbortController();
  const pending = apiJson('https://example.com', { signal: controller.signal }, isUrlRecord, 8000, URL_RECORD_BYTES);
  await Promise.resolve(); controller.abort();
  await expect(pending).rejects.toMatchObject({ status: 504 });
  expect(cancelled).toHaveBeenCalledOnce();
});
it('bounds list count by requested and returned limits while accepting a maximum Unicode page', async () => {
  const data = Array.from({ length: 100 }, (_, index) => ({ ...record, short_url: index, original_url: 'https://example.com/' + '漢'.repeat(2048 - 'https://example.com/'.length) }));
  const page = { error: false, message: 'URLs found', data, pagination: { limit: 100, next: null } };
  expect(isUrlList(page)).toBe(true);
  expect(isUrlList(page, 25)).toBe(false);
  expect(isUrlList({ ...page, data: [...data, record] })).toBe(false);
  expect(isUrlRecord({ ...record, creation_date: 'invalid-date' })).toBe(false);
  expect(new TextEncoder().encode(JSON.stringify(page)).byteLength).toBeLessThan(URL_LIST_BYTES);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(page)));
  expect((await apiJson('https://example.com', {}, isUrlList, 8000, URL_LIST_BYTES)).data).toHaveLength(100);
});
it('validates public provider configuration without permitting credential-bearing bases', () => {
  expect(backendBase('https://example.com/api/', false).href).toBe('https://example.com/api/');
  for (const value of ['http://example.com/api/', 'https://example.com/api/?token=synthetic', 'https://example.com/api/#fragment', 'https://user@example.com/api/']) expect(() => backendBase(value, false)).toThrow();
  expect(backendBase('http://127.0.0.1:1234/api/', true).hostname).toBe('127.0.0.1');
});
it('highlights literal text, including regex characters, without generating HTML', () => {
  const source = '<img src=x onerror=alert(1)> fix[parser] FIX[parser]';
  const parts = highlightParts(source, 'fix[parser]');
  expect(parts.map(part => part.text).join('')).toBe(source);
  expect(parts.filter(part => part.match).map(part => part.text)).toEqual(['fix[parser]', 'FIX[parser]']);
});
