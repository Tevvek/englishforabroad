import { defineMiddleware } from "astro:middleware";

const dashboardMiddleware = defineMiddleware(async (ctx, next) => {
  if (!ctx.url.pathname.startsWith("/dashboard")) {
    return next();
  }

  const { session } = ctx.locals;

  if (!session) {
    return ctx.redirect("/auth/login");
  }

  return next();
});

export default dashboardMiddleware;
