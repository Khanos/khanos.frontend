import { expect, test } from "@playwright/test";

// Keep the portfolio smoke tests independent of analytics and external services.
test.beforeEach(async ({ page, request }) => {
  await request.get('http://127.0.0.1:4337/__reset');
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    return url.hostname === "127.0.0.1" ? route.continue() : route.abort();
  });
});

test("homepage separates writing from experiments and preserves article links", async ({
  page,
}) => {
  await page.goto("/?lang=en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Senior Full-Stack Engineer",
  );
  expect(
    await page
      .locator("main section[id]")
      .evaluateAll((sections) => sections.map((section) => section.id)),
  ).toEqual(["home", "projects", "experience", "expertise", "lab", "writing", "contact"]);
  const writing = page.locator("#writing");
  await expect(writing.locator("article")).toHaveCount(3);
  const dates = await writing
    .locator("time")
    .evaluateAll((times) =>
      times.map((time) => Date.parse(time.getAttribute("datetime")!)),
    );
  expect(dates).toEqual([...dates].sort((a, b) => b - a));
  await expect(page.locator("#lab article")).toHaveCount(8);
  await expect(page.locator('#lab a[href*="/blog"]')).toHaveCount(0);
  for (const href of await writing
    .locator("article a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!))) {
    expect((await page.request.get(href)).status()).toBe(200);
  }
  await writing.locator("article a").first().click();
  await expect(page).toHaveURL(/\/blog\/en\//);
  await expect(page.locator("main .prose")).toBeVisible();
});

test("Spanish homepage translates Writing and links to Spanish articles", async ({
  page,
}) => {
  await page.goto("/?lang=es");
  const writing = page.locator("#writing");
  await expect(writing.getByRole("heading", { level: 2 })).toHaveText(
    "Artículos técnicos",
  );
  await expect(
    writing.getByRole("link", { name: "Ver todos los artículos" }),
  ).toHaveAttribute("href", "/blog?lang=es");
  await expect(writing.locator("article")).toHaveCount(3);
  for (const link of await writing.locator("article a").all()) {
    await expect(link).toHaveAttribute("href", /^\/blog\/es\//);
    await expect(link).toContainText("Leer artículo");
    await expect(link).toContainText("min de lectura");
  }
  await writing.getByRole("link", { name: "Ver todos los artículos" }).click();
  await expect(page).toHaveURL(/\/blog\?lang=es$/);
  const links = page.locator('#blog a[href^="/blog/"]');
  expect(await links.count()).toBeGreaterThan(0);
  for (const link of await links.all())
    await expect(link).toHaveAttribute("href", /^\/blog\/es\//);
});

test("navigation reaches sections and updates the active state", async ({
  page,
}) => {
  await page.goto("/?lang=en");
  await expect(page.locator('[data-section-link="home"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
  for (const id of ["projects", "experience", "lab", "writing", "contact"]) {
    const link = page.locator(`[data-section-link="${id}"]`);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(link).toHaveAttribute("aria-current", "location");
  }
});

for (const width of [1920, 1440, 1024, 768, 390, 375]) {
  test(`homepage fits the ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/?lang=en");
    await expect(page.locator("#writing article")).toHaveCount(3);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    const cards = await page.locator("#writing article").evaluateAll((cards) =>
      cards.map((card) => {
        const { x, y, width } = card.getBoundingClientRect();
        return { x, y, width };
      }),
    );
    if (width >= 1024) {
      expect(cards[1].x).toBeGreaterThan(cards[0].x + cards[0].width);
      expect(Math.abs(cards[1].y - cards[0].y)).toBeLessThan(2);
    } else {
      expect(cards[1].y).toBeGreaterThan(cards[0].y);
      expect(cards[2].y).toBeGreaterThan(cards[1].y);
    }
    const writingLink = page.locator('[data-section-link="writing"]');
    await expect(writingLink).toBeVisible();
    await writingLink.click();
    await expect(writingLink).toHaveAttribute("aria-current", "location");
  });
}

for (const lang of ["en", "es"]) {
  for (const width of [375, 768, 1024, 1440]) {
    test(`Lab carousel: ${lang}, ${width}px, light and dark`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/?lang=${lang}`);
      const lab = page.locator("#lab");
      const track = lab.locator(".lab-track");
      const cards = track.locator("article");
      const range = lab.locator(".range");
      const visibleCount = width >= 1024 ? 3 : width >= 640 ? 2 : 1;
      const expectedRange = (first: number, last: number) => lang === "en"
        ? `Showing ${first}–${last} of 8` : `Mostrando ${first}–${last} de 8`;
      const previous = lab.getByRole("button", { name: lang === "en" ? "Previous projects" : "Proyectos anteriores" });
      const next = lab.getByRole("button", { name: lang === "en" ? "Next projects" : "Proyectos siguientes" });
      await expect(cards).toHaveCount(8);
      await expect(lab.locator(".experiment-copy h3")).toHaveText([
        lang === "en" ? "Invoice Editor" : "Editor de facturas", "oVitals", "Wallapibara", "PNG to SVG", "Local Image Studio",
        lang === "en" ? "SVG to Component" : "SVG a Componente",
        "GitHub API Demo", lang === "en" ? "URL Shortener" : "Acortador de URL",
      ]);
      await expect(range).toHaveText(expectedRange(1, visibleCount));
      const repos = ["khanos-invoice-public", "ovitals", "wallapibara", "png-to-svg", "local-image-studio"];
      for (let i = 0; i < repos.length; i++) {
        const link = cards.nth(i).locator(".project-link");
        await expect(link).toHaveAttribute("href", `https://github.com/Khanos/${repos[i]}`);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
        await expect(link).toHaveAccessibleName(new RegExp(lang === "en" ? "View repository" : "Ver repositorio"));
      }
      for (const [index, path] of ["svgToComponent", "github"].entries()) {
        const link = cards.nth(index + 5).locator(".project-link");
        await expect(link).toHaveAttribute("href", `/${path}?lang=${lang}`);
        await expect(link).not.toHaveAttribute("target", "_blank");
      }
      const live = cards.nth(2).getByRole("link", { name: new RegExp(lang === "en" ? "Live site" : "Ver sitio") });
      await expect(live).toHaveAttribute("href", "https://wallapibara.epilef.app/");
      await expect(live).toHaveAttribute("target", "_blank");
      await expect(live).toHaveAttribute("rel", /noopener/);
      await expect(live.locator("a")).toHaveCount(0);
      for (const card of await cards.all()) {
        await card.scrollIntoViewIfNeeded();
        await expect.poll(() => card.locator(".preview img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        await expect(card.locator(".preview img")).not.toHaveAttribute("alt", "");
        expect(await card.locator(".tags li").count()).toBeGreaterThanOrEqual(3);
      }
      for (const dark of [false, true]) {
        await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), dark);
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(dark ? "dark" : "light");
        await track.focus();
        await page.keyboard.press("Home");
        await expect(range).toHaveText(expectedRange(1, visibleCount));
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
        const dimensions = await track.evaluate((track) => {
          const bounds = track.getBoundingClientRect();
          return Array.from(track.querySelectorAll("article")).map((card) => {
            const { x, width, height } = card.getBoundingClientRect();
            const tags = card.querySelector(".tags")!;
            return { height, tagsFit: tags.scrollWidth <= tags.clientWidth,
              fullyVisible: x >= bounds.x - 1 && x + width <= bounds.right + 1 };
          });
        });
        expect(dimensions.filter((card) => card.fullyVisible)).toHaveLength(visibleCount);
        expect(dimensions.every((card) => card.tagsFit)).toBe(true);
        expect(Math.max(...dimensions.map((card) => card.height)) - Math.min(...dimensions.map((card) => card.height))).toBeLessThan(2);
        expect(dimensions.every((card) => card.height < 570)).toBe(true);
        await next.click();
        await expect(range).toHaveText(expectedRange(2, visibleCount + 1));
        await previous.click();
        await expect(range).toHaveText(expectedRange(1, visibleCount));
        await previous.click();
        await expect(range).toHaveText(expectedRange(9 - visibleCount, 8));
        await next.click();
        await expect(range).toHaveText(expectedRange(1, visibleCount));
        await track.focus();
        await page.keyboard.press("End");
        await expect(range).toHaveText(expectedRange(9 - visibleCount, 8));
        await page.keyboard.press("ArrowRight");
        await expect(range).toHaveText(expectedRange(1, visibleCount));
        for (const card of await cards.all()) {
          await page.keyboard.press("Tab");
          await expect(card.locator(".project-link")).toBeFocused();
          await expect.poll(() => card.evaluate((card) => {
            const bounds = card.parentElement!.getBoundingClientRect();
            const own = card.getBoundingClientRect();
            return own.x >= bounds.x - 1 && own.right <= bounds.right + 1;
          })).toBe(true);
          expect(await card.locator(".project-link").evaluate((link) => getComputedStyle(link, link.tagName === "BUTTON" ? "::after" : null).outlineStyle)).toBe("solid");
          expect(await card.evaluate((card) => getComputedStyle(card).transform)).toBe("none");
          if (await card.locator(".live-link").count()) {
            await page.keyboard.press("Tab");
            await expect(card.locator(".live-link")).toBeFocused();
            const overlap = await card.evaluate((card) => {
              const repository = card.querySelector(".action")!.getBoundingClientRect();
              const site = card.querySelector(".live-link")!.getBoundingClientRect();
              return repository.right > site.left;
            });
            expect(overlap).toBe(false);
          }
        }
        await track.focus();
        await page.keyboard.press("Home");
        await expect(range).toHaveText(expectedRange(1, visibleCount));
        await lab.screenshot({ path: `test-results/lab-carousel-${lang}-${width}-${dark ? "dark" : "light"}.png` });
      }
      expect(errors).toEqual([]);
    });
  }
}

test("carousel reconnects after blog navigation and preserves tool language", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?lang=es");
  await page.locator("#writing").getByRole("link", { name: "Ver todos los artículos" }).click();
  await expect(page).toHaveURL(/\/blog\?lang=es$/);
  await expect(page.locator("#blog")).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/\?lang=es$/);
  const lab = page.locator("#lab");
  await lab.getByRole("button", { name: "Proyectos siguientes" }).click();
  await expect(lab.locator(".range")).toContainText("Mostrando 2–");
  const tool = lab.locator('a[href="/svgToComponent?lang=es"]');
  await tool.focus();
  await tool.press("Enter");
  await expect(page).toHaveURL(/\/svgToComponent\?lang=es$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("SVG");
});

test("all eight Lab cards remain scrollable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
  const page = await context.newPage();
  await page.route("**/*", (route) => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
  await page.goto("/?lang=en");
  await expect(page.locator("#lab article")).toHaveCount(8);
  await expect(page.locator("#lab .carousel-controls")).toBeHidden();
  await page.locator("#lab article").last().scrollIntoViewIfNeeded();
  await expect(page.locator("#lab article").last()).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await context.close();
});

test("native touch scrolling reveals more cards and updates the range", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 900 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.route("**/*", (route) => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
  await page.goto("/?lang=en");
  const track = page.locator("#lab .lab-track");
  await expect(page.locator("#lab .range")).toHaveText("Showing 1–1 of 8");
  await track.scrollIntoViewIfNeeded();
  const bounds = (await track.boundingBox())!;
  const y = Math.min(bounds.y + 100, 800);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 310, y }] });
  for (const x of [270, 230, 190, 150, 110, 70]) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => track.evaluate((track) => track.scrollLeft)).toBeGreaterThan(100);
  await expect(page.locator("#lab .range")).not.toHaveText("Showing 1–1 of 8");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await context.close();
});

