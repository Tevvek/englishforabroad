<script setup lang="ts">
import Check from "@/icons/check.svg?component";
import cn from '@/utils/cn';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { computed, ref, useTemplateRef, watch } from "vue";
import { toast } from 'vue-sonner';
const today = new Date();
const TOTAL_CALENDAR_CELLS = 42;

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
const daysInCalendar = computed(() =>
  getCalendarDays(
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
function getCalendarDays(year: number, month: number): CalendarDay[] {
  const days: CalendarDay[] = [];

  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekDay = (firstDayOfMonth.getDay() + 6) % 7; // Make Monday = 0

  const startDate = new Date(year, month, 1 - firstWeekDay);

  for (let i = 0; i < TOTAL_CALENDAR_CELLS; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);

    const dateString = current.toLocaleDateString("en-CA"); // YYYY-MM-DD

    days.push({
      date: dateString, // ✅ Local time, ISO format
      isCurrentMonth: current.getMonth() === month,
      isToday: current.toDateString() === new Date().toDateString(),
      isSelected: selectedDates.value.includes(dateString),
    });
  }

  return days;
}
type CalendarDay = {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};
function onCalendarDayClick(day: CalendarDay) {
  if (!day.isCurrentMonth) {
    const clicked = new Date(day.date);
    currentDate.value = new Date(clicked.getFullYear(), clicked.getMonth(), 1);
    return;
  }

  if (groupWeekly.value) {
    // Clear existing and select 5 weeks from clicked date
    const base = new Date(day.date);
    selectedDates.value = Array.from({ length: 5 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i * 7);
      return d.toLocaleDateString("en-CA");
    });
    return;
  }

  // ✅ Limit free selection
  if (!selectedDates.value.includes(day.date) && selectedDates.value.length >= packageLimit.value) {
    toast.warning("You've reached your class limit. Deselect one to add a new class.");
    return;
  }

  toggleSelectedDate(day.date);
}

function addDate(date: string) {
  selectedDates.value.push(date);
  selectedDates.value.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
}


function toggleSelectedDate(date: string) {
  const index = selectedDates.value.indexOf(date);
  if (index === -1) {
    addDate(date);
    return;
  }

  selectedDates.value.splice(index, 1);
}
const selectedDates = ref<string[]>([]);
const groupWeekly = ref(true);

const packageLimit = ref(5); //TODO Replace this with the actual class_package.quantity
function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("default", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const selectedDatesRef = useTemplateRef("selectedDatesRef");

watch(
  selectedDates,
  () => {
    if (!groupWeekly.value) return;

    const leavingEls = selectedDatesRef.value?.children;
    if (leavingEls) {
      Array.from(leavingEls).forEach((el, idx) => {
        const element = el as HTMLElement;
        const top = element.offsetTop;
        element.style.top = `${top}px`;
      });
    }
  },
  { deep: true }
);
function resetSelectedDates() {
  selectedDates.value = [];
}

</script>


<template>

  <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
    <!-- CALENDAR -->
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
    <!-- SELECTED CLASSES -->
    <p class="text-sm text-gray-500 text-right lg:row-start-2">
      {{ selectedDates.length }} of {{ packageLimit }} sessions selected
    </p>
    <!-- GROUP WEEKLY INPUT -->
    <div class="flex gap-3 pt-4 lg:row-start-3 lg:col-span-2">
      <div class="flex h-6 shrink-0 items-center">
        <div class="group grid size-4 grid-cols-1">
          <input id="groupWeekly" aria-describedby="groupWeekly" name="groupWeekly" type="checkbox"
            v-model="groupWeekly"
            class="cursor-pointer col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto" />
          <Check
            class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25" />
        </div>
      </div>
      <div class="text-sm/6">
        <label for="groupWeekly" class="font-medium text-gray-900">Group as weekly class schedule</label>
        {{ ' ' }}
        <span id="groupWeekly" class="text-gray-500"><span class="sr-only">Group as weekly class schedule </span> will
          automatically select {{ packageLimit }} sessions, one per week, from the date you choose.
        </span>
      </div>
    </div>
    <!-- DIVIDER -->
    <div class="w-full border-t border-gray-300 mt-6 lg:hidden"></div>
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
    <div class="flex items-center justify-end gap-x-6 border-t border-gray-300 pt-4 mt-6 lg:row-start-4 lg:col-span-2">
      <button @click="resetSelectedDates" type="button" :class="cn('text-sm/6 font-semibold text-gray-900 transition', {
        'opacity-50 cursor-not-allowed': selectedDates.length === 0,
      })">Reset</button>
      <button type="submit" data-testid="change-password-submit"
        class="transition rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Save</button>
    </div>
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