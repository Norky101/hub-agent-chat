import { useState } from 'react'
import theme from '../theme.js'

const styles = {
  card: (hovered) => ({
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 20,
    maxWidth: 360,
    transition: `box-shadow ${theme.transition.base}`,
    boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.04)' : 'none',
  }),
  left: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.sans,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 36,
    fontWeight: 500,
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    marginTop: 6,
  },
  period: {
    fontSize: 12,
    color: theme.colors.textFaint,
    fontFamily: theme.fonts.sans,
    marginTop: 6,
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 10,
    paddingTop: 4,
  },
  trend: (positive) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 12,
    fontWeight: 500,
    fontFamily: theme.fonts.mono,
    color: positive ? theme.colors.green : theme.colors.red,
    background: positive ? theme.colors.greenSoft : theme.colors.redSoft,
    padding: '3px 10px',
    borderRadius: theme.radius.pill,
  }),
}

function Sparkline({ data, positive }) {
  const w = 80, h = 28, pad = 2
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
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.12} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`${pad},${h} ${points} ${w - pad},${h}`} fill="url(#sparkGrad)" />
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
