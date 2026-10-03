import { afterEach, expect, it, vi } from 'vitest';
import { getBlogPage, getBlogPost, isBlogPage, isBlogPost, blogAsset } from '../../src/services/blog';
import { renderBlog } from '../../src/utils/blog-render';
import { blogPosts } from '../blog-fixture.mjs';
const post = blogPosts[0];
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
it('fetches summaries with language and pagination, and URL-encodes the complete language-prefixed slug', async () => {
  const { content, ...summary } = post;
  const fetch = vi.fn().mockResolvedValueOnce(Response.json({ data: [summary], pagination: { page: 1, limit: 3, total: 1, pages: 1 } })).mockResolvedValueOnce(Response.json(post));
  vi.stubGlobal('fetch', fetch);
  await getBlogPage('en', 1, 3, 'publishedAt');
  expect(fetch.mock.calls[0][0].searchParams.get('language')).toBe('en');
  expect(fetch.mock.calls[0][0].searchParams.get('limit')).toBe('3');
  await getBlogPost(post.slug);
  expect(fetch.mock.calls[1][0].pathname).toBe('/api/blog/en%2F1-reality-of-job-seeking');
  for (const [, options] of fetch.mock.calls) {
    expect(options.credentials).toBe('omit');
    expect(new Headers(options.headers).has('authorization')).toBe(false);
  }
});
it.each([404, 503])('preserves HTTP %s errors for truthful page responses', async status => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({}, { status })));
  await expect(getBlogPost(post.slug)).rejects.toMatchObject({ status });
});
it('rejects malformed contracts, drafts, invalid dates and mixed-language slugs', async () => {
  for (const value of [{}, null, { ...post, status: 'draft' }, { ...post, publishedAt: 'invalid' }, { ...post, language: 'es' }, { ...post, content: 1 }]) expect(isBlogPost(value)).toBe(false);
  expect(isBlogPage({ data: [post], pagination: { page: 0, limit: 3, total: 1, pages: 1 } })).toBe(false);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ data: [] })));
  await expect(getBlogPage('en')).rejects.toMatchObject({ status: 502 });
});
it('renders Markdown, tables and details while preventing HTML, URL and CSS injection', () => {
  const html = renderBlog('# Heading\n\n**Bold** [Bad](javascript:alert(1))\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n<details><summary>Sources</summary>Safe</details>\n\n<script>alert(1)</script><iframe src="https://evil.example"></iframe><svg onload="alert(1)"></svg><img src="javascript:alert(1)" onerror="alert(1)"><span style="background:url(javascript:alert(1));position:fixed;width:50%">safe</span>');
  expect(html).toContain('<h1>Heading</h1>');
  expect(html).toContain('<strong>Bold</strong>');
  expect(html).toContain('<table>');
  expect(html).toContain('<details><summary>Sources</summary>Safe</details>');
  expect(html).not.toMatch(/<script|<iframe|<svg|onerror|(?:href|src)="javascript:|position:|background:/);
});
it('retains chart markup, percentage bars, keyboard access and escaped labels', () => {
  const html = renderBlog(blogPosts[5].content);
  expect(html).toContain('data-chart="code"');
  expect(html).toContain('id="survey-code-title"');
  expect(html).toContain('width:50%');
  expect(html).toContain('tabindex="0"');
  expect(html).not.toContain('<script');
  expect(renderBlog('<h3 id="location">Title</h3>')).not.toContain('id=');
});
it('resolves backend asset URLs and blocks unsafe image sources', () => {
  expect(blogAsset('/blog-assets/images/test.jpg')).toBe('https://khanos-backend.herokuapp.com/blog-assets/images/test.jpg');
  expect(blogAsset('https://example.com/cover.jpg')).toBe('https://example.com/cover.jpg');
  expect(blogAsset('javascript:alert(1)')).toBe('');
  expect(renderBlog('![Cover](/blog-assets/images/test.jpg)')).toContain('https://khanos-backend.herokuapp.com/blog-assets/images/test.jpg');
  expect(renderBlog('<img src="http://external.example/a.jpg">')).not.toContain('external.example');
});
