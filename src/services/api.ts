import { parseBackendBase } from '../config/backend.mjs';

export class ApiRequestError extends Error {
  constructor(public status: number, public retryAfter?: number) { super('API request failed'); }
}
export const URL_RECORD_BYTES = 16 * 1024;
export const URL_LIST_BYTES = 1024 * 1024;
export function validatedRetryAfter(value: string | null, now = Date.now()): number | undefined {
  if (!value || value.length > 64) return undefined;
  let seconds: number;
  if (/^\d{1,4}$/.test(value)) seconds = Number(value);
  else {
    // Accept HTTP dates, not Date.parse's permissive numeric/locale formats.
    if (!/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(value)) return undefined;
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp) || new Date(timestamp).toUTCString() !== value) return undefined;
    seconds = Math.ceil((timestamp - now) / 1000);
  }
  return Number.isInteger(seconds) && seconds >= 1 && seconds <= 3600 ? seconds : undefined;
}
export function backendBase(value = import.meta.env.PUBLIC_BACKEND_API_URL, development = import.meta.env.DEV) {
  try { return parseBackendBase(value, development); }
  catch { throw new ApiRequestError(503); }
}
export async function apiJson<T>(url: string | URL, init: RequestInit, validate: (data: unknown) => data is T, timeoutMs = 8000, maxBytes?: number): Promise<T> {
  const signal = init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal, redirect: 'error', cache: 'no-store' });
    if (!response.ok) {
      void response.body?.cancel().catch(() => {});
      throw new ApiRequestError(response.status, response.status === 429 ? validatedRetryAfter(response.headers.get('retry-after')) : undefined);
    }
    const data: unknown = maxBytes === undefined ? await response.json() : await boundedJson(response, signal, maxBytes);
    if (!validate(data)) throw new ApiRequestError(502);
    return data;
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    throw new ApiRequestError(signal.aborted ? 504 : 502);
  }
}

async function boundedJson(response: Response, signal: AbortSignal, maxBytes: number): Promise<unknown> {
  const mediaType = response.headers.get('content-type')?.split(';')[0].trim() || '';
  const length = response.headers.get('content-length');
  if (!/^application\/(?:json|[a-z\d!#$&^_.+-]+\+json)$/i.test(mediaType) ||
      (length !== null && (!/^\d+$/.test(length) || Number(length) > maxBytes)) || !response.body) {
    void response.body?.cancel().catch(() => {});
    throw new ApiRequestError(502);
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  const aborted = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener('abort', aborted, { once: true });
  try {
    signal.throwIfAborted();
    while (true) {
      const chunk = await reader.read();
      signal.throwIfAborted();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maxBytes) { void reader.cancel().catch(() => {}); throw new ApiRequestError(502); }
      chunks.push(chunk.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    signal.throwIfAborted();
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } finally {
    signal.removeEventListener('abort', aborted);
    reader.releaseLock();
  }
}
