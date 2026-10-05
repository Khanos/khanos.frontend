import { apiJson, ApiRequestError, backendBase, URL_LIST_BYTES, URL_RECORD_BYTES } from './api';
import { isGithubSearch, urlListForLimit, urlRecordForCode, urlRecordForOriginal, normalizedCode, validOriginalUrl } from './contracts';

export const searchGithubCommits = async (search: string, signal?: AbortSignal) =>
  apiJson(new URL(`github/getCommits/${encodeURIComponent(search)}`, backendBase()), { credentials: 'omit', signal }, isGithubSearch);
export const getUrlData = async (urlId: string) => {
  const code = normalizedCode(urlId);
  if (code === null) throw new ApiRequestError(400);
  return apiJson(new URL(`url/${code}`, backendBase()), { credentials: 'omit' }, urlRecordForCode(code), 8000, URL_RECORD_BYTES);
};
// Existing export name retained. Administration goes through the authenticated frontend server.
export const gerUrlList = (after?: string) => apiJson(`/api/url-admin${after ? `?after=${encodeURIComponent(after)}` : ''}`,
  { credentials: 'same-origin' }, urlListForLimit(25), 8000, URL_LIST_BYTES);
export const addShortUrl = (url: string) => {
  if (!validOriginalUrl(url)) return Promise.reject(new ApiRequestError(400));
  return apiJson('/api/url-admin/create', {
  method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ original_url: url }),
}, urlRecordForOriginal(url), 8000, URL_RECORD_BYTES);
};
export const deleteShortUrl = (urlId: number) => {
  const code = normalizedCode(urlId);
  if (code === null) return Promise.reject(new ApiRequestError(400));
  return apiJson(`/api/url-admin/delete/${code}`, {
  method: 'DELETE', credentials: 'same-origin',
}, urlRecordForCode(code), 8000, URL_RECORD_BYTES);
};
