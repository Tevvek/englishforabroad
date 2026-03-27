<script lang="ts">
  import { TvShowsThemes } from "@/types/resources";
  import { selection } from "./state.svelte";
</script>

<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 auto-rows-fr xl:flex gap-4 mt-5 py-5 text-primary px-4 md:px-8">
  {#each Object.values(TvShowsThemes) as tag}
    <button
      class="px-4 py-1 rounded-2xl transition duration-300 text-sm font-semibold shadow-md {selection.tvShow === tag ? 'bg-primary text-white' : 'bg-white'}"
      onclick={() => selection.tvShow = tag}
    >
      {tag}
    </button>
  {/each}
</div>
