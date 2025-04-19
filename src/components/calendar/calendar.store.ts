import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { toast } from "vue-sonner";

export type CalendarDay = {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

const TOTAL_CALENDAR_CELLS = 42;

export const useCalendarStore = defineStore("calendar", () => {
  const today = new Date();

  // 🌟 State
  const currentDate = ref(new Date(today.getFullYear(), today.getMonth(), 1));
  const selectedDates = ref<string[]>([]);
  const groupWeekly = ref(true);
  const packageLimit = ref(5);

  // 📆 Computed
  const monthYear = computed(() =>
    currentDate.value.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })
  );

  const daysInCalendar = computed(() => {
    const days: CalendarDay[] = [];

    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const firstWeekDay = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
    const startDate = new Date(year, month, 1 - firstWeekDay);

    for (let i = 0; i < TOTAL_CALENDAR_CELLS; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      const dateString = current.toLocaleDateString("en-CA");

      days.push({
        date: dateString,
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        isSelected: selectedDates.value.includes(dateString),
      });
    }

    return days;
  });

  // 📍 Navigation
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

  // ✅ Selection logic
  function addDate(date: string) {
    selectedDates.value.push(date);
    selectedDates.value.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  }

  function toggleSelectedDate(date: string) {
    const index = selectedDates.value.indexOf(date);
    if (index === -1) {
      addDate(date);
    } else {
      selectedDates.value.splice(index, 1);
    }
  }

  function onCalendarDayClick(day: CalendarDay) {
    if (!day.isCurrentMonth) {
      const clicked = new Date(day.date);
      currentDate.value = new Date(
        clicked.getFullYear(),
        clicked.getMonth(),
        1
      );
      return;
    }

    if (groupWeekly.value) {
      const base = new Date(day.date);
      selectedDates.value = Array.from({ length: 5 }, (_, i) => {
        const d = new Date(base);
        d.setDate(base.getDate() + i * 7);
        return d.toLocaleDateString("en-CA");
      });
      return;
    }

    if (
      !selectedDates.value.includes(day.date) &&
      selectedDates.value.length >= packageLimit.value
    ) {
      toast.warning(
        "You've reached your class limit. Deselect one to add a new class."
      );
      return;
    }

    toggleSelectedDate(day.date);
  }

  // 🔁 Reset
  function resetDates() {
    selectedDates.value = [];
  }

  return {
    currentDate,
    selectedDates,
    groupWeekly,
    packageLimit,
    monthYear,
    daysInCalendar,
    goToPreviousMonth,
    goToNextMonth,
    toggleSelectedDate,
    onCalendarDayClick,
    resetDates,
  };
});
