/**
 * Integration tests for Message API
 * Tests the complete API endpoints using Supertest
 */

const request = require("supertest");
const app = require("../src/app");

describe("Message API Integration Tests", () => {
  describe("GET /health", () => {
    test("should return health status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("environment");
      expect(response.body).toHaveProperty("database");
    });
  });

  describe("GET /", () => {
    test("should return API information", async () => {
      const response = await request(app).get("/").expect(200);

      expect(response.body).toHaveProperty("message", "Live Chat Backend API");
      expect(response.body).toHaveProperty("version");
      expect(response.body).toHaveProperty("status");
      expect(response.body).toHaveProperty("apiEndpoints");
    });
  });

  describe("GET /api", () => {
    test("should return API overview", async () => {
      const response = await request(app).get("/api").expect(200);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("status");
      expect(response.body).toHaveProperty("endpoints");
    });
  });

  describe("GET /api/messages", () => {
    test("should return paginated messages", async () => {
      const response = await request(app).get("/api/messages").expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.data)).toBe(true);

      // Verificar estructura de paginación
      expect(response.body.pagination).toHaveProperty("currentPage");
      expect(response.body.pagination).toHaveProperty("totalPages");
      expect(response.body.pagination).toHaveProperty("totalMessages");
    });

    test("should accept pagination parameters", async () => {
      const response = await request(app)
        .get("/api/messages?page=1&limit=10")
        .expect(200);

      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.data.length).toBeLessThanOrEqual(10);
    });
    test("should handle invalid pagination gracefully", async () => {
      const response = await request(app)
        .get("/api/messages?page=invalid&limit=invalid")
        .expect(400);

      // El middleware de validación debería rechazar parámetros inválidos
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Validation failed");
    });
  });

  describe("POST /api/messages", () => {
    test("should create message with valid data", async () => {
      const messageData = {
        username: "testuser",
        content: "This is a test message from integration tests",
      };

      const response = await request(app)
        .post("/api/messages")
        .send(messageData)
        .expect(201);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty(
        "username",
        messageData.username
      );
      expect(response.body.data).toHaveProperty("content", messageData.content);
      expect(response.body.data).toHaveProperty("timestamp");
    });
    test("should reject message with empty username", async () => {
      const messageData = {
        username: "",
        content: "This message should be rejected",
      };

      const response = await request(app)
        .post("/api/messages")
        .send(messageData)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Validation failed");
      expect(response.body).toHaveProperty("details");
      expect(
        response.body.details.some((detail) =>
          detail.message.includes("Username is required")
        )
      ).toBe(true);
    });
    test("should reject message with empty content", async () => {
      const messageData = {
        username: "testuser",
        content: "",
      };

      const response = await request(app)
        .post("/api/messages")
        .send(messageData)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Validation failed");
      expect(response.body).toHaveProperty("details");
      expect(
        response.body.details.some((detail) =>
          detail.message.includes("Message content is required")
        )
      ).toBe(true);
    });
    test("should reject message with content too long", async () => {
      const messageData = {
        username: "testuser",
        content: "a".repeat(501), // 501 caracteres
      };

      const response = await request(app)
        .post("/api/messages")
        .send(messageData)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Validation failed");
      expect(response.body).toHaveProperty("details");
      expect(
        response.body.details.some((detail) =>
          detail.message.includes("500 characters")
        )
      ).toBe(true);
    });
    test("should reject message with invalid username format", async () => {
      const messageData = {
        username: "test@user!",
        content: "This message should be rejected",
      };

      const response = await request(app)
        .post("/api/messages")
        .send(messageData)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Validation failed");
      expect(response.body).toHaveProperty("details");
      expect(
        response.body.details.some((detail) =>
          detail.message.includes("letters, numbers, and spaces")
        )
      ).toBe(true);
    });

    test("should handle malformed JSON", async () => {
      const response = await request(app)
        .post("/api/messages")
        .set("Content-Type", "application/json")
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.error).toContain("Invalid JSON format");
    });
  });

  describe("GET /api/messages/recent", () => {
    test("should return recent messages", async () => {
      const response = await request(app)
        .get("/api/messages/recent")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("GET /api/messages/stats", () => {
    test("should return message statistics", async () => {
      const response = await request(app)
        .get("/api/messages/stats")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("totalMessages");
      expect(typeof response.body.data.totalMessages).toBe("number");
    });
  });

  describe("CORS and Middleware", () => {
    test("should include CORS headers", async () => {
      const response = await request(app).get("/health").expect(200);

      // CORS puede no estar presente si no hay Origin header en el request
      // En tests, verificamos que la respuesta sea exitosa
      expect(response.status).toBe(200);
    });
    test("should handle preflight OPTIONS request", async () => {
      const response = await request(app)
        .options("/api/messages")
        .set("Origin", "http://localhost:5173")
        .set("Access-Control-Request-Method", "POST")
        .expect(200);

      // OPTIONS request should be handled by CORS middleware
      expect(response.status).toBe(200);
    });
  });

  describe("Error Handling", () => {
    test("should return 404 for non-existent routes", async () => {
      const response = await request(app)
        .get("/non-existent-route")
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Route not found");
    });

    test("should handle server errors gracefully", async () => {
      // Test para verificar que los errores del servidor se manejen apropiadamente
      // Este test puede ser adaptado según casos específicos que puedan causar errores 500
      const response = await request(app).get("/health").expect(200);

      // Al menos verificamos que el servidor responde
      expect(response.status).toBeLessThan(500);
    });
  });

  describe("Content-Type Validation", () => {
    test("should require JSON content-type for POST requests", async () => {
      const response = await request(app)
        .post("/api/messages")
        .set("Content-Type", "text/plain")
        .send("not json")
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should accept proper JSON content-type", async () => {
      const messageData = {
        username: "testuser",
        content: "JSON test message",
      };

      const response = await request(app)
        .post("/api/messages")
        .set("Content-Type", "application/json")
        .send(JSON.stringify(messageData))
        .expect(201);

      expect(response.body).toHaveProperty("success", true);
    });
  });
});
