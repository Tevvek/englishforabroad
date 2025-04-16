<script setup lang="ts">
import type { Field } from "@/types/form";
import { computed, provide, reactive } from "vue";
import type { ZodSchema } from "zod";

const props = defineProps<{
  schema: ZodSchema<any>;
  customValidators?: Record<string, (value: string, allFields: Record<string, Field>) => string>;
  class?: string;
  novalidate?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", fields: Record<string, Field>): void;
}>();

const fields = reactive<Record<string, Field>>({});

const isFormInvalid = computed(() => {
  return Object.values(fields).some((field) => !!field.error);
});

const isFormIncomplete = computed(() => {
  return Object.values(fields).some(
    (field) =>
      !field.everTyped && !field.touched // hasn't interacted yet
  );
});

function registerField(name: string) {
  const field: Field = reactive({
    value: "",
    error: "",
    touched: false,
    dirty: false,
    everTyped: false,
    validatedOnce: false,
    onInput() {
      field.dirty = true;
      if (!field.everTyped && field.value.length > 0) {
        field.everTyped = true;
      }

      // only validate on input if user had previously blurred after typing
      if (field.validatedOnce) {
        validate(name);
      }
    },
    onBlur() {
      field.touched = true;
      if (field.everTyped) {
        field.validatedOnce = true;
        validate(name);
      }
    },
  });

  fields[name] = field;
  return field;
}

function validate(name: string) {
  const value = fields[name].value;

  // ✅ 1. Check custom validator first (if provided)
  if (props.customValidators?.[name]) {
    const customError = props.customValidators[name](value, fields);
    if (customError) {
      fields[name].error = customError;
      return;
    }
  }


  // ✅ 2. Fallback to default Zod field-level validation
  const result = props.schema.safeParse({ [name]: value });
  if (result.success) {
    fields[name].error = "";
  } else {
    const issue = result.error.issues.find((i) => i.path[0] === name);
    fields[name].error = issue?.message || "";
  }
}

provide("form", { fields, registerField, isFormInvalid, isFormIncomplete });
</script>

<template>
  <form :class="props.class" :novalidate="props.novalidate" @submit.prevent="emit('submit', fields)">
    <slot />
  </form>
</template>
