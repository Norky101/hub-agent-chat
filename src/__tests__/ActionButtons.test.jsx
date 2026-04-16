import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ActionButtons from '../components/ActionButtons.jsx'

const actions = [
  { id: 'retry', label: 'Retry Failed Events' },
  { id: 'pause', label: 'Pause Endpoint' },
]

describe('ActionButtons', () => {
  it('renders all action labels', () => {
    render(<ActionButtons actions={actions} onAction={vi.fn()} />)
    expect(screen.getByText('Retry Failed Events')).toBeInTheDocument()
    expect(screen.getByText('Pause Endpoint')).toBeInTheDocument()
  })

  it('calls onAction when clicked', () => {
    const onAction = vi.fn()
    render(<ActionButtons actions={actions} onAction={onAction} />)
    fireEvent.click(screen.getByText('Retry Failed Events'))
    expect(onAction).toHaveBeenCalledWith(actions[0])
  })

  it('shows checkmark after click', () => {
    render(<ActionButtons actions={actions} onAction={vi.fn()} />)
    fireEvent.click(screen.getByText('Retry Failed Events'))
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('prevents double-click on same button', () => {
    const onAction = vi.fn()
    render(<ActionButtons actions={actions} onAction={onAction} />)
    fireEvent.click(screen.getByText('Retry Failed Events'))
    fireEvent.click(screen.getByText('Retry Failed Events'))
    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('allows clicking different buttons', () => {
    const onAction = vi.fn()
    render(<ActionButtons actions={actions} onAction={onAction} />)
    fireEvent.click(screen.getByText('Retry Failed Events'))
    fireEvent.click(screen.getByText('Pause Endpoint'))
    expect(onAction).toHaveBeenCalledTimes(2)
  })
})
