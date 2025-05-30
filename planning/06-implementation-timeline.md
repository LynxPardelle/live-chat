# Plan de Implementación Paso a Paso

## Fase 1: Setup del Proyecto (30 min)

### 1.1 Estructura inicial
```bash
# Crear directorios principales
mkdir frontend backend
cd backend && npm init -y
cd ../frontend && npm create vue@latest . --template base
```

### 1.2 Dependencias Backend
```bash
cd backend
npm install express socket.io mongoose cors express-validator dotenv
npm install -D jest supertest nodemon
```

### 1.3 Dependencias Frontend
```bash
cd frontend
npm install pinia socket.io-client axios
npm install -D vitest @vue/test-utils jsdom
```

### 1.4 Configuración básica
- Crear archivos de configuración (jest.config.js, vitest.config.js)
- Setup de scripts en package.json
- Crear estructura de carpetas

## Fase 2: Backend Core (1.5 horas)

### 2.1 Configuración MongoDB y Express (20 min)
1. `config/database.js` - Conexión MongoDB
2. `app.js` - Configuración Express básica
3. `server.js` - Punto de entrada
4. Variables de entorno (.env)

### 2.2 Modelo de Datos (15 min)
1. `models/Message.js` - Schema de Mongoose
2. Validaciones básicas del modelo

### 2.3 Servicio de Mensajes (25 min)
1. `services/messageService.js` - Lógica de negocio
2. Métodos: createMessage, getHistory
3. Manejo de errores

### 2.4 API REST (30 min)
1. `controllers/messageController.js` - Controladores
2. `routes/messages.js` - Rutas
3. Validaciones con express-validator
4. Integración con Express app

## Fase 3: Socket.io Backend (45 min)

### 3.1 Configuración Socket.io (15 min)
1. Integración con Express server
2. Configuración CORS para sockets

### 3.2 Event Handlers (30 min)
1. `socket/socketHandler.js` - Manejo de eventos
2. Eventos: join-chat, send-message, disconnect
3. Broadcast de mensajes
4. Integración con messageService

## Fase 4: Frontend Base (1.5 horas)

### 4.1 Setup Pinia Store (20 min)
1. `stores/chat.js` - Store principal
2. State inicial, getters básicos
3. Configuración en main.js

### 4.2 Servicio Socket.io (15 min)
1. `services/socket.js` - Cliente Socket.io
2. Métodos de conexión y eventos

### 4.3 Componentes Base (55 min)
1. `LoginForm.vue` - Formulario de login (15 min)
2. `MessageList.vue` - Lista de mensajes (20 min)
3. `MessageInput.vue` - Input de mensajes (20 min)

## Fase 5: Integración Frontend-Backend (1 hora)

### 5.1 Acciones del Store (30 min)
1. Implementar acciones de Pinia
2. Integración con Socket.io service
3. Manejo de estado de conexión

### 5.2 ChatWindow Principal (30 min)
1. `ChatWindow.vue` - Componente principal
2. `App.vue` - Navegación condicional
3. Estilos CSS básicos

## Fase 6: Testing (1 hora)

### 6.1 Test Backend (30 min)
1. Setup de Jest y base de datos de test
2. `tests/message.test.js` - Test del messageService
3. Verificar que pasan los tests

### 6.2 Test Frontend (30 min)
1. Setup de Vitest
2. `tests/MessageInput.test.js` - Test del componente
3. Verificar que pasan los tests

## Fase 7: Refinamiento y Documentación (30 min)

### 7.1 Ajustes Finales (15 min)
- Validaciones adicionales
- Manejo de errores mejorado
- Estilos CSS finales

### 7.2 README.md (15 min)
- Instrucciones de instalación
- Documentación de arquitectura
- Detalles de Socket.io
- Patrones utilizados

## Checklist de Finalización

### Funcionalidades Core
- [ ] Login con username
- [ ] Envío de mensajes en tiempo real
- [ ] Recepción de mensajes en tiempo real
- [ ] Historial persistente en MongoDB
- [ ] Diferenciación visual de mensajes propios/ajenos
- [ ] Timestamps legibles

### Arquitectura
- [ ] Separación clara de capas
- [ ] Patrón MVC en backend
- [ ] State management con Pinia
- [ ] Manejo de errores consistente

### Testing
- [ ] 1 test unitario backend (messageService)
- [ ] 1 test unitario frontend (MessageInput)
- [ ] Tests pasan exitosamente

### Documentación
- [ ] README.md completo
- [ ] Instrucciones de instalación
- [ ] Documentación de Socket.io events
- [ ] Decisiones arquitectónicas documentadas

## Comandos de Ejecución Final

### Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev

# Terminal 3 - MongoDB (si es local)
mongod
```

### Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## Tiempo Total Estimado: 4-5 horas
- Setup: 30 min
- Backend: 2.25 horas
- Frontend: 1.5 horas
- Testing: 1 hora
- Documentación: 30 min
