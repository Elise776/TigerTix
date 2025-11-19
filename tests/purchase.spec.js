import { test, expect } from "@playwright/test";

const TEST_EVENT_ID = 128; // Use an existing event with plenty of tickets

test("purchaseTicket decreases tickets without failing", async ({
  request,
}) => {
  const eventsRes1 = await request.get("http://localhost:6001/api/events");
  const events1 = await eventsRes1.json();
  const event1 = events1.find((e) => e.id === TEST_EVENT_ID);
  const initialTickets = event1.tickets;

  const purchaseRes = await request.post(
    `http://localhost:6001/api/events/${TEST_EVENT_ID}/purchase`,
    { data: { qty: 1 } }
  );
  const purchaseData = await purchaseRes.json();

  expect(purchaseData.success).toBeTruthy();

  const eventsRes2 = await request.get("http://localhost:6001/api/events");
  const events2 = await eventsRes2.json();
  const event2 = events2.find((e) => e.id === TEST_EVENT_ID);

  expect(event2.tickets).toBe(initialTickets - 1);
});
