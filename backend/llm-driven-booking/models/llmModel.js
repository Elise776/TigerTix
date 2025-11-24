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
  const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : null;

  // 2. Extract event name after “for” or “to”
  let eventMatch = text.match(/(?:for|to)\s+(.+)/i);
  let event = eventMatch ? eventMatch[1].trim() : null;

  // If event not detected (confirmation messages), fall back:
  // FIX: Relaxed regex to handle cases like "booking undefined for..." 
  // Matches "booking", then any non-greedy text (.*?), then "for", then the event.
  if (!event) {
    eventMatch = text.match(/booking\s+(?:.*?)\s+for\s+(.+)/i);
    event = eventMatch ? eventMatch[1].trim() : null;
  }

  if (event) {
    event = event.replace(/["'.,!?]/g, "");
    event = event.replace(/\b(please|thanks|thank you|confirm|booking)\b/gi, "");
    event = event.replace(/\s+/g, " ").trim();
  }

  // FIX: Only abort if the event is missing. 
  // Previously, this failed if quantity was null (e.g., in the "undefined" error case).
  // Now it returns the event even if quantity is missing, preventing the "Invalid parse payload" crash.
  if (!event) {
    return null;
  }

  return { event, quantity };
}

module.exports = { parseBooking };