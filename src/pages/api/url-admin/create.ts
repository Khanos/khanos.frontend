import type { APIRoute } from 'astro';
import { apiResult, backendJson, originalUrlBody } from '../../../server/backend';
import { isUrlRecord } from '../../../services/contracts';

export const POST: APIRoute = ({ request }) => apiResult(async () =>
  backendJson('url/create', request, isUrlRecord, { method: 'POST', body: JSON.stringify(await originalUrlBody(request)) }));
