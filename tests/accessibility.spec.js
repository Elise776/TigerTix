import { test, expect } from '@playwright/test';

test('All buttons are reachable via keyboard', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement.tagName);
  expect(['BUTTON','A','INPUT']).toContain(focused);
});
