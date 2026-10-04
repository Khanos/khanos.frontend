import type { APIRoute } from "astro";
import {
  adminQuery,
  adminResult,
  blogBackend,
  postBody,
} from "../../../server/blogAdmin";
import {
  isAdminPage,
  isAdminPost,
} from "../../../services/blog-admin-contract";
export const GET: APIRoute = ({ request, url }) =>
  adminResult(() =>
    blogBackend(`blog/admin?${adminQuery(url)}`, request, isAdminPage),
  );
export const POST: APIRoute = ({ request }) =>
  adminResult(async () =>
    blogBackend("blog", request, isAdminPost, {
      method: "POST",
      body: JSON.stringify(await postBody(request)),
    }),
  );
