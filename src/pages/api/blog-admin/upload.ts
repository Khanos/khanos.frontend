import type { APIRoute } from "astro";
import { authorizeBlogImageUpload } from "../../../server/blogImageUpload";

export const POST: APIRoute = ({ request }) =>
  authorizeBlogImageUpload(request);
