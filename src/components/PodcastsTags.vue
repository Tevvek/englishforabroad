<template>
    <div class="flex gap-x-4 py-5">
        <button :class="[
            'px-4 py-1 rounded-2xl transition duration-300',
            selectedTag === tag ? 'bg-cyan-800 text-white' : 'bg-white'
        ]" v-for="(tag, key) in TagsPodcasts" :key="key" @click="selectedTag = tag">
            {{ tag }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { TagsPodcasts, tagsStore } from '@/components/stores';
import { computed } from 'vue';

const selectedTag = computed({
    get: () => tagsStore.podcasts,
    set: (newTag) => tagsStore.podcasts = newTag
});
</script>