import { expect, test } from '@playwright/test';
const fixtureOrigin = 'http://127.0.0.1:4337';
const settlePage = async (page: import('@playwright/test').Page) => {
  await expect(page.locator('html')).not.toHaveAttribute('data-astro-transition');
  await page.evaluate(() => document.fonts.ready);
};
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
    await expect(page.locator('main a[href="/blog?lang=' + language + '"]').first()).toBeVisible();
  });
}
test('missing articles return 404 and backend failures return uncached 503', async ({ request }) => {
  expect((await request.get('/blog/en/missing')).status()).toBe(404);
  expect((await request.get('/blog/fr/invalid')).status()).toBe(404);
  expect((await request.get('/blog?page=invalid')).status()).toBe(400);
  for (const mode of ['blog-failure', 'blog-malformed']) {
    await request.get(`${fixtureOrigin}/__mode?value=${mode}`);
    for (const path of ['/blog?lang=en', '/blog/en/6-state-of-devs-2026-ai-workflow']) {
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

for (const language of ['en', 'es']) {
  for (const theme of ['light', 'dark']) {
    test(`editorial Writing is readable and consistent: ${language}, ${theme}`, async ({ page, request }, testInfo) => {
      await request.get(`${fixtureOrigin}/__mode?value=blog-editorial`);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(theme => localStorage.setItem('theme', theme), theme);
      for (const width of [390, 768, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(`/blog?lang=${language}`);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('h1')).toHaveText(language === 'es' ? 'Artículos' : 'Writing');
        await expect(page.locator('.journal-featured')).toHaveCount(1);
        await expect(page.locator('.journal-featured time')).toHaveAttribute('datetime', '2026-06-01T00:00:00.000Z');
        await expect(page.locator('#nav-menu [aria-current="page"]')).toHaveText(language === 'es' ? 'Artículos' : 'Writing');
        await expect(page.locator('.portfolio-wordmark')).toBeVisible();
        const contrasts = await page.evaluate(() => {
          const style = getComputedStyle(document.documentElement);
          const luminance = (name: string) => {
            const hex = style.getPropertyValue(name).trim().slice(1);
            const [r, g, b] = [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
            return .2126 * r + .7152 * g + .0722 * b;
          };
          return ['--folio-text', '--folio-secondary', '--folio-muted', '--folio-accent'].flatMap(ink => ['--folio-bg', '--folio-surface'].map(surface => {
            const pair = [luminance(ink), luminance(surface)].sort((a, b) => b - a);
            return (pair[0] + .05) / (pair[1] + .05);
          }));
        });
        for (const contrast of contrasts) expect(contrast).toBeGreaterThanOrEqual(4.5);
        await page.locator('.dropdown > button').click();
        const menu = await page.locator('#site-settings').boundingBox();
        expect(menu!.x + menu!.width).toBeLessThanOrEqual(width);
        await page.keyboard.press('Escape');
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
        expect(await page.locator('.journal-container').evaluate(node => node.getBoundingClientRect().width)).toBeLessThanOrEqual(1280);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://epilef.app/blog${language === 'es' ? '?lang=es' : ''}`);
        await settlePage(page);
        await page.screenshot({ path: testInfo.outputPath(`listing-${width}.png`), fullPage: true });
        await page.locator('.journal-featured .journal-card-title a').click();
        await expect(page).toHaveURL(new RegExp(`/blog/${language}/6-state-of-devs`));
        await settlePage(page);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('#nav-menu [data-section-link="writing"]')).toHaveAttribute('aria-current', 'page');
        await expect(page.locator('.journal-prose h2').first()).toHaveText('A field note');
        await expect(page.locator('.hljs-keyword')).toBeVisible();
        await expect(page.locator('pre[tabindex="0"]')).toBeVisible();
        const code = page.locator('pre');
        expect(await code.evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true);
        await code.focus();
        await expect(code).toBeFocused();
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
        const prose = await page.locator('.journal-prose').evaluate(node => ({ width: node.getBoundingClientRect().width, max: getComputedStyle(node).maxWidth, font: parseFloat(getComputedStyle(node).fontSize), family: getComputedStyle(node).fontFamily }));
        expect(prose.font).toBeGreaterThanOrEqual(16);
        expect(prose.width).toBeLessThanOrEqual(parseFloat(prose.max));
        const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() || '{}');
        expect(schema['@type']).toBe('BlogPosting');
        expect(schema.inLanguage).toBe(language);
        expect(schema.author).toBeUndefined();
        expect(schema.url).toContain(`/blog/${language}/6-state-of-devs`);
        await expect(page.locator('.journal-related .journal-card-title').first()).toHaveJSProperty('tagName', 'H3');
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: testInfo.outputPath(`article-${width}.png`), fullPage: true });
        // Both shells must use the same rendered palette and header geometry.
        const articleShell = await page.locator('body > header').evaluate(node => ({ background: getComputedStyle(document.body).backgroundColor, padding: getComputedStyle(node).paddingInline, border: getComputedStyle(node).borderBottomColor }));
        await page.goto(`/?lang=${language}`);
        const homeShell = await page.locator('body > header').evaluate(node => ({ background: getComputedStyle(document.body).backgroundColor, padding: getComputedStyle(node).paddingInline, border: getComputedStyle(node).borderBottomColor }));
        expect(articleShell).toEqual(homeShell);
      }
    });
  }
}

test('pagination, empty archives and missing optional metadata remain usable', async ({ page, request }) => {
  await request.get(`${fixtureOrigin}/__mode?value=blog-many`);
  await page.goto('/blog?lang=en');
  await expect(page.locator('.journal-card')).toHaveCount(25);
  await page.getByRole('link', { name: 'Next' }).click();
  await expect(page.locator('.journal-card')).toHaveCount(3);
  await expect(page.locator('.journal-featured')).toHaveCount(0);
  await expect(page).toHaveTitle('Writing | khanos_ · Page 2');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://epilef.app/blog?page=2');
  await page.getByRole('link', { name: 'Previous' }).click();
  await expect(page.locator('.journal-card')).toHaveCount(25);
  await request.get(`${fixtureOrigin}/__mode?value=blog-empty`);
  await page.goto('/blog?lang=es');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.journal-empty')).toBeVisible();
  await request.get(`${fixtureOrigin}/__reset`);
  await request.get(`${fixtureOrigin}/__mode?value=blog-minimal`);
  await page.goto('/blog?lang=en');
  await expect(page.locator('.journal-card img')).toHaveCount(0);
  await page.locator('.journal-featured .journal-card-title a').click();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.journal-hero, .journal-category, .journal-related')).toHaveCount(0);
});

test('settings preserve language and theme across homepage, index and article navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript(() => { if (!localStorage.getItem('theme')) { localStorage.setItem('lang', 'en'); localStorage.setItem('theme', 'dark'); } });
  await page.goto('/blog?lang=es');
  await page.locator('.dropdown > button').click();
  await expect(page.locator('#site-settings input').nth(1)).not.toBeChecked();
  await page.locator('#site-settings label').first().click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.keyboard.press('Escape');
  await expect(page.locator('.dropdown > button')).toBeFocused();
  await page.locator('.journal-featured .journal-card-title a').click();
  await expect(page).toHaveURL(/\/blog\/es\/6-state-of-devs/);
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.locator('.dropdown > button').click();
  await page.locator('#site-settings label').nth(1).click();
  await expect(page).toHaveURL(/\/blog\/en\/6-state-of-devs.*lang=en/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://epilef.app/blog/en/6-state-of-devs-2026-ai-workflow');
  await page.locator('.journal-back').click();
  await expect(page.locator('h1')).toHaveText('Writing');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});
