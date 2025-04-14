import { defineMiddleware } from "astro:middleware";
import fetchApi from "./lib/strapi";
import type { User } from "@/types/auth";

const protectedRoutes = ["/dashboard", "/me", "/dashboard/settings"];
const guestOnlyRoutes = ["/login", "/register"];

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, redirect }, next) => {
    const pathname = url.pathname;

    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isGuestOnly = guestOnlyRoutes.includes(pathname);

    // 🚀 Early return if public route
    if (!isProtected && !isGuestOnly) {
      return next(); // skip token logic entirely
    }

    const token = cookies.get("english-for-abroad-token")?.value;
    let user: User | null = null;

    if (token) {
      try {
        user = await fetchApi<User>({
          endpoint: "users/me",
          authToken: token,
        });
        locals.user = user;
      } catch {
        cookies.delete("english-for-abroad-token");
      }
    }

    // 🛡️ Redirect if not logged in and accessing protected route
    if (isProtected && !user) {
      return redirect("/login");
    }

    // 🚫 Redirect if already logged in and accessing guest-only route
    if (isGuestOnly && user) {
      return redirect("/dashboard");
    }

    const response = await next();

    if (isProtected || isGuestOnly) {
      // Set cache control headers to prevent caching
      response.headers.set(
        "Cache-Control",
        "no-store, max-age=0, must-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
    }

    return response;
  }
);
