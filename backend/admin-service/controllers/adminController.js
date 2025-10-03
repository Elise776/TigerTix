//Imports createEvent from adminModel.js
const { createEvent } = require('../models/adminModel');

//Adds events when a POST request is received
function addEvent(request, response) 
{
  //Reads in information from client
  name = request.body.name;
  date = request.body.date;
  tickets = request.body.tickets;

  //Validation to make sure all fields have information
  if (!name || !date || tickets == null) 
  {
    //Sends a 400 error if information is not complete
    response.status(400).json({ error: "Event information incomplete" });
    return;
  }

  //Creates an event using the create event function from adminModel.js
  adminModel.createEvent(name, date, tickets, function (newEvent)
  {
    //Sends a 201 status message indiating the event has been sucessfully created
    response.status(201).json(newEvent)
  });
}

//Exports add event for use in other files
module.exports = { addEvent };
