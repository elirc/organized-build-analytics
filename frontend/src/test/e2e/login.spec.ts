import { expect, test } from "@playwright/test";

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /sign in to the control room/i })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});
