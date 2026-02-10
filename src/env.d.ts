/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  // Note: 'import {} from ""' syntax does not work in .d.ts files.
  type AuthUser = import("better-auth").User & {
    stripeCustomerId?: string | null;
  };

  interface Locals {
    user: AuthUser | null;
    session: import("better-auth").Session | null;
  }
}
