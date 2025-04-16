<script setup lang="ts">
import BaseInput from "@/components/form/BaseInput.vue";
import Form from "@/components/form/Form.vue";
import { RegisterSchema, type RegisterFormData } from "@/schemas/register.schema";
import type { CustomValidatorMap, Field } from "@/types/form";
import { appendRecaptchaToForm } from "@/utils/recaptcha/recaptcha.client";
import { to } from "@/utils/to";
import SubmitButton from "./form/SubmitButton.vue";
import { toast } from "vue-sonner";

const MODE = import.meta.env.MODE;

async function handleSubmit(fields: Record<keyof RegisterFormData, Field>) {
    const formData = new FormData();
    formData.append("identifier", fields.identifier.value);
    formData.append("password", fields.password.value);
    formData.append("repeatPassword", fields["repeatPassword"].value);

    const enriched = await appendRecaptchaToForm(formData);
    const [error, result] = await to(fetch("/api/register", { method: "POST", body: enriched }));

    if (error || !result) {
        toast.error("An error occurred. Please try again.");
        return;
    }

    if (result.redirected) {
        window.location.href = result.url;
        return;
    }

    const res = await result.json();
    if (res.error) {
        toast.error(res.error);
        return;
    }
}

const customValidators: CustomValidatorMap<RegisterFormData> = {
    repeatPassword: (v, all) => {
        if (v !== all.password.value) return 'Passwords do not match.';
        return '';
    },
}
</script>

<template>
    <Form :schema="RegisterSchema" class="space-y-6" :novalidate="MODE === 'development'" :onSubmit="handleSubmit"
        :customValidators>
        <BaseInput name="identifier" label="Email address" type="email" autocomplete="email"
            placeholder="you@example.com" />
        <BaseInput name="password" label="Password" type="password" autocomplete="current-password"
            placeholder="••••••" />
        <BaseInput name="repeatPassword" label="Repeat password" type="password" autocomplete="current-password"
            placeholder="••••••" />
        <SubmitButton type="submit">Register</SubmitButton>
    </Form>
</template>
