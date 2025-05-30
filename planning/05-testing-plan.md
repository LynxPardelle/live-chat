# Plan de Testing

## Estrategia de Testing
Implementar un test unitario en frontend y uno en backend, siguiendo las buenas prácticas pero manteniendo la simplicidad.

## Backend Testing (Jest + Supertest)

### Test Unitario: messageService.js
**Archivo**: `backend/tests/message.test.js`

**Objetivo**: Testear la lógica de negocio del servicio de mensajes

**Casos de prueba**:
1. **Crear mensaje válido**
   - Input: `{ username: "usuario1", content: "Hola mundo" }`
   - Expected: Mensaje guardado correctamente con timestamp

2. **Validar input inválido**
   - Input con username vacío
   - Input con content muy largo (>500 chars)
   - Expected: Error de validación

3. **Obtener historial paginado**
   - Setup: Crear varios mensajes
   - Input: página y límite
   - Expected: Array correcto de mensajes ordenados por timestamp

**Setup necesario**:
```javascript
// Usar base de datos en memoria (MongoDB Memory Server)
// O mockear Mongoose para tests unitarios puros
beforeEach(() => {
  // Limpiar datos de test
});

afterAll(() => {
  // Cerrar conexión de BD
});
```

**Estructura del test**:
```javascript
describe('MessageService', () => {
  describe('createMessage', () => {
    it('should create message with valid input', async () => {
      // Arrange
      const messageData = { username: 'test', content: 'Hello' };
      
      // Act
      const result = await messageService.createMessage(messageData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.username).toBe('test');
      expect(result.timestamp).toBeDefined();
    });

    it('should throw error with invalid input', async () => {
      // Arrange
      const invalidData = { username: '', content: 'Hello' };
      
      // Act & Assert
      await expect(messageService.createMessage(invalidData))
        .rejects.toThrow('Username is required');
    });
  });
});
```

## Frontend Testing (Vitest + Vue Test Utils)

### Test Unitario: MessageInput.vue
**Archivo**: `frontend/tests/MessageInput.test.js`

**Objetivo**: Testear el componente de input de mensajes

**Casos de prueba**:
1. **Renderizado inicial**
   - Verificar que el input y botón se renderizan
   - Input debe estar vacío inicialmente

2. **Validación de input**
   - Botón deshabilitado con input vacío
   - Botón habilitado con texto válido
   - Error mostrado con texto muy largo

3. **Envío de mensaje**
   - Simular escritura en input
   - Simular click de envío
   - Verificar que se llama la acción del store
   - Verificar que el input se limpia

**Setup necesario**:
```javascript
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import MessageInput from '@/components/MessageInput.vue';
import { useChatStore } from '@/stores/chat';

beforeEach(() => {
  setActivePinia(createPinia());
});
```

**Estructura del test**:
```javascript
describe('MessageInput', () => {
  it('renders input and send button', () => {
    // Arrange & Act
    const wrapper = mount(MessageInput);
    
    // Assert
    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('validates message content', async () => {
    // Arrange
    const wrapper = mount(MessageInput);
    const input = wrapper.find('input');
    
    // Act - empty message
    await input.setValue('');
    
    // Assert
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    
    // Act - valid message
    await input.setValue('Hello world');
    
    // Assert
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
  });

  it('sends message and clears input', async () => {
    // Arrange
    const wrapper = mount(MessageInput);
    const store = useChatStore();
    const sendMessageSpy = vi.spyOn(store, 'sendMessage');
    
    // Act
    await wrapper.find('input').setValue('Test message');
    await wrapper.find('button').trigger('click');
    
    // Assert
    expect(sendMessageSpy).toHaveBeenCalledWith('Test message');
    expect(wrapper.find('input').element.value).toBe('');
  });
});
```

## Configuración de Testing

### Backend (Jest)
**jest.config.js**:
```javascript
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
  ],
};
```

### Frontend (Vitest)
**vitest.config.js**:
```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

## Scripts de Testing

### Backend package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Frontend package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui"
  }
}
```

## Criterios de Éxito
- ✅ Tests pasan exitosamente
- ✅ Cobertura básica de casos importantes
- ✅ Tests son mantenibles y legibles
- ✅ Setup simple para ejecutar tests
- ✅ Documentación clara de qué se está testeando
