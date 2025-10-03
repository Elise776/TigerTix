//Imports clientModel.js
const clientModel = require('../models/clientModel');

//Gets events
function listEvents(request, response) 
{
    //Gets all events from function in clientModel.js
    clientModel.getAllEvents(function(events) 
    {
        //If sucessful, sends a 200 sucess message
        response.status(200).json(events);
    });
}

//Deincrements tickets of given ID
function buyTicket(request, response) 
{
    //Sets the event ID to the ID of the requested event
    eventId = request.params.id;

    //Purchases a ticket by deincrementing the ticket number for the specified event using clientModel.js's purchaseTicket function
    clientModel.purchaseTicket(eventId, function(result) 
    {
        if (result.success) 
        {
            //If sucessful, sends a 200 sucess message
            response.status(200).json(result);
        } 
        else 
        {
            //If not any tickets availible, sends a 400 error message
            response.status(400).json(result);
        }
    });
}

module.exports = { listEvents, buyTicket };
