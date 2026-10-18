# Professional Experience audit — 2026-10-18

Scope: the homepage Experience section, its English/Spanish content, shared data
contract, existing design tokens and focused browser checks. The hero, projects,
Lab, writing, contact, metadata and routing are unchanged.

## Career record

| Group | Employer | English title | Dates | Editorial focus |
| --- | --- | --- | --- | --- |
| Recent | Kenect | Full-Stack Software Engineer | October 2024–Present | Multi-channel campaigns, React/TypeScript, REST APIs, Node.js, architecture, testing and distributed product collaboration |
| Recent | Achieve | Tech Lead | 2024 | Financial-services marketing pages, maintainable frontend architecture, SOLID, unit testing and delivery processes |
| Recent | Mercado Libre S.L.R. | Software Engineer | 2022–2023 | MercadoShops, React/Redux, metrics-informed purchase flows, testing and production delivery |
| Recent | CENORA LLC. | Full Stack Engineer | 2022 | Scraping, publishing workflows and the frontend/backend/database layers of Microsites |
| Recent | ITPex Studio LLC. | Frontend Developer | 2021–2022 | DerfDice, Vue.js/JavaScript, responsive UI/UX and Node.js integration |
| Earlier | Calvary Robotics LLC. | Full Stack Developer | 2020–2021 | ASP.NET, JavaScript, SQL Server and internal business-process automation |
| Earlier | Look At Me Ventures LLC. | Full Stack Engineer | 2017–2021 | Node.js/Express, advertising APIs, Data-Collector, TDD and I-BOARDS analytics |
| Earlier | MediaTrax LLC. | Full Stack Engineer | 2016 | Google Ads OAuth and LDAP identity integration through Okta |
| Earlier | MobyDev | Frontend Developer | 2016 | Angular/Django REST Framework, React, Docker and agile delivery |
| Earlier | PDVSA Industrial, S.A. | Software Engineer | 2012–2016 | Python/PostgreSQL, probability distributions, Monte Carlo simulation and architecture |

The existing nine titles, historical employer names and year ranges are retained,
including overlapping positions. Spanish titles retain their existing translations.
The user explicitly confirmed the **Kenect assignment** began in **October 2024**.
This is not an inference from a Jobsity contract start date. Both languages display
the assignment date and “Contract engagement through Jobsity” (translated in Spanish).
No other date was supplied or changed. Older records remain year-granular.

The section introduction uses the requested English copy verbatim. English entries
use implied first-person résumé language and concrete engineering verbs; Spanish
content is updated consistently. The approved user copy and existing experience,
biography and project records are the evidence for personal contributions. Public
company marketing is used only for business context and destination identity.
There are no added metrics, platform-wide ownership claims or inferred promotions.
Only the clearly described Kenect stack is included in the concise narrative;
no unverified technology inventory is attached to a specific project area.

## Verification and remaining confirmations

- Repository content (`src/i18n/{en,es}/experience.ts`, project records and prior
  homepage documentation) and reachable Git history did not contain a Kenect or
  Jobsity assignment date before this update. The owner’s October 2024 answer is
  the date authority.
