<template>
    <div class="relative overflow-hidden isolate">
        <!-- Actual skeleton loader -->
        <div
            class="absolute inset-0 before:absolute before:inset-0 before:-translate-y-full before:animate-[shimmer-vertical_2s_infinite] before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        </div>
        <!-- Image goes here -->
        <slot />
    </div>

</template>