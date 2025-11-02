const { getEvents } = require("../models/model");
/**
 * Retrieves all events from the model and responds with JSON.
 *
 * @param {Object} req - request object (not used here)
 * @param {Object} res - response object used to send the data
 *
 * @returns {void} Sends JSON array of events as the HTTP response
 */

const listEvents = async (req, res) => 
{
  try 
  {
    //Retreives events from the getEvents() function
    const events = await getEvents();

    res.status(200).json(events);
  } 
  //Throws an error if unable to retreive events
  catch (err) 
  {
    console.error("Error occured while retrieving events:", err.message);
    res.status(500).json({ error: "Unable to retrieve events" });
  }
};

module.exports = { listEvents };