test("smooth controls and trackpad scrolling stay in sync across resize", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?lang=en");
  const lab = page.locator("#lab");
  const range = lab.locator(".range");
  await expect(range).toHaveText("Showing 1–3 of 8");
  await lab.getByRole("button", { name: "Next projects" }).click();
  await expect(range).toHaveText("Showing 2–4 of 8");
  const track = lab.locator(".lab-track");
  await track.hover();
  await page.mouse.wheel(350, 0);
  await expect(range).not.toHaveText("Showing 2–4 of 8");
  await page.setViewportSize({ width: 375, height: 900 });
  await track.focus();
  await page.keyboard.press("Home");
  await expect(range).toHaveText("Showing 1–1 of 8");
  await page.setViewportSize({ width: 768, height: 900 });
  await expect(range).toHaveText("Showing 1–2 of 8");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(range).toHaveText("Showing 1–3 of 8");
});

for (const lang of ['en', 'es']) {
  for (const width of [375, 390, 1440]) {
    test(`recruiter content and SEO work without JavaScript: ${lang}, ${width}px`, async ({ browser, request }) => {
      await request.get('http://127.0.0.1:4337/__reset');
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 812 } });
      const page = await context.newPage();
      await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
      const response = await page.goto(`/?lang=${lang}&utm_source=test`);
      expect(response?.status()).toBe(200);
      const title = lang === 'en' ? 'Epilef Rodriguez | Senior Full-Stack Engineer' : 'Epilef Rodriguez | Ingeniero Full-Stack Senior';
      const canonical = lang === 'en' ? 'https://epilef.app/' : 'https://epilef.app/?lang=es';
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('title')).toHaveCount(1);
      await expect(page).toHaveTitle(title);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText(lang === 'en' ? 'Senior Full-Stack Engineer' : 'Ingeniero Full-Stack Senior');
      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toContain('React, TypeScript, Node.js');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      for (const prefix of ['og', 'twitter']) {
        await expect(page.locator(`meta[property="${prefix}:title"]`)).toHaveAttribute('content', title);
        await expect(page.locator(`meta[property="${prefix}:description"]`)).toHaveAttribute('content', description!);
        await expect(page.locator(`meta[property="${prefix}:url"]`)).toHaveAttribute('content', canonical);
        await expect(page.locator(`meta[property="${prefix}:image"]`)).toHaveAttribute('content', /^https:\/\/epilef.app\//);
      }
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', 'https://epilef.app/');
      await expect(page.locator('link[hreflang="es"]')).toHaveAttribute('href', 'https://epilef.app/?lang=es');
      const person = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
      expect(person).toMatchObject({ '@type': 'Person', name: 'Epilef Rodriguez', homeLocation: { name: 'Spain' }, email: 'epilef.rodriguez@gmail.com' });
      expect(person).not.toHaveProperty('worksFor');
      expect(person.sameAs).toContain('https://github.com/Khanos');
      await expect(page.locator('#projects article')).toHaveCount(4);
      await expect(page.locator('#projects dt')).toHaveCount(12);
      await expect(page.locator('#project-achieve-platforms')).toContainText('Contentful');
      await expect(page.locator('#project-achieve-platforms')).toContainText('Bills.com');
      await expect(page.locator('#project-derfdice')).toContainText('Vue.js');
      await expect(page.locator('#project-derfdice dd')).toHaveCount(3);
      await expect(page.locator('#experience li')).toHaveCount(10);
      await expect(page.locator('#experience')).toContainText('Achieve');
      await expect(page.locator('#experience')).toContainText('2022 - 2023');
      await expect(page.locator('#expertise')).toContainText('PostgreSQL');
      await expect(page.locator('#contact')).not.toContainText('I work as a Frontend Engineer at MercadoLibre');
      await expect(page.locator('#home')).toContainText('Epilef Rodriguez');
      await expect(page.locator('#home a[href="https://linkedin.com/in/khanos"]')).toBeVisible();
      const contact = page.locator('#home a[href="mailto:epilef.rodriguez@gmail.com"]');
      await expect(contact).toBeInViewport({ ratio: 1 });
      await expect(page.locator('h1')).toBeInViewport({ ratio: 1 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      for (const image of await page.locator('main img').all()) await expect(image).not.toHaveAttribute('alt', '');
      await page.screenshot({ path: `test-results/homepage-${lang}-${width}.png` });
      await context.close();
    });
  }
}

