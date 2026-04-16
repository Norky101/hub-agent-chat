import { useState } from 'react'
import theme from '../theme.js'

const styles = {
  card: (hovered) => ({
    background: theme.colors.surface,
    border: `1px solid ${hovered ? theme.colors.borderStrong : theme.colors.border}`,
    borderRadius: theme.radius.lg,
    borderBottom: `2px solid ${theme.colors.accent}`,
    padding: '22px 24px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 20,
    maxWidth: 380,
    transition: `border-color ${theme.transition.base}`,
  }),
  label: {
    fontSize: 11, fontWeight: 500, color: theme.colors.textMuted,
    fontFamily: theme.fonts.sans, letterSpacing: '0.08em', textTransform: 'uppercase',
  },
  value: {
    fontSize: 38, fontWeight: 500, color: theme.colors.text,
    fontFamily: theme.fonts.sans, lineHeight: 1.1, letterSpacing: '-0.04em', marginTop: 8,
  },
  period: { fontSize: 12, color: theme.colors.textFaint, fontFamily: theme.fonts.sans, marginTop: 8 },
  right: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, paddingTop: 4 },
  trend: (positive) => ({
    display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500,
    fontFamily: theme.fonts.mono, color: positive ? theme.colors.green : theme.colors.red,
    background: positive ? theme.colors.greenSoft : theme.colors.redSoft,
    padding: '3px 10px', borderRadius: theme.radius.pill,
  }),
  sparkWrap: { opacity: 0.85 },
}

function Sparkline({ data, positive }) {
  const w = 90, h = 32, pad = 2
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1
  const color = positive ? theme.colors.green : theme.colors.red
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs><linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.15} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      <polygon points={`${pad},${h} ${points} ${w - pad},${h}`} fill="url(#sparkFill)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function MetricCard({ label, value, trend, positive = true, period, sparkline }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={styles.card(hovered)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div>
        <div style={styles.label}>{label}</div>
        <div style={styles.value}>{value}</div>
        {period && <div style={styles.period}>{period}</div>}
      </div>
      <div style={styles.right}>
        {trend !== undefined && <div style={styles.trend(positive)}>{positive ? '+' : ''}{trend}%</div>}
        {sparkline && <div style={styles.sparkWrap}><Sparkline data={sparkline} positive={positive} /></div>}
      </div>
    </div>
  )
}
