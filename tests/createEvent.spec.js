import { test, expect } from '@playwright/test';

test('Can create events', async ({ request }) => 
{
    //Creates an event for a CPSC Expo
    const newEvent = { name: 'CPSC Expo', date: '2025-11-05', tickets: 50 };
    const post = await request.post('http://localhost:5001/api/admin/events', { data: newEvent });

    //Checks if the event was created
    expect(post.ok()).toBeTruthy();
});
