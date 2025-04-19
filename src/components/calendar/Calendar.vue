<script setup lang="ts">
import ActualCalendar from "./ActualCalendar.vue";
import CalendarButtons from "./CalendarButtons.vue";
import SelectedClasses from "./SelectedClasses.vue";
import SelectedClassesText from "./SelectedClassesText.vue";
import WeeklyCheckbox from "./WeeklyCheckbox.vue";
</script>

<template>

  <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
    <ActualCalendar />

    <SelectedClassesText />

    <WeeklyCheckbox />

    <!-- DIVIDER -->
    <div class="w-full border-t border-gray-300 mt-6 lg:hidden"></div>

    <SelectedClasses />

    <CalendarButtons />
  </div>
</template>
