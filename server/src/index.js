const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const routesRoutes = require("./app/routes/routes.routes");

const healthRoutes = require("./app/routes/health.routes");

const authRoutes = require("./app/routes/auth.routes");


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/routes", routesRoutes);

// 404 handler (minimal)
app.use((req, res) => {
  return res.status(404).json({
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();