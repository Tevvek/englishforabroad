<script setup lang="ts">
import BaseInput from "@/components/form/BaseInput.vue";
import Form from "@/components/form/Form.vue";
import { RegisterSchema, type RegisterFormData } from "@/schemas/register.schema";
import type { CustomValidatorMap, Field } from "@/types/form";
import { appendRecaptchaToForm } from "@/utils/recaptcha/recaptcha.client";
import { to } from "@/utils/to";

const MODE = import.meta.env.MODE;

async function handleSubmit(fields: Record<keyof RegisterFormData, Field>) {
    const formData = new FormData();
    formData.append("identifier", fields.identifier.value);
    formData.append("password", fields.password.value);
    formData.append("repeatPassword", fields["repeatPassword"].value);

    const enriched = await appendRecaptchaToForm(formData);
    const [error, result] = await to(fetch("/api/register", { method: "POST", body: enriched }));

    if (error || !result) {
        alert("An error occurred. Please try again.");
        return;
    }

    if (result.redirected) {
        window.location.href = result.url;
        return;
    }

    const res = await result.json();
    alert(result.ok && res.success || res.error);
    return;
}

const customValidators: CustomValidatorMap<RegisterFormData> = {
    repeatPassword: (v, all) => {
        if (v !== all.password.value) return 'Passwords do not match.';
        return '';
    },
}
</script>

<template>
    <Form :schema="RegisterSchema" class="space-y-6" :novalidate="MODE === 'development'" @submit="handleSubmit"
        :customValidators>
        <BaseInput name="identifier" label="Email address" type="email" autocomplete="email"
            placeholder="you@example.com" />
        <BaseInput name="password" label="Password" type="password" autocomplete="current-password"
            placeholder="••••••" />
        <BaseInput name="repeatPassword" label="Repeat password" type="password" autocomplete="current-password"
            placeholder="••••••" />
        <button type="submit"
            class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Sign
            in</button>
    </Form>
</template>
