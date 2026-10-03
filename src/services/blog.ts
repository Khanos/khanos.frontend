import { apiJson, backendBase } from './api';
import type { BlogPage, BlogPost, BlogPostSummary } from '../types/blog';

const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const date = (value: unknown) => typeof value === 'string' && Number.isFinite(Date.parse(value));
export function isBlogSummary(value: unknown): value is BlogPostSummary {
  if (!object(value)) return false;
  return typeof value.id === 'string' && /^[a-f0-9]{24}$/.test(value.id) &&
    typeof value.slug === 'string' && /^(en|es)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug) &&
    ['en', 'es'].includes(String(value.language)) && value.slug.startsWith(`${value.language}/`) &&
    ['title', 'excerpt', 'author', 'coverImage'].every(key => typeof value[key] === 'string') &&
    typeof value.anonymous === 'boolean' && value.status === 'published' && date(value.publishedAt) &&
    date(value.createdAt) && date(value.updatedAt) &&
    (value.displayDate === undefined || typeof value.displayDate === 'string') &&
    Array.isArray(value.categories) && value.categories.every(category => typeof category === 'string') &&
    Number.isInteger(value.readingMinutes) && Number(value.readingMinutes) >= 1;
}
export function isBlogPost(value: unknown): value is BlogPost {
  return isBlogSummary(value) && 'content' in value && typeof value.content === 'string';
}
export function isBlogPage(value: unknown): value is BlogPage {
  if (!object(value) || !Array.isArray(value.data) || !value.data.every(isBlogSummary) || !object(value.pagination)) return false;
  const pagination = value.pagination;
  return ['page', 'limit', 'total', 'pages'].every(key =>
      Number.isInteger(pagination[key]) && Number(pagination[key]) >= (key === 'page' || key === 'limit' ? 1 : 0));
}
export function blogAsset(value: string): string {
  const url = new URL(value, backendBase());
  if (url.protocol === 'https:' && !url.username && !url.password) return url.href;
  const base = backendBase();
  if (url.origin === base.origin && url.pathname.startsWith('/blog-assets/')) return url.href;
  return '';
}
export function getBlogPage(language: 'en' | 'es', page = 1, limit = 25, sort = 'slug') {
  const url = new URL('blog', backendBase());
  url.search = new URLSearchParams({ language, page: String(page), limit: String(limit), sort }).toString();
  return apiJson(url, { credentials: 'omit' }, isBlogPage);
}
export function getBlogPost(slug: string) {
  return apiJson(new URL(`blog/${encodeURIComponent(slug)}`, backendBase()), { credentials: 'omit' }, isBlogPost);
}
export const blogCacheControl = 'public, max-age=0, s-maxage=60';
