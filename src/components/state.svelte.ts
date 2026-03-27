import { PodcastsThemes, TvShowsThemes } from "@/types/resources";

export const selection = $state({
  podcast: PodcastsThemes.Art,
  tvShow: TvShowsThemes.Comedy,
  movie: TvShowsThemes.Comedy as string
});
