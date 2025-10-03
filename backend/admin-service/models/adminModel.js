const sqlite3 = require('sqlite3'); //Imports sql
const path = require('path');

//Sets the path to the database
const dataBasePath = path.join(__dirname, '../../shared-db/database.sqlite');

//Creates the sql database
const dataBase = new sqlite3.Database(dataBasePath);

//Function to create an event
function createEvent(name, date, tickets, callback) 
{
  //sql query to get name, date, and tickets
  query = `INSERT INTO events (name, date, tickets) VALUES (?, ?, ?)`;

  dataBase.run(query, [name, date, tickets], function () 
  {
    //Creates a new event based on info added to the database
    newEvent = {id: this.lastID, name: name, date: date, tickets: tickets};
  });

  //Calls the callback function and passes the new event
  callback(newEvent);
}

//Exports the function for other files to use
module.exports = { createEvent };
