/**
 * Main entry point for the admin microservice
 */
const express = require("express");
const cors = require("cors");
const app = express();

//import admin routes
const routes = require("./routes/adminRoutes");
app.use(cors());
app.use(express.json()); //Allows use of json
app.use("/api/admin", routes);
const PORT = 5001; //Sets port number
app.listen(PORT, () =>
  console.log(`Admin service running at
http://localhost:${PORT}`)
);
