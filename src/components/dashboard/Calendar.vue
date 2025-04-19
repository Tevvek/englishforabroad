<script setup lang="ts">
import cn from '@/utils/cn';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { ref, computed } from "vue";

const today = new Date();

// 1. Reactive month/year state
const currentDate = ref(new Date(today.getFullYear(), today.getMonth(), 1));

// 2. Navigation
function goToPreviousMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
}

function goToNextMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
}

// 3. Calendar days computed from state
const calendarDays = computed(() =>
  generateCalendarDays(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth()
  )
);

const monthYear = computed(() =>
  currentDate.value.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })
);
function generateCalendarDays(year: number, month: number) {
  const days = [];

  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekDay = (firstDayOfMonth.getDay() + 6) % 7; // Make Monday = 0

  const startDate = new Date(year, month, 1 - firstWeekDay);

  for (let i = 0; i < 42; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);

    days.push({
      date: current.toLocaleDateString("en-CA"), // ✅ Local time, ISO format
      isCurrentMonth: current.getMonth() === month,
      isToday: current.toDateString() === new Date().toDateString(),
      isSelected: false,
    });
  }

  return days;
}
</script>

<template>
  <div class="flex items-center">
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
    <div v-for="(day, dayIdx) in calendarDays" :key="day.date"
      :class="cn('py-2', { 'border-t border-gray-200': dayIdx > 6 })">
      <button type="button" :class="cn(
        'mx-auto flex size-8 items-center justify-center rounded-full',
        { 'text-white': day.isSelected },
        { 'text-indigo-600': !day.isSelected && day.isToday },
        {
          'text-gray-900':
            !day.isSelected && !day.isToday && day.isCurrentMonth,
        },
        {
          'text-gray-400':
            !day.isSelected && !day.isToday && !day.isCurrentMonth,
        },
        { 'bg-indigo-600': day.isSelected && day.isToday },
        { 'bg-gray-900': day.isSelected && !day.isToday },
        { 'hover:bg-gray-200': !day.isSelected },
        { 'font-semibold': day.isSelected || day.isToday }
      )">
        <time :datetime="day.date">
          {{ day.date.split("-").pop().replace(/^0/, "") }}
        </time>
      </button>
    </div>
  </div>
</template>