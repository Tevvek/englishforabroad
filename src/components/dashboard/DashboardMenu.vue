<template>
    <li v-for="item in navigation" :key="item.name">
        <a :href="item.href" :class="cn(
            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 transition',
            ' hover:bg-gray-50 hover:text-primary',
            {
                'bg-gray-50 text-primary': item.active
            },
        )">
            <component :is="item.icon" :class="cn(
                'size-6 shrink-0 text-gray-700 group-hover:text-primary',
                {
                    'text-primary': item.active
                },
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


const props = defineProps<{
    pathname: string;
}>();

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Classes', href: '/dashboard/classes', icon: CalendarIcon },
].map((item) => ({
    ...item,
    active: props.pathname === item.href,
}));

</script>