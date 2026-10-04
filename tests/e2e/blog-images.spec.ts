import { expect, test, type Page } from "@playwright/test";
import sharp from "sharp";

const owner = {
  username: "fixture-owner",
  password: "synthetic-browser-owner-password-00000",
};
const secret =
  "vercel_blob_rw_fixturestore_synthetic-test-blob-secret-0000000000";
const png = await sharp(
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="900"><rect width="1800" height="900" fill="#dbb6d0"/><rect x="120" y="120" width="1560" height="660" rx="30" fill="#faf5f9"/><text x="900" y="410" font-size="86" text-anchor="middle" fill="#50263e">Architecture diagram</text><text x="900" y="540" font-size="48" text-anchor="middle" fill="#50263e">Synthetic blog image fixture</text></svg>',
  ),
)
  .png()
  .toBuffer();
const file = {
  name: "Architecture diagram.png",
  mimeType: "image/png",
  buffer: png,
};
const pngBytes = Array.from<number>(png);
type UploadMode = "success" | "failure" | "malformed" | "expired" | "held";
async function mockStorage(page: Page) {
  const state = {
    mode: "success" as UploadMode,
    uploads: [] as string[],
    requests: [] as string[],
    authorization: [] as any[],
    release: () => {},
  };
  let release: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  state.release = () => release();
  page.on("response", async (response) => {
    if (response.url().endsWith("/api/blog-admin/upload") && response.ok())
      state.authorization.push(await response.json());
  });
  await page.route("**/*", async (route) => {
    const request = route.request(),
      url = new URL(request.url());
    state.requests.push(request.url());
    if (url.hostname === "127.0.0.1") {
      if (
        url.pathname === "/_image" &&
        url.searchParams
          .get("href")
          ?.includes(".public.blob.vercel-storage.com/")
      )
        return route.fulfill({ contentType: "image/png", body: png });
      if (url.pathname === "/api/blog-admin/upload") {
        expect(request.postDataBuffer()!.length).toBeLessThan(2000);
        expect(request.postData()).not.toContain(secret);
      }
      return route.continue();
    }
    if (url.hostname === "vercel.com" && url.pathname.startsWith("/api/blob")) {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "PUT,OPTIONS",
      };
      if (request.method() === "OPTIONS")
        return route.fulfill({ status: 204, headers });
      expect(request.method()).toBe("PUT");
      expect(request.headers().authorization).toMatch(
        /^Bearer vercel_blob_client_fixturestore_/,
      );
      expect(JSON.stringify(request.headers())).not.toContain(secret);
      expect(JSON.stringify(request.headers())).not.toContain(owner.password);
      if (state.mode === "held") await gate;
      if (state.mode === "failure" || state.mode === "expired")
        return route.fulfill({
          status: 403,
          headers,
          json: {
            error: {
              code:
                state.mode === "expired" ? "client_token_expired" : "forbidden",
            },
          },
        });
      const pathname = url.searchParams
        .get("pathname")!
        .replace(/\.png$/, "-AbC123.png");
      const blobUrl = `https://fixturestore.public.blob.vercel-storage.com/${pathname}`;
      state.uploads.push(blobUrl);
      return route.fulfill({
        headers,
        json: {
          pathname,
          url: state.mode === "malformed" ? "javascript:alert(1)" : blobUrl,
          contentType: "image/png",
          contentDisposition: "inline",
          downloadUrl: blobUrl,
        },
      });
    }
    if (url.hostname === "fixturestore.public.blob.vercel-storage.com")
      return route.fulfill({ contentType: "image/png", body: png });
    return route.abort();
  });
  return state;
}
const editor = (page: Page) => page.getByLabel("Markdown", { exact: true });
async function selectCursor(page: Page, start: number, end = start) {
  await editor(page).focus();
  await editor(page).evaluate(
    (node: HTMLTextAreaElement, selection) =>
      node.setSelectionRange(selection.start, selection.end),
    { start, end },
  );
}
async function choose(page: Page, alt?: string) {
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Image file").setInputFiles(file);
  if (alt !== undefined) await dialog.getByLabel("Alt text").fill(alt);
  await dialog
    .getByRole("button", {
      name: alt === undefined ? "Upload image" : "Add image",
      exact: true,
    })
    .click();
}
test.beforeEach(async ({ request }) => {
  await request.get("http://127.0.0.1:4337/__reset");
});

