// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// Define a `type` and `schema` for each collection
const podcastsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    longDescription: z.string(),
    theme: z.string(),
    image: z.string(),
    link: z.string(),
  }),
});

const tvShowsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    longDescription: z.string(),
    theme: z.string(),
    image: z.string(),
    link: z.string(),
  }),
});

// Export a single `collections` object to register your collection(s)
export const collections = {
  podcasts: podcastsCollection,
  tvShows: tvShowsCollection,
};
