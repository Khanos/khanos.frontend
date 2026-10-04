import { isObject } from "../../services/blog-admin-contract";
export class AdminRequestError extends Error {
  constructor(
    message: string,
    public fields: Record<string, string> = {},
  ) {
    super(message);
  }
}
export async function adminRequest<T>(
  path: string,
  init: RequestInit = {},
  validate?: (value: unknown) => value is T,
): Promise<T> {
  const response = await fetch(`/api/blog-admin${path}`, {
    ...init,
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok)
    throw new AdminRequestError(
      isObject(data) && typeof data.error === "string"
        ? data.error
        : "Request failed. Reload to sign in or try again.",
      isObject(data) && isObject(data.fields)
        ? (data.fields as Record<string, string>)
        : {},
    );
  if (validate && !validate(data))
    throw new AdminRequestError("Unexpected blog response. Try again shortly.");
  return data as T;
}
export const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString() : "—";
export const publicationLabel = (post: {
  status: string;
  publishedAt?: string;
}) =>
  post.status === "draft"
    ? "Draft"
    : post.publishedAt && Date.parse(post.publishedAt) > Date.now()
      ? "Scheduled"
      : "Published";
