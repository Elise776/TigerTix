const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const fetch =
  globalThis.fetch ||
  ((...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)));

/**
 * Parses a natural-language booking request into structured JSON.
 */
async function parseBooking(userInput) {
  if (!userInput) throw new Error("Invalid input text");

  const prompt = `
    Extract the event name and the number of tickets from this booking request.
    User request: "${userInput}"

    Respond with ONLY JSON in this exact format:
    {"event": "event name", "tickets": number}
  `;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // IMPORTANT: user must add GROQ_API_KEY in render
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-8b-8192", // Free Groq model
      messages: [
        { role: "system", content: "You extract booking details and return ONLY JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} – ${text}`);
  }

  const data = await res.json();

  // Groq returns choices[0].message.content
  const generatedText =
    data.choices?.[0]?.message?.content?.trim() || "";

  // Extract JSON
  const jsonMatch = generatedText.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) throw new Error("Could not find JSON in response");

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error("Invalid JSON received from LLM");
  }

  if (!parsed.event || parsed.tickets === undefined) {
    throw new Error("Missing fields in parsed JSON");
  }

  return {
    event: String(parsed.event).trim(),
    tickets: parseInt(parsed.tickets, 10),
  };
}

module.exports = { parseBooking };
