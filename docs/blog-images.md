# Blog admin images

Image support extends the existing React Markdown editor and Astro owner API.
Post creation, drafts, editing, scheduling, publishing and public runtime reads
still use `Blog Admin → Astro → khanos.backend → MongoDB`. MongoDB stores the
existing `coverImage` HTTPS URL and Markdown content containing `![alt](URL)`.
Image bytes go directly from the authenticated browser to public Vercel Blob.
There is no backend change, content-file generation, base64 Markdown or Git media.

## Setup and deployment

1. In Vercel Storage, create a **public** Blob store and connect it to this
   frontend project. Select Production, Preview and Development as appropriate.
   Prefer a separate store for development/preview if those uploads should not
   accumulate in production.
2. The connection supplies **`BLOB_READ_WRITE_TOKEN`**. This is the only new
   required environment variable. Keep it in the server environment/secret
   manager. Never use a `PUBLIC_` prefix or put it in HTML, browser storage,
   client-readable cookies, URLs, source control or chat.
3. Retain `URL_ADMIN_USERNAME`, `URL_ADMIN_PASSWORD`, `OWNER_API_TOKEN`,
   `PUBLIC_BACKEND_API_URL` and optional `BACKEND_TIMEOUT_MS` from the existing
   [admin setup](blog-admin.md). No second authentication system is introduced.
4. Deploy this application change normally after connecting the store. New
   environment configuration requires a new deployment. Publishing a post
   continues to require only a runtime CRUD request.
5. For local development, privately supply the token to the Astro process's
   server environment (as with the existing owner secrets). Keep any local
   environment file untracked; `.env.example` intentionally leaves it blank.

Without the new variable, uploads fail with a setup message; the URL field and
existing CRUD still work. Public storage means anyone with an uploaded image's
URL can read it, including images uploaded while writing an unpublished draft.
V1 has no upload completion webhook or callback environment variable.

## Authorization and direct upload

`POST /api/blog-admin/upload` fits the existing `/api/blog-admin` route family.
Astro's owner middleware verifies HTTP Basic credentials and exact Origin before
executing the route, applies no-store/noindex/frame protection, and fails closed.
The handler independently calls the same `authorizeOwner` function as defense
in depth. Anonymous callers and cross-origin mutations cannot obtain tokens.

The route accepts at most 16 KiB of JSON authorization metadata. It accepts only
the SDK's `blob.generate-client-token` event, one safe image path, non-multipart
uploads and valid MIME/size metadata. It never proxies image bytes. The official
SDK signs a client token on the server, scoped to:

- JPEG, PNG, WebP or AVIF, narrowed to the selected MIME type.
- The declared file size, capped at **10,000,000 bytes (10 MB)**; Blob enforces
  the real upload's size/type limits even if a client lies about its metadata.
- The selected immutable `blog/YYYY/MM/<uuid>-<safe-name>.<extension>` path.
- A ten-minute lifetime, `addRandomSuffix: true` and `allowOverwrite: false`.

The browser uses `upload` from `@vercel/blob/client` with `access: 'public'`.
Only the scoped client token reaches the browser. The read/write token stays
server-side. The result must contain a matching pathname and a credential-free
HTTPS URL on a public Blob hostname under the blog image path, with no query or
fragment. Provider error text is not relayed verbatim.

