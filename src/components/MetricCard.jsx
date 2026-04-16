import { useState } from 'react'
import theme from '../theme.js'

const styles = {
  card: (hovered) => ({
    ...theme.glass,
    borderRadius: theme.radius.lg,
    padding: '24px 28px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 20,
    maxWidth: 380,
    transition: `all ${theme.transition.base}`,
    boxShadow: hovered
      ? '0 8px 32px rgba(79, 110, 247, 0.08), 0 2px 8px rgba(0,0,0,0.03)'
      : theme.glass.boxShadow,
    transform: hovered ? 'translateY(-1px)' : 'none',
  }),
  left: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: 11,
    fontWeight: 500,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.sans,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 42,
    fontWeight: 500,
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
    lineHeight: 1.1,
    letterSpacing: '-0.04em',
    marginTop: 8,
  },
  period: {
    fontSize: 12,
    color: theme.colors.textFaint,
    fontFamily: theme.fonts.sans,
    marginTop: 8,
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 12,
    paddingTop: 4,
  },
  trend: (positive) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    fontWeight: 500,
    fontFamily: theme.fonts.mono,
    color: positive ? theme.colors.green : theme.colors.red,
    background: positive ? theme.colors.greenSoft : theme.colors.redSoft,
    padding: '4px 12px',
    borderRadius: theme.radius.pill,
    letterSpacing: '0.02em',
  }),
}

function Sparkline({ data, positive }) {
  const w = 90, h = 32, pad = 2
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const color = positive ? theme.colors.green : theme.colors.red

  const points = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2)
      const y = h - pad - ((v - min) / range) * (h - pad * 2)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={`${pad},${h} ${points} ${w - pad},${h}`} fill="url(#sparkFill)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
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
            {positive ? '+' : ''}{trend}%
          </div>
        )}
        {sparkline && <Sparkline data={sparkline} positive={positive} />}
      </div>
    </div>
  )
}
