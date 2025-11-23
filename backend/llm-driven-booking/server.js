const express = require("express");
const cors = require("cors");
const llmRoutes = require("./routes/llmRoutes");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://tiger-tix-nine.vercel.app"
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/llm", llmRoutes);

// Start server
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log(`LLM-driven booking service running at http://localhost:${PORT}`);
});
