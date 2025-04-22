import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { toast } from "vue-sonner";

export type CalendarDay = {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

export type SelectedDate = {
  date: string;
  locked?: boolean;
  isWiggling?: boolean;
};

const TOTAL_CALENDAR_CELLS = 42;

export const useCalendarStore = defineStore("calendar", () => {
  const today = new Date();

  // 🌟 State
  const currentDate = ref(new Date(today.getFullYear(), today.getMonth(), 1));
  const selectedDates = ref<SelectedDate[]>([]);
  const groupWeekly = ref(true);
  const packageLimit = ref(5);

  // 📆 Computed
  const monthYear = computed(() =>
    currentDate.value.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })
  );
  const hasLockedDates = computed(() =>
    selectedDates.value.some((date) => date.locked)
  );
  const hasSelectedDates = computed(() => selectedDates.value.length !== 0);
  const allLocked = computed(
    () =>
      selectedDates.value.length > 0 &&
      selectedDates.value.every((date) => date.locked)
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
        isSelected: selectedDates.value.some(
          (selected) => selected.date === dateString
        ),
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
    selectedDates.value.push({
      date,
    });
    selectedDates.value.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  function toggleSelectedDate(date: string) {
    const index = selectedDates.value.findIndex(
      (selected) => selected.date === date
    );
    if (index === -1) {
      addDate(date);
      return;
    }

    // Prevent removing if it's locked
    if (selectedDates.value[index].locked) {
      toast.warning("You can't remove a locked class. Unlock it first.");
      triggerShake(date);
      return;
    }

    selectedDates.value.splice(index, 1);
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
        const date = d.toLocaleDateString("en-CA");
        return { date };
      });

      // ✅ Automatically turn off groupWeekly after selecting
      groupWeekly.value = false;

      return;
    }

    if (
      !selectedDates.value.some((selected) => selected.date === day.date) &&
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
    if (!hasSelectedDates.value) {
      toast.warning("No dates to reset.");
      return;
    }

    if (hasLockedDates.value) {
      toast.warning("You can't reset dates with locked classes.");
      return;
    }

    selectedDates.value = [];
  }

  function toggleLock(date: string) {
    const item = selectedDates.value.find((d) => d.date === date);
    if (item) item.locked = !item.locked;
  }

  function toggleLockAll() {
    const shouldLock = !allLocked.value;
    selectedDates.value.forEach((item) => {
      item.locked = shouldLock;
    });
  }

  function triggerShake(date: string) {
    const item = selectedDates.value.find((d) => d.date === date);
    if (!item) return;

    item.isWiggling = true;
    setTimeout(() => {
      item.isWiggling = false;
    }, 500); // match animation duration
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
    toggleLock,
    triggerShake,
    hasLockedDates,
    hasSelectedDates,
    allLocked,
    toggleLockAll,
  };
});
