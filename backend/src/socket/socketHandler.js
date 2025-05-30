/**
 * Socket.io Event Handlers
 * Manages real-time communication between clients
 */

const messageService = require("../services/messageService");

/**
 * Connected users tracking
 */
const connectedUsers = new Map();

/**
 * Initialize Socket.io event handlers
 * @param {SocketIO.Server} io - Socket.io server instance
 */
function initializeSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    /**
     * Handle user joining the chat
     */
    socket.on("join-chat", async (data) => {
      try {
        const { username } = data;

        // Validate username
        if (
          !username ||
          typeof username !== "string" ||
          username.trim().length === 0
        ) {
          socket.emit("error", {
            message: "Username is required and must be a non-empty string",
          });
          return;
        }

        const trimmedUsername = username.trim();

        // Validate username format
        const validation = messageService.validateMessageData({
          username: trimmedUsername,
          content: "dummy",
        });

        if (!validation.isValid) {
          const usernameErrors = validation.errors.filter(
            (err) => err.field === "username"
          );
          if (usernameErrors.length > 0) {
            socket.emit("error", {
              message: usernameErrors[0].message,
            });
            return;
          }
        }

        // Store user info
        connectedUsers.set(socket.id, {
          username: trimmedUsername,
          joinedAt: new Date(),
        });

        // Join a general chat room
        socket.join("chat-room");
        console.log(`👤 User joined: ${trimmedUsername} (${socket.id})`);

        // Send confirmation to the user
        socket.emit("join-confirmed", {
          username: trimmedUsername,
          message: "Successfully joined the chat",
        });

        // Get recent messages for the new user
        try {
          const recentMessages = await messageService.getRecentMessages(20);
          socket.emit("chat-history", {
            messages: recentMessages,
            count: recentMessages.length,
          });
        } catch (error) {
          console.error("❌ Error fetching chat history:", error.message);
          socket.emit("error", {
            message: "Could not load chat history",
          });
        }

        // Notify other users (optional)
        socket.to("chat-room").emit("user-joined", {
          username: trimmedUsername,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("❌ Error in join-chat:", error.message);
        socket.emit("error", {
          message: "Failed to join chat",
        });
      }
    });

    /**
     * Handle sending a message
     */
    socket.on("send-message", async (data) => {
      try {
        const { username, content } = data;

        // Basic validation
        if (!username || !content) {
          socket.emit("error", {
            message: "Username and content are required",
          });
          return;
        }

        // Validate message data
        const validation = messageService.validateMessageData({
          username,
          content,
        });
        if (!validation.isValid) {
          socket.emit("error", {
            message: "Invalid message data",
            details: validation.errors,
          });
          return;
        }

        // Check if user is connected and matches
        const userInfo = connectedUsers.get(socket.id);
        if (!userInfo || userInfo.username !== username.trim()) {
          socket.emit("error", {
            message: "User not properly joined or username mismatch",
          });
          return;
        }
        console.log(
          `📩 Message from ${username}: ${content.substring(0, 50)}...`
        );

        // Save message to database
        const savedMessage = await messageService.createMessage({
          username,
          content,
        });

        // Prepare message for broadcast
        const messageData = {
          id: savedMessage.id || savedMessage._id,
          username: savedMessage.username,
          content: savedMessage.content,
          timestamp: savedMessage.timestamp,
          createdAt: savedMessage.createdAt,
        };

        // Broadcast to all users in the chat room (including sender)
        io.to("chat-room").emit("message-received", messageData);

        console.log(`✅ Message broadcasted to chat room`);
      } catch (error) {
        console.error("❌ Error in send-message:", error.message);
        socket.emit("error", {
          message: "Failed to send message",
          details: error.message,
        });
      }
    });

    /**
     * Handle user typing (optional feature)
     */
    socket.on("typing", (data) => {
      const userInfo = connectedUsers.get(socket.id);
      if (userInfo) {
        socket.to("chat-room").emit("user-typing", {
          username: userInfo.username,
          isTyping: data.isTyping,
        });
      }
    });

    /**
     * Handle disconnection
     */
    socket.on("disconnect", (reason) => {
      const userInfo = connectedUsers.get(socket.id);

      if (userInfo) {
        console.log(
          `👋 User disconnected: ${userInfo.username} (${socket.id}) - Reason: ${reason}`
        );

        // Notify other users
        socket.to("chat-room").emit("user-left", {
          username: userInfo.username,
          timestamp: new Date(),
          reason: reason,
        });

        // Remove from connected users
        connectedUsers.delete(socket.id);
      } else {
        console.log(
          `🔌 Unknown client disconnected: ${socket.id} - Reason: ${reason}`
        );
      }
    });

    /**
     * Handle connection errors
     */
    socket.on("error", (error) => {
      console.error(`❌ Socket error for ${socket.id}:`, error);
    });
  });

  // Log server status
  console.log("🚀 Socket.io event handlers initialized");
}

/**
 * Get connected users count
 */
function getConnectedUsersCount() {
  return connectedUsers.size;
}

/**
 * Get connected users list
 */
function getConnectedUsers() {
  return Array.from(connectedUsers.values());
}

module.exports = {
  initializeSocketHandlers,
  getConnectedUsersCount,
  getConnectedUsers,
};
