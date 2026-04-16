import { useState } from 'react'
import theme from '../theme.js'

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  pill: (hovered) => ({
    fontFamily: theme.fonts.sans,
    fontSize: 12,
    fontWeight: 400,
    color: hovered ? theme.colors.accent : theme.colors.textMuted,
    background: hovered ? theme.colors.accentSoft : 'transparent',
    border: `1px solid ${hovered ? theme.colors.accent : theme.colors.border}`,
    borderRadius: theme.radius.pill,
    padding: '6px 14px',
    cursor: 'pointer',
    transition: `all ${theme.transition.base}`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
  }),
  arrow: {
    fontSize: 10,
    lineHeight: 1,
  },
}

export default function FollowUps({ suggestions, onSend }) {
  const [hovered, setHovered] = useState(null)

  if (!suggestions || suggestions.length === 0) return null

  return (
    <div style={styles.wrapper}>
      {suggestions.map((s, i) => (
        <button
          key={i}
          style={styles.pill(hovered === i)}
          onClick={() => onSend(s)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          {s}
          <span style={styles.arrow}>&rarr;</span>
        </button>
      ))}
    </div>
  )
}
