import vue from "@astrojs/vue";
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import svgLoader from "vite-svg-loader";

import vercel from "@astrojs/vercel";

import react from "@astrojs/react";

import db from "@astrojs/db";

import inoxToolsRequestNanostores from "@inox-tools/request-nanostores";

// https://astro.build/config
export default defineConfig({
  output: "server",

  integrations: [vue(), react(), db(), inoxToolsRequestNanostores()],

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

      // Strapi CMS

      // Stripe payments

      // Brevo email marketing
      BREVO_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),

      // Resend email service
      RESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),

      // Session
      SESSION_COOKIE_NAME: envField.string({
        context: "server",
        access: "public",
        default: "english-for-abroad-session",
      }),

      // Bcrypt
      BCRYPT_SALT_ROUNDS: envField.number({
        context: "server",
        access: "public",
        default: 12,
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