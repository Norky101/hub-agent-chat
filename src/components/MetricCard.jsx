import { useState } from 'react'
import theme from '../theme.js'

const styles = {
  card: (hovered) => ({
    background: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 20,
    maxWidth: 340,
    borderLeft: `2px solid ${theme.colors.accent}`,
    boxShadow: hovered ? theme.shadow.md : theme.shadow.sm,
    transition: `box-shadow ${theme.transition.normal}`,
    cursor: 'default',
  }),
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: 500,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.sans,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 36,
    fontWeight: 600,
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    marginTop: 4,
  },
  period: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.sans,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginTop: 6,
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
    paddingTop: 2,
  },
  trend: (positive) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 12,
    fontWeight: 500,
    fontFamily: theme.fonts.mono,
    color: positive ? theme.colors.green : theme.colors.red,
    background: positive ? theme.colors.greenBg : theme.colors.redBg,
    padding: '3px 10px',
    borderRadius: theme.radius.pill,
  }),
  arrow: {
    fontSize: 11,
    lineHeight: 1,
  },
}

export default function MetricCard({ label, value, trend, positive = true, period, sparkline }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={styles.card(hovered)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.left}>
        <div style={styles.label}>{label}</div>
        <div style={styles.value}>{value}</div>
        {period && <div style={styles.period}>{period}</div>}
      </div>
      <div style={styles.right}>
        {trend !== undefined && (
          <div style={styles.trend(positive)}>
            <span style={styles.arrow}>{positive ? '\u2197' : '\u2198'}</span>
            {positive ? '+' : ''}{trend}%
          </div>
        )}
        {sparkline && <Sparkline data={sparkline} positive={positive} />}
      </div>
    </div>
  )
}

function Sparkline({ data, positive }) {
  const w = 80
  const h = 28
  const pad = 2
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2)
      const y = h - pad - ((v - min) / range) * (h - pad * 2)
      return `${x},${y}`
    })
    .join(' ')

  const color = positive ? theme.colors.green : theme.colors.red
  const id = `spark-${positive ? 'g' : 'r'}`

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.12} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points={`${pad},${h} ${points} ${w - pad},${h}`}
        fill={`url(#${id})`}
      />
    </svg>
  )
}
