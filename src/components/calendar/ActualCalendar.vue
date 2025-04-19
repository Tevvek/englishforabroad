<script lang="ts" setup>
import cn from '@/utils/cn';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { useCalendarStore } from './calendar.store';
import { storeToRefs } from 'pinia';

const store = useCalendarStore();

const {
    monthYear,
    daysInCalendar
} = storeToRefs(store)

const { goToPreviousMonth, goToNextMonth, onCalendarDayClick } = store;

</script>

<template>
    <div class="lg:col-start-1">
        <div class="flex items-center ">
            <h2 class="flex-auto text-sm font-semibold text-gray-900">{{ monthYear }}</h2>
            <button type="button" @click="goToPreviousMonth"
                class="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
                <span class="sr-only">Previous month</span>
                <ChevronLeftIcon class="size-5" aria-hidden="true" />
            </button>
            <button type="button" @click="goToNextMonth"
                class="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
                <span class="sr-only">Next month</span>
                <ChevronRightIcon class="size-5" aria-hidden="true" />
            </button>
        </div>
        <div class="mt-10 grid grid-cols-7 text-center text-xs/6 text-gray-500">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
        </div>
        <div class="mt-2 grid grid-cols-7 text-sm">
            <div v-for="(day, dayIdx) in daysInCalendar" :key="day.date"
                :class="cn('py-2', { 'border-t border-gray-200': dayIdx > 6 })">
                <button type="button" :class="cn(
                    'mx-auto flex size-8 items-center justify-center rounded-full',
                    { 'text-white': day.isSelected },
                    { 'text-primary': !day.isSelected && day.isToday },
                    {
                        'text-gray-900':
                            !day.isSelected && !day.isToday && day.isCurrentMonth,
                    },
                    {
                        'text-gray-400':
                            !day.isSelected && !day.isToday && !day.isCurrentMonth,
                    },
                    { 'bg-primary': day.isSelected && day.isToday },
                    { 'bg-gray-900': day.isSelected && !day.isToday },
                    { 'hover:bg-gray-200': !day.isSelected },
                    { 'font-semibold': day.isSelected || day.isToday },
                    { 'bg-primary ': day.isSelected }
                )" @click="onCalendarDayClick(day)">
                    <time :datetime="day.date">
                        {{ day.date.split("-").pop()?.replace(/^0/, "") }}
                    </time>
                </button>
            </div>
        </div>
    </div>
</template>