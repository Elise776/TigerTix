import { test, expect } from '@playwright/test';

test('mic button and confirm buttons have ARIA labels', async ({ page }) => {
  await page.goto('/');

  // Wait for mic button
  const micButton = page.locator('#mic-button');
  await micButton.waitFor({ state: 'visible', timeout: 10000 });
  await expect(micButton).toHaveAttribute('aria-label', /voice|speech/i);

  // Trigger LLM flow to render Confirm Booking
  const input = page.getByPlaceholder(/Book/i);
  await input.fill('Book 1 ticket for Jazz Night');
  await page.keyboard.press('Enter');

  // Wait for Confirm Booking button to appear
  const confirmButton = page.getByRole('button', { name: /Confirm Booking/i });
  await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
  await expect(confirmButton).toHaveAttribute('aria-label', /confirm/i);
});
