import type { APIRoute } from 'astro';
import { apiResult, backendJson } from '../../../server/backend';
import { isUrlList } from '../../../services/contracts';
import { ApiRequestError } from '../../../services/api';

export const GET: APIRoute = ({ request, url }) => apiResult(() => {
  const after = url.searchParams.get('after');
  if (url.searchParams.getAll('after').length > 1 || (after !== null && !/^[a-f\d]{24}$/.test(after))) throw new ApiRequestError(400);
  return backendJson(`url?limit=25${after ? `&after=${after}` : ''}`, request, isUrlList);
});
