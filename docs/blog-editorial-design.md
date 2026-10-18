# Writing design unification

Implemented on `feat/blog-editorial-design`, based on master `bc93425`.

## Audit and implementation

The homepage's `data-portfolio-page` opt-in already owns the palette, grid,
Onest typography, monospace labels, spacing rhythm, 80rem container, navigation
and footer appearance. Blog routes previously used the same document and header
without that opt-in, leaving them with floating navigation, narrow containers,
rounded image cards, independent colors and no article-title H1.

`Layout.astro` now enables the existing identity for Writing as well. The
homepage composition and tokens are preserved. Blog-specific CSS only supplies
editorial arrangements and long-form styling using the existing `--folio-*`
tokens; it defines no independent palette or font scale. The shared settings menu
is aligned inward to prevent desktop overflow. Route language takes precedence
over previously stored language in the settings control.

The index has a bilingual editorial header, latest publication feature, and
three/two/one-column archive. Existing API pagination remains; publication-date
sorting now matches the homepage. Dates, categories and reading minutes come from
the API. Missing covers, categories, authors and excerpts remain optional.

Articles have a single H1, source metadata, a responsive hero, 70ch prose, styled
headings/lists/quotes/links, keyboard-scrollable code and tables, back links, and
up to two same-category articles selected from the latest six summaries.
Recommendations are optional: a failed recommendation request never replaces the
article with an error. Markdown content and database records are unchanged.

Highlighting runs on the server using the already installed
[react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter#props)
with CSS classes. Output still passes through the HTML sanitizer; no JavaScript,
URL or arbitrary-style permissions were added. Article rendering demotes body H1s
to H2s while the admin preview keeps its existing heading contract.

## SEO and accessibility

- Existing slugs, API boundaries, cache behavior, sitemap and error responses remain.
- Index EN/ES canonicals distinguish language while normalizing redundant English
  query parameters; paginated pages have their own canonical, title and description.
- Index language alternates and localized Open Graph metadata are present.
- Articles retain Open Graph cover/title/description/canonical metadata and add
  source-derived BlogPosting JSON-LD, publication/modification times and author metadata.
  Anonymous articles disclose no author. Article canonicals omit redundant query parameters.
- Headings are semantic; related-card headings sit below their section heading.
- Existing skip link, visible focus, settings keyboard behavior, 44px navigation
  and action targets, and reduced-motion handling are reused.
- Browser checks measure palette text/background contrast at AA (4.5:1 or better),
  local code scrolling, settings-menu bounds and page overflow in both themes.

## Changed files

| Area | Files |
| --- | --- |
| Shared shell | `src/layouts/Layout.astro`, `src/components/Header.astro`, `src/components/configMenu/ConfigMenu.tsx`, `src/styles/portfolio.css` |
| Article presentation | `src/components/BlogList.astro`, `src/components/Post.astro`, `src/components/BlogMetadata.astro` (new), `src/styles/blog-editorial.css` (new) |
| Routes | `src/pages/blog.astro`, `src/pages/blog/[lang]/[slug].astro` |
| Copy and rendering | `src/i18n/en/index.ts`, `src/i18n/es/index.ts`, `src/utils/blog-render.ts` |
| Verification | `tests/api-fixture.mjs`, `tests/build-runtime.mjs`, `tests/e2e/blog.spec.ts`, `tests/unit/blog.test.ts` |
| Documentation | `AGENTS.md`, this file |

## Validation

- 86 unit tests passed.
- Astro check passed: zero errors/warnings, five informational hints.
- Production Astro/Vercel build passed.
- Generated Vercel handler passed with require(ESM) disabled, including highlighted
  code, sanitized previews, bilingual articles, charts, sitemap and error responses.
- Full browser regression suite: 92 tests passed.
- Focused blog browser suite: 10 tests passed, covering 390/768/1440/1920px,
  English/Spanish, light/dark, optional data, pagination and settings navigation.
- Screenshots reviewed for mobile articles, desktop articles and tablet/desktop indexes.

Browser and runtime checks use the repository's isolated synthetic API and
placeholder cover images; production cover composition was not reviewed. They do
not establish production API availability, deployment status or measured field
Core Web Vitals. The build reports a >500KB chunk warning and the local Node 26
versus Vercel Node 24 runtime warning. No dependencies were added.
