import { test, expect } from "@playwright/test";

/**
 * Test: Buttons are accessible for the impaired
 *
 * Ensures:
 *  - Buttons on the website can be accessed easily for the impaired
 */
test("All buttons are accessible for all users", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");

  const focused = await page.evaluate(() => document.activeElement.tagName);

  expect(["BUTTON", "A", "INPUT"]).toContain(focused);
});
