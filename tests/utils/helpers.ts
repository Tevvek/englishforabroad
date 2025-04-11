import { expect, type Page } from "@playwright/test";

/**
 * Assert that visiting `from` causes a 302 redirect to `to`
 */
export async function expectRedirect(
  page: Page,
  from: string,
  to: string
): Promise<void> {
  const [redirectResponse] = await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes(from) && res.status() === 302
    ),
    page.goto(from),
  ]);

  expect(redirectResponse.status()).toBe(302);
  expect(page.url()).toContain(to);
}

/**
 * Assert that a route returns 200 and you're on the expected page
 */
export async function expectAccessible(
  page: Page,
  path: string
): Promise<void> {
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  expect(page.url()).toContain(path);
}
