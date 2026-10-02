import { afterEach, expect, it, vi } from 'vitest';
import { addShortUrl, deleteShortUrl, gerUrlList, getUrlData, searchGithubCommits } from '../../src/services';
import { apiJson, backendBase } from '../../src/services/api';
import { isUrlRecord, normalizedCode, isUrlList, isGithubSearch } from '../../src/services/contracts';
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
it('enforces a deadline through response body decoding', async () => {
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async (_url, options) => ({
    ok: true, json: () => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true })),
  })));
  await expect(apiJson('https://example.com', {}, isUrlRecord, 20)).rejects.toMatchObject({ status: 504 });
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
