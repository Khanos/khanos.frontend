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

Frontend admission uses the existing Heroku Redis through authenticated
`POST /api/admission` calls. Every Vercel instance and region shares the same
counters within each deployment environment; Preview and Production use separate
key namespaces so preview tests do not consume production frontend buckets.
The backend emergency ceiling is still shared across environments. This replaces the four Vercel Firewall SDK rules, which exceed Hobby's
one-rate-limit-rule allowance. It requires no Vercel plan change, paid Vercel
add-on or additional Redis instance. `REDIS_URL` stays on Heroku; credentials are
never copied into frontend configuration. The four former `*_RATE_LIMIT_ID`
variables are obsolete and ignored. Existing platform DDoS protection remains.

| Admission kind | Scope | Fixed budget |
| --- | --- | --- |
| `aggregate` | All shared owner requests; constant emergency key | 5000/minute |
| `owner` | All shared owner requests before authentication; per client IP | 120/minute |
| `failure` | Failed Basic and cross-origin attempts; per client IP | 20/10 minutes |
| `resolver` | Numeric resolution before relay; per client IP | 60/minute |

These are starting thresholds, not measured safe capacity. Each fixed window
starts on its first request, with atomic increment/expiry in Redis. Buckets
remain separate from backend anonymous/relay/owner/API quotas. IPv6 addresses
share a /56 identity through `ipKeyGenerator`; IPv4 uses canonical IP identities.
The backend hashes identities before constructing namespaced counter keys.
Expiry is automatic, unrelated to dyno or function restarts. Mini Redis has no
persistence, so a Redis service restart can reset active windows; preserve its
`noeviction` policy to avoid premature resets when memory fills.

`RATE_LIMIT_SECRET` is now a dedicated admission bearer, identical in Heroku and
Vercel Preview/Production. Generate 32–256 random printable non-space ASCII
characters, independent from `OWNER_API_TOKEN` and Basic credentials. This token
cannot list/create/delete URLs or operate on blog data. The endpoint accepts only
a fixed kind, Preview/Production environment and a valid client IP, with a 1 KiB JSON limit; callers cannot choose
Redis keys, budgets or windows. Authentication occurs before parsing. Never expose
this credential in browser code, source, logs or chat. Rotate both deployments
together; unlike the SDK secret, rotation does not change counter identities.

The frontend requires `VERCEL=1`, `NODE_ENV=production`, the platform VERCEL_ENV
(Preview/Production), a Vercel-provided
`.vercel.app` deployment hostname and a valid platform `x-real-ip`. Vercel
[overwrites x-real-ip at ingress](https://vercel.com/docs/headers/request-headers).
The adapter ignores caller Host, Forwarded and XFF, and asserts only this validated
IP to the backend over HTTPS using the dedicated bearer. Heroku trusts this body
only after authentication; public callers cannot choose another client's quota.
No browser Basic credentials, cookies, destination or forwarding headers are
sent with admission. A front proxy requires an independently verified identity
design; do not copy this trust to direct/unverified server ingress.

Production has no local-map fallback or bypass. Local development bypasses
admission only in a development build outside Vercel and NODE_ENV=production.
Missing identity/secret, disabled or old backend endpoint, unexpected HTTP status,
Redis outage, network failure and a two-second total deadline produce uncached
503 before URL/blog operations. The HTTP request is cancelled on deadline; no
uncertain increment is retried or refunded. Only backend 204 grants admission;
429 remains uncached 429 and propagates validated Retry-After (1–3600 seconds).
Admission failure leaves the backend's health endpoints outside rate limiting.

Authenticated admission pays the backend's existing 5000/minute emergency
ceiling and its selected frontend bucket, while bypassing the unrelated
50/5-minute API budget that would incorrectly pool Vercel egress addresses.
Unauthenticated admission receives that ordinary API budget. Owner visits make
two admission calls (aggregate then owner), failed authentication a third, and
numeric resolution one; permitted operations then pay their existing backend
quota separately. These extra HTTPS/Redis operations increase latency and
backend load, and can exhaust the backend ceiling before the frontend owner
ceiling. The Heroku Mini service fee remains the existing fee; monitor capacity
and aggregate latency/status without logging client IPs or destinations.

## Deployment gate and rollback

1. Configure the same independent `RATE_LIMIT_SECRET` privately on Heroku and
   Vercel Preview/Production, preserving existing owner/database settings.
2. Merge/deploy backend admission support first. Older frontend deployments
   remain compatible because the endpoint and secret are additive. Read-only
   health and an authenticated synthetic admission call must succeed before the
   frontend rollout. Do not publish a frontend version against a missing endpoint.
3. Deploy the frontend PR to Preview with the new settings. Test actual HTTPS
   ingress for client isolation, forged forwarding/Host/x-real-ip headers,
   normalized/encoded/trailing-slash routes, IPv6 grouping, and bounded 429/503
   recovery. Preview deployment protection must remain in place; use authorized
   test access rather than disabling it.
4. Verify shared quotas across frontend replicas/regions, aggregate sharing
   across different IPs, owner/relay separation, Basic/Origin/blog/preview/Blob
   authorization, browser secret isolation and a harmless known-link Location
   without following it. Then approve the production frontend merge/deployment.

Until live checks pass, local fixtures prove adapter/contracts and deployment
behavior remains unverified. The frontend's former Firewall requirements are
removed; no rule publication or Vercel plan upgrade is part of this rollout.

Rollback frontend code and its admission provider together; the former SDK
version requires its own enforcing rules, so on Hobby roll back to the earlier
compatible frontend release rather than the undeployable four-rule version.
Backend admission support can remain installed while rolling back the frontend.
Keep owner credentials, issued mappings and uniqueness indexes. Never reset
counter namespaces or rewrite/revoke mappings implicitly.

## Local regression gates

Use Node 24.x and pinned pnpm 9.15.9. Run `pnpm test`, `pnpm build`,
`pnpm test:runtime`, `pnpm test:e2e` sequentially, then `git diff --check`.
Unit tests inject admission decisions; generated-handler tests exercise
the production HTTPS adapter against synthetic fetch responses and scan browser assets for
credentials/server modules. Playwright uses a disposable loopback backend with
synthetic credentials, mocks failures/mismatches and blocks outside browser
requests. None of these tests prove deployed Vercel counters or production TLS.

The pnpm lock is authoritative for this repository. The historical npm lock
already differs from current application dependency versions; both files are
retained with only the obsolete zero-dependency Firewall SDK removed, without an
unrelated npm dependency refresh.

References: [Vercel ingress headers](https://vercel.com/docs/headers/request-headers),
[Vercel rate-limit plan limits](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting),
[Vercel front proxies](https://vercel.com/docs/security/reverse-proxy),
[backend limiter operations](https://github.com/Khanos/khanos.backend/blob/main/docs/url-security.md).
