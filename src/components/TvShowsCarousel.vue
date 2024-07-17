<template>
  <div v-if="!isSwiperReady" class="min-h-56 flex justify-center items-center">
    <Spinner />
  </div>
  <swiper v-show="isSwiperReady" :slides-per-view="1" :breakpoints="{
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
    1280: {
      slidesPerView: 4,
    },
    2560: {
      slidesPerView: 5,
    },
  }" :pagination="{ clickable: true }" :modules="modules" :loop="true" :style="{
    '--swiper-pagination-color': '#155e75',
    '--swiper-pagination-bullet-inactive-color': '#fff',
    '--swiper-pagination-bullet-inactive-opacity': 1,
  }" class="text-cyan-800" wrapper-class="pb-10 pt-2" @swiper="onSwiperInitialized">
    <swiper-slide v-for="tvShow in filteredTvShows" :key="tvShow.title" class="px-6">
      <a :href="tvShow.url" :class="classes(
        'bg-white rounded-xl p-4 h-[392px] grid grid-rows-[min-content,min-content,auto] gap-x-4 transition duration-300 hover:scale-105 shadow-lg',
        'xs:h-60 xs:grid-rows-[auto,1fr] xs:grid-cols-[auto,1fr]'
      )
        ">
        <h3 class="font-bold xs:col-start-2 xs:row-start-1">
          {{ tvShow.title }}
        </h3>
        <p class="text-sm line-clamp-2 xs:line-clamp-6 xs:h-fit mb-2 xs:mb-0 xs:col-start-2 xs:row-start-2"
          :title="tvShow.longDescription">
          {{ tvShow.longDescription }}
        </p>

        <ImageSkeleton
          class="self-end place-self-center xs:self-center aspect-[2/3] max-w-48 xs:max-w-36 xs:col-start-1 xs:row-start-1 xs:row-span-2 bg-gray-300">
          <img :src="tvShow.image" alt="tvShow" :style="{
            '--view-transition-name': getViewTransitionName(tvShow),
            'view-transition-name': 'var(--view-transition-name)',
          }" loading="eager" @load="
            (
              ($event.target as HTMLImageElement)
                .previousElementSibling as HTMLDivElement
            ).style.display = 'none'
            " class="h-full object-cover" />
        </ImageSkeleton>
      </a>
    </swiper-slide>
    <swiper-slide v-if="filteredTvShows.length === 0">
      <div class="bg-white rounded-xl p-4 h-[392px] flex gap-x-4 shadow-lg justify-center items-center">
        <p>Coming soon! 🚀</p>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { Pagination } from "swiper/modules";
import { type Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/vue";
import type { TvShow } from "@/types/resources";
import { selectedTvShow } from "./nanostore";
import { useStore } from "@nanostores/vue";
import { computed, ref, onMounted, watch } from "vue";
import Spinner from "./Spinner.vue";
import ImageSkeleton from "@/components/ImageSkeleton.vue";
import classes from "@/utils/classes";

const modules = [Pagination];

const props = defineProps<{
  tvShows: TvShow[];
}>();

const { tvShows } = props;

const $selectedTvShow = useStore(selectedTvShow);

const isMounted = ref(false);
const isSwiperReady = ref(false);
const swiperInstance = ref<SwiperType | null>(null);

onMounted(() => {
  isMounted.value = true;
});

const filteredTvShows = computed(() => {
  if (!isMounted.value) {
    return tvShows;
  }
  return tvShows.filter((tvShow) => tvShow.theme === $selectedTvShow.value);
});

const onSwiperInitialized = (swiper: SwiperType) => {
  isSwiperReady.value = true;
  swiperInstance.value = swiper;
};

watch(
  () => $selectedTvShow.value,
  () => {
    if (swiperInstance.value) {
      swiperInstance.value.slideTo(0);
    }
  }
);

function getViewTransitionName(tvShow: TvShow) {
  return tvShow.slug ? tvShow.slug : tvShow.title.replaceAll(" ", "");
}
</script>
