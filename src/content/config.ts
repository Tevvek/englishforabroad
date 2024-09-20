// Import utilities from `astro:content`
import { z, defineCollection, type Render } from "astro:content";

const podcastsSchema = z.object({
  title: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  theme: z.string(),
  image: z.string(),
  link: z.string(),
});
// Define a `type` and `schema` for each collection
const podcastsCollection = defineCollection({
  type: "content",
  schema: podcastsSchema,
});

export type Podcast = {
  id: string;
  slug: string;
  body: string;
  collection: "pages";
  data: z.infer<typeof podcastsSchema>;
} & { render(): Render[".md"] };

const tvShowsSchema = z.object({
  title: z.string(),
  shortDescription: z.string().optional(),
  longDescription: z.string(),
  theme: z.string(),
  image: z.string(),
  link: z.string(),
});
const tvShowsCollection = defineCollection({
  type: "content",
  schema: tvShowsSchema,
});

export type TVShow = {
  id: string;
  slug: string;
  body: string;
  collection: "pages";
  data: z.infer<typeof tvShowsSchema>;
} & { render(): Render[".md"] };

// Export a single `collections` object to register your collection(s)
export const collections = {
  podcasts: podcastsCollection,
  tvshows: tvShowsCollection,
};
