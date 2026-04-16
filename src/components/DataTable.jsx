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
    overflow: 'hidden',
    maxWidth: 540,
  },
  table: { width: '100%', borderCollapse: 'collapse', fontFamily: theme.fonts.sans, fontSize: 14 },
  th: (align) => ({
    textAlign: align || 'left', padding: '11px 20px', fontSize: 10, fontWeight: 500,
    color: theme.colors.textFaint, textTransform: 'uppercase', letterSpacing: '0.1em',
    borderBottom: `1px solid ${theme.colors.border}`,
  }),
  row: (hovered, isLast, isExpanded) => ({
    borderBottom: (isLast && !isExpanded) ? 'none' : `1px solid ${theme.colors.border}`,
    background: hovered ? theme.colors.surfaceHover : 'transparent',
    transition: `background ${theme.transition.fast}`,
    cursor: 'pointer',
  }),
  td: (align) => ({
    padding: '13px 20px', color: theme.colors.text,
    textAlign: align || 'left', verticalAlign: 'middle',
  }),
  tdMono: {
    padding: '13px 20px', color: theme.colors.textSecondary, fontFamily: theme.fonts.mono,
    fontSize: 13, textAlign: 'right', fontVariantNumeric: 'tabular-nums', verticalAlign: 'middle',
  },
  name: (expanded) => ({
    fontWeight: 500,
    color: expanded ? theme.colors.accent : theme.colors.text,
    transition: `color ${theme.transition.fast}`,
  }),
  chevron: (expanded) => ({
    display: 'inline-block',
    width: 14,
    height: 14,
    marginRight: 8,
    verticalAlign: 'middle',
    transition: `transform ${theme.transition.base}`,
    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
  }),
  badge: (status) => {
    const s = statusMap[status] || { color: theme.colors.textMuted, dot: theme.colors.textFaint }
    return { fontSize: 12, fontWeight: 500, color: s.color, display: 'inline-flex', alignItems: 'center', gap: 6 }
  },
  dot: (status) => ({
    width: 6, height: 6, borderRadius: '50%',
    background: (statusMap[status] || { dot: theme.colors.textFaint }).dot, flexShrink: 0,
  }),
  expandedRow: {
    background: 'rgba(79, 110, 247, 0.02)',
  },
  expandedCell: {
    padding: '0 20px 16px 42px',
    colSpan: 3,
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px 24px',
    paddingTop: 4,
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: theme.colors.textFaint,
    fontFamily: theme.fonts.sans,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  detailValue: {
    fontSize: 13,
    color: theme.colors.text,
    fontFamily: theme.fonts.mono,
    fontVariantNumeric: 'tabular-nums',
  },
  detailValueWarn: {
    fontSize: 13,
    color: theme.colors.red,
    fontFamily: theme.fonts.mono,
    fontWeight: 500,
  },
  footer: {
    padding: '9px 20px', fontSize: 11, color: theme.colors.textFaint,
    borderTop: `1px solid ${theme.colors.border}`, textAlign: 'right', fontFamily: theme.fonts.sans,
  },
}

function ChevronIcon({ expanded }) {
  return (
    <svg style={styles.chevron(expanded)} viewBox="0 0 24 24" fill="none" stroke={expanded ? theme.colors.accent : theme.colors.textFaint} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function ExpandedDetails({ detail }) {
  return (
    <tr style={styles.expandedRow}>
      <td colSpan={3} style={styles.expandedCell}>
        <div style={styles.detailGrid}>
          {detail.map((d, i) => (
            <div key={i} style={styles.detailItem}>
              <span style={styles.detailLabel}>{d.label}</span>
              <span style={d.warn ? styles.detailValueWarn : styles.detailValue}>{d.value}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  )
}

function Row({ row, columns, isLast, details }) {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const hasDetails = !!details

  return (
    <>
      <tr
        style={styles.row(hovered, isLast, expanded)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
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
          if (col.type === 'name') {
            return (
              <td key={ci} style={styles.td()}>
                <span style={styles.name(expanded)}>
                  {hasDetails && <ChevronIcon expanded={expanded} />}
                  {val}
                </span>
              </td>
            )
          }
          return <td key={ci} style={styles.td(col.align)}>{val}</td>
        })}
      </tr>
      {expanded && details && <ExpandedDetails detail={details} />}
    </>
  )
}

export default function DataTable({ columns, rows, details }) {
  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead><tr>{columns.map((c, i) => <th key={i} style={styles.th(c.align)}>{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <Row
              key={i}
              row={r}
              columns={columns}
              isLast={i === rows.length - 1}
              details={details?.[r[columns[0].key]]}
            />
          ))}
        </tbody>
      </table>
      <div style={styles.footer}>{rows.length} of {rows.length} providers</div>
    </div>
  )
}
