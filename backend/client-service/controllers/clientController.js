//Imports clientModel.js
const clientModel = require("../models/clientModel");

/**
 * Retrieves all events from the database and sends them as a JSON response.
 *
 * @param {Object} request - request object (unused in this case)
 * @param {Object} response - response object used to send data back to client
 *
 * @returns {void} Sends:
 *  - 200 status and list of all events in JSON format if successful
 *  - 500 status if a database retrieval error occurs (handled inside model)
 */
function listEvents(request, response) {
  //Gets all events from function in clientModel.js
  clientModel.getAllEvents(function (events) {
    //If sucessful, sends a 200 sucess message
    response.status(200).json(events);
  });
}

/**
 * Processes a ticket purchase for a specific event by ID.
 *
 * @param {Object} request - request object containing the event ID in params
 * @param {Object} response - response object used to send success/error responses
 *
 * @returns {void} Sends:
 *  - 200 status and success message if the purchase was successful
 *  - 400 status and error message if no tickets are available
 */
function buyTicket(request, response) {
  //Sets the event ID to the ID of the requested event
  eventId = request.params.id;

  //Purchases a ticket by deincrementing the ticket number for the specified event using clientModel.js's purchaseTicket function
  clientModel.purchaseTicket(eventId, function (result) {
    if (result.success) {
      //If sucessful, sends a 200 sucess message
      response.status(200).json(result);
    } else {
      //If not any tickets availible, sends a 400 error message
      response.status(400).json(result);
    }
  });
}

module.exports = { listEvents, buyTicket };
