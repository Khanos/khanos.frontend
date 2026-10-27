# Featured Engineering Work — Achieve and DerfDice

Updated 2026-10-18. Scope is the professional project data, its existing editorial
presentation, translated project labels, technology mappings and homepage checks.
The hero, Professional Experience, Lab, writing, contact and page metadata remain
unchanged.

## Project order and date authority

| Display order | Featured project | Company / role | Project period |
| --- | --- | --- | --- |
| 1 | Achieve — Financial Services Web Platforms | Achieve / Tech Lead | 2024 |
| 2 | MercadoShops | Mercado Libre / Software Engineer | 2022–2023 |
| 3 | DerfDice — Tabletop RPG Generator | ITPex Studio / Frontend Developer | 2021–2022 |
| 4 | DM2, Data-Collector & I-BOARDS | Look At Me Ventures / Full Stack Engineer | 2017–2021 |

Achieve and DerfDice periods come directly from the task. The existing MercadoShops
and DM2 records had no project-date fields; the owner explicitly confirmed
2022–2023 and 2017–2021 as their project periods in this session. These are now
explicit project metadata, independent of the employment history. No Kenect or
other experience-only entry is automatically turned into a featured project.

`Projects.astro` filters for `caseStudy`, then sorts the new array by descending
`endYear`, using descending `startYear` only to resolve equal end years. It does
not mutate source data or derive chronology from translated date strings or array
positions. Year precision matches the verified information; months are not invented.

The earlier standalone Freedom Debt Relief record is expanded into Achieve’s
single multi-brand project, retaining its asset and website within that case study.
The existing DerfDice record is promoted to a full case study. MercadoShops and DM2
retain their narratives and technologies. The personal portfolio and backend-Lab
records remain intact in both data arrays and retain their existing non-featured
status. There are six source records and four featured professional entries.

## Content and technologies

