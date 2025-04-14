<template>
    <div
        class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen.set(true)">
            <span class="sr-only">Open sidebar</span>
            <Bars3Icon class="size-6" aria-hidden="true" />
        </button>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form class="grid flex-1 grid-cols-1" action="#" method="GET">
                <input type="search" name="search" aria-label="Search"
                    class="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
                    placeholder="Search" />
                <MagnifyingGlassIcon
                    class="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                    aria-hidden="true" />
            </form>
            <div class="flex items-center gap-x-4 lg:gap-x-6">
                <button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                    <span class="sr-only">View notifications</span>
                    <BellIcon class="size-6" aria-hidden="true" />
                </button>

                <!-- Separator -->
                <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                <!-- Profile dropdown -->
                <Menu as="div" class="relative">
                    <MenuButton class="-m-1.5 flex items-center p-1.5">
                        <span class="sr-only">Open user menu</span>
                        <img class="size-8 rounded-full bg-gray-50"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="" />
                        <span class="hidden lg:flex lg:items-center">
                            <span class="ml-4 text-sm/6 font-semibold text-gray-900" aria-hidden="true">Tom Cook</span>
                            <ChevronDownIcon class="ml-2 size-5 text-gray-400" aria-hidden="true" />
                        </span>
                    </MenuButton>
                    <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
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
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
} from '@headlessui/vue'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import {
    Bars3Icon,
    BellIcon
} from '@heroicons/vue/24/outline'
import { sidebarOpen } from './dashboard-store'
import cn from '@/utils/cn'

const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Log out', action: handleLogout }
]

async function handleLogout() {
    try {
        const response = await fetch('/api/logout');
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }
    } catch (error) {
        console.error('Logout failed:', error);
        alert('Logout failed. Please try again.');
    }
}
</script>