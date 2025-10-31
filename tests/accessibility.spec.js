import { test, expect } from '@playwright/test';

test('All buttons are accessible for all users', async ({ page }) => 
{
    //Opens TigerTix page
    await page.goto('/');

    //Simulates a user pressing the "tab" key
    await page.keyboard.press('Tab');

    const focused = await page.evaluate(() => document.activeElement.tagName);

    //Makes sure that the field selected changes as expected
    expect(['BUTTON','A','INPUT']).toContain(focused);
});
