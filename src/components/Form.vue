<script setup lang="ts">
import { provide, reactive } from "vue";
import type { ZodSchema } from "zod";

type Field = {
  value: string;
  error: string;
  touched: boolean;
  dirty: boolean;
  everTyped: boolean;
  onInput: () => void;
  onBlur: () => void;
};

const props = defineProps<{
  schema: ZodSchema<any>;
  class?: string;
  novalidate?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", fields: Record<string, Field>): void;
}>();

const fields = reactive<Record<string, Field>>({});

function registerField(name: string) {
  const field: Field = reactive({
    value: "",
    error: "",
    touched: false,
    dirty: false,
    everTyped: false,
    onInput() {
      field.dirty = true;
      if (!field.everTyped && field.value.length > 0) {
        field.everTyped = true;
      }
      validate(name);
    },
    onBlur() {
      field.touched = true;
      validate(name);
    },
  });

  fields[name] = field;
  return field;
}

function validate(name: string) {
  const value = fields[name].value;
  const result = props.schema.safeParse({ [name]: value });
  if (result.success) {
    fields[name].error = "";
  } else {
    const issue = result.error.issues.find((i) => i.path[0] === name);
    fields[name].error = issue?.message || "";
  }
}

provide("form", { fields, registerField });
</script>

<template>
  <form :class="props.class" :novalidate="props.novalidate" @submit.prevent="emit('submit', fields)">
    <slot />
  </form>
</template>
