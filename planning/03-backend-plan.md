# Plan de Implementación del Backend (Express + Socket.io)

## Dependencias Principales
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "jest": "^29.6.2",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.1"
  }
}
```

## Modelo de Datos

### Message Schema (MongoDB)
```javascript
{
  _id: ObjectId,
  username: String (required, max 50 chars),
  content: String (required, max 500 chars),
  timestamp: Date (default: Date.now),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### REST API
- `GET /api/messages` - Obtener historial paginado
  - Query params: `page`, `limit` (default: page=1, limit=50)
  - Response: `{ messages: [], totalPages: number, currentPage: number }`

- `POST /api/messages` - Crear mensaje (opcional, puede hacerse solo via Socket)
  - Body: `{ username: string, content: string }`
  - Response: `{ message: MessageObject }`

## Socket.io Events

### Cliente → Servidor
- `join-chat` - Usuario se une al chat
  - Payload: `{ username: string }`
  - Response: Confirmación y historial inicial

- `send-message` - Enviar nuevo mensaje
  - Payload: `{ username: string, content: string }`
  - Validación y broadcast a todos los clientes

- `disconnect` - Usuario se desconecta
  - Cleanup automático

### Servidor → Cliente
- `message-received` - Nuevo mensaje para todos
  - Payload: `{ id, username, content, timestamp }`

- `user-joined` - Notificación de nuevo usuario (opcional)
  - Payload: `{ username }`

- `error` - Errores de validación
  - Payload: `{ message: string }`

## Implementación por Fases

### Fase 1: Setup Básico
1. Inicializar proyecto Express
2. Configurar MongoDB con Mongoose
3. Setup básico de Socket.io
4. Estructura de carpetas

### Fase 2: Modelo y Persistencia
1. Crear modelo Message
2. Implementar messageService
3. Conexión a MongoDB

### Fase 3: API REST
1. Controlador de mensajes
2. Rutas para historial
3. Validaciones con express-validator

### Fase 4: Socket.io
1. Implementar eventos básicos
2. Broadcast de mensajes
3. Manejo de conexiones

### Fase 5: Testing
1. Setup de Jest
2. Test unitario del messageService
3. Test de integración con Supertest

## Validaciones Backend
- Username: requerido, 1-50 caracteres, solo alfanuméricos y espacios
- Content: requerido, 1-500 caracteres, no solo espacios
- Rate limiting básico por IP (opcional pero recomendado)

## Manejo de Errores
- Try-catch en todos los controladores
- Logs con console.error (simple)
- Respuestas consistentes de error
- Validación de entrada en todas las rutas
