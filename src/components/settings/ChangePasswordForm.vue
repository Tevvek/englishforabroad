<script setup lang="ts">
import { ChangePasswordSchema, type ChangePasswordFormData } from '@/schemas/change-password.schema';
import type { CustomValidatorMap, Field } from '@/types/form';
import { to } from '@/utils/to';
import { toast } from 'vue-sonner';
import BaseInput from '@/components/form/BaseInput.vue';
import Form from '@/components/form/Form.vue';

async function handleSubmit(fields: Record<keyof ChangePasswordFormData, Field>) {
    const formData = new FormData();
    formData.append("new-password", fields['new-password'].value);
    formData.append("repeat-new-password", fields['repeat-new-password'].value);
    formData.append("old-password", fields['old-password'].value);

    const [error, res] = await to(fetch('/api/settings/change-password', {
        method: 'POST',
        body: formData,
    }));

    if (error || !res) {
        console.error('❌ Change password error:', error);
        toast.error("An error occurred. Please try again.");
        return;
    }

    const result = await res.json();
    if (result.error) {
        toast.error(result.error);
        return;
    }

    if (result.success) {
        toast.success(result.success);
        return;
    }
}

const customValidators: CustomValidatorMap<ChangePasswordFormData> = {
    "repeat-new-password": (v, all) => {
        if (v !== all["new-password"].value) return "Passwords do not match.";
        return "";
    },
};

const MODE = import.meta.env.MODE;

</script>

<template>
    <Form :schema="ChangePasswordSchema" class="bg-white shadow-xs ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
        :onSubmit="handleSubmit" :customValidators="customValidators" :novalidate="MODE === 'development'">
        <div class="px-4 py-6 sm:p-8">
            <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                <BaseInput class="sm:col-span-4" name="new-password" label="New password" type="password"
                    autocomplete="new-password" placeholder="••••••" />
                <BaseInput class="sm:col-span-4" name="repeat-new-password" label="Repeat new password" type="password"
                    autocomplete="new-password" placeholder="••••••" />
                <BaseInput class="sm:col-span-4" name="old-password" label="Old password" type="password"
                    autocomplete="current-password" placeholder="••••••" />
            </div>
        </div>
        <div class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button type="button" class="text-sm/6 font-semibold text-gray-900">Cancel</button>
            <button type="submit" data-testid="change-password-submit"
                class="transition rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Save</button>
        </div>
    </Form>

</template>
