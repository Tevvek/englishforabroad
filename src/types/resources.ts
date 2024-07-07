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

export interface Podcast {
  title: string;
  shortDescription: string;
  longDescriptionDescription: string;
  image: string;
  theme: PodcastsThemes;
  link: string;
  url: string;
  slug?: string;
}
