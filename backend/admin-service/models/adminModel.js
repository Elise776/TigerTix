/**
 * This file handles all database operations for the admin microservice.
 *
 */

const sqlite3 = require("sqlite3"); //Imports sql
const path = require("path");

//Sets the path to the database
const dataBasePath = path.join(__dirname, "../../shared-db/database.sqlite");

//Creates the sql database
const dataBase = new sqlite3.Database(dataBasePath);

/**
 *
 * @param {string} name - The name of the event
 * @param {string} date - the date of the event
 * @param {number} tickets - number of available tickets for the event
 * @param {function} callback - a function that handles the created event
 *
 * @returns void
 */
function createEvent(name, date, tickets, callback) {
  //sql query to get name, date, and tickets
  query = `INSERT INTO events (name, date, tickets) VALUES (?, ?, ?)`;

  dataBase.run(query, [name, date, tickets], function () {
    //Creates a new event based on info added to the database
    newEvent = { id: this.lastID, name: name, date: date, tickets: tickets };
  });

  //Calls the callback function and passes the new event
  callback(newEvent);
}

//Exports the function for other files to use
module.exports = { createEvent };
