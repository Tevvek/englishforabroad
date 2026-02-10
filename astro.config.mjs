import vue from "@astrojs/vue";
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import svgLoader from "vite-svg-loader";

import vercel from "@astrojs/vercel";

import react from "@astrojs/react";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), react(), db()],

  vite: {
    plugins: [tailwindcss(), svgLoader()],
  },

  adapter: vercel(),

  env: {
    schema: {
      // Recaptcha
      PUBLIC_RECAPTCHA_SITE_KEY: envField.string({
        context: "client",
        access: "public",
      }),
      RECAPTCHA_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
      }),

      // Email setup
      GMAIL_APP_EMAIL: envField.string({ context: "server", access: "secret" }),
      GMAIL_APP_PASSWORD: envField.string({
        context: "server",
        access: "secret",
      }),

      // Stripe payments
      STRIPE_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      STRIPE_WEBHOOK_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      STRIPE_PRICE_ID: envField.string({
        context: "server",
        access: "secret",
      }),

      // Brevo email marketing
      BREVO_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),

      // Naver
      NAVER_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      NAVER_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),

      // Other
      SITE: envField.string({
        context: "server",
        access: "public",
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
