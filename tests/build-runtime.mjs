import assert from 'node:assert/strict';
import { blogPosts } from './blog-fixture.mjs';
import { owner, token } from './api-fixture.mjs';
import { readdir, readFile } from 'node:fs/promises';

process.env.URL_ADMIN_USERNAME = owner.username;
process.env.URL_ADMIN_PASSWORD = owner.password;
process.env.OWNER_API_TOKEN = token;
process.env.PUBLIC_BACKEND_API_URL = 'https://example.com/api/';
let adminPost = structuredClone(blogPosts[0]);
let adminCalls = 0;

// Exercise Vercel's built handler with Node's require(ESM) bridge disabled,
// matching the runtime loader that rejected sanitize-html's parser dependency.
// Intercept every fetch so this check never reaches a production API.
globalThis.fetch = async (input, init = {}) => {
  const url = new URL(input instanceof Request ? input.url : String(input));
  if (new Headers(init.headers).get('authorization')) {
    adminCalls++;
    assert.equal(new Headers(init.headers).get('authorization'), `Bearer ${token}`);
    assert.equal(new Headers(init.headers).get('cookie'), null);
    if (url.pathname === '/api/blog/admin') {
      const { content, ...summary } = adminPost;
      return Response.json({ data: [summary], pagination: { page: 1, limit: 25, total: 1, pages: 1 } });
    }
    if (url.pathname === `/api/blog/admin/${adminPost.id}`) return Response.json(adminPost);
    if (init.method === 'DELETE') return new Response(null, { status: 204 });
    if (init.method === 'POST' || init.method === 'PATCH') {
      adminPost = { ...adminPost, ...JSON.parse(init.body), updatedAt: new Date().toISOString() };
      return Response.json(adminPost);
    }
    throw new Error('Unexpected admin path');
  }
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

const authorization = `Basic ${Buffer.from(`${owner.username}:${owner.password}`).toString('base64')}`;
const adminRequest = (path, method = 'GET', body) => new Request(`https://epilef.app${path}`, {
  method, headers: { authorization, Origin: 'https://epilef.app', 'Content-Type': 'application/json' },
  ...(body ? { body: JSON.stringify(body) } : {}),
});
const callsBefore = adminCalls;
for (const path of ['/admin/blog', '/admin/blog/new', `/admin/blog/${adminPost.id}`, '/api/blog-admin', '/api/blog-admin/preview']) {
  const denied = await handler.fetch(new Request(`https://epilef.app${path}`));
  assert.equal(denied.status, 401);
  assert.equal(denied.headers.get('cache-control'), 'no-store');
}
assert.equal(adminCalls, callsBefore);
for (const path of ['/admin/blog', '/admin/blog/new', `/admin/blog/${adminPost.id}`, '/api/blog-admin', `/api/blog-admin/${adminPost.id}`]) {
  const response = await handler.fetch(adminRequest(path));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.ok(!(await response.text()).includes(token));
}
const input = { title: 'Runtime post', slug: 'en/runtime-post', language: 'en', coverImage: 'https://example.com/cover.jpg', content: '# Runtime preview', categories: [], author: 'Fixture', anonymous: false, excerpt: '', status: 'draft' };
for (const [method, path, body] of [
  ['POST', '/api/blog-admin', input],
  ['PATCH', `/api/blog-admin/${adminPost.id}`, { ...input, status: 'published' }],
  ['PATCH', `/api/blog-admin/${adminPost.id}`, { ...input, status: 'published', publishedAt: '2099-01-01T00:00:00.000Z' }],
]) {
  const response = await handler.fetch(adminRequest(path, method, body));
  assert.equal(response.status, 200);
  const saved = await response.json();
  assert.equal(saved.status, body.status);
  if (body.publishedAt) assert.equal(saved.publishedAt, body.publishedAt);
}
const preview = await handler.fetch(adminRequest('/api/blog-admin/preview', 'POST', { content: '# Preview\n\n<script>window.attack=1</script>' }));
assert.equal(preview.status, 200);
assert.equal((await preview.json()).html, '<h1>Preview</h1>\n');
assert.equal((await handler.fetch(adminRequest(`/api/blog-admin/${adminPost.id}`, 'DELETE'))).status, 200);
async function scanClient(directory) {
  let files = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) files += await scanClient(path);
    else if (/\.(?:js|mjs|html|map)$/.test(entry.name)) {
      const text = await readFile(path, 'utf8');
      for (const secret of [token, owner.password, 'OWNER_API_TOKEN', 'URL_ADMIN_PASSWORD', 'node:crypto']) assert.ok(!text.includes(secret), `Private server value/module leaked into ${path}`);
      files++;
    }
  }
  return files;
}
const files = await scanClient('.vercel/output/static');
assert.ok(files > 0);
console.log(`Built Vercel runtime: protected admin pages, CRUD, schedule, sanitized preview and ${files} client assets checked for secret leaks.`);
