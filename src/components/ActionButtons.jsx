import { useState } from 'react'
import theme from '../theme.js'

const styles = {
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  btn: (hovered, clicked) => ({
    fontFamily: theme.fonts.sans,
    fontSize: 14,
    fontWeight: 400,
    padding: '9px 20px',
    borderRadius: theme.radius.pill,
    border: `1px solid ${clicked ? theme.colors.accent : hovered ? theme.colors.borderStrong : theme.colors.border}`,
    background: clicked ? theme.colors.accentSoft : 'transparent',
    color: clicked ? theme.colors.accent : theme.colors.textSecondary,
    cursor: clicked ? 'default' : 'pointer',
    transition: `all ${theme.transition.base}`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
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
          {clicked[a.id] && <span style={{ fontSize: 12 }}>&#10003;</span>}
          {a.label}
        </button>
      ))}
    </div>
  )
}
