import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import InputBar from '../components/InputBar.jsx'

describe('InputBar', () => {
  it('renders textarea with placeholder', () => {
    render(<InputBar onSend={vi.fn()} speechSupported={false} isListening={false} onToggleMic={vi.fn()} />)
    expect(screen.getByPlaceholderText('Ask about your webhooks...')).toBeInTheDocument()
  })

  it('calls onSend with trimmed text on Enter', async () => {
    const onSend = vi.fn()
    const user = userEvent.setup()
    render(<InputBar onSend={onSend} speechSupported={false} isListening={false} onToggleMic={vi.fn()} />)
    const textarea = screen.getByPlaceholderText('Ask about your webhooks...')
    await user.type(textarea, 'test message{Enter}')
    expect(onSend).toHaveBeenCalledWith('test message')
  })

  it('does not send empty messages', async () => {
    const onSend = vi.fn()
    const user = userEvent.setup()
    render(<InputBar onSend={onSend} speechSupported={false} isListening={false} onToggleMic={vi.fn()} />)
    const textarea = screen.getByPlaceholderText('Ask about your webhooks...')
    await user.type(textarea, '{Enter}')
    expect(onSend).not.toHaveBeenCalled()
  })

  it('does not send on Shift+Enter', async () => {
    const onSend = vi.fn()
    const user = userEvent.setup()
    render(<InputBar onSend={onSend} speechSupported={false} isListening={false} onToggleMic={vi.fn()} />)
    const textarea = screen.getByPlaceholderText('Ask about your webhooks...')
    await user.type(textarea, 'line one{Shift>}{Enter}{/Shift}line two')
    expect(onSend).not.toHaveBeenCalled()
  })

  it('clears input after sending', async () => {
    const user = userEvent.setup()
    render(<InputBar onSend={vi.fn()} speechSupported={false} isListening={false} onToggleMic={vi.fn()} />)
    const textarea = screen.getByPlaceholderText('Ask about your webhooks...')
    await user.type(textarea, 'test{Enter}')
    expect(textarea).toHaveValue('')
  })

  it('shows mic button when speech is supported', () => {
    render(<InputBar onSend={vi.fn()} speechSupported={true} isListening={false} onToggleMic={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('hides mic button when speech is not supported', () => {
    render(<InputBar onSend={vi.fn()} speechSupported={false} isListening={false} onToggleMic={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1) // only send button
  })
})
