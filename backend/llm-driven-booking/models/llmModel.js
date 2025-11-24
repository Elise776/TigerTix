const Groq = require("groq-sdk");

// Groq Client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function parseBookingRequest(message) {
  try {
    const prompt = `
You extract booking information from text.
Return JSON with: { "event": string, "quantity": number }.
If missing info, return null values.

User message: "${message}"
`;

    const response = await client.chat.completions.create({
      model: "llama3-8b-8192",   // UPDATED MODEL
      messages: [
        { role: "system", content: "You extract booking intent from user messages." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    const content = response.choices[0].message.content.trim();

    // Safe JSON parse
    let data;
    try {
      data = JSON.parse(content);
    } catch (err) {
      console.error("JSON parse error:", err);
      return null;
    }

    return data;

  } catch (err) {
    console.error("Groq API error:", err);
    return null;
  }
}

module.exports = { parseBookingRequest };
