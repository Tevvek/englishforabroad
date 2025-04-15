import { test, expect } from "@playwright/test";
import { register, getTokenCookie } from "@tests/utils/auth";

const testPassword = "validPassword123";

test.describe("Register Flow", () => {
  test.describe("✅ Successful registration", () => {
    let testEmail: string;

    test.beforeEach(() => {
      testEmail = `user-${Date.now()}@test.com`;
    });

    test("User can register and is redirected to /dashboard", async ({
      page,
    }) => {
      await register(page, testEmail, testPassword);
      expect(page.url()).toContain("/dashboard");
    });

    test("JWT cookie is set after registration", async ({ page, context }) => {
      const uniqueEmail = `cookie-${Date.now()}@test.com`;
      await register(page, uniqueEmail, testPassword);

      const cookie = await getTokenCookie(context);
      expect(cookie).toBeTruthy();
      expect(cookie?.value).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    });
  });

  test.describe("❌ Failed registration", () => {
    const duplicateEmail = `duplicate-${Date.now()}@test.com`;

    test("Registration fails with existing email", async ({ page }) => {
      await register(page, duplicateEmail, testPassword);

      await page.goto("/api/logout");

      await page.goto("/register");
      await page.fill('input[name="identifier"]', duplicateEmail);
      await page.fill('input[name="password"]', testPassword);
      await page.fill('input[name="repeat-password"]', testPassword);

      await Promise.all([
        page.waitForResponse(async (res) => {
          if (!res.url().includes("/api/register")) return false;
          const body = await res.json();
          return res.status() === 500 && body.error === "Registration failed.";
        }),
        page.click('button[type="submit"]'),
      ]);
    });
  });

  test.describe("⚠️ Validation errors", () => {
    const email = `invalid-${Date.now()}@test.com`;

    test("Missing email shows error", async ({ page }) => {
      await page.goto("/register");
      await page.fill('input[name="password"]', testPassword);
      await page.fill('input[name="repeat-password"]', testPassword);

      await Promise.all([
        page.waitForResponse(async (res) => {
          if (!res.url().includes("/api/register")) return false;
          const body = await res.json();
          return (
            res.status() === 400 && body.error === "Invalid email address."
          );
        }),
        page.click('button[type="submit"]'),
      ]);
    });

    test("Missing password shows error", async ({ page }) => {
      await page.goto("/register");
      await page.fill('input[name="identifier"]', email);
      await page.fill('input[name="repeat-password"]', testPassword);

      await Promise.all([
        page.waitForResponse(async (res) => {
          if (!res.url().includes("/api/register")) return false;
          const body = await res.json();
          return (
            res.status() === 400 && body.error.includes("Password must be")
          );
        }),
        page.click('button[type="submit"]'),
      ]);
    });

    test("Password mismatch shows error", async ({ page }) => {
      await page.goto("/register");
      await page.fill('input[name="identifier"]', email);
      await page.fill('input[name="password"]', testPassword);
      await page.fill('input[name="repeat-password"]', "mismatch");

      await Promise.all([
        page.waitForResponse(async (res) => {
          if (!res.url().includes("/api/register")) return false;
          const body = await res.json();
          return (
            res.status() === 400 && body.error === "Passwords do not match."
          );
        }),
        page.click('button[type="submit"]'),
      ]);
    });

    test("Invalid email format shows error", async ({ page }) => {
      await page.goto("/register");
      await page.fill('input[name="identifier"]', "invalid-email");
      await page.fill('input[name="password"]', testPassword);
      await page.fill('input[name="repeat-password"]', testPassword);

      await Promise.all([
        page.waitForResponse(async (res) => {
          if (!res.url().includes("/api/register")) return false;
          const body = await res.json();
          return (
            res.status() === 400 && body.error === "Invalid email address."
          );
        }),
        page.click('button[type="submit"]'),
      ]);
    });

    test("Password too short shows error", async ({ page }) => {
      await page.goto("/register");
      await page.fill('input[name="identifier"]', email);
      await page.fill('input[name="password"]', "123");
      await page.fill('input[name="repeat-password"]', "123");

      await Promise.all([
        page.waitForResponse(async (res) => {
          if (!res.url().includes("/api/register")) return false;
          const body = await res.json();
          return res.status() === 400 && body.error.includes("at least 6");
        }),
        page.click('button[type="submit"]'),
      ]);
    });
  });
});
