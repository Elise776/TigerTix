import { test, expect } from "@playwright/test";

test("Voice mic button is accessible", async ({ page }) => {
  // 1️⃣ Go to the page
  await page.goto("/");

  // 2️⃣ Log in programmatically so mic button appears
  await page.evaluate(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({ email: "testuser@example.com" })
    );
  });

  // 3️⃣ Reload the page so App picks up the user from localStorage
  await page.reload();

  // 4️⃣ Wait for mic button to appear
  const micButton = page.locator("#mic-button");
  await micButton.waitFor({ state: "visible", timeout: 10000 });

  // 5️⃣ Check accessibility
  await expect(micButton).toHaveAttribute("aria-label", /voice|speech/i);
});
