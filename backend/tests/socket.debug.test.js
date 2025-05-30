/**
 * Simple Socket.io Debug Test
 * To understand connection and event issues
 */

const { Server } = require("socket.io");
const { io: Client } = require("socket.io-client");
const http = require("http");
const app = require("../src/app");
const { initializeSocketHandlers } = require("../src/socket/socketHandler");

describe("Socket.io Debug Tests", () => {
  let httpServer;
  let ioServer;
  let clientSocket;

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
      console.log(`Debug test server running on port ${port}`);

      // Connect test client
      clientSocket = Client(`http://localhost:${port}`, {
        transports: ["websocket"],
      });

      clientSocket.on("connect", () => {
        console.log("Debug client connected");
        done();
      });

      clientSocket.on("connect_error", (error) => {
        console.error("Debug client connection error:", error);
        done(error);
      });
    });
  });

  afterAll((done) => {
    console.log("Cleaning up debug test");
    ioServer.close();
    clientSocket.close();
    httpServer.close(done);
  });

  test("should connect and emit simple join-chat", (done) => {
    console.log("Starting join-chat debug test");

    // Set up event listeners with debugging
    clientSocket.once("join-confirmed", (data) => {
      console.log("Received join-confirmed:", data);
      expect(data).toHaveProperty("username");
      done();
    });

    clientSocket.once("error", (error) => {
      console.error("Received socket error:", error);
      done(new Error(`Socket error: ${error.message}`));
    });

    // Emit join-chat event
    console.log("Emitting join-chat event");
    clientSocket.emit("join-chat", { username: "DebugUser" });

    // Fallback timeout
    setTimeout(() => {
      done(new Error("Test timed out - no events received"));
    }, 3000);
  }, 5000);
});
