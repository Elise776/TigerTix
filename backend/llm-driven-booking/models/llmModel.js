const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

function parseBooking(userMessage) {
  if (!userMessage) return null;

  const text = userMessage.toLowerCase().trim();

  // 1. Extract ticket quantity (supports: 2, "2 tickets", "book 2", "need 2")
  const quantityMatch = text.match(/(\d+)(?=\D|$)/);
  const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : null;

  // 2. Extract event name (everything after "for" or "to")
  const eventMatch = text.match(/(?:for|to)\s+(.+)/i);
  let event = eventMatch ? eventMatch[1].trim() : null;

  if (event) {
    // Remove punctuation
    event = event.replace(/["'.,!?]/g, "");

    // Remove filler words
    event = event.replace(/\b(please|thanks|thank you)\b/gi, "").trim();

    // Fix doubled spaces caused by cleanup
    event = event.replace(/\s+/g, " ");
  }

  if (!quantity || !event) {
    return null;
  }

  return { event, quantity };
}

module.exports = { parseBooking };
