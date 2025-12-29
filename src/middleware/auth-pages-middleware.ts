import { defineMiddleware } from "astro:middleware";

const authPagesMiddleware = defineMiddleware(async (ctx, next) => {
  if (!ctx.url.pathname.startsWith("/auth")) {
    return next();
  }

  const { session } = ctx.locals;

  if (ctx.url.pathname.startsWith("/auth/login")) {
    if (session) {
      return ctx.redirect("/dashboard");
    }
  }

  return next();
});

export default authPagesMiddleware;
