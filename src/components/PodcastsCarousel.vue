<template>
    <swiper :slides-per-view="3" :pagination="{ clickable: true }" :modules="modules" :loop="true" :style="{
        '--swiper-pagination-color': '#155e75',
        '--swiper-pagination-bullet-inactive-color': '#fff',
        '--swiper-pagination-bullet-inactive-opacity': 1
    }" wrapper-class="pb-10 pt-2">
        <swiper-slide v-for="(podcast, key) in filteredPodcasts" :key="key" class="px-8">
            <div class="bg-white rounded-xl p-4 h-44 flex gap-x-4 transition duration-300 hover:scale-105">
                <img :src="podcast.image" alt="podcast" class="rounded-lg">
                <div class="flex flex-col gap-y-1">
                    <h3 class="font-bold">{{ podcast.title }}</h3>
                    <p class="text-sm line-clamp-6" :title="podcast.description">{{ podcast.description }}</p>
                </div>
            </div>
        </swiper-slide>
    </swiper>
</template>

<script setup lang="ts">
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { filteredPodcasts } from './resourcesStore';

const modules = [Pagination];
</script>
