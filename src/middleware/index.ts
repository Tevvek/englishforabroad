import { sequence } from "astro:middleware";
import betterAuthMiddleware from "./better-auth.middleware";

export const onRequest = sequence(betterAuthMiddleware);
