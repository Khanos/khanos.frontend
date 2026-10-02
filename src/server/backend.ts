import { apiJson, ApiRequestError, backendBase } from '../services/api';

export const privateHeaders = { 'Cache-Control': 'no-store', Vary: 'Authorization' };
export const apiError = (status: number, code: string) => Response.json({ error: 'Request could not be completed', code }, { status, headers: privateHeaders });
export function validOwnerToken(value: unknown): value is string {
  return typeof value === 'string' && /^[\x21-\x7e]{32,256}$/.test(value);
}
export async function backendJson<T>(path: string, request: Request, validate: (data: unknown) => data is T,
  init: RequestInit = {}, env = process.env): Promise<T> {
  if (!validOwnerToken(env.OWNER_API_TOKEN)) throw new ApiRequestError(503);
  const timeout = env.BACKEND_TIMEOUT_MS || '8000';
  if (!/^\d+$/.test(timeout) || Number(timeout) < 1 || Number(timeout) > 30000) throw new ApiRequestError(503);
  const base = backendBase(env.PUBLIC_BACKEND_API_URL || import.meta.env.PUBLIC_BACKEND_API_URL, import.meta.env.DEV);
  return apiJson(new URL(path, base), { ...init, credentials: 'omit', signal: request.signal,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${env.OWNER_API_TOKEN}` },
  }, validate, Number(timeout));
}
export async function apiResult<T>(work: () => Promise<T>) {
  try { return Response.json(await work(), { headers: privateHeaders }); }
  catch (error) { return apiError(error instanceof ApiRequestError ? error.status : 503, 'BACKEND_REQUEST_FAILED'); }
}
export async function originalUrlBody(request: Request) {
  if (!/^application\/json$/i.test(request.headers.get('content-type')?.split(';')[0].trim() || '')) throw new ApiRequestError(415);
  const reader = request.body?.getReader();
  if (!reader) throw new ApiRequestError(400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 16384) { await reader.cancel(); throw new ApiRequestError(413); }
      chunks.push(chunk.value);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!body || typeof body.original_url !== 'string' || body.original_url.length > 2048) throw new ApiRequestError(400);
    return { original_url: body.original_url };
  } catch (error) { throw error instanceof ApiRequestError ? error : new ApiRequestError(400); }
  finally { reader.releaseLock(); }
}
