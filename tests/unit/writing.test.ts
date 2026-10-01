import { describe, expect, it } from "vitest";
import type { CollectionEntry } from "astro:content";
import {
  articleText,
  latestPublishedPosts,
  publicationDate,
  readingMinutes,
} from "../../src/utils/writing";

function post(
  id: string,
  date: string,
  draft = false,
): CollectionEntry<"posts"> {
  return {
    id,
    collection: "posts",
    data: {
      title: id,
      author: "Test author",
      date,
      draft,
      image: { src: "/test.jpg", width: 1, height: 1, format: "jpg" },
    },
    body: "A test article.",
  };
}

const now = new Date("2026-10-01T12:00:00Z");

describe("publicationDate", () => {
  it("parses existing day/month/year dates in UTC", () => {
    expect(publicationDate("05/03/2024").toISOString()).toBe(
      "2024-03-05T00:00:00.000Z",
    );
  });
  it("supports ISO dates", () => {
    expect(publicationDate("2026-10-01").toISOString()).toBe(
      "2026-10-01T00:00:00.000Z",
    );
  });
  it("rejects invalid dates instead of rolling them into another month", () => {
    expect(publicationDate("31/02/2026").getTime()).toBeNaN();
    expect(publicationDate("not a date").getTime()).toBeNaN();
    expect(publicationDate("29/02/2024").toISOString()).toBe(
      "2024-02-29T00:00:00.000Z",
    );
  });
});

describe("latestPublishedPosts", () => {
  it("returns the three newest eligible articles without mutating the input", () => {
    const posts = [
      post("en/older", "05/03/2024"),
      post("en/latest", "01/10/2026"),
      post("en/old", "14/03/2024"),
      post("en/middle", "16/04/2024"),
    ];
    const original = [...posts];
    expect(
      latestPublishedPosts(posts, "en", now).map((post) => post.id),
    ).toEqual(["en/latest", "en/middle", "en/old"]);
    expect(posts).toEqual(original);
  });
  it("filters by language and excludes drafts, future dates, and invalid dates", () => {
    const posts = [
      post("en/published", "30/09/2026"),
      post("es/published", "01/10/2026"),
      post("en/draft", "01/10/2026", true),
      post("en/future", "02/10/2026"),
      post("en/invalid", "31/02/2026"),
    ];
    expect(
      latestPublishedPosts(posts, "en", now).map((post) => post.id),
    ).toEqual(["en/published"]);
    expect(
      latestPublishedPosts(posts, "es", now).map((post) => post.id),
    ).toEqual(["es/published"]);
  });
  it("handles fewer than three posts and an empty collection", () => {
    expect(latestPublishedPosts([], "en", now)).toEqual([]);
    expect(
      latestPublishedPosts([post("es/only", "01/10/2026")], "es", now),
    ).toHaveLength(1);
  });
});

describe("article previews and reading time", () => {
  it("removes Markdown/MDX syntax from the excerpt", () => {
    const body =
      'import Chart from "./chart";\n\n# Heading\n\nA **useful** [article](https://example.com).\n\n```js\nconst hidden = true;\n```\n\n![Cover](cover.png)\n<Chart />';
    expect(articleText(body)).toBe("A useful article.");
  });
  it("estimates at 200 words per minute, rounding up", () => {
    expect(readingMinutes("word")).toBe(1);
    expect(readingMinutes(Array(200).fill("word").join(" "))).toBe(1);
    expect(readingMinutes(Array(201).fill("word").join(" "))).toBe(2);
  });
  it("omits reading time when there is no readable content", () => {
    expect(readingMinutes()).toBeUndefined();
    expect(readingMinutes("# Heading\n\n<Chart />")).toBeUndefined();
  });
});
