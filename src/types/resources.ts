import type { ImageMetadata } from "astro";

export type ResourceImage = string | ImageMetadata;

export enum PodcastsThemes {
  Art = "Art & Design",
  Culture = "Culture & Society",
  English = "English & Language",
  Business = "Finance & Business",
  Stories = "Literature & Stories",
  Movies = "Movies & TV",
  Music = "Music",
  News = "News & Politics",
  Science = "Science & Tech",
  SelfHelp = "Self-Help & Psychology",
}

export enum TvShowsThemes {
  Comedy = "Comedy",
  Drama = "Drama",
  Documentary = "Documentary",
  ScienceFiction = "Science Fiction",
  Reality = "Reality & Competition",
}
export interface Podcast {
  title: string;
  shortDescription: string;
  longDescription: string;
  image: ResourceImage;
  theme: PodcastsThemes;
  link: string;
  url: string;
  slug?: string;
}

export interface TvShow {
  title: string;
  longDescription: string;
  image: ResourceImage;
  theme: TvShowsThemes;
  link: string;
  url: string;
  slug?: string;
}

export interface Movie {
  title: string;
  longDescription: string;
  image: string;
  theme: string;
  link: string;
  url: string;
  slug?: string;
}
