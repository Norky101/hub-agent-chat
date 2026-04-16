import { useState } from 'react'
import theme from '../theme.js'

const prompts = [
  'Show me overnight event volume',
  'Which providers are failing?',
  'Retry all failed Stripe events',
]

const styles = {
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 24px 80px',
  },
  mark: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.colors.accent}, #7B5CF7)`,
    opacity: 0.9,
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
    letterSpacing: '-0.03em',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.sans,
    marginBottom: 40,
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  pill: (hovered) => ({
    fontFamily: theme.fonts.sans,
    fontSize: 14,
    fontWeight: 400,
    color: hovered ? theme.colors.text : theme.colors.textSecondary,
    background: hovered ? theme.colors.surface : 'transparent',
    border: `1px solid ${hovered ? theme.colors.borderStrong : theme.colors.border}`,
    borderRadius: theme.radius.pill,
    padding: '10px 22px',
    cursor: 'pointer',
    transition: `all ${theme.transition.base}`,
    boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
  }),
}

export default function WelcomeScreen({ onSend }) {
  const [hovered, setHovered] = useState(null)
  return (
    <div style={styles.wrapper}>
      <div style={styles.mark} />
      <div style={styles.title}>Hub Agent</div>
      <div style={styles.subtitle}>Your webhook pipeline, managed</div>
      <div style={styles.pills}>
        {prompts.map((p, i) => (
          <button
            key={i}
            style={styles.pill(hovered === i)}
            onClick={() => onSend(p)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
