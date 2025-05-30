<template>
  <div class="message-input">
    <form @submit.prevent="handleSubmit" class="message-form">
      <div class="input-container">
        <textarea
          v-model="messageContent"
          ref="textareaRef"
          class="message-textarea"
          :class="{ 'message-textarea--error': error }"
          placeholder="Type your message..."
          rows="1"
          maxlength="500"
          @keydown="handleKeydown"
          @input="handleInput"
          :disabled="!canSendMessage"
        ></textarea>

        <button
          type="submit"
          class="send-button"
          :disabled="!canSendMessage || !isValidMessage"
          :title="sendButtonTitle"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      <div class="message-info">
        <div class="character-count" :class="{ 'character-count--warning': isNearLimit }">
          {{ messageContent.length }}/500
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()

// Reactive data
const messageContent = ref('')
const error = ref('')
const isSending = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()

// Computed properties
const currentUser = computed(() => chatStore.currentUser)
const isConnected = computed(() => chatStore.isConnected)

const isValidMessage = computed(() => {
  const trimmed = messageContent.value.trim()
  return trimmed.length > 0 && trimmed.length <= 500
})

const canSendMessage = computed(() => {
  return currentUser.value && !isSending.value
  // Connection check will be added in Phase 4
})

const isNearLimit = computed(() => {
  return messageContent.value.length > 400
})

const sendButtonTitle = computed(() => {
  if (!currentUser.value) return 'Please log in first'
  if (!isValidMessage.value) return 'Enter a valid message'
  return 'Send message (Enter or click to send)'
})

// Methods
const validateMessage = (content: string): string | null => {
  const trimmed = content.trim()

  if (!trimmed) {
    return 'Message cannot be empty'
  }

  if (trimmed.length > 500) {
    return 'Message is too long (max 500 characters)'
  }

  return null
}

const handleInput = () => {
  error.value = ''
  autoResize()
}

const autoResize = () => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 120) + 'px'
    }
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  // Send on Enter (without Shift)
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}

const handleSubmit = async () => {
  const content = messageContent.value.trim()

  // Validate message
  const validationError = validateMessage(content)
  if (validationError) {
    error.value = validationError
    return
  }

  if (!canSendMessage.value) {
    error.value = 'Cannot send message at this time'
    return
  }

  isSending.value = true
  error.value = ''

  try {
    // Send message via store
    await chatStore.sendMessage(content)

    // Clear input after successful send
    messageContent.value = ''
    autoResize()

    // Focus back to input
    if (textareaRef.value) {
      textareaRef.value.focus()
    }
  } catch (err) {
    console.error('Failed to send message:', err)
    error.value = 'Failed to send message. Please try again.'
  } finally {
    isSending.value = false
  }
}

// Auto-focus on mount
nextTick(() => {
  if (textareaRef.value) {
    textareaRef.value.focus()
  }
})
</script>

<style scoped>
.message-input {
  width: 100%;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-sm);
}

.message-textarea {
  flex: 1;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.4;
  resize: none;
  transition: border-color 0.2s ease;
  min-height: 44px;
  max-height: 120px;
}

.message-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.message-textarea:disabled {
  background: var(--color-background);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.message-textarea--error {
  border-color: var(--color-danger);
}

.send-button {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.send-button:disabled {
  background: var(--color-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.message-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 20px;
}

.character-count {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.character-count--warning {
  color: var(--color-warning);
  font-weight: 500;
}

.error-message {
  font-size: 0.8rem;
  color: var(--color-danger);
}

/* Responsive design */
@media (max-width: 768px) {
  .message-textarea {
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .message-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}

@media (max-width: 480px) {
  .input-container {
    gap: var(--spacing-xs);
  }

  .message-textarea {
    padding: var(--spacing-sm);
  }

  .send-button {
    padding: var(--spacing-sm);
    min-width: 40px;
    height: 40px;
  }
}
</style>
