<script setup lang="ts">
import { ref, watch } from 'vue'
import { cn } from '@/utils/classes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '../Spinner.vue'

const isLoading = ref(false)

const formData = ref({
    email: '',
    password: ''
})


// watch formData email
watch(formData, (newVal, oldVal) => {
    alert('formData.email changed')
})
async function onSubmit(event: Event) {
    event.preventDefault()
    isLoading.value = true
    console.log('formData', formData.value)

    setTimeout(() => {
        isLoading.value = false
    }, 3000)
}



</script>

<template>
    <div :class="cn('grid gap-6 mt-6', $attrs.class ?? '')">
        <form @submit="onSubmit">
            <div class="grid gap-2">
                <div class="grid gap-1">
                    <Label class="sr-only" for="email">
                        Email
                    </Label>
                    <Input id="email" placeholder="name@example.com" type="email" auto-capitalize="none"
                        auto-complete="email" auto-correct="off" :disabled="isLoading" />
                </div>
                <div class="grid gap-1">
                    <Label class="sr-only" for="password">
                        Password
                    </Label>
                    <Input id="password" placeholder="******" type="password" auto-capitalize="none"
                        auto-complete="none?" auto-correct="off" :disabled="isLoading" />
                </div>
                <Button :disabled="isLoading">
                    <Spinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                    Sign In with Email
                </Button>
            </div>
        </form>
    </div>
</template>