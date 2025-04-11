/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_RECAPTCHA_SITE_KEY: string;
  readonly RECAPTCHA_SECRET_KEY: string;
  readonly GMAIL_APP_EMAIL: string;
  readonly GMAIL_APP_PASSWORD: string;
  readonly STRAPI_URL: string;
  readonly STRAPI_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
