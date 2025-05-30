# Plan de Implementación del Frontend (Vue 3 + Pinia)

## Dependencias Principales
```json
{
  "dependencies": {
    "vue": "^3.3.4",
    "pinia": "^2.1.6",
    "socket.io-client": "^4.7.2",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.3.4",
    "vite": "^4.4.5",
    "vitest": "^0.34.3",
    "@vue/test-utils": "^2.4.1"
  }
}
```

## Store de Pinia (chat.js)

### State
```javascript
{
  currentUser: null,           // { username: string }
  messages: [],               // Array de mensajes
  isConnected: false,         // Estado de conexión Socket.io
  isLoading: false,          // Loading para historial
  socket: null               // Instancia de Socket.io
}
```

### Actions
- `setUser(username)` - Establecer usuario actual
- `connectToChat()` - Conectar Socket.io y obtener historial
- `sendMessage(content)` - Enviar mensaje via Socket
- `addMessage(message)` - Agregar mensaje al array
- `loadHistory()` - Cargar historial via REST API
- `disconnect()` - Desconectar Socket.io

## Componentes Vue

### `App.vue`
- Componente raíz
- Condicional: LoginForm si no hay usuario, ChatWindow si hay usuario
- Gestión del estado global

### `LoginForm.vue`
**Props**: Ninguna
**Emits**: `user-login`
**Funcionalidad**:
- Input de username
- Validación básica (no vacío, max 50 chars)
- Botón de submit
- Diseño simple y centrado

**Template básico**:
```vue
<form @submit.prevent="handleLogin">
  <input v-model="username" placeholder="Ingresa tu nombre" />
  <button type="submit">Unirse al Chat</button>
</form>
```

### `ChatWindow.vue`
**Props**: Ninguna
**Componentes hijos**: MessageList, MessageInput
**Funcionalidad**:
- Layout principal del chat
- Header con nombre de usuario
- Contenedor para lista de mensajes
- Input para nuevos mensajes

### `MessageList.vue`
**Props**: Ninguna (usa store)
**Funcionalidad**:
- Renderizar array de mensajes
- Scroll automático al final
- Diferenciación visual entre mensajes propios y ajenos
- Mostrar timestamp formateado

**Estructura de mensaje**:
```vue
<div class="message" :class="{ 'own-message': isOwnMessage }">
  <div class="message-header">
    <span class="username">{{ message.username }}</span>
    <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
  </div>
  <div class="message-content">{{ message.content }}</div>
</div>
```

### `MessageInput.vue`
**Props**: Ninguna
**Emits**: Ninguno (usa store directamente)
**Funcionalidad**:
- Input de texto para nuevos mensajes
- Validación (no vacío, max 500 chars)
- Envío con Enter o botón
- Clear input después de enviar

## Configuración de Socket.io Client

### services/socket.js
```javascript
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(serverUrl = 'http://localhost:3000') {
    this.socket = io(serverUrl);
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Métodos helper para eventos comunes
  joinChat(username) { /* ... */ }
  sendMessage(username, content) { /* ... */ }
  onMessageReceived(callback) { /* ... */ }
}
```

## Implementación por Fases

### Fase 1: Setup Básico
1. Inicializar proyecto Vite + Vue 3
2. Configurar Pinia
3. Estructura de componentes básica

### Fase 2: Login y Estado
1. Implementar LoginForm
2. Store básico de Pinia
3. Navegación condicional

### Fase 3: Chat UI
1. Implementar ChatWindow layout
2. MessageList con datos mock (Opcionalmente desde API)
3. MessageInput básico

### Fase 4: Socket.io Integration
1. Configurar Socket.io client
2. Conectar store con Socket events
3. Envío y recepción en tiempo real

### Fase 5: Testing
1. Setup de Vitest
2. Test unitario de MessageInput
3. Validación de envío de mensajes

## Estilos CSS (Básicos)
- Diseño responsivo simple
- Colores diferenciados para mensajes propios/ajenos
- Scroll en lista de mensajes
- Input fijo en la parte inferior
- Estilo minimalista y limpio

## Validaciones Frontend
- Username: 1-50 caracteres, no solo espacios
- Message content: 1-500 caracteres, no solo espacios
- Conexión Socket.io activa antes de enviar mensajes
