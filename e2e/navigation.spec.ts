import { test, expect } from "@playwright/test";

// A fresh visitor is assigned an anonymous session by proxy.ts and gets demo
// data seeded on first DB hit, so these tests need no login or fixtures — just
// a running Postgres. They exercise the primary navigation end to end.

test("dashboard renders the portfolio overview", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  // Stat tiles seeded from demo data.
  await expect(page.getByText("Monthly rent roll")).toBeVisible();
  await expect(page.getByText("Total properties")).toBeVisible();
  await expect(page.getByText("Occupancy rate", { exact: true })).toBeVisible();
});

test("the sidebar links reach each main section", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Properties" }).click();
  await expect(page).toHaveURL(/\/properties$/);
  await expect(page.getByRole("heading", { name: "Properties" })).toBeVisible();

  await page.getByRole("link", { name: "Tenants" }).click();
  await expect(page).toHaveURL(/\/tenants$/);
  await expect(page.getByRole("heading", { name: "Tenants" })).toBeVisible();

  await page.getByRole("link", { name: "Leases" }).click();
  await expect(page).toHaveURL(/\/leases$/);
  await expect(page.getByRole("heading", { name: "Leases" })).toBeVisible();

  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});
