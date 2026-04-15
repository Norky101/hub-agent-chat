import { useState } from 'react'
import theme from '../theme.js'
import AgentAvatar from './AgentAvatar.jsx'

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
    gap: 20,
    padding: '40px 24px',
  },
  name: {
    fontSize: 20,
    fontWeight: 500,
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
    letterSpacing: '-0.02em',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.sans,
    letterSpacing: '0.01em',
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 12,
    maxWidth: 420,
  },
  pill: (hovered) => ({
    fontFamily: theme.fonts.sans,
    fontSize: 13,
    fontWeight: 400,
    color: hovered ? theme.colors.accent : theme.colors.textSecondary,
    background: hovered ? theme.colors.accentLight : 'transparent',
    border: `1px solid ${hovered ? theme.colors.accent : theme.colors.borderMedium}`,
    borderRadius: theme.radius.pill,
    padding: '8px 18px',
    cursor: 'pointer',
    transition: `all ${theme.transition.normal}`,
    letterSpacing: '0.01em',
  }),
}

export default function WelcomeScreen({ onSend }) {
  const [hovered, setHovered] = useState(null)
  return (
    <div style={styles.wrapper}>
      <AgentAvatar size={48} />
      <div style={styles.name}>Hub Agent</div>
      <div style={styles.subtitle}>Your AI business assistant</div>
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
