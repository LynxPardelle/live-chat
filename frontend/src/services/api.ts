import axios, { type AxiosInstance } from 'axios'
import type {
  Message,
  ApiResponse,
  MessagesPaginatedResponse,
  DatabaseStats,
  ApiHealthStatus,
  ApiInfo,
} from '@/types/chat'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:3001',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url)
        return config
      },
      (error) => {
        console.error('API Request Error:', error)
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.config.url)
        return response
      },
      (error) => {
        console.error('API Response Error:', error.response?.status, error.config?.url)
        return Promise.reject(error)
      },
    )
  }

  // Get message history with pagination
  async getMessages(page: number = 1, limit: number = 50): Promise<Message[]> {
    try {
      const response = await this.client.get('/api/messages', {
        params: { page, limit },
      })

      // Map backend response format to frontend format
      const messages = response.data.data || []
      return messages.map((msg: any) => ({
        id: msg._id,
        username: msg.username,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }))
    } catch (error: any) {
      console.error('Failed to fetch messages:', error)
      throw error
    }
  }

  // Send message via REST API (backup method)
  async sendMessage(username: string, content: string): Promise<Message> {
    try {
      const response = await this.client.post('/api/messages', {
        username,
        content,
        timestamp: new Date(),
      })

      const msg = response.data.data
      return {
        id: msg._id || msg.id,
        username: msg.username,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }
    } catch (error: any) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  // Get recent messages for new users joining
  async getRecentMessages(limit: number = 20): Promise<Message[]> {
    try {
      const response = await this.client.get('/api/messages/recent', {
        params: { limit },
      })

      // Map backend response format to frontend format
      const messages = response.data.data || []
      return messages.map((msg: any) => ({
        id: msg._id || msg.id,
        username: msg.username,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }))
    } catch (error: any) {
      console.error('Failed to fetch recent messages:', error)
      throw error
    }
  }

  // Get message by ID
  async getMessageById(messageId: string): Promise<Message | null> {
    try {
      const response = await this.client.get(`/api/messages/${messageId}`)

      if (!response.data.success) {
        return null
      }

      const msg = response.data.data
      return {
        id: msg._id || msg.id,
        username: msg.username,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }
    } catch (error: any) {
      console.error('Failed to fetch message by ID:', error)
      if ((error as any).response?.status === 404) {
        return null
      }
      throw error
    }
  }

  // Get database statistics
  async getStatistics(): Promise<DatabaseStats> {
    try {
      const response = await this.client.get('/api/messages/stats')

      const stats = response.data.data
      return {
        totalMessages: stats.totalMessages || 0,
        lastMessageTimestamp: stats.lastMessageTimestamp
          ? new Date(stats.lastMessageTimestamp)
          : undefined,
      }
    } catch (error: any) {
      console.error('Failed to fetch statistics:', error)
      throw error
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health')
      return response.status === 200
    } catch (error: any) {
      console.error('Health check failed:', error)
      return false
    }
  }

  // Get API information
  async getApiInfo(): Promise<ApiInfo> {
    try {
      const response = await this.client.get('/')
      return response.data
    } catch (error: any) {
      console.error('Failed to fetch API info:', error)
      throw error
    }
  }
}

export default new ApiService()
