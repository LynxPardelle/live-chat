<template>
  <div class="api-test-panel">
    <div class="panel-header">
      <h2>API Integration Test Panel</h2>
      <p>Test all backend API endpoints and features</p>
    </div>

    <div class="panel-grid">
      <!-- API Health Check -->
      <div class="panel-card">
        <h3>🏥 Health Check</h3>
        <div class="card-content">
          <button @click="testHealthCheck" :disabled="isLoading" class="test-button">
            Check API Health
          </button>
          <div v-if="healthStatus" class="status-result" :class="healthStatusClass">
            {{ healthStatus ? 'API is healthy ✅' : 'API is down ❌' }}
          </div>
        </div>
      </div>

      <!-- Database Statistics -->
      <div class="panel-card">
        <h3>📊 Database Statistics</h3>
        <div class="card-content">
          <button @click="loadStatistics" :disabled="isLoading" class="test-button">
            Load Statistics
          </button>
          <div v-if="statistics" class="stats-display">
            <div class="stat-item">
              <span class="stat-label">Total Messages:</span>
              <span class="stat-value">{{ statistics.totalMessages }}</span>
            </div>
            <div v-if="statistics.lastMessageTimestamp" class="stat-item">
              <span class="stat-label">Last Message:</span>
              <span class="stat-value">{{ formatTimestamp(statistics.lastMessageTimestamp) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Messages -->
      <div class="panel-card">
        <h3>📋 Recent Messages</h3>
        <div class="card-content">
          <div class="input-group">
            <label for="recentLimit">Limit:</label>
            <input
              id="recentLimit"
              v-model.number="recentLimit"
              type="number"
              min="1"
              max="50"
              class="limit-input"
            />
            <button @click="loadRecentMessages" :disabled="isLoading" class="test-button">
              Load Recent
            </button>
          </div>
          <div v-if="recentMessages.length > 0" class="messages-preview">
            <div
              v-for="message in recentMessages.slice(0, 3)"
              :key="message.id"
              class="message-preview"
            >
              <strong>{{ message.username }}:</strong>
              {{ message.content.substring(0, 50) }}{{ message.content.length > 50 ? '...' : '' }}
            </div>
            <div v-if="recentMessages.length > 3" class="more-messages">
              +{{ recentMessages.length - 3 }} more messages
            </div>
          </div>
        </div>
      </div>

      <!-- Message by ID -->
      <div class="panel-card">
        <h3>🔍 Get Message by ID</h3>
        <div class="card-content">
          <div class="input-group">
            <label for="messageId">Message ID:</label>
            <input
              id="messageId"
              v-model="testMessageId"
              type="text"
              placeholder="Enter message ID"
              class="id-input"
            />
            <button
              @click="loadMessageById"
              :disabled="isLoading || !testMessageId"
              class="test-button"
            >
              Get Message
            </button>
          </div>
          <div v-if="foundMessage" class="message-result">
            <div class="message-detail"><strong>ID:</strong> {{ foundMessage.id }}</div>
            <div class="message-detail"><strong>Author:</strong> {{ foundMessage.username }}</div>
            <div class="message-detail"><strong>Content:</strong> {{ foundMessage.content }}</div>
            <div class="message-detail">
              <strong>Timestamp:</strong> {{ formatTimestamp(foundMessage.timestamp) }}
            </div>
          </div>
          <div v-else-if="searchAttempted && !foundMessage" class="error-message">
            Message not found or invalid ID
          </div>
        </div>
      </div>

      <!-- Send Test Message -->
      <div class="panel-card">
        <h3>📝 Send Test Message</h3>
        <div class="card-content">
          <div class="input-group">
            <label for="testContent">Message Content:</label>
            <textarea
              id="testContent"
              v-model="testMessageContent"
              placeholder="Enter test message..."
              class="message-input"
              maxlength="500"
            ></textarea>
            <button
              @click="sendTestMessage"
              :disabled="isLoading || !testMessageContent.trim() || !currentUser"
              class="test-button"
            >
              Send via API
            </button>
          </div>
          <div v-if="sentMessage" class="success-message">
            Message sent successfully! ID: {{ sentMessage.id }}
          </div>
        </div>
      </div>

      <!-- API Information -->
      <div class="panel-card full-width">
        <h3>ℹ️ API Information</h3>
        <div class="card-content">
          <button @click="loadApiInfo" :disabled="isLoading" class="test-button">
            Load API Info
          </button>
          <div v-if="apiInfo" class="api-info-display">
            <div class="info-section">
              <h4>General Info</h4>
              <div class="info-item">
                <span class="info-label">Version:</span>
                <span class="info-value">{{ apiInfo.version }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value">{{ apiInfo.status }}</span>
              </div>
            </div>

            <div v-if="apiInfo.features" class="info-section">
              <h4>Features</h4>
              <div v-for="(status, feature) in apiInfo.features" :key="feature" class="info-item">
                <span class="info-label">{{ feature }}:</span>
                <span class="info-value">{{ status }}</span>
              </div>
            </div>

            <div v-if="apiInfo.apiEndpoints" class="info-section">
              <h4>Available Endpoints</h4>
              <div
                v-for="(description, endpoint) in apiInfo.apiEndpoints"
                :key="endpoint"
                class="info-item"
              >
                <span class="info-label">{{ endpoint }}:</span>
                <span class="info-value">{{ description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Loading State -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Loading...</p>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error-banner">
      <strong>Error:</strong> {{ error }}
      <button @click="clearError" class="close-error">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/chat'
import type { Message, DatabaseStats, ApiInfo } from '@/types/chat'

const chatStore = useChatStore()

// Reactive data
const isLoading = ref(false)
const error = ref('')
const healthStatus = ref<boolean | null>(null)
const statistics = ref<DatabaseStats | null>(null)
const recentMessages = ref<Message[]>([])
const recentLimit = ref(10)
const testMessageId = ref('')
const foundMessage = ref<Message | null>(null)
const searchAttempted = ref(false)
const testMessageContent = ref('')
const sentMessage = ref<Message | null>(null)
const apiInfo = ref<ApiInfo | null>(null)

// Computed
const currentUser = computed(() => chatStore.currentUser)
const healthStatusClass = computed(() => ({
  'status-success': healthStatus.value === true,
  'status-error': healthStatus.value === false,
}))

// Methods
const clearError = () => {
  error.value = ''
}

const handleError = (err: any, operation: string) => {
  console.error(`Failed to ${operation}:`, err)
  error.value = `Failed to ${operation}: ${err.message || 'Unknown error'}`
}

const testHealthCheck = async () => {
  isLoading.value = true
  clearError()
  try {
    healthStatus.value = await chatStore.checkApiHealth()
  } catch (err: any) {
    handleError(err, 'check API health')
  } finally {
    isLoading.value = false
  }
}

const loadStatistics = async () => {
  isLoading.value = true
  clearError()
  try {
    statistics.value = await chatStore.getStatistics()
  } catch (err: any) {
    handleError(err, 'load statistics')
  } finally {
    isLoading.value = false
  }
}

const loadRecentMessages = async () => {
  isLoading.value = true
  clearError()
  try {
    await chatStore.loadRecentMessages(recentLimit.value)
    recentMessages.value = [...chatStore.messages]
  } catch (err: any) {
    handleError(err, 'load recent messages')
  } finally {
    isLoading.value = false
  }
}

const loadMessageById = async () => {
  if (!testMessageId.value.trim()) return

  isLoading.value = true
  clearError()
  searchAttempted.value = true
  foundMessage.value = null

  try {
    foundMessage.value = await chatStore.getMessageById(testMessageId.value.trim())
  } catch (err: any) {
    handleError(err, 'get message by ID')
  } finally {
    isLoading.value = false
  }
}

const sendTestMessage = async () => {
  if (!testMessageContent.value.trim() || !currentUser.value) return

  isLoading.value = true
  clearError()
  sentMessage.value = null

  try {
    // Import API service directly for testing
    const { default: apiService } = await import('@/services/api')
    sentMessage.value = await apiService.sendMessage(
      currentUser.value.username,
      testMessageContent.value.trim(),
    )
    testMessageContent.value = ''
  } catch (err: any) {
    handleError(err, 'send test message')
  } finally {
    isLoading.value = false
  }
}

const loadApiInfo = async () => {
  isLoading.value = true
  clearError()
  try {
    apiInfo.value = await chatStore.getApiInfo()
  } catch (err: any) {
    handleError(err, 'load API information')
  } finally {
    isLoading.value = false
  }
}

const formatTimestamp = (timestamp: Date) => {
  return new Date(timestamp).toLocaleString()
}
</script>

<style scoped>
.api-test-panel {
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.panel-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.panel-header h2 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.panel-header p {
  color: var(--color-text-muted);
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.panel-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow);
}

.panel-card.full-width {
  grid-column: 1 / -1;
}

.panel-card h3 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-primary);
  font-size: 1.1rem;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.test-button {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-weight: 500;
}

.test-button:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.test-button:disabled {
  background: var(--color-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.input-group label {
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
}

.limit-input,
.id-input {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: 0.95rem;
}

.message-input {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.status-result {
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  font-weight: 500;
  text-align: center;
}

.status-result.status-success {
  background: rgba(40, 167, 69, 0.1);
  color: var(--color-success);
}

.status-result.status-error {
  background: rgba(220, 53, 69, 0.1);
  color: var(--color-danger);
}

.stats-display {
  background: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-weight: 500;
  color: var(--color-text-muted);
}

.stat-value {
  font-weight: 600;
  color: var(--color-text);
}

.messages-preview {
  background: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  max-height: 200px;
  overflow-y: auto;
}

.message-preview {
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.9rem;
}

.message-preview:last-child {
  border-bottom: none;
}

.more-messages {
  text-align: center;
  font-style: italic;
  color: var(--color-text-muted);
  margin-top: var(--spacing-sm);
}

.message-result {
  background: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.message-detail {
  margin-bottom: var(--spacing-sm);
  font-size: 0.9rem;
}

.message-detail:last-child {
  margin-bottom: 0;
}

.success-message {
  background: rgba(40, 167, 69, 0.1);
  color: var(--color-success);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  text-align: center;
  font-weight: 500;
}

.error-message {
  background: rgba(220, 53, 69, 0.1);
  color: var(--color-danger);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  text-align: center;
  font-weight: 500;
}

.api-info-display {
  background: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.info-section {
  margin-bottom: var(--spacing-lg);
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h4 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-primary);
  font-size: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
  font-size: 0.9rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 500;
  color: var(--color-text-muted);
  min-width: 120px;
}

.info-value {
  color: var(--color-text);
  text-align: right;
  flex: 1;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-banner {
  background: rgba(220, 53, 69, 0.1);
  color: var(--color-danger);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-danger);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-lg);
}

.close-error {
  background: none;
  border: none;
  color: var(--color-danger);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .panel-grid {
    grid-template-columns: 1fr;
  }

  .input-group {
    gap: var(--spacing-xs);
  }

  .panel-card {
    padding: var(--spacing-md);
  }
}
</style>
