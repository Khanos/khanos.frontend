import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { authorizeBlogImageUpload } from "../../src/server/blogImageUpload";
import { uploadBlogImage } from "../../src/components/blog-admin/image-upload";
import { insertMarkdownImage } from "../../src/components/blog-admin/markdown-image";
import {
  imagePath,
  imagePathPattern,
  imageValidation,
  maximumImageBytes,
  publicBlobImageUrl,
} from "../../src/services/blog-images";
import { renderBlog } from "../../src/utils/blog-render";
import { validateBlogInput } from "../../src/services/blog-admin-contract";
import { handleUpload, upload } from "@vercel/blob/client";

vi.mock("@vercel/blob/client", () => ({
  handleUpload: vi.fn(),
  upload: vi.fn(),
}));
const env = {
  URL_ADMIN_USERNAME: "fixture-owner",
  URL_ADMIN_PASSWORD: "synthetic-browser-owner-password-00000",
  OWNER_API_TOKEN: "synthetic-backend-owner-token-0000000000",
  BLOB_READ_WRITE_TOKEN: "synthetic-private-blob-token",
};
const path = "blog/2026/10/01234567-89ab-4cde-8012-3456789abcde-diagram.webp";
const url = `https://fixturestore.public.blob.vercel-storage.com/${path}`;
const body = (
  metadata = { type: "image/webp", size: 2048 },
  pathname = path,
) => ({
  type: "blob.generate-client-token",
  payload: {
    pathname,
    multipart: false,
    clientPayload: JSON.stringify(metadata),
  },
});
const request = (
  data: unknown = body(),
  authenticated = true,
  origin = "https://frontend.example",
) =>
  new Request("https://frontend.example/api/blog-admin/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      ...(authenticated
        ? {
            Authorization: `Basic ${Buffer.from(`${env.URL_ADMIN_USERNAME}:${env.URL_ADMIN_PASSWORD}`).toString("base64")}`,
          }
        : {}),
    },
    body: JSON.stringify(data),
  });
beforeEach(() => {
  vi.mocked(handleUpload).mockImplementation(async (options) => {
    const payload = options.body as ReturnType<typeof body>;
    await options.onBeforeGenerateToken(
      payload.payload.pathname,
      payload.payload.clientPayload,
      payload.payload.multipart,
    );
    return {
      type: "blob.generate-client-token",
      clientToken: "scoped-synthetic-client-token",
    };
  });
});
afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

