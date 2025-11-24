const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const fetch =
  globalThis.fetch ||
  ((...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)));



// Map written numbers to digits
const NUMBER_WORDS = {
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
  a: 1,
  an: 1
};

function parseBooking(userMessage) {
  if (!userMessage) return null;

  const text = userMessage.toLowerCase().trim();

  // -----------------------------
  // 1) Find ticket quantity
  // -----------------------------

  let tickets = null;

  // a) A digit: "book 2 tickets for concert"
  const digitMatch = text.match(/(\d+)\s*(?:ticket|tickets)?/);
  if (digitMatch) {
    tickets = parseInt(digitMatch[1], 10);
  }

  // b) A word number: "book two tickets", "book a ticket"
  if (!tickets) {
    const words = Object.keys(NUMBER_WORDS).join("|");
    const wordRegex = new RegExp(`\\b(${words})\\b\\s*(?:ticket|tickets)?`);
    const wordMatch = text.match(wordRegex);
    if (wordMatch) {
      tickets = NUMBER_WORDS[wordMatch[1]];
    }
  }

  // c) No number, but "ticket(s)" mentioned → assume 1
  if (!tickets && text.includes("ticket")) {
    tickets = 1;
  }

  // -----------------------------
  // 2) Find event name
  // -----------------------------

  let event = null;

  // a) After "for" or "to": "book 2 tickets for concert"
  let eventMatch = text.match(/(?:for|to)\s+(.+)/i);
  if (eventMatch) {
    event = eventMatch[1].trim();
  }

  // b) Confirmation style: "confirm booking 2 tickets for concert"
  if (!event) {
    eventMatch = text.match(/booking\s+\d*\s*(?:ticket|tickets)?\s*for\s+(.+)/i);
    if (eventMatch) {
      event = eventMatch[1].trim();
    }
  }

  if (event) {
    // Clean up trailing punctuation/extra words
    event = event.replace(/["'.,!?]/g, "");
    event = event.replace(
      /\b(please|thanks|thank you|confirm|booking)\b/gi,
      ""
    );
    event = event.replace(/\s+/g, " ").trim();
  }

  // -----------------------------
  // 3) Validate & normalize
  // -----------------------------

  if (!event || !tickets || isNaN(tickets) || tickets <= 0) {
    return null;
  }

  // IMPORTANT: expose the same values under multiple names
  return {
    // ticket count (many aliases)
    tickets,                   // <--- most likely what your UI uses
    numTickets: tickets,       // <--- common backend name
    quantity: tickets,         // <--- if old code expects "quantity"

    // event name (multiple aliases)
    event,                     // <--- generic
    eventName: event           // <--- if controller expects "eventName"
  };
}

module.exports = { parseBooking };
