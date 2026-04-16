import { useState } from 'react'
import theme from '../theme.js'

const statusMap = {
  Paid: { color: theme.colors.green, bg: theme.colors.greenSoft },
  Pending: { color: theme.colors.amber, bg: theme.colors.amberSoft },
  Overdue: { color: theme.colors.red, bg: theme.colors.redSoft },
}

const styles = {
  wrapper: {
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
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
    padding: '10px 16px',
    fontSize: 11,
    fontWeight: 500,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderBottom: `1px solid ${theme.colors.border}`,
  }),
  row: (hovered, isLast) => ({
    borderBottom: isLast ? 'none' : `1px solid ${theme.colors.border}`,
    background: hovered ? 'rgba(0, 0, 0, 0.012)' : 'transparent',
    transition: `background ${theme.transition.fast}`,
  }),
  td: (align) => ({
    padding: '12px 16px',
    color: theme.colors.text,
    textAlign: align || 'left',
    height: 44,
    verticalAlign: 'middle',
  }),
  tdMono: {
    padding: '12px 16px',
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
    height: 44,
    verticalAlign: 'middle',
  },
  name: { fontWeight: 500 },
  badge: (status) => {
    const s = statusMap[status] || { color: theme.colors.textMuted, bg: theme.colors.accentSoft }
    return {
      fontSize: 11,
      fontWeight: 500,
      padding: '2px 10px',
      borderRadius: theme.radius.pill,
      color: s.color,
      background: s.bg,
      display: 'inline-block',
    }
  },
  footer: {
    padding: '8px 16px',
    fontSize: 11,
    color: theme.colors.textFaint,
    borderTop: `1px solid ${theme.colors.border}`,
    textAlign: 'right',
    fontFamily: theme.fonts.sans,
  },
}

function Row({ row, columns, isLast }) {
  const [h, setH] = useState(false)
  return (
    <tr style={styles.row(h, isLast)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {columns.map((col, ci) => {
        const val = row[col.key]
        if (col.align === 'right') return <td key={ci} style={styles.tdMono}>{val}</td>
        if (col.type === 'status') return <td key={ci} style={styles.td()}><span style={styles.badge(val)}>{val}</span></td>
        if (col.type === 'name') return <td key={ci} style={{ ...styles.td(), ...styles.name }}>{val}</td>
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
          <tr>{columns.map((c, i) => <th key={i} style={styles.th(c.align)}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => <Row key={i} row={r} columns={columns} isLast={i === rows.length - 1} />)}
        </tbody>
      </table>
      <div style={styles.footer}>{rows.length} clients</div>
    </div>
  )
}
