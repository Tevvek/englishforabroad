<script lang="ts" setup>
import Check from "@/icons/check.svg?component";
import { useCalendarStore } from "./calendar.store";
import { storeToRefs } from "pinia";

const store = useCalendarStore();

const { groupWeekly, packageLimit } = storeToRefs(store);
</script>

<template>
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
            <span id="groupWeekly" class="text-gray-500"><span class="sr-only">Group as weekly class schedule </span>
                will
                automatically select {{ packageLimit }} sessions, one per week, from the date you choose.
            </span>
        </div>
    </div>
</template>