- The [public LinkedIn result](https://es.linkedin.com/in/khanos) names Kenect,
  but the accessible profile/search result hides role dates and most other
  experience details. Direct profile retrieval failed. It cannot independently
  verify the historical dates, legal employer names or Kenect start date.
- [Kenect](https://www.kenect.com/) describes its customer communication platform
  and text/email/voice capabilities. The exact company destination is retained
  from the task. Personal engineering contributions come from the user, not this
  marketing page.
- [Achieve’s company profile](https://www.linkedin.com/company/achieve/) supports
  the financial-services context and the `achieve.com` destination.
- [Mercado Libre’s company profile](https://www.linkedin.com/company/mercadolibre/)
  supports the e-commerce/fintech context. Direct retrieval of the existing
  `www.mercadolibre.com` homepage failed in this research tool; its existing link
  is preserved, without claiming a successful HTTP/live-service check.
- [CENORA](https://cenora.com/) loads with Cenora branding. It establishes company
  identity, not the historical Microsites contribution.
- The existing DerfDice project URL and Look At Me Ventures company URL could not
  be retrieved by the research tool. They remain explicitly named historical
  destinations; **manually confirm their current reachability**. A retrieval
  failure is not proof that a destination is permanently dead.
- Calvary’s old domain redirects to Invio Automation. The [official acquisition
  announcement](https://invioautomation.com/invio-automation-acquires-calvary-robotics/)
  confirms the relationship. The historical employer name remains unchanged;
  the link now goes directly to `https://invioautomation.com/`, is labeled “Invio
  Automation website”, and the entry says “Now part of Invio Automation”.
- [MobiDev](https://mobidev.biz/) loads. The repository uses **MobyDev**, while the
  current brand uses **MobiDev**. The employment record is preserved as requested;
  **confirm the historical spelling** before changing it. The link label uses
  the destination’s current brand.
- The existing PDVSA Industrial deep link could not be retrieved. **Manually
  confirm that historical URL**; it is retained rather than replaced with an
  assumed company page. MediaTrax had no link, so none was fabricated.
- **Mercado Libre S.L.R.** and **Calvary Robotics LLC.** remain the repository’s
  historical names. Public branding does not establish these legal suffixes;
  confirm against employment records if exact legal names are important.

There is no unresolved Kenect start-date question. All prior dates are preserved
from the repository and approved task context, not independently certified by
LinkedIn. Legitimate overlapping years have not been “corrected”.

## Presentation, accessibility and SEO

`Experience.astro` renders named Recent/Earlier groups and ordered lists.
`ExperienceItem.astro` renders semantic articles, role headings, visible company
names, dates, optional engagement context, readable descriptions and explicit
company/project links. Heading order is section H2 → group H3 → role H4.
Everything renders on the server and remains visible with JavaScript disabled.

Kenect receives a subtle pink border, surface background, current-position label
and larger role heading using the existing tokens. Earlier rows use tighter
vertical padding while keeping 16–18px prose and 1.65 line height. The existing
900px two-column breakpoint is retained; smaller widths use one column. Company
links use the theme accent, 44px minimum height and existing visible focus styles.
Obsolete timeline markup and selectors are removed only from Experience.

The homepage’s existing Person JSON-LD has no employment-history fields and makes
no direct-employer `worksFor` claim. It remains accurate and unchanged; no direct
employment relationship or fabricated job-history schema is introduced. Existing
canonicals, metadata, internal anchors and other homepage sections are untouched.
No new dependency, image, font, client island or interaction is added.

## Files

- `src/components/Experience.astro`
- `src/components/ExperienceItem.astro`
- `src/i18n/en/experience.ts` and `src/i18n/es/experience.ts`
- `src/i18n/en/index.ts` and `src/i18n/es/index.ts` (Experience labels/introduction only)
- `src/types/index.ts` (`ProfessionalExperience` contract)
- `src/styles/portfolio.css` (Experience rules only)
- `tests/e2e/homepage.spec.ts` (updated role count)
- `tests/e2e/experience.spec.ts`
- `docs/homepage-seo.md` and this audit

## Validation

- `npm run build`: passed with Astro/TypeScript reporting 0 errors, 0 warnings
  and 5 existing hints. The existing large-client-bundle notice and local Node 26
  versus target Node 24 notice remain.
- `npm test`: 85 unit tests passed.
- `npm run test:runtime`: generated Vercel-handler checks passed.
- `npm run test:e2e -- tests/e2e/experience.spec.ts tests/e2e/homepage.spec.ts`:
  45 tests passed, covering existing navigation, carousel, theme controls,
  JavaScript-disabled SEO and new career grouping/content checks.
- A final focused `experience.spec.ts` run passed all 8 tests with additional
  rendered-text contrast assertions and current-role close-up screenshots.
  These tests cover 390px, 768px, 1440px and 1920px in English/Spanish and both
  themes, with JavaScript disabled. No horizontal overflow or text-contrast
  ratio below 4.5:1 was detected in the Experience section. Body copy remains at
  least 16px; links retain visible keyboard focus and at least 44px height.
- Screenshots of the full section and the current role were visually reviewed
  on mobile, tablet and desktop in dark/light themes.
- A direct comparison against HEAD confirms that every previous role title,
  employer name and date is unchanged in both languages.
- `prettier --check src/styles/portfolio.css` and `git diff --check`: passed.
- No lint script or installed lint executable exists. Lint tooling was not added.
- External company URLs were researched as documented above; local fixture
  browser tests do not establish their availability. No production deployment
  or field Core Web Vitals measurement was performed.
