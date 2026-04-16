import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MetricCard from '../components/MetricCard.jsx'

describe('MetricCard', () => {
  it('renders label, value, and period', () => {
    render(<MetricCard label="Events" value="24.8K" period="last 24 hours" />)
    expect(screen.getByText('Events')).toBeInTheDocument()
    expect(screen.getByText('24.8K')).toBeInTheDocument()
    expect(screen.getByText('last 24 hours')).toBeInTheDocument()
  })

  it('renders positive trend', () => {
    render(<MetricCard label="Events" value="24.8K" trend={18} positive={true} />)
    expect(screen.getByText('+18%')).toBeInTheDocument()
  })

  it('renders negative trend without plus sign', () => {
    render(<MetricCard label="Events" value="5K" trend={8} positive={false} />)
    expect(screen.getByText('8%')).toBeInTheDocument()
  })

  it('renders sparkline SVG when data provided', () => {
    const { container } = render(<MetricCard label="Test" value="1K" sparkline={[1, 2, 3, 4, 5]} positive={true} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('expands breakdown on click', () => {
    const breakdown = [
      { label: 'Delivered', value: '24,312' },
      { label: 'Failed', value: '488' },
    ]
    render(<MetricCard label="Events" value="24.8K" breakdown={breakdown} />)
    expect(screen.queryByText('Delivered')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('24.8K'))
    expect(screen.getByText('Delivered')).toBeInTheDocument()
    expect(screen.getByText('24,312')).toBeInTheDocument()
  })
})
