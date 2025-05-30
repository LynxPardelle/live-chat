# Plan General del Proyecto - Chat en Tiempo Real

## Resumen del Proyecto
Implementación de una aplicación de chat en tiempo real siguiendo las especificaciones del challenge, con enfoque en simplicidad y buenas prácticas.

## Stack Tecnológico Seleccionado

### Frontend
- **Framework**: Vue 3 con Composition API
- **State Management**: Pinia
- **Build Tool**: Vite
- **Testing**: Vitest
- **Comunicación**: Socket.io Client

### Backend
- **Framework**: Express.js
- **Comunicación**: Socket.io
- **Base de Datos**: MongoDB con Mongoose
- **Testing**: Jest + Supertest
- **Validación**: Express-validator

### Base de Datos
- **Tipo**: MongoDB
- **ODM**: Mongoose
- **Estructura**: Colección de mensajes con timestamp, autor y contenido

## Arquitectura General

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend     │    │    MongoDB      │
│   (Vue 3)       │◄──►│   (Express)     │◄──►│   (Messages)    │
│                 │    │                 │    │                 │
│ • Pinia Store   │    │ • Socket.io     │    │ • Mongoose      │
│ • Socket Client │    │ • REST API      │    │ • Collections   │
│ • Components    │    │ • Controllers   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Objetivos de Simplicidad
1. **Una sola sala de chat** - Sin múltiples canales
2. **Autenticación simple** - Solo username, sin contraseñas
3. **UI minimalista** - Enfoque en funcionalidad core
4. **Estructura clara** - Separación de responsabilidades
5. **Testing básico** - Un test por lado (frontend/backend)

## Flujo Principal
1. Usuario ingresa username
2. Se conecta al chat y ve historial
3. Puede enviar mensajes en tiempo real
4. Mensajes se persisten en MongoDB
5. Otros usuarios ven mensajes instantáneamente
