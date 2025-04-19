<template>
    <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen.set(true)">
        <span class="sr-only">Open sidebar</span>
        <Menu class="size-6" aria-hidden="true" />
    </button>
</template>

<script setup lang="ts">
import Menu from '@/icons/menu.svg?component';
import { sidebarOpen } from "./dashboard-store";
</script>