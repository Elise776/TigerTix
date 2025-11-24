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
  // e.g. “confirm booking 2 for cpsc expo”
  if (!event) {
    eventMatch = text.match(/booking\s+\d*\s*(?:ticket|tickets)?\s*for\s+(.+)/i);
    event = eventMatch ? eventMatch[1].trim() : null;
  }

  if (event) {
    event = event.replace(/["'.,!?]/g, "");
    event = event.replace(/\b(please|thanks|thank you|confirm|booking)\b/gi, "");
    event = event.replace(/\s+/g, " ").trim();
  }

  // Still missing? Abort safely.
  if (!quantity || !event) {
    return null;
  }

  return { event, quantity };
}

module.exports = { parseBooking };
