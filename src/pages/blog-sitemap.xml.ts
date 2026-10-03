import type { APIRoute } from 'astro';
import { getBlogPage, blogCacheControl } from '../services/blog';

/** Dynamic articles are absent from Astro's build-time sitemap. */
export const GET: APIRoute = async ({ site, url }) => {
  try {
    const entries: string[] = [];
    for (const language of ['en', 'es'] as const) {
      let page = 1;
      while (page <= 1000) {
        const result = await getBlogPage(language, page, 100);
        for (const post of result.data) {
          const location = new URL(`/blog/${post.slug}`, site || url.origin).href;
          // Slugs are restricted to language, letters, digits and hyphens by the response guard.
          entries.push(`<url><loc>${location}</loc><lastmod>${new Date(post.updatedAt).toISOString()}</lastmod></url>`);
        }
        if (page >= result.pagination.pages) break;
        page++;
      }
    }
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`,
      { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': blogCacheControl } });
  } catch {
    return new Response('Sitemap temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};
