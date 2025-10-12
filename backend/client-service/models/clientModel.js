/**
 * Provides database access functions for the client microservice
 */

const sqlite3 = require("sqlite3");
const path = require("path");

//Gets path to the database
dataBasePath = path.join(__dirname, "../../shared-db/database.sqlite");

//Creates a database
dataBase = new sqlite3.Database(dataBasePath);

/**
 * Retrieves all events from the database.
 *
 * @param {function} callback - Function to receive the list of events.
 *
 * @returns {void} Calls the callback with an array of all event objects.
 */
function getAllEvents(callback) {
  //Creates a request to get all events from a database
  query = "SELECT * FROM events";

  //Gets all events from the database
  dataBase.all(query, [], function (error, rows) {
    callback(rows);
  });
}

/**
 * Processes a ticket purchase for a specific event.
 *
 * @param {number} eventId - ID of the event to purchase a ticket for.
 * @param {function} callback - Function to receive success/failure message.
 *
 * @returns {void} Calls the callback with the result of the purchase attempt.
 */
function purchaseTicket(eventId, callback) {
  // Start an immediate transaction to prevent race conditions
  dataBase.run("BEGIN IMMEDIATE", function (err) {
    if (err)
      return callback({ success: false, message: "DB busy, try again." });

    // Try to decrement the ticket count
    const query =
      "UPDATE events SET tickets = tickets - 1 WHERE id = ? AND tickets > 0";
    dataBase.run(query, [eventId], function (err) {
      if (err) {
        // Rollback on error
        return dataBase.run("ROLLBACK", () => {
          callback({ success: false, message: "Error processing purchase." });
        });
      }

      if (this.changes > 0) {
        // Commit the transaction
        dataBase.run("COMMIT", (err) => {
          if (err)
            return dataBase.run("ROLLBACK", () => {
              callback({
                success: false,
                message: "Error committing purchase.",
              });
            });
          callback({ success: true, message: "Ticket purchase complete!" });
        });
      } else {
        // No tickets available, rollback
        dataBase.run("ROLLBACK", () => {
          callback({
            success: false,
            message: "Sorry, tickets for this event are sold out.",
          });
        });
      }
    });
  });
}

module.exports = { getAllEvents, purchaseTicket };
