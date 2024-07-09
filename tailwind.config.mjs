import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {},
    screens: {
      xs: "375px",
      ...defaultTheme.screens,
    },
    keyframes: {
      "shimmer-vertical": {
        "0%": {
          transform: "translateY(-100%)",
        },
        "100%": {
          transform: "translateY(100%)",
        },
      },
    },
  },
  plugins: [],
};
