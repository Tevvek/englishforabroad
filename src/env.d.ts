/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import { type User } from "./types/auth";

declare global {
  namespace App {
    interface Locals extends Record<string, any> {
      user: User;
    }
  }
}
