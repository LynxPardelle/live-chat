# Challenge: Real-Time Chat Application

## Overview
- **Profile**: Full Stack Senior Developer
- **Estimated Duration**: 4–6 hours
- **Objective**: Evaluate technical skills, best practices, clean architecture, and seniority level

## 🧩 Challenge Description
Build a real-time chat application with scalable architecture and best practices. Multiple users will interact in a single room with real-time messages, chat history, and a functional, clear UI.

## 🛠 Functional Requirements

### Frontend
- User login with username (no real authentication)
- Message view displaying:
    - Author
    - Readable timestamp
    - Visual distinction between sent and received messages
- Display message history upon joining
- Send real-time messages using Socket.io or GraphQL Subscriptions
- Basic validation (prevent empty or excessively long messages)

### Backend
- API for:
    - Retrieving paginated history
    - Sending and saving messages
- Real-time communication via sockets or subscriptions
- MongoDB persistence
- Clean and scalable code:
    - Layer separation
    - SOLID principles, DRY, Clean Code
    - Design patterns
    - Error handling and logging

## ⚙️ Technical Requirements

### Required Stack
- **Frontend**: Vue 3 + Pinia (Vite recommended)
- **Backend**: Node.js with NestJS or Express
- **Database**: MongoDB
- **Sockets**: socket.io or GraphQL Subscriptions

### Mandatory
- ✅ 1 unit test in frontend (e.g., vitest, jest)
- ✅ 1 unit test in backend (e.g., jest, supertest)
- ✅ Project structured as in production
- ✅ README.md with: instructions, socket/subscription details, patterns used, architectural decisions

## 🎁 Extras (Optional but Highly Valued)

### 🔐 Security
- Sanitize inputs to prevent XSS
- Validate data structure in backend (DTOs, Joi, Zod, etc.)
- Limit spam (anti-flood or rate limiting)
- Use helmet or basic HTTP header configuration
- Properly escape HTML content in chat

### 🚀 Other Extras
- Image upload and sharing
- Text search in messages
- Docker / Docker Compose
- E2E testing (e.g., Cypress or Playwright)
- Deployment (Vercel, Netlify, Render, etc.)

## 📤 Submission
- GitHub or Bitbucket repository
- Accessible with complete instructions
- Professional and clear README

## 🧠 Evaluation Criteria

| Criterion | Evaluation |
|-----------|------------|
| Architecture | Clear layer separation and applied patterns |
| Clean code | Use of SOLID, DRY, scalable structure |
| Complete fullstack | Real-time communication + persistence + UI |
| Testing | Well-applied minimal tests |
| Security (optional) | Basic best practices if applicable |
| Documentation | Well-written and complete README |
| UX/UI | Clear, usable interface without obvious bugs |

Good luck and enjoy the challenge!