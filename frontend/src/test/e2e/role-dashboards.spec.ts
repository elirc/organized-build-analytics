import { expect, test } from "@playwright/test";

test("login form exposes seeded defaults", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText(/use a seeded role account after running the backend seed/i)).toBeVisible();
});
