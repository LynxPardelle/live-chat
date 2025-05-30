# Fase 3: Chat UI - Validación

## Lista de verificación

### ChatWindow.vue
- [ ] Verificar que el layout está correctamente estructurado (header, main, footer)
- [ ] Comprobar que muestra correctamente el nombre del usuario actual
- [ ] Verificar que el botón de logout funciona correctamente
- [ ] Comprobar que el indicador de estado de conexión refleja el estado real
- [ ] Verificar que los componentes hijos se cargan correctamente
- [ ] Comprobar el diseño responsive en diferentes tamaños de pantalla

### MessageList.vue
- [ ] Verificar que los mensajes del store se renderizan correctamente
- [ ] Comprobar la diferenciación visual entre mensajes propios y ajenos
- [ ] Verificar que el formato de timestamp es legible y correcto
- [ ] Comprobar que se muestra un estado de carga mientras se obtienen mensajes
- [ ] Verificar que se muestra un estado vacío cuando no hay mensajes
- [ ] Comprobar que el scroll automático funciona al añadir nuevos mensajes
- [ ] Verificar que el diseño es responsive en diferentes dispositivos
- [ ] Comprobar que los mensajes se ordenan cronológicamente

### MessageInput.vue
- [ ] Verificar que la entrada permite escribir texto correctamente
- [ ] Comprobar que la validación funciona (mensajes no vacíos, máximo 500 caracteres)
- [ ] Verificar que el envío funciona con Enter y con botón
- [ ] Comprobar que el contador de caracteres es preciso
- [ ] Verificar que el botón se deshabilita correctamente cuando es necesario
- [ ] Comprobar que el textarea se ajusta automáticamente en altura
- [ ] Verificar que los mensajes se envían correctamente al store
- [ ] Comprobar que se muestra feedback de error cuando es necesario

### Integración con Store
- [ ] Verificar que los mensajes mock aparecen correctamente en la lista
- [ ] Comprobar que los mensajes enviados se añaden al store
- [ ] Verificar que la información del usuario actual se muestra correctamente
- [ ] Comprobar que el estado de conexión refleja el estado del store

### Validación Visual
- [ ] Verificar que el diseño sigue las variables CSS establecidas
- [ ] Comprobar que los colores distinguen correctamente mensajes propios y ajenos
- [ ] Verificar que el scroll funciona correctamente en la lista de mensajes
- [ ] Comprobar que el input permanece fijo en la parte inferior
- [ ] Verificar que la interfaz es coherente y estéticamente agradable
- [ ] Comprobar accesibilidad básica (contraste, tamaños de fuente, etc.)

## Pasos para probar

1. Abrir la aplicación en el navegador
2. Iniciar sesión con un nombre de usuario
3. Verificar que se carga la interfaz del chat correctamente
4. Comprobar que se muestran mensajes de ejemplo (si los hay)
5. Enviar un mensaje nuevo y verificar que aparece en la lista
6. Verificar la distinción visual entre mensajes propios y ajenos
7. Probar el comportamiento responsive redimensionando la ventana
8. Comprobar que el scroll funciona correctamente con muchos mensajes
9. Verificar que las validaciones de entrada funcionan adecuadamente
10. Probar el botón de logout y verificar que vuelve a la pantalla de login

## Notas
- Esta fase se centra en la UI y no incluye la funcionalidad completa de Socket.io (se implementará en la Fase 4)
- Los mensajes son mock hasta que se implemente la integración completa con el backend
