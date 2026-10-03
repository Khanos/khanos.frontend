import { parseBackendBase } from '../config/backend.mjs';

export class ApiRequestError extends Error {
  constructor(public status: number) { super('API request failed'); }
}
export function backendBase(value = import.meta.env.PUBLIC_BACKEND_API_URL, development = import.meta.env.DEV) {
  try { return parseBackendBase(value, development); }
  catch { throw new ApiRequestError(503); }
}
export async function apiJson<T>(url: string | URL, init: RequestInit, validate: (data: unknown) => data is T, timeoutMs = 8000): Promise<T> {
  const signal = init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal, redirect: 'error', cache: 'no-store' });
    if (!response.ok) { await response.body?.cancel(); throw new ApiRequestError(response.status); }
    const data: unknown = await response.json();
    if (!validate(data)) throw new ApiRequestError(502);
    return data;
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    throw new ApiRequestError(signal.aborted ? 504 : 502);
  }
}
