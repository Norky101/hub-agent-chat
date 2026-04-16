import { useState } from 'react'
import theme from '../theme.js'

const styles = {
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  btn: (hovered, clicked) => ({
    fontFamily: theme.fonts.sans,
    fontSize: 14,
    fontWeight: 400,
    padding: '10px 22px',
    borderRadius: theme.radius.pill,
    border: clicked
      ? '1px solid transparent'
      : `1px solid ${hovered ? 'rgba(79, 110, 247, 0.3)' : theme.colors.border}`,
    background: clicked
      ? 'linear-gradient(135deg, rgba(79, 110, 247, 0.1), rgba(120, 90, 220, 0.06))'
      : hovered
        ? 'rgba(79, 110, 247, 0.04)'
        : theme.glass.background,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: clicked ? theme.colors.accent : hovered ? theme.colors.text : theme.colors.textSecondary,
    cursor: clicked ? 'default' : 'pointer',
    transition: `all ${theme.transition.base}`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    boxShadow: hovered && !clicked
      ? '0 2px 12px rgba(79, 110, 247, 0.08)'
      : '0 1px 3px rgba(0,0,0,0.02)',
    transform: hovered && !clicked ? 'translateY(-1px)' : 'none',
    letterSpacing: '0.01em',
  }),
}

export default function ActionButtons({ actions, onAction }) {
  const [clicked, setClicked] = useState({})
  const [hovered, setHovered] = useState(null)

  const handleClick = (action) => {
    if (clicked[action.id]) return
    setClicked((p) => ({ ...p, [action.id]: true }))
    if (onAction) onAction(action)
  }

  return (
    <div style={styles.row}>
      {actions.map((a) => (
        <button
          key={a.id}
          style={styles.btn(hovered === a.id, clicked[a.id])}
          onClick={() => handleClick(a)}
          onMouseEnter={() => setHovered(a.id)}
          onMouseLeave={() => setHovered(null)}
        >
          {clicked[a.id] && <span style={{ fontSize: 12, lineHeight: 1 }}>&#10003;</span>}
          {a.label}
        </button>
      ))}
    </div>
  )
}
