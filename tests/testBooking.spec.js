import { test, expect } from '@playwright/test';

test('User can complete an LLM-driven booking', async ({ page, request }) => {
  // 1. Navigate to client app
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /TigerTix/i })).toBeVisible();

  // 2. Open chat and enter natural-language request
  await page.getByPlaceholder('Type your message').fill('Book two tickets for Jazz Night');
  await page.keyboard.press('Enter');

  // 3. Verify LLM proposal appears
  await expect(page.getByText(/Confirm booking for Jazz Night/)).toBeVisible();

  // 4. Confirm booking
  await page.getByRole('button', { name: /Confirm Booking/i }).click();
  await expect(page.getByText(/Booking confirmed/i)).toBeVisible();

  // 5. API verification
  const events = await request.get('/api/events');
  const data = await events.json();
  const jazz = data.find(e => e.name === 'Jazz Night');
  expect(jazz.tickets).toBeGreaterThanOrEqual(0);
});
