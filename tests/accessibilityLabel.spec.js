import { test, expect } from '@playwright/test';

test('Tests accessibility of buttons for screen readers', async ({ page }) => 
{
  await page.goto('/');

  //Waits for "mic" button
  const micButton = page.locator('#mic-button');
  await micButton.waitFor({ state: 'visible', timeout: 10000 });

  //Checks that the mic button has an aria label for accessibility
  await expect(micButton).toHaveAttribute('aria-label', /voice|speech/i);

  //Simulates booking request
  const input = page.getByPlaceholder(/Book/i);
  await input.fill('Book 2 tickets for Jazz Night');
  await page.keyboard.press('Enter');

  //Waits for "confirm" button
  const confirmButton = page.getByRole('button', { name: /Confirm Booking/i });
  await confirmButton.waitFor({ state: 'visible', timeout: 10000 });

  //Checks that the confirm button has an aria label for accessibility
  await expect(confirmButton).toHaveAttribute('aria-label', /confirm/i);
});
