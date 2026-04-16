import { useState } from 'react'
import theme from '../theme.js'

const statusMap = {
  Healthy: { color: theme.colors.green, dot: theme.colors.green },
  Degraded: { color: theme.colors.amber, dot: theme.colors.amber },
  Down: { color: theme.colors.red, dot: theme.colors.red },
}

const styles = {
  wrapper: {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    overflow: 'auto',
    maxWidth: 540,
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
    padding: '11px 20px',
    fontSize: 10,
    fontWeight: 500,
    color: theme.colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    borderBottom: `1px solid ${theme.colors.border}`,
  }),
  row: (hovered, isLast, isOdd) => ({
    borderBottom: isLast ? 'none' : `1px solid ${theme.colors.border}`,
    background: hovered ? 'rgba(79, 110, 247, 0.02)' : isOdd ? 'rgba(0, 0, 0, 0.008)' : 'transparent',
    transition: `background ${theme.transition.fast}`,
  }),
  td: (align) => ({
    padding: '13px 20px',
    color: theme.colors.text,
    textAlign: align || 'left',
    verticalAlign: 'middle',
  }),
  tdMono: {
    padding: '13px 20px',
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
    verticalAlign: 'middle',
  },
  name: { fontWeight: 500 },
  badge: (status) => {
    const s = statusMap[status] || { color: theme.colors.textMuted, dot: theme.colors.textFaint }
    return {
      fontSize: 12,
      fontWeight: 500,
      color: s.color,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
    }
  },
  dot: (status) => ({
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: (statusMap[status] || { dot: theme.colors.textFaint }).dot,
    flexShrink: 0,
  }),
  footer: {
    padding: '9px 20px',
    fontSize: 11,
    color: theme.colors.textFaint,
    borderTop: `1px solid ${theme.colors.border}`,
    textAlign: 'right',
    fontFamily: theme.fonts.sans,
    letterSpacing: '0.02em',
  },
}

function Row({ row, columns, isLast, isOdd }) {
  const [h, setH] = useState(false)
  return (
    <tr style={styles.row(h, isLast, isOdd)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {columns.map((col, ci) => {
        const val = row[col.key]
        if (col.align === 'right') return <td key={ci} style={styles.tdMono}>{val}</td>
        if (col.type === 'status') {
          return (
            <td key={ci} style={styles.td()}>
              <span style={styles.badge(val)}><span style={styles.dot(val)} />{val}</span>
            </td>
          )
        }
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
          {rows.map((r, i) => <Row key={i} row={r} columns={columns} isLast={i === rows.length - 1} isOdd={i % 2 === 1} />)}
        </tbody>
      </table>
      <div style={styles.footer}>{rows.length} of {rows.length} providers</div>
    </div>
  )
}
