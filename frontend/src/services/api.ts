import axios, { type AxiosInstance } from 'axios'
import type { Message } from '@/types/chat'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:3001/api',
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
      const response = await this.client.get('/messages', {
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
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      throw error
    }
  }

  // Send message via REST API (backup method)
  async sendMessage(username: string, content: string): Promise<Message> {
    try {
      const response = await this.client.post('/messages', {
        username,
        content,
        timestamp: new Date(),
      })
      return response.data
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health')
      return response.status === 200
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

export default new ApiService()
