// cleanup.js
const sqlite3 = require("sqlite3");
const path = require("path");

// Path to your shared DB
const dbPath = path.join(__dirname, "shared-db/database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error("Error opening DB:", err.message);
  console.log("Connected to database.");
});

// Delete all temp/test events
const deleteTempEventsQuery = `
  DELETE FROM events
  WHERE name LIKE 'Concert%' OR name LIKE 'Test Event%'
`;

db.run(deleteTempEventsQuery, function (err) {
  if (err) return console.error("Error deleting temp events:", err.message);
  console.log(`Deleted ${this.changes} temp/test events.`);
});

// Close the database
db.close((err) => {
  if (err) return console.error(err.message);
  console.log("Database connection closed.");
});
