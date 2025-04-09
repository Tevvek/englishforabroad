import vue from "@astrojs/vue";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import svgLoader from "vite-svg-loader";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],

  vite: {
    plugins: [tailwindcss(), svgLoader()],
  },

  experimental: {
    svg: true,
  },

  adapter: vercel(),
});