import { defineStore } from 'pinia'
import type { User, Message, ChatState } from '@/types/chat'

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    currentUser: null,
    messages: [],
    isConnected: false,
    isLoading: false,
    socket: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.currentUser,
    messageCount: (state) => state.messages.length,
    sortedMessages: (state) =>
      [...state.messages].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      ),
  },

  actions: {
    // Set current user
    setUser(username: string) {
      this.currentUser = { username: username.trim() }
    },

    // Clear user (logout)
    clearUser() {
      this.currentUser = null
      this.disconnect()
    },

    // Add message to the store
    addMessage(message: Message) {
      this.messages.push(message)
    },

    // Set messages (for initial load)
    setMessages(messages: Message[]) {
      this.messages = messages
    },

    // Clear all messages
    clearMessages() {
      this.messages = []
    },

    // Set connection status
    setConnectionStatus(status: boolean) {
      this.isConnected = status
    },

    // Set loading state
    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    // Set socket instance
    setSocket(socket: any) {
      this.socket = socket
    },

    // Connect to chat with Socket.io
    async connectToChat() {
      this.setLoading(true)
      try {
        // Import socket service dynamically to avoid circular imports
        const { default: socketService } = await import('@/services/socket')

        // Connect to socket.io server
        const socket = socketService.connect()
        this.setSocket(socket)

        // Set up event listeners
        this.setupSocketListeners(socketService)

        // Join the chat when socket connects
        if (this.currentUser) {
          socket.on('connect', () => {
            socketService.joinChat(this.currentUser!.username)
            this.setConnectionStatus(true)
            console.log('Socket connected and joined chat as:', this.currentUser!.username)
          })
        }

        return true
      } catch (error: any) {
        console.error('Failed to connect to chat:', error)
        this.setConnectionStatus(false)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Setup socket event listeners
    setupSocketListeners(socketService: any) {
      // Handle connection events
      socketService.onConnect(() => {
        console.log('Socket connected')
        this.setConnectionStatus(true)
      })

      socketService.onDisconnect(() => {
        console.log('Socket disconnected')
        this.setConnectionStatus(false)
      })

      // Handle join confirmation
      socketService.onJoinConfirmed((data: { username: string; message: string }) => {
        console.log('Join confirmed:', data)
      })

      // Handle chat history
      socketService.onChatHistory((data: { messages: any[]; count: number }) => {
        console.log('Chat history received:', data.messages.length, 'messages')
        // Transform messages from server format to client format
        const messages = data.messages.map((msg: any) => ({
          id: msg._id || msg.id,
          username: msg.username,
          content: msg.content,
          timestamp: new Date(msg.timestamp || msg.createdAt),
        }))
        this.setMessages(messages)
      })

      // Handle incoming messages
      socketService.onMessageReceived((message: any) => {
        console.log('Message received:', message)
        // Transform message to client format if needed
        const newMessage: Message = {
          id: message.id || message._id,
          username: message.username,
          content: message.content,
          timestamp: new Date(message.timestamp || message.createdAt),
        }
        this.addMessage(newMessage)
      })
    },

    // Send message via Socket.io
    async sendMessage(content: string) {
      if (!this.currentUser || !content.trim()) {
        return null
      }

      try {
        const { default: socketService } = await import('@/services/socket')

        // Check if socket is connected
        if (!socketService.isConnected) {
          throw new Error('Socket not connected')
        }

        // Send message via socket
        socketService.sendMessage(this.currentUser.username, content)

        return true
      } catch (error: any) {
        console.error('Failed to send message via socket:', error)

        // Fallback to API if socket fails
        try {
          console.warn('Falling back to API for sending message')
          const { default: apiService } = await import('@/services/api')
          const newMessage = await apiService.sendMessage(this.currentUser.username, content)
          this.addMessage(newMessage)
          return newMessage
        } catch (apiError: any) {
          console.error('API fallback also failed:', apiError)
          throw apiError
        }
      }
    },

    // Load message history (implement with real API)
    async loadHistory() {
      this.setLoading(true)
      try {
        // Import API service dynamically to avoid circular imports
        const { default: apiService } = await import('@/services/api')
        const messages = await apiService.getMessages()
        this.setMessages(messages)
        console.log('Message history loaded:', messages.length, 'messages')
      } catch (error: any) {
        console.error('Failed to load history:', error)
      } finally {
        this.setLoading(false)
      }
    },

    // Disconnect from chat
    disconnect() {
      if (this.socket) {
        this.socket.disconnect()
        this.setSocket(null)
      }
      this.setConnectionStatus(false)
      this.clearMessages()
    },
  },
})
