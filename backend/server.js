const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/routes");
app.use("/api", routes);
const allowedOrigins = [
  "http://localhost:3000",
  "https://tiger-tix-nine.vercel.app"
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at
http://localhost:${PORT}`)
);
module.exports = app;
