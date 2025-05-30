# 💬 Live Chat Application

A modern, real-time chat application built with Vue 3, Express.js, and Socket.io. Features include real-time messaging, message persistence, user management, and a comprehensive admin panel for monitoring and testing.

![Live Chat Demo](https://img.shields.io/badge/Status-Complete-brightgreen)
![Vue 3](https://img.shields.io/badge/Vue-3.5.13-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-brightgreen)

## ✨ Features

### 🚀 Core Features
- **Real-time messaging** with Socket.io
- **Message persistence** with MongoDB
- **User authentication** (username-based)
- **Message history** with pagination
- **Responsive design** for all devices
- **Input validation** and XSS protection
- **Connection status** monitoring

### 🛠 Admin Panel
- **API testing interface** for all endpoints
- **Database statistics** (messages, users, connections)
- **Real-time Socket.io monitoring**
- **Store state inspection** (Pinia)
- **Message lookup** by ID
- **Health checks** and diagnostics

### 🔒 Security Features
- Input sanitization and validation
- CORS configuration
- Rate limiting protection (WIP)
- XSS prevention (WIP)
- Secure data transmission (WIP)

## 🏗 Architecture

### Frontend (Vue 3 + TypeScript)
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── chat/           # Chat-specific components
│   │   └── admin/          # Admin panel components
│   ├── views/              # Page-level components
│   ├── stores/             # Pinia state management
│   ├── services/           # API communication layer
│   ├── types/              # TypeScript type definitions
│   └── router/             # Vue Router configuration
```

### Backend (Express.js + MongoDB)
```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic layer
│   ├── socket/            # Socket.io event handlers
│   ├── validators/        # Input validation middleware
│   └── config/            # Database and app configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **MongoDB** (local or cloud)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd live-chat
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 3. Environment Setup
Create a `.env` file in the backend directory:
```env
# Backend Configuration
PORT=3001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/livechat
DB_NAME=livechat

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Socket.io Configuration
SOCKET_CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Start MongoDB
```bash
# Using MongoDB service (Windows)
net start MongoDB

# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Using MongoDB Atlas (cloud) - just update MONGODB_URI in .env
```

### 5. Run the Application
```bash
# Start both frontend and backend
npm run dev:frontend & npm run dev:backend

# Or start individually
cd backend && npm start
cd frontend && npm run dev
```

### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Admin Panel**: http://localhost:5173/admin

## 📱 Usage Guide

### For Users
1. **Join Chat**: Enter your username on the login screen
2. **Send Messages**: Type your message and press Enter or click Send
3. **View History**: Scroll up to see previous messages
4. **Real-time Updates**: Messages appear instantly for all users

### For Developers/Admins
1. **Access Admin Panel**: Click "Admin" button in chat header or visit `/admin`
2. **Test APIs**: Use the API Testing tab to test all endpoints
3. **Monitor Status**: Check Socket.io connections and store state
4. **Debug Issues**: View real-time diagnostics and error logs

## 🧪 Testing

### Frontend Tests
```bash
cd frontend

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:unit -- --watch
```

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit        # Unit tests
npm run test:integration # API integration tests
npm run test:socket      # Socket.io tests
```

## 📡 API Reference

### REST Endpoints

#### Messages
- `GET /api/messages` - Get paginated messages
- `POST /api/messages` - Create a new message
- `GET /api/messages/recent?limit=10` - Get recent messages
- `GET /api/messages/:id` - Get message by ID
- `GET /api/messages/stats` - Get database statistics

#### System
- `GET /api` - API information and health check

### Socket.io Events

#### Client → Server
- `join-chat` - Join chat with username
- `send-message` - Send a new message
- `disconnect` - User disconnects

#### Server → Client
- `user-joined` - User joined notification
- `new-message` - New message broadcast
- `user-left` - User left notification
- `error` - Error notifications

## 🛠 Development

### Project Scripts
```bash
# Root level scripts
npm run dev:frontend      # Start frontend dev server
npm run dev:backend       # Start backend dev server
npm run build:frontend    # Build frontend for production
npm run build:backend     # Build backend for production
npm run test:frontend     # Run frontend tests
npm run test:backend      # Run backend tests

# Frontend specific
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run format           # Format code with Prettier

# Backend specific
npm start                # Start production server
npm run dev              # Start with nodemon (auto-reload)
npm test                 # Run Jest tests
npm run test:watch       # Run tests in watch mode
```

### Code Quality
- **ESLint** + **Prettier** for code formatting
- **TypeScript** for type safety
- **Vue 3 Composition API** for reactive components
- **Jest** + **Vitest** for testing
- **Playwright** for E2E testing

## 🏛 Design Patterns & Architecture

### Backend Patterns
- **MVC Architecture** - Controllers, Models, Views separation
- **Service Layer Pattern** - Business logic isolation
- **Repository Pattern** - Data access abstraction
- **Middleware Pattern** - Request/response processing
- **Observer Pattern** - Socket.io event handling

### Frontend Patterns
- **Composition API** - Vue 3 reactive composition
- **Store Pattern** - Centralized state management (Pinia)
- **Service Layer** - API communication abstraction
- **Component Composition** - Reusable UI components
- **Router Pattern** - Navigation and routing

### Security Practices
- **Input Validation** - Express-validator middleware
- **XSS Prevention** - HTML escaping and sanitization (WIP)
- **CORS Configuration** - Controlled cross-origin access
- **Rate Limiting** - Anti-spam protection (WIP)
- **Error Handling** - Secure error responses (WIP)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway/Heroku)
```bash
cd backend
# Set environment variables
# Deploy with start script: "node server.js"
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🐛 Troubleshooting

### Common Issues

#### Connection Problems
- Check MongoDB is running
- Verify CORS origins in backend `.env`
- Ensure ports 3001 (backend) and 5173 (frontend) are available

#### Socket.io Issues
- Clear browser cache and cookies
- Check browser developer console for errors
- Verify WebSocket connections in Network tab

#### Build Errors
- Delete `node_modules` and `package-lock.json`, then `npm install`
- Check Node.js version (18+ required)
- Verify all environment variables are set

### Debug Mode
```bash
# Backend debug logging
DEBUG=socket.io:* npm run dev

# Frontend debug in browser console
localStorage.debug = 'socket.io-client:*'
```

## 📁 Project Structure

```
live-chat/
├── 📁 frontend/             # Vue 3 frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/   # UI components
│   │   ├── 📁 views/        # Page components
│   │   ├── 📁 stores/       # Pinia stores
│   │   ├── 📁 services/     # API services
│   │   ├── 📁 types/        # TypeScript types
│   │   └── 📁 router/       # Vue Router
│   ├── 📁 e2e/            # E2E tests
│   └── package.json
├── 📁 backend/              # Express.js backend
│   ├── 📁 src/
│   │   ├── 📁 controllers/  # Route handlers
│   │   ├── 📁 models/       # MongoDB models
│   │   ├── 📁 routes/       # API routes
│   │   ├── 📁 services/     # Business logic
│   │   ├── 📁 socket/       # Socket.io handlers
│   │   ├── 📁 validators/   # Input validation
│   │   └── 📁 config/       # Configuration
│   ├── 📁 tests/           # Test files
│   └── package.json
├── 📁 planning/            # Project documentation
├── 📁 changelog-backend/   # Backend development logs
├── 📁 changelog-front/     # Frontend development logs
├── README.md               # This file
├── instructions.md         # Original challenge instructions
└── package.json           # Root package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Developer** - *Full Stack Development* - Live Chat Application

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Socket.io team for real-time capabilities
- MongoDB team for the database solution
- Express.js community for the backend framework

---

**Built with ❤️ using Vue 3, Express.js, and Socket.io**