import { expect, test } from "@playwright/test";
import { login } from "@tests/utils/auth";
import { expectAccessible, expectRedirect } from "@tests/utils/helpers";

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

  test("Protected API route returns 401 when not logged in", async ({
    page,
  }) => {
    const response = await page.request.post("/api/settings/change-password", {
      form: {
        "old-password": "whatever",
        "new-password": "whatever123",
        "repeat-new-password": "whatever123",
      },
    });

    expect(response.status()).toBe(401);

    const json = await response.json();
    expect(json.error).toBe("Not authenticated.");
  });

  test("Protected API route is accessible when logged in", async ({
    page,
    context,
  }) => {
    const originalPassword = "superSecurePassword123";
    const tempPassword = "temporaryPassword456";

    // Step 1: Log in with original password
    await login(page, "john@example.com", originalPassword);

    // Step 2: Change password
    const response = await page.request.post("/api/settings/change-password", {
      form: {
        "old-password": originalPassword,
        "new-password": tempPassword,
        "repeat-new-password": tempPassword,
      },
    });

    const json = await response.json();
    expect(response.status()).toBe(200);
    expect(json.success).toBe("Password changed.");

    // Step 3: Logout and confirm login with new password
    await page.goto("/api/logout");
    await login(page, "john@example.com", tempPassword);

    // Step 4: Revert to original password
    const resetResponse = await page.request.post(
      "/api/settings/change-password",
      {
        form: {
          "old-password": tempPassword,
          "new-password": originalPassword,
          "repeat-new-password": originalPassword,
        },
      }
    );

    const resetJson = await resetResponse.json();
    expect(resetResponse.status()).toBe(200);
    expect(resetJson.success).toBe("Password changed.");
  });
});
