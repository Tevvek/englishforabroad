import type { Page, BrowserContext } from "@playwright/test";

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
