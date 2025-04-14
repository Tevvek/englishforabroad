import fetchApi from "@/lib/strapi";
import { type User } from "@/types/auth";
import type { BrowserContext, Page } from "@playwright/test";

// Log in with given credentials and wait for redirect
export const login = async (
  page: Page,
  email: string,
  password: string
): Promise<void> => {
  await page.goto("/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  await Promise.all([
    page.waitForURL("/dashboard"),
    page.click('button[type="submit"]'),
  ]);
};

// Get JWT token cookie
export const getTokenCookie = async (context: BrowserContext) => {
  const cookies = await context.cookies();
  return cookies.find((c) => c.name === "english-for-abroad-token");
};

export async function register(page: Page, email: string, password: string) {
  await page.goto("/register");

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="repeat-password"]', password);

  await Promise.all([
    page.waitForURL("/dashboard"),
    page.click('button[type="submit"]'),
  ]);
}

export async function deleteUserByEmail(email: string) {
  const res = await fetchApi<User[]>({
    endpoint: `/users?filters[email][$eq]=${email}`,
  });

  const user = res?.[0];
  if (!user?.id) return;

  await fetchApi({
    endpoint: `/users/${user.id}`,
    method: "DELETE",
  });
}
