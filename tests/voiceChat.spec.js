import { test, expect } from "@playwright/test";

/**
 * Test: Book events through the voice chat option
 *
 * Ensures:
 *  - Voice API works
 *  - Voice API can be called to book tickets for the impaired
 */
test("Voice chat can book tickets via mock transcription", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({ email: "testuser@example.com" })
    );

    class MockRecognition {
      constructor() {}
      start() {
        this.onstart?.();
        setTimeout(() => {
          this.onresult?.({
            results: [[{ transcript: "book two tickets to cpsc Expo" }]],
          });
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

  await page.route("**/api/llm/parse", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        parsed: true,
        result: { event: "cpsc Expo", tickets: 2 },
      }),
    })
  );
  await page.route("**/api/llm/confirm", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, booking: { qty: 2 } }),
    })
  );

  await page.goto("/");

  const micButton = page.locator("#mic-button");
  await micButton.waitFor({ state: "visible", timeout: 5000 });
  await micButton.click();

  const parsedMessage = page.locator(".p-4.max-w-md", {
    hasText: "I understood: Book 2 tickets for cpsc Expo",
  });
  await parsedMessage.waitFor({ timeout: 5000 });

  const confirmBtn = page.locator('button:has-text("Confirm Booking")');
  await confirmBtn.waitFor({ timeout: 5000 });
  await confirmBtn.click();

  const successMessage = page.locator(".p-4.max-w-md", {
    hasText: 'Booking successful (qty: 2) for "cpsc Expo".',
  });
  await successMessage.waitFor({ timeout: 5000 });
  await expect(successMessage).toBeVisible();
});
