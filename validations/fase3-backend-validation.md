# Validación - Fase 3: API REST Backend

## Objetivo de la Validación
Verificar que la API REST está correctamente implementada con controladores, rutas, validaciones y endpoints funcionando sin errores.

## Checklist de Validación

### ✅ Controlador de Mensajes
- [x] Archivo `controllers/messageController.js` existe
- [x] Métodos del controlador implementados:
  - [x] `getMessages(req, res)` - Obtener mensajes paginados
  - [x] `createMessage(req, res)` - Crear nuevo mensaje
  - [x] `getRecentMessages(req, res)` - Obtener mensajes recientes
  - [x] `getMessageById(req, res)` - Obtener mensaje por ID
  - [x] `getStatistics(req, res)` - Estadísticas de la BD
- [x] Manejo de errores HTTP apropiado
- [x] Respuestas JSON consistentes

**Comandos de verificación:**
```bash
# Verificar que el controlador se puede importar
cd backend && node -e "const controller = require('./src/controllers/messageController'); console.log('✅ Controller loaded:', typeof controller)"
```

### ✅ Validaciones con Express-Validator
- [x] Archivo `validators/messageValidators.js` existe
- [x] Validaciones implementadas:
  - [x] `validateCreateMessage` - Validación de creación
  - [x] `validatePagination` - Validación de paginación
  - [x] `validateRecentLimit` - Validación de límite
  - [x] `validateMessageId` - Validación de ID MongoDB
  - [x] `handleValidationErrors` - Manejo centralizado de errores
- [x] Mensajes de error descriptivos
- [x] Sanitización de entrada

**Comandos de verificación:**
```bash
# Verificar que las validaciones se pueden importar
cd backend && node -e "const validators = require('./src/validators/messageValidators'); console.log('✅ Validators loaded:', Object.keys(validators))"
```

### ✅ Rutas API
- [x] Archivo `routes/messageRoutes.js` existe
- [x] Archivo `routes/index.js` existe (router principal)
- [x] Rutas implementadas:
  - [x] `GET /api/messages` - Obtener mensajes paginados
  - [x] `POST /api/messages` - Crear mensaje
  - [x] `GET /api/messages/recent` - Mensajes recientes
  - [x] `GET /api/messages/stats` - Estadísticas
  - [x] `GET /api/messages/:id` - Mensaje por ID
- [x] Middleware de validación aplicado
- [x] Integración con Express app

### ✅ Integración Express
- [x] `app.js` actualizado con rutas API
- [x] Middleware JSON configurado
- [x] CORS configurado apropiadamente
- [x] Manejo global de errores implementado
- [x] Endpoint 404 para rutas no encontradas

### ✅ Variables de Entorno
- [x] Variables de configuración actualizadas
- [x] Puerto del servidor configurado
- [x] CORS origins configurado

## Pruebas Funcionales

### Prueba 1: GET Mensajes
```bash
# Iniciar servidor en una terminal
cd backend && npm start

# En otra terminal, probar endpoint
curl -X GET "http://localhost:3001/api/messages" -H "Content-Type: application/json"
# Debe retornar: {"success":true,"data":[],"pagination":{...}}
```

### Prueba 2: POST Crear Mensaje
```bash
# Crear un mensaje nuevo
Invoke-RestMethod -Uri "http://localhost:3001/api/messages" -Method Post -ContentType "application/json" -Body '{"username":"testuser","content":"Hello API!"}'
# Debe retornar: {"success":true,"data":{...},"message":"Message created successfully"}
```

### Prueba 3: Validación de Errores
```bash
# Probar validación con datos inválidos
Invoke-RestMethod -Uri "http://localhost:3001/api/messages" -Method Post -ContentType "application/json" -Body '{"username":"","content":"test"}'
# Debe retornar error 400: {"success":false,"error":"Validation failed","details":[...]}
```

### Prueba 4: Mensajes Recientes
```bash
# Obtener mensajes recientes
curl -X GET "http://localhost:3001/api/messages/recent" -H "Content-Type: application/json"
# Debe retornar: {"success":true,"data":[...],"count":...}
```

### Prueba 5: Estadísticas
```bash
# Obtener estadísticas de la BD
curl -X GET "http://localhost:3001/api/messages/stats" -H "Content-Type: application/json"
# Debe retornar: {"success":true,"data":{"totalMessages":...,"lastMessageAt":...}}
```

## Criterios de Éxito
- ✅ Todos los endpoints responden correctamente
- ✅ Validaciones funcionan y retornan errores apropiados
- ✅ Respuestas JSON consistentes en formato
- ✅ Códigos de estado HTTP apropiados
- ✅ No hay errores en la consola del servidor
- ✅ Tests unitarios siguen pasando

## Prerequisitos
- MongoDB corriendo localmente en puerto 27017, O
- MongoDB Atlas configurado con URI en .env
- Servidor backend ejecutándose en puerto 3001

## En caso de error
1. Verificar que MongoDB está corriendo y conectado
2. Verificar variables de entorno en `.env`
3. Verificar sintaxis de los archivos creados
4. Revisar logs del servidor para errores específicos
5. Verificar que todas las dependencias están instaladas

## Comandos de Validación Rápida

```bash
# Verificar estructura de archivos
ls backend/src/controllers/messageController.js
ls backend/src/validators/messageValidators.js
ls backend/src/routes/messageRoutes.js
ls backend/src/routes/index.js

# Verificar que no hay errores de sintaxis
cd backend && node -c src/controllers/messageController.js
cd backend && node -c src/validators/messageValidators.js
cd backend && node -c src/routes/messageRoutes.js

# Ejecutar tests
cd backend && npm test

# Iniciar servidor
cd backend && npm start
```

---

**Esta validación debe completarse antes de proceder a la Fase 4 (Socket.io)**
