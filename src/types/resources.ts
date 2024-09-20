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
  image: string;
  theme: PodcastsThemes;
  link: string;
}

export interface TvShow {
  title: string;
  longDescription: string;
  image: string;
  theme: TvShowsThemes;
  link: string;
  url: string;
  slug?: string;
}
