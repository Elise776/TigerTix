import { test, expect } from "@playwright/test";

/**
 * Test: The voice button can be accessed easily
 *
 * Ensures:
 *  - Mic button can be accessed
 */
test("Voice mic button is accessible", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({ email: "testuser@example.com" })
    );
  });

  await page.reload();

  const micButton = page.locator("#mic-button");
  await micButton.waitFor({ state: "visible", timeout: 10000 });

  await expect(micButton).toHaveAttribute("aria-label", /voice|speech/i);
});
