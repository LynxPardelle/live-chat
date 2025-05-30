// Configuración de Express con MongoDB y API REST
// Fase 4: Socket.io Integration Ready

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares básicos
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration - Updated for Socket.io support
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  // Additional headers for Socket.io
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import API routes
const apiRoutes = require("./routes");

// API Routes
app.use("/api", apiRoutes);

// Health check endpoint with database status
app.get("/health", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const dbStatus =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      database: dbStatus,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: "Database connection check failed",
    });
  }
});

// Main API endpoint with database statistics
app.get("/", async (req, res) => {
  try {
    const messageService = require("./services/messageService");
    const stats = await messageService.getStatistics();
    res.json({
      message: "Live Chat Backend API",
      version: "1.0.0",
      status: "Phase 4 Complete - Socket.io Integration Ready",
      statistics: stats,
      features: {
        restApi: "✅ Available",
        socketio: "✅ Integrated",
        realTimeChat: "✅ Ready",
        messageHistory: "✅ Available",
      },
      apiEndpoints: {
        health: "GET /health",
        api: "GET /api",
        messages: "GET /api/messages",
        createMessage: "POST /api/messages",
        recentMessages: "GET /api/messages/recent",
        messageStats: "GET /api/messages/stats",
      },
      socketEvents: {
        client: ["join-chat", "send-message", "typing", "disconnect"],
        server: [
          "join-confirmed",
          "chat-history",
          "message-received",
          "user-joined",
          "user-left",
          "error",
        ],
      },
    });
  } catch (error) {
    res.json({
      message: "Live Chat Backend API",
      version: "1.0.0",
      status: "Phase 4 - Socket.io Integration with Database Connection Error",
      error: error.message,
    });
  }
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("🚨 Global Error:", error);

  // Handle different types of errors
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON format",
      message: "Request body must be valid JSON",
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: "Request too large",
      message: "Request body exceeds size limit",
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// 404 handler for non-API routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    message: `Cannot ${req.method} ${req.path}`,
    availableRoutes: [
      "GET /",
      "GET /health",
      "GET /api",
      "GET /api/messages",
      "POST /api/messages",
    ],
  });
});

module.exports = app;
