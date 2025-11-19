const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "../../shared-db/database.sqlite");

//Creates a database to hold users
const db = new sqlite3.Database(dbPath);

//Creates a database with a table to store login info for users
db.run(
  `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL)`
);

module.exports = db;
