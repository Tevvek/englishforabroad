<script lang="ts">
  import { cn } from "@/lib/utils";
  import { PodcastsThemes } from "@/types/resources";
  import { Button } from "./ui/button";

  let {
    selectedTheme,
    onSelect,
  } = $props<{
    selectedTheme: PodcastsThemes;
    onSelect: (theme: PodcastsThemes) => void;
  }>();
</script>

<div
  class="flex gap-2 overflow-x-auto scroll-smooth px-4 md:px-8 py-4"
  style="scrollbar-width: none;"
>
  {#each Object.values(PodcastsThemes) as theme (theme)}
    <Button
      value={theme}
      size="sm"
      variant={selectedTheme === theme ? "default" : "outline"}
      class={cn(
        "rounded-full text-xs uppercase tracking-[0.16em] transition-none",
        selectedTheme !== theme &&
          "bg-card text-foreground hover:text-foreground"
      )}
      onclick={() => onSelect(theme)}
    >
      {theme}
    </Button>
  {/each}
</div>
