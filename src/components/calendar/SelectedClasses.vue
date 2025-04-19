<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';
import { useCalendarStore } from './calendar.store';
import { storeToRefs } from 'pinia';

function formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString("default", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}
const selectedDatesRef = useTemplateRef("selectedDatesRef");

const store = useCalendarStore();
const { selectedDates, groupWeekly } = storeToRefs(store);
const { toggleSelectedDate } = store;

watch(
    selectedDates,
    () => {
        if (!groupWeekly) return;

        const leavingEls = selectedDatesRef.value?.children;
        if (leavingEls) {
            Array.from(leavingEls).forEach((el) => {
                const element = el as HTMLElement;
                const top = element.offsetTop;
                element.style.top = `${top}px`;
            });
        }
    },
    { deep: true }
);
</script>

<template>
    <!-- SELECTED CLASSES -->
    <div class="mt-6 space-y-2 lg:col-start-2">
        <h3 class="text-sm font-semibold text-gray-700">Your selected classes</h3>
        <ul class="relative" ref="selectedDatesRef">
            <TransitionGroup name="fade-slide">
                <!-- DATES -->
                <li v-for="date in selectedDates" :key="date"
                    class="w-full text-sm text-gray-600 flex items-center justify-between py-1">
                    <span>{{ formatDate(date) }}</span>
                    <button @click="toggleSelectedDate(date)" class="text-xs text-red-500 hover:underline">
                        Remove
                    </button>
                </li>
                <!-- MESSAGE -->
                <li v-if="selectedDates.length === 0" class="text-sm text-gray-500 py-1">
                    No classes selected
                </li>
            </TransitionGroup>
        </ul>
    </div>
</template>

<style scoped>
.fade-slide-leave-active {
    position: absolute;
}

.fade-slide-move,
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>