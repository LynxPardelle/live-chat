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
