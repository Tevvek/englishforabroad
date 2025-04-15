import { test, expect } from "@playwright/test";
import { login } from "@tests/utils/auth";

const email = "john@example.com";
const originalPassword = "superSecurePassword123";
const newPassword = "newSecurePassword456";

test.describe("Change Password Flow", () => {
  test("User can change password and log in with new one", async ({ page }) => {
    await login(page, email, originalPassword);
    await page.goto("/dashboard/settings");

    await page.fill('input[name="old-password"]', originalPassword);
    await page.fill('input[name="new-password"]', newPassword);
    await page.fill('input[name="repeat-new-password"]', newPassword); // ✅ new field

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/settings/change-password") &&
          res.status() === 200
      ),
      page.click('button[type="submit"]'),
    ]);

    const data = await response.json();
    expect(data.success).toBe("Password changed.");

    await page.goto("/api/logout");

    await login(page, email, newPassword);
    expect(page.url()).toContain("/dashboard");

    // Restore original password
    await page.goto("/dashboard/settings");
    await page.fill('input[name="old-password"]', newPassword);
    await page.fill('input[name="new-password"]', originalPassword);
    await page.fill('input[name="repeat-new-password"]', originalPassword);

    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/settings/change-password") &&
          res.status() === 200
      ),
      page.click('button[type="submit"]'),
    ]);
  });

  test("Shows error if old password is wrong", async ({ page }) => {
    await login(page, email, originalPassword);
    await page.goto("/dashboard/settings");

    await page.fill('input[name="old-password"]', "wrongPassword");
    await page.fill('input[name="new-password"]', "somethingNew123");
    await page.fill('input[name="repeat-new-password"]', "somethingNew123");

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/settings/change-password") &&
          res.status() === 500
      ),
      page.click('button[type="submit"]'),
    ]);

    const body = await response.json();
    expect(body.error).toBe("Password change failed.");
  });

  test("Shows error for too short new password", async ({ page }) => {
    await login(page, email, originalPassword);
    await page.goto("/dashboard/settings");

    await page.fill('input[name="old-password"]', originalPassword);
    await page.fill('input[name="new-password"]', "123");
    await page.fill('input[name="repeat-new-password"]', "123");

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/settings/change-password") &&
          res.status() === 400
      ),
      page.click('button[type="submit"]'),
    ]);

    const body = await response.json();
    expect(body.error).toBe("New password must be at least 6 characters.");
  });

  test("Shows error if repeat-new-password does not match", async ({
    page,
  }) => {
    await login(page, email, originalPassword);
    await page.goto("/dashboard/settings");

    await page.fill('input[name="old-password"]', originalPassword);
    await page.fill('input[name="new-password"]', "somethingNew123");
    await page.fill('input[name="repeat-new-password"]', "differentPassword");

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/settings/change-password") &&
          res.status() === 400
      ),
      page.click('button[type="submit"]'),
    ]);

    const body = await response.json();
    expect(body.error).toBe("Passwords do not match.");
  });
});