it("rejects anonymous, wrong owner, cross-origin and unconfigured uploads before invoking Blob", async () => {
  expect(
    (await authorizeBlogImageUpload(request(body(), false), env)).status,
  ).toBe(401);
  expect(
    (
      await authorizeBlogImageUpload(request(), {
        ...env,
        URL_ADMIN_PASSWORD: "a-different-owner-password-00000000000",
      })
    ).status,
  ).toBe(401);
  expect(
    (
      await authorizeBlogImageUpload(
        request(body(), true, "https://evil.example"),
        env,
      )
    ).status,
  ).toBe(403);
  expect(
    (
      await authorizeBlogImageUpload(request(), {
        ...env,
        BLOB_READ_WRITE_TOKEN: "",
      })
    ).status,
  ).toBe(503);
  expect(handleUpload).not.toHaveBeenCalled();
});
it("authorizes an owner with server-enforced MIME, exact size, expiry, suffix and no overwrite/callback", async () => {
  const response = await authorizeBlogImageUpload(request(), env);
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(await response.json()).toEqual({
    type: "blob.generate-client-token",
    clientToken: "scoped-synthetic-client-token",
  });
  const options = vi.mocked(handleUpload).mock.calls[0][0];
  expect(options.token).toBe(env.BLOB_READ_WRITE_TOKEN);
  expect(options.onUploadCompleted).toBeUndefined();
  const policy = await options.onBeforeGenerateToken(
    path,
    body().payload.clientPayload,
    false,
  );
  expect(policy).toMatchObject({
    allowedContentTypes: ["image/webp"],
    maximumSizeInBytes: 2048,
    addRandomSuffix: true,
    allowOverwrite: false,
  });
  expect(policy.validUntil).toBeGreaterThan(Date.now());
  expect(policy.validUntil).toBeLessThanOrEqual(Date.now() + 10 * 60 * 1000);
});
it.each([
  ["image/svg+xml", 100, 422],
  ["text/html", 100, 422],
  ["image/webp", maximumImageBytes + 1, 413],
  ["image/webp", 0, 422],
  ["image/webp", 1.5, 422],
  ["image/png", 100, 422],
])("rejects %s at %d bytes", async (type, size, status) => {
  expect(
    (
      await authorizeBlogImageUpload(
        request(body({ type: String(type), size: Number(size) })),
        env,
      )
    ).status,
  ).toBe(status);
});
it("rejects arbitrary paths, multipart, malformed JSON/metadata, completion events and large authorization bodies", async () => {
  for (const pathname of [
    "unrelated/file.webp",
    "blog/../../a.webp",
    "blog/image.svg",
  ])
    expect(
      (await authorizeBlogImageUpload(request(body(undefined, pathname)), env))
        .status,
    ).toBe(400);
  expect(
    (
      await authorizeBlogImageUpload(
        request({ type: "blob.upload-completed", payload: {} }),
        env,
      )
    ).status,
  ).toBe(400);
  expect(
    (
      await authorizeBlogImageUpload(
        request({ ...body(), payload: { ...body().payload, multipart: true } }),
        env,
      )
    ).status,
  ).toBe(400);
  expect(
    (
      await authorizeBlogImageUpload(
        request({
          ...body(),
          payload: { ...body().payload, clientPayload: "{" },
        }),
        env,
      )
    ).status,
  ).toBe(400);
  expect(
    (await authorizeBlogImageUpload(request({ extra: "x".repeat(20000) }), env))
      .status,
  ).toBe(413);
});
it("redacts SDK errors, including Blob and backend credentials", async () => {
  vi.mocked(handleUpload).mockRejectedValue(
    new Error(`${env.BLOB_READ_WRITE_TOKEN} ${env.OWNER_API_TOKEN}`),
  );
  const response = await authorizeBlogImageUpload(request(), env);
  expect(response.status).toBe(503);
  const text = await response.text();
  expect(text).not.toContain(env.BLOB_READ_WRITE_TOKEN);
  expect(text).not.toContain(env.OWNER_API_TOKEN);
});
it("sanitizes filenames and makes unique immutable paths with correct extensions", () => {
  const file = { name: "../../Díagram <script>.jpeg", type: "image/webp" };
  const first = imagePath(file, new Date("2026-10-01T00:00:00Z"));
  expect(first).toMatch(imagePathPattern);
  expect(first).toMatch(/-diagram-script\.webp$/);
  expect(imagePath(file)).not.toBe(first);
  for (const type of ["image/jpeg", "image/png", "image/webp", "image/avif"])
    expect(imageValidation({ type, size: maximumImageBytes })).toBe("");
});
it("uploads directly with the SDK, real progress and cancellation signal; validates returned URL", async () => {
  const file = new File(["image"], "Diagram.webp", { type: "image/webp" });
  vi.mocked(upload).mockImplementation(async (_, uploaded, options) => {
    expect(uploaded).toBe(file);
    options.onUploadProgress?.({ loaded: 4, total: 5, percentage: 80 });
    return {
      url,
      pathname: path,
      contentType: "image/webp",
      contentDisposition: "inline",
      downloadUrl: `${url}?download=1`,
      etag: "fixture-etag",
    };
  });
  const controller = new AbortController(),
    progress = vi.fn();
  expect(await uploadBlogImage(file, controller.signal, progress)).toBe(url);
  const options = vi.mocked(upload).mock.calls[0][2];
  expect(options).toMatchObject({
    access: "public",
    handleUploadUrl: "/api/blog-admin/upload",
    abortSignal: controller.signal,
    multipart: false,
  });
  expect(JSON.parse(options.clientPayload!)).toEqual({
    type: "image/webp",
    size: 5,
  });
  expect(progress.mock.calls.map(([value]) => value)).toEqual([
    { phase: "preparing" },
    { phase: "uploading", percentage: 80 },
    { phase: "complete" },
  ]);
  expect(JSON.stringify(options)).not.toContain(env.BLOB_READ_WRITE_TOKEN);
});
it.each([
  "data:image/png;base64,test",
  "javascript:alert(1)",
  "http://fixturestore.public.blob.vercel-storage.com/blog/a.png",
  "https://evil.example/a.png",
  "https://fixturestore.public.blob.vercel-storage.com/unrelated.png",
])("rejects unsafe/malformed Blob response %s", async (unsafe) => {
  expect(publicBlobImageUrl(unsafe)).toBe(false);
  vi.mocked(upload).mockResolvedValue({ url: unsafe, pathname: path } as any);
  await expect(
    uploadBlogImage(
      new File(["x"], "a.webp", { type: "image/webp" }),
      new AbortController().signal,
      vi.fn(),
    ),
  ).rejects.toThrow("Unexpected image upload response");
});
it("handles expired authorization, network failure and cancellation without returning an insertion URL", async () => {
  const file = new File(["x"], "a.webp", { type: "image/webp" });
  vi.mocked(upload).mockRejectedValue(new Error("client token expired"));
  await expect(
    uploadBlogImage(file, new AbortController().signal, vi.fn()),
  ).rejects.toThrow("permission expired");
  vi.mocked(upload).mockRejectedValue(new Error("private provider details"));
  await expect(
    uploadBlogImage(file, new AbortController().signal, vi.fn()),
  ).rejects.toThrow("Check your connection");
  const controller = new AbortController();
  vi.mocked(upload).mockImplementation(async () => {
    controller.abort();
    throw new Error("aborted");
  });
  await expect(
    uploadBlogImage(file, controller.signal, vi.fn()),
  ).rejects.toThrow("cancelled");
});
it("inserts at the captured cursor/selection and preserves paragraphs; cursor follows image syntax", () => {
  const content = "First paragraph.\n\nSecond paragraph.";
  const inserted = insertMarkdownImage(
    content,
    { start: 18, end: 18 },
    "Alt text",
    "https://example.test/image.webp",
  );
  expect(inserted.content).toBe(
    "First paragraph.\n\n![Alt text](https://example.test/image.webp)\n\nSecond paragraph.",
  );
  expect(inserted.content.slice(inserted.cursor)).toBe("\n\nSecond paragraph.");
  expect(
    insertMarkdownImage("before SELECT after", { start: 7, end: 13 }, "", url)
      .content,
  ).toBe(`before \n\n![](${url})\n\n after`);
  expect(
    insertMarkdownImage("", { start: 0, end: 0 }, "A [diagram] \\ example", url)
      .content,
  ).toContain("![A \\[diagram\\] \\\\ example]");
});
it("renders inserted Blob images immediately through the unchanged safe public pipeline; legacy assets still work", () => {
  const content = insertMarkdownImage(
    "First paragraph.\n\nSecond paragraph.",
    { start: 18, end: 18 },
    'Diagram "alt"',
    url,
  ).content;
  const html = renderBlog(content);
  expect(html).toContain(`src="${url}"`);
  expect(html).toContain('alt="Diagram &quot;alt&quot;"');
  expect(renderBlog("![Old](/blog-assets/old.png)")).toContain(
    "/blog-assets/old.png",
  );
  expect(
    renderBlog(
      `<img src="${url}" onerror="attack()" onclick="attack()" style="position:fixed"><img src="data:image/png;base64,AA"><script>attack()</script><iframe src="${url}"></iframe>`,
    ),
  ).not.toMatch(/onerror|onclick|style=|data:|<script|<iframe/);
  expect(
    validateBlogInput({
      title: "Post",
      slug: "en/post",
      language: "en",
      coverImage: url,
      content,
      categories: [],
      author: "",
      anonymous: false,
      excerpt: "",
      status: "draft",
    }),
  ).toEqual({});
});
