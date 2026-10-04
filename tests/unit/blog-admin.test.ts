import { afterEach, expect, it, vi } from "vitest";
import {
  suggestSlug,
  validateBlogInput,
  isAdminPost,
  isAdminPage,
} from "../../src/services/blog-admin-contract";
import {
  adminQuery,
  adminResult,
  blogBackend,
  postBody,
  BlogAdminError,
} from "../../src/server/blogAdmin";
import { ownerBoundary } from "../../src/server/ownerAuth";
import { POST as preview } from "../../src/pages/api/blog-admin/preview";
import { blogPosts } from "../blog-fixture.mjs";

const env = {
  URL_ADMIN_USERNAME: "fixture-owner",
  URL_ADMIN_PASSWORD: "synthetic-browser-owner-password-00000",
  OWNER_API_TOKEN: "synthetic-backend-owner-token-0000000000",
  PUBLIC_BACKEND_API_URL: "https://example.com/api/",
};
const post = blogPosts[0];
const input = {
  title: post.title,
  slug: post.slug,
  language: post.language,
  coverImage: "https://example.com/cover.jpg",
  content: "# Hello",
  categories: ["AI"],
  author: "Owner",
  anonymous: false,
  excerpt: "",
  status: "draft",
};
const request = (body: unknown) =>
  new Request("https://frontend.example/api/blog-admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it("suggests lowercase language-prefixed slugs with accent normalization", () => {
  expect(suggestSlug("AI Agents Are the New Programming Interface", "en")).toBe(
    "en/ai-agents-are-the-new-programming-interface",
  );
  expect(suggestSlug("¿Programación ágil? ¡Sí!", "es")).toBe(
    "es/programacion-agil-si",
  );
});
it("accepts draft/full records but preserves the public contract shape", () => {
  expect(
    isAdminPost({
      ...post,
      status: "draft",
      publishedAt: undefined,
      readingMinutes: 0,
    }),
  ).toBe(true);
  expect(isAdminPost({ ...post, language: "es" })).toBe(false);
  expect(isAdminPost({ ...post, publishedAt: "invalid" })).toBe(false);
  expect(
    isAdminPage({
      data: [post],
      pagination: { page: 1, limit: 25, pages: 1, total: 1 },
    }),
  ).toBe(true);
  expect(
    isAdminPage({
      data: [post],
      pagination: { page: -1, limit: 25, pages: 1, total: 1 },
    }),
  ).toBe(false);
});
it("validates input and strips server-owned/unknown fields before writes", async () => {
  expect(validateBlogInput(input)).toEqual({});
  expect(
    validateBlogInput({
      ...input,
      coverImage: "http://example.com/a.png",
      slug: "es/unsafe",
      categories: [1],
    }),
  ).toEqual(
    expect.objectContaining({
      coverImage: expect.any(String),
      slug: expect.any(String),
      categories: expect.any(String),
    }),
  );
  expect(
    await postBody(
      request({
        ...input,
        id: "injected",
        createdAt: "injected",
        ownerToken: "injected",
      }),
    ),
  ).toEqual(input);
  await expect(
    postBody(request({ ...input, title: "" })),
  ).rejects.toMatchObject({ status: 422, fields: { title: "Required." } });
  await expect(
    postBody(request({ ...input, content: "a".repeat(600000) })),
  ).rejects.toMatchObject({ status: 413 });
  await expect(
    postBody(
      new Request("https://frontend.example", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      }),
    ),
  ).rejects.toMatchObject({ status: 400 });
});
it("whitelists admin pagination and filters and rejects ambiguous values", () => {
  expect(
    adminQuery(
      new URL(
        "https://frontend.example?status=draft&language=es&page=2&token=ignored",
      ),
    ),
  ).toBe("status=draft&language=es&page=2&limit=25");
  for (const query of [
    "page=0",
    "limit=1000",
    "status=scheduled",
    "language=fr",
    "page=1&page=2",
  ])
    expect(() =>
      adminQuery(new URL(`https://frontend.example?${query}`)),
    ).toThrow();
});
it("protects every admin page/API, including preview and encoded paths, before code executes", async () => {
  for (const path of [
    "/admin/blog",
    "/admin/blog/new",
    "/admin/blog/012345678901234567890abc",
    "/%61dmin/blog/",
    "/api/blog-admin",
    "/api/blog-admin/preview",
    "/api/blog-admin/012345678901234567890abc",
  ]) {
    const next = vi.fn();
    expect(
      (
        await ownerBoundary(
          new Request(`https://frontend.example${path}`),
          next,
          env,
        )
      ).status,
    ).toBe(401);
    expect(next).not.toHaveBeenCalled();
  }
  for (const method of ["POST", "PATCH", "DELETE"]) {
    const next = vi.fn();
    const authorization = `Basic ${Buffer.from(`${env.URL_ADMIN_USERNAME}:${env.URL_ADMIN_PASSWORD}`).toString("base64")}`;
    expect(
      (
        await ownerBoundary(
          new Request("https://frontend.example/api/blog-admin", {
            method,
            headers: { authorization, Origin: "https://evil.example" },
          }),
          next,
          env,
        )
      ).status,
    ).toBe(403);
    expect(next).not.toHaveBeenCalled();
  }
});
it("sends only the backend bearer token and retains draft/publish/schedule payloads", async () => {
  const fetch = vi.fn().mockImplementation(async () => Response.json(post));
  vi.stubGlobal("fetch", fetch);
  for (const body of [
    { ...input, status: "draft" },
    { ...input, status: "published" },
    { ...input, status: "published", publishedAt: "2099-01-01T12:00:00.000Z" },
  ]) {
    await blogBackend(
      "blog",
      request(body),
      isAdminPost,
      { method: "POST", body: JSON.stringify(body) },
      env,
    );
    const [url, options] = fetch.mock.calls[fetch.mock.calls.length - 1];
    expect(url.href).toBe("https://example.com/api/blog");
    expect(options.headers.Authorization).toBe(`Bearer ${env.OWNER_API_TOKEN}`);
    expect(new Headers(options.headers).has("cookie")).toBe(false);
    expect(options.credentials).toBe("omit");
    expect(options.redirect).toBe("error");
    expect(JSON.parse(options.body)).toEqual(body);
  }
});
it("supports 204 deletion, masks backend details, retains safe validation fields, and flags duplicate slugs", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
  );
  expect(
    await blogBackend(
      `blog/${post.id}`,
      request(input),
      (_): _ is undefined => true,
      { method: "DELETE" },
      env,
    ),
  ).toBeUndefined();
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        Response.json(
          { errors: { title: env.OWNER_API_TOKEN } },
          { status: 422 },
        ),
      ),
  );
  const rejected = await adminResult(() =>
    blogBackend("blog", request(input), isAdminPost, {}, env),
  );
  expect(rejected.status).toBe(422);
  expect(await rejected.json()).toEqual({
    error: "Check the highlighted fields. The backend rejected this post.",
    fields: { title: "Rejected by the backend. Check this field." },
  });
  const duplicate = await adminResult(async () => {
    throw new BlogAdminError(409);
  });
  expect((await duplicate.json()).error).toContain("slug is already in use");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ invalid: true })),
  );
  expect(
    (
      await adminResult(() =>
        blogBackend("blog", request(input), isAdminPost, {}, env),
      )
    ).status,
  ).toBe(502);
});
it("preview uses the public renderer and strips scripts, events, embeds and unsafe URLs", async () => {
  const response = await preview({
    request: request({
      content:
        '# Title\n\n**Bold**\n\n<script>window.attack=1</script><img onerror="attack()" src="https://example.com/a.png"><iframe src="https://evil.example"></iframe>[X](javascript:alert(1))',
    }),
  } as any);
  const data = await response.json();
  expect(data.html).toContain("<h1>Title</h1>");
  expect(data.html).toContain("<strong>Bold</strong>");
  expect(data.html).not.toMatch(
    /<script|onerror|<iframe|(?:href|src)="javascript:/,
  );
  expect(response.headers.get("cache-control")).toBe("no-store");
});
