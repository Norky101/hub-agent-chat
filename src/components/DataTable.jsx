import { useState } from 'react'
import theme from '../theme.js'

const statusColors = {
  Paid: { color: theme.colors.green, bg: theme.colors.greenBg },
  Pending: { color: theme.colors.yellow, bg: theme.colors.yellowBg },
  Overdue: { color: theme.colors.red, bg: theme.colors.redBg },
}

const styles = {
  wrapper: {
    borderRadius: theme.radius.md,
    overflow: 'auto',
    maxWidth: 520,
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: theme.fonts.sans,
    fontSize: 14,
  },
  th: (align) => ({
    textAlign: align || 'left',
    padding: '8px 16px',
    fontSize: 10,
    fontWeight: 500,
    color: theme.colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: `1px solid ${theme.colors.border}`,
  }),
  row: (hovered, isLast) => ({
    borderBottom: isLast ? 'none' : `1px solid ${theme.colors.border}`,
    background: hovered ? 'rgba(0, 0, 0, 0.015)' : 'transparent',
    transition: `background ${theme.transition.fast}`,
  }),
  td: (align) => ({
    padding: '12px 16px',
    color: theme.colors.text,
    textAlign: align || 'left',
    height: 48,
    verticalAlign: 'middle',
  }),
  tdMono: {
    padding: '12px 16px',
    color: theme.colors.text,
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
    height: 48,
    verticalAlign: 'middle',
  },
  clientName: {
    fontWeight: 500,
  },
  statusBadge: (status) => {
    const palette = statusColors[status] || { color: theme.colors.textSecondary, bg: theme.colors.accentLight }
    return {
      display: 'inline-block',
      fontSize: 11,
      fontWeight: 500,
      padding: '2px 10px',
      borderRadius: theme.radius.pill,
      color: palette.color,
      background: palette.bg,
      letterSpacing: '0.02em',
    }
  },
  footer: {
    padding: '10px 16px',
    fontSize: 11,
    color: theme.colors.textTertiary,
    textAlign: 'right',
    fontFamily: theme.fonts.sans,
    letterSpacing: '0.02em',
    borderTop: `1px solid ${theme.colors.border}`,
  },
}

function TableRow({ row, columns, isLast }) {
  const [hovered, setHovered] = useState(false)
  return (
    <tr
      style={styles.row(hovered, isLast)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {columns.map((col, ci) => {
        const val = row[col.key]
        if (col.align === 'right') {
          return <td key={ci} style={styles.tdMono}>{val}</td>
        }
        if (col.type === 'status') {
          return (
            <td key={ci} style={styles.td()}>
              <span style={styles.statusBadge(val)}>{val}</span>
            </td>
          )
        }
        if (col.type === 'name') {
          return <td key={ci} style={{ ...styles.td(), ...styles.clientName }}>{val}</td>
        }
        return <td key={ci} style={styles.td(col.align)}>{val}</td>
      })}
    </tr>
  )
}

export default function DataTable({ columns, rows }) {
  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={styles.th(col.align)}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <TableRow key={ri} row={row} columns={columns} isLast={ri === rows.length - 1} />
          ))}
        </tbody>
      </table>
      <div style={styles.footer}>{rows.length} clients</div>
    </div>
  )
}
