const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = ["https://tiger-tix-nine.vercel.app", "http://localhost:3000"];

app.use(cors({origin: ["https://tiger-tix-nine.vercel.app", ], methods: "GET,POST,PUT,DELETE", credentials: true}));

app.use(express.json());
const routes = require("./routes/routes");
app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at
http://localhost:${PORT}`)
);
module.exports = app;
