const { getEvents } = require("../models/model");
/**
 * Retrieves all events from the model and responds with JSON.
 *
 * @param {Object} req - request object (not used here)
 * @param {Object} res - response object used to send the data
 *
 * @returns {void} Sends JSON array of events as the HTTP response
 */
const listEvents = (req, res) => {
  const events = getEvents();
  res.json(events);
};
module.exports = { listEvents };
