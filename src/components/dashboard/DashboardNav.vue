<template>
    <li v-for="item in navigation" :key="item.name">
        <a :href="item.href" :class="cn(
            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 transition',
            ' hover:bg-gray-50 hover:text-primary',
            { 'bg-gray-50 text-primary': item.current },
        )">
            <component :is="item.icon" :class="cn(
                'size-6 shrink-0 text-gray-700 group-hover:text-primary',
                { 'text-primary': item.current },
            )" aria-hidden="true" />
            {{ item.name }}
        </a>
    </li>
</template>

<script setup lang="ts">
import {
    HomeIcon,
    CalendarIcon
} from '@heroicons/vue/24/outline';
import cn from '@/utils/cn';

const navigation = [
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
    { name: 'Classes', href: '#', icon: CalendarIcon, current: false },
]
</script>