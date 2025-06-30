import { cn } from "@/lib/utils";
import { PodcastsThemes } from "@/types/resources";
import { useStore } from "@nanostores/react";
import { selectedPodcast } from "./nanostore";
import { Button } from "./ui/button";

export default function ReactPodcastsTags() {
  const $selectedPodcast = useStore(selectedPodcast);
  return (
    <div
      className="flex gap-2 overflow-x-auto scroll-smooth px-4 md:px-8 py-4"
      style={{
        scrollbarWidth: "none",
      }}
    >
      {Object.values(PodcastsThemes).map((theme) => (
        <Button
          key={theme}
          value={theme}
          className={cn(
            "rounded-full transition-none",
            $selectedPodcast !== theme &&
              "bg-secondary/80 text-secondary-foreground hover:text-secondary"
          )}
          onClick={() => selectedPodcast.set(theme)}
        >
          {theme}
        </Button>
      ))}
    </div>
  );
}
