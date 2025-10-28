const express = require("express");
const { parseBookingRequest } = require("../controllers/llmController");
const { confirmBooking } = require("../controllers/bookingController");

const router = express.Router();

// POST /api/llm/parse
router.post("/parse", parseBookingRequest);

// POST /api/llm/confirm
router.post("/confirm", confirmBooking);

module.exports = router;
