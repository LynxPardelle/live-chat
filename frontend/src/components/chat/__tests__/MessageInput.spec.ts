import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MessageInput from '../MessageInput.vue'
import { useChatStore } from '@/stores/chat'

// Mock createMessage to avoid actual API calls
vi.mock('@/services/socket', () => {
  return {
    default: {
      isConnected: true,
      sendMessage: vi.fn(),
    },
  }
})

// Mock API service for fallback
vi.mock('@/services/api', () => {
  return {
    default: {
      sendMessage: vi.fn().mockResolvedValue({
        id: 'mock-id',
        username: 'testuser',
        content: 'test message',
        timestamp: new Date(),
      }),
    },
  }
})

describe('MessageInput', () => {
  let wrapper
  let store

  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia()
    setActivePinia(pinia)

    // Get the store
    store = useChatStore()

    // Setup a mock user
    store.setUser('testuser')
    store.setConnectionStatus(true)

    // Mount the component
    wrapper = mount(MessageInput)
  })

  it('renders properly', () => {
    expect(wrapper.find('.message-textarea').exists()).toBe(true)
    expect(wrapper.find('.send-button').exists()).toBe(true)
  })

  it('disables send button when message is empty', async () => {
    // Set empty message
    await wrapper.find('.message-textarea').setValue('')

    // Check send button is disabled
    expect(wrapper.find('.send-button').attributes('disabled')).toBeDefined()
  })

  it('enables send button when message is valid', async () => {
    // Set valid message
    await wrapper.find('.message-textarea').setValue('This is a test message')

    // Check send button is enabled
    expect(wrapper.find('.send-button').attributes('disabled')).toBeUndefined()
  })

  it('shows validation error for empty messages on submit', async () => {
    // Set empty message
    const textarea = wrapper.find('.message-textarea')
    await textarea.setValue('')

    // Try to submit the form
    await wrapper.find('form').trigger('submit.prevent')

    // Check error message
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toContain('cannot be empty')
  })

  it('shows character count', async () => {
    // Set a message
    await wrapper.find('.message-textarea').setValue('Hello world')

    // Check character count
    expect(wrapper.find('.character-count').text()).toContain('11/500')
  })

  it('warns when approaching character limit', async () => {
    // Create long message with 450 chars
    const longMessage = 'a'.repeat(450)

    // Set the message
    await wrapper.find('.message-textarea').setValue(longMessage)

    // Check character count has warning class
    expect(wrapper.find('.character-count').classes()).toContain('character-count--warning')
  })

  it('successfully sends a valid message', async () => {
    // Set up spy on store.sendMessage
    const sendMessageSpy = vi.spyOn(store, 'sendMessage')

    // Set test message
    const testMessage = 'This is a test message'
    await wrapper.find('.message-textarea').setValue(testMessage)

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Check if store.sendMessage was called with correct message
    expect(sendMessageSpy).toHaveBeenCalledWith(testMessage)

    // Check input was cleared
    expect(wrapper.find('.message-textarea').element.value).toBe('')
  })

  it('shows error message when message sending fails', async () => {
    // Mock store.sendMessage to reject
    vi.spyOn(store, 'sendMessage').mockRejectedValueOnce(new Error('Send failed'))

    // Set test message
    await wrapper.find('.message-textarea').setValue('This is a test message')

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Check error message is displayed
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toContain('Failed to send message')
  })

  it('prevents sending when user is not set', async () => {
    // Clear user
    store.clearUser()

    // Set test message
    await wrapper.find('.message-textarea').setValue('This is a test message')

    // Check if send button is disabled
    expect(wrapper.find('.send-button').attributes('disabled')).toBeDefined()
  })
})
