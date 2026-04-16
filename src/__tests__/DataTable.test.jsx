import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DataTable from '../components/DataTable.jsx'

const columns = [
  { key: 'provider', label: 'Provider', type: 'name' },
  { key: 'status', label: 'Health', type: 'status' },
  { key: 'events', label: 'Events', align: 'right' },
]

const rows = [
  { provider: 'Shopify', status: 'Healthy', events: '12,340' },
  { provider: 'GitHub', status: 'Degraded', events: '2,891' },
]

const details = {
  Shopify: [
    { label: 'Endpoints', value: '3 active' },
    { label: 'Success Rate', value: '99.8%' },
  ],
  GitHub: [
    { label: 'Success Rate', value: '94.2%', warn: true },
    { label: 'Failed Events', value: '47 in queue', warn: true },
  ],
}

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} rows={rows} />)
    expect(screen.getByText('Provider')).toBeInTheDocument()
    expect(screen.getByText('Health')).toBeInTheDocument()
    expect(screen.getByText('Events')).toBeInTheDocument()
  })

  it('renders all rows', () => {
    render(<DataTable columns={columns} rows={rows} />)
    expect(screen.getByText('Shopify')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('12,340')).toBeInTheDocument()
  })

  it('renders status badges', () => {
    render(<DataTable columns={columns} rows={rows} />)
    expect(screen.getByText('Healthy')).toBeInTheDocument()
    expect(screen.getByText('Degraded')).toBeInTheDocument()
  })

  it('shows row count in footer', () => {
    render(<DataTable columns={columns} rows={rows} />)
    expect(screen.getByText('2 of 2 providers')).toBeInTheDocument()
  })

  it('expands row details on click', () => {
    render(<DataTable columns={columns} rows={rows} details={details} />)
    expect(screen.queryByText('3 active')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Shopify'))
    expect(screen.getByText('3 active')).toBeInTheDocument()
    expect(screen.getByText('99.8%')).toBeInTheDocument()
  })

  it('expands degraded provider with warning details', () => {
    render(<DataTable columns={columns} rows={rows} details={details} />)
    fireEvent.click(screen.getByText('GitHub'))
    expect(screen.getByText('94.2%')).toBeInTheDocument()
    expect(screen.getByText('47 in queue')).toBeInTheDocument()
  })
})
