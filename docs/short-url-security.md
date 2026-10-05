# Short URL security and rollout

Short links, including old four-digit links, and their destinations are public.
Random codes and `noindex` are not confidentiality controls. Do not shorten
credentials, secret query strings, private documents or other confidential URLs.
This release preserves every issued mapping, exact input-string reuse, existing
HTTP(S) destinations and transparent 302 redirects. It makes no data/index changes.

## Runtime boundaries

The numeric Astro resolver uses `src/server/shortUrl.ts` to send the existing
`OWNER_API_TOKEN` to the configured backend. Visitors never need Basic login.
The backend verifies that token before choosing its finite relay quota; public
backend lookup remains public. Only server code imports the relay helper.
Browser `getUrlData` stays credential-free for compatibility. No client cookies,
Basic credentials, forwarding headers or arbitrary request headers reach the
backend bridge.

Owner create/list/delete require the existing separate Basic credentials;
browser mutations also require exact Origin. The shared boundary continues to
protect `/admin/blog` and all blog API/preview/upload routes. Private success and
failure responses remain uncached, deny framing and advertise noindex. Blob
upload authorization and public blog/GitHub behavior keep their existing contracts.

The resolver and both bridge/browser wrappers bind returned records to the
requested numeric code or exact original string. Invalid or mismatched successes
return safe 502 without Location or optimistic removal of an unrelated row.
After an uncertain write (502/503/504), the URL UI reads the first page once to
reconcile state, preserves input and reports uncertainty. It never repeats the
mutation or continuously retries failed reads. An explicit Retry refreshes the
list. Upstream 429 remains 429; validated delta seconds or an HTTP date become
Retry-After of 1–3600 seconds. Missing/invalid timing is omitted. English/Spanish
feedback preserves input and disables actions until a validated delay expires;
expiry does not send a network request. Dependency outages remain 503.

URL guards reject whitespace, C0/DEL, userinfo, non-HTTP(S), missing hostname and
strings longer than 2048 characters without normalizing the original text.
URL JSON responses require JSON media types, decode streamed UTF-8 within the
deadline, cancel on overflow and cap bytes before parsing: 16 KiB per record,
1 MiB per list. Lists cannot exceed either the requested or returned page limit.
The 1 MiB ceiling accommodates 100 maximum-length Unicode records, while the
owner UI still requests 25. Unrelated GitHub/blog decoding budgets are unchanged.

## Shared frontend enforcement

`@vercel/firewall` 1.2.5 checks Vercel's platform counters before numeric lookup
and before Basic verification. No process-local production counter is used.
The counters are **per Vercel region**, not a global quota. Deployment metadata
currently reports one production function region, `iad1`; this fact must be
rechecked before rollout. Multi-region deployment would give each region its own
budget. The backend's finite relay/aggregate policy remains a separate safeguard.

The production adapter requires Vercel runtime identity, `NODE_ENV=production`,
the Vercel-provided `.vercel.app` deployment hostname, a valid Vercel-provided
`x-real-ip`, configured rule IDs and an independent `RATE_LIMIT_SECRET`. Generate
this random server-only SDK secret as 32–256 printable non-space ASCII characters;
never reuse the bearer token or Basic username/password. The SDK salts counting
keys with it so callers cannot derive another client's internal counter key.
The adapter rejects missing, malformed or reused secrets before provider calls.
Rotate through the deployment secret manager, never browser code or source.
Rotation changes counter keys, so coordinate it with admission monitoring.
It ignores raw Host, Forwarded and XFF. Only
the fixed deployment hostname and sanitized IP headers are passed to the SDK,
which would otherwise copy every supplied header to its internal endpoint.
Vercel overwrites `x-real-ip` at its ingress; do not port this trust to an
unverified direct server or a front proxy. A front proxy requires a separately
verified client-identity design and staging spoofing tests.

Local Astro development bypasses remote admission checks only in a development
build outside Vercel and outside `NODE_ENV=production`. Production has no bypass
switch: absent platform identity, malformed settings, missing rules, blocked
provider responses, provider exceptions or a two-second admission deadline
produce uncached 503 before invoking the backend. Platform admission 429 is
returned without guessed retry timing because the SDK does not expose it.
The deadline bounds application waiting; the SDK provides no cancellation API,
so an already-started provider check may finish after the 503.

Configure four enforcing **SDK rules** with the exact IDs below in the intended
Vercel project before deploying the frontend. IDs are server environment settings;
thresholds live in Vercel, not local maps or `vercel.json`.

