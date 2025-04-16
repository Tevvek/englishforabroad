<script setup lang="ts">
import cn from "@/utils/cn";
import { computed, inject } from "vue";

const props = defineProps<{
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    autocomplete?: string;
    class?: string;
}>();

const form = inject<{
    fields: Record<string, any>;
    registerField: (name: string) => any;
}>("form");

const field = form?.registerField(props.name);

const showError = computed(() => {
    return field?.validatedOnce && !!field?.error;
});
</script>

<template>
    <div :class="props.class">
        <label :for="name" class="block text-sm/6 font-medium text-primary">{{ label }}</label>
        <div class="mt-2 grid grid-cols-1">
            <input :type="type || 'text'" :id="name" :name="name" v-model="field.value" @input="field.onInput"
                @blur="field.onBlur" :placeholder="placeholder" :autocomplete="autocomplete" :class="cn(
                    'block w-full rounded-md bg-white px-3 py-1.5 text-base text-primary outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6',
                    {
                        'outline-primary': field.dirty && !field.error,
                        'outline-red-300 text-red-900 placeholder:text-red-300 focus:outline-red-600': showError,
                        'outline-gray-300': !field.dirty && !field.touched,
                    },
                )" />
        </div>
        <p v-if="showError" class="mt-2 text-sm text-red-600" :data-testid="`${name}-error`">{{ field.error }}</p>
    </div>
</template>
