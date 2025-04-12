<template>
    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen.set(true)">
            <span class="sr-only">Open sidebar</span>
            <Bars3Icon class="size-6" aria-hidden="true" />
        </button>
        <div class="flex-1 text-sm/6 font-semibold text-gray-900">Dashboard</div>
        <a href="/dashboard/settings">
            <span class="sr-only">Your profile</span>
            <Cog class="size-6" />
        </a>
    </div>

</template>

<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/outline';
import { sidebarOpen } from './dashboard.nanostore';
import Cog from '@/icons/cog.svg?component';
</script>