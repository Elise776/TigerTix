import { test, expect } from "@playwright/test";

/**
 * Test: Admins can create AND receive events
 *
 * Ensures:
 *  - Admins are able to create and upload events
 *  - Admins are able to retreive all events
 */
test("Can create and retreive events", async ({ request }) => {
  //Creates an event for a concert in 2026
  const newEvent = { name: "Concert", date: "2026-11-05", tickets: 50 };
  const post = await request.post("http://localhost:5001/api/admin/events", {
    data: newEvent,
  });

  //Checks if the event was created
  expect(post.ok()).toBeTruthy();

  //Checks if the event can be found
  const get = await request.get("http://localhost:6001/api/events");
  const list = await get.json();
  expect(list.some((e) => e.name === "Concert")).toBeTruthy();
});