test('homepage remains available when the optional article feed fails', async ({ page, request }) => {
  await request.get('http://127.0.0.1:4337/__mode?value=blog-failure');
  try {
    const response = await page.goto('/?lang=en');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['cache-control']).toBe('no-store');
    await expect(page.locator('h1')).toHaveText('Senior Full-Stack Engineer');
    await expect(page.locator('#projects article')).toHaveCount(4);
    await expect(page.locator('#writing')).toContainText('Articles are temporarily unavailable.');
    await expect(page.locator('#contact a[href^="mailto:"]')).toBeVisible();
  } finally {
    await request.get('http://127.0.0.1:4337/__reset');
  }
});

for (const lang of ['en', 'es']) {
  for (const width of [390, 768, 1440, 1920]) {
    test(`editorial presentation, themes and visible engineering narrative: ${lang}, ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`/?lang=${lang}`);
      await expect(page.locator('html')).toHaveClass(/dark/);
      const portrait = page.locator('.hero-portrait img');
      await expect(portrait).toBeVisible();
      await expect.poll(() => portrait.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      await expect(page.locator('#home .primary-action')).toBeInViewport({ ratio: 1 });
      await expect(page.locator('#home .hero-profiles a').last()).toHaveAttribute('href', /^mailto:epilef\.rodriguez@gmail\.com\?subject=/);
      await page.screenshot({ path: `test-results/editorial-hero-${lang}-${width}-dark.png` });
      const headerBottom = await page.locator('body > header').evaluate(element => element.getBoundingClientRect().bottom);
      const nameTop = await page.locator('.hero-topline').evaluate(element => element.getBoundingClientRect().top);
      expect(nameTop).toBeGreaterThan(headerBottom);
      const hero = page.locator('#home');
      await expect(hero).not.toContainText(/AI-Assisted Development|Desarrollo asistido por IA/);
      await expect(hero.locator('.hero-technology')).toHaveText(lang === 'en'
        ? 'React · TypeScript · Node.js · Software Architecture'
        : 'React · TypeScript · Node.js · Arquitectura de software');
      const cases = page.locator('.engineering-case');
      expect(await cases.evaluateAll(elements => elements.map(element => element.id))).toEqual([
        'project-achieve-platforms', 'project-mercadoshops', 'project-derfdice', 'project-marketing-analytics',
      ]);
      await expect(cases.locator('.case-period')).toHaveText(['2024', '2022–2023', '2021–2022', '2017–2021']);
      await expect(cases.locator('h3')).toHaveText(lang === 'en' ? [
        'Achieve — Financial Services Web Platforms', 'MercadoShops', 'DerfDice — Tabletop RPG Generator', 'DM2, Data-Collector & I-BOARDS',
      ] : [
        'Achieve — Plataformas web de servicios financieros', 'MercadoShops', 'DerfDice — Generador de contenido para juegos de rol', 'DM2, Data-Collector & I-BOARDS',
      ]);
      const achieve = page.locator('#project-achieve-platforms');
      await expect(achieve.locator('.case-context')).toContainText(lang === 'en' ? 'Tech Lead' : 'Líder Técnico');
      await expect(achieve.locator('.case-tech')).toContainText('GraphQL');
      await expect(achieve.locator('.case-tech')).toContainText('Contentful');
      await expect(achieve.locator('.case-tech')).not.toContainText('TypeScript');
      await expect(achieve.locator('figcaption')).toContainText(lang === 'en' ? 'not a current benchmark' : 'no una medición actual');
      await expect(achieve.locator('.case-links a')).toHaveCount(3);
      for (const [brand, url] of [
        ['Achieve', 'https://www.achieve.com/'],
        ['Freedom Debt Relief', 'https://www.freedomdebtrelief.com/'],
        ['Bills.com', 'https://www.bills.com/'],
      ]) {
        await expect(achieve.getByRole('link', { name: `${lang === 'en' ? 'Visit' : 'Visitar'} ${brand}`, exact: true })).toHaveAttribute('href', url);
      }
      const derfdice = page.locator('#project-derfdice');
      await expect(derfdice.locator('.case-context')).toContainText('ITPex Studio');
      await expect(derfdice.locator('.case-tech li')).toHaveText(['Vue', 'JavaScript', 'Node.js', 'Express']);
      await expect(derfdice.getByRole('link')).toHaveAttribute('href', 'https://derfdice.com/');
      for (const project of await cases.all()) {
        const image = project.locator('img');
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
        const ratioDifference = await image.evaluate((image: HTMLImageElement) => {
          const box = image.getBoundingClientRect();
          return Math.abs(box.width / box.height - image.naturalWidth / image.naturalHeight);
        });
        expect(ratioDifference).toBeLessThan(.02);
        await expect(image).not.toHaveAttribute('alt', '');
        if (['project-achieve-platforms', 'project-derfdice'].includes((await project.getAttribute('id'))!)) {
          await project.screenshot({ path: `test-results/featured-${await project.getAttribute('id')}-${lang}-${width}-dark.png`,
            style: 'header, .skip-link { display: none !important; }' });
        }
        await expect(project.locator('dd')).toHaveCount(3);
        for (const detail of await project.locator('dd').all()) await expect(detail).toBeVisible();
      }
      // Smaller UI must remain readable, and essential actions usable by touch.
      for (const selector of ['#nav-menu > a', '.hero-profiles a', '.hero-location', '.case-links a', '.case-visual figcaption']) {
        const sizes = await page.locator(selector).evaluateAll(elements => elements.map(element => parseFloat(getComputedStyle(element).fontSize)));
        expect(sizes.every(size => size >= 14)).toBe(true);
      }
      for (const selector of ['.hero-actions a', '.hero-profiles a', '#nav-menu > a', '.case-links a']) {
        const heights = await page.locator(selector).evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height));
        expect(heights.every(height => height >= 44)).toBe(true);
      }
      await page.locator('#projects').screenshot({ path: `test-results/editorial-work-${lang}-${width}-dark.png`, animations: 'disabled', style: 'header, .skip-link { display: none !important; } ' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      const lightPage = await page.context().browser()!.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      lightPage.on('pageerror', error => errors.push(error.message));
      await lightPage.addInitScript(() => localStorage.setItem('theme', 'light'));
      await lightPage.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
      await lightPage.goto(`/?lang=${lang}`);
      await expect(lightPage.locator('html')).not.toHaveClass(/dark/);
      await expect(lightPage.locator('#home .primary-action')).toBeInViewport({ ratio: 1 });
      await expect.poll(() => lightPage.locator('.hero-portrait img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      await lightPage.screenshot({ path: `test-results/editorial-hero-${lang}-${width}-light.png`, animations: 'disabled' });
      for (const id of ['project-achieve-platforms', 'project-derfdice']) {
        const project = lightPage.locator(`#${id}`);
        await project.locator('img').scrollIntoViewIfNeeded();
        await expect.poll(() => project.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
        await expect(project.locator('dd').last()).toBeVisible();
        await project.screenshot({ path: `test-results/featured-${id}-${lang}-${width}-light.png`,
          style: 'header, .skip-link { display: none !important; }' });
      }
      expect(await lightPage.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      await lightPage.close();
      expect(errors).toEqual([]);
    });
  }
}


test('mobile settings remain keyboard accessible with readable navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?lang=en');
  const settings = page.locator('#nav-menu .dropdown > button');
  await settings.focus();
  await page.keyboard.press('Enter');
  await expect(settings).toHaveAttribute('aria-expanded', 'true');
  const theme = page.locator('#nav-menu .dropdown-menu input').first();
  await theme.focus();
  await expect(theme).toBeFocused();
  expect(await theme.evaluate(input => getComputedStyle(input.closest('label')!).outlineStyle)).toBe('solid');
  await page.keyboard.press('Space');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.keyboard.press('Escape');
  await expect(settings).toBeFocused();
  await expect(settings).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#site-settings')).toBeHidden();
  await page.reload();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  const box = (await settings.boundingBox())!;
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  expect(box.y + box.height).toBeLessThanOrEqual(await page.locator('body > header').evaluate(header => header.getBoundingClientRect().bottom));
});