| Server setting / suggested ID | Scope | Initial staging budget |
| --- | --- | --- |
| `OWNER_AGGREGATE_RATE_LIMIT_ID=owner-emergency` | All shared owner requests; constant emergency key | 5000/minute per region |
| `OWNER_RATE_LIMIT_ID=owner-safety` | All shared owner requests before authentication; per client IP | 120/minute per region |
| `OWNER_FAILURE_RATE_LIMIT_ID=owner-failures` | Failed Basic and cross-origin owner attempts; per client IP | 20/10 minutes per region |
| `SHORT_URL_RATE_LIMIT_ID=short-url-resolver` | Normalized numeric resolution before relay; per client IP | 60/minute per region |

These are starting thresholds for synthetic staging traffic, not measured safe
production capacity. The emergency ceiling can intentionally affect everyone
under extreme load; ordinary failed attempts do not create an account-wide
lockout or consume another client's failure bucket. SDK rules should use the
SDK-supplied key and cover all methods without extra path/header filters: the
application selects normalized routes before calling the appropriate rule.
Test the constant emergency key across two different IPs as well as client
isolation. Do not configure an IP-only counting override that defeats the
SDK's aggregate key.

Four rules require project entitlement; Vercel's documented Hobby allowance is
one custom rate-limit rule. Verify the project plan, counting-key behavior and
costs before provisioning. No plan purchase, firewall publication, secret
mutation or deployment has been performed by this implementation. Read-only
inspection did not retrieve a custom firewall configuration (provider 404);
that is not proof no platform controls exist.

## Deployment gate and rollback

1. Stage the compatible backend operation/relay budgets and shared-store policy
   first. Keep unauthenticated backend lookup compatible and preserve uniqueness.
2. Review Vercel capabilities, costs and aggregate traffic counts, never raw
   destination inventories or credentials. Configure SDK rules in log mode for
   tuning, then enforce in preview. A log-only rule is not enforcement: do not
   approve production rollout while protected checks are merely logging.
3. Verify preview/system-environment exposure and protection-bypass automation
   using Vercel's documented setup. Enter secrets through the provider secret
   manager, never commit or paste them into chat. Provision owner settings and
   rule IDs and `RATE_LIMIT_SECRET` for each intended environment. Confirm `.vercel.app` deployment
   hosts reach the intended rules under the actual deployment protection policy.
4. Prove two-client isolation, normalized/encoded/trailing-slash paths, forged
   Host/XFF/Forwarded/x-real-ip behavior through real HTTPS ingress, bounded
   failure and recovery, shared counter behavior across actual replicas/regions,
   separate owner/relay quotas and safe 429/retry semantics through both hops.
   Check Basic/blog/preview/Blob authorization and browser secret isolation.
5. Review concrete staged changes and publish enforcing rules through the
   separately authorized firewall rollout. Deploy backend compatibility before
   frontend. Verify anonymous owner denial, a harmless known-link Location
   without following it, uncached 429/503 and recovery. Monitor aggregate class,
   status and latency only; do not log destinations, auth headers or forwarding
   chains.

Until these steps pass, this code is locally verified and deployment-dependent
abuse isolation remains unverified. Rule IDs existing in environment variables
alone do not prove enforcement; verify each rule is enabled with a blocking
rate-limit action and has no bypass/filter that silently permits protected calls.

Rollback the focused frontend code and associated rules together, retaining
existing owner credentials, issued mappings and backend uniqueness indexes.
Coordinate backend quota configuration when rolling back the authenticated relay.
Never restore the old hash allocator or silently rewrite/revoke mappings.

## Local regression gates

Use Node 24.x and pinned pnpm 9.15.9. Run `pnpm test`, `pnpm build`,
`pnpm test:runtime`, `pnpm test:e2e` sequentially, then `git diff --check`.
Unit tests inject provider admission decisions; generated-handler tests exercise
the real SDK against synthetic fetch responses and scan browser assets for
credentials/server modules. Playwright uses a disposable loopback backend with
synthetic credentials, mocks failures/mismatches and blocks outside browser
requests. None of these tests prove deployed Vercel counters or production TLS.

The pnpm lock is authoritative for this repository. The historical npm lock
already differs from current application dependency versions; both files are
retained with only the pinned zero-dependency Firewall SDK added, without an
unrelated npm dependency refresh.

References: [Vercel SDK and per-region counters](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk),
[Vercel rate limits, plans and counting keys](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting),
[Vercel overwritten ingress headers](https://vercel.com/docs/headers/request-headers),
[Vercel front proxies](https://vercel.com/docs/security/reverse-proxy).
