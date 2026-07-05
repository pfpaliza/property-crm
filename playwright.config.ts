import { defineConfig, devices } from "@playwright/test";

// End-to-end tests drive the real app in a browser. They need a running
// Postgres (DATABASE_URL in .env.local) — the app assigns each visitor an
// anonymous session and lazily seeds demo data, so no login or fixtures are
// required. The webServer block below boots `next dev` for the run.
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
