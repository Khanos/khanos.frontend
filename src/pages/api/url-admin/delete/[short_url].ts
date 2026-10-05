import type { APIRoute } from 'astro';
import { apiResult, backendJson } from '../../../../server/backend';
import { urlRecordForCode, normalizedCode } from '../../../../services/contracts';
import { ApiRequestError, URL_RECORD_BYTES } from '../../../../services/api';

export const DELETE: APIRoute = ({ request, params }) => apiResult(() => {
  const code = params.short_url && normalizedCode(params.short_url);
  if (code === undefined || code === null) throw new ApiRequestError(400);
  return backendJson(`url/delete/${code}`, request, urlRecordForCode(code), { method: 'DELETE' }, process.env, URL_RECORD_BYTES);
});
