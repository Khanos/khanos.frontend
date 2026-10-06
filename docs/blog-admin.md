# Private blog admin

The admin reuses the portfolio architecture. No backend or content files were
changed. Image authoring adds the official Blob SDK; see [Blog images](blog-images.md)
for setup, security, direct uploads and verification. The public blog continues
fetching MongoDB-backed API data at runtime with its existing 60-second cache.
Publishing content needs no Git commit, frontend build, or redeployment.
Installing this new admin feature does require a normal application deployment.

## Routes and setup

- `/admin/blog`: dashboard, status/language filters and pagination.
- `/admin/blog/new`: new Markdown post.
- `/admin/blog/:id`: edit an existing post.
- `/api/blog-admin`: GET summaries, POST new post.
- `/api/blog-admin/:id`: GET full admin post, PATCH, DELETE.
- `/api/blog-admin/preview`: POST Markdown, return sanitized HTML.
- `/api/blog-admin/upload`: POST owner-authenticated client-upload authorization metadata.

The shared owner boundary also requires backend Redis admission support
described in [Short URL security and rollout](short-url-security.md). Configure
them before deployment; missing production controls fail closed for blog routes,
including preview and Blob upload authorization.

Use the existing owner credentials in server-side Vercel environment variables:
`URL_ADMIN_USERNAME`, `URL_ADMIN_PASSWORD`, `OWNER_API_TOKEN`, optionally
`BACKEND_TIMEOUT_MS` (default 8000, maximum 30000). The URL-prefixed credential
names are retained for compatibility with the URL admin. Username is 1–64 ASCII
letters/digits/underscore/dot/hyphen; password and owner token are distinct,
32–256 printable non-space ASCII characters. Enter secrets in Vercel/local
environment configuration, never source control or chat. `.env.example` contains
names only. `PUBLIC_BACKEND_API_URL` is the credential-free public API base,
ending in `/api/` (HTTPS in production), already used by the public blog.

Reuse the repository's HTTP Basic owner authentication. The browser's built-in
login sends the separate owner credentials to the frontend over HTTPS. The
browser never receives the backend bearer token; only server code reads
`process.env.OWNER_API_TOKEN`. Browser fetches are same-origin. Basic credentials
are managed by the browser rather than a new application session/cookie; there
is no logout button/session expiry mechanism. Close the private browser session
to discard cached browser credentials. This interface shares owner access with
the existing URL tool. Do not reuse the backend token as the owner password.

All admin pages and APIs fail closed without configured secrets, reject
cross-origin mutations, disable caches, reject framing, and advertise noindex.
Private pages suppress shared analytics and Astro client navigation. Draft
content is kept in component memory only; there is no localStorage draft cache.
Every preview uses `renderBlog` on the server, with exactly the public sanitizer
and image resolution behavior. Markdown is never evaluated as MDX.

The editor suggests slugs only for a new, uncustomized slug. Existing slugs are
preserved; published URLs/languages are locked until explicitly enabled and
changing the slug requires confirmation. Relocking discards URL/language edits.
Publication dates are entered in the browser's local timezone and sent as ISO
UTC. Unchanged dates retain their original timestamp precision. A future date
with Publish sends `status: published`. Clearing an existing publication date
and choosing Publish sends the current timestamp (including publish-now for a
scheduled article). A blank date on a new publication is omitted so the backend
assigns it. Saving an existing publication as draft requires confirmation.

## Backend integration notes

The supplied field/endpoint contract is unchanged. Response envelopes and
validation limits were unspecified; confirm these details with the backend
implementation before real owner writes:

- GET `/api/blog/admin` uses the same envelope as the existing public list:
  `{ data: BlogPostSummary[], pagination: { page, limit, total, pages } }`.
  Filters: `status=draft|published`, `language=en|es`, positive page, limit 1–50
  (UI uses 25). Scheduled posts remain under the published filter.
- GET `/api/blog/admin/:id`, POST `/api/blog`, and PATCH `/api/blog/:id` return a
  full `BlogPost` directly. ID format follows the existing frontend contract:
  lowercase 24-character MongoDB hexadecimal ID. Drafts may omit publishedAt
  and have readingMinutes 0; publishedAt/displayDate otherwise remain optional.
- DELETE accepts any successful 2xx result (including 204); it needs no body.
- POST/PATCH submit only writable fields from the shared contract; no ID,
  timestamps, readingMinutes, or secrets from the client are forwarded.
  PATCH sends the complete edited input; server-owned `displayDate` is retained.
