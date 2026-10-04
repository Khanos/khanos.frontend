import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { authorizeOwner } from "./ownerAuth";
import { privateHeaders } from "./backend";
import { readJson, BlogAdminError } from "./blogAdmin";
import { isObject } from "../services/blog-admin-contract";
import {
  imagePathPattern,
  imageTypes,
  imageValidation,
  maximumImageBytes,
  type BlogImageType,
} from "../services/blog-images";

const failure = (status: number, error: string) =>
  Response.json({ error }, { status, headers: privateHeaders });
export async function authorizeBlogImageUpload(
  request: Request,
  env = process.env,
): Promise<Response> {
  // Defense in depth: also check when invoked outside Astro's owner middleware.
  const denied = authorizeOwner(request, env);
  if (denied) return denied;
  if (!env.BLOB_READ_WRITE_TOKEN)
    return failure(
      503,
      "Image uploads are not configured. Set up Vercel Blob first.",
    );
  try {
    if (
      request.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase() !== "application/json"
    )
      return failure(415, "Expected image upload authorization as JSON.");
    // This endpoint receives only small metadata, never image bytes.
    const body = await readJson(request.body, 16 * 1024);
    if (
      !isObject(body) ||
      body.type !== "blob.generate-client-token" ||
      !isObject(body.payload) ||
      typeof body.payload.pathname !== "string" ||
      !imagePathPattern.test(body.payload.pathname) ||
      body.payload.multipart !== false ||
      typeof body.payload.clientPayload !== "string"
    )
      return failure(400, "Invalid image upload request.");
    const result = await handleUpload({
      request,
      body: body as unknown as HandleUploadBody,
      token: env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Authorization has already succeeded; no callback or unauthenticated token path.
        const metadata: unknown = JSON.parse(clientPayload || "null");
        if (
          !isObject(metadata) ||
          typeof metadata.type !== "string" ||
          typeof metadata.size !== "number"
        )
          throw new BlogAdminError(400);
        if (metadata.size > maximumImageBytes) throw new BlogAdminError(413);
        if (
          imageValidation({ type: metadata.type, size: metadata.size }) ||
          !pathname.endsWith(`.${imageTypes[metadata.type as BlogImageType]}`)
        )
          throw new BlogAdminError(422);
        return {
          allowedContentTypes: [metadata.type],
          // Blob enforces the real uploaded size and MIME constraint, beyond client claims.
          maximumSizeInBytes: metadata.size,
          validUntil: Date.now() + 10 * 60 * 1000,
          addRandomSuffix: true,
          allowOverwrite: false,
        };
      },
      // No completion webhook: the browser receives the URL; Save persists it via CRUD.
    });
    return Response.json(result, { headers: privateHeaders });
  } catch (error) {
    const status =
      error instanceof BlogAdminError
        ? error.status
        : error instanceof SyntaxError
          ? 400
          : 503;
    return failure(
      status,
      status === 413
        ? "Choose an image up to 10 MB."
        : status === 422
          ? "Choose a JPEG, PNG, WebP or AVIF image with a matching file extension."
          : status === 400
            ? "Invalid image upload request."
            : "Could not authorize image upload. Try again shortly.",
    );
  }
}
