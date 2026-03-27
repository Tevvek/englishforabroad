<script lang="ts">
  import { slide } from "svelte/transition";
  import Menu from "lucide-svelte/icons/menu";
  import X from "lucide-svelte/icons/x";
  import { NAV } from "@/utils/constants";
  
  let { children } = $props<{ children?: any }>();
  let isOpen = $state(false);

  $effect(() => {
    updateScrollbarWidth();
    document.body.style.overflow = isOpen ? "hidden" : "";
    document.body.style.paddingRight = isOpen ? "var(--scroll-offset)" : "";
  });

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function updateScrollbarWidth() {
    const scrollbarWidth = getScrollbarWidth();
    document.documentElement.style.setProperty("--scroll-offset", `${scrollbarWidth}px`);
  }
</script>

<header
  class="mobile-header sticky top-0 z-navbar bg-white shadow-lg lg:hidden"
  style:margin-right={isOpen ? "calc(-1 * var(--scroll-offset))" : ""}
>
  <div class="mobile-visible-navbar grid grid-cols-[1fr_auto_1fr] px-4 py-4 z-10 bg-white" style:padding-right="calc(1rem + var(--scroll-offset, 0px))">
    <div class="size-[100px] col-start-2">
      <a href="/#">
        {#if children}
          {@render children()}
        {/if}
      </a>
    </div>
    <button onclick={() => (isOpen = !isOpen)} class="justify-self-end self-start text-primary">
      {#if isOpen}
        <X />
      {:else}
        <Menu />
      {/if}
    </button>
  </div>

  {#if isOpen}
    <div
      transition:slide={{ duration: 300, axis: 'y' }}
      class="mobile-sliding-navbar absolute top-full left-0 w-full bg-white shadow-lg py-8 text-primary pl-8 pr-4 flex flex-col gap-y-4 z-10 h-screen"
      style:padding-right="calc(1rem + var(--scroll-offset, 0px))"
    >
      <nav class="contents">
        {#each NAV as item}
          <a
            onclick={() => (isOpen = false)}
            href={item.href}
            class="font-extrabold uppercase text-lg hover:text-accent transition focus:text-accent"
          >
            {item.text}
          </a>
        {/each}
      </nav>

      <div class="flex gap-x-4 border-t border-primary pt-4">
        <a
          class="hover:text-accent transition focus:text-accent"
          href="https://www.instagram.com/englishforabroad/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-8"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
            <path d="M16.5 7.5v.01" />
          </svg>
        </a>
        <a
          class="hover:text-accent transition focus:text-accent"
          href="https://www.tiktok.com/@englishforabroad_"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-8"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z" />
          </svg>
        </a>
      </div>

      <a
        class="hover:text-accent transition focus:text-accent text-lg font-extrabold underline"
        href="mailto:ali@englishforabroad.com"
      >
        ali@englishforabroad.com
      </a>
    </div>
  {/if}
</header>
