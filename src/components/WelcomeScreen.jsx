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
  orbContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    marginBottom: 40,
  },
  orbOuter: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 35%, rgba(79, 110, 247, 0.18) 0%, rgba(120, 90, 220, 0.08) 40%, transparent 70%)',
    animation: 'orbFloat 8s ease-in-out infinite',
  },
  orbMid: {
    position: 'absolute',
    top: '18%',
    left: '18%',
    width: '64%',
    height: '64%',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 45% 40%, rgba(79, 110, 247, 0.22) 0%, rgba(160, 140, 240, 0.08) 50%, transparent 75%)',
    filter: 'blur(2px)',
    animation: 'orbFloat 6s ease-in-out 0.5s infinite',
  },
  orbCore: {
    position: 'absolute',
    top: '32%',
    left: '32%',
    width: '36%',
    height: '36%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79, 110, 247, 0.3) 0%, rgba(100, 130, 255, 0.1) 60%, transparent 80%)',
    filter: 'blur(4px)',
    animation: 'orbFloat 5s ease-in-out 1s infinite',
  },
  title: {
    fontSize: 28,
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
      <div style={styles.orbContainer}>
        <div style={styles.orbOuter} />
        <div style={styles.orbMid} />
        <div style={styles.orbCore} />
      </div>
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
