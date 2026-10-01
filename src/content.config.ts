import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      author: z.string(),
      date: z.string(),
      image: image(),
      title: z.string(),
      description: z.string().optional(),
      anonymous: z.boolean().optional(),
    }),
});

export const collections = {
  posts: postCollection,
};
