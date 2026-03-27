<script lang="ts">
  import { onMount } from "svelte";
  import type { TvShow } from "@/types/resources";
  import { selection } from "./state.svelte";
  import Spinner from "./Spinner.svelte";
  import ImageSkeleton from "./ImageSkeleton.svelte";
  import cn from "@/utils/cn";

  let { tvShows } = $props<{ tvShows: TvShow[] }>();

  let isMounted = $state(false);
  let isSwiperReady = $state(false);
  let swiperEl = $state<any>(null);

  onMount(async () => {
    // Import swiper web component
    const { register } = await import("swiper/element/bundle");
    register();
    isMounted = true;
    isSwiperReady = true;
  });

  let filteredTvShows = $derived(
    !isMounted ? tvShows : tvShows.filter((show) => show.theme === selection.tvShow)
  );

  $effect(() => {
    // When selection changes, slide back to 0
    if (selection.tvShow && swiperEl && swiperEl.swiper) {
      swiperEl.swiper.slideTo(0);
    }
  });

  function getImageSrc(image: TvShow["image"]) {
    return typeof image === "string" ? image : image.src;
  }

  function getViewTransitionName(tvShow: TvShow) {
    return tvShow.slug ? tvShow.slug : tvShow.title.replaceAll(" ", "");
  }
</script>

{#if !isSwiperReady}
  <div class="min-h-56 flex justify-center items-center">
    <Spinner />
  </div>
{/if}

<div class="swiper-wrapper-container" style:display={isSwiperReady ? "block" : "none"}>
  <swiper-container
    bind:this={swiperEl}
    slides-per-view="1"
    breakpoints={JSON.stringify({
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
      1280: { slidesPerView: 4 },
      2560: { slidesPerView: 5 },
    })}
    pagination="true"
    loop="true"
    class="text-primary"
    style="--swiper-pagination-color: #155e75; --swiper-pagination-bullet-inactive-color: #fff; --swiper-pagination-bullet-inactive-opacity: 1;"
  >
    {#each filteredTvShows as tvShow (tvShow.title)}
      <swiper-slide class="px-6 pb-10 pt-2">
        <a
          href={tvShow.url}
          class={cn(
            "bg-white rounded-xl p-4 h-[392px] grid grid-rows-[min-content_min-content_auto] gap-x-4 transition duration-300 hover:scale-105 shadow-lg",
            "xs:h-60 xs:grid-rows-[auto_1fr] xs:grid-cols-[auto_1fr]"
          )}
        >
          <h3 class="font-bold xs:col-start-2 xs:row-start-1">
            {tvShow.title}
          </h3>
          <p
            class="text-sm line-clamp-2 xs:line-clamp-6 xs:h-fit mb-2 xs:mb-0 xs:col-start-2 xs:row-start-2"
            title={tvShow.longDescription}
          >
            {tvShow.longDescription}
          </p>

          <ImageSkeleton
            class="self-end place-self-center xs:self-center aspect-[2/3] w-48 xs:w-36 xs:col-start-1 xs:row-start-1 xs:row-span-2 bg-gray-300"
          >
            <img
              src={getImageSrc(tvShow.image)}
              alt="tvShow"
              style="view-transition-name: {getViewTransitionName(tvShow)};"
              loading="lazy"
              onload={(e) => {
                const prev = (e.target as HTMLImageElement).previousElementSibling as HTMLDivElement;
                if (prev) prev.style.display = 'none';
              }}
              class="h-full object-cover"
            />
          </ImageSkeleton>
        </a>
      </swiper-slide>
    {/each}

    {#if filteredTvShows.length === 0}
      <swiper-slide class="px-6 pb-10 pt-2">
        <div class="bg-white rounded-xl p-4 h-[392px] flex gap-x-4 shadow-lg justify-center items-center">
          <p>Coming soon! 🚀</p>
        </div>
      </swiper-slide>
    {/if}
  </swiper-container>
</div>
