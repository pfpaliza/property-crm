import { test, expect } from "@playwright/test";

test.describe("properties page", () => {
  test("shows the portfolio table and KPIs", async ({ page }) => {
    await page.goto("/properties");

    await expect(page.getByRole("heading", { name: "Properties" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "New property" }),
    ).toBeVisible();
    await expect(page.getByText("Monthly rent roll")).toBeVisible();
    // The demo data seeds properties, so the table has at least one row link.
    await expect(page.getByRole("cell").first()).toBeVisible();
  });

  test("the status filter drives the ?status= query param", async ({ page }) => {
    await page.goto("/properties");

    // Default view ("Active") keeps the URL clean — no status param.
    await expect(page).toHaveURL(/\/properties$/);

    const filter = page.getByRole("group", { name: "Filter by status" });
    await filter.getByRole("button", { name: "Sold" }).click();
    await expect(page).toHaveURL(/[?&]status=sold/);

    await filter.getByRole("button", { name: "All" }).click();
    await expect(page).toHaveURL(/[?&]status=all/);

    // Returning to the default drops the param again.
    await filter.getByRole("button", { name: "Active" }).click();
    await expect(page).toHaveURL(/\/properties$/);
  });
});
