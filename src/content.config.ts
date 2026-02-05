import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const podcasts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/resources/podcasts" }),
  schema: () =>
    z.object({
      title: z.string(),
      shortDescription: z.string(),
      longDescription: z.string(),
      theme: z.string(),
      image: z.string(),
      link: z.string().url(),
    }),
});

const tvShows = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/resources/tvshows" }),
  schema: () =>
    z.object({
      title: z.string(),
      shortDescription: z.string().optional(),
      longDescription: z.string(),
      theme: z.string(),
      image: z.string(),
      link: z.string().url(),
    }),
});

const movies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/resources/movies" }),
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

const freebies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/freebies" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    brevoListId: z.number(),
    slug: z.string(),
    buttonText: z.string().default("Download"),
    // SEO
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

export const collections = {
  podcasts,
  tvShows,
  movies,
  freebies,
};
