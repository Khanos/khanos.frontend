import { isIP } from 'node:net';
import { apiError, validOwnerToken } from './backend';
import { backendBase, validatedRetryAfter } from '../services/api';

type LimitKind = 'aggregate' | 'owner' | 'failure' | 'resolver';
type Decision = { rateLimited: boolean; retryAfter?: number; error?: unknown };
type Check = (kind: LimitKind, options: { clientIp: string; signal: AbortSignal; env: NodeJS.ProcessEnv }) => Promise<Decision>;

// Heroku owns the single native Redis connection. Serverless frontend instances
// share its counters over this authenticated, fixed-policy HTTPS admission API.
const checkAdmission: Check = async (kind, { clientIp, signal, env }) => {
  const base = backendBase(env.PUBLIC_BACKEND_API_URL || import.meta.env.PUBLIC_BACKEND_API_URL, false);
  const response = await fetch(new URL('admission', base), {
    method: 'POST', credentials: 'omit', redirect: 'error', signal,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.RATE_LIMIT_SECRET}` },
    body: JSON.stringify({ kind, clientIp, environment: env.VERCEL_ENV }),
  });
  // Only the documented empty success permits work. Never parse/forward provider
  // error text; cancel bodies instead of buffering them, including unexpected 200s.
  const retryAfter = response.status === 429 ? validatedRetryAfter(response.headers.get('Retry-After')) : undefined;
  await response.body?.cancel();
  if (response.status === 204) return { rateLimited: false };
  if (response.status === 429) return { rateLimited: true, retryAfter };
  throw new Error('Admission unavailable');
};

export async function enforceRateLimit(request: Request, kind: LimitKind, env = process.env, check: Check = checkAdmission): Promise<Response | null> {
  if (import.meta.env.DEV && env.NODE_ENV !== 'production' && env.VERCEL !== '1') return null;
  const host = env.VERCEL_URL;
  const ip = request.headers.get('x-real-ip');
  const secret = env.RATE_LIMIT_SECRET;
  // Vercel overwrites x-real-ip at ingress. Never derive identity from caller Host,
  // Forwarded or XFF; never send Basic, cookies or arbitrary headers to Heroku.
  if (env.VERCEL !== '1' || env.NODE_ENV !== 'production' || !['production', 'preview'].includes(env.VERCEL_ENV || '') ||
      !host || !/^[a-z\d](?:[a-z\d.-]{0,251}[a-z\d])?\.vercel\.app$/i.test(host) || !ip || !isIP(ip) ||
      !validOwnerToken(secret) || [env.OWNER_API_TOKEN, env.URL_ADMIN_PASSWORD, env.URL_ADMIN_USERNAME].includes(secret)) {
    return apiError(503, 'RATE_LIMIT_UNAVAILABLE');
  }
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      check(kind, { clientIp: ip, env, signal: AbortSignal.any([request.signal, controller.signal]) }),
      new Promise<never>((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error('Admission deadline')); }, 2000); }),
    ]);
    if (result.error || typeof result.rateLimited !== 'boolean') return apiError(503, 'RATE_LIMIT_UNAVAILABLE');
    if (!result.rateLimited) return null;
    const response = apiError(429, 'RATE_LIMITED');
    if (Number.isInteger(result.retryAfter) && result.retryAfter! >= 1 && result.retryAfter! <= 3600) response.headers.set('Retry-After', String(result.retryAfter));
    return response;
  } catch { return apiError(503, 'RATE_LIMIT_UNAVAILABLE'); }
  finally { if (timer) clearTimeout(timer); controller.abort(); }
}
