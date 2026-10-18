# Homepage recruiting and SEO update

The homepage leads with Epilef Rodriguez’s senior full-stack identity and puts
professional engineering evidence before personal experiments. Existing portraits,
project imagery, Onest typography, pink accents, theme controls, transitions,
carousel, and project dialogs are retained. No dependency or client island was added.

## Metadata and section order

- English title: `Epilef Rodriguez | Senior Full-Stack Engineer`
- English H1: `Senior Full-Stack Engineer`
- English description: `Senior Full-Stack Engineer based in Spain, specializing in React, TypeScript, Node.js, and scalable web applications for international teams.`
- English canonical: `https://epilef.app/` (including requests with `?lang=en`).
- Spanish canonical: `https://epilef.app/?lang=es`.
- Tracking parameters are excluded from canonicals. Existing article paths retain
  their path-based canonical convention.
- Reciprocal English/Spanish and default language alternates are emitted in the
  document head. Shared metadata now uses the supplied title and description once,
  and social metadata uses the canonical site and absolute image URLs.
- Homepage Person JSON-LD uses the provided name, title, Spain location, existing
  public email, LinkedIn and GitHub. It makes no current-employer claim.

The seven homepage sections are Hero → Featured Engineering Work → Professional
Experience → Technical Expertise → Developer Lab / Open Source → Technical Writing
→ Contact. Existing `#projects`, `#experience`, `#lab`, `#writing`, and `#home`
anchors remain, and `#about` is retained as an alias inside Contact.

## Content evidence and boundaries

- User-provided professional context supports the senior title, Spain location,
  international/distributed collaboration, React/TypeScript/Node.js specialization,
  production work, and AI-assisted workflows.
- Existing English/Spanish experience records support the role history. Historical
  dates remain unchanged. Kenect is now the first role, dated
  October 2024–Present from the owner’s explicit confirmation; Jobsity is described
  as the contract engagement rather than a second inferred employment timeline.
  See [Experience audit](experience-audit.md) for the source and link checks.
- The existing biography and MercadoShops project record support storefront
  customization, purchase-flow work, metrics analysis and implementation through
  deployment. The case study describes delivered work without conversion claims.
- Existing Look At Me Ventures experience, biography, and DM2 project content support
  Data-Collector/I-BOARDS leadership, Node.js/Express, TDD, asynchronous collection,
  SQL storage and campaign KPI dashboards. No quantitative impact claim is added.
- Featured images were inspected and retained, with descriptive alt text and
  historical screenshot captions. Company links are labeled as company websites,
  rather than implying that they are a live demo of the historical contribution.
- Technical expertise combines the documented professional stack with this
  repository’s verified Astro/React/TypeScript, Vercel and test configuration.
- All eight Lab projects, existing article links, and secondary social profiles
  remain available. Professional case studies render directly in the HTML.
- A failed optional article feed no longer turns the whole portfolio into a 503.
  The homepage returns 200 with an explicit feed-unavailable message and no-store;
  blog list/article failure responses retain their existing 503 semantics.

## Information still needed

No résumé asset or URL was found in the repository’s assets, public files,
translated content or documentation. The homepage uses the existing email action,
engineering-work link, LinkedIn and GitHub. Add “View Résumé” when a real URL is
provided. Kenect’s assignment start date has since been confirmed by the owner;
see [Experience audit](experience-audit.md) for remaining historical link checks.

## Changed files

- `src/pages/index.astro`
- `src/layouts/Layout.astro`
- `src/components/Hero.astro`
- `src/components/Header.astro`
- `src/components/Projects.astro`
- `src/components/Experience.astro`
- `src/components/ExperienceItem.astro`
- `src/components/AboutMe.astro`
- `src/i18n/en/index.ts` and `src/i18n/es/index.ts`
- `src/i18n/en/experience.ts` and `src/i18n/es/experience.ts`
- `src/i18n/en/projects.ts` and `src/i18n/es/projects.ts`
- `src/types/index.ts`
- `tests/e2e/homepage.spec.ts`
- `tests/e2e/blog.spec.ts`
- `docs/homepage-seo.md`

