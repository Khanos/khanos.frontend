import { expect, test } from '@playwright/test';

const recentCompanies = ['Kenect', 'Achieve', 'Mercado Libre S.L.R.', 'CENORA LLC.', 'ITPex Studio LLC.'];
const earlierCompanies = ['Calvary Robotics LLC.', 'Look At Me Ventures LLC.', 'MediaTrax LLC.', 'MobyDev', 'PDVSA Industrial, S.A.'];

for (const lang of ['en', 'es']) {
  for (const width of [390, 768, 1440, 1920]) {
    test(`experience is readable and complete without JavaScript: ${lang}, ${width}px`, async ({ browser, request }) => {
      await request.get('http://127.0.0.1:4337/__reset');
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
      await page.goto(`/?lang=${lang}`);
      const section = page.locator('#experience');
      await expect(section.getByRole('heading', { level: 2 })).toHaveText(lang === 'en' ? 'Professional Experience' : 'Experiencia profesional');
      await expect(section.getByRole('heading', { level: 3 })).toHaveText(lang === 'en'
        ? ['Recent Experience', 'Earlier Experience'] : ['Experiencia reciente', 'Experiencia anterior']);
      await expect(section.locator('.experience-recent .experience-company')).toHaveText(recentCompanies);
      await expect(section.locator('.experience-earlier .experience-company')).toHaveText(earlierCompanies);
      await expect(section.getByRole('heading', { level: 4 })).toHaveCount(10);
      const current = section.locator('article').first();
      await expect(current).toHaveClass(/experience-current/);
      await expect(current.locator('h4')).toHaveText(lang === 'en' ? 'Full-Stack Software Engineer' : 'Ingeniero de Software Full-Stack');
      await expect(current).toContainText('Jobsity');
      await expect(current.locator('.experience-date')).toHaveText(lang === 'en' ? 'October 2024 – Present' : 'Octubre de 2024 – Actualidad');
      await expect(current.getByRole('link')).toHaveAttribute('href', 'https://www.kenect.com');
      await expect(section.locator('.experience-date')).toHaveText([
        lang === 'en' ? 'October 2024 – Present' : 'Octubre de 2024 – Actualidad',
        '2024', '2022 - 2023', '2022', '2021 - 2022', '2020 - 2021', '2017 - 2021', '2016', '2016', '2012 - 2016',
      ]);
      if (lang === 'en') {
        await expect(section.locator('.experience-intro')).toHaveText('Over a decade of building production software across SaaS, e-commerce, fintech, marketing technology, and industrial systems. My experience spans frontend architecture, backend development, API integrations, and technical leadership across international teams.');
      }
      await expect(section).not.toContainText(/AI-assisted|asistidos por IA/);
      await expect(section.locator('details')).toHaveCount(0);
      const links = section.getByRole('link');
      await expect(links).toHaveCount(9);
      for (const link of await links.all()) {
        await expect(link).not.toHaveText(/^(Company website|Web de la empresa)$/);
      }
      const calvary = section.locator('article').filter({ hasText: 'Calvary Robotics LLC.' });
      await expect(calvary).toContainText('Invio Automation');
      await expect(calvary.getByRole('link')).toHaveAttribute('href', 'https://invioautomation.com/');
      // History is visible in both themes; compact rows retain body-size prose.
      for (const dark of [true, false]) {
        await page.evaluate(dark => document.documentElement.classList.toggle('dark', dark), dark);
        for (const description of await section.locator('.experience-contribution > p').all()) {
          await expect(description).toBeVisible();
          expect(await description.evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
        const lowContrast = await section.evaluate(section => {
          const rgb = (value: string) => (value.match(/[\d.]+/g) ?? []).map(Number);
          const luminance = (color: number[]) => color.slice(0, 3).map(value => {
            value /= 255;
            return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
          }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
          return Array.from(section.querySelectorAll('h3, h4, p, a')).flatMap(element => {
            let ancestor: Element | null = element;
            let background: number[] = [];
            while (ancestor) {
              const candidate = rgb(getComputedStyle(ancestor).backgroundColor);
              if (candidate.length === 3 || candidate[3] === 1) { background = candidate; break; }
              ancestor = ancestor.parentElement;
            }
            const foreground = luminance(rgb(getComputedStyle(element).color));
            const behind = luminance(background);
            const ratio = (Math.max(foreground, behind) + .05) / (Math.min(foreground, behind) + .05);
            return ratio >= 4.5 ? [] : [{ text: element.textContent, ratio }];
          });
        });
        expect(lowContrast).toEqual([]);
        const link = links.first();
        await link.focus();
        await expect(link).toBeFocused();
        expect(await link.evaluate(element => getComputedStyle(element).outlineStyle)).toBe('solid');
        expect(await link.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
        await current.screenshot({ path: `test-results/experience-current-${lang}-${width}-${dark ? 'dark' : 'light'}.png`,
          style: 'header, .skip-link { display: none !important; } a { outline: none !important; }' });
        await section.screenshot({ path: `test-results/experience-${lang}-${width}-${dark ? 'dark' : 'light'}.png`,
          style: 'header, .skip-link { display: none !important; } a { outline: none !important; }' });
      }
      await context.close();
    });
  }
}
