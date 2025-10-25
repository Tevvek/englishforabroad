import type { AstroCookies } from "astro";
import { SESSION_COOKIE_NAME } from "astro:env/server";

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: import.meta.env.MODE === "production",
  sameSite: "lax" as const,
  maxAge: THIRTY_DAYS_IN_SECONDS,
  path: "/",
};

export function setSessionCookie(cookies: AstroCookies, token: string): void {
  cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
}

export function getSessionCookie(cookies: AstroCookies): string | undefined {
  return cookies.get(SESSION_COOKIE_NAME)?.value;
}

export function deleteSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE_NAME, {
    path: "/",
  });
}
