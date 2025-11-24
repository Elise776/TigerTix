const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function parseBookingRequest(userInput) {
  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",  // free Groq model
        messages: [
          {
            role: "user",
            content: `
            Extract the event name and number of tickets from the booking request.
            USER INPUT: "${userInput}"

            Return ONLY valid JSON like this:
            {"event": "Event Name", "tickets": 2}
            `
          }
        ],
        temperature: 0
      })
    });

    if (!response.ok) {
      throw new Error("Groq API request failed");
    }

    const data = await response.json();

    // Extract the assistant's response
    const resultText = data.choices[0].message.content.trim();

    // Attempt to parse JSON
    try {
      return JSON.parse(resultText);
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
      return null;
    }

  } catch (err) {
    console.error("LLM parsing error:", err.message);
    return null;
  }
}

module.exports = { parseBookingRequest };
