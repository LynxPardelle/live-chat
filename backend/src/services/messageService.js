/**
 * Message Service - Business logic layer for message operations
 * Handles all message-related operations with proper error handling
 */
const Message = require("../models/Message");

class MessageService {
  /**
   * Creates a new message
   * @param {Object} messageData - The message data
   * @param {string} messageData.username - The username
   * @param {string} messageData.content - The message content
   * @returns {Promise<Object>} Created message
   */
  async createMessage({ username, content }) {
    try {
      // Validate input
      if (!username || !content) {
        throw new Error("Username and content are required");
      }

      // Create and save message
      const message = new Message({
        username: username.trim(),
        content: content.trim(),
      });

      const savedMessage = await message.save();

      console.log(`✅ Message created: ${savedMessage.id} by ${username}`);

      return savedMessage.toJSON();
    } catch (error) {
      console.error("❌ Error creating message:", error.message);
      throw new Error(`Failed to create message: ${error.message}`);
    }
  }

  /**
   * Retrieves paginated messages
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Number of messages per page
   * @returns {Promise<Object>} Paginated messages with metadata
   */
  async getMessages(page = 1, limit = 50) {
    try {
      // Validate pagination parameters
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50)); // Max 100 messages per request

      // Get messages and total count in parallel
      const [messages, totalMessages] = await Promise.all([
        Message.getPaginated(pageNum, limitNum),
        Message.getTotalCount(),
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalMessages / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      // Reverse messages to show oldest first in the array (for frontend display)
      const sortedMessages = messages.reverse();

      const result = {
        messages: sortedMessages,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalMessages,
          messagesPerPage: limitNum,
          hasNextPage,
          hasPrevPage,
        },
      };

      console.log(
        `📄 Retrieved ${messages.length} messages (page ${pageNum}/${totalPages})`
      );

      return result;
    } catch (error) {
      console.error("❌ Error retrieving messages:", error.message);
      throw new Error(`Failed to retrieve messages: ${error.message}`);
    }
  }

  /**
   * Gets recent messages for new users joining the chat
   * @param {number} limit - Number of recent messages to retrieve
   * @returns {Promise<Array>} Array of recent messages
   */
  async getRecentMessages(limit = 20) {
    try {
      const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20)); // Max 50 recent messages

      const messages = await Message.find()
        .sort({ timestamp: -1 })
        .limit(limitNum)
        .lean();

      // Return in chronological order (oldest first)
      const sortedMessages = messages.reverse();

      console.log(`📄 Retrieved ${messages.length} recent messages`);

      return sortedMessages;
    } catch (error) {
      console.error("❌ Error retrieving recent messages:", error.message);
      throw new Error(`Failed to retrieve recent messages: ${error.message}`);
    }
  }

  /**
   * Gets a single message by ID
   * @param {string} messageId - The message ID
   * @returns {Promise<Object|null>} Message object or null if not found
   */
  async getMessageById(messageId) {
    try {
      if (!messageId) {
        throw new Error("Message ID is required");
      }

      const message = await Message.findById(messageId).lean();

      if (!message) {
        console.log(`⚠️  Message not found: ${messageId}`);
        return null;
      }

      console.log(`📄 Retrieved message: ${messageId}`);

      return message;
    } catch (error) {
      console.error("❌ Error retrieving message by ID:", error.message);
      throw new Error(`Failed to retrieve message: ${error.message}`);
    }
  }
  /**
   * Validates message data before creation
   * @param {Object} messageData - The message data to validate
   * @param {string} messageData.username - The username
   * @param {string} messageData.content - The message content
   * @returns {Object} Validation result
   */
  validateMessageData(messageData) {
    const errors = [];

    // Handle null/undefined inputs
    if (!messageData || typeof messageData !== "object") {
      errors.push("Message data is required");
      return {
        isValid: false,
        errors,
      };
    }

    const { username, content } = messageData;

    // Validate username
    if (!username) {
      errors.push("Username is required");
    } else if (typeof username !== "string") {
      errors.push("Username must be a string");
    } else if (username.trim().length === 0) {
      errors.push("Username cannot be empty");
    } else if (username.trim().length > 50) {
      errors.push("Username cannot exceed 50 characters");
    } else if (!/^[a-zA-Z0-9\s]+$/.test(username.trim())) {
      errors.push("Username can only contain letters, numbers, and spaces");
    }

    // Validate content
    if (!content) {
      errors.push("Message content is required");
    } else if (typeof content !== "string") {
      errors.push("Message content must be a string");
    } else if (content.trim().length === 0) {
      errors.push("Message cannot be empty");
    } else if (content.trim().length > 500) {
      errors.push("Message cannot exceed 500 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Gets database statistics
   * @returns {Promise<Object>} Database statistics
   */
  async getStatistics() {
    try {
      const [totalMessages, recentMessage] = await Promise.all([
        Message.getTotalCount(),
        Message.findOne().sort({ timestamp: -1 }).lean(),
      ]);

      return {
        totalMessages,
        lastMessageAt: recentMessage ? recentMessage.timestamp : null,
      };
    } catch (error) {
      console.error("❌ Error getting statistics:", error.message);
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }
}

module.exports = new MessageService();
