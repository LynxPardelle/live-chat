# Validación Fase 2: Login y Estado

## Checklist de Validación

- [ ] Verificar que el formulario de login funciona correctamente
  - [ ] Validación de campos (username entre 1-50 caracteres)
  - [ ] Manejo de errores apropiado
  - [ ] Indicador de carga durante el proceso de login
  
- [ ] Comprobar el store de Pinia
  - [ ] El estado del usuario se actualiza al hacer login
  - [ ] Los getters devuelven los valores esperados
  - [ ] Las acciones funcionan como se espera

- [ ] Probar la navegación condicional
  - [ ] Se muestra LoginForm cuando no hay usuario autenticado
  - [ ] Se muestra ChatWindow cuando hay un usuario autenticado

## Pasos para validar

1. **Probar el formulario de login:**

   - Ejecutar la aplicación: `npm run dev`
   - Intentar enviar el formulario sin username (debería mostrar error)
   - Intentar con un username válido (debería proceder al chat)

2. **Verificar el estado de Pinia:**

   - Abrir las DevTools de Vue
   - Comprobar que el estado de Pinia se actualiza correctamente
   - Verificar que el usuario se establece en el store

3. **Comprobar la navegación:**

   - Al iniciar, debería mostrar la pantalla de login
   - Después de hacer login, debería mostrar la ventana de chat
   - Al recargar la página, debería volver a la pantalla de login (no hay persistencia en esta fase)

## Resultados esperados

- El usuario puede ingresar su nombre y unirse al chat
- La aplicación valida correctamente la entrada del usuario
- La transición entre pantallas es fluida y sin errores
- El estado se mantiene correctamente mientras la aplicación está en ejecución
