const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const fetch =
  globalThis.fetch ||
  ((...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)));

function parseBooking(userMessage) {
  if (!userMessage) return null;

  const text = userMessage.toLowerCase().trim();

  // 1. Extract ticket quantity anywhere in the message
  const quantityMatch = text.match(/(\d+)\s*(?:ticket|tickets)?/);
  // FIX: If no number found (e.g. in confirmation "undefined"), default to 1 to prevent crash
  // provided we find a valid event later.
  let quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : null;

  // 2. Extract event name after “for” or “to”
  let eventMatch = text.match(/(?:for|to)\s+(.+)/i);
  let event = eventMatch ? eventMatch[1].trim() : null;

  // If event not detected (confirmation messages), fall back:
  // FIX: Relaxed regex to handle "booking undefined for..." or other variations
  if (!event) {
    eventMatch = text.match(/booking\s+(?:.*?)\s+for\s+(.+)/i);
    event = eventMatch ? eventMatch[1].trim() : null;
  }

  if (event) {
    event = event.replace(/["'.,!?]/g, "");
    event = event.replace(/\b(please|thanks|thank you|confirm|booking)\b/gi, "");
    event = event.replace(/\s+/g, " ").trim();
  }

  // Safety Check
  if (!event) {
    return null;
  }

  // FIX: If we have an event but quantity is still null (because the user input
  // was "confirm booking undefined..."), default quantity to 1.
  // This ensures the return object is valid and prevents "Invalid parse payload".
  if (quantity === null) {
    quantity = 1;
  }

  return { event, quantity };
}

module.exports = { parseBooking };