import type { CollectionEntry } from "astro:content";

// Existing articles use DD/MM/YYYY; ISO dates are also supported for new posts.
export function publicationDate(value: string): Date {
  const parts = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!parts) return new Date(value);
  const [, day, month, year] = parts;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return date.getUTCDate() === Number(day) &&
    date.getUTCMonth() === Number(month) - 1
    ? date
    : new Date(NaN);
}

export function latestPublishedPosts(
  posts: CollectionEntry<"posts">[],
  lang: "en" | "es",
  now = new Date(),
) {
  return posts
    .filter(
      (post) =>
        post.id.startsWith(`${lang}/`) &&
        !post.data.draft &&
        publicationDate(post.data.date).getTime() <= now.getTime(),
    )
    .sort(
      (a, b) =>
        publicationDate(b.data.date).getTime() -
          publicationDate(a.data.date).getTime() || a.id.localeCompare(b.id),
    )
    .slice(0, 3);
}

export function articleText(body = ""): string {
  return body
    .replace(/^import[\s\S]*?;\s*$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+.*$/gm, "")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
