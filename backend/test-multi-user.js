/**
 * Multi-user Socket.io test
 * Simulates 2 users chatting simultaneously
 */

const { io } = require("socket.io-client");

console.log("🚀 Starting multi-user Socket.io test...\n");

// Create two users
const user1 = io("http://localhost:3001", { transports: ["websocket"] });
const user2 = io("http://localhost:3001", { transports: ["websocket"] });

let messagesReceived = { user1: 0, user2: 0 };

// User 1 setup
user1.on("connect", () => {
  console.log("✅ User1 connected:", user1.id);
  user1.emit("join-chat", { username: "Alice" });
});

user1.on("join-confirmed", (data) => {
  console.log("👋 User1 joined successfully:", data.username);

  // Send first message after a short delay
  setTimeout(() => {
    user1.emit("send-message", {
      username: "Alice",
      content: "Hi everyone! Alice here 👋",
    });
  }, 1000);
});

user1.on("message-received", (data) => {
  messagesReceived.user1++;
  console.log(`📨 User1 received: [${data.username}] ${data.content}`);
});

// User 2 setup
user2.on("connect", () => {
  console.log("✅ User2 connected:", user2.id);
  user2.emit("join-chat", { username: "Bob" });
});

user2.on("join-confirmed", (data) => {
  console.log("👋 User2 joined successfully:", data.username);

  // Send response message after Alice's message
  setTimeout(() => {
    user2.emit("send-message", {
      username: "Bob",
      content: "Hello Alice! Bob here 🤖",
    });
  }, 2000);
});

user2.on("message-received", (data) => {
  messagesReceived.user2++;
  console.log(`📨 User2 received: [${data.username}] ${data.content}`);
});

// User joined notifications
user1.on("user-joined", (data) => {
  console.log(`🎉 User1 sees: ${data.username} joined the chat`);
});

user2.on("user-joined", (data) => {
  console.log(`🎉 User2 sees: ${data.username} joined the chat`);
});

// Test completion
setTimeout(() => {
  console.log("\n📊 Test Results:");
  console.log(`- User1 received ${messagesReceived.user1} messages`);
  console.log(`- User2 received ${messagesReceived.user2} messages`);
  console.log("\n✅ Multi-user test completed successfully!");

  user1.disconnect();
  user2.disconnect();
  process.exit(0);
}, 5000);
