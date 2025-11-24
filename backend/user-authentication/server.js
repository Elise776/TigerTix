const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

const allowedOrigins = ["http://localhost:3000", "https://tiger-tix-nine.vercel.app"];

app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/authenticationRoutes");
app.use("/api/authentication", authRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Authentication service running on port ${PORT}`);
});
