const sqlite3 = require("sqlite3"); //Imports SQL
const fs = require("fs");
const path = require("path");

//Sets the path to the database
dataBasePath = path.join(__dirname, "../shared-db/database.sqlite");

//Reads in the contents of the database into a string
initSql = fs.readFileSync(
  path.join(__dirname, "../shared-db/init.sql"),
  "utf-8"
);

//Creates sql database
dataBase = new sqlite3.Database(dataBasePath);

//Runs init.sql
dataBase.exec(initSql, function () {
  db.close();
});
