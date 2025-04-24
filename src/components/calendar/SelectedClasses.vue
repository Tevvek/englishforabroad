<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';
import { useCalendarStore } from './calendar.store';
import { storeToRefs } from 'pinia';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/vue/24/outline';
import cn from '@/utils/cn';

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
const { hasLockedDates, hasSelectedDates, selectedDates, groupWeekly, allLocked } = storeToRefs(store);
const { toggleSelectedDate, toggleLock, toggleLockAll, resetDates } = store;

// watch(
//     selectedDates,
//     () => {
//         if (!groupWeekly) return;

//         const leavingEls = selectedDatesRef.value?.children;
//         if (leavingEls) {
//             Array.from(leavingEls).forEach((el) => {
//                 const element = el as HTMLElement;
//                 const top = element.offsetTop;
//                 element.style.top = `${top}px`;
//                 element.style.gridTemplateColumns = "auto 1fr 1fr max-content"; // this is the same as the grid-cols-subgrid class
//             });
//         }
//     },
//     { deep: true }
// );

function onLeave(el: Element) {
    const element = el as HTMLElement;
    const top = element.offsetTop;
    element.style.top = `${top}px`;
}

</script>

<template>
    <!-- SELECTED CLASSES -->
    <div class="mt-6 space-y-2 lg:col-start-2">
        <h3 class="text-sm font-semibold text-gray-700">Your selected classes</h3>
        <ul class="relative grid grid-cols-[auto_1fr_1fr_max-content]" ref="selectedDatesRef">
            <TransitionGroup name="fade-slide" @before-leave="onLeave">
                <li v-if="hasSelectedDates"
                    class="w-full text-sm text-gray-600 py-1 gap-2 border-gray-300 border-b mb-1 pb-2 grid grid-cols-subgrid col-span-4 items-center">
                    <button @click="toggleLockAll" :class="cn(
                        'text-gray-400 hover:text-gray-600 transition-transform duration-300',
                    )">

                        <component :is="allLocked ? LockClosedIcon : LockOpenIcon" class="size-4" />
                    </button>

                    <span>Dates</span>

                    <!-- TIME -->
                    <input type="time" class="border rounded px-2 py-1 text-xs text-gray-700 disabled:opacity-50" />

                    <button @click="resetDates" :class="cn(
                        'text-xs text-red-500 hover:underline transition justify-self-end',
                        { 'opacity-50 pointer-events-none hover:no-underline': hasLockedDates }
                    )">
                        Remove all
                    </button>
                </li>

                <!-- DATES -->
                <li v-for="item in selectedDates" :key="item.date"
                    class="w-full text-sm text-gray-600 py-1 gap-2 grid col-span-4 grid-cols-subgrid items-center">

                    <!-- LOCK -->
                    <button @click="toggleLock(item.date)" :class="cn(
                        'text-gray-400 hover:text-gray-600 transition-transform duration-300',
                        { 'animate-shake': item.isWiggling }
                    )">

                        <component :is="item.locked ? LockClosedIcon : LockOpenIcon" class="size-4" />
                    </button>

                    <!-- DATE -->
                    <span>{{ formatDate(item.date) }}</span>

                    <!-- TIME -->
                    <input type="time" class="border rounded px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
                        :disabled="item.locked" />


                    <!-- REMOVE -->
                    <button @click="toggleSelectedDate(item.date)" :class="cn(
                        'text-xs text-red-500 hover:underline transition justify-self-end',
                        { 'opacity-50 pointer-events-none hover:no-underline': item.locked }
                    )">
                        Remove
                    </button>
                </li>
                <!-- MESSAGE -->
                <li v-if="!hasSelectedDates" class="text-sm text-gray-500 py-1 grid col-span-4">
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
    transition: all 500s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

@keyframes shake {
    0% {
        transform: rotate(0deg);
    }

    20% {
        transform: rotate(-10deg);
    }

    40% {
        transform: rotate(10deg);
    }

    60% {
        transform: rotate(-6deg);
    }

    80% {
        transform: rotate(6deg);
    }

    100% {
        transform: rotate(0deg);
    }
}

.animate-shake {
    animation: shake 0.5s ease;
}
</style>