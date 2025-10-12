// Imports createEvent from adminModel.js
const { createEvent } = require("../models/adminModel");

// Adds events when a POST request is received
function addEvent(request, response) {
  // Reads in information from client
  const { name, date, tickets } = request.body;

  // Validation to make sure all fields have information
  if (!name || !date || tickets == null) {
    // Sends a 400 error if information is not complete
    response.status(400).json({ error: "Event information incomplete" });
    return;
  }

  // Creates an event using the createEvent function from adminModel.js
  createEvent(name, date, tickets, function (err, newEvent) {
    if (err || !newEvent) {
      console.error("Failed to create event:", err);
      response.status(500).json({ error: "Failed to create event" });
    } else {
      // Sends a 201 status message indicating the event has been successfully created
      response.status(201).json(newEvent);
    }
  });
}

// Exports addEvent for use in other files
module.exports = { addEvent };
