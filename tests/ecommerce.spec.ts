// tests/ecommerce.spec.ts
import { test, expect, Page } from "@playwright/test";

async function acceptCookies(page: Page) {
  const acceptCookiesButton = page.getByRole("button", { name: "Consent" });
  if (await acceptCookiesButton.isVisible()) {
    await acceptCookiesButton.click();
  }
}

test.describe("Ecommerce's product page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://automationexercise.com/");
    await acceptCookies(page);
  });

  test("should go to product page", async ({ page }) => {
    await page.getByRole("link", { name: " Products" }).click();
    await expect(page).toHaveURL("https://automationexercise.com/products");
    await expect(page).toHaveTitle("Automation Exercise - All Products");
  });
});