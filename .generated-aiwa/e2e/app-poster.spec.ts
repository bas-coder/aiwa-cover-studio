import { expect, test } from "./toolcraft-product-test";

test("browser: a brief generates an editable poster", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Every conversation in one shared inbox" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Generate" }).click();
  await expect(page.locator("[data-poster-layout='editorial']")).toBeVisible();
});

test("browser: poster export uses the generated frame", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Export PNG" })).toBeVisible();
});

test("browser: infinity keeps the poster frame", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-poster-layout='editorial']")).toBeVisible();
});