The implementation pins **`@vercel/blob` 2.8.0** (Node >=20), verified against
the registry and installed SDK on 2026-10-04. The repository uses Astro 7.3.2,
Vercel adapter 11.0.10, React 18 and targets Node 24. Current references:
[client uploads](https://vercel.com/docs/vercel-blob/client-upload),
[progress and aborting uploads](https://vercel.com/docs/vercel-blob/examples),
[SDK source](https://github.com/vercel/storage/blob/main/packages/blob/src/client.ts).
In this SDK, `onUploadCompleted` is optional. V1 omits it because Save owns
persistence; this also avoids creating a webhook exception to owner login.

## Authoring behavior

**Cover:** choose Upload cover image (or Replace image), select/drop one file,
then Upload image. Real SDK progress is displayed. Success changes only
`form.coverImage` and its preview. Existing external HTTPS covers remain editable
in the URL field. Failure/cancellation preserves the previous value. Remove
clears the form value; the existing required-cover validation still prevents
saving without a cover. Replacement uploads a new object and never deletes or
overwrites the previous object.

**Inline:** position the cursor or select text, click **Image**, choose/drop an
image, enter alt text and select **Add image**. The dialog captures the editor
selection before moving focus. It replaces that exact selection with Markdown,
adds only missing paragraph separators and places the cursor immediately after
the image syntax. The article stays locked while the dialog is open, avoiding
stale insertion positions. Alt text is encouraged and Markdown-escaped; a blank
value is allowed for decorative images. Ctrl/Cmd+V with an image opens the same
dialog with the image selected, so alt text is still available. Text-only paste
retains the editor's normal behavior. Upload handles one image at a time.

The existing preview reacts to the new Markdown immediately, before saving.
It uses exactly the public `renderBlog` pipeline. Native `<dialog>` provides
modal focus/keyboard behavior without a new UI library. Cancel/Escape aborts the
upload and restores editor focus/selection without inserting syntax. Failed
uploads show an error, preserve text/cover, and allow retry with fresh permission.
Save, Publish, Delete and editor fields are disabled while the dialog is open.
Leaving the editor during that state triggers the existing unsaved-work warning.

Client validation rejects unsupported/empty/oversized files. The upload utility
handles expired permission, authorization/configuration failure, network/provider
errors, cancellation and malformed results. Percentages come from SDK progress
events; preparing/authorization uses an indeterminate progress bar.

## Public rendering and compatibility

No sanitizer allowlists were widened. Existing `markdown-it → sanitize-html`
still strips scripts, embeds, event handlers, unsafe URL schemes, data URLs and
arbitrary styles. Its safe HTTPS image support already handles Blob URLs. The
existing limited percentage styles used by survey charts remain intact.

Shared `.blog-content img` styles constrain width to the article, preserve aspect
ratio and add spacing/rounded corners in the existing light/dark design. Inline
images have no forced dimensions. These styles also apply in the admin preview.

`astro.config.mjs` retains the backend `/blog-assets/**` remote pattern and adds
only HTTPS `*.public.blob.vercel-storage.com` images beneath `/blog/**`, with no
non-default port. The store hostname is not yet fixed, so this narrow public
Blob host family supports the connected store across environments. It does not
allow all remote domains. Existing external HTTPS covers retain Astro's prior
unoptimized behavior. The configuration follows current
[Astro remote pattern documentation](https://docs.astro.build/en/reference/configuration-reference/#imageremotepatterns).

## BACKEND INTEGRATION NOTES

**No changes required by this implementation.** The frontend submits the same
JSON contract: `coverImage: "https://<store>.public.blob.vercel-storage.com/blog/…"`
and `content: "…\n\n![Alt text](https://…/blog/…)\n\n…"`. The frontend's existing
HTTPS cover validation accepts those URLs. The isolated CRUD fixture proves
that they survive save/reopen/publish. No backend files were modified.

Live backend validation and a real deployed Blob transfer have not been exercised
by these tests. If a deployed backend applies an additional image-host allowlist,
it must accept the connected public Blob store's HTTPS blog image URLs while
keeping its credential/scheme protections. Do not bypass that validation.

## Verification and V2

`tests/unit/blog-images.test.ts` mocks the SDK for owner/CSRF policy, accepted and
rejected images, size limits, path safety, expiry, immutability, redacted errors,
progress, cancellation, malformed URLs, exact cursor/selection insertion,
alt escaping, safe Markdown rendering and legacy image compatibility.

`tests/e2e/blog-images.spec.ts` runs the real SDK against the actual local Astro
authorization route using an explicitly synthetic signing secret. It intercepts
all Blob writes and image delivery. It covers cover/replace/remove, inline
position/selection, preview, draft save/reopen, schedule/publish/public rendering,
desktop/mobile layout, dark mode, failure/retry, invalid/large files, dialog drop,
clipboard paste, disabled actions and cancellation. Test screenshots live in
ignored `test-results/`. Optimized cover image delivery is mocked, so these tests
do not assert deployed Sharp/network behavior or Blob service availability.

`tests/build-runtime.mjs` checks upload authorization through the generated
Vercel handler and scans static assets for the actual Blob secret,
token-generation code and existing owner credentials. The official SDK contains
the generic Blob environment variable name in shared fallback/error code; its
presence alone is not a leaked value. Build with synthetic
sentinels from `tests/server.mjs` for a build-time isolation check. Run unit tests,
build/runtime checks and browser tests sequentially; build and dev share Vite's
cache. There is no configured lint script; `astro check` is the project's static
and type validation.

Verified locally on 2026-10-04:

- `npm test`: **57 passed**, including 20 new image unit cases.
- `npm run test:e2e`: **44 passed**, including five new image browser tests and
  all existing admin, public blog, homepage and tool checks.
- `npm run build`: succeeds; Astro check reports **0 errors, 0 warnings and
  five existing hints**. The existing large-chunk warning remains.
- `npm run test:runtime`: passes the generated Vercel handler checks, real SDK
  token constraints, sanitized image preview and secret scan of **15 client assets**.
  The production build used synthetic Blob/owner secret sentinels.
- `git diff --check`: clean. No lint command is configured.
- Desktop (1440px) and mobile (375px) authoring/public screenshots and the image
  dialog were visually inspected, including light/dark public image presentation.

This shell uses Node 26.7.0; the generated Vercel function remains configured for
the repository's Node 24 target. The SDK was added with pinned pnpm 9.15.9 and
the maintained pnpm lockfile; the legacy package lock was left unchanged.
Local sandbox port restrictions required running browser tests outside the
sandbox against owned loopback fixtures. No deployed storage transfer, real
MongoDB write or application deployment was performed.

V1 preserves original image quality and transparency, with no conversion or
heavy main-thread/server processing. Later improvements can add off-main-thread
resize/WebP conversion with screenshot/diagram quality controls, precise drop
placement inside the textarea, a media library, and deliberate orphan cleanup.
Precise textarea drop position is deferred because a plain textarea lacks a
reliable cross-browser drop-to-text-offset API; dropping inside the upload dialog
is supported. Unused images, abandoned drafts, replacement images, deleted
Markdown references and deleted posts leave Blob objects intact. Cleanup must
consider shared references before deleting anything.

## Files

- `src/services/blog-images.ts`: shared type/size/path/URL policy.
- `src/server/blogImageUpload.ts`, `src/pages/api/blog-admin/upload.ts`: owner-protected token authorization.
- `src/components/blog-admin/image-upload.ts`: reusable direct-upload utility.
- `src/components/blog-admin/markdown-image.ts`: pure cursor/selection insertion.
- `BlogImageUploader.tsx`, `ImageUploadDialog.tsx`, `CoverImageField.tsx`: reusable picker, modal and cover UI in `src/components/blog-admin/`.
- `src/components/blog-admin/Editor.tsx`: integrates cover, inline and paste flows.
- `src/styles/blog-admin.css`, `src/styles/blog-content.css`: dialog, progress, preview and responsive images.
- `astro.config.mjs`, `package.json`, `pnpm-lock.yaml`, `.env.example`: SDK and deployment/image configuration.
- `tests/unit/blog-images.test.ts`, `tests/e2e/blog-images.spec.ts`, `tests/server.mjs`, `tests/build-runtime.mjs`: verification.
- `README.md`, `docs/blog-admin.md`, `docs/BLOG_ADMIN_HANDOFF.md`, this document: setup and discoverable integration notes.
