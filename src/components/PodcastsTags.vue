<template>
    <div class="flex gap-x-4 py-5 justify-end text-cyan-800">
        <button :class="[
            'px-4 py-1 rounded-2xl transition duration-300 text-sm font-semibold shadow-md',
            buttonClass(tag)
        ]" v-for="(tag, key) in PodcastsThemes" :key="key" @click="selectedPodcast.set(tag)">
            {{ tag }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { PodcastsThemes } from '@/types/resources';
import { useStore } from '@nanostores/vue';
import { selectedPodcast } from './nanostore';
import { computed, onMounted, ref } from 'vue';

const $selectedPodcast = useStore(selectedPodcast);

const isMounted = ref(false);

onMounted(() => {
    isMounted.value = true;
});

const buttonClass = computed(() => (tag: string) => {
    if (!isMounted.value) {
        return 'bg-white';
    }
    return $selectedPodcast.value === tag ? 'bg-cyan-800 text-white' : 'bg-white';
});

</script>