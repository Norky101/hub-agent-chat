import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ChatWindow from '../components/ChatWindow.jsx'

const mockMessages = [
  {
    id: '1',
    role: 'agent',
    timestamp: new Date().toISOString(),
    blocks: [{ type: 'text', content: 'Hello from the agent' }],
  },
  {
    id: '2',
    role: 'user',
    timestamp: new Date().toISOString(),
    blocks: [{ type: 'text', content: 'Hello from the user' }],
  },
]

const defaultProps = {
  messages: mockMessages,
  isTyping: false,
  onSend: vi.fn(),
  onAction: vi.fn(),
  onNewChat: vi.fn(),
  mountedAt: new Date(0).toISOString(),
  speechSupported: false,
  isListening: false,
  onToggleMic: vi.fn(),
}

describe('ChatWindow', () => {
  it('renders agent and user messages', () => {
    render(<ChatWindow {...defaultProps} />)
    expect(screen.getByText('Hello from the agent')).toBeInTheDocument()
    expect(screen.getByText('Hello from the user')).toBeInTheDocument()
  })

  it('shows welcome screen when no messages', () => {
    render(<ChatWindow {...defaultProps} messages={[]} />)
    expect(screen.getByText('Hub Agent')).toBeInTheDocument()
    expect(screen.getByText('Your webhook pipeline, managed')).toBeInTheDocument()
  })

  it('shows typing indicator when isTyping is true', () => {
    render(<ChatWindow {...defaultProps} isTyping={true} />)
    expect(screen.getByText('Thinking...')).toBeInTheDocument()
  })

  it('hides typing indicator when isTyping is false', () => {
    render(<ChatWindow {...defaultProps} isTyping={false} />)
    expect(screen.queryByText('Thinking...')).not.toBeInTheDocument()
  })

  it('shows agent identity label', () => {
    render(<ChatWindow {...defaultProps} />)
    expect(screen.getByText('Hub Agent', { selector: 'span' })).toBeInTheDocument()
  })

  it('shows new chat button when messages exist', () => {
    render(<ChatWindow {...defaultProps} />)
    expect(screen.getByText('New chat')).toBeInTheDocument()
  })

  it('hides new chat button on welcome screen', () => {
    render(<ChatWindow {...defaultProps} messages={[]} />)
    expect(screen.queryByText('New chat')).not.toBeInTheDocument()
  })

  it('renders input bar with placeholder', () => {
    render(<ChatWindow {...defaultProps} />)
    expect(screen.getByPlaceholderText('Ask about your webhooks...')).toBeInTheDocument()
  })
})
