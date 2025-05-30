<template>
  <div class="chat-window">
    <!-- Header -->
    <header class="chat-header">
      <div class="chat-header__info">
        <h1 class="chat-title">Live Chat</h1>
        <p class="chat-subtitle">Welcome, {{ currentUser?.username }}!</p>
      </div>
      <div class="chat-header__actions">
        <div class="connection-status" :class="connectionStatusClass">
          <span class="status-indicator"></span>
          {{ connectionStatusText }}
        </div>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </div>
    </header>

    <!-- Chat Content -->
    <main class="chat-content">
      <MessageList />
    </main>

    <!-- Message Input -->
    <footer class="chat-footer">
      <MessageInput />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChatStore } from '@/stores/chat'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'

const chatStore = useChatStore()

// Computed properties
const currentUser = computed(() => chatStore.currentUser)

const connectionStatusClass = computed(() => ({
  'connection-status--connected': chatStore.isConnected,
  'connection-status--disconnected': !chatStore.isConnected,
}))

const connectionStatusText = computed(() => (chatStore.isConnected ? 'Connected' : 'Disconnected'))

// Methods
const handleLogout = () => {
  if (confirm('Are you sure you want to leave the chat?')) {
    chatStore.clearUser()
  }
}
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-background);
}

/* Header */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow);
  z-index: 10;
}

.chat-header__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.chat-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.chat-subtitle {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: 0;
}

.chat-header__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.connection-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.85rem;
  font-weight: 500;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
}

.connection-status--connected {
  color: var(--color-success);
  background: rgba(40, 167, 69, 0.1);
}

.connection-status--disconnected {
  color: var(--color-danger);
  background: rgba(220, 53, 69, 0.1);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.logout-button {
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logout-button:hover {
  background: #c82333;
}

/* Content */
.chat-content {
  flex: 1;
  overflow: hidden;
  background: var(--color-background);
}

/* Footer */
.chat-footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-lg);
}

/* Responsive design */
@media (max-width: 768px) {
  .chat-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
  }

  .chat-header__actions {
    justify-content: space-between;
  }

  .chat-title {
    font-size: 1.25rem;
  }

  .chat-footer {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .chat-header__actions {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .connection-status {
    align-self: stretch;
    justify-content: center;
  }
}
</style>
