# khanos.frontend

My portfolio: experience, skills and projects. Live at
**[khanos-frontend.vercel.app](https://khanos-frontend.vercel.app)**.

Built with Astro, TypeScript and Tailwind CSS, with React used for the interactive islands and
deployed to Vercel through `@astrojs/vercel`. The build handles image optimization (`sharp`), HTML
compression, a generated sitemap and `robots.txt`.

It has been through Angular, Vue, vanilla JavaScript and Next.js before landing here. Roughly the
same content each time — rebuilding it is how I get a feel for a framework's edges rather than its
tutorial.

## Project Structure

- `src/components`: This directory contains all the Astro components used in the project.
- `src/data`: This directory contains TypeScript files that export data used in the project.
- `src/pages`: This directory contains the Astro pages of the portfolio.
- `public`: This directory contains static files served by the portfolio.

## Getting Started

First, install the dependencies:

```sh
pnpm install --frozen-lockfile
```

Then, start the development server:

```sh
pnpm dev
```

## Backend integration and owner access

Public GitHub search and numeric short-link redirects use `PUBLIC_BACKEND_API_URL`
(default `https://khanos-backend.herokuapp.com/api/`). Set this public, credential-free
HTTPS base URL with a trailing slash in both build and runtime environments. Development
allows HTTP only on loopback. Public browser reads omit credentials, check HTTP/JSON
contracts and have an eight-second deadline. A provider failure is shown as a retryable
error; missing short links redirect home, a dependency outage returns 503 and
upstream throttling remains uncached 429 with validated retry timing. Numeric
resolution uses a server-only authenticated relay; the browser never receives
its token. Short links and destinations are public, including legacy codes.

`/url` is owner administration. The browser's standard HTTP Basic prompt accepts a
separate owner username/password. Astro protects the page and every `/api/url-admin`
operation before contacting the backend, then supplies the backend bearer token from
server secrets. Provision these deployment secrets privately:

- `URL_ADMIN_USERNAME`: 1-64 letters, digits, dots, underscores or hyphens.
- `URL_ADMIN_PASSWORD`: 32-256 printable non-whitespace ASCII characters; generate a
  random password, separate from the backend token. Use the site over HTTPS.
- `OWNER_API_TOKEN`: the existing backend owner credential, 32-256 printable ASCII characters.
- `BACKEND_TIMEOUT_MS`: optional server request deadline, default 8000, range 1-30000.

Production owner access and numeric resolution also require the server-only
`RATE_LIMIT_SECRET`, matching the backend's dedicated `/api/admission` credential.
The backend uses its existing Heroku Redis to share four independent frontend
buckets across every Vercel instance and region. No Vercel plan change or Firewall
rule is required. Missing admission controls or Redis outages fail closed with 503.
Follow [Short URL security and rollout](docs/short-url-security.md) for policy,
backend-first deployment, bounded contracts and ingress checks.

The backend token is never sent to the browser or accepted from client input. Missing,
invalid or reused secrets disable administration with 503. Do not set secrets with a
`PUBLIC_` prefix. Use an untracked `.env` locally or the deployment secret manager; the
environment example intentionally leaves secrets blank. Browser Basic credentials are
cached by the browser; use a private browser session for owner work and close it when
finished. Rotation replaces deployment secrets and requires updating both sides together.

Mutation requests also require the frontend's exact Origin to prevent CSRF. API bodies
are limited to 16 KiB, and owner responses/short-link redirects are not cacheable. The
owner page omits tag-manager tracking and enters via a full navigation from Lab. URL lists
load 25 records at a time using the backend cursor; create/copy/delete remain available
after login. Existing four-digit padded links and new safe numeric codes resolve without
rewriting issued links or database records. No accounts, cookies or sessions are added.

Backend database/index/configuration rollout remains a separate operation: follow its
`docs/url-integrity-migration.md`. Merge/deploy the frontend and backend compatibility
PRs together after provisioning the secrets. The frontend normalizes legacy padding and
therefore works with both the canonical-only backend from PR #25 and its compatibility fix;
the backend fix additionally supports older frontend clients that still send padding.

## Building

To build the project for production, run:

```sh
pnpm build
```

This will create a dist directory with the built assets.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
## Testing

Use the pinned `pnpm@9.15.9` package manager and Node.js 24:

```sh
pnpm install --frozen-lockfile
pnpm test                          # writing, API and owner-boundary unit tests
pnpm test:watch                    # unit tests while editing
pnpm exec playwright install chromium  # one-time browser download
pnpm test:e2e                      # homepage and backend compatibility browser tests
pnpm build                        # Astro typecheck and production build
```

The same scripts can be run with `npm run` after installing with pnpm. The
legacy `package-lock.json` predates the current Astro dependencies; use the
maintained `pnpm-lock.yaml` for installs. Vitest covers publication dates,
latest-post selection, excerpt cleanup, and reading-time estimates. Playwright
covers homepage hierarchy, article routes, English/Spanish content, navigation
active states, and responsive layout at 1440px, 768px, and 375px.

Browser tests start and stop an isolated Astro development server on
`127.0.0.1:4335` and a native HTTP fixture on `127.0.0.1:4337`; leave those ports free.
Synthetic owner credentials replace local configuration in the test process. The new
tests cover owner denial/login, CSRF, list/create/copy/delete, pagination, old/new redirects,
safe provider text and GitHub failures in both languages. They block external requests such
as analytics and do not rely on production databases or providers. They verify development rendering;
the separate build checks production compilation, not a deployed Vercel runtime.

GitHub Actions runs unit tests, the build, and Chromium browser tests on pull
requests and pushes to `master`. Failed browser tests upload traces and
screenshots; test output is ignored by Git.

## Blog API

Private blog editing is available at `/admin/blog`, reusing the existing owner
login and server-only token proxy. See [Blog admin setup and backend integration](docs/blog-admin.md)
for routes, environment configuration, response-envelope assumptions and V1 limits.
Drafting, publishing, scheduling and deleting content use the backend at runtime;
publishing requires no content-file changes, Git commit, build or redeployment.

Cover and inline Markdown images can be uploaded directly to public Vercel Blob.
Connect a public store and supply server-only `BLOB_READ_WRITE_TOKEN`; the existing
owner login protects upload authorization. Inline images are inserted at the
captured cursor/selection with alt text and immediate preview. See
[Blog image setup, security and validation](docs/blog-images.md).

Blog content now comes from `khanos.backend` MongoDB over the existing
`PUBLIC_BACKEND_API_URL` configuration (set it at build and runtime; HTTPS base
ending in `/api/`). `/blog`, `/blog/[lang]/[slug]` and homepage Writing use server
fetches. Existing bilingual article URLs and card/chart styling are retained.
Article Markdown is rendered through `markdown-it` and sanitized with
`sanitize-html`; no database MDX or JavaScript is executed. Article metadata,
language, cover and canonical URL come from the post. Successful blog HTML can
be cached by a shared cache for 60 seconds; failures return uncached 503.

Types and runtime response guards live in `src/types/blog.ts` and
`src/services/blog.ts`. Lists contain summaries; bodies are fetched only for
articles. The original sources/assets and reproducible importer now belong to
the backend. Follow `khanos.backend/docs/blog.md`: import and verify the database,
release the backend, then release this frontend. Build does not contact the
blog API or require database credentials. No local content fallback is used.

Run `pnpm test`, `pnpm build`, and `pnpm test:e2e`. Browser tests use an isolated
synthetic API fixture; they do not prove production availability.
