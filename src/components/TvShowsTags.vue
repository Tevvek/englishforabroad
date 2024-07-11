<template>
    <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 auto-rows-fr xl:flex gap-4 py-5 justify-end text-cyan-800 px-4 md:px-8">
        <button :class="[
            'px-4 py-1 rounded-2xl transition duration-300 text-sm font-semibold shadow-md',
            buttonClass(tag)
        ]" v-for="(tag, key) in TvShowsThemes" :key="key" @click="selectedTvShow.set(tag)">
            {{ tag }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { TvShowsThemes } from '@/types/resources';
import { useStore } from '@nanostores/vue';
import { computed, onMounted, ref } from 'vue';
import { selectedTvShow } from './nanostore';

const $selectedTvShow = useStore(selectedTvShow);

const isMounted = ref(false);

onMounted(() => {
    isMounted.value = true;
});

const buttonClass = computed(() => (tag: string) => {
    if (!isMounted.value) {
        return 'bg-white';
    }
    return $selectedTvShow.value === tag ? 'bg-cyan-800 text-white' : 'bg-white';
});
</script>