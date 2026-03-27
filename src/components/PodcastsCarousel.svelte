<script lang="ts">
  import { onMount } from "svelte";
  import type { Podcast } from "@/types/resources";
  import { selection } from "./state.svelte";
  import Spinner from "./Spinner.svelte";
  import ImageSkeleton from "./ImageSkeleton.svelte";
  import cn from "@/utils/cn";

  let { podcasts } = $props<{ podcasts: Podcast[] }>();

  let isMounted = $state(false);
  let isSwiperReady = $state(false);
  let swiperEl = $state<any>(null);

  onMount(async () => {
    const { register } = await import("swiper/element/bundle");
    register();
    isMounted = true;
    isSwiperReady = true;
  });

  let filteredPodcasts = $derived(
    !isMounted ? podcasts : podcasts.filter((podcast) => podcast.theme === selection.podcast)
  );

  $effect(() => {
    if (selection.podcast && swiperEl && swiperEl.swiper) {
      swiperEl.swiper.slideTo(0);
    }
  });

  function getImageSrc(image: Podcast["image"]) {
    return typeof image === "string" ? image : image.src;
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
      1024: { slidesPerView: 2 },
      1280: { slidesPerView: 3 },
      2560: { slidesPerView: 4 },
    })}
    pagination="true"
    loop="true"
    class="text-primary"
    style="--swiper-pagination-color: #155e75; --swiper-pagination-bullet-inactive-color: #fff; --swiper-pagination-bullet-inactive-opacity: 1;"
  >
    {#each filteredPodcasts as podcast (podcast.title)}
      <swiper-slide class="px-6 pb-10 pt-2">
        <a
          href={podcast.url}
          class="bg-white rounded-xl p-4 h-80 xs:h-44 grid grid-rows-[min-content_min-content_auto] xs:grid-rows-[auto_1fr] xs:grid-cols-[auto_1fr] gap-x-4 transition duration-300 hover:scale-105 shadow-lg"
        >
          <h3 class="font-bold xs:col-start-2 xs:row-start-1">
            {podcast.title}
          </h3>
          <p
            class="text-sm line-clamp-2 xs:line-clamp-6 mb-2 xs:mb-0 xs:col-start-2 xs:row-start-2"
            title={podcast.shortDescription}
          >
            {podcast.shortDescription}
          </p>

          <ImageSkeleton
            class="self-end place-self-center aspect-square w-48 xs:w-36 xs:col-start-1 xs:row-start-1 xs:row-span-2 bg-gray-300"
          >
            <img
              src={getImageSrc(podcast.image)}
              alt="podcast"
              style="view-transition-name: {podcast.slug ? podcast.slug : podcast.title.replaceAll(' ', '')};"
              loading="lazy"
              onload={(e) => {
                const prev = (e.target as HTMLImageElement).previousElementSibling as HTMLDivElement;
                if (prev) prev.style.display = 'none';
              }}
            />
          </ImageSkeleton>
        </a>
      </swiper-slide>
    {/each}

    {#if filteredPodcasts.length === 0}
      <swiper-slide class="px-6 pb-10 pt-2">
        <div class="bg-white rounded-xl p-4 h-44 flex gap-x-4 shadow-lg justify-center items-center">
          <p>Coming soon! 🚀</p>
        </div>
      </swiper-slide>
    {/if}
  </swiper-container>
</div>
