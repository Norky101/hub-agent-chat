import { useState } from 'react'
import theme from '../theme.js'

const styles = {
  wrapper: {
    marginTop: 4,
  },
  toggle: (open) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    fontWeight: 500,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.sans,
    background: 'none',
    border: 'none',
    padding: '4px 0',
    cursor: 'pointer',
    letterSpacing: '0.02em',
    transition: `color ${theme.transition.fast}`,
  }),
  chevron: (open) => ({
    width: 12,
    height: 12,
    transition: `transform ${theme.transition.base}`,
    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
  }),
  trail: {
    padding: '10px 0 4px 18px',
    borderLeft: `2px solid ${theme.colors.border}`,
    marginTop: 6,
    marginLeft: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  step: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.sans,
    lineHeight: 1.5,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  },
  stepIcon: {
    fontSize: 10,
    color: theme.colors.textFaint,
    marginTop: 2,
    flexShrink: 0,
  },
}

export default function ReasoningTrail({ steps }) {
  const [open, setOpen] = useState(false)

  if (!steps || steps.length === 0) return null

  return (
    <div style={styles.wrapper}>
      <button style={styles.toggle(open)} onClick={() => setOpen(!open)}>
        <svg style={styles.chevron(open)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        How I got here
      </button>
      {open && (
        <div style={styles.trail}>
          {steps.map((step, i) => (
            <div key={i} style={styles.step}>
              <span style={styles.stepIcon}>{i + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
