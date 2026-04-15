import theme from '../theme.js'

const styles = {
  wrapper: (size = 32) => ({
    width: size,
    height: size,
    minWidth: size,
    borderRadius: '50%',
    background: theme.colors.accentGradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  letter: (size = 32) => ({
    color: '#fff',
    fontSize: size * 0.42,
    fontWeight: 500,
    fontFamily: theme.fonts.sans,
    lineHeight: 1,
    letterSpacing: '-0.01em',
  }),
}

export default function AgentAvatar({ size = 32 }) {
  return (
    <div style={styles.wrapper(size)}>
      <span style={styles.letter(size)}>H</span>
    </div>
  )
}
