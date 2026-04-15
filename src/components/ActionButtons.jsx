import { useState } from 'react'
import theme from '../theme.js'

const icons = {
  'send-invoice': (color) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  'schedule-call': (color) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  'flag-review': (color) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
}

const styles = {
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: (isHovered, isClicked) => ({
    fontFamily: theme.fonts.sans,
    fontSize: 13,
    fontWeight: 500,
    padding: '8px 18px',
    borderRadius: theme.radius.pill,
    border: `1px solid ${isClicked ? theme.colors.accent : theme.colors.borderMedium}`,
    background: isClicked
      ? theme.colors.accentLight
      : isHovered
        ? 'rgba(0, 0, 0, 0.02)'
        : 'transparent',
    color: isClicked ? theme.colors.accent : theme.colors.text,
    cursor: isClicked ? 'default' : 'pointer',
    transition: `all ${theme.transition.normal}`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    letterSpacing: '0.01em',
    transform: 'scale(1)',
  }),
}

export default function ActionButtons({ actions, onAction }) {
  const [clicked, setClicked] = useState({})
  const [hovered, setHovered] = useState(null)

  const handleClick = (action) => {
    if (clicked[action.id]) return
    setClicked((prev) => ({ ...prev, [action.id]: true }))
    if (onAction) onAction(action)
  }

  return (
    <div style={styles.row}>
      {actions.map((action) => {
        const isActive = clicked[action.id]
        const isHov = hovered === action.id
        const iconColor = isActive ? theme.colors.accent : theme.colors.textSecondary
        const iconFn = icons[action.id]

        return (
          <button
            key={action.id}
            style={styles.button(isHov, isActive)}
            onClick={() => handleClick(action)}
            onMouseEnter={() => setHovered(action.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {iconFn && iconFn(iconColor)}
            {action.label}
          </button>
        )
      })}
    </div>
  )
}
