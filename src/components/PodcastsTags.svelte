<script lang="ts">
  import { cn } from "@/lib/utils";
  import { PodcastsThemes } from "@/types/resources";
  import { Button } from "./ui/button";
  import { selection } from "./state.svelte";
</script>

<div
  class="flex gap-2 overflow-x-auto scroll-smooth px-4 md:px-8 py-4"
  style="scrollbar-width: none;"
>
  {#each Object.values(PodcastsThemes) as theme}
    <Button
      value={theme}
      class={cn(
        "rounded-full transition-none",
        selection.podcast !== theme &&
          "bg-secondary/80 text-secondary-foreground hover:text-secondary"
      )}
      onclick={() => selection.podcast = theme}
    >
      {theme}
    </Button>
  {/each}
</div>
