const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/adminRoutes");
app.use(cors());
app.use(express.json()); //Allows use of json
app.use("/api/admin", routes);
const PORT = 5001; //Sets port number
app.listen(PORT, () =>
  console.log(`Admin service running at
http://localhost:${PORT}`)
);
