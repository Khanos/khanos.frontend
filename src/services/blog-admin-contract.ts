import type { BlogPage, BlogPost, BlogPostSummary } from "../types/blog";

export type BlogInput = Pick<
  BlogPost,
  | "title"
  | "language"
  | "slug"
  | "coverImage"
  | "content"
  | "categories"
  | "author"
  | "anonymous"
  | "excerpt"
  | "status"
> & { publishedAt?: string };
export const inputFields = [
  "title",
  "language",
  "slug",
  "coverImage",
  "content",
  "categories",
  "author",
  "anonymous",
  "excerpt",
  "status",
  "publishedAt",
] as const;
export const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const validDate = (value: unknown) =>
  typeof value === "string" && Number.isFinite(Date.parse(value));
export const validBlogId = (id: string) => /^[a-f0-9]{24}$/.test(id);
export function suggestSlug(title: string, language: "en" | "es") {
  const part = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${language}/${part}`;
}
export function validateBlogInput(value: unknown): Record<string, string> {
  if (!isObject(value)) return { content: "Expected a JSON post." };
  const errors: Record<string, string> = {};
  for (const [key, max] of [
    ["title", 300],
    ["author", 200],
    ["excerpt", 2000],
    ["content", 400000],
    ["coverImage", 2048],
  ] as const) {
    if (typeof value[key] !== "string" || value[key].length > max)
      errors[key] =
        `Must be text with at most ${max.toLocaleString()} characters.`;
  }
  for (const key of ["title", "content", "coverImage"])
    if (typeof value[key] === "string" && !value[key].trim())
      errors[key] = "Required.";
  if (!["en", "es"].includes(String(value.language)))
    errors.language = "Choose English or Spanish.";
  if (
    typeof value.slug !== "string" ||
    value.slug.length > 240 ||
    !/^(en|es)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug) ||
    !value.slug.startsWith(`${value.language}/`)
  )
    errors.slug =
      "Use the selected language prefix and lowercase words separated by hyphens.";
  try {
    const url = new URL(String(value.coverImage));
    if (url.protocol !== "https:" || url.username || url.password)
      throw new Error();
  } catch {
    errors.coverImage = "Enter an HTTPS image URL without credentials.";
  }
  if (
    !Array.isArray(value.categories) ||
    value.categories.length > 30 ||
    !value.categories.every(
      (item) =>
        typeof item === "string" &&
        item.trim().length > 0 &&
        item.length <= 100,
    )
  )
    errors.categories = "Use up to 30 categories, each at most 100 characters.";
  if (typeof value.anonymous !== "boolean")
    errors.anonymous = "Choose whether the post is anonymous.";
  if (!["draft", "published"].includes(String(value.status)))
    errors.status = "Choose draft or published.";
  if (value.publishedAt !== undefined && !validDate(value.publishedAt))
    errors.publishedAt = "Enter a valid publication date.";
  return errors;
}
export function isAdminSummary(value: unknown): value is BlogPostSummary {
  return (
    isObject(value) &&
    typeof value.id === "string" &&
    validBlogId(value.id) &&
    typeof value.slug === "string" &&
    /^(en|es)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug) &&
    ["en", "es"].includes(String(value.language)) &&
    value.slug.startsWith(`${value.language}/`) &&
    ["title", "author", "excerpt", "coverImage"].every(
      (key) => typeof value[key] === "string",
    ) &&
    typeof value.anonymous === "boolean" &&
    ["draft", "published"].includes(String(value.status)) &&
    (value.publishedAt === undefined || validDate(value.publishedAt)) &&
    (value.displayDate === undefined ||
      typeof value.displayDate === "string") &&
    validDate(value.createdAt) &&
    validDate(value.updatedAt) &&
    Array.isArray(value.categories) &&
    value.categories.every((item) => typeof item === "string") &&
    Number.isInteger(value.readingMinutes) &&
    Number(value.readingMinutes) >= 0
  );
}
export function isAdminPost(value: unknown): value is BlogPost {
  return (
    isAdminSummary(value) &&
    "content" in value &&
    typeof value.content === "string"
  );
}
export function isAdminPage(value: unknown): value is BlogPage {
  return (
    isObject(value) &&
    Array.isArray(value.data) &&
    value.data.every(isAdminSummary) &&
    isObject(value.pagination) &&
    ["page", "limit", "total", "pages"].every(
      (key) =>
        Number.isInteger((value.pagination as Record<string, unknown>)[key]) &&
        Number((value.pagination as Record<string, unknown>)[key]) >=
          (key === "page" || key === "limit" ? 1 : 0),
    )
  );
}
