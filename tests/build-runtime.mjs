import assert from 'node:assert/strict';
import { blogPosts } from './blog-fixture.mjs';

// Exercise Vercel's built handler with Node's require(ESM) bridge disabled,
// matching the runtime loader that rejected sanitize-html's parser dependency.
// Intercept every fetch so this check never reaches a production API.
globalThis.fetch = async input => {
  const url = new URL(input instanceof Request ? input.url : String(input));
  if (url.pathname === '/api/blog') {
    const language = url.searchParams.get('language');
    const posts = blogPosts.filter(post => !language || post.language === language);
    const summaries = posts.map(({ content, ...summary }) => summary);
    return Response.json({ data: summaries, pagination: { page: 1, limit: Number(url.searchParams.get('limit') || 25), total: posts.length, pages: 1 } });
  }
  if (url.pathname.startsWith('/api/blog/')) {
    const slug = decodeURIComponent(url.pathname.slice('/api/blog/'.length));
    const post = blogPosts.find(post => post.slug === slug);
    return Response.json(post || { error: 'Not found' }, { status: post ? 200 : 404 });
  }
  throw new Error('Unexpected external request in built runtime check');
};

const { default: handler } = await import('../.vercel/output/functions/_render.func/dist/server/entry.mjs');
for (const language of ['en', 'es']) {
  const slug = `${language}/6-state-of-devs-2026-ai-workflow`;
  const response = await handler.fetch(new Request(`https://epilef.app/blog/${slug}`));
  assert.equal(response.status, 200, 'Built article must render without a fallback redirect');
  const html = await response.text();
  assert.ok(html.includes(`<title>${language === 'es' ? 'Artículo' : 'Article'} 6</title>`));
  assert.ok(html.includes('data-chart="code"'));
  assert.ok(html.includes('width:50%') || html.includes('width: 50%'));
  assert.ok(!html.includes('window.__blogAttack'));
  assert.ok(!html.includes('javascript:alert'));
}
const sitemap = await handler.fetch(new Request('https://epilef.app/blog-sitemap.xml'));
assert.equal(sitemap.status, 200);
assert.equal(((await sitemap.text()).match(/<loc>/g) || []).length, 12);
const missing = await handler.fetch(new Request('https://epilef.app/blog/en/missing'));
assert.equal(missing.status, 404);
console.log('Built Vercel runtime: bilingual articles, sanitizer, charts, sitemap and 404 passed.');
