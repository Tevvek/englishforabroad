<template>
    <div class="hidden md:flex flex-col md:flex-row gap-4 py-5 justify-end text-cyan-800">
        <button :class="[
            'px-4 py-1 rounded-2xl transition duration-300 text-sm font-semibold shadow-md',
            buttonClass(tag)
        ]" v-for="(tag, key) in PodcastsThemes" :key="key" @click="selectedPodcast.set(tag)">
            {{ tag }}
        </button>
    </div>

    <div class="md:hidden py-5">
        <Listbox as="div" v-model="$selectedPodcast" class="relative">
            <ListboxButton
                class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-cyan-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-800 text-sm leading-6">
                <span class="block truncate">{{ $selectedPodcast }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <Selector class="!size-4 text-cyan-800" aria-hidden="true" />
                </span>
            </ListboxButton>
            <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <ListboxOptions
                    class="absolute z-10 mt-1 max-h-60 overflow-auto w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                    <ListboxOption as="template" v-for="person in tags" :key="person" :value="person"
                        v-slot="{ active, selected }">
                        <li
                            :class="[active ? 'bg-cyan-800 text-white' : 'text-cyan-800', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ person
                                }}</span>
                            <span v-if="selected"
                                :class="[active ? 'text-white' : 'text-cyan-800', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                                <Check class="!size-4" aria-hidden="true" />
                            </span>
                        </li>
                    </ListboxOption>
                </ListboxOptions>
            </transition>
        </Listbox>
    </div>

</template>

<script setup lang="ts">
import Check from '@/components/Check.vue';
import Selector from '@/components/Selector.vue';
import { PodcastsThemes } from '@/types/resources';
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/vue';
import { useVModel } from '@nanostores/vue';
import { computed, onMounted, ref } from 'vue';
import { selectedPodcast } from './nanostore';

const $selectedPodcast = useVModel(selectedPodcast);

const isMounted = ref(false);

onMounted(() => {
    isMounted.value = true;
});

const buttonClass = computed(() => (tag: string) => {
    if (!isMounted.value) {
        return 'bg-white';
    }
    return $selectedPodcast.value === tag ? 'bg-cyan-800 text-white' : 'bg-white';
});

const tags = Object.values(PodcastsThemes);

</script>