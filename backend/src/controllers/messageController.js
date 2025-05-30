/**
 * Message Controller - Handles HTTP requests for message operations
 * Implements REST API endpoints for chat messages
 */
const { validationResult } = require("express-validator");
const messageService = require("../services/messageService");

class MessageController {
  /**
   * Get paginated messages
   * GET /api/messages?page=1&limit=50
   */
  async getMessages(req, res) {
    try {
      const { page = 1, limit = 50 } = req.query;

      // Validate pagination parameters
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));

      const result = await messageService.getMessages(pageNum, limitNum);

      res.json({
        success: true,
        data: result.messages,
        pagination: result.pagination,
      });

      console.log(
        `📄 API: Retrieved ${result.messages.length} messages for page ${pageNum}`
      );
    } catch (error) {
      console.error("❌ Error in getMessages:", error.message);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve messages",
        message: error.message,
      });
    }
  }

  /**
   * Create a new message
   * POST /api/messages
   * Body: { username: string, content: string }
   */
  async createMessage(req, res) {
    try {
      // Check for validation errors from express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { username, content } = req.body;

      // Additional validation using messageService
      const validation = messageService.validateMessageData({
        username,
        content,
      });
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: validation.errors,
        });
      }

      const message = await messageService.createMessage({ username, content });

      res.status(201).json({
        success: true,
        data: message,
        message: "Message created successfully",
      });

      console.log(`✅ API: Message created by ${username}`);
    } catch (error) {
      console.error("❌ Error in createMessage:", error.message);

      // Handle different types of errors
      if (error.message.includes("Validation")) {
        res.status(400).json({
          success: false,
          error: "Validation error",
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to create message",
          message: error.message,
        });
      }
    }
  }

  /**
   * Get recent messages for new users joining
   * GET /api/messages/recent?limit=20
   */
  async getRecentMessages(req, res) {
    try {
      const { limit = 20 } = req.query;
      const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));

      const messages = await messageService.getRecentMessages(limitNum);

      res.json({
        success: true,
        data: messages,
        count: messages.length,
      });

      console.log(`📄 API: Retrieved ${messages.length} recent messages`);
    } catch (error) {
      console.error("❌ Error in getRecentMessages:", error.message);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve recent messages",
        message: error.message,
      });
    }
  }

  /**
   * Get message by ID
   * GET /api/messages/:id
   */
  async getMessageById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Message ID is required",
        });
      }

      const message = await messageService.getMessageById(id);

      if (!message) {
        return res.status(404).json({
          success: false,
          error: "Message not found",
        });
      }

      res.json({
        success: true,
        data: message,
      });

      console.log(`📄 API: Retrieved message ${id}`);
    } catch (error) {
      console.error("❌ Error in getMessageById:", error.message);

      // Handle invalid ObjectId format
      if (error.message.includes("Cast to ObjectId failed")) {
        res.status(400).json({
          success: false,
          error: "Invalid message ID format",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to retrieve message",
          message: error.message,
        });
      }
    }
  }

  /**
   * Get database statistics
   * GET /api/messages/stats
   */
  async getStatistics(req, res) {
    try {
      const stats = await messageService.getStatistics();

      res.json({
        success: true,
        data: stats,
      });

      console.log("📊 API: Retrieved database statistics");
    } catch (error) {
      console.error("❌ Error in getStatistics:", error.message);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve statistics",
        message: error.message,
      });
    }
  }
}

module.exports = new MessageController();
