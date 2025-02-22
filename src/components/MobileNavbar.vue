<template>
    <header class="mobile-header sticky top-0 z-navbar bg-white shadow-lg lg:hidden"
        :style="{ marginRight: isOpen ? `calc(-1 * var(--scroll-offset))` : '' }">
        <div class="mobile-visible-navbar grid grid-cols-[1fr_auto_1fr] px-4 py-4 z-10 bg-white">
            <div class="size-[100px] col-start-2">
                <a href="/#">
                    <slot />
                </a>
            </div>
            <button @click="isOpen = !isOpen" class="justify-self-end self-start text-cyan-800">
                <component :is="isOpen ? X : Menu" />
            </button>
        </div>

        <!-- Slide Transition -->
        <transition name="slide">
            <div v-if="isOpen"
                class="mobile-sliding-navbar absolute top-full left-0 w-full bg-white shadow-lg py-8 text-cyan-800 pl-8 pr-4 flex flex-col gap-y-4 z-10 h-screen">
                <nav class="contents">
                    <template v-for="item in NAV">
                        <a @click="isOpen = false" :href="item.href"
                            class="font-extrabold uppercase text-lg hover:text-[#85CBCC] transition focus:text-[#85CBCC]">
                            {{ item.text }}
                        </a>
                    </template>
                </nav>

                <div class="flex gap-x-4 border-t border-cyan-800 pt-4">
                    <a class="hover:text-[#85CBCC] transition focus:text-[#85CBCC]"
                        href="https://www.instagram.com/englishforabroad/" target="_blank" rel="noopener noreferrer">
                        <Instagram />
                    </a>
                    <a class="hover:text-[#85CBCC] transition focus:text-[#85CBCC]"
                        href="https://www.tiktok.com/@englishforabroad_" target="_blank" rel="noopener noreferrer">
                        <Tiktok />
                    </a>
                </div>

                <a class="hover:text-[#85CBCC] transition focus:text-[#85CBCC] text-lg font-extrabold underline"
                    href="mailto:ali@englishforabroad.com">
                    ali@englishforabroad.com
                </a>
            </div>
        </transition>
    </header>
</template>

<script setup lang="ts">
import Instagram from '@/icons/instagram.svg?component';
import Menu from '@/icons/menu.svg?component';
import Tiktok from '@/icons/tiktok.svg?component';
import X from '@/icons/x.svg?component';
import { NAV } from '@/utils/constants';
import { ref, watch } from 'vue';

const isOpen = ref(false);

watch(isOpen, (value) => {
    updateScrollbarWidth(); // Update when the menu is toggled
    document.body.style.overflow = value ? 'hidden' : '';
    document.body.style.paddingRight = 'var(--scroll-offset)';
});

function getScrollbarWidth() {
    // most phones overlay the scroll but in desktop it takes some width
    return window.innerWidth - document.documentElement.clientWidth;
}

const updateScrollbarWidth = () => {
    const scrollbarWidth = getScrollbarWidth();
    document.documentElement.style.setProperty('--scroll-offset', `${scrollbarWidth}px`);
};

</script>

<style scoped>
.mobile-header .mobile-visible-navbar {
    padding-right: calc(var(--spacing, 0.25rem) * 4 + var(--scroll-offset, 0px));
}

.mobile-header .mobile-sliding-navbar {
    padding-right: calc(var(--spacing, 0.25rem) * 4 + var(--scroll-offset, 0px));
}

/* Slide Transition */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.slide-enter-from {
    transform: translateY(-100%);
    opacity: 0;
}

.slide-enter-to {
    transform: translateY(0);
    opacity: 1;
}

.slide-leave-from {
    transform: translateY(0);
    opacity: 1;
}

.slide-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}
</style>
