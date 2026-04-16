import theme from '../theme.js'

const styles = {
  wrapper: {
    borderLeft: `3px solid ${theme.colors.red}`,
    background: theme.colors.redSoft,
    borderRadius: `0 ${theme.radius.md} ${theme.radius.md} 0`,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 16,
    height: 16,
    flexShrink: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    fontFamily: theme.fonts.sans,
    color: theme.colors.red,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  time: {
    fontSize: 11,
    color: theme.colors.textFaint,
    fontFamily: theme.fonts.sans,
    marginLeft: 'auto',
  },
  message: {
    fontSize: '15px',
    lineHeight: 1.7,
    fontFamily: theme.fonts.sans,
    fontWeight: 400,
    color: theme.colors.text,
  },
}

function AlertIcon() {
  return (
    <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke={theme.colors.red} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function renderText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export default function AlertBanner({ content, time }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <AlertIcon />
        <span style={styles.label}>Incident Detected</span>
        {time && <span style={styles.time}>{time}</span>}
      </div>
      <div style={styles.message}>{renderText(content)}</div>
    </div>
  )
}
