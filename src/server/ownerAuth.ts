import { createHash, timingSafeEqual } from 'node:crypto';
import { apiError, privateHeaders, validOwnerToken } from './backend';

const digest = (value: string) => createHash('sha256').update(value).digest();
export function authorizeOwner(request: Request, env = process.env): Response | null {
  const username = env.URL_ADMIN_USERNAME;
  const password = env.URL_ADMIN_PASSWORD;
  if (!username || !/^[a-z\d_.-]{1,64}$/i.test(username) || !validOwnerToken(password) || !validOwnerToken(env.OWNER_API_TOKEN) ||
      password === env.OWNER_API_TOKEN || username === env.OWNER_API_TOKEN) return apiError(503, 'ADMIN_UNAVAILABLE');
  const header = request.headers.get('authorization');
  const encoded = typeof header === 'string' && /^Basic ([a-z\d+/]{1,512}={0,2})$/i.exec(header)?.[1];
  const provided = encoded ? Buffer.from(encoded, 'base64') : Buffer.alloc(0);
  if (!encoded || provided.toString('base64') !== encoded ||
      !timingSafeEqual(digest(provided.toString('utf8')), digest(`${username}:${password}`))) {
    const response = apiError(401, 'OWNER_AUTH_REQUIRED');
    response.headers.set('WWW-Authenticate', 'Basic realm="URL owner", charset="UTF-8"');
    return response;
  }
  // Browser Basic credentials are ambient; reject cross-origin mutations (CSRF).
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && request.headers.get('origin') !== new URL(request.url).origin) return apiError(403, 'INVALID_ORIGIN');
  return null;
}
export function isOwnerPath(pathname: string) {
  const path = decodeURI(pathname).replace(/\/+$/, '');
  return path === '/url' || path === '/api/url-admin' || path.startsWith('/api/url-admin/');
}
export async function ownerBoundary(request: Request, next: () => Promise<Response>, env = process.env) {
  let protectedPath;
  try { protectedPath = isOwnerPath(new URL(request.url).pathname); }
  catch { return apiError(400, 'INVALID_PATH'); }
  if (!protectedPath) return next();
  const denied = authorizeOwner(request, env);
  if (denied) return denied;
  const response = await next();
  for (const [name, value] of Object.entries(privateHeaders)) response.headers.set(name, value);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
  return response;
}
