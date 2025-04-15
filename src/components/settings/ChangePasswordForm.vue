<template>
    <form class="bg-white shadow-xs ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
        @submit.prevent="handleFormSubmit" ref="formRef">
        <div class="px-4 py-6 sm:p-8">
            <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                <!-- New password -->
                <div class="sm:col-span-4">
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">New password</label>
                    <div class="mt-2">
                        <input id="new-password" name="new-password" type="password" required v-model="form.newPassword"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <!-- Repeat new password -->
                <div class="sm:col-span-4">
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">Repeat new password</label>
                    <div class="mt-2">
                        <input id="repeat-new-password" name="repeat-new-password" type="password" required
                            v-model="form.repeatNewPassword"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <!-- Old password -->
                <div class="sm:col-span-4">
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">Old password</label>
                    <div class="mt-2">
                        <input id="old-password" name="old-password" type="password" required v-model="form.oldPassword"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

            </div>
        </div>
        <div class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button type="button" class="text-sm/6 font-semibold text-gray-900">Cancel</button>
            <button type="submit"
                class="transition rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Save</button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formRef = ref<HTMLFormElement | null>(null);

const form = ref({
    newPassword: '',
    repeatNewPassword: '',
    oldPassword: '',
});

async function handleFormSubmit() {
    if (!formRef.value) return;
    try {
        const formData = new FormData(formRef.value);

        const res = await fetch('/api/settings/change-password', {
            method: 'POST',
            body: formData,
        });

        const result = await res.json();

        if (res.ok) {
            alert('Password changed successfully.');
        } else {
            console.error('❌ Change password error:', result);
            alert("Something went wrong.");
        }
    } catch (err) {
        console.error('❌ Change password error:', err);
    }
}
</script>
