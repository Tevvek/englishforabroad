export enum TagsPodcasts {
  English = "English Language",
  News = "News & Current Events",
  Stories = "Stories & Literature",
  SelfHelp = "Self Help & Psychology",
  Art = "Art & Design",
  Business = "Business & Tech",
}

export interface Podcast {
  title: string;
  description: string;
  image: string;
  tag: TagsPodcasts;
}
