# Repository Guide

## Scope and discovery

This repository is a personal portfolio with a bilingual blog and small tools.
Follow the parent `/home/epi/Work/AGENTS.md` as well as this file. Before system
or tooling work, consult the parent's questlog index for relevant handoffs.

Prefer codebase-memory MCP for structural discovery. The graph project is
`home-epi-Work-khanos.frontend`. Confirm index status at session start, search
symbols before reading snippets, and trace relevant callers/callees. Check
coverage for evidence paths; read source directly when coverage is incomplete
or graph relationships are insufficient, especially in Astro templates.
Use `rg` for literals, configuration, documentation, and source fallbacks.

## Related agent handoffs

Before changing private blog administration, owner access, scheduling, or preview,
read [Private Blog Admin Handoff](docs/BLOG_ADMIN_HANDOFF.md). It points to the
implementation, setup, backend contract assumptions, and verification evidence in
`docs/blog-admin.md`. Preserve the server-only owner-token boundary and runtime
public blog architecture described there.

## Stack and commands

- Astro with TypeScript, Tailwind CSS, and React interactive islands.
- Server output with the Vercel adapter; blog articles render on demand from the backend.
- Node.js `24.x`; package manager pinned to `pnpm@9.15.9` in `package.json`.
- `pnpm install`: install dependencies.
- `pnpm dev`: start the development server.
- `pnpm test`: run Vitest unit tests; `pnpm test:watch`: watch unit tests.
- `pnpm test:e2e`: run Playwright homepage checks. Install Chromium once with
  `pnpm exec playwright install chromium`; tests manage an isolated server on port 4335.
- `pnpm exec astro check`: run Astro/TypeScript checks.
- `pnpm build`: run `astro check` followed by `astro build`.
- `pnpm test:runtime`: after build, exercise Vercel's generated handler with
  require(ESM) disabled and synthetic API responses. Keep sanitize-html bundled
  via `vite.ssr.noExternal` so Vercel does not require its ESM-only parser.
- `pnpm preview`: invoke the configured Astro preview command; check adapter
  support before relying on it for production verification.

Prefer pnpm, matching package metadata and Vercel's build command. Both
`pnpm-lock.yaml` and `package-lock.json` exist; avoid unrelated lockfile churn
or deleting either without an explicit migration task.

## Code map

- `src/pages/`: file-based routes for the portfolio, blog, GitHub search,
  SVG conversion, URL shortener, and MercadoEpi.
- `src/layouts/Layout.astro`: shared document, header/footer, metadata,
  transitions, and language setup. Changes affect every page.
- `src/components/`: Astro presentation components and React islands grouped
  by tool (`github`, `url`, `SVGToComponent`, `MercadoEpi`, `configMenu`).
- `src/i18n/`: English/Spanish UI and portfolio content, language helpers.
- `src/services/index.ts`: fetch wrappers for GitHub search and URL-shortener
  endpoints. Endpoint availability must be verified separately from builds.
- `src/types/`: shared TypeScript types; `src/utils/`: helpers and SVG conversion.
- `src/data/`: local data; `src/assets/`: imported assets; `public/`: static files.
- `astro.config.mjs`: integrations, site URL, server output, and adapter.
- `tailwind.config.mjs`: styling configuration and typography plugin.

## Blog content flow

`src/services/blog.ts` fetches published summaries and full posts from the existing
`PUBLIC_BACKEND_API_URL`. Types are in `src/types/blog.ts`; runtime guards reject
invalid contracts. There is no local collection or content fallback.

`src/pages/blog.astro` lists summaries by language and page. `BlogList.astro` and
`Post.astro` retain the existing cards. `LatestWriting.astro` requests the latest
three summaries. `src/pages/blog/[lang]/[slug].astro` renders on demand, keeping
URLs such as `/blog/en/6-state-of-devs-2026-ai-workflow`. `blog-sitemap.xml.ts`
provides dynamic article URLs to the configured sitemap index.

Markdown source lives in backend MongoDB. `src/utils/blog-render.ts` sanitizes
HTML before rendering; do not evaluate database MDX/JavaScript or weaken its HTML,
URL or style allowlists. Portable survey figures reuse `src/styles/blog-content.css`.
Original posts/assets and explicit importer live in `khanos.backend`; follow its
`docs/blog.md` for import and rollout. Backend first, then frontend. Successful
blog responses support a 60-second shared cache; failures are uncached 503/404.

## Working conventions and known pitfalls

- Keep edits focused and reuse existing components and styles. Preserve
  unrelated user edits and avoid repository-wide formatting changes.
- Update both English and Spanish UI strings when changing translated labels.
- Language currently uses mutable `defaultLang`; the layout reads `?lang=`,
  while article URLs also include language. Inspect render order and navigation
  before assuming these mechanisms stay synchronized.
- Blog cards use API excerpts. The blog index sorts by slug to preserve legacy
  ordering; homepage Writing sorts by publication date. ISO dates represent UTC.
- Non-article shared metadata retains legacy values. Articles pass explicit
  language, title, excerpt, canonical URL and cover metadata through the layout.
- `tsconfig.json` has a machine-specific legacy `baseUrl`; `.eslintrc.json`
  references Next.js. Inspect actual errors before changing either; do not
  assume a Next.js lint command applies to this Astro project.
- Inspect `vercel.json` alongside Astro configuration for deployment changes;
  its output directory is configured as `.astro`.
- Do not commit credentials, local environments, `node_modules`, `.astro`,
  `dist`, or `.vercel`. Keep personal article content unchanged unless requested.

## Verification

Tests live in `tests/unit/` and `tests/e2e/`. Keep Vitest discovery scoped to unit
tests so it does not collect Playwright specs. Playwright uses `tests/server.mjs`
to avoid Astro CLI agent auto-detachment and Vercel preview limitations. Do not
reuse or stop the developer's server for tests. Browser checks block external
requests; they do not prove backend or deployed Vercel availability.


For application changes, run `pnpm build` when dependencies are available.
Use targeted runtime/browser checks for changed interactions or rendering;
static checks alone do not prove live API availability, UI behavior, or deployment.
Respect a user request to test the app themselves. For documentation-only edits,
review the diff and check whitespace instead of starting the app or rebuilding.
Report what was verified and any remaining boundary without claiming more.
