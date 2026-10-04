# Private Blog Admin Handoff

- Date: 2026-10-04
- Status: implemented and locally verified; backend integration and merge/deployment remain pending.
- Read when: working on `/admin/blog`, owner authentication, blog writes, scheduling, or Markdown preview.
- Repository/branch: `khanos.frontend`, `feat/private-blog-admin`.
- Detailed reference: [setup, contract assumptions, file inventory and verification](blog-admin.md).

## Decisions to preserve

The public blog still fetches MongoDB-backed content at runtime through the
existing backend API and uses its existing 60-second cache. Publishing content
requires no generated files, Git commit, frontend rebuild, or deployment.
Deploying the admin feature itself is a normal application deployment.

Admin pages are `/admin/blog`, `/admin/blog/new`, and `/admin/blog/:id`.
React islands call same-origin `/api/blog-admin` routes. The existing owner
middleware uses HTTP Basic credentials (`URL_ADMIN_USERNAME` and
`URL_ADMIN_PASSWORD`), independently of `OWNER_API_TOKEN`. Only server code adds
the backend bearer token. Keep secrets out of browser bundles, HTML, URLs,
client storage and committed files. Private routes are uncached, unframed,
noindex, and omit analytics. Mutations require a matching Origin.

Preview calls `renderBlog` on the server, sharing the public Markdown renderer
and sanitizer. Do not enable MDX execution or weaken sanitization. Published
slugs are locked by default; explicit URL changes require confirmation.
Scheduling sends `status: published` with a future ISO timestamp; the backend
owns public visibility and timestamp assignment. No frontend publishing cron.
Images use HTTPS URLs; cover and inline uploads now use direct Vercel Blob client
uploads. See [Blog images](blog-images.md) for the token endpoint, environment,
cursor/paste behavior, tests and safe orphan retention. The new server-only
secret is `BLOB_READ_WRITE_TOKEN`; the existing owner boundary remains intact.

## Verification and next work

Local checks passed: 37 unit tests, all 39 Playwright tests, Astro checks,
production build, generated Vercel-handler checks, and a scan of 15 browser
assets for server credentials/modules. Mobile/desktop editor screenshots were
inspected at 375px and 1440px. Tests use isolated synthetic backend fixtures;
no live MongoDB writes or production deployment were performed.

Run `npm test`, `npm run build`, `npm run test:runtime`, then
`npm run test:e2e` sequentially (or the equivalent pnpm scripts). Build and dev
browser tests share Vite's cache and must not run together. This shell lacked
pnpm and used Node 26.7.0; CI and Vercel target Node 24. Existing hints and
bundle-size warnings remain. No dependencies or lockfiles changed.

Before live writes, confirm the response envelopes, draft reading-time values,
duplicate-slug status, validation limits, and schedule filtering described in
`blog-admin.md`. Keep the separate backend instance's work intact: no backend
files were changed here. Merge/deploy only when separately requested.
A code rollback should revert the feature as a unit; it does not roll back
MongoDB content or publish/delete operations.

## Image support validation (2026-10-04)

The Blob image extension passes 57 unit tests, all 44 Playwright tests, Astro
checks, production build and generated-handler/secret-isolation checks. Desktop
and mobile screenshots of cover/inline authoring, the image dialog and public
images were inspected. Tests use synthetic owner/Blob credentials, intercept
storage writes and mock optimized cover delivery; they do not prove a real
deployed Blob transfer. Follow [Blog images](blog-images.md) for the complete
setup, file inventory and V1/V2 boundaries before deploying.
