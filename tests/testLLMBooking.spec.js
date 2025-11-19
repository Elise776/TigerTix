import { test, expect } from "@playwright/test";

test("Booking using the LLM is successful", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({ email: "testuser@example.com" })
    );
  });

  await page.reload();

  await expect(
    page.getByRole("heading", { name: /Clemson Campus Events/i })
  ).toBeVisible();

  await page.route("**/api/llm/parse", async (route) => {
    await route.fulfill({
      json: { parsed: true, result: { event: "festival", tickets: 2 } },
    });
  });

  await page.route("**/api/llm/confirm", async (route) => {
    await route.fulfill({
      json: { success: true, booking: { event: "festival", qty: 2 } },
    });
  });

  const input = page.getByPlaceholder(/Book/i);
  await input.fill("Book 2 tickets for festival");
  await page.keyboard.press("Enter");

  await expect(
    page
      .getByText(/I understood: Book 2 ticket\(s\) for "festival"\. Confirm\?/i)
      .first()
  ).toBeVisible({ timeout: 10000 });

  await page.getByRole("button", { name: /Confirm Booking/i }).click();

  await expect(
    page.getByText(/Booking successful.*festival/i, { exact: false }).first()
  ).toBeVisible({ timeout: 15000 });
});
