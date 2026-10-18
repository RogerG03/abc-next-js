import { expect, test } from "@playwright/test";

test("shows the starter home page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Una base modular lista para crecer." }),
  ).toBeVisible();
});
