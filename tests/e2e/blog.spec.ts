import { expect, test } from '@playwright/test';
const fixtureOrigin = 'http://127.0.0.1:4337';
test.beforeEach(async ({ page, request }) => {
  await request.get(`${fixtureOrigin}/__reset`);
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});
for (const language of ['en', 'es']) {
  test(`API blog preserves ${language} list, article URLs, metadata and safe charts`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    const response = await page.goto(`/blog?lang=${language}`);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['cache-control']).toContain('s-maxage=60');
    await expect(page.locator('main article')).toHaveCount(6);
    await page.locator(`a[href="/blog/${language}/6-state-of-devs-2026-ai-workflow"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`/blog/${language}/6-state-of-devs-2026-ai-workflow$`));
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('title')).toHaveCount(1);
    await expect(page).toHaveTitle(`${language === 'en' ? 'Article' : 'Artículo'} 6`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', `${language === 'en' ? 'Article' : 'Artículo'} 6`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://epilef.app/blog/${language}/6-state-of-devs-2026-ai-workflow`);
    await expect(page.locator('main .prose strong').first()).toHaveText('useful');
    await expect(page.locator('[data-chart="code"]')).toBeVisible();
    await page.locator('.chart-row').focus();
    await expect(page.locator('.chart-tooltip')).toBeVisible();
    expect(await page.locator('.bar-fill').evaluate(node => (node as HTMLElement).style.width)).toBe('50%');
    expect(await page.evaluate(() => (window as any).__blogAttack)).toBeUndefined();
    await expect(page.locator('main script, main [onerror]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await expect(page.locator('main a[href="/blog?lang=' + language + '"]')).toBeVisible();
  });
}
test('missing articles return 404 and backend failures return uncached 503', async ({ request }) => {
  expect((await request.get('/blog/en/missing')).status()).toBe(404);
  expect((await request.get('/blog/fr/invalid')).status()).toBe(404);
  expect((await request.get('/blog?page=invalid')).status()).toBe(400);
  for (const mode of ['blog-failure', 'blog-malformed']) {
    await request.get(`${fixtureOrigin}/__mode?value=${mode}`);
    for (const path of ['/blog?lang=en', '/blog/en/6-state-of-devs-2026-ai-workflow', '/?lang=en']) {
      const response = await request.get(path);
      expect(response.status()).toBe(503);
      expect(response.headers()['cache-control']).toBe('no-store');
    }
  }
});

test('dynamic sitemap lists both languages from API data', async ({ request }) => {
  const response = await request.get('/blog-sitemap.xml');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/xml');
  const xml = await response.text();
  expect(xml.match(/<loc>/g)).toHaveLength(12);
  expect(xml).toContain('https://epilef.app/blog/en/6-state-of-devs-2026-ai-workflow');
  expect(xml).toContain('https://epilef.app/blog/es/6-state-of-devs-2026-ai-workflow');
});
