import { io, Socket } from 'socket.io-client'
import type { Message } from '@/types/chat'

/**
 * Socket.io Service
 * Manages WebSocket connection and communication with the server
 */
class SocketService {
  private socket: Socket | null = null
  private serverUrl: string = 'http://localhost:3001'

  /**
   * Connect to the socket.io server
   */
  connect(): Socket {
    if (this.socket) {
      this.disconnect()
    }

    this.socket = io(this.serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    console.log('Connecting to Socket.io server:', this.serverUrl)

    // Setup default error handler
    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error)
    })

    return this.socket
  }

  /**
   * Disconnect from the socket.io server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      console.log('Disconnected from Socket.io server')
    }
  }

  /**
   * Join chat room with username
   */
  joinChat(username: string): void {
    if (this.socket) {
      console.log('Joining chat as:', username)
      this.socket.emit('join-chat', { username })
    } else {
      console.error('Cannot join chat: Socket not connected')
    }
  }

  /**
   * Send a message to the chat
   */
  sendMessage(username: string, content: string): void {
    if (this.socket) {
      this.socket.emit('send-message', {
        username,
        content,
      })
      console.log('Message sent:', { username, content: content.substring(0, 20) + '...' })
    } else {
      console.error('Cannot send message: Socket not connected')
    }
  }

  /**
   * Register listener for incoming messages
   */
  onMessageReceived(callback: (message: Message) => void): void {
    if (this.socket) {
      this.socket.on('message-received', callback)
    }
  }

  /**
   * Register listener for join confirmation
   */
  onJoinConfirmed(callback: (data: { username: string; message: string }) => void): void {
    if (this.socket) {
      this.socket.on('join-confirmed', callback)
    }
  }

  /**
   * Register listener for chat history
   */
  onChatHistory(callback: (data: { messages: Message[]; count: number }) => void): void {
    if (this.socket) {
      this.socket.on('chat-history', callback)
    }
  }

  /**
   * Listen for connection events
   */
  onConnect(callback: () => void): void {
    if (this.socket) {
      this.socket.on('connect', callback)
    }
  }

  onDisconnect(callback: () => void): void {
    if (this.socket) {
      this.socket.on('disconnect', callback)
    }
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  /**
   * Get connection status
   */
  get isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export default new SocketService()
