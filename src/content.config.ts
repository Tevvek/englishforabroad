import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const podcasts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/resources/podcasts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      shortDescription: z.string(),
      longDescription: z.string(),
      theme: z.string(),
      image: image(),
      link: z.string().url(),
    }),
});

const tvShows = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/resources/tvshows" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      shortDescription: z.string().optional(),
      longDescription: z.string(),
      theme: z.string(),
      image: image(),
      link: z.string().url(),
    }),
});

export const collections = {
  podcasts,
  tvShows,
};
