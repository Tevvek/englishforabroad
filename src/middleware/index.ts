import { sequence } from "astro:middleware";
import betterAuthMiddleware from "./better-auth.middleware";
import dashboardMiddleware from "./dashboard.middleware";
import authPagesMiddleware from "./auth-pages-middleware";

export const onRequest = sequence(
  betterAuthMiddleware,
  dashboardMiddleware,
  authPagesMiddleware
);
