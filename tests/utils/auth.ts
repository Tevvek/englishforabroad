import type { BrowserContext, Page } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetchApi from "./fetch";
import type { User } from "@/types/auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registeredEmailsPath = path.resolve(
  __dirname,
  "../.registered-emails.json"
);

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

  // Track this email for later cleanup
  const existing: string[] = fs.existsSync(registeredEmailsPath)
    ? JSON.parse(fs.readFileSync(registeredEmailsPath, "utf-8"))
    : [];

  if (!existing.includes(email)) {
    existing.push(email);
    fs.writeFileSync(registeredEmailsPath, JSON.stringify(existing, null, 2));
  }
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
