const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/adminRoutes");
app.use(cors());
app.use(express.json()); //Allows use of json
app.use('/api/llm', routes);
const PORT = 7001; //Sets port number
app.listen(PORT, () =>
  console.log(`llm-driven-booking running at
http://localhost:${PORT}`)
);
