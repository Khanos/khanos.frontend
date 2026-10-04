import { ApiRequestError, backendBase } from "../services/api";
import { privateHeaders, validOwnerToken } from "./backend";
import {
  inputFields,
  isObject,
  validateBlogInput,
} from "../services/blog-admin-contract";

export class BlogAdminError extends ApiRequestError {
  constructor(
    status: number,
    public fields: Record<string, string> = {},
  ) {
    super(status);
  }
}
// Bound both incoming JSON and upstream responses; never relay arbitrary provider text.
export async function readJson(
  body: ReadableStream<Uint8Array> | null,
  maximum = 512 * 1024,
): Promise<unknown> {
  const reader = body?.getReader();
  if (!reader) throw new BlogAdminError(400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maximum) {
        await reader.cancel();
        throw new BlogAdminError(413);
      }
      chunks.push(chunk.value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) {
    throw error instanceof BlogAdminError ? error : new BlogAdminError(400);
  } finally {
    reader.releaseLock();
  }
}
export async function adminBody(request: Request) {
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    throw new BlogAdminError(415);
  return readJson(request.body);
}
export async function postBody(request: Request) {
  const value = await adminBody(request);
  const fields = validateBlogInput(value);
  if (Object.keys(fields).length) throw new BlogAdminError(422, fields);
  return Object.fromEntries(
    inputFields
      .filter((key) => (value as Record<string, unknown>)[key] !== undefined)
      .map((key) => [key, (value as Record<string, unknown>)[key]]),
  );
}
export function adminQuery(url: URL) {
  const query = new URLSearchParams();
  for (const [key, fallback, pattern] of [
    ["status", "", /^(draft|published)$/],
    ["language", "", /^(en|es)$/],
    ["page", "1", /^[1-9]\d{0,5}$/],
    ["limit", "25", /^(?:[1-9]|[1-4]\d|50)$/],
  ] as const) {
    const value = url.searchParams.get(key) ?? fallback;
    if (
      url.searchParams.getAll(key).length > 1 ||
      (value && !pattern.test(value))
    )
      throw new BlogAdminError(400);
    if (value) query.set(key, value);
  }
  return query.toString();
}
export async function blogBackend<T>(
  path: string,
  request: Request,
  validate: (data: unknown) => data is T,
  init: RequestInit = {},
  env = process.env,
): Promise<T> {
  if (!validOwnerToken(env.OWNER_API_TOKEN)) throw new BlogAdminError(503);
  const timeout = Number(env.BACKEND_TIMEOUT_MS || "8000");
  if (!Number.isInteger(timeout) || timeout < 1 || timeout > 30000)
    throw new BlogAdminError(503);
  const signal = AbortSignal.any([
    request.signal,
    AbortSignal.timeout(timeout),
  ]);
  try {
    const response = await fetch(
      new URL(
        path,
        backendBase(
          env.PUBLIC_BACKEND_API_URL || import.meta.env.PUBLIC_BACKEND_API_URL,
          import.meta.env.DEV,
        ),
      ),
      {
        ...init,
        signal,
        redirect: "error",
        cache: "no-store",
        credentials: "omit",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OWNER_API_TOKEN}`,
        },
      },
    );
    if (!response.ok) {
      const fields: Record<string, string> = {};
      // Only field names are accepted from validation errors, never messages/values.
      if ([400, 422].includes(response.status)) {
        const data = await readJson(response.body, 64 * 1024).catch(() => null);
        if (isObject(data)) {
          const errors = data.errors || data.fields;
          if (isObject(errors))
            for (const key of inputFields)
              if (key in errors)
                fields[key] = "Rejected by the backend. Check this field.";
        }
      } else await response.body?.cancel();
      throw new BlogAdminError(response.status, fields);
    }
    if (init.method === "DELETE") {
      await response.body?.cancel();
      return undefined as T;
    }
    let data: unknown;
    try {
      data = await readJson(response.body, 2 * 1024 * 1024);
    } catch {
      throw new BlogAdminError(502);
    }
    if (!validate(data)) throw new BlogAdminError(502);
    return data;
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    throw new BlogAdminError(signal.aborted ? 504 : 502);
  }
}
export async function adminResult(work: () => Promise<unknown>) {
  try {
    return Response.json((await work()) ?? { ok: true }, {
      headers: privateHeaders,
    });
  } catch (error) {
    const status = error instanceof ApiRequestError ? error.status : 503;
    const messages: Record<number, string> = {
      400: "Invalid request. Check your post and filters.",
      401: "Owner access expired or backend authorization failed. Reload to sign in.",
      403: "Request denied. Reload this page and try again.",
      404: "Post no longer exists.",
      409: "This slug is already in use. Choose another slug.",
      413: "Post is too large.",
      415: "Expected JSON.",
      422: "Check the highlighted fields. The backend rejected this post.",
      429: "Too many requests. Wait a moment and try again.",
    };
    return Response.json(
      {
        error:
          messages[status] || "Blog service unavailable. Try again shortly.",
        fields: error instanceof BlogAdminError ? error.fields : {},
      },
      { status, headers: privateHeaders },
    );
  }
}
