/**
 * Entry point for the Client microservice
 */

const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/clientRoutes");

const allowedOrigins = ["http://localhost:3000","https://tiger-tix-nine.vercel.app"];

app.use(cors({origin: allowedOrigins,credentials: true}));
app.use(express.json());
app.use("/api", routes);

// port for client microservice
const PORT = process.env.PORT || 6001;
app.listen(PORT, () =>
  console.log(`Client Server running at
http://localhost:${PORT}`)
);
