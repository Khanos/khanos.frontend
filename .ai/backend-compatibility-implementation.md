# Backend compatibility implementation

Date: 2026-10-02. Bases: frontend `3e05486` (`master`), backend `e69ac20` (`main`, PR #25).
Preserves existing public routes, issued links, bilingual content and the layered backend.

## Changes

- Owner-only URL administration now uses an Astro middleware boundary and same-origin API.
  Standard Basic login uses a separate owner password; the backend bearer token stays in
  server secrets. Missing/malformed/reused secrets fail closed; mutations require exact
  Origin. Responses are private/non-cacheable and bodies are capped at 16 KiB. No accounts,
  cookies, sessions, uploads or AI generation are added.
- URL lists consume the 25-record cursor contract. Create/copy/delete and retries remain
  usable after login; errors never replace array state with undefined. Public redirects
  normalize four-digit legacy padding and support new safe numeric codes. Missing links
  redirect home; dependency failures return retryable 503 rather than a false missing link.
- Public GitHub reads omit credentials, encode text, enforce HTTP/JSON contracts and bounded
  deadlines/cancellation, clear stale cards and show empty/error states in both languages.
  Commit highlighting renders literal React text instead of provider HTML/regular expressions.
- Owner pages omit tag-manager tracking and client navigation. Lab's owner link opens a
  fresh document, avoiding previously loaded public tracking inside administration.
- Backend companion accepts exactly the original four-digit padding without rewriting
  records/codes and marks URL responses non-cacheable. Existing owner enforcement, exact
  global reuse, real uniqueness constraints and Gemini 410 retirement remain intact.

## Verification

- Node **24.19.0**, pnpm **9.15.9**: **31 unit tests**, **29 Playwright tests**, build passed.
  Includes all existing 19 homepage tests and 10 new compatibility cases. Chromium
  **153.0.8010.12** / revision **1243**. Astro: zero errors/warnings, 12 existing hints;
  existing bundle-size warning remains. No dependencies or lockfiles changed.
- Backend: **184 tests / 12 suites**, lint passed; API coverage **100%**, 99% gate unchanged.
  MongoDB **8.0.16** pinned binary checksum verified before use. Tests use only owned
  loopback processes and temporary databases, never configured databases.
- Final actual Astro/backend integration with real MongoDB indexes and a native local
  GitHub provider passed **8 groups**: owner/CSRF denial, old/new public redirects, indexed
  pagination, 8 concurrent identical creates yielding one record, deletion, GitHub encoded
  phrase/non-2xx/native timeout, real DB disconnect returning 503, and retired Gemini 410.
  Owned listeners/database were stopped and temporary database data removed.
- Targeted scan of **22 built browser JS files** found no synthetic build secrets or
  server-only credential names. `git diff --check` passed in both repositories.
- Graph Tier 2 discovery/coverage checked both projects. Changed/untracked graph paths
  were read directly; the older graph generations do not establish the modified source.

## Rollout, compatibility and rollback

Provision frontend server secrets privately: `URL_ADMIN_USERNAME`, a distinct random
`URL_ADMIN_PASSWORD`, and backend-matching `OWNER_API_TOKEN`. Configure the credential-free
`PUBLIC_BACKEND_API_URL` at build and runtime. Use HTTPS; optional server deadline is
`BACKEND_TIMEOUT_MS` (default 8000). README and blank `.env.example` document setup.

The frontend works with both PR #25's canonical-only lookup and the padded-code backend
expansion, so these changes may overlap during rollout. `/url` now explicitly requires
owner login; public lookup/GitHub behavior stays public. A backend outage is intentionally
503 on a valid short-link route. Full navigation into administration is intentional.

Backend deployment still requires its separately authorized read-only data preflight,
explicit unique-index migration if absent, and startup readiness. This compatibility fix
adds no schema/data/index migration. Earlier live Heroku health probes returned 503 HTML;
production availability, deployed revision, ingress and Vercel runtime are not proven here.
Hosted CI execution is also separate from local checks. No deployment occurred.

Keep owner enforcement, existing indexes and issued codes when rolling back. Reverting
this frontend restores the known owner/pagination/new-code regressions; disable owner UI
temporarily if necessary rather than making the bearer bridge anonymous. No unrelated
portfolio/blog/SVG functionality was changed.
