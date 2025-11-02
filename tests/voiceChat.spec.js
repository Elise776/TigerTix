import { test, expect } from "@playwright/test";

test("Voice chat can book tickets via mock transcription", async ({ page }) => {
  await page.route("http://localhost:7001/api/llm/parse", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        parsed: true,
        result: { event: "cpsc Expo", tickets: 2 },
      }),
    })
  );

  await page.route("http://localhost:7001/api/llm/confirm", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, booking: { qty: 2 } }),
    })
  );

  await page.addInitScript(() => {
    class MockRecognition {
      constructor() {}
      start() {
        this.onstart?.();
        // Simulate user saying the booking phrase
        setTimeout(() => {
          this.onresult?.({
            results: [[{ transcript: "book two tickets to cpsc Expo" }]],
          });

          // Simulate confirmation phrase after a short delay
          setTimeout(() => {
            this.onresult?.({
              results: [[{ transcript: "confirm" }]],
            });
            this.onend?.();
          }, 100);
        }, 100);
      }
      stop() {}
      abort() {}
      set onstart(fn) {
        this._onstart = fn;
      }
      get onstart() {
        return this._onstart;
      }
      set onresult(fn) {
        this._onresult = fn;
      }
      get onresult() {
        return this._onresult;
      }
      set onend(fn) {
        this._onend = fn;
      }
      get onend() {
        return this._onend;
      }
    }

    window.SpeechRecognition = MockRecognition;
    window.webkitSpeechRecognition = MockRecognition;
  });

  await page.goto("/");

  const micButton = page.locator('button:has-text("Speech to text")').first();
  await micButton.click();

  const parsedMessage = page
    .locator(".p-4.max-w-md", {
      hasText: "I understood: Book 2 tickets for cpsc Expo",
    })
    .first();
  await parsedMessage.waitFor({ timeout: 5000 });

  const confirmBtn = page.locator('button:has-text("Confirm Booking")').first();
  await confirmBtn.waitFor({ timeout: 5000 });
  await confirmBtn.click();

  const successMessage = page
    .locator(".p-4.max-w-md", {
      hasText: 'Booking successful (qty: 2) for "cpsc Expo".',
    })
    .first();
  await successMessage.waitFor({ timeout: 5000 });

  await expect(successMessage).toBeVisible();
});
