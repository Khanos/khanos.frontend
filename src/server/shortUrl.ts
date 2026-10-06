import { ApiRequestError, URL_RECORD_BYTES } from '../services/api';
import { normalizedCode, urlRecordForCode } from '../services/contracts';
import { backendJson } from './backend';

// Server/frontmatter only. Public visitors never need Basic credentials.
export async function resolveShortUrl(urlId: string, request: Request, env = process.env) {
  const code = normalizedCode(urlId);
  if (code === null) throw new ApiRequestError(400);
  return backendJson(`url/${code}`, request, urlRecordForCode(code), {}, env, URL_RECORD_BYTES);
}
