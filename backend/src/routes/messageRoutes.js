/**
 * Message routes - API endpoints for message operations
 */
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const {
  validateCreateMessage,
  validatePagination,
  validateRecentLimit,
  validateMessageId,
  handleValidationErrors,
} = require("../validators/messageValidators");

// GET /api/messages - Get paginated messages
router.get(
  "/",
  validatePagination,
  handleValidationErrors,
  messageController.getMessages
);

// POST /api/messages - Create a new message
router.post(
  "/",
  validateCreateMessage,
  handleValidationErrors,
  messageController.createMessage
);

// GET /api/messages/recent - Get recent messages
router.get(
  "/recent",
  validateRecentLimit,
  handleValidationErrors,
  messageController.getRecentMessages
);

// GET /api/messages/stats - Get database statistics
router.get("/stats", messageController.getStatistics);

// GET /api/messages/:id - Get message by ID
router.get(
  "/:id",
  validateMessageId,
  handleValidationErrors,
  messageController.getMessageById
);

module.exports = router;
