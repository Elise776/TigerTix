import { test, expect } from "@playwright/test";

/**
 * Test: Missing field in event creation causes error
 *
 * Ensures:
 *  - createEvent can not be called if the fields are unfinished
 */
test("createEvent fails if name is missing", async ({ request }) => {
  const res = await request.post("http://localhost:5001/api/admin/events", {
    data: { date: "2030-01-01", tickets: 50 },
  });
  expect(res.ok()).toBeFalsy();
  const data = await res.json();
  expect(data.error).toBeDefined();
});
