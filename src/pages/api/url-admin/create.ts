import type { APIRoute } from 'astro';
import { apiResult, backendJson, originalUrlBody } from '../../../server/backend';
import { urlRecordForOriginal } from '../../../services/contracts';
import { URL_RECORD_BYTES } from '../../../services/api';

export const POST: APIRoute = ({ request }) => apiResult(async () => {
  const body = await originalUrlBody(request);
  return backendJson('url/create', request, urlRecordForOriginal(body.original_url), { method: 'POST', body: JSON.stringify(body) }, process.env, URL_RECORD_BYTES);
});
