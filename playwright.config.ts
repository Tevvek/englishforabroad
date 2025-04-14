import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: "http://localhost:4321", // or your Astro dev URL
    browserName: "chromium",
    trace: "on-first-retry",
    headless: true,
  },
  projects: [
    {
      name: "Desktop Chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  globalTeardown: "./tests/global-teardown.ts",
});
