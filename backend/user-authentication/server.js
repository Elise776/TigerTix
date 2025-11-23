const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// CORS MUST specify your Vercel domain
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

// Needed for POST bodies
app.use(express.json());

// Needed for cookies
app.use(cookieParser());

// ROUTES
const authRoutes = require("./routes/authenticationRoutes");
app.use("/api/authentication", authRoutes);

// DYNAMIC RENDER PORT
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
