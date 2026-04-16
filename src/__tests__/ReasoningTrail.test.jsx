import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ReasoningTrail from '../components/ReasoningTrail.jsx'

const steps = [
  'Queried delivery logs',
  'Detected 47 failures',
  'Cross-referenced GitHub status API',
]

describe('ReasoningTrail', () => {
  it('renders toggle button', () => {
    render(<ReasoningTrail steps={steps} />)
    expect(screen.getByText('How I got here')).toBeInTheDocument()
  })

  it('starts collapsed', () => {
    render(<ReasoningTrail steps={steps} />)
    expect(screen.queryByText('Queried delivery logs')).not.toBeInTheDocument()
  })

  it('expands on click', () => {
    render(<ReasoningTrail steps={steps} />)
    fireEvent.click(screen.getByText('How I got here'))
    expect(screen.getByText('Queried delivery logs')).toBeInTheDocument()
    expect(screen.getByText('Detected 47 failures')).toBeInTheDocument()
    expect(screen.getByText('Cross-referenced GitHub status API')).toBeInTheDocument()
  })

  it('collapses on second click', () => {
    render(<ReasoningTrail steps={steps} />)
    fireEvent.click(screen.getByText('How I got here'))
    fireEvent.click(screen.getByText('How I got here'))
    expect(screen.queryByText('Queried delivery logs')).not.toBeInTheDocument()
  })

  it('renders nothing with empty steps', () => {
    const { container } = render(<ReasoningTrail steps={[]} />)
    expect(container.innerHTML).toBe('')
  })
})
