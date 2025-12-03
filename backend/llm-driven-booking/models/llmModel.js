const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const fetch =
  globalThis.fetch ||
  ((...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)));

const numberWords = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

function parseBooking(userText) {
  const message = userText.toLowerCase().trim();

  let tickets = null;

  const digitMatch = message.match(/(\d+)\s*(tickets?|tix)?/);
  if (digitMatch) {
    tickets = parseInt(digitMatch[1]);
  } else {
    const wordMatch = message.match(
      new RegExp(`\\b(${Object.keys(numberWords).join("|")})\\b`)
    );
    if (wordMatch) {
      tickets = numberWords[wordMatch[1]];
    }
  }

  const eventMatch = message.match(/for\s+(.*?)(?:\s*$|\s*\.)/);
  let event = eventMatch ? eventMatch[1].trim() : null;

  if (!tickets || !event) {
    return { success: false, error: "Could not parse booking request" };
  }

  return { success: true, event, tickets };
}

module.exports = { parseBooking };
