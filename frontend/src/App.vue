<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import LoginForm from '@/components/LoginForm.vue'
import ChatWindow from '@/components/chat/ChatWindow.vue'

const route = useRoute()
const chatStore = useChatStore()

// Check if we're on a router-based view (like admin)
const isRouterView = computed(() => {
  return route.path !== '/' || route.name !== 'home'
})

// Computed to determine which component to show
const currentComponent = computed(() => {
  // If we're on a router view, show RouterView
  if (isRouterView.value) {
    return null // RouterView will be shown in template
  }
  // Otherwise, show chat or login based on auth state
  return chatStore.isLoggedIn ? ChatWindow : LoginForm
})
</script>

<template>
  <!-- Show RouterView for router-based navigation -->
  <RouterView v-if="isRouterView" />

  <!-- Show chat application for main functionality -->
  <component v-else :is="currentComponent" />
</template>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100vw;
  background-color: var(--color-background);
  color: var(--color-text);
}

/* CSS Variables for theming */
:root {
  --color-background: #f5f5f5;
  --color-surface: #ffffff;
  --color-primary: #007bff;
  --color-primary-dark: #0056b3;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-text: #333333;
  --color-text-muted: #6c757d;
  --color-border: #dee2e6;
  --border-radius: 8px;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}

/* Responsive design helpers */
@media (max-width: 768px) {
  :root {
    --spacing-md: 12px;
    --spacing-lg: 16px;
    --spacing-xl: 20px;
  }
}
</style>
