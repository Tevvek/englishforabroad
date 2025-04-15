import { test, expect } from "@playwright/test";

test.describe("Login form validation (reward early, punish late)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("1️⃣ Tab through input without typing does not show error", async ({
    page,
  }) => {
    await page.locator('input[name="identifier"]').focus();
    await page.keyboard.press("Tab"); // blur without typing
    const error = await page
      .locator("[data-testid='identifier-error']")
      .isVisible();
    expect(error).toBe(false);
  });

  test("2️⃣ Typing a valid email shows no error", async ({ page }) => {
    await page.fill('input[name="identifier"]', "user@example.com");
    const error = await page
      .locator("[data-testid='identifier-error']")
      .isVisible();
    expect(error).toBe(false);
  });

  test("3️⃣ Typing an invalid email and blurring shows an error", async ({
    page,
  }) => {
    await page.fill('input[name="identifier"]', "not-an-email");
    await page.locator('input[name="identifier"]').blur();
    const error = await page.locator("[data-testid='identifier-error']");
    await expect(error).toBeVisible();
    await expect(error).toHaveText("Invalid email address.");
  });

  test("4️⃣ Invalid → blur → fix input hides the error", async ({ page }) => {
    await page.fill('input[name="identifier"]', "bad-email");
    await page.locator('input[name="identifier"]').blur();
    await page.fill('input[name="identifier"]', "good@example.com");
    const error = await page
      .locator("[data-testid='identifier-error']")
      .isVisible();
    expect(error).toBe(false);
  });

  test("5️⃣ Blur → type → blur again triggers error (punish late)", async ({
    page,
  }) => {
    await page.locator('input[name="identifier"]').focus();
    await page.locator('input[name="identifier"]').blur(); // no error yet
    await page.fill('input[name="identifier"]', "invalid");
    await page.locator('input[name="identifier"]').blur();
    const error = await page
      .locator("[data-testid='identifier-error']")
      .isVisible();
    expect(error).toBe(true);
  });

  test("6️⃣ Type something, then delete it and blur shows error", async ({
    page,
  }) => {
    const input = page.locator('input[name="identifier"]');
    await input.fill("some@email.com");
    await input.fill(""); // delete
    await input.blur();
    const error = await page
      .locator("[data-testid='identifier-error']")
      .isVisible();
    expect(error).toBe(true);
  });
});
