import { test, expect } from "@playwright/test";

test("User can book tickets for an event", async ({ request }) => {
  const createRes = await request.post(
    "http://localhost:5001/api/admin/events",
    {
      data: {
        name: "booking playwright",
        date: "2025-12-01",
        tickets: 50,
      },
    }
  );

  expect(createRes.ok()).toBeTruthy();

  const event = await createRes.json();
  const eventId = event.id;
  expect(eventId).toBeTruthy();

  const bookingRes = await request.post(
    `http://localhost:6001/api/events/${eventId}/purchase`,
    {
      data: { qty: 2 },
    }
  );

  expect(bookingRes.ok()).toBeTruthy();

  const result = await bookingRes.json();

  expect(result.success).toBeTruthy();

  // OPTIONAL checks depending on your real controller:
  if ("remainingTickets" in result) {
    expect(result.remainingTickets).toBeGreaterThanOrEqual(0);
  }
});
