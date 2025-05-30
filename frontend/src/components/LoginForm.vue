<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Live Chat</h1>
      <p class="login-subtitle">Enter your username to join the chat</p>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-input"
            :class="{ 'form-input--error': error }"
            placeholder="Enter your username"
            maxlength="50"
            required
            @input="clearError"
          />
          <div v-if="error" class="form-error">{{ error }}</div>
        </div>

        <button type="submit" class="login-button" :disabled="isLoading || !isValidUsername">
          <span v-if="isLoading">Joining...</span>
          <span v-else>Join Chat</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()

// Reactive data
const username = ref('')
const error = ref('')
const isLoading = ref(false)

// Computed properties
const isValidUsername = computed(() => {
  const trimmed = username.value.trim()
  return trimmed.length >= 1 && trimmed.length <= 50
})

// Methods
const clearError = () => {
  error.value = ''
}

const validateUsername = (value: string): string | null => {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Username is required'
  }

  if (trimmed.length < 1) {
    return 'Username must be at least 1 character'
  }

  if (trimmed.length > 50) {
    return 'Username must be 50 characters or less'
  }

  if (!/^[a-zA-Z0-9_\s-]+$/.test(trimmed)) {
    return 'Username can only contain letters, numbers, spaces, hyphens, and underscores'
  }

  return null
}

const handleSubmit = async () => {
  const trimmedUsername = username.value.trim()

  // Validate username
  const validationError = validateUsername(trimmedUsername)
  if (validationError) {
    error.value = validationError
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Set user in store
    chatStore.setUser(trimmedUsername)

    // Connect to chat and load history (Phase 2)
    await chatStore.connectToChat()

    console.log('User logged in and connected to chat:', trimmedUsername)
  } catch (err) {
    console.error('Login failed:', err)
    error.value = 'Failed to join chat. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.login-subtitle {
  text-align: center;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xl);
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
}

.form-input {
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-input--error {
  border-color: var(--color-danger);
}

.form-error {
  color: var(--color-danger);
  font-size: 0.85rem;
  margin-top: var(--spacing-xs);
}

.login-button {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-button:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.login-button:disabled {
  background: var(--color-secondary);
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 480px) {
  .login-card {
    padding: var(--spacing-lg);
  }

  .login-title {
    font-size: 1.75rem;
  }
}
</style>
