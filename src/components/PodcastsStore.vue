<template></template>

<script setup lang="ts">
import type { Podcast } from '@/types/resources';
import { setPodcasts } from './resourcesStore';

const props = defineProps<{
    podcasts: Podcast[];
}>();

setPodcasts(props.podcasts);
</script>