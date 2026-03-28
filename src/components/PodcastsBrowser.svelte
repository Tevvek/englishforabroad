<script lang="ts">
  import PodcastsTags from "@/components/PodcastsTags.svelte";
  import PodcastsCarousel from "@/components/PodcastsCarousel.svelte";
  import type { Podcast } from "@/types/resources";
  import { PodcastsThemes } from "@/types/resources";

  let { podcasts } = $props<{ podcasts: Podcast[] }>();

  let selectedTheme = $state(PodcastsThemes.Art);

  let filteredPodcasts = $derived(
    podcasts.filter((podcast) => podcast.theme === selectedTheme)
  );
</script>

<PodcastsTags selectedTheme={selectedTheme} onSelect={(theme) => (selectedTheme = theme)} />

{#key selectedTheme}
  <PodcastsCarousel podcasts={filteredPodcasts} />
{/key}
