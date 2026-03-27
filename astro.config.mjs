import svelte from "@astrojs/svelte";
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import svgLoader from "vite-plugin-svelte-svg";
import path from "path";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        $app: path.resolve('./src/lib/app'),
        '$app/forms': path.resolve('./src/lib/app/forms.js'),
        '$app/navigation': path.resolve('./src/lib/app/navigation.js'),
        '$app/environment': path.resolve('./src/lib/app/environment.js'),
        '$app/stores': path.resolve('./src/lib/app/stores.js'),
      },
      noExternal: ['svelte-sonner', 'sveltekit-superforms', 'lucide-svelte', 'bits-ui', 'mode-watcher', 'formsnap', 'svelte-toolbelt']
    },
    optimizeDeps: {
      exclude: ['sveltekit-superforms']
    },
    ssr: {
      noExternal: ['svelte-sonner', 'sveltekit-superforms', 'lucide-svelte', 'bits-ui', 'mode-watcher', 'formsnap', 'svelte-toolbelt']
    }
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

      // Brevo email marketing
      BREVO_API_KEY: envField.string({
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
