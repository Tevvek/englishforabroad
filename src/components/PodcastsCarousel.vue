<template>
    <div v-if="!isSwiperReady" class="min-h-56 flex justify-center items-center">
        <Spinner />
    </div>
    <swiper v-show="isSwiperReady" :slides-per-view="3" :pagination="{ clickable: true }" :modules="modules"
        :loop="true" :style="{
            '--swiper-pagination-color': '#155e75',
            '--swiper-pagination-bullet-inactive-color': '#fff',
            '--swiper-pagination-bullet-inactive-opacity': 1
        }" class="text-cyan-800" wrapper-class="pb-10 pt-2" @swiper="onSwiperInitialized">
        <swiper-slide v-for="podcast in filteredPodcasts" :key="podcast.title" class="px-8">
            <a :href="podcast.url"
                class="bg-white rounded-xl p-4 h-44 flex gap-x-4 transition duration-300 hover:scale-105 shadow-lg">
                <img :src="podcast.image" alt="podcast" class="rounded-lg" :style="{
                    '--view-transition-name': podcast.title.replaceAll(' ', ''),
                    'view-transition-name': 'var(--view-transition-name)',
                }" loading="eager" />
                <div class="flex flex-col gap-y-1">
                    <h3 class="font-bold">{{ podcast.title }}</h3>
                    <p class="text-sm" :title="podcast.shortDescription">{{ podcast.shortDescription }}</p>
                </div>
            </a>
        </swiper-slide>
        <swiper-slide v-if="filteredPodcasts.length === 0" class="px-8">
            <div class="bg-white rounded-xl p-4 h-44 flex gap-x-4 shadow-lg justify-center items-center">
                <p>Coming soon! 🚀</p>
            </div>
        </swiper-slide>
    </swiper>
</template>

<script setup lang="ts">
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import type { Podcast } from '@/types/resources';
import { selectedPodcast } from './nanostore';
import { useStore } from '@nanostores/vue';
import { computed, ref, onMounted } from 'vue';
import Spinner from './Spinner.vue';

const modules = [Pagination];

const props = defineProps<{
    podcasts: Podcast[]
}>();

const { podcasts } = props;

const $selectedPodcast = useStore(selectedPodcast);

const isMounted = ref(false);
const isSwiperReady = ref(false);

onMounted(() => {
    isMounted.value = true;
});

const filteredPodcasts = computed(() => {
    if (!isMounted.value) {
        return podcasts;
    }
    return podcasts.filter((podcast) => podcast.theme === $selectedPodcast.value);
});

const onSwiperInitialized = () => {
    isSwiperReady.value = true;
};
</script>