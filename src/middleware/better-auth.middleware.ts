import { auth } from "@/lib/auth";
import { defineMiddleware } from "astro:middleware";

const betterAuthMiddleware = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) {
    return next();
  }

  context.locals.user = null;
  context.locals.session = null;

  const authSession = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (authSession) {
    context.locals.user = authSession.user;
    context.locals.session = authSession.session;
  }

  const pathname = context.url.pathname;
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname.startsWith("/auth");

  if (!context.locals.session && isDashboardRoute) {
    return context.redirect("/auth/login");
  }

  if (context.locals.session && isAuthRoute) {
    return context.redirect("/dashboard");
  }

  return next();
});

export default betterAuthMiddleware;
