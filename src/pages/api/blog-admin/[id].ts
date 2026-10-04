import type { APIRoute } from "astro";
import {
  adminResult,
  blogBackend,
  BlogAdminError,
  postBody,
} from "../../../server/blogAdmin";
import {
  isAdminPost,
  validBlogId,
} from "../../../services/blog-admin-contract";
const idPath = (id: string | undefined) => {
  if (!id || !validBlogId(id)) throw new BlogAdminError(400);
  return `blog/${id}`;
};
export const GET: APIRoute = ({ request, params }) =>
  adminResult(() =>
    blogBackend(
      idPath(params.id).replace("blog/", "blog/admin/"),
      request,
      isAdminPost,
    ),
  );
export const PATCH: APIRoute = ({ request, params }) =>
  adminResult(async () =>
    blogBackend(idPath(params.id), request, isAdminPost, {
      method: "PATCH",
      body: JSON.stringify(await postBody(request)),
    }),
  );
export const DELETE: APIRoute = ({ request, params }) =>
  adminResult(() =>
    blogBackend(idPath(params.id), request, (_): _ is undefined => true, {
      method: "DELETE",
    }),
  );
