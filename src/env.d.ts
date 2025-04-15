/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import { type Auth } from "./types/auth";

declare global {
  namespace App {
    interface Locals extends Auth {}
  }
}