- Duplicate slugs should return 409. Validation should return 400/422, optionally
  `{ errors: { fieldName: ... } }` or `{ fields: { fieldName: ... } }`.
  The proxy exposes only known field names with frontend messages; arbitrary
  backend error text and values are never relayed. Other validation shapes show
  a general validation message. Array issue details are not currently mapped.
- Frontend limits: title 300 chars, author 200, excerpt 2000, slug 240,
  HTTPS cover URL 2048, content 400000, categories up to 30 of 100 chars each;
  incoming JSON maximum 512 KiB. Title/content/cover are required for drafts and
  publications. These are frontend bounds, not an asserted backend contract.
  Existing backend-relative covers are resolved to absolute HTTPS URLs in the
  editor; covers on external HTTPS hosts need no new image upload abstraction.
- The backend must enforce unique slugs and exclude drafts and future-dated
  publications from public list/detail/sitemap data. Scheduling is backend-owned;
  no frontend timer or cron publishes a post. Omitting publishedAt when first
  publishing lets the backend assign it. Draft status always hides the post.

## Verification and V1 boundaries

Unit tests cover validation, proxy filtering/token isolation, owner boundaries,
CSRF, error redaction and preview sanitization. Playwright uses an isolated
synthetic backend to cover draft/create/reload/edit/schedule/publish/delete,
public visibility, confirmations, validation/duplicate errors, mobile/desktop
layout, privacy and preview. `test:runtime` exercises the generated Vercel
handler and scans static browser assets for server credentials/modules.

These checks prove integration against the documented fixture, not live MongoDB
or deployed Vercel configuration. No real owner writes or deployment are part
of this work. Existing build hints/bundle-size warnings remain. There is no
configured lint script; `astro check` supplies repository type/static checks.

Cover/inline image uploads now use Vercel Blob, including cursor insertion,
alt text, preview and clipboard paste. Supply server-only `BLOB_READ_WRITE_TOKEN`
from a connected public store. See [Blog images](blog-images.md).

Useful later additions: media management and image optimization, explicit
session logout/expiry if HTTP Basic becomes inconvenient, optional slug redirects
when moving a published URL, and edit conflict detection if multiple tabs/users
edit the same post. None is needed for the personal V1 interface.

## Implementation files and verified results

New files:

- `src/components/blog-admin/Dashboard.tsx`
- `src/components/blog-admin/Editor.tsx`
- `src/components/blog-admin/client.ts`
- `src/services/blog-admin-contract.ts`
- `src/server/blogAdmin.ts`
- `src/pages/admin/blog/index.astro`
- `src/pages/admin/blog/new.astro`
- `src/pages/admin/blog/[id].astro`
- `src/pages/api/blog-admin/index.ts`
- `src/pages/api/blog-admin/[id].ts`
- `src/pages/api/blog-admin/preview.ts`
- `src/styles/blog-admin.css`
- `tests/unit/blog-admin.test.ts`
- `tests/e2e/blog-admin.spec.ts`
- `docs/blog-admin.md`
- `docs/BLOG_ADMIN_HANDOFF.md`

Updated files:

- `AGENTS.md`: discoverable entry point to the blog admin handoff.

- `src/server/ownerAuth.ts`: extend the existing protected boundary.
- `src/layouts/Layout.astro`: noindex metadata for private owner pages.
- `.env.example`: clarify shared owner environment names, without values.
- `README.md`: link to admin setup and integration notes.
- `tests/api-fixture.mjs`: local admin CRUD and public scheduling visibility.
- `tests/build-runtime.mjs`: generated-handler admin checks and browser asset scan.

Verified on 2026-10-04:

- `npm test`: 37 passing unit tests.
- `npm run test:e2e`: all 39 browser tests pass, including all existing public
  blog/homepage/tool checks and six new admin tests. Admin desktop/mobile editor
  screenshots were inspected (1440px/375px).
- `npm run build`: Astro checks pass with zero errors/warnings and five existing
  hints; production build succeeds. Existing bundle-size warning remains.
- `npm run test:runtime`: public articles, charts, sanitizer, sitemap, 404,
  protected admin pages, CRUD, scheduling and preview pass through the generated
  Vercel handler; 15 static browser assets pass the server-secret/module scan.
  The production build was also run with synthetic owner token/password sentinels
  set in the environment, so the scan checks actual build-time secret isolation.
- `git diff --check`: clean. No lint script is configured.

`pnpm` is not installed in this shell, so repository scripts were invoked with
npm using the installed dependencies; neither lockfile changed. Local Node is
26.7.0; the existing Vercel configuration targets Node 24. No deployed-runtime or
live MongoDB write test was performed. Run the build and dev browser suite
sequentially: concurrent runs share Vite's dependency cache and can mix React
production/development runtimes. The standalone rerun passed all browser checks.
