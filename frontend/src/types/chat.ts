// Chat store types
export interface User {
  username: string
}

export interface Message {
  id: string
  username: string
  content: string
  timestamp: Date
}

export interface ChatState {
  currentUser: User | null
  messages: Message[]
  isConnected: boolean
  isLoading: boolean
  socket: any // Socket.io instance
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalMessages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface MessagesPaginatedResponse {
  messages: Message[]
  pagination: PaginationInfo
}

export interface DatabaseStats {
  totalMessages: number
  lastMessageTimestamp?: Date
  usersCount?: number
  messagesPerDay?: number
}

export interface ApiHealthStatus {
  status: string
  timestamp: string
  environment: string
  database: string
}

export interface ApiInfo {
  message: string
  version: string
  status: string
  statistics: DatabaseStats
  features: {
    restApi: string
    socketio: string
    realTimeChat: string
    messageHistory: string
  }
  apiEndpoints: Record<string, string>
  socketEvents: {
    client: string[]
    server: string[]
  }
}
