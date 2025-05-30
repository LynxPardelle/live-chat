/**
 * Main API routes configuration
 * Centralizes all API route definitions
 */
const express = require("express");
const router = express.Router();

// Import route modules
const messageRoutes = require("./messageRoutes");

// API Routes
router.use("/messages", messageRoutes);

// API information endpoint
router.get("/", (req, res) => {
  res.json({
    message: "Live Chat API v1.0.0",
    status: "Active",
    timestamp: new Date().toISOString(),
    endpoints: {
      messages: {
        "GET /api/messages": "Get paginated messages",
        "POST /api/messages": "Create new message",
        "GET /api/messages/recent": "Get recent messages",
        "GET /api/messages/stats": "Get database statistics",
        "GET /api/messages/:id": "Get message by ID",
      },
    },
  });
});

module.exports = router;
