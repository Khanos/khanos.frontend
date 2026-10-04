import type { APIRoute } from "astro";
import {
  adminBody,
  adminResult,
  BlogAdminError,
} from "../../../server/blogAdmin";
import { isObject } from "../../../services/blog-admin-contract";
import { renderBlog } from "../../../utils/blog-render";
export const POST: APIRoute = ({ request }) =>
  adminResult(async () => {
    const body = await adminBody(request);
    if (
      !isObject(body) ||
      typeof body.content !== "string" ||
      body.content.length > 400000
    )
      throw new BlogAdminError(422, {
        content: "Enter Markdown with at most 400,000 characters.",
      });
    return { html: renderBlog(body.content) };
  });
