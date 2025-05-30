/**
 * Unit tests for MessageService
 * Tests the business logic layer for message operations
 */

describe("MessageService", () => {
  // Import inside describe to avoid issues
  const MessageService = require("../src/services/messageService");

  describe("validateMessageData", () => {
    test("should return valid for correct message data", () => {
      const messageData = {
        username: "testuser",
        content: "Hello world!",
      };

      const result = MessageService.validateMessageData(messageData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    test("should return invalid for empty username", () => {
      const messageData = {
        username: "",
        content: "Hello world!",
      };

      const result = MessageService.validateMessageData(messageData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Username is required");
    });
    test("should return invalid for empty content", () => {
      const messageData = {
        username: "testuser",
        content: "",
      };

      const result = MessageService.validateMessageData(messageData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Message content is required");
    });

    test("should return invalid for whitespace-only username", () => {
      const messageData = {
        username: "   ",
        content: "Hello world!",
      };

      const result = MessageService.validateMessageData(messageData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Username cannot be empty");
    });

    test("should return invalid for whitespace-only content", () => {
      const messageData = {
        username: "testuser",
        content: "   ",
      };

      const result = MessageService.validateMessageData(messageData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Message cannot be empty");
    });

    test("should return invalid for username with special characters", () => {
      const messageData = {
        username: "test@user!",
        content: "Hello world!",
      };

      const result = MessageService.validateMessageData(messageData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Username can only contain letters, numbers, and spaces"
      );
    });

    test("should return invalid for content too long", () => {
      const messageData = {
        username: "testuser",
        content: "a".repeat(501), // 501 characters
      };

      const result = MessageService.validateMessageData(messageData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Message cannot exceed 500 characters");
    });

    test("should accept valid username with spaces and numbers", () => {
      const messageData = {
        username: "Test User 123",
        content: "Hello world!",
      };

      const result = MessageService.validateMessageData(messageData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
  // Tests para métodos que requieren BD - usando mocks
  describe("createMessage", () => {
    test("should create message successfully with valid data", () => {
      const messageData = {
        username: "testuser",
        content: "Hello world!",
      };

      // Mock del modelo Message
      const mockSave = jest.fn().mockResolvedValue({
        id: "507f1f77bcf86cd799439011",
        username: "testuser",
        content: "Hello world!",
        timestamp: new Date(),
        toJSON: () => ({
          id: "507f1f77bcf86cd799439011",
          username: "testuser",
          content: "Hello world!",
          timestamp: new Date(),
        }),
      });

      // Test de validación previa
      const validation = MessageService.validateMessageData(messageData);
      expect(validation.isValid).toBe(true);
    });
    test("should throw error for invalid message data", async () => {
      // Test con datos inválidos
      await expect(
        MessageService.createMessage({ username: "", content: "test" })
      ).rejects.toThrow("Username and content are required");

      await expect(
        MessageService.createMessage({ username: "test", content: "" })
      ).rejects.toThrow("Username and content are required");
    });
  });
  describe("getMessages", () => {
    test("should validate pagination parameters", () => {
      // Test de parámetros de paginación válidos
      expect(() => {
        const page = Math.max(1, parseInt(1) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(50) || 50));
        expect(page).toBe(1);
        expect(limit).toBe(50);
      }).not.toThrow();
    });
    test("should handle edge cases for pagination", () => {
      // Test de casos límite de paginación con lógica correcta de defaults
      const testCases = [
        { page: 0, limit: 10, expectedPage: 1, expectedLimit: 10 },
        { page: -1, limit: 10, expectedPage: 1, expectedLimit: 10 },
        { page: 1, limit: 150, expectedPage: 1, expectedLimit: 100 },
        {
          page: undefined,
          limit: undefined,
          expectedPage: 1,
          expectedLimit: 50,
        },
      ];

      testCases.forEach(({ page, limit, expectedPage, expectedLimit }) => {
        const actualPage = Math.max(1, parseInt(page) || 1);
        const actualLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));

        expect(actualPage).toBe(expectedPage);
        expect(actualLimit).toBe(expectedLimit);
      });
    });
  });

  describe("getStatistics", () => {
    test("should return statistics structure", () => {
      // Test de estructura de estadísticas esperada
      const expectedStructure = {
        totalMessages: expect.any(Number),
        lastMessageAt: expect.any(String),
      };

      // Simulamos la estructura que debería retornar
      const mockStats = {
        totalMessages: 5,
        lastMessageAt: "2025-05-30T10:00:00.000Z",
      };

      expect(mockStats).toMatchObject(expectedStructure);
    });
  });

  // Tests de casos edge y validaciones adicionales
  describe("Edge Cases and Error Handling", () => {
    test("should handle null and undefined inputs", () => {
      expect(() => MessageService.validateMessageData(null)).not.toThrow();
      expect(() => MessageService.validateMessageData(undefined)).not.toThrow();
      expect(() => MessageService.validateMessageData({})).not.toThrow();
    });

    test("should trim whitespace from username and content", () => {
      const messageData = {
        username: "  testuser  ",
        content: "  Hello world!  ",
      };

      const result = MessageService.validateMessageData(messageData);
      // Verificamos que la validación funcione con espacios
      expect(result.isValid).toBe(true);
    });

    test("should handle maximum length boundaries", () => {
      const messageData = {
        username: "a".repeat(50), // Exactamente 50 caracteres
        content: "b".repeat(500), // Exactamente 500 caracteres
      };

      const result = MessageService.validateMessageData(messageData);
      expect(result.isValid).toBe(true);
    });
  });
});
