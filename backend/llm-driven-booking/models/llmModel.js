const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const fetch =
  globalThis.fetch ||
  ((...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)));



function parseBooking(userText) 
{
  const message = userText.toLowerCase();

  //Extract number of tickets
  let ticketsMatch = message.match(/(\d+)\s*(ticket|tickets|tix)?/);
  let tickets = ticketsMatch ? parseInt(ticketsMatch[1]) : null;

  //Extract event
  let eventMatch = message.match(/for\s+(.+)/i);
  let event = eventMatch ? eventMatch[1].trim() : null;

  if (!tickets || !event) 
  {
    return { success: false, error: "Could not parse booking request" };
  }

  return {success: true,event,tickets};
}

module.exports = { parseBooking };
