/**
 * Simple Socket.io test client
 * Tests the WebSocket connection and basic events
 */

const { io } = require("socket.io-client");

console.log("🔌 Starting Socket.io test client...");

// Connect to the server
const socket = io("http://localhost:3001", {
  transports: ["websocket"],
  forceNew: true,
});

console.log("📡 Attempting to connect to http://localhost:3001");

socket.on("connect", () => {
  console.log("✅ Connected to server with ID:", socket.id);

  // Test join-chat event
  console.log("📤 Sending join-chat event...");
  socket.emit("join-chat", { username: "TestUser" });
});

socket.on("connect_error", (error) => {
  console.error("❌ Connection error:", error.message);
});

socket.on("join-confirmed", (data) => {
  console.log("✅ Join confirmed:", data);

  // Test sending a message
  console.log("📤 Sending test message...");
  socket.emit("send-message", {
    username: "TestUser",
    content: "Hello from Socket.io test client!",
  });
});

socket.on("chat-history", (data) => {
  console.log("📜 Chat history received:", data);
});

socket.on("message-received", (data) => {
  console.log("💬 Message received:", data);
});

socket.on("user-joined", (data) => {
  console.log("👋 User joined:", data);
});

socket.on("error", (error) => {
  console.error("❌ Socket error:", error);
});

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from server");
});

// Test for 5 seconds then disconnect
setTimeout(() => {
  console.log("⏰ Test completed, disconnecting...");
  socket.disconnect();
  console.log("✅ Test client finished");
  process.exit(0);
}, 5000);
