import { test, expect } from "@playwright/test";

test("Landing page loads without redirect", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  // Optional: check text or elements to be sure
  await expect(page).toHaveTitle("English for Abroad - Online English Lessons"); // update if needed
  await expect(page.locator("body")).toContainText(
    "Launch your English Journey"
  ); // adjust to your actual landing content
});
