import { test, expect } from '@playwright/test';

test('Booking using the LLM is sucessful', async ({ page }) => 
{
    //Goes to the TigerTix page
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Clemson Campus Events/i })).toBeVisible();

    //Checks if llm parses the request to book 2 tickets for a festibal
    await page.route('**/api/llm/parse', async route => 
    {
        await route.fulfill({json: { parsed: true, result: { event: 'festival', tickets: 2 } },});
    });

    //Checks if the llm confirms request to book 2 festival tickets
    await page.route('**/api/llm/confirm', async route => 
    {
        await route.fulfill({json: { success: true, booking: { event: 'festival', tickets: 2 } },});
    });

    //Simulated "user" can request to book tickets
    const input = page.getByPlaceholder(/Book/i);
    await input.fill('Book 2 tickets for festival');
    //Simulates pressing "enter" key
    await page.keyboard.press('Enter');

    //Checks that the llm confirms booking
    await expect(page.getByText(/I understood: Book 2 ticket\(s\) for "festival"\. Confirm\?/i).first()).toBeVisible({ timeout: 10000 });

    //Simulates user hitting "confirm booking" button
    await page.getByRole('button', { name: /Confirm Booking/i }).click();

    await page.waitForTimeout(500);

    //Checks if llm sucessfully books ticket
    await expect(page.getByText(/Booking successful.*["']?Festival["']?/i, { exact: false }).first()).toBeVisible({ timeout: 15000 });
});
