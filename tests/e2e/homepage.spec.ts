import { expect, test } from "@playwright/test";

// Keep the portfolio smoke tests independent of analytics and external services.
test.beforeEach(async ({ page }) => {
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
    "Hello, I'm Epilef Rodriguez",
  );
  expect(
    await page
      .locator("main section")
      .evaluateAll((sections) => sections.map((section) => section.id)),
  ).toEqual(["home", "writing", "lab", "experience", "projects", "about"]);
  const writing = page.locator("#writing");
  await expect(writing.locator("article")).toHaveCount(3);
  const dates = await writing
    .locator("time")
    .evaluateAll((times) =>
      times.map((time) => Date.parse(time.getAttribute("datetime")!)),
    );
  expect(dates).toEqual([...dates].sort((a, b) => b - a));
  await expect(page.locator("#lab article")).toHaveCount(7);
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
    "Últimos artículos",
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
  for (const id of ["writing", "lab", "experience", "projects", "about"]) {
    const link = page.locator(`[data-section-link="${id}"]`);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(link).toHaveAttribute("aria-current", "location");
  }
});

for (const width of [1440, 1024, 768, 375]) {
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
        ? `Showing ${first}–${last} of 7` : `Mostrando ${first}–${last} de 7`;
      const previous = lab.getByRole("button", { name: lang === "en" ? "Previous projects" : "Proyectos anteriores" });
      const next = lab.getByRole("button", { name: lang === "en" ? "Next projects" : "Proyectos siguientes" });
      await expect(cards).toHaveCount(7);
      await expect(lab.locator("h3")).toHaveText([
        "oVitals", "Wallapibara", "PNG to SVG", "Local Image Studio",
        lang === "en" ? "SVG to Component" : "SVG a Componente",
        "GitHub API Demo", lang === "en" ? "URL Shortener" : "Acortador de URL",
      ]);
      await expect(range).toHaveText(expectedRange(1, visibleCount));
      const repos = ["ovitals", "wallapibara", "png-to-svg", "local-image-studio"];
      for (let i = 0; i < repos.length; i++) {
        const link = cards.nth(i).getByRole("link");
        await expect(link).toHaveAttribute("href", `https://github.com/Khanos/${repos[i]}`);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
        await expect(link).toHaveAccessibleName(new RegExp(lang === "en" ? "View repository" : "Ver repositorio"));
      }
      for (const [index, path] of ["svgToComponent", "github", "url"].entries()) {
        const link = cards.nth(index + 4).getByRole("link");
        await expect(link).toHaveAttribute("href", `/${path}?lang=${lang}`);
        await expect(link).not.toHaveAttribute("target", "_blank");
      }
      for (const card of await cards.all()) {
        await card.scrollIntoViewIfNeeded();
        await expect.poll(() => card.locator("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        await expect(card.locator("img")).not.toHaveAttribute("alt", "");
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
        await expect(range).toHaveText(expectedRange(8 - visibleCount, 7));
        await next.click();
        await expect(range).toHaveText(expectedRange(1, visibleCount));
        await track.focus();
        await page.keyboard.press("End");
        await expect(range).toHaveText(expectedRange(8 - visibleCount, 7));
        await page.keyboard.press("ArrowRight");
        await expect(range).toHaveText(expectedRange(1, visibleCount));
        for (const card of await cards.all()) {
          await page.keyboard.press("Tab");
          await expect(card.getByRole("link")).toBeFocused();
          await expect.poll(() => card.evaluate((card) => {
            const bounds = card.parentElement!.getBoundingClientRect();
            const own = card.getBoundingClientRect();
            return own.x >= bounds.x - 1 && own.right <= bounds.right + 1;
          })).toBe(true);
          expect(await card.getByRole("link").evaluate((link) => getComputedStyle(link).outlineStyle)).toBe("solid");
          expect(await card.evaluate((card) => getComputedStyle(card).transform)).toBe("none");
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

test("all seven Lab cards remain scrollable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
  const page = await context.newPage();
  await page.route("**/*", (route) => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
  await page.goto("/?lang=en");
  await expect(page.locator("#lab article")).toHaveCount(7);
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
  await expect(page.locator("#lab .range")).toHaveText("Showing 1–1 of 7");
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
  await expect(page.locator("#lab .range")).not.toHaveText("Showing 1–1 of 7");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await context.close();
});

test("smooth controls and trackpad scrolling stay in sync across resize", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?lang=en");
  const lab = page.locator("#lab");
  const range = lab.locator(".range");
  await expect(range).toHaveText("Showing 1–3 of 7");
  await lab.getByRole("button", { name: "Next projects" }).click();
  await expect(range).toHaveText("Showing 2–4 of 7");
  const track = lab.locator(".lab-track");
  await track.hover();
  await page.mouse.wheel(350, 0);
  await expect(range).not.toHaveText("Showing 2–4 of 7");
  await page.setViewportSize({ width: 375, height: 900 });
  await track.focus();
  await page.keyboard.press("Home");
  await expect(range).toHaveText("Showing 1–1 of 7");
  await page.setViewportSize({ width: 768, height: 900 });
  await expect(range).toHaveText("Showing 1–2 of 7");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(range).toHaveText("Showing 1–3 of 7");
});
