<script lang="ts" setup>
import Check from "@/icons/check.svg?component";
import cn from "@/utils/cn";
import { storeToRefs } from "pinia";
import { toast } from "vue-sonner";
import { useCalendarStore } from "./calendar.store";

const store = useCalendarStore();

const { hasSelectedDates: hasSelectedClasses, groupWeekly, packageLimit, hasLockedDates } = storeToRefs(store);

function handleToggle(event: Event) {
    if (hasSelectedClasses.value) {
        (event.target as HTMLInputElement).checked = groupWeekly.value;
        toast.warning("Clear your selected classes before enabling weekly selection.");
        return;
    }

    if (hasLockedDates.value) {
        (event.target as HTMLInputElement).checked = groupWeekly.value;
        toast.warning("Unlock all classes before enabling weekly selection.");
        return;
    }

    groupWeekly.value = !groupWeekly.value;
}
</script>

<template>
    <div :class="cn(
        'flex gap-3 pt-4 lg:row-start-3 lg:col-span-2 transition',
        {
            'opacity-50 pointer-events-none': hasLockedDates || hasSelectedClasses,
        }
    )">
        <div class="flex h-6 shrink-0 items-center">
            <div class="group grid size-4 grid-cols-1">
                <input id="groupWeekly" aria-describedby="groupWeekly" name="groupWeekly" type="checkbox"
                    @change="handleToggle" :checked="groupWeekly"
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
