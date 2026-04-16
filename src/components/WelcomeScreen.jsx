import { useState } from 'react'
import theme from '../theme.js'

const prompts = [
  'Show me this week\u2019s revenue',
  'Client status update',
  'Who\u2019s overdue on invoices?',
]

const styles = {
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 24px 80px',
    gap: 0,
  },
  orb: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 40%, rgba(79, 110, 247, 0.25) 0%, rgba(160, 120, 255, 0.15) 30%, rgba(200, 180, 240, 0.08) 60%, transparent 80%)',
    filter: 'blur(1px)',
    marginBottom: 32,
    position: 'relative',
    animation: 'orbFloat 6s ease-in-out infinite',
  },
  orbInner: {
    position: 'absolute',
    top: '15%',
    left: '20%',
    width: '50%',
    height: '50%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79, 110, 247, 0.3) 0%, rgba(140, 180, 255, 0.1) 60%, transparent 80%)',
    filter: 'blur(4px)',
  },
  title: {
    fontSize: 24,
    fontWeight: 400,
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
    letterSpacing: '-0.03em',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.sans,
    letterSpacing: '0.01em',
    marginBottom: 36,
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
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
    padding: '10px 20px',
    cursor: 'pointer',
    transition: `all ${theme.transition.base}`,
    boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
  }),
}

export default function WelcomeScreen({ onSend }) {
  const [hovered, setHovered] = useState(null)
  return (
    <div style={styles.wrapper}>
      <div style={styles.orb}>
        <div style={styles.orbInner} />
      </div>
      <div style={styles.title}>Hub Agent</div>
      <div style={styles.subtitle}>What can I help you with?</div>
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
