const sqlite3 = require("sqlite3");
const path = require("path");

//Sets the path to the database
const dataBasePath = path.join(__dirname, "../../shared-db/database.sqlite");

//Creates the sql database
const dataBase = new sqlite3.Database(dataBasePath);

//Function to create an event
function createEvent(name, date, tickets, callback) {
  const query = `INSERT INTO events (name, date, tickets) VALUES (?, ?, ?)`;

  dataBase.run(query, [name, date, tickets], function (err) {
    if (err) {
      console.error("Database insert error:", err);
      callback(err); // <-- pass the error
      return;
    }

    const newEvent = {
      id: this.lastID,
      name,
      date,
      tickets,
    };

    callback(null, newEvent); // <-- first argument is err
  });
}

//Exports the function for other files to use
module.exports = { createEvent };
