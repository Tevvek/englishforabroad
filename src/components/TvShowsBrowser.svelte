<script lang="ts">
  import TvShowsTags from "@/components/TvShowsTags.svelte";
  import TvShowsCarousel from "@/components/TvShowsCarousel.svelte";
  import type { TvShow } from "@/types/resources";
  import { TvShowsThemes } from "@/types/resources";

  let { tvShows } = $props<{ tvShows: TvShow[] }>();

  let selectedTheme = $state(TvShowsThemes.Comedy);

  let filteredTvShows = $derived(
    tvShows.filter((show) => show.theme === selectedTheme)
  );
</script>

<TvShowsTags selectedTheme={selectedTheme} onSelect={(theme) => (selectedTheme = theme)} />

{#key selectedTheme}
  <TvShowsCarousel tvShows={filteredTvShows} />
{/key}
