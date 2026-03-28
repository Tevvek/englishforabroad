<script lang="ts">
  import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
  import useEmblaCarousel from "embla-carousel-svelte";
  import { fromAction } from "svelte/attachments";
  import type { Movie } from "@/types/resources";
  import ImageSkeleton from "./ImageSkeleton.svelte";
  import cn from "@/utils/cn";

  let { movies } = $props<{ movies: Movie[] }>();

  const options: EmblaOptionsType = {
    align: "start",
    loop: true,
  };
  const emblaAction = useEmblaCarousel;

  let emblaApi = $state<EmblaCarouselType | null>(null);
  let scrollSnaps = $state<number[]>([]);
  let selectedSnap = $state(0);

  function syncEmblaState(api: EmblaCarouselType) {
    scrollSnaps = api.snapList();
    selectedSnap = api.selectedScrollSnap();
  }

  function handleEmblaInit(event: CustomEvent<EmblaCarouselType>) {
    emblaApi = event.detail;
    syncEmblaState(emblaApi);
    emblaApi.on("reInit", syncEmblaState);
    emblaApi.on("select", syncEmblaState);
  }

  function goTo(index: number) {
    emblaApi?.scrollTo(index);
  }

  function getViewTransitionName(movie: Movie) {
    return movie.slug ? movie.slug : movie.title.replaceAll(" ", "");
  }
</script>

<div class="embla">
  <div
    class="embla__viewport"
    onemblaInit={handleEmblaInit}
    {@attach fromAction(emblaAction, () => ({ options }))}
  >
    <div class="embla__container">
      {#each movies as movie (movie.title)}
        <div class="embla__slide">
          <a
            href={movie.url}
            class={cn(
              "grid h-[392px] grid-rows-[min-content_min-content_auto] gap-x-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm transition duration-300 hover:-translate-y-1",
              "xs:h-60 xs:grid-cols-[auto_1fr] xs:grid-rows-[auto_1fr]"
            )}
          >
            <h3 class="font-bold xs:col-start-2 xs:row-start-1">
              {movie.title}
            </h3>
            <p
              class="mb-2 text-sm line-clamp-2 xs:col-start-2 xs:row-start-2 xs:mb-0 xs:h-fit xs:line-clamp-6"
              title={movie.longDescription}
            >
              {movie.longDescription}
            </p>

            <ImageSkeleton
              class="aspect-[2/3] w-48 self-end place-self-center rounded-xl bg-muted xs:col-start-1 xs:row-span-2 xs:w-36 xs:self-center"
            >
              <img
                src={movie.image}
                alt="movie"
                style:border-radius="0.75rem"
                style:view-transition-name={getViewTransitionName(movie)}
                loading="lazy"
                onload={(e) => {
                  const prev = (e.target as HTMLImageElement).previousElementSibling as HTMLDivElement;
                  if (prev) prev.style.display = "none";
                }}
                class="h-full object-cover"
              />
            </ImageSkeleton>
          </a>
        </div>
      {/each}

      {#if movies.length === 0}
        <div class="embla__slide">
          <div class="flex h-[392px] items-center justify-center rounded-xl border bg-card p-4 shadow-sm">
            <p>Coming soon! 🚀</p>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div class="embla__dots" aria-label="Movies carousel pagination">
    {#each scrollSnaps as _, index (index)}
      <button
        type="button"
        class:embla__dot--selected={index === selectedSnap}
        class="embla__dot"
        aria-label={`Go to movie slide ${index + 1}`}
        aria-pressed={index === selectedSnap}
        onclick={() => goTo(index)}
      ></button>
    {/each}
  </div>
</div>

<style>
  .embla {
    padding-inline: 0;
  }

  .embla__viewport {
    overflow: hidden;
  }

  .embla__container {
    display: flex;
    gap: 0;
    touch-action: pan-y pinch-zoom;
  }

  .embla__slide {
    box-sizing: border-box;
    min-width: 0;
    flex: 0 0 100%;
    padding: 0.5rem 0.75rem 2.5rem;
  }

  .embla__dots {
    display: flex;
    justify-content: center;
    gap: 0.625rem;
  }

  .embla__dot {
    height: 0.75rem;
    width: 0.75rem;
    border-radius: 999px;
    background: var(--muted-foreground);
    transition: transform 150ms ease, background-color 150ms ease;
  }

  .embla__dot--selected {
    background: var(--primary);
    transform: scale(1.1);
  }

  @media (min-width: 768px) {
    .embla__slide {
      flex-basis: 50%;
    }
  }

  @media (min-width: 1024px) {
    .embla__slide {
      flex-basis: 33.3333%;
    }
  }

  @media (min-width: 1280px) {
    .embla__slide {
      flex-basis: 25%;
    }
  }

  @media (min-width: 2560px) {
    .embla__slide {
      flex-basis: 20%;
    }
  }
</style>
