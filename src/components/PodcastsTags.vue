<template>
    <div class="flex gap-x-4 py-5 justify-end">
        <button :class="[
            'px-4 py-1 rounded-2xl transition duration-300 text-sm font-semibold shadow-md',
            selectedTag === tag ? 'bg-cyan-800 text-white' : 'bg-white'
        ]" v-for="(tag, key) in TagsPodcasts" :key="key" @click="selectedTag = tag">
            {{ tag }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { podcastsTag as selectedTag } from '@/components/resourcesStore';
import { TagsPodcasts } from '@/types/resources';
</script>