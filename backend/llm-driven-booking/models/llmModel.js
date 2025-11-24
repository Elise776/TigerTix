const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const fetch =
  globalThis.fetch ||
  ((...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)));



const NUMBER_WORDS = {
  "one": 1,
  "two": 2,
  "three": 3,
  "four": 4,
  "five": 5,
  "six": 6,
  "seven": 7,
  "eight": 8,
  "nine": 9,
  "ten": 10,
  "a": 1,
  "an": 1
};

function parseBooking(userMessage) {
  if (!userMessage) return null;

  const text = userMessage.toLowerCase().trim();

  // 1. Extract digit-based quantity
  let quantityMatch = text.match(/(\d+)\s*(?:ticket|tickets)?/);
  let quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : null;

  // 2. Extract written number quantity ("two tickets", "one ticket", "a ticket")
  if (!quantity) {
    const words = Object.keys(NUMBER_WORDS).join("|");
    const wordMatch = text.match(new RegExp(`\\b(${words})\\b\\s*(?:ticket|tickets)?`));
    if (wordMatch) {
      quantity = NUMBER_WORDS[wordMatch[1]];
    }
  }

  // 3. Default to 1 ticket if user did not specify quantity
  if (!quantity) {
    if (text.includes("ticket")) quantity = 1;
  }

  // 4. Extract event name after “for” or “to”
  let eventMatch = text.match(/(?:for|to)\s+(.+)/i);
  let event = eventMatch ? eventMatch[1].trim() : null;

  // fallback if user confirms a message
  if (!event) {
    eventMatch = text.match(/booking\s+\d*\s*(?:ticket|tickets)?\s*for\s+(.+)/i);
    event = eventMatch ? eventMatch[1].trim() : null;
  }

  if (event) {
    event = event.replace(/["'.,!?]/g, "");
    event = event.replace(/\b(please|thanks|thank you|confirm|booking)\b/gi, "");
    event = event.replace(/\s+/g, " ").trim();
  }

  // Still missing? Abort safely
  if (!quantity || !event) {
    return null;
  }

  return { event, quantity };
}

module.exports = { parseBooking };
