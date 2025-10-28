// initDb.js
const sqlite3 = require("sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "shared-db/database.sqlite");
const sqlPath = path.join(__dirname, "shared-db/init.sql");

// Make sure the DB file exists
if (!fs.existsSync(dbPath)) {
  fs.closeSync(fs.openSync(dbPath, "w"));
}

const db = new sqlite3.Database(dbPath);

// Read SQL from file
const initSQL = fs.readFileSync(sqlPath, "utf-8");

db.exec(initSQL, (err) => {
  if (err) {
    console.error("Failed to initialize DB:", err);
  } else {
    console.log("Database initialized successfully!");
  }
  db.close();
});
