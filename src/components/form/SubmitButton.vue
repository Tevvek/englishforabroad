<template>
    <button :type="type" :class="cn(
        'transition flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        { 'hover:bg-accent': !disabled },
        { 'opacity-50 cursor-not-allowed': disabled }
    )" :disabled="MODE === 'production' && disabled">
        <slot />
    </button>
</template>

<script setup lang="ts">
import cn from "@/utils/cn";
import { inject, computed, type Ref } from "vue";

defineProps<{
    type?: "submit" | "button";
    class?: string;
}>();

const MODE = import.meta.env.MODE;

const form = inject("form") as {
    isFormInvalid: Ref<boolean>;
    isFormIncomplete: Ref<boolean>;
    isSubmitting: Ref<boolean>;
};
const disabled = computed(() => {
    return (
        form.isFormInvalid.value ||
        form.isFormIncomplete.value ||
        form.isSubmitting.value
    );
});
</script>