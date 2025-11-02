const bookingModel = require("../models/bookingModel");
function confirmBooking(req, res) {
  const { confirm, parse } = req.body;
  if (!parse || !parse.event || !parse.tickets) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid parse payload" });
  }
  if (!confirm) {
    return res.json({ success: false, message: "Booking cancelled by user" });
  }
  bookingModel.bookTicketsTransactional(
    parse.event,
    parse.tickets,
    (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(200).json({success: true,booking: {event: parse.event,tickets: parse.tickets,bookingId: result.bookingId,eventId: result.eventId,qty: result.qty}});

    }
  );
}
module.exports = { confirmBooking };
