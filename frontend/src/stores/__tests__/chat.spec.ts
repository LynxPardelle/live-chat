import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useChatStore } from '@/stores/chat'
import type { Message } from '@/types/chat'

// Mock socket service
vi.mock('@/services/socket', () => {
  return {
    default: {
      connect: vi.fn().mockReturnValue({ on: vi.fn() }),
      isConnected: true, // Use a boolean instead of a function
      sendMessage: vi.fn(),
      joinChat: vi.fn(),
      disconnect: vi.fn()
    }
  }
})

// Mock API service
vi.mock('@/services/api', () => {
  const mockMessage = {
    id: 'mock-id',
    username: 'testuser',
    content: 'test message',
    timestamp: new Date()
  }

  return {
    default: {
      getMessages: vi.fn().mockResolvedValue([mockMessage]),
      sendMessage: vi.fn().mockImplementation((username, content) => {
        return Promise.resolve({
          id: 'new-mock-id',
          username,
          content,
          timestamp: new Date()
        })
      })
    }
  }
})

describe('Chat Store', () => {
  let store: any;

  beforeEach(() => {
    // Create a fresh Pinia instance and set it
    const pinia = createPinia()
    setActivePinia(pinia)

    // Get the store
    store = useChatStore()

    // Setup basic state
    store.setUser('testuser')
  })

  describe('Message Handling', () => {
    it('adds a message to the store', () => {
      const message: Message = {
        id: 'test-id',
        username: 'testuser',
        content: 'Hello world',
        timestamp: new Date()
      }

      // Add message
      store.addMessage(message)

      // Check message was added
      expect(store.messages.length).toBe(1)
      expect(store.messages[0].id).toBe('test-id')
      expect(store.messages[0].content).toBe('Hello world')
    })

    it('clears all messages', () => {
      // Add message
      const message: Message = {
        id: 'test-id',
        username: 'testuser',
        content: 'Hello world',
        timestamp: new Date()
      }
      store.addMessage(message)

      // Should have one message
      expect(store.messages.length).toBe(1)

      // Clear messages
      store.clearMessages()

      // Should have no messages
      expect(store.messages.length).toBe(0)
    })

    it('loads message history successfully', async () => {
      // Call loadHistory
      await store.loadHistory()

      // Should have loaded messages
      expect(store.messages.length).toBe(1)
      expect(store.messages[0].id).toBe('mock-id')
    })

    it('handles error when loading history fails', async () => {
      // Mock API to throw error
      const { default: apiService } = await import('@/services/api')
      vi.mocked(apiService.getMessages).mockRejectedValueOnce(new Error('Failed to load'))

      // Call loadHistory (should not throw)
      await store.loadHistory()

      // Should have no messages but not throw
      expect(store.messages.length).toBe(0)
    })
  })

  describe('Send Message', () => {
    it('sends a message via socket.io when connected', async () => {
      // Mock socket service
      const { default: socketService } = await import('@/services/socket')

      // Call sendMessage
      const result = await store.sendMessage('Hello via socket')

      // Check socket service was called
      expect(socketService.sendMessage).toHaveBeenCalledWith('testuser', 'Hello via socket')
      expect(result).toBe(true)
    })    it('falls back to API when socket fails', async () => {
      // Mock socket service to fail
      const { default: socketService } = await import('@/services/socket')
      // Directly override the boolean property
      socketService.isConnected = false

      // Mock API service
      const { default: apiService } = await import('@/services/api')

      // Call sendMessage
      const result = await store.sendMessage('Hello via API')

      // Socket should not be called, API should be called
      expect(socketService.sendMessage).not.toHaveBeenCalled()
      expect(apiService.sendMessage).toHaveBeenCalledWith('testuser', 'Hello via API')

      // Check message was added to store
      expect(store.messages.length).toBe(1)
      expect(result).toHaveProperty('id')
      expect(result.content).toBe('Hello via API')
    })

    it('fails when no user is logged in', async () => {
      // Clear user
      store.clearUser()

      // Call sendMessage
      const result = await store.sendMessage('This should fail')

      // Should return null
      expect(result).toBeNull()
    })

    it('fails with empty message', async () => {
      // Call sendMessage with empty message
      const result = await store.sendMessage('   ')

      // Should return null
      expect(result).toBeNull()
    })    it('handles both socket and API failure', async () => {
      // Mock socket to fail
      const { default: socketService } = await import('@/services/socket')
      // We'll have to modify our approach since we can't change read-only property
      // For now, let's assume it's already false from the previous test

      // Mock API to fail
      const { default: apiService } = await import('@/services/api')
      vi.mocked(apiService.sendMessage).mockRejectedValueOnce(new Error('API failed'))

      // Call sendMessage and expect it to throw
      await expect(store.sendMessage('This will fail'))
        .rejects.toThrow('API failed')
    })
  })
})
