import { apiJson, ApiRequestError, backendBase } from './api';
import { isGithubSearch, isUrlList, isUrlRecord, normalizedCode } from './contracts';

export const searchGithubCommits = async (search: string, signal?: AbortSignal) =>
  apiJson(new URL(`github/getCommits/${encodeURIComponent(search)}`, backendBase()), { credentials: 'omit', signal }, isGithubSearch);
export const getUrlData = async (urlId: string) => {
  const code = normalizedCode(urlId);
  if (code === null) throw new ApiRequestError(400);
  return apiJson(new URL(`url/${code}`, backendBase()), { credentials: 'omit' }, isUrlRecord);
};
// Existing export name retained. Administration goes through the authenticated frontend server.
export const gerUrlList = (after?: string) => apiJson(`/api/url-admin${after ? `?after=${encodeURIComponent(after)}` : ''}`,
  { credentials: 'same-origin' }, isUrlList);
export const addShortUrl = (url: string) => apiJson('/api/url-admin/create', {
  method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ original_url: url }),
}, isUrlRecord);
export const deleteShortUrl = (urlId: number) => apiJson(`/api/url-admin/delete/${urlId}`, {
  method: 'DELETE', credentials: 'same-origin',
}, isUrlRecord);
