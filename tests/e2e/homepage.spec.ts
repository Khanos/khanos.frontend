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
  await expect(page.locator("#lab article")).toHaveCount(4);
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
    test(`Lab case studies: ${lang}, ${width}px, light and dark`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/?lang=${lang}`);
      const lab = page.locator("#lab");
      const cards = lab.locator("article");
      await expect(cards).toHaveCount(4);
      await expect(lab.locator("h3")).toHaveText([
        "oVitals", "Wallapibara", "PNG to SVG", "Local Image Studio",
      ]);
      const repos = ["ovitals", "wallapibara", "png-to-svg", "local-image-studio"];
      for (let i = 0; i < repos.length; i++) {
        const card = cards.nth(i);
        const link = card.getByRole("link");
        await expect(link).toHaveAttribute("href", `https://github.com/Khanos/${repos[i]}`);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
        await expect(link).toHaveAccessibleName(new RegExp(lang === "en" ? "View repository" : "Ver repositorio"));
        await expect(card.locator(".tags li")).toHaveCount(4);
        await card.scrollIntoViewIfNeeded();
        await expect.poll(() => card.locator("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        await expect(card.locator("img")).not.toHaveAttribute("alt", "");
      }
      for (const dark of [false, true]) {
        await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), dark);
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(dark ? "dark" : "light");
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
        const sizes = await cards.evaluateAll((cards) => cards.map((card) => {
          const { x, y, height } = card.getBoundingClientRect();
          const tags = card.querySelector(".tags")!;
          return { x, y, height, tagsFit: tags.scrollWidth <= tags.clientWidth };
        }));
        expect(sizes.every((card) => card.tagsFit)).toBe(true);
        if (width >= 640) {
          expect(sizes[1].x).toBeGreaterThan(sizes[0].x);
          expect(Math.abs(sizes[0].height - sizes[1].height)).toBeLessThan(2);
          expect(Math.abs(sizes[2].height - sizes[3].height)).toBeLessThan(2);
        } else {
          expect(sizes[1].y).toBeGreaterThan(sizes[0].y);
          expect(sizes.every((card) => card.height < 570)).toBe(true);
        }
        const first = cards.first().getByRole("link");
        await first.focus();
        await page.keyboard.press("Tab");
        await expect(cards.nth(1).getByRole("link")).toBeFocused();
        expect(await cards.nth(1).getByRole("link").evaluate((link) => getComputedStyle(link).outlineStyle)).toBe("solid");
        expect(await cards.nth(1).evaluate((card) => getComputedStyle(card).transform)).toBe("none");
        await lab.screenshot({ path: `test-results/lab-${lang}-${width}-${dark ? "dark" : "light"}.png` });
      }
    });
  }
}
