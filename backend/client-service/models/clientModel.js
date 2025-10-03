const sqlite3 = require('sqlite3');
const path = require('path');

//Gets path to the database
dataBasePath = path.join(__dirname, '../../shared-db/database.sqlite');

//Creates a database
dataBase = new sqlite3.Database(dataBasePath);

//Gets a list of all events
function getAllEvents(callback) 
{
    //Creates a request to get all events from a database
    query = "SELECT * FROM events";

    //Gets all events from the database
    dataBase.all(query, [], function (error, rows) 
    {
        callback(rows);
    });
}

//Purchase a ticket for an event
function purchaseTicket(eventId, callback) 
{
    //Creates a query to remove one ticket from the number of tickets available and update the database with the new number of tickets avalible
    query = "UPDATE events SET tickets = tickets - 1 WHERE id = ? AND tickets > 0";

    //If sucessful, removes one ticket from the number of available tickets for a given event and updates the database
    dataBase.run(query, [eventId], function () 
    {
        if (this.changes > 0) 
        {
            //Informs the user if the ticket purchase was sucessful
            callback({ success: true, message: "Ticket purchase complete!" });
        } 
        else 
        {
            //Informs the user if the tickets were sold out, so a transaction didn't happen
            callback({ success: false, message: "Sorry, tickets for this event are sold out." });
        }
    });
}

module.exports = { getAllEvents, purchaseTicket };