## Later opportunities

- Add the verified résumé URL and confirm updated employment history.
- Publish deeper professional case-study pages with approved evidence and outcomes.
- Create a dedicated social-sharing image; this update reuses the existing logo.
- Check production indexing, sitemap discovery, and real-user Core Web Vitals in
  Search Console after deployment. Local checks do not establish ranking or field
  performance. The existing large JavaScript bundle can be investigated separately.
- Consider adding translated homepage entries to the sitemap; reciprocal head
  alternates already describe the existing query-based language URLs.

## References

- [Google: localized versions and hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: JavaScript SEO and server rendering](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Schema.org: Person](https://schema.org/Person)

## Validation

- `npm run build`: passed, including Astro/TypeScript checks (0 errors, 5 existing hints).
- `npm test`: 85 tests passed in 7 files.
- `npm run test:runtime`: passed against the generated Vercel handler with synthetic API responses.
- Focused Playwright homepage, blog, and project-showcase suites: 39 tests passed.
  Coverage includes mobile and desktop, both languages, JavaScript-disabled SEO,
  contact visibility above the fold, carousel/theme behavior, keyboard/focus
  handling in dialogs, article links, and optional-feed failure handling.
- Desktop and mobile homepage screenshots were visually reviewed in English and
  Spanish. Existing layout and theme styling remain in use.
- `git diff --check`: passed.
- No applicable lint command or lint executable is configured. The legacy ESLint
  config targets Next.js; lint tooling was not changed.
- Build notices remain for an existing large client chunk and local Node 26 versus
  the configured Vercel Node 24 runtime. These checks ran on local Node 26.
- No production deployment, live backend validation, Search Console inspection,
  or field Core Web Vitals measurement was performed.

## Technical-editorial visual redesign

The subsequent visual pass retains the SEO strategy and seven-section order.
The hero now uses oversized three-line typography, a large grayscale portrait,
readable professional copy, a stack subtitle and location, two primary actions and
clear profile links. “Request résumé” opens the verified email address with a
translated subject; it does not claim that a downloadable résumé exists.

`src/styles/portfolio.css` owns homepage-scoped tokens, spacing, dark/light
palettes, subtle grid texture, editorial navigation, section numbering and shared
surface treatments. The homepage defaults to dark, including without JavaScript;
stored theme preferences still win. The existing theme island reads that initial
state. Other routes retain their own layout and styles.

Featured projects now alternate image-led compositions. New translated category
and summary fields summarize the existing case-study facts. Problem,
contribution and impact render as a visible definition list beneath each project.
They are available without JavaScript or expanding an interaction. Historical image
captions and all existing company URLs are retained.

The redesign adds no dependency, image asset, font family, React island, animation
library or scroll listener. Entrance and hover effects use CSS transforms and
opacity, with reduced-motion alternatives. The portrait uses responsive image
outputs and high fetch priority.

Additional visual-pass files: `src/styles/portfolio.css`,
`src/components/LatestWriting.astro` and
`src/components/configMenu/ConfigMenu.tsx`. The existing homepage/layout,
Hero/Projects/Header, translated homepage/project content and project model are
also updated. Prior professional role records and metadata copy are unchanged by
this visual pass.

Validation: build/type checks, 85 unit tests, generated-runtime checks and 45
focused browser checks passed. Browser coverage now includes 390px/1440px visual
captures in both languages, dark-default and stored-light themes, keyboard
engineering-note expansion, and an additional JavaScript-disabled 390px check.
The known build notices and production-verification boundaries above still apply.


## Typography and positioning refinement (2026-10-18)

The refinement preserves the dark technical-editorial direction, pink Full-Stack
emphasis, asymmetrical hero, framed grayscale portrait, existing Onest font,
project imagery and seven-section order. The English hero now uses the requested
introduction and `React · TypeScript · Node.js · Software Architecture` subtitle;
Spanish content is updated consistently. AI expertise remains in technical
expertise, Lab, writing and Person `knowsAbout`, rather than the hero identity.
Existing title, description, canonical, hreflang and Person data are preserved.

`src/styles/portfolio.css` centralizes the homepage typography and spacing:

| Token | Range / role |
| --- | --- |
| `--folio-text-meta` | 12–14px; section labels, technical indices and badges |
| `--folio-text-support` | 14–16px; navigation, actions, dates and captions |
| `--folio-text-body` | 16–18px; descriptions and project narratives |
| `--folio-text-subtitle` | 18–22px; stack subtitle and secondary headings |
| `--folio-text-project` | 24–30px; featured project titles |
| `--folio-text-section` | 32–44px; section headings |
| `--folio-text-hero` | 52–96px; expressive hero exception |
| `--folio-text-contact` | 40–72px; closing editorial heading |

All sizes use rem-based `clamp()` values. Prose uses a 1.65 line height and bounded
line lengths; shared heading line heights/tracking retain the editorial character.
Monospace is reserved for technical/decorative accents. Shared quarter-rem spacing
steps, fluid column/section gaps, a 1280px maximum width and common responsive
gutters align the header, sections and footer. Tokens and component rules replace
the previous miniature sizes and conflicting mobile overrides.

The location sits below the stack subtitle, followed by the introduction and
primary actions. Mobile stacks the portrait after the copy, actions and profiles;
tablet/desktop retain the asymmetrical text-and-portrait composition. Mobile
settings sit beside the wordmark, leaving a full row for readable navigation.
Primary actions, social links, navigation and company links have at least 44px
height. Focus remains visible, including the theme/language checkboxes. Dark and
light palettes use stronger secondary text contrast; experience company links use
the theme accent instead of the inherited low-contrast pink.

Featured work retains alternating image-led layouts, historical captions and
verified company destinations. Titles, descriptions, badges and captions share the
new scale. Problem/contribution/impact are always visible beneath each project,
in three columns on desktop and a single column on tablet/mobile. No project
achievements, technologies, metrics, dates or responsibilities were added.

Files refined in this pass: `src/styles/portfolio.css`,
`src/components/Hero.astro`, `src/components/Projects.astro`,
`src/i18n/en/index.ts`, `src/i18n/es/index.ts`,
`src/components/configMenu/ConfigMenu.tsx`, `tests/e2e/homepage.spec.ts` and this document. Earlier uncommitted redesign files
remain intact. No dependencies, fonts, assets or client islands were added.
The existing settings toggle now uses React state to avoid conflicting display
classes; it exposes its expanded state and restores button focus on Escape.

Contrast verification follows the [WCAG minimum contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
Visible project narratives also keep the page content aligned with its existing
structured data, following [Google's structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).

Refinement validation:

- `npm run build`: passed; Astro/TypeScript reports 0 errors, 0 warnings and
  5 existing hints. Existing client-bundle and local Node 26 / target Node 24
  notices remain.
- `npm test`: 85 unit tests passed.
- `npm run test:runtime`: generated Vercel-handler checks passed.
- `npm run test:e2e -- tests/e2e/homepage.spec.ts tests/e2e/project-showcase.spec.ts tests/e2e/blog.spec.ts`:
  52 browser tests passed, including settings keyboard activation, visible focus,
  Escape/focus return and theme persistence, plus existing carousel, dialogs,
  navigation, bilingual SEO and JavaScript-disabled checks.
- Visual review at 390px, 768px, 1440px and 1920px in dark/light themes. A local
  rendered-style audit covered all 16 width/language/theme combinations with no
  document overflow or detected text-contrast failures. This is a targeted text
  and layout audit, not a full WCAG certification.
- `prettier --check src/styles/portfolio.css` and `git diff --check`: passed.
- No lint script or installed lint executable is available; lint tooling was not
  added. No deployment or field Core Web Vitals measurement was performed.
