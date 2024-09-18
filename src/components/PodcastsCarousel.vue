<template>
    <div v-if="!isSwiperReady" class="min-h-56 flex justify-center items-center">
        <Spinner />
    </div>
    <swiper v-show="isSwiperReady" :slides-per-view="1" :breakpoints="{
        1024: {
            slidesPerView: 2
        },
        1280: {
            slidesPerView: 3
        },
        2560: {
            slidesPerView: 4
        }
    }" :pagination="{ clickable: true }" :modules="modules" :loop="true" :style="{
        '--swiper-pagination-color': '#155e75',
        '--swiper-pagination-bullet-inactive-color': '#fff',
        '--swiper-pagination-bullet-inactive-opacity': 1
    }" class="text-cyan-800" wrapper-class="pb-10 pt-2" @swiper="onSwiperInitialized">
        <swiper-slide v-for="podcast in filteredPodcasts" :key="podcast.title" class="px-6">
            <a :href="podcast.url"
                class="bg-white rounded-xl p-4 h-80 xs:h-44 grid grid-rows-[min-content,min-content,auto] xs:grid-rows-[auto,1fr] xs:grid-cols-[auto,1fr] gap-x-4 transition duration-300 hover:scale-105 shadow-lg">
                <h3 class="font-bold xs:col-start-2 xs:row-start-1">{{ podcast.title }}</h3>
                <p class="text-sm line-clamp-2 xs:line-clamp-6 mb-2 xs:mb-0 xs:col-start-2 xs:row-start-2"
                    :title="podcast.shortDescription">{{
                        podcast.shortDescription }}</p>

                <ImageSkeleton
                    class="self-end place-self-center aspect-square w-48 xs:w-36 xs:col-start-1 xs:row-start-1 xs:row-span-2 bg-gray-300">
                    <img :src="podcast.image" alt="podcast" :style="{
                        '--view-transition-name': podcast.slug ? podcast.slug : podcast.title.replaceAll(' ', ''),
                        'view-transition-name': 'var(--view-transition-name)',
                    }" loading="lazy"
                        @load="(($event.target as HTMLImageElement).previousElementSibling as HTMLDivElement).style.display = 'none'" />
                </ImageSkeleton>
            </a>
        </swiper-slide>
        <swiper-slide v-if="filteredPodcasts.length === 0">
            <div class="bg-white rounded-xl p-4 h-44 flex gap-x-4 shadow-lg justify-center items-center">
                <p>Coming soon! 🚀</p>
            </div>
        </swiper-slide>
    </swiper>
</template>

<script setup lang="ts">
import { Pagination } from 'swiper/modules';
import { type Swiper as SwiperType } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/vue';
import type { Podcast } from '@/types/resources';
import { selectedPodcast } from './nanostore';
import { useStore } from '@nanostores/vue';
import { computed, ref, onMounted, watch } from 'vue';
import Spinner from './Spinner.vue';
import ImageSkeleton from './ImageSkeleton.vue';

const modules = [Pagination];

const props = defineProps<{
    podcasts: Podcast[]
}>();

const { podcasts } = props;

const $selectedPodcast = useStore(selectedPodcast);

const isMounted = ref(false);
const isSwiperReady = ref(false);
const swiperInstance = ref<SwiperType | null>(null);

onMounted(() => {
    isMounted.value = true;
});

const filteredPodcasts = computed(() => {
    if (!isMounted.value) {
        return podcasts;
    }
    return podcasts.filter((podcast) => podcast.theme === $selectedPodcast.value);
});

const onSwiperInitialized = (swiper: SwiperType) => {
    isSwiperReady.value = true;
    swiperInstance.value = swiper;
};

watch(() => $selectedPodcast.value, () => {
    if (swiperInstance.value) {
        swiperInstance.value.slideTo(0);
    }
}); 
</script>