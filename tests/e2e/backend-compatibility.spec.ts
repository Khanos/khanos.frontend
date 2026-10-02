import { expect, test } from '@playwright/test';

const fixtureOrigin = 'http://127.0.0.1:4337';
const owner = { username: 'fixture-owner', password: 'synthetic-browser-owner-password-00000' };
test.beforeEach(async ({ request }) => { await request.get(`${fixtureOrigin}/__reset`); });

test('anonymous callers cannot reach the owner page or relay backend administration', async ({ request }) => {
  for (const path of ['/url', '/url/', '/api/url-admin', '/api/url-admin/delete/0042']) {
    const response = await request.get(path);
    expect(response.status()).toBe(401);
    expect(response.headers()['www-authenticate']).toMatch(/^Basic/);
    expect(response.headers()['cache-control']).toBe('no-store');
  }
  const before = await (await request.get(`${fixtureOrigin}/__stats`)).json();
  expect((await request.post('/api/url-admin/create', { data: { original_url: 'https://example.com/anonymous' } })).status()).toBe(401);
  expect((await (await request.get(`${fixtureOrigin}/__stats`)).json()).calls).toBe(before.calls);
});

test('owner mutations require a same-origin request and validate bodies', async ({ playwright }) => {
  const request = await playwright.request.newContext({ baseURL: 'http://127.0.0.1:4335', httpCredentials: { ...owner, send: 'always' } });
  expect((await request.post('/api/url-admin/create', { data: { original_url: 'https://example.com' } })).status()).toBe(403);
  expect((await request.delete('/api/url-admin/delete/42', { headers: { Origin: 'https://other.example' } })).status()).toBe(403);
  expect((await request.post('/api/url-admin/create', { headers: { Origin: 'http://127.0.0.1:4335', 'Content-Type': 'application/json' }, data: '{' })).status()).toBe(400);
  await request.dispose();
});

test('entering owner administration from Lab starts a fresh document without tracking', async ({ browser }) => {
  const context = await browser.newContext({ httpCredentials: owner });
  const page = await context.newPage();
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await page.goto('/?lang=en');
  await page.evaluate(() => { (window as any).__publicPageMarker = true; });
  const ownerLink = page.locator('#lab a[href="/url?lang=en"]');
  await expect(ownerLink).toHaveAttribute('data-astro-reload', 'true');
  await ownerLink.focus();
  await ownerLink.press('Enter');
  await expect(page.locator('tbody tr')).toHaveCount(25);
  expect(await page.evaluate(() => (window as any).__publicPageMarker)).toBeUndefined();
  await expect(page.locator('html')).toHaveAttribute('data-owner-page', 'true');
  expect(await page.content()).not.toContain('googletagmanager.com/ns.html');
  await context.close();
});

for (const lang of ['en', 'es']) {
  test(`owner lists all pages, creates, copies and deletes mappings (${lang})`, async ({ browser }) => {
    const context = await browser.newContext({ httpCredentials: owner, permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    const errors: string[] = [];
    const trackerRequests: string[] = [];
    page.on('pageerror', () => errors.push('pageerror'));
    page.on('request', request => { if (new URL(request.url()).hostname.includes('googletagmanager')) trackerRequests.push('tracker'); });
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await page.goto(`/url?lang=${lang}`);
    await expect(page.locator('tbody tr')).toHaveCount(25);
    expect(trackerRequests).toEqual([]);
    await expect(page.locator('html')).toHaveAttribute('data-owner-page', 'true');
    await page.getByRole('button', { name: lang === 'en' ? 'Load more' : 'Cargar más', exact: true }).click();
    await expect(page.locator('tbody tr')).toHaveCount(32);
    await expect(page.getByRole('button', { name: lang === 'en' ? 'Load more' : 'Cargar más' })).toHaveCount(0);
    await page.locator('#search').fill('https://example.com/created-in-browser');
    await page.getByRole('button', { name: lang === 'en' ? 'Shorten' : 'Acortar', exact: true }).click();
    const row = page.locator('tbody tr').filter({ hasText: 'https://example.com/created-in-browser' });
    await expect(row).toHaveCount(1);
    await row.getByRole('button', { name: lang === 'en' ? 'Copy' : 'Copiar', exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/^https:\/\/epilef.app\/\d{15}$/);
    await row.getByRole('button', { name: lang === 'en' ? 'Delete' : 'Eliminar', exact: true }).click();
    await expect(row).toHaveCount(0);
    expect(errors).toEqual([]);
    await context.close();
  });

  test(`backend errors leave the owner UI usable (${lang})`, async ({ browser, request }) => {
    await request.get(`${fixtureOrigin}/__mode?value=db-failure`);
    const context = await browser.newContext({ httpCredentials: owner });
    const page = await context.newPage();
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await page.goto(`/url?lang=${lang}`);
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.locator('#search')).toBeEnabled();
    await request.get(`${fixtureOrigin}/__mode?value=normal`);
    await page.getByRole('button', { name: lang === 'en' ? 'Retry' : 'Reintentar' }).click();
    await expect(page.locator('tbody tr')).toHaveCount(25);
    await expect(page.getByRole('alert')).toHaveCount(0);
    await context.close();
  });

  test(`GitHub clears stale results, encodes literal text and displays failures (${lang})`, async ({ page }) => {
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await page.goto(`/github?lang=${lang}`);
    await expect(page.locator('h3')).toContainText('Fixture Author');
    const search = async (word: string) => { await page.locator('#search').fill(word); await page.locator('#search').press('Enter'); };
    await search('nomatches');
    await expect(page.locator('h3')).toHaveCount(0);
    await expect(page.getByRole('status')).toContainText(lang === 'en' ? 'No commits found.' : 'No se encontraron commits.');
    await search('fix[parser]/?bug#');
    await expect(page.locator('h3')).toHaveCount(1);
    await expect(page.locator('main')).toContainText('Fixture result fix[parser]/?bug#');
    await search('upstreamfail');
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.locator('h3')).toHaveCount(0);
    await search('htmltest');
    await expect(page.locator('main')).toContainText('<img data-attack="yes" src=x onerror=alert(1)> htmltest');
    await expect(page.locator('[data-attack]')).toHaveCount(0);
  });
}

test('public short links support padded legacy and large codes with truthful missing/dependency outcomes', async ({ request }) => {
  for (const [code, destination] of [['0042', 'fixture-0'], ['9376', 'fixture-1'], ['200000000000001', 'fixture-2']]) {
    const response = await request.get(`/${code}`, { maxRedirects: 0 });
    expect(response.status()).toBe(302);
    expect(response.headers().location).toBe(`https://example.com/${destination}`);
    expect(response.headers()['cache-control']).toBe('no-store');
  }
  expect((await request.get('/9999', { maxRedirects: 0 })).headers().location).toBe('/');
  expect((await request.get('/9007199254740992', { maxRedirects: 0 })).headers().location).toBe('/');
  await request.get(`${fixtureOrigin}/__mode?value=db-failure`);
  const unavailable = await request.get('/9376', { maxRedirects: 0 });
  expect(unavailable.status()).toBe(503);
  expect(unavailable.headers()['cache-control']).toBe('no-store');
});
