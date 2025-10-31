import { test, expect } from '@playwright/test';

test('Admin service can create and retrieve events', async ({ request }) => {
  const newEvent = { name: 'Rock Show', date: '2025-12-05', tickets: 50 };
  const post = await request.post('http://localhost:5001/api/events', { data: newEvent });
  expect(post.ok()).toBeTruthy();

  const get = await request.get('http://localhost:6001/api/events');
  const list = await get.json();
  expect(list.some(e => e.name === 'Rock Show')).toBeTruthy();
});
