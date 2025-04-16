<script setup lang="ts">
import { LoginSchema, type LoginFormData } from "@/schemas/login.schema";
import Form from "@/components/form/Form.vue";
import BaseInput from "@/components/form/BaseInput.vue";
import { appendRecaptchaToForm } from "@/utils/recaptcha/recaptcha.client";
import type { Field } from "@/types/form";
import { to } from "@/utils/to";
import SubmitButton from "./form/SubmitButton.vue";

const MODE = import.meta.env.MODE;

async function handleSubmit(fields: Record<keyof LoginFormData, Field>) {
    const formData = new FormData();
    formData.append("identifier", fields.identifier.value);
    formData.append("password", fields.password.value);

    const enriched = await appendRecaptchaToForm(formData);
    const [error, result] = await to(fetch("/api/login", { method: "POST", body: enriched }));

    if (error || !result) {
        alert("An error occurred. Please try again.");
        return;
    }

    if (result.redirected) {
        window.location.href = result.url;
        return;
    }

    const res = await result.json();
    alert((res.ok && res.success) || res.error);
    return;
}
</script>

<template>
    <Form :schema="LoginSchema" class="space-y-6" :novalidate="MODE === 'development'" :onSubmit="handleSubmit">
        <BaseInput name="identifier" label="Email address" type="email" autocomplete="email"
            placeholder="you@example.com" />
        <BaseInput name="password" label="Password" type="password" autocomplete="current-password"
            placeholder="••••••" />
        <SubmitButton type="submit">Sign in</SubmitButton>
    </Form>
</template>
