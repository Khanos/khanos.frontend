import http from 'node:http';
import { blogPosts } from './blog-fixture.mjs';

// Synthetic credentials, only used by the isolated test process.
export const owner = { username: 'fixture-owner', password: 'synthetic-browser-owner-password-00000' };
export const token = 'synthetic-backend-owner-token-0000000000';
export const fixtureOrigin = 'http://127.0.0.1:4337';
export async function startApiFixture() {
  let records, mode, calls, posts;
  const reset = () => {
    mode = 'normal'; calls = 0;
    posts = structuredClone(blogPosts);
    records = [42, 9376, ...Array.from({ length: 30 }, (_, i) => 200000000000001 + i)].map((code, index) => ({
      _id: (index + 1).toString(16).padStart(24, '0'), short_url: code,
      original_url: `https://example.com/fixture-${index}`, creation_date: '2026-01-01T00:00:00.000Z',
    }));
  };
  reset();
  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    const url = new URL(req.url, fixtureOrigin);
    const reply = (status, value) => { res.statusCode = status; res.end(JSON.stringify(value)); };
    const error = (status) => reply(status, { error: 'Fixture request failed', code: 'FIXTURE_FAILURE' });
    if (url.pathname === '/__reset') { reset(); return reply(200, {}); }
    if (url.pathname === '/__mode') { mode = url.searchParams.get('value'); return reply(200, {}); }
    if (url.pathname === '/__stats') return reply(200, { calls });
    calls++;
    if (url.pathname.startsWith('/blog-assets/')) {
      res.setHeader('Content-Type', 'image/png');
      return res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64'));
    }
    if (url.pathname === '/api/blog' || url.pathname.startsWith('/api/blog/')) {
      if (mode === 'blog-failure') return error(503);
      if (mode === 'blog-malformed') return reply(200, { invalid: true });
      const administrative = url.pathname.startsWith('/api/blog/admin') || req.method !== 'GET';
      if (administrative && req.headers.authorization !== `Bearer ${token}`) return error(401);
      const list = url.pathname === '/api/blog/admin' || (url.pathname === '/api/blog' && req.method === 'GET');
      if (list) {
        let selected = posts.filter(post => (!url.searchParams.get('language') || post.language === url.searchParams.get('language')) &&
          (!administrative ? post.status === 'published' && Date.parse(post.publishedAt) <= Date.now() : !url.searchParams.get('status') || post.status === url.searchParams.get('status')));
        selected.sort((a, b) => url.searchParams.get('sort') === 'publishedAt' ? b.publishedAt.localeCompare(a.publishedAt) : a.slug.localeCompare(b.slug));
        const page = Number(url.searchParams.get('page') || 1), limit = Number(url.searchParams.get('limit') || 25);
        const data = selected.slice((page - 1) * limit, page * limit).map(({ content, ...post }) => post);
        return reply(200, { data, pagination: { page, limit, total: selected.length, pages: Math.ceil(selected.length / limit) } });
      }
      if (req.method === 'POST' || req.method === 'PATCH') {
        let text = '';
        for await (const chunk of req) text += chunk;
        const body = JSON.parse(text);
        if (mode === 'blog-validation') return reply(422, { errors: { title: `Private ${token}` } });
        const id = req.method === 'PATCH' ? url.pathname.slice('/api/blog/'.length) : (posts.length + 100).toString(16).padStart(24, '0');
        const existing = posts.find(post => post.id === id);
        if (req.method === 'PATCH' && !existing) return error(404);
        if (posts.some(post => post.slug === body.slug && post.id !== id)) return reply(409, { error: 'Private duplicate detail' });
        const now = new Date().toISOString();
        const post = { ...existing, ...body, id, readingMinutes: 1, createdAt: existing?.createdAt || now, updatedAt: now };
        if (body.status === 'published' && !post.publishedAt) post.publishedAt = now;
        posts = posts.filter(item => item.id !== id).concat(post);
        return reply(req.method === 'POST' ? 201 : 200, post);
      }
      if (req.method === 'DELETE') {
        const id = url.pathname.slice('/api/blog/'.length);
        if (!posts.some(post => post.id === id)) return error(404);
        posts = posts.filter(post => post.id !== id);
        res.statusCode = 204;
        return res.end();
      }
      if (url.pathname.startsWith('/api/blog/admin/')) {
        const post = posts.find(post => post.id === url.pathname.slice('/api/blog/admin/'.length));
        return post ? reply(200, post) : error(404);
      }
      const slug = decodeURIComponent(url.pathname.slice('/api/blog/'.length));
      const post = posts.find(post => post.slug === slug && post.status === 'published' && Date.parse(post.publishedAt) <= Date.now());
      return post ? reply(200, post) : error(404);
    }
    if (url.pathname.startsWith('/api/github/getCommits/')) {
      const word = decodeURIComponent(url.pathname.slice('/api/github/getCommits/'.length));
      if (word === 'upstreamfail') return error(502);
      const commit = {
        author: null,
        commit: { message: word === 'htmltest' ? '<img data-attack="yes" src=x onerror=alert(1)> htmltest' : `Fixture result ${word}`, author: { name: 'Fixture Author', date: '2026-01-01T00:00:00Z' } },
        repository: { name: 'fixture-repository', description: 'Synthetic fixture', html_url: 'https://example.com/repository' },
        html_url: 'https://example.com/commit',
      };
      const result = { total_count: word === 'nomatches' ? 0 : 1, incomplete_results: false, items: word === 'nomatches' ? [] : [commit] };
      if (word === 'slowsearch') return setTimeout(() => reply(200, result), 500);
      return reply(200, result);
    }
    if (mode === 'db-failure') return error(503);
    const lookup = /^\/api\/url\/(\d+)$/.exec(url.pathname);
    if (lookup && req.method === 'GET') {
      const record = records.find(item => item.short_url === Number(lookup[1]));
      return record ? reply(200, record) : error(404);
    }
    if (req.headers.authorization !== `Bearer ${token}`) return error(401);
    if (url.pathname === '/api/url' && req.method === 'GET') {
      const filtered = records.filter(item => !url.searchParams.get('after') || item._id > url.searchParams.get('after'));
      const data = filtered.slice(0, 25);
      return reply(200, { error: false, message: 'URLs found', data, pagination: { limit: 25, next: filtered.length > 25 ? data.at(-1)._id : null } });
    }
    if (url.pathname === '/api/url/create' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const { original_url } = JSON.parse(body);
      let record = records.find(item => item.original_url === original_url);
      if (!record) {
        record = { _id: (records.length + 100).toString(16).padStart(24, '0'), original_url, short_url: 200000000000100 + records.length, creation_date: '2026-01-01T00:00:00Z' };
        records.push(record);
      }
      return reply(200, record);
    }
    const deleting = /^\/api\/url\/delete\/(\d+)$/.exec(url.pathname);
    if (deleting && req.method === 'DELETE') {
      const record = records.find(item => item.short_url === Number(deleting[1]));
      if (!record) return error(404);
      records = records.filter(item => item !== record);
      return reply(200, record);
    }
    return error(404);
  });
  await new Promise(resolve => server.listen(4337, '127.0.0.1', resolve));
  return { close: () => { server.closeAllConnections(); return new Promise(resolve => server.close(resolve)); } };
}
