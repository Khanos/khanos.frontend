import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort(),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const lang of ["en", "es"]) {
  test(`URL Shortener opens a case study without navigating: ${lang}`, async ({
    page,
  }) => {
    const title = lang === "en" ? "URL Shortener" : "Acortador de URL";
    const closeLabel =
      lang === "en" ? "Close project details" : "Cerrar detalles del proyecto";
    const requests: string[] = [];
    page.on("request", (request) => {
      if (new URL(request.url()).pathname === "/url")
        requests.push(request.url());
    });
    await page.goto(`/?lang=${lang}`);
    const card = page.locator("#lab .experiment").last();
    const trigger = card.getByRole("button", { name: new RegExp(title) });
    await expect(card.locator('a[href^="/url"]')).toHaveCount(0);
    // The entire card surface is clickable, including the cover.
    await card.scrollIntoViewIfNeeded();
    const cover = (await card.locator(".preview").boundingBox())!;
    await page.mouse.click(
      cover.x + cover.width / 2,
      cover.y + cover.height / 2,
    );
    const dialog = page.getByRole("dialog", { name: title, exact: true });
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(`/?lang=${lang}`);
    expect(requests).toEqual([]);
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(title);
    await expect(
      dialog.getByText(lang === "en" ? "Private app" : "Aplicación privada", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(dialog.locator(".showcase-highlights li")).toHaveCount(4);
    await expect(dialog.locator(".showcase-tech li")).toHaveCount(8);
    await expect(dialog.getByRole("link")).toHaveCount(2);
    for (const [index, repo] of [
      "khanos.frontend",
      "khanos.backend",
    ].entries()) {
      const link = dialog.getByRole("link").nth(index);
      await expect(link).toHaveAttribute(
        "href",
        `https://github.com/Khanos/${repo}`,
      );
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    const close = dialog.getByRole("button", { name: closeLabel });
    await expect(close).toBeFocused();
    expect(
      await page.evaluate(() => document.documentElement.style.overflow),
    ).toBe("hidden");
    // Background elements are inert even when code attempts to focus them.
    await page
      .locator('[data-section-link="home"]')
      .evaluate((node: HTMLElement) => node.focus());
    await expect(close).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("link").last()).toBeFocused();
    await page.keyboard.press("Tab");
    // Chromium can visit browser chrome, then the scrollable dialog itself,
    // before returning to its close button. No background control is reachable.
    const focus = await page.evaluate(() => ({
      browserChrome:
        document.activeElement === document.body && !document.hasFocus(),
      inside: !!document.activeElement?.closest("dialog"),
    }));
    expect(focus.browserChrome || focus.inside).toBe(true);
    if (focus.browserChrome) await page.keyboard.press("Tab");
    if (await dialog.evaluate((node) => document.activeElement === node))
      await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    const before = await page
      .locator(".lab-track")
      .evaluate((node) => node.scrollLeft);
    await page.keyboard.press("ArrowLeft");
    expect(
      await page.locator(".lab-track").evaluate((node) => node.scrollLeft),
    ).toBe(before);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.style.overflow))
      .toBe("");
    await trigger.press("Enter");
    await expect(dialog).toBeVisible();
    await close.click();
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.press("Space");
    await expect(dialog).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(dialog).not.toBeVisible();
    expect(requests).toEqual([]);
  });

  for (const width of [375, 768, 1024, 1440]) {
    test(`showcase fits ${width}px in light and dark: ${lang}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/?lang=${lang}`);
      await page.locator("#lab .experiment").last().getByRole("button").click();
      const dialog = page.getByRole("dialog");
      for (const dark of [false, true]) {
        await page.evaluate(
          (dark) => document.documentElement.classList.toggle("dark", dark),
          dark,
        );
        await expect(dialog).toBeVisible();
        const dimensions = await dialog.evaluate((node) => ({
          width: node.getBoundingClientRect().width,
          x: node.getBoundingClientRect().x,
          overflow: node.scrollWidth - node.clientWidth,
          scrolls: node.scrollHeight > node.clientHeight,
        }));
        expect(dimensions.overflow).toBeLessThanOrEqual(1);
        expect(dimensions.x).toBeGreaterThanOrEqual(0);
        expect(dimensions.width).toBeLessThanOrEqual(width);
        expect(dimensions.width).toBe(
          width < 640 ? width : Math.min(1024, width - 48),
        );
        expect(dimensions.scrolls).toBe(true);
        await expect
          .poll(() =>
            dialog
              .locator("img")
              .evaluate(
                (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
              ),
          )
          .toBe(true);
        await dialog.screenshot({
          path: `test-results/showcase-${lang}-${width}-${dark ? "dark" : "light"}.png`,
        });
        await dialog.evaluate((node) => {
          node.scrollTop = node.scrollHeight;
        });
        await expect(dialog.getByRole("button")).toBeInViewport();
        await expect(dialog.getByRole("link").last()).toBeInViewport();
        await dialog.evaluate((node) => {
          node.scrollTop = 0;
        });
      }
    });
  }
}

test("showcase reconnects after Astro client navigation", async ({ page }) => {
  await page.goto("/?lang=en");
  await page
    .locator("#writing")
    .getByRole("link", { name: "View all posts" })
    .click();
  await expect(page).toHaveURL(/\/blog\?lang=en$/);
  await page.goBack();
  const trigger = page.locator("#lab .experiment").last().getByRole("button");
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe("");
});
