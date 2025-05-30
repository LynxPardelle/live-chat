/**
 * Socket.io Integration Tests
 * Tests WebSocket functionality end-to-end
 */

const { Server } = require("socket.io");
const { io: Client } = require("socket.io-client");
const http = require("http");
const app = require("../src/app");
const { initializeSocketHandlers } = require("../src/socket/socketHandler");

describe("Socket.io Integration Tests", () => {
  let httpServer;
  let ioServer;
  let clientSocket;
  let serverSocket;

  beforeAll((done) => {
    // Create HTTP server for testing
    httpServer = http.createServer(app);

    // Setup Socket.io
    ioServer = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Initialize handlers
    initializeSocketHandlers(ioServer);

    // Start server
    httpServer.listen(() => {
      const port = httpServer.address().port;

      // Connect test client
      clientSocket = Client(`http://localhost:${port}`, {
        transports: ["websocket"],
      });

      // Capture server connection
      ioServer.on("connection", (socket) => {
        serverSocket = socket;
      });

      clientSocket.on("connect", done);
    });
  });

  afterAll((done) => {
    // Cleanup
    ioServer.close();
    clientSocket.close();
    httpServer.close(done);
  });

  afterEach(() => {
    // Clean up test-specific listeners only
    const testEvents = [
      "join-confirmed",
      "chat-history",
      "message-received",
      "error",
      "user-joined",
      "user-typing",
    ];
    testEvents.forEach((event) => {
      clientSocket.removeAllListeners(event);
    });
    if (serverSocket) {
      serverSocket.removeAllListeners();
    }
  });

  describe("Connection and Basic Events", () => {
    test("should connect successfully", (done) => {
      expect(clientSocket.connected).toBe(true);
      done();
    });

    test("should handle join-chat event", (done) => {
      const testUsername = "TestUser123";

      // Set up listener first
      clientSocket.once("join-confirmed", (data) => {
        try {
          expect(data).toHaveProperty("username", testUsername);
          expect(data).toHaveProperty("message");
          done();
        } catch (error) {
          done(error);
        }
      });

      // Add error listener
      clientSocket.once("error", (error) => {
        done(new Error(`Socket error: ${error.message}`));
      });

      // Then emit the event
      setTimeout(() => {
        clientSocket.emit("join-chat", { username: testUsername });
      }, 100);
    });

    test("should receive chat history on join", (done) => {
      const testUsername = "HistoryUser";

      // Set up listener first
      clientSocket.once("chat-history", (data) => {
        try {
          expect(data).toHaveProperty("messages");
          expect(Array.isArray(data.messages)).toBe(true);
          done();
        } catch (error) {
          done(error);
        }
      });

      // Add error listener
      clientSocket.once("error", (error) => {
        done(new Error(`Socket error: ${error.message}`));
      });

      // Then emit the event
      setTimeout(() => {
        clientSocket.emit("join-chat", { username: testUsername });
      }, 100);
    });
  });

  describe("Message Sending and Broadcasting", () => {
    test("should send and receive messages", (done) => {
      const testUsername = "MessageSender";
      const testMessage = "Hello from Socket.io test!";

      // Set up listeners first
      clientSocket.once("join-confirmed", () => {
        // Set up message listener
        clientSocket.once("message-received", (data) => {
          try {
            expect(data).toHaveProperty("username", testUsername);
            expect(data).toHaveProperty("content", testMessage);
            expect(data).toHaveProperty("timestamp");
            expect(data).toHaveProperty("id");
            done();
          } catch (error) {
            done(error);
          }
        });

        // Send message after setup
        setTimeout(() => {
          clientSocket.emit("send-message", {
            username: testUsername,
            content: testMessage,
          });
        }, 100);
      });

      clientSocket.once("error", (error) => {
        done(new Error(`Socket error: ${error.message}`));
      });

      // Join chat to start the process
      clientSocket.emit("join-chat", { username: testUsername });
    });

    test("should persist messages to database", (done) => {
      const testUsername = "PersistUser";
      const testMessage = "This message should persist";

      clientSocket.once("join-confirmed", () => {
        clientSocket.once("message-received", (data) => {
          try {
            // Verify message has ID (indicates it was saved to DB)
            expect(data).toHaveProperty("id");
            expect(typeof data.id).toBe("string");
            expect(data.id).toHaveLength(24); // MongoDB ObjectId
            done();
          } catch (error) {
            done(error);
          }
        });

        setTimeout(() => {
          clientSocket.emit("send-message", {
            username: testUsername,
            content: testMessage,
          });
        }, 100);
      });

      clientSocket.once("error", (error) => {
        done(new Error(`Socket error: ${error.message}`));
      });

      clientSocket.emit("join-chat", { username: testUsername });
    });
  });

  describe("Validation and Error Handling", () => {
    test("should reject invalid join-chat data", (done) => {
      clientSocket.once("error", (error) => {
        try {
          expect(error).toHaveProperty("message");
          expect(error.message).toContain("Username is required");
          done();
        } catch (e) {
          done(e);
        }
      });

      setTimeout(() => {
        clientSocket.emit("join-chat", { username: "" });
      }, 100);
    });

    test("should reject invalid message data", (done) => {
      const testUsername = "ValidUser";

      clientSocket.once("join-confirmed", () => {
        clientSocket.once("error", (error) => {
          try {
            expect(error).toHaveProperty("message");
            expect(error.message).toContain(
              "Username and content are required"
            );
            done();
          } catch (e) {
            done(e);
          }
        });

        // Send invalid message
        setTimeout(() => {
          clientSocket.emit("send-message", {
            username: testUsername,
            content: "", // Empty content
          });
        }, 100);
      });

      clientSocket.emit("join-chat", { username: testUsername });
    });

    test("should reject message from non-joined user", (done) => {
      clientSocket.once("error", (error) => {
        try {
          expect(error).toHaveProperty("message");
          expect(error.message).toContain("User not properly joined");
          done();
        } catch (e) {
          done(e);
        }
      });

      // Try to send message without joining first
      setTimeout(() => {
        clientSocket.emit("send-message", {
          username: "NotJoinedUser",
          content: "This should fail",
        });
      }, 100);
    });
  });

  describe("Multi-Client Scenarios", () => {
    let secondClient;

    beforeEach((done) => {
      const port = httpServer.address().port;
      secondClient = Client(`http://localhost:${port}`, {
        transports: ["websocket"],
      });
      secondClient.on("connect", done);
    });

    afterEach(() => {
      if (secondClient) {
        secondClient.close();
      }
    });

    test("should broadcast messages to all clients", (done) => {
      const user1 = "Alice";
      const user2 = "Bob";
      const testMessage = "Message for everyone!";

      let messagesReceived = 0;
      const expectedMessages = 2; // Both sender and receiver

      const messageHandler = (data) => {
        try {
          expect(data).toHaveProperty("username", user1);
          expect(data).toHaveProperty("content", testMessage);
          messagesReceived++;

          if (messagesReceived === expectedMessages) {
            done();
          }
        } catch (error) {
          done(error);
        }
      };

      // Setup both clients
      clientSocket.once("join-confirmed", () => {
        clientSocket.once("message-received", messageHandler);

        // Join second client
        secondClient.emit("join-chat", { username: user2 });
      });

      secondClient.once("join-confirmed", () => {
        secondClient.once("message-received", messageHandler);

        // Send message from first client
        setTimeout(() => {
          clientSocket.emit("send-message", {
            username: user1,
            content: testMessage,
          });
        }, 100);
      });

      // Start sequence by joining first client
      clientSocket.emit("join-chat", { username: user1 });
    });

    test("should handle user join notifications", (done) => {
      const user1 = "FirstUser";
      const user2 = "SecondUser";

      clientSocket.once("join-confirmed", () => {
        // Listen for user notifications
        clientSocket.once("user-joined", (data) => {
          try {
            expect(data).toHaveProperty("username", user2);
            expect(data).toHaveProperty("timestamp");
            done();
          } catch (error) {
            done(error);
          }
        });

        // Second user joins after
        setTimeout(() => {
          secondClient.emit("join-chat", { username: user2 });
        }, 100);
      });

      // First user joins
      clientSocket.emit("join-chat", { username: user1 });
    });
  });

  describe("Connection Cleanup", () => {
    test("should handle disconnection properly", (done) => {
      const testUsername = "DisconnectUser";

      clientSocket.once("join-confirmed", () => {
        // Simulate disconnection
        clientSocket.disconnect();

        // Verify disconnection is handled (no direct way to test,
        // but at least verify no errors)
        setTimeout(() => {
          expect(clientSocket.connected).toBe(false);
          done();
        }, 100);
      });

      clientSocket.emit("join-chat", { username: testUsername });
    });
  });
});
