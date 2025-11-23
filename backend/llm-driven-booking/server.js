const express = require("express");
const cors = require("cors");
const llmRoutes = require("./routes/llmRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/llm", llmRoutes);

// Start server
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log(`LLM-driven booking service running at http://localhost:${PORT}`);
});
