<script lang="ts">
  import MoviesTags from "@/components/MoviesTags.svelte";
  import MoviesCarousel from "@/components/MoviesCarousel.svelte";
  import type { Movie } from "@/types/resources";
  import { TvShowsThemes } from "@/types/resources";

  let { movies } = $props<{ movies: Movie[] }>();

  let selectedTheme = $state(TvShowsThemes.Comedy as string);

  let filteredMovies = $derived(
    movies.filter((movie) => movie.theme === selectedTheme)
  );
</script>

<MoviesTags selectedTheme={selectedTheme} onSelect={(theme) => (selectedTheme = theme)} />

{#key selectedTheme}
  <MoviesCarousel movies={filteredMovies} />
{/key}
