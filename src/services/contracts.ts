import type { githubCommitType, urlShortenerType, urlListType } from '../types';

export function normalizedCode(value: string | number): string | null {
  const code = String(value);
  return /^\d{1,16}$/.test(code) && Number.isSafeInteger(Number(code)) ? String(Number(code)) : null;
}
function validHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2048 || /\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password;
  } catch { return false; }
}
export function validOriginalUrl(value: unknown): value is string {
  return validHttpUrl(value) && !/[\x00-\x1f\x7f]/.test(value) && !!new URL(value).hostname;
}
export function isUrlRecord(data: unknown): data is urlShortenerType {
  if (!data || typeof data !== 'object') return false;
  const value = data as urlShortenerType;
  return typeof value._id === 'string' && /^[a-f\d]{24}$/.test(value._id) && validOriginalUrl(value.original_url) &&
    typeof value.short_url === 'number' && value.short_url >= 0 && Number.isSafeInteger(value.short_url) &&
    typeof value.creation_date === 'string' && value.creation_date.length <= 64 && Number.isFinite(Date.parse(value.creation_date));
}
export const urlRecordForCode = (code: string | number) => (data: unknown): data is urlShortenerType =>
  isUrlRecord(data) && normalizedCode(data.short_url) === normalizedCode(code);
export const urlRecordForOriginal = (original: string) => (data: unknown): data is urlShortenerType =>
  isUrlRecord(data) && data.original_url === original;
export function isUrlList(data: unknown, requestedLimit = 100): data is urlListType {
  if (!data || typeof data !== 'object') return false;
  const value = data as urlListType;
  return value.error === false && Array.isArray(value.data) && value.data.every(isUrlRecord) && !!value.pagination &&
    Number.isInteger(value.pagination.limit) && value.pagination.limit >= 1 && value.pagination.limit <= 100 &&
    value.pagination.limit <= requestedLimit && value.data.length <= value.pagination.limit && value.data.length <= requestedLimit &&
    (value.pagination.next === null || (typeof value.pagination.next === 'string' && /^[a-f\d]{24}$/.test(value.pagination.next)));
}
export const urlListForLimit = (limit: number) => (data: unknown): data is urlListType => isUrlList(data, limit);
export type GithubSearchResult = { items: githubCommitType[]; total_count: number; incomplete_results: boolean };
function isGithubCommit(data: unknown): data is githubCommitType {
  if (!data || typeof data !== 'object') return false;
  const value = data as githubCommitType;
  return !!value.commit && typeof value.commit.message === 'string' && !!value.commit.author &&
    typeof value.commit.author.name === 'string' && typeof value.commit.author.date === 'string' &&
    !!value.repository && typeof value.repository.name === 'string' && validHttpUrl(value.repository.html_url) &&
    (value.repository.description === null || typeof value.repository.description === 'string') && validHttpUrl(value.html_url) &&
    (value.author === null || (!!value.author && validHttpUrl(value.author.avatar_url)));
}
export function isGithubSearch(data: unknown): data is GithubSearchResult {
  if (!data || typeof data !== 'object') return false;
  const value = data as GithubSearchResult;
  return Array.isArray(value.items) && value.items.every(isGithubCommit) && Number.isInteger(value.total_count) && value.total_count >= 0 && typeof value.incomplete_results === 'boolean';
}
