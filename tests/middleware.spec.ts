import { expect, test } from "@playwright/test";
import { login } from "@tests/utils/auth";
import { expectRedirect, expectAccessible } from "@tests/utils/helpers";

test.describe("Middleware Access Control", () => {
  test("Public page loads without auth", async ({ page }) => {
    await expectAccessible(page, "/");
  });

  test("Protected page redirects to login when not logged in", async ({
    page,
  }) => {
    await expectRedirect(page, "/dashboard", "/login");
  });

  test("Login page is accessible when not logged in", async ({ page }) => {
    await expectAccessible(page, "/login");
  });

  test("Protected page is accessible when logged in", async ({ page }) => {
    await login(page, "john@example.com", "superSecurePassword123");
    await expectAccessible(page, "/dashboard");
  });

  test("Guest-only page redirects to dashboard when logged in", async ({
    page,
  }) => {
    await login(page, "john@example.com", "superSecurePassword123");
    await expectRedirect(page, "/login", "/dashboard");
  });

  test("Protected route sets no-cache headers", async ({ page }) => {
    await login(page, "john@example.com", "superSecurePassword123");
    const response = await page.goto("/dashboard");

    expect(response?.headers()["cache-control"]).toContain("no-store");
    expect(response?.headers()["pragma"]).toBe("no-cache");
    expect(response?.headers()["expires"]).toBe("0");
  });
});
