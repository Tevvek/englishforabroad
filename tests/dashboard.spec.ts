import { test, expect } from "@playwright/test";
import { login } from "@tests/utils/auth";

// test("Dashboard renders user email from Astro.locals.user", async ({
//   page,
// }) => {
//   await login(page, "john@example.com", "superSecurePassword123");

//   await page.goto("/dashboard");

//   // Look for the email rendered by the template
//   const userEmail = await page.locator("p").textContent();

//   expect(userEmail).toBe("john@example.com");
// });
