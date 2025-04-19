<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useCalendarStore } from './calendar.store';

const store = useCalendarStore();
const { selectedDates, packageLimit } = storeToRefs(store);
</script>

<template>
    <p class="text-sm text-gray-500 text-right lg:row-start-2">
        {{ selectedDates.length }} of {{ packageLimit }} sessions selected
    </p>
</template>