test("the real upload authorization route denies anonymous/CSRF requests and validates type/size", async ({
  playwright,
  request,
}) => {
  expect(
    (await request.post("/api/blog-admin/upload", { data: {} })).status(),
  ).toBe(401);
  const api = await playwright.request.newContext({
    baseURL: "http://127.0.0.1:4335",
    httpCredentials: { ...owner, send: "always" },
  });
  const body = (type: string, size: number) => ({
    type: "blob.generate-client-token",
    payload: {
      pathname: "blog/2026/10/01234567-89ab-4cde-8012-3456789abcde-image.png",
      multipart: false,
      clientPayload: JSON.stringify({ type, size }),
    },
  });
  expect(
    (
      await api.post("/api/blog-admin/upload", { data: body("image/png", 1) })
    ).status(),
  ).toBe(403);
  for (const [type, size, status] of [
    ["text/html", 1, 422],
    ["image/png", 10_000_001, 413],
    ["image/png", 1024, 200],
  ] as const) {
    const response = await api.post("/api/blog-admin/upload", {
      headers: { Origin: "http://127.0.0.1:4335" },
      data: body(type, size),
    });
    expect(response.status()).toBe(status);
    expect(await response.text()).not.toContain(secret);
  }
  await api.dispose();
});
for (const width of [375, 1440]) {
  test(`cover and cursor images: preview, save, reopen, schedule and publish at ${width}px`, async ({
    browser,
    request,
  }) => {
    const context = await browser.newContext({
      httpCredentials: owner,
      viewport: { width, height: 900 },
    });
    const page = await context.newPage(),
      state = await mockStorage(page);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/admin/blog/new");
    await page.getByLabel("Title", { exact: true }).fill("Image article");
    await page
      .getByRole("button", { name: "Upload cover image", exact: true })
      .click();
    await choose(page);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    const cover = state.uploads[0];
    await expect(
      page.getByLabel("Cover image URL", { exact: true }),
    ).toHaveValue(cover);
    await expect(page.getByAltText("Cover image preview")).toBeVisible();
    expect(
      await page
        .getByAltText("Cover image preview")
        .evaluate((node: HTMLImageElement) => node.naturalWidth),
    ).toBe(1800);
    await editor(page).fill("First paragraph.\n\nSecond paragraph.");
    await selectCursor(page, 18);
    await page.getByRole("button", { name: "Image", exact: true }).click();
    await choose(page, "Architecture diagram");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    const expected = `First paragraph.\n\n![Architecture diagram](${state.uploads[1]})\n\nSecond paragraph.`;
    await expect(editor(page)).toHaveValue(expected);
    expect(
      await editor(page).evaluate(
        (node: HTMLTextAreaElement) => node.selectionStart,
      ),
    ).toBe(expected.indexOf("\n\nSecond paragraph."));
    await expect(editor(page)).toBeFocused();
    await expect(page.locator(".admin-preview img")).toHaveAttribute(
      "src",
      state.uploads[1],
    );
    await expect(page.locator(".admin-preview img")).toHaveAttribute(
      "alt",
      "Architecture diagram",
    );
    await page.screenshot({
      path: `test-results/blog-images-editor-${width}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Save Draft", exact: true }).click();
    await expect(page.getByText("Draft saved.", { exact: true })).toBeVisible();
    expect((await request.get("/blog/en/image-article")).status()).toBe(404);
    await page.reload();
    await expect(editor(page)).toHaveValue(expected);
    await expect(page.getByAltText("Cover image preview")).toBeVisible();
    await expect(page.locator(".admin-preview img")).toBeVisible();
    await page.getByRole("button", { name: "Replace image" }).click();
    await choose(page);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(
      page.getByLabel("Cover image URL", { exact: true }),
    ).toHaveValue(state.uploads[2]);
    expect(state.uploads[2]).not.toBe(cover);
    await page
      .getByLabel("Publication date / schedule")
      .fill("2099-01-01T12:00");
    await page.getByRole("button", { name: "Schedule publication" }).click();
    await expect(page.getByText(/Scheduled\. Public caches/)).toBeVisible();
    expect((await request.get("/blog/en/image-article")).status()).toBe(404);
    await page.getByLabel("Publication date / schedule").fill("");
    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await expect(page.getByText(/Published\. Public caches/)).toBeVisible();
    await page.goto("/blog/en/image-article");
    await expect(page.locator(".blog-content img")).toHaveAttribute(
      "src",
      state.uploads[1],
    );
    await expect(page.locator(".blog-content img")).toBeVisible();
    const publicCover = page.locator("main img").first();
    await expect(publicCover).toBeVisible();
    expect(await publicCover.getAttribute("src")).toContain("/_image?");
    await page
      .locator(".blog-content img")
      .evaluate((node: HTMLImageElement) => node.decode());
    expect(
      await page
        .locator(".blog-content img")
        .evaluate(
          (node: HTMLImageElement) =>
            node.width <= node.parentElement!.clientWidth &&
            Math.abs(node.width / node.height - 2) < 0.02,
        ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
    await page.screenshot({
      path: `test-results/blog-images-public-${width}.png`,
      fullPage: true,
    });
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.screenshot({
      path: `test-results/blog-images-public-dark-${width}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
    expect(state.uploads).toHaveLength(3);
    expect(state.requests.some((url) => /delete|\/mpu/.test(url))).toBe(false);
    expect(JSON.stringify(state.authorization)).not.toContain(secret);
    await context.close();
  });
}
test("failed cover replacements/inline uploads preserve edits; retry, selection replacement, blank alt and remove", async ({
  browser,
}) => {
  const context = await browser.newContext({ httpCredentials: owner });
  const page = await context.newPage(),
    state = await mockStorage(page);
  await page.goto("/admin/blog/new");
  await page.getByLabel("Title", { exact: true }).fill("Retain edits");
  await page
    .getByLabel("Cover image URL", { exact: true })
    .fill("https://example.com/existing.jpg");
  await editor(page).fill("First paragraph.\n\nSecond paragraph.");
  state.mode = "failure";
  await page.getByRole("button", { name: "Replace image" }).click();
  await choose(page);
  await expect(page.getByRole("alert")).toContainText("have not been changed");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByLabel("Cover image URL", { exact: true })).toHaveValue(
    "https://example.com/existing.jpg",
  );
  for (const mode of ["failure", "malformed", "expired"] as const) {
    state.mode = mode;
    await selectCursor(page, 18);
    await page.getByRole("button", { name: "Image", exact: true }).click();
    await choose(page, "Diagram");
    await expect(page.getByRole("alert")).toContainText(
      mode === "expired" ? "expired" : "have not been changed",
    );
    await expect(editor(page)).toHaveValue(
      "First paragraph.\n\nSecond paragraph.",
    );
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
  }
  await editor(page).fill("First paragraph.\n\nSELECT\n\nSecond paragraph.");
  await selectCursor(page, 18, 24);
  await page.getByRole("button", { name: "Image", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Image file").setInputFiles(file);
  state.mode = "failure";
  await dialog.getByRole("button", { name: "Add image", exact: true }).click();
  await expect(dialog.getByRole("alert")).toBeVisible();
  state.mode = "success";
  await dialog.getByRole("button", { name: "Add image", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(editor(page)).toHaveValue(
    `First paragraph.\n\n![](${state.uploads[state.uploads.length - 1]})\n\nSecond paragraph.`,
  );
  await page.getByRole("button", { name: "Remove cover image" }).click();
  await expect(page.getByLabel("Cover image URL", { exact: true })).toHaveValue(
    "",
  );
  await page.getByRole("button", { name: "Save Draft", exact: true }).click();
  await expect(
    page.getByLabel("Cover image URL", { exact: true }),
  ).toHaveAttribute("aria-invalid", "true");
  await context.close();
});
test("file validation, drop into dialog, clipboard paste, busy state and cancellation", async ({
  browser,
}) => {
  const context = await browser.newContext({ httpCredentials: owner });
  const page = await context.newPage(),
    state = await mockStorage(page);
  await page.goto("/admin/blog/new");
  await editor(page).fill("First paragraph.\n\nSecond paragraph.");
  await selectCursor(page, 18);
  await editor(page).evaluate((node, bytes) => {
    const clipboardData = new DataTransfer();
    clipboardData.items.add(
      new File([new Uint8Array(bytes)], "pasted.png", { type: "image/png" }),
    );
    node.dispatchEvent(
      new ClipboardEvent("paste", {
        clipboardData,
        bubbles: true,
        cancelable: true,
      }),
    );
  }, pngBytes);
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("pasted.png", { exact: true })).toBeVisible();
  await dialog.getByLabel("Image file").setInputFiles({
    name: "unsafe.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from("<svg/>"),
  });
  await expect(dialog.getByRole("alert")).toContainText(
    "JPEG, PNG, WebP or AVIF",
  );
  await expect(
    dialog.getByRole("button", { name: "Add image", exact: true }),
  ).toBeDisabled();
  await dialog.getByLabel("Image file").setInputFiles({
    name: "large.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(10_000_001),
  });
  await expect(dialog.getByRole("alert")).toContainText("too large");
  await dialog.locator(".admin-image-drop").evaluate((node, bytes) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(
      new File([new Uint8Array(bytes)], "dropped.png", { type: "image/png" }),
    );
    node.dispatchEvent(
      new DragEvent("drop", { dataTransfer, bubbles: true, cancelable: true }),
    );
  }, pngBytes);
  await dialog.getByLabel("Alt text").fill("Diagram [with brackets]");
  await page.screenshot({ path: "test-results/blog-images-dialog.png" });
  state.mode = "held";
  await dialog.getByRole("button", { name: "Add image", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Save Draft", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Publish", exact: true }),
  ).toBeDisabled();
  await expect(editor(page)).toBeDisabled();
  await expect(dialog.locator("progress")).toBeVisible();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  state.release();
  await expect(editor(page)).toHaveValue(
    "First paragraph.\n\nSecond paragraph.",
  );
  await expect(editor(page)).toBeEnabled();
  expect(state.authorization).toHaveLength(1);
  expect(
    await page.evaluate(() =>
      JSON.stringify({
        local: { ...localStorage },
        session: { ...sessionStorage },
        cookie: document.cookie,
      }),
    ),
  ).not.toContain(secret);
  await context.close();
});
