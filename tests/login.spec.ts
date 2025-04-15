import { test, expect } from "@playwright/test";
import { login, getTokenCookie } from "@tests/utils/auth";

test.describe("Auth Flow", () => {
  test.describe("✅ Successful login", () => {
    test("User can log in and is redirected to /dashboard", async ({
      page,
    }) => {
      await login(page, "john@example.com", "superSecurePassword123");
      expect(page.url()).toContain("/dashboard");
    });

    test("JWT token cookie is set after login", async ({ page, context }) => {
      await login(page, "john@example.com", "superSecurePassword123");

      const tokenCookie = await getTokenCookie(context);
      expect(tokenCookie).toBeTruthy();
      expect(tokenCookie?.value).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    });

    test("User is redirected from /login to /dashboard when already logged in", async ({
      page,
      context,
    }) => {
      await login(page, "john@example.com", "superSecurePassword123");

      const tokenCookie = await getTokenCookie(context);
      expect(tokenCookie).toBeTruthy();

      await page.goto("/login");
      expect(page.url()).toContain("/dashboard");
    });
  });

  test.describe("❌ Failed login", () => {
    test("Shows error when credentials are wrong", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="identifier"]', "nonexistent@example.com");
      await page.fill('input[name="password"]', "wrongpassword");

      await Promise.all([
        page.waitForResponse(async (res) => {
          if (!res.url().includes("/api/login")) return false;
          const body = await res.json();
          return res.status() === 500 && body.error === "Login failed.";
        }),
        page.click('button[type="submit"]'),
      ]);
    });
  });

  test.describe("⚠️ Validation errors", () => {
    test("Shows error when email is missing", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="password"]', "somepassword");

      await Promise.all([
        page.waitForResponse(async (res) => {
          if (!res.url().includes("/api/login")) return false;
          const body = await res.json();
          return (
            res.status() === 400 && body.error === "Invalid email address."
          );
        }),
        page.click('button[type="submit"]'),
      ]);
    });

    test("Shows error when password is missing", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="identifier"]', "test@example.com");

      await Promise.all([
        page.waitForResponse(async (res) => {
          if (!res.url().includes("/api/login")) return false;
          const body = await res.json();
          return (
            res.status() === 400 &&
            body.error === "Password must be at least 6 characters long."
          );
        }),
        page.click('button[type="submit"]'),
      ]);
    });

    test("Shows error for invalid email format", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="identifier"]', "not-an-email");
      await page.fill('input[name="password"]', "validPassword");

      await Promise.all([
        page.waitForResponse(async (res) => {
          if (!res.url().includes("/api/login")) return false;
          const body = await res.json();
          return (
            res.status() === 400 && body.error === "Invalid email address."
          );
        }),
        page.click('button[type="submit"]'),
      ]);
    });

    test("Shows error when password is too short", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="identifier"]', "test@example.com");
      await page.fill('input[name="password"]', "123");

      await Promise.all([
        page.waitForResponse(async (res) => {
          if (!res.url().includes("/api/login")) return false;
          const body = await res.json();
          return (
            res.status() === 400 &&
            body.error === "Password must be at least 6 characters long."
          );
        }),
        page.click('button[type="submit"]'),
      ]);
    });
  });
});
