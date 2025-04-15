<template>
    <form class="space-y-6" :novalidate="MODE === 'development'" @submit.prevent="handleSubmit" ref="formRef">
        <div>
            <label for="email" class="block text-sm/6 font-medium text-primary">Email address</label>
            <div class="mt-2">
                <input type="email" name="email" id="email" autocomplete="email" required v-model="form.email"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-primary outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6" />
            </div>
        </div>
        <div>
            <div class="flex items-center justify-between">
                <label for="password" class="block text-sm/6 font-medium text-primary">Password</label>
                <div class="text-sm">
                    <a href="#" class="font-semibold text-primary hover:text-accent">Forgot password?</a>
                </div>
            </div>
            <div class="mt-2">
                <input type="password" name="password" id="password" autocomplete="current-password" required
                    v-model="form.password"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-primary outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6" />
            </div>
        </div>
        <div>
            <button type="submit"
                class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Sign
                in</button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { appendRecaptchaToForm } from "@/utils/recaptcha/recaptcha.client";

const MODE = import.meta.env.MODE;

const formRef = ref<HTMLFormElement | null>(null);
const form = ref({ email: "", password: "" });

async function handleSubmit() {
    if (!formRef.value) return;
    try {
        let formData = new FormData(formRef.value);
        formData = await appendRecaptchaToForm(formData);

        const response = await fetch("/api/login", {
            method: "POST",
            body: formData,
        });

        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        const result = await response.json();
        if (response.ok) {
            alert(result.success);
        } else {
            alert(result.error);
        }
    } catch (error) {
        alert("An error occurred. Please try again later.");
    }
}
</script>
