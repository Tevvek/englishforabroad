<script lang="ts">
  import { cn } from "@/lib/utils";
  import { Button } from "@/components/ui/button";
  import { TvShowsThemes } from "@/types/resources";

  let {
    selectedTheme,
    onSelect,
  } = $props<{
    selectedTheme: string;
    onSelect: (theme: string) => void;
  }>();
</script>

<div class="mt-5 grid auto-rows-fr grid-cols-2 gap-4 px-4 py-5 md:grid-cols-3 md:px-8 lg:grid-cols-5 xl:flex">
  {#each Object.values(TvShowsThemes) as tag (tag)}
    <Button
      size="sm"
      variant={selectedTheme === tag ? "default" : "outline"}
      class={cn("rounded-full text-xs uppercase tracking-[0.16em]", selectedTheme !== tag && "bg-card")}
      onclick={() => onSelect(tag)}
    >
      {tag}
    </Button>
  {/each}
</div>
