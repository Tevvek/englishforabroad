<template>
    <div class="flex gap-x-4 py-5">
        <button class="bg-white px-4 py-1 rounded-2xl" v-for="(tag, key) in TagsPodcasts" :key="key"
            @click="handleClick(tag)">
            {{ tag }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { TagsPodcasts } from '@/components/stores';

const handleClick = (tag: string) => {
    alert(`Button clicked: ${tag}`);
}
</script>