# Estructura del Proyecto

## Estructura de Directorios

```
live-chat/
├── frontend/                   # Aplicación Vue 3
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.vue     # Ventana principal del chat
│   │   │   ├── MessageList.vue    # Lista de mensajes
│   │   │   ├── MessageInput.vue   # Input para enviar mensajes
│   │   │   └── LoginForm.vue      # Formulario de login
│   │   ├── stores/
│   │   │   └── chat.js           # Store de Pinia para el chat
│   │   ├── services/
│   │   │   └── socket.js         # Configuración de Socket.io client
│   │   ├── App.vue               # Componente raíz
│   │   └── main.js               # Punto de entrada
│   ├── tests/
│   │   └── MessageInput.test.js  # Test unitario del frontend
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/                    # API Express
│   ├── src/
│   │   ├── controllers/
│   │   │   └── messageController.js  # Controlador de mensajes
│   │   ├── models/
│   │   │   └── Message.js            # Modelo de Mongoose
│   │   ├── routes/
│   │   │   └── messages.js           # Rutas REST
│   │   ├── services/
│   │   │   └── messageService.js     # Lógica de negocio
│   │   ├── socket/
│   │   │   └── socketHandler.js      # Manejo de eventos Socket.io
│   │   ├── config/
│   │   │   └── database.js           # Configuración MongoDB
│   │   └── app.js                    # Configuración Express
│   ├── tests/
│   │   └── message.test.js           # Test unitario del backend
│   ├── package.json
│   └── server.js                     # Punto de entrada
│
├── planning/                   # Documentación del plan
├── README.md                   # Documentación principal
└── package.json               # Scripts globales (opcional)
```

## Responsabilidades por Archivo

### Frontend

#### `LoginForm.vue`
- Input para username
- Validación básica
- Emisión de evento de login

#### `ChatWindow.vue`
- Contenedor principal
- Gestión del estado de conexión
- Layout del chat

#### `MessageList.vue`
- Renderizado de mensajes
- Scroll automático
- Diferenciación visual entre mensajes propios y ajenos

#### `MessageInput.vue`
- Input para nuevos mensajes
- Validación de longitud
- Envío via Socket.io

#### `chat.js` (Store)
- Estado global del chat
- Lista de mensajes
- Usuario actual
- Acciones para Socket.io

### Backend

#### `messageController.js`
- Endpoints REST para historial
- Validación de requests
- Manejo de errores

#### `Message.js` (Model)
- Schema de Mongoose
- Validaciones a nivel de BD
- Métodos de consulta

#### `messageService.js`
- Lógica de negocio
- Operaciones con la BD
- Transformación de datos

#### `socketHandler.js`
- Eventos de Socket.io
- Broadcast de mensajes
- Gestión de conexiones
