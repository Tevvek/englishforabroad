<script lang="ts">
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
	class="mobile-header sticky top-0 z-navbar border-b bg-background/95 shadow-sm backdrop-blur lg:hidden"
	style:margin-right={isOpen ? "calc(-1 * var(--scroll-offset))" : ""}
>
	<div class="mobile-visible-navbar grid grid-cols-[1fr_auto_1fr] bg-background px-4 py-4 z-10" style:padding-right="calc(1rem + var(--scroll-offset, 0px))">
	  <div class="col-start-2 size-[82px] rounded-full border bg-card p-2 shadow-xs">
	    <a href="/#">
        {#if children}
          {@render children()}
        {/if}
      </a>
    </div>
	  <button aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} onclick={() => (isOpen = !isOpen)} class="justify-self-end self-start rounded-md border bg-card p-2 text-foreground shadow-xs transition hover:bg-accent hover:text-accent-foreground">
      {#if isOpen}
        <X />
      {:else}
        <Menu />
      {/if}
    </button>
  </div>

	{#if isOpen}
	  <div
		class="mobile-sliding-navbar animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-10 flex h-screen w-full flex-col gap-y-5 border-t bg-background px-8 py-8 text-foreground shadow-sm duration-300"
		style:padding-right="calc(1rem + var(--scroll-offset, 0px))"
	  >
		<nav class="contents">
        {#each NAV as item (item.href)}
          <a
            onclick={() => (isOpen = false)}
            href={item.href}
			class="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-primary focus:text-primary"
		  >
            {item.text}
          </a>
        {/each}
      </nav>

		<div class="flex gap-x-4 border-t pt-4 text-muted-foreground">
		  <a
			class="transition hover:text-primary focus:text-primary"
          href="https://www.instagram.com/englishforabroad/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
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
			class="transition hover:text-primary focus:text-primary"
          href="https://www.tiktok.com/@englishforabroad_"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
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
		  class="text-sm font-semibold uppercase tracking-[0.18em] text-primary underline decoration-primary/40 underline-offset-4 transition hover:text-foreground focus:text-foreground"
		  href="mailto:ali@englishforabroad.com"
		>
        ali@englishforabroad.com
      </a>
    </div>
  {/if}
</header>
