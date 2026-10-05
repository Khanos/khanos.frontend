import { isIP } from 'node:net';
import { checkRateLimit } from '@vercel/firewall';
import { apiError, validOwnerToken } from './backend';

type LimitKind = 'aggregate' | 'owner' | 'failure' | 'resolver';
const settings: Record<LimitKind, string> = {
  aggregate: 'OWNER_AGGREGATE_RATE_LIMIT_ID', owner: 'OWNER_RATE_LIMIT_ID', failure: 'OWNER_FAILURE_RATE_LIMIT_ID', resolver: 'SHORT_URL_RATE_LIMIT_ID',
};
type Check = typeof checkRateLimit;

// Vercel's shared firewall counters are the enforcement scope. Never substitute
// a process-local map on serverless functions. Rule setup is a rollout gate.
export async function enforceRateLimit(request: Request, kind: LimitKind, env = process.env, check: Check = checkRateLimit): Promise<Response | null> {
  if (import.meta.env.DEV && env.NODE_ENV !== 'production' && env.VERCEL !== '1') return null;
  const id = env[settings[kind]];
  const host = env.VERCEL_URL;
  const ip = request.headers.get('x-real-ip');
  const secret = env.RATE_LIMIT_SECRET;
  // Trust this header only behind Vercel's ingress, which overwrites x-real-ip.
  // No raw Host, XFF, Basic, cookies, or destination goes to the SDK (it forwards
  // every supplied header to its internal endpoint).
  if (env.VERCEL !== '1' || env.NODE_ENV !== 'production' || !id || !/^[a-z\d_-]{1,64}$/i.test(id) ||
      !host || !/^[a-z\d](?:[a-z\d.-]{0,251}[a-z\d])?\.vercel\.app$/i.test(host) || !ip || !isIP(ip) ||
      !validOwnerToken(secret) || [env.OWNER_API_TOKEN, env.URL_ADMIN_PASSWORD, env.URL_ADMIN_USERNAME].includes(secret)) {
    return apiError(503, 'RATE_LIMIT_UNAVAILABLE');
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      check(id, { headers: new Headers({ host, 'x-real-ip': ip, 'x-forwarded-for': ip }), rateLimitKey: kind === 'aggregate' ? 'owner-emergency' : ip }),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Rate limit deadline')), 2000); }),
    ]);
    if (result.error) return apiError(503, 'RATE_LIMIT_UNAVAILABLE');
    if (typeof result.rateLimited !== 'boolean') return apiError(503, 'RATE_LIMIT_UNAVAILABLE');
    return result.rateLimited ? apiError(429, 'RATE_LIMITED') : null;
  } catch { return apiError(503, 'RATE_LIMIT_UNAVAILABLE'); }
  finally { if (timer) clearTimeout(timer); }
}