Achieve covers [Achieve](https://www.achieve.com/),
[Freedom Debt Relief](https://www.freedomdebtrelief.com/) and
[Bills.com](https://www.bills.com/) as one project. The approved personal story
focuses on frontend leadership, shared architecture and components, GraphQL,
Contentful, Next.js/React, testing and maintainable delivery. Public company pages
were retrieved to verify destination identity and financial-services context;
they are not evidence of the owner’s individual contribution or historical stack.

- The task explicitly supplies Next.js, React, GraphQL, Contentful and Jest work.
- The legacy Freedom Debt Relief project description documents Tailwind CSS and
  Cloudflare. The new contribution copy explicitly scopes these to that site;
  it does not claim all three brands used them.
- **TypeScript is omitted from Achieve:** the existing record does not verify it
  for that project. Confirm its use before adding it to this project’s stack.
- No performance delta, conversion percentage, deployment date or business metric
  is added. The impact remains qualitative and follows the approved task copy.

DerfDice describes Vue.js/JavaScript frontend development, responsive creative
content workflows and integration with Node.js/Express services. The product
includes characters, names, items, locations and storytelling ideas. It does not
identify the owner as founder or original creator. The accessible/streamlined
interface wording follows the owner’s approved copy; it is not a claim of formal
WCAG certification for the external product.

- Vue.js, JavaScript, Node.js and Express are supported by existing project data
  and the approved task context.
- **Stripe and Heroku are omitted from the featured stack:** legacy tags associate
  them with the project but do not establish payment-integration responsibilities
  or a verified deployment boundary. Confirm those details before restoring them
  as personal engineering/deployment claims.
- The [DerfDice destination](https://derfdice.com/) could not be retrieved by the
  research tool; its exact task-provided URL is retained. That failure does not
  prove permanent unavailability. Manually verify current reachability.

## Reused assets and screenshots still needed

The repository’s `src/assets` and `public` asset inventory contains these assets:

| Reused file | Actual contents and treatment |
| --- | --- |
| `src/assets/img/projects/freedomdebtrelief.png` | A historical Lighthouse capture, including an FDR page thumbnail; **not** a full screenshot of three websites. Alt text and the visible translated caption identify the report as archived and not a current benchmark. Its scores are not quoted as personal achievements or current performance. Capture date and measurement conditions are unknown. |
| `src/assets/img/projects/derfdice.png` | Historical DerfDice UI showing rolling tools, table creation, profiles and login. Used intact with descriptive translated alt text. |
| `src/assets/img/projects/mercadolibre.png` | Existing MercadoShops screenshot retained. |
| `src/assets/img/projects/lookatme.png` | Existing DM2 screenshot retained. |

**Still needed:** approved historical screenshots of the Achieve.com and Bills.com
interfaces from the 2024 work, plus a full Freedom Debt Relief interface screenshot
if replacing the archived audit capture. No source asset was found for those two
brands; no screenshot, composite, placeholder or invented visual was generated.
The three descriptive website links and the project narrative communicate the
multi-brand scope without pretending the one image depicts all three sites.

All screenshots now render at their intrinsic proportions with `height: auto`;
the former forced aspect ratio and cover crop are removed from the featured image
rule. Original assets are unchanged. Responsive WebP output, lazy loading,
existing alternating framing, hover transforms and reduced-motion behavior remain.

## Reuse, bilingual presentation and SEO

The existing `ProjectType.caseStudy` contract is named `ProjectCaseStudy` and adds
an ID, company, translated role, numeric project period, website list and optional
translated image caption. Narrative fields and the one-image project contract are
retained. GraphQL and Contentful use the shared technology mapping and existing
generic technical icon, without adding dependencies or assets.

`Projects.astro` remains the reusable renderer for all four projects. It renders
translated H3 titles, company/role/year metadata, summary, technology badges,
explicit website links and the always-visible Problem/Contribution/Impact list.
Stable `project-*` article IDs label each article with its title heading. Branding
is proper-noun metadata; link verbs and roles use the existing English/Spanish i18n.
The same typography tokens, dark/light palettes, spacing and breakpoints remain.

No gallery interaction, modal, animation library, client island or JavaScript-only
content is introduced. The homepage retains one H1, its existing H2/H3 hierarchy,
server-rendered professional content, Person JSON-LD, canonicals, hreflang and
social metadata. Existing page anchors and unrelated homepage sections are intact.

## Modified files

- `src/components/Projects.astro`
- `src/types/index.ts`
- `src/data/tags.astro`
- `src/i18n/en/projects.ts` and `src/i18n/es/projects.ts`
- `src/i18n/en/index.ts` and `src/i18n/es/index.ts` (website-link labels only)
- `tests/e2e/homepage.spec.ts`
- `docs/homepage-seo.md` and this document

## Validation

- `npm run build`: passed; Astro/TypeScript reports 0 errors, 0 warnings and
  5 existing hints. Existing large-client-chunk and local Node 26 / Vercel Node 24
  notices remain unchanged.
- `npm test`: 85 unit tests passed in 7 files.
- `npm run test:runtime`: generated Vercel-handler checks passed.
- `npm run test:e2e -- tests/e2e/homepage.spec.ts tests/e2e/project-showcase.spec.ts tests/e2e/blog.spec.ts`:
  52 browser tests passed. Existing homepage coverage now checks four ordered
  professional case studies, explicit periods and roles, all three Achieve brand
  URLs, conditional stack exclusions, historical captions, loaded images and
  intrinsic aspect ratios. All four project narratives remain available without
  JavaScript; the existing canonical/hreflang/Person/one-H1 checks pass.
- Visual captures cover English/Spanish, dark/light, and 390px, 768px, 1440px and
  1920px. Achieve and DerfDice captures were reviewed on mobile/tablet/desktop;
  no horizontal overflow was detected by the viewport checks. The existing
  reduced-motion, navigation, carousel and keyboard/settings checks still pass.
- Direct data inspection confirms six records per language, four unique featured
  IDs and matching numeric project periods. A source comparison confirms the
  personal portfolio and backend-Lab records are unchanged.
- `git diff --check`: passed. No lint command is configured; no lint tooling added.
- Original image assets are unchanged. No production deployment or live external
  project functionality test was performed. The company destinations were fetched
  as documented above; DerfDice’s current reachability remains unverified.
