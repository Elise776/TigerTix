const { parseBooking } = require("../models/llmModel");
async function parseBookingRequest(req, res) {
  const { text } = req.body;
  if (!text)
    return res
      .status(400)
      .json({ parsed: false, message: "Missing input text" });

  try {
    const parsed = await parseBooking(text);

    if (!parsed.success) {
      return res.status(400).json({ parsed: false, message: parsed.error });
    }

    res.json({
      parsed: true,
      result: {
        event: parsed.event,
        tickets: parsed.tickets,
      },
    });
  } catch (err) {
    console.error("LLM parsing error:", err.message);
    res.status(400).json({ parsed: false, message: err.message });
  }
}

module.exports = { parseBookingRequest };
