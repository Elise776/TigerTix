const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

function parseBooking(userMessage) {
  if (!userMessage) return null;

  const text = userMessage.toLowerCase().trim();

  // 1. Extract number of tickets
  const numberMatch = text.match(/(\d+)\s*(tickets?|tix)?/);
  const quantity = numberMatch ? parseInt(numberMatch[1], 10) : null;

  // 2. Extract event name (text after "for" or "to")
  const eventMatch = text.match(/(?:for|to)\s+(.+)/i);
  let event = eventMatch ? eventMatch[1].trim() : null;

  // Clean up event name: remove trailing words like "please"
  if (event) {
    event = event.replace(/[^a-z0-9\s]/gi, "").trim();
  }

  // If missing info → return null
  if (!quantity || !event) {
    return null;
  }

  return {
    event,
    quantity
  };
}

module.exports = { parseBooking };


module.exports = { parseBooking };
