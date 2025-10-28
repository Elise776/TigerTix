const { parseBooking } = require("../models/llmModel");
async function parseBookingRequest(req, res) {
  const { text } = req.body;
  if (!text)
    return res
      .status(400)
      .json({ parsed: false, message: "Missing input text" });
  try {
    const result = await parseBooking(text);
    res.json({ parsed: true, result });
  } catch (err) {
    console.error("LLM parsing error:", err.message);
    res.status(400).json({ parsed: false, message: err.message });
  }
}
module.exports = { parseBookingRequest };
