// Punto de entrada de la aplicación
// Fase 4: Socket.io Integration

const http = require("http");
const app = require("./src/app");
const { Server } = require("socket.io");
const { initializeSocketHandlers } = require("./src/socket/socketHandler");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Crear servidor HTTP
    const server = http.createServer(app);

    // Configurar Socket.io con CORS
    const io = new Server(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(",") || [
          "http://localhost:5173",
        ],
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    // Inicializar manejadores de Socket.io
    initializeSocketHandlers(io);

    // Iniciar servidor
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `🔌 Socket.io enabled with CORS for: ${
          process.env.ALLOWED_ORIGINS || "http://localhost:5173"
        }`
      );
    });

    return { server, io };
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

// Iniciar servidor solo si este archivo es ejecutado directamente
if (require.main === module) {
  startServer();
}

module.exports = { startServer };
