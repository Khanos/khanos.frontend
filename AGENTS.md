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

## Stack and commands

- Astro with TypeScript, Tailwind CSS, and React interactive islands.
- Server output with the Vercel adapter; individual blog articles are prerendered.
- Node.js `24.x`; package manager pinned to `pnpm@9.15.9` in `package.json`.
- `pnpm install`: install dependencies.
- `pnpm dev`: start the development server.
- `pnpm exec astro check`: run Astro/TypeScript checks.
- `pnpm build`: run `astro check` followed by `astro build`.
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

`src/content.config.ts` defines the `posts` collection with a glob loader for
Markdown/MDX under `src/content/posts/`. Required metadata is `author`, `date`
(a string), `image`, and `title`.

Articles live in `en/` and `es/`; shared cover images live in `images/`.
For example, `en/5-from-panic-to-production.md` becomes
`/blog/en/5-from-panic-to-production`.

`src/pages/blog.astro` loads posts and filters by language. `BlogList.astro`
maps them to `Post.astro` cards. `src/pages/blog/[lang]/[slug].astro` generates
static paths and renders the article body with Astro's content renderer.
Content changes require a rebuild/deployment to update published articles.
Preserve existing URLs and paired translations when editing content.

## Working conventions and known pitfalls

- Keep edits focused and reuse existing components and styles. Preserve
  unrelated user edits and avoid repository-wide formatting changes.
- Update both English and Spanish UI strings when changing translated labels.
- Language currently uses mutable `defaultLang`; the layout reads `?lang=`,
  while article URLs also include language. Inspect render order and navigation
  before assuming these mechanisms stay synchronized.
- Blog cards use raw Markdown body previews and the list has no explicit date
  sorting. Dates are strings, so date sorting/formatting needs deliberate parsing.
- Shared metadata includes duplicate title/description tags and fixed social
  values. Inspect the layout when changing article SEO.
- `tsconfig.json` has a machine-specific legacy `baseUrl`; `.eslintrc.json`
  references Next.js. Inspect actual errors before changing either; do not
  assume a Next.js lint command applies to this Astro project.
- Inspect `vercel.json` alongside Astro configuration for deployment changes;
  its output directory is configured as `.astro`.
- Do not commit credentials, local environments, `node_modules`, `.astro`,
  `dist`, or `.vercel`. Keep personal article content unchanged unless requested.

## Verification

For application changes, run `pnpm build` when dependencies are available.
Use targeted runtime/browser checks for changed interactions or rendering;
static checks alone do not prove live API availability, UI behavior, or deployment.
Respect a user request to test the app themselves. For documentation-only edits,
review the diff and check whitespace instead of starting the app or rebuilding.
Report what was verified and any remaining boundary without claiming more.
