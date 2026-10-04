import { expect, test } from "@playwright/test";
const fixture = "http://127.0.0.1:4337";
const owner = {
  username: "fixture-owner",
  password: "synthetic-browser-owner-password-00000",
};
const token = "synthetic-backend-owner-token-0000000000";
test.beforeEach(async ({ request }) => {
  await request.get(`${fixture}/__reset`);
});

test("anonymous admin pages and CRUD/preview routes are denied without contacting the backend", async ({
  request,
}) => {
  const before = (await (await request.get(`${fixture}/__stats`)).json()).calls;
  for (const path of [
    "/admin/blog",
    "/admin/blog/new",
    "/admin/blog/000000000000000000000001",
    "/api/blog-admin",
    "/api/blog-admin/000000000000000000000001",
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(401);
    expect(response.headers()["cache-control"]).toBe("no-store");
  }
  for (const [method, path] of [
    ["POST", "/api/blog-admin"],
    ["POST", "/api/blog-admin/preview"],
    ["PATCH", "/api/blog-admin/000000000000000000000001"],
    ["DELETE", "/api/blog-admin/000000000000000000000001"],
  ]) {
    expect((await request.fetch(path, { method, data: {} })).status()).toBe(
      401,
    );
  }
  expect((await (await request.get(`${fixture}/__stats`)).json()).calls).toBe(
    before,
  );
});
test("authenticated mutations reject cross-origin requests; no private pages are cached or indexed", async ({
  playwright,
}) => {
  const request = await playwright.request.newContext({
    baseURL: "http://127.0.0.1:4335",
    httpCredentials: { ...owner, send: "always" },
  });
  for (const method of ["POST", "PATCH", "DELETE"])
    expect(
      (
        await request.fetch("/api/blog-admin/000000000000000000000001", {
          method,
          headers: { Origin: "https://evil.example" },
          data: {},
        })
      ).status(),
    ).toBe(403);
  const response = await request.get("/admin/blog");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toBe("no-store");
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
  expect(await response.text()).not.toContain(token);
  await request.dispose();
});
for (const width of [375, 1440]) {
  test(`create, preview, draft, edit, schedule, publish and delete at ${width}px`, async ({
    browser,
    request,
  }) => {
    const context = await browser.newContext({
      httpCredentials: owner,
      viewport: { width, height: 900 },
    });
    const page = await context.newPage();
    const errors: string[] = [],
      outgoing: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => outgoing.push(request.url()));
    await page.route("**/*", (route) =>
      new URL(route.request().url()).hostname === "127.0.0.1"
        ? route.continue()
        : route.abort(),
    );
    await page.goto("/admin/blog");
    await expect(page.locator(".admin-posts article")).toHaveCount(12);
    await page.screenshot({
      path: `test-results/admin-dashboard-${page.viewportSize()?.width}.png`,
      fullPage: true,
    });
    await page.getByRole("link", { name: "New Post", exact: true }).click();
    await page
      .getByLabel("Title", { exact: false })
      .fill("AI Agents Are the New Programming Interface");
    await expect(page.getByLabel("Slug", { exact: false })).toHaveValue(
      "en/ai-agents-are-the-new-programming-interface",
    );
    await page.getByLabel("Language", { exact: true }).selectOption("es");
    await expect(page.getByLabel("Slug", { exact: false })).toHaveValue(
      "es/ai-agents-are-the-new-programming-interface",
    );
    await page.getByLabel("Slug", { exact: false }).fill("es/custom-post");
    await page.getByLabel("Title", { exact: false }).fill("My private draft");
    await expect(page.getByLabel("Slug", { exact: false })).toHaveValue(
      "es/custom-post",
    );
    await page.getByLabel("Language", { exact: true }).selectOption("en");
    await expect(page.getByLabel("Slug", { exact: false })).toHaveValue(
      "es/custom-post",
    );
    await page.getByLabel("Language", { exact: true }).selectOption("es");
    await page
      .getByLabel("Cover image URL", { exact: false })
      .fill("https://example.com/cover.jpg");
    await page.getByLabel("Author", { exact: true }).fill("Owner");
    await page
      .getByLabel("Categories", { exact: true })
      .fill("AI, Development");
    await page
      .getByLabel("Excerpt", { exact: true })
      .fill("Runtime publication");
    await page.getByLabel("Anonymous", { exact: false }).check();
    await page
      .getByLabel("Markdown", { exact: true })
      .fill(
        '# My article\n\n**Content**\n\n<script>window.__adminAttack=1</script><img onerror="attack()" src="https://example.com/a.png">',
      );
    await expect(page.locator(".admin-preview h1")).toHaveText("My article");
    await expect(page.locator(".admin-preview strong")).toHaveText("Content");
    await expect(
      page.locator(".admin-preview script, .admin-preview [onerror]"),
    ).toHaveCount(0);
    expect(
      await page.evaluate(() => (window as any).__adminAttack),
    ).toBeUndefined();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
    await page.screenshot({
      path: `test-results/admin-editor-${width}.png`,
      fullPage: true,
    });
    const positions = await page.locator(".admin-markdown").evaluate((node) => {
      const [editor, preview] = Array.from(node.children).map((child) =>
        child.getBoundingClientRect(),
      );
      return { editorY: editor.y, previewY: preview.y };
    });
    expect(
      width === 375
        ? positions.previewY > positions.editorY
        : positions.previewY === positions.editorY,
    ).toBe(true);
    page.once("dialog", (dialog) => dialog.dismiss());
    await page.getByRole("link", { name: "All posts" }).click();
    await expect(page).toHaveURL(/\/admin\/blog\/new$/);
    await page.getByRole("button", { name: "Save Draft", exact: true }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "Draft saved." }),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/blog\/[a-f0-9]{24}$/);
    expect((await request.get("/blog/es/custom-post")).status()).toBe(404);
    await page.reload();
    await expect(page.getByLabel("Title", { exact: false })).toHaveValue(
      "My private draft",
    );
    await page.getByLabel("Title", { exact: false }).fill("Scheduled article");
    await page
      .getByLabel("Publication date / schedule")
      .fill("2099-01-01T12:00");
    await page.getByRole("button", { name: "Schedule publication" }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "Scheduled." }),
    ).toBeVisible();
    expect((await request.get("/blog/es/custom-post")).status()).toBe(404);
    await expect(page.getByLabel("Slug", { exact: false })).toBeDisabled();
    await page.getByLabel("Publication date / schedule").fill("");
    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "Published." }),
    ).toBeVisible();
    const publicPost = await request.get("/blog/es/custom-post");
    expect(publicPost.status()).toBe(200);
    expect(await publicPost.text()).toContain("Scheduled article");
    expect(await (await request.get("/blog?lang=es")).text()).toContain(
      "Scheduled article",
    );
    await page.getByRole("link", { name: "All posts" }).click();
    await page.getByLabel("Status", { exact: true }).selectOption("draft");
    await expect(page.getByText("No posts found")).toBeVisible();
    await page.getByLabel("Status", { exact: true }).selectOption("published");
    await page.getByLabel("Language", { exact: true }).selectOption("es");
    const row = page
      .locator(".admin-posts article")
      .filter({ hasText: "Scheduled article" });
    await expect(row).toHaveCount(1);
    page.once("dialog", (dialog) => dialog.dismiss());
    await row.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(row).toHaveCount(1);
    page.once("dialog", (dialog) => dialog.accept());
    await row.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(row).toHaveCount(0);
    expect((await request.get("/blog/es/custom-post")).status()).toBe(404);
    expect(errors).toEqual([]);
    expect(outgoing.some((url) => url.includes("googletagmanager"))).toBe(
      false,
    );
    expect(await page.content()).not.toContain(token);
    const storage = await page.evaluate(() =>
      JSON.stringify({
        local: { ...localStorage },
        session: { ...sessionStorage },
        cookies: document.cookie,
      }),
    );
    expect(storage).not.toContain(token);
    await context.close();
  });
}
test("duplicate slugs and validation errors retain edits; published URLs require explicit unlock", async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ httpCredentials: owner });
  const page = await context.newPage();
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort(),
  );
  await page.goto("/admin/blog");
  await page
    .locator(".admin-posts article")
    .first()
    .getByRole("link", { name: "Edit", exact: true })
    .click();
  await expect(page.getByLabel("Slug", { exact: false })).toBeDisabled();
  await page.getByLabel("Allow language / URL changes").check();
  await expect(page.getByLabel("Slug", { exact: false })).toBeEnabled();
  await page.getByLabel("Slug", { exact: false }).fill("en/duplicate-new-slug");
  await page
    .getByLabel("Cover image URL", { exact: false })
    .fill("https://example.com/existing-cover.jpg");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(
    page.getByText("Unsaved changes", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Allow language / URL changes").uncheck();
  await expect(page.getByLabel("Slug", { exact: false })).toBeDisabled();
  await page.getByLabel("Title", { exact: false }).fill("An unsaved edit");
  // Start a fresh editor, discarding the URL change intentionally.
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("link", { name: "All posts" }).click();
  await page.getByRole("link", { name: "New Post", exact: true }).click();
  await page.getByRole("button", { name: "Save Draft", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("highlighted fields");
  await page.getByLabel("Title", { exact: false }).fill("A duplicate");
  await page
    .getByLabel("Slug", { exact: false })
    .fill("en/1-reality-of-job-seeking");
  await page
    .getByLabel("Cover image URL", { exact: false })
    .fill("https://example.com/a.jpg");
  await page.getByLabel("Markdown", { exact: true }).fill("Preserve my work");
  await page.getByRole("button", { name: "Save Draft", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("slug is already in use");
  await expect(page.getByLabel("Markdown", { exact: true })).toHaveValue(
    "Preserve my work",
  );
  await page.getByLabel("Slug", { exact: false }).fill("en/unique-new-slug");
  await request.get(`${fixture}/__mode?value=blog-validation`);
  await page.getByRole("button", { name: "Save Draft", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("backend rejected");
  await expect(page.getByLabel("Title", { exact: false })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(await page.content()).not.toContain(token);
  await request.get(`${fixture}/__mode?value=blog-failure`);
  await page.getByRole("button", { name: "Save Draft", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("unavailable");
  await expect(
    page.getByRole("button", { name: "Save Draft", exact: true }),
  ).toBeEnabled();
  await context.close();
});

test("dashboard pagination/filters and disabled save state use the agreed endpoints", async ({
  browser,
  playwright,
}) => {
  const api = await playwright.request.newContext({
    baseURL: "http://127.0.0.1:4335",
    httpCredentials: { ...owner, send: "always" },
  });
  for (let index = 0; index < 15; index++) {
    const response = await api.post("/api/blog-admin", {
      headers: { Origin: "http://127.0.0.1:4335" },
      data: {
        title: `Draft ${index}`,
        language: "es",
        slug: `es/draft-${index}`,
        coverImage: "https://example.com/cover.jpg",
        content: "Draft content",
        categories: [],
        author: "",
        anonymous: false,
        excerpt: "",
        status: "draft",
      },
    });
    expect(response.status()).toBe(200);
  }
  const context = await browser.newContext({ httpCredentials: owner });
  const page = await context.newPage();
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort(),
  );
  await page.goto("/admin/blog");
  await expect(page.locator(".admin-posts article")).toHaveCount(25);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator(".admin-posts article")).toHaveCount(2);
  await page.getByLabel("Status", { exact: true }).selectOption("draft");
  await expect(page.locator(".admin-posts article")).toHaveCount(15);
  await page.getByLabel("Language", { exact: true }).selectOption("en");
  await expect(page.getByText("No posts found")).toBeVisible();
  await page.getByLabel("Language", { exact: true }).selectOption("es");
  await page
    .locator(".admin-posts article")
    .first()
    .getByRole("link", { name: "Edit", exact: true })
    .click();
  await page.getByLabel("Title", { exact: true }).fill("Changed draft");
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/blog-admin/*", async (route) => {
    if (route.request().method() === "PATCH") await gate;
    await route.continue();
  });
  await page.getByRole("button", { name: "Save Draft", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Saving…", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Publish", exact: true }),
  ).toBeDisabled();
  await expect(page.getByLabel("Title", { exact: true })).toBeDisabled();
  release();
  await expect(
    page.getByRole("status").filter({ hasText: "Draft saved." }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue(
    "Changed draft",
  );
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete post", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/blog$/);
  await expect(
    page.locator(".admin-posts article").filter({ hasText: "Changed draft" }),
  ).toHaveCount(0);
  await context.close();
  await api.dispose();
});
