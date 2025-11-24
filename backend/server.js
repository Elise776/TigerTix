const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/routes");
app.use("/api", routes);
const allowedOrigins = [
  "https://tiger-tix-nine.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS"
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at
http://localhost:${PORT}`)
);
module.exports = app;
