<template>
  <div class="message-list">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading messages...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="messages.length === 0" class="empty-state">
      <div class="empty-icon">💬</div>
      <h3>No messages yet</h3>
      <p>Be the first to send a message!</p>
    </div>

    <!-- Messages -->
    <div v-else class="messages-container" ref="messagesContainer">
      <div
        v-for="message in sortedMessages"
        :key="message.id"
        class="message"
        :class="getMessageClass(message)"
      >
        <div class="message__content">
          <div class="message__header">
            <span class="message__author">{{ message.username }}</span>
            <span class="message__timestamp">{{ formatTimestamp(message.timestamp) }}</span>
          </div>
          <div class="message__text">{{ message.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import type { Message } from '@/types/chat'

const chatStore = useChatStore()
const messagesContainer = ref<HTMLElement>()

// Computed properties
const messages = computed(() => chatStore.messages)
const sortedMessages = computed(() => chatStore.sortedMessages)
const isLoading = computed(() => chatStore.isLoading)
const currentUser = computed(() => chatStore.currentUser)

// Methods
const getMessageClass = (message: Message) => ({
  'message--own': message.username === currentUser.value?.username,
  'message--other': message.username !== currentUser.value?.username,
})

const formatTimestamp = (timestamp: Date | string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)

  // If message is from today
  if (diffInHours < 24 && date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // If message is from yesterday
  if (diffInHours < 48) {
    return `Yesterday ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  // Older messages
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Watch for new messages and scroll to bottom
watch(
  () => messages.value.length,
  () => {
    scrollToBottom()
  },
)
</script>

<style scoped>
.message-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--spacing-md);
  color: var(--color-text-muted);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--spacing-md);
  color: var(--color-text-muted);
  text-align: center;
  padding: var(--spacing-xl);
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.empty-state p {
  margin: 0;
  font-size: 0.95rem;
}

/* Messages container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* Individual message */
.message {
  display: flex;
  max-width: 70%;
  word-wrap: break-word;
}

.message--own {
  align-self: flex-end;
}

.message--other {
  align-self: flex-start;
}

.message__content {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow);
  border: 1px solid var(--color-border);
}

.message--own .message__content {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.message__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
  gap: var(--spacing-md);
}

.message__author {
  font-weight: 600;
  font-size: 0.85rem;
}

.message--own .message__author {
  color: rgba(255, 255, 255, 0.9);
}

.message--other .message__author {
  color: var(--color-primary);
}

.message__timestamp {
  font-size: 0.75rem;
  opacity: 0.7;
  white-space: nowrap;
}

.message__text {
  font-size: 0.95rem;
  line-height: 1.4;
  word-break: break-word;
}

/* Scrollbar styling */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: var(--color-background);
}

.messages-container::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-secondary);
}

/* Responsive design */
@media (max-width: 768px) {
  .message {
    max-width: 85%;
  }

  .messages-container {
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
  }

  .message__content {
    padding: var(--spacing-sm);
  }

  .message__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}

@media (max-width: 480px) {
  .message {
    max-width: 95%;
  }
}
</style>
