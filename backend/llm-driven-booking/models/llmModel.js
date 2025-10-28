const OLLAMA_URL = "http://localhost:11434/api/generate";

// Node 18+ has fetch globally; fallback for older versions
const fetch =
  globalThis.fetch ||
  ((...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)));

/**
 * Parses a natural-language booking request into structured JSON.
 * Example:
 *   Input: "Book 2 tickets for Jazz Night"
 *   Output: { event: "Jazz Night", tickets: 2 }
 */
async function parseBooking(userInput) {
  if (!userInput) throw new Error("Invalid input text");

  const prompt = `
    Extract the event name and number of tickets from this booking request.
    User request: "${userInput}"
    Respond with ONLY valid JSON in this format:
    {"event": "event name", "tickets": number}
  `;

  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false,
      options: { temperature: 0.1, num_predict: 150 },
    }),
  });

  if (!res.ok) throw new Error(`Ollama API error: ${res.status}`);

  const data = await res.json();
  const generatedText = data.response || "";

  // Extract JSON object from response
  const jsonMatch = generatedText.match(/\{[^}]+\}/);
  if (!jsonMatch) throw new Error("Could not find JSON in response");

  const parsed = JSON.parse(jsonMatch[0]);

  if (!parsed.event || parsed.tickets === undefined)
    throw new Error("Missing fields in parsed JSON");

  return {
    event: String(parsed.event).trim(),
    tickets: parseInt(parsed.tickets, 10),
  };
}

module.exports = { parseBooking };
