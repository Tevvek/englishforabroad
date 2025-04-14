<template>
    <!-- Mobile menu -->
    <TransitionRoot as="template" :show="$sidebarOpen">
        <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen.set(false)">
            <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
                enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
                leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-900/80" />
            </TransitionChild>

            <div class="fixed inset-0 flex">
                <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                    enter-from="-translate-x-full" enter-to="translate-x-0"
                    leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                    leave-to="-translate-x-full">
                    <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                        <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                            enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100"
                            leave-to="opacity-0">
                            <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
                                <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen.set(false)">
                                    <span class="sr-only">Close sidebar</span>
                                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                                </button>
                            </div>
                        </TransitionChild>
                        <!-- Sidebar component, swap this element with another sidebar if you like -->
                        <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                            <div class="flex h-16 shrink-0 items-center">
                                <slot name="logo" />
                            </div>
                            <nav class="flex flex-1 flex-col">
                                <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                    <li>
                                        <ul role="list" class="-mx-2 space-y-1">
                                            <DashboardNav />
                                        </ul>
                                    </li>
                                    <li class="-mx-6 mt-auto">
                                        <a href="/dashboard/settings"
                                            class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary transition">
                                            <Cog class="size-6" />
                                            <span class="sr-only">Your profile</span>
                                            <span aria-hidden="true">Settings</span>
                                        </a>
                                    </li>

                                </ul>
                            </nav>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import {
    XMarkIcon
} from '@heroicons/vue/24/outline';
import DashboardNav from './DashboardNav.vue';
import { useStore } from '@nanostores/vue';
import { sidebarOpen } from './dashboard-store'
import Cog from '@/icons/cog.svg?component';

const $sidebarOpen = useStore(sidebarOpen);
</script>
