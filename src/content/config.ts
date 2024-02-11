import { defineCollection, z } from "astro:content";

const postCollection = defineCollection({
  schema: ({image}: any) => 
    z.object({
      author: z.string(),
      date: z.string(),
      image: image(),
      title: z.string(),
    }),
});

export const collections = {
  posts: postCollection,
}