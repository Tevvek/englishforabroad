import type { AstroCookies } from "astro";

const SESSION_COOKIE_NAME = "session_token";
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
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
