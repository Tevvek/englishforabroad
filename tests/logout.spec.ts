import { expect, test } from "@playwright/test";
import { getTokenCookie, login } from "@tests/utils/auth";
import { expectRedirect } from "@tests/utils/helpers";

test.describe("Logout", () => {
  test("Logs the user out and redirects to /login", async ({ page }) => {
    await login(page, "john@example.com", "superSecurePassword123");

    await expectRedirect(page, "/api/logout", "/login");
  });

  test("Removes the JWT cookie after logout", async ({ page, context }) => {
    await login(page, "john@example.com", "superSecurePassword123");

    const beforeLogout = await getTokenCookie(context);
    expect(beforeLogout).toBeTruthy();

    await page.goto("/api/logout");

    const afterLogout = await getTokenCookie(context);
    expect(afterLogout).toBeUndefined();
  });

  test("User cannot access protected route after logout", async ({ page }) => {
    await login(page, "john@example.com", "superSecurePassword123");

    await page.goto("/api/logout");

    await expectRedirect(page, "/dashboard", "/login");
  });
});
