import theme from '../theme.js'

const sourceStyles = {
  live: { color: theme.colors.green, bg: theme.colors.greenSoft, label: 'LIVE' },
  logs: { color: theme.colors.textMuted, bg: 'rgba(0,0,0,0.04)', label: 'FROM LOGS' },
  calculated: { color: theme.colors.accent, bg: theme.colors.accentSoft, label: 'CALCULATED' },
  status: { color: theme.colors.amber, bg: theme.colors.amberSoft, label: 'STATUS PAGE' },
}

const styles = {
  tag: (source) => {
    const s = sourceStyles[source] || sourceStyles.calculated
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 9,
      fontWeight: 500,
      fontFamily: theme.fonts.mono,
      color: s.color,
      background: s.bg,
      padding: '2px 6px',
      borderRadius: theme.radius.sm,
      letterSpacing: '0.06em',
      lineHeight: 1,
      verticalAlign: 'middle',
      marginLeft: 6,
    }
  },
  dot: (source) => ({
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: (sourceStyles[source] || sourceStyles.calculated).color,
  }),
}

export default function SourceTag({ source }) {
  const s = sourceStyles[source] || sourceStyles.calculated
  return (
    <span style={styles.tag(source)}>
      <span style={styles.dot(source)} />
      {s.label}
    </span>
  )
}
