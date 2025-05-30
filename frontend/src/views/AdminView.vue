<template>
  <div class="admin-view">
    <div class="admin-header">
      <div class="admin-header__main">
        <h1>Admin Panel</h1>
        <p>Test and monitor backend API integration</p>
      </div>
      <div class="admin-header__actions">
        <button @click="backToChat" class="back-button">← Back to Chat</button>
      </div>
      <div class="navigation-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="admin-content">
      <!-- API Test Panel -->
      <div v-if="activeTab === 'api'" class="tab-content">
        <ApiTestPanel />
      </div>

      <!-- Socket.io Status -->
      <div v-if="activeTab === 'socket'" class="tab-content">
        <div class="socket-status-panel">
          <h2>Socket.io Connection Status</h2>

          <div class="status-cards">
            <div class="status-card">
              <h3>Connection Status</h3>
              <div class="status-indicator" :class="socketStatusClass">
                <span class="indicator-dot"></span>
                {{ socketStatusText }}
              </div>
            </div>

            <div class="status-card">
              <h3>Current User</h3>
              <div class="user-info">
                {{ currentUser ? currentUser.username : 'Not logged in' }}
              </div>
            </div>

            <div class="status-card">
              <h3>Messages Count</h3>
              <div class="message-count">
                {{ messageCount }}
              </div>
            </div>
          </div>

          <div class="socket-actions">
            <button
              v-if="!isConnected"
              @click="connectSocket"
              :disabled="!currentUser"
              class="action-button connect"
            >
              Connect Socket
            </button>
            <button v-if="isConnected" @click="disconnectSocket" class="action-button disconnect">
              Disconnect Socket
            </button>
            <button @click="refreshStatus" class="action-button refresh">Refresh Status</button>
          </div>

          <div v-if="socketError" class="error-message">
            <strong>Socket Error:</strong> {{ socketError }}
          </div>
        </div>
      </div>

      <!-- Store State -->
      <div v-if="activeTab === 'store'" class="tab-content">
        <div class="store-state-panel">
          <h2>Pinia Store State</h2>

          <div class="state-section">
            <h3>Current State</h3>
            <pre class="state-display">{{ formattedStoreState }}</pre>
          </div>

          <div class="state-actions">
            <button @click="refreshStoreState" class="action-button">Refresh State</button>
            <button @click="clearMessages" class="action-button warning">Clear Messages</button>
            <button @click="logoutUser" class="action-button danger">Logout User</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import ApiTestPanel from '@/components/admin/ApiTestPanel.vue'

const router = useRouter()
const chatStore = useChatStore()

// Reactive data
const activeTab = ref('api')
const socketError = ref('')
const storeStateKey = ref(0) // Force reactivity for store state

const tabs = [
  { id: 'api', label: 'API Testing' },
  { id: 'socket', label: 'Socket.io Status' },
  { id: 'store', label: 'Store State' },
]

// Methods
const backToChat = () => {
  router.push('/')
}

// Computed properties
const currentUser = computed(() => chatStore.currentUser)
const isConnected = computed(() => chatStore.isConnected)
const messageCount = computed(() => chatStore.messageCount)

const socketStatusClass = computed(() => ({
  'status-connected': isConnected.value,
  'status-disconnected': !isConnected.value,
}))

const socketStatusText = computed(() => (isConnected.value ? 'Connected' : 'Disconnected'))

const formattedStoreState = computed(() => {
  // Force reactivity update
  storeStateKey.value

  return JSON.stringify(
    {
      currentUser: chatStore.currentUser,
      messageCount: chatStore.messageCount,
      isConnected: chatStore.isConnected,
      isLoading: chatStore.isLoading,
      hasSocket: !!chatStore.socket,
      messages: chatStore.messages.map((msg) => ({
        id: msg.id,
        username: msg.username,
        content: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : ''),
        timestamp: msg.timestamp,
      })),
    },
    null,
    2,
  )
})

// Methods
const connectSocket = async () => {
  if (!currentUser.value) return

  socketError.value = ''
  try {
    await chatStore.connectToChat()
  } catch (error: any) {
    socketError.value = error.message || 'Failed to connect'
  }
}

const disconnectSocket = () => {
  chatStore.disconnect()
  socketError.value = ''
}

const refreshStatus = () => {
  // Force reactive updates
  storeStateKey.value++
  socketError.value = ''
}

const refreshStoreState = () => {
  storeStateKey.value++
}

const clearMessages = () => {
  chatStore.clearMessages()
  storeStateKey.value++
}

const logoutUser = () => {
  chatStore.clearUser()
  storeStateKey.value++
}

// Lifecycle
onMounted(() => {
  refreshStatus()
})
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--spacing-lg);
}

.admin-header {
  margin-bottom: var(--spacing-xl);
}

.admin-header__main {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.admin-header__actions {
  display: flex;
  justify-content: flex-start;
  margin-bottom: var(--spacing-lg);
}

.admin-header h1 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 2rem;
}

.admin-header p {
  color: var(--color-text-muted);
  margin-bottom: 0;
}

.back-button {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.back-button:hover {
  background: var(--color-primary-dark);
}

.navigation-tabs {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.tab-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.tab-button:hover {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.1);
}

.tab-button.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
}

.admin-content {
  max-width: 1200px;
  margin: 0 auto;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Socket Status Panel */
.socket-status-panel {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow);
}

.socket-status-panel h2 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.status-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  text-align: center;
}

.status-card h3 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text);
  font-size: 1rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-weight: 600;
  font-size: 1.1rem;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.status-connected {
  color: var(--color-success);
}

.status-indicator.status-connected .indicator-dot {
  background: var(--color-success);
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.4);
}

.status-indicator.status-disconnected {
  color: var(--color-danger);
}

.status-indicator.status-disconnected .indicator-dot {
  background: var(--color-danger);
}

.user-info,
.message-count {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.socket-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.action-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 120px;
}

.action-button.connect {
  background: var(--color-success);
  color: white;
}

.action-button.connect:hover:not(:disabled) {
  background: #28a745;
}

.action-button.disconnect {
  background: var(--color-warning);
  color: white;
}

.action-button.disconnect:hover {
  background: #e0a800;
}

.action-button.refresh {
  background: var(--color-primary);
  color: white;
}

.action-button.refresh:hover {
  background: var(--color-primary-dark);
}

.action-button.warning {
  background: var(--color-warning);
  color: white;
}

.action-button.warning:hover {
  background: #e0a800;
}

.action-button.danger {
  background: var(--color-danger);
  color: white;
}

.action-button.danger:hover {
  background: #c82333;
}

.action-button:disabled {
  background: var(--color-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Store State Panel */
.store-state-panel {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow);
}

.store-state-panel h2 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.state-section {
  margin-bottom: var(--spacing-xl);
}

.state-section h3 {
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.state-display {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.4;
  overflow-x: auto;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
}

.state-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.error-message {
  background: rgba(220, 53, 69, 0.1);
  color: var(--color-danger);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-danger);
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-view {
    padding: var(--spacing-md);
  }

  .navigation-tabs {
    flex-direction: column;
    align-items: center;
  }

  .tab-button {
    min-width: 200px;
  }

  .status-cards {
    grid-template-columns: 1fr;
  }

  .socket-actions,
  .state-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-button {
    min-width: 200px;
  }
}
</style>
