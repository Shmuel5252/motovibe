const express = require("express");
const cors = require("cors");
require("dotenv").config();

const healthRoutes = require("./app/routes/health.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);

// 404 handler (minimal)
app.use((req, res) => {
  return res.status(404).json({
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
