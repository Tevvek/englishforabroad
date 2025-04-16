<template>
    <Menu as="div" class="relative">
        <MenuButton class="-m-1.5 flex items-center p-1.5">
            <span class="sr-only">Open user menu</span>
            <UserIcon />

            <span class="hidden lg:flex lg:items-center">
                <span class="ml-4 text-sm/6 font-semibold text-gray-900" aria-hidden="true">
                    {{ user.email }}
                </span>
                <ChevronDownIcon class="ml-2 size-5 text-gray-400" aria-hidden="true" />
            </span>
        </MenuButton>
        <transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <MenuItems
                class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-hidden">
                <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                <template v-if="item.href">
                    <a :href="item.href"
                        :class="cn('block text-start w-full px-3 py-1 text-sm/6 text-gray-900', { 'bg-gray-50 outline-hidden': active })">{{
                            item.name }}</a>
                </template>

                <template v-else-if="item.action">
                    <button type="button" @click="item.action"
                        :class="cn('block text-start w-full px-3 py-1 text-sm/6 text-gray-900', { 'bg-gray-50 outline-hidden': active })">{{
                            item.name }}</button>
                </template>
                </MenuItem>
            </MenuItems>
        </transition>
    </Menu>
</template>

<script setup lang="ts">
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
} from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import UserIcon from '@/icons/user.svg?component';
import cn from '@/utils/cn';
import type { User } from '@/types/auth';
import { to } from '@/utils/to';

defineProps<{
    user: User
}>();


const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Log out', action: handleLogout }
]


async function handleLogout() {
    const [error, response] = await to(fetch('/api/logout'))

    if (error || !response) {
        console.error('Logout failed:', error);
        alert('Logout failed. Please try again.');
        return;
    }


    if (response.redirected) {
        window.location.href = response.url;
        return;
    }
}
</script>