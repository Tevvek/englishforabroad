import vue from "@astrojs/vue";
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import svgLoader from "vite-svg-loader";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],

  vite: {
    plugins: [tailwindcss(), svgLoader()],
  },

  adapter: vercel(),

  env: {
    schema: {
      PUBLIC_RECAPTCHA_SITE_KEY: envField.string({
        context: "client",
        access: "public",
      }),
      RECAPTCHA_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      GMAIL_APP_EMAIL: envField.string({ context: "server", access: "secret" }),
      GMAIL_APP_PASSWORD: envField.string({
        context: "server",
        access: "secret",
      }),
      STRAPI_URL: envField.string({ context: "server", access: "secret" }),
      STRAPI_API_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),

      MODE: envField.enum({
        context: "client",
        access: "public",
        values: ["development", "production"],
        default: "development",
      }),
    },
  },
});
