import fetchApi from "@/lib/strapi";
import type { User } from "@/types/auth";
import { to } from "@/utils/to";
import { defineMiddleware } from "astro:middleware";

const protectedRoutes = ["/dashboard", "/me", "/dashboard/settings"];
const guestOnlyRoutes = ["/login", "/register"];
const protectedApiRoutes = ["/api/settings/change-password"];

const ogMiddleware = defineMiddleware(
  async ({ locals, cookies, url, redirect, isPrerendered }, next) => {
    const pathname = url.pathname;

    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isGuestOnly = guestOnlyRoutes.includes(pathname);
    const isProtectedApi = protectedApiRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // 🚀 Early return if public route
    if (isPrerendered) return next();

    const token = cookies.get("english-for-abroad-token")?.value;
    let user: User | null = null;

    if (token) {
      const [error, fetchedUser] = await to(
        fetchApi<User>({
          endpoint: "users/me",
          authToken: token,
        })
      );

      if (error || !fetchedUser) {
        cookies.delete("english-for-abroad-token");
      } else {
        user = fetchedUser;
        locals.user = user;
        locals.jwt = token;
      }
    }

    // 🛡️ Redirect if not logged in and accessing protected route
    if ((isProtected || isProtectedApi) && !user) {
      // Redirect for protected pages
      if (pathname.startsWith("/api")) {
        return new Response(JSON.stringify({ error: "Not authenticated." }), {
          status: 401,
        });
      }
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

export default ogMiddleware;
