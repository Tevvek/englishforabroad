<script setup lang="ts">
import cn from '@/utils/cn';
import { useCalendarStore } from './calendar.store';
import { storeToRefs } from 'pinia';

const store = useCalendarStore();
const { selectedDates, hasSelectedDates } = storeToRefs(store);
const { resetDates } = store;

</script>

<template>
    <div class="flex items-center justify-end gap-x-6 border-t border-gray-300 pt-4 mt-6 lg:row-start-4 lg:col-span-2">
        <button @click="resetDates" type="button" :class="cn('text-sm/6 font-semibold text-gray-900 transition', {
            'opacity-50 pointer-events-none': !hasSelectedDates,
        })">Reset</button>
        <button type="submit" data-testid="change-password-submit"
            class="transition rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Save</button>
    </div>
</template>