/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_RECAPTCHA_SITE_KEY: string;
  readonly RECAPTCHA_SECRET_KEY: string;
  readonly GMAIL_APP_EMAIL: string;
  readonly GMAIL_APP_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
