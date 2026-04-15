import theme from '../theme.js'
import AgentAvatar from './AgentAvatar.jsx'
import MetricCard from './MetricCard.jsx'
import DataTable from './DataTable.jsx'
import ActionButtons from './ActionButtons.jsx'

const styles = {
  row: (isUser, animate, direction) => ({
    display: 'flex',
    flexDirection: isUser ? 'row-reverse' : 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: '2px 0',
    animation: animate ? `${direction} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards` : 'none',
    opacity: animate ? 0 : 1,
  }),
  content: (isUser) => ({
    maxWidth: '85%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    alignItems: isUser ? 'flex-end' : 'flex-start',
  }),
  bubble: (isUser) => ({
    fontSize: 15,
    lineHeight: 1.65,
    fontFamily: theme.fonts.sans,
    fontWeight: 400,
    color: isUser ? theme.colors.userText : theme.colors.text,
    background: isUser ? theme.colors.userBubble : theme.colors.surface,
    border: isUser ? 'none' : `1px solid ${theme.colors.border}`,
    padding: '12px 18px',
    borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    letterSpacing: '0.01em',
  }),
  meta: (isUser) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 11,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.sans,
    flexDirection: isUser ? 'row-reverse' : 'row',
    letterSpacing: '0.02em',
  }),
  name: {
    fontWeight: 500,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontSize: 10,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: '50%',
    background: theme.colors.textTertiary,
  },
  avatarSpacer: {
    width: 32,
    minWidth: 32,
  },
  block: (delay) => ({
    animationDelay: delay > 0 ? `${delay}ms` : undefined,
  }),
}

function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export default function MessageBubble({ message, onAction, animate }) {
  const isUser = message.role === 'user'
  const showMeta = message.showMeta !== false
  const showAvatar = !isUser && showMeta

  return (
    <div style={styles.row(isUser, animate, isUser ? 'fadeInRight' : 'fadeInLeft')}>
      {!isUser && (showAvatar ? <AgentAvatar /> : <div style={styles.avatarSpacer} />)}
      <div style={styles.content(isUser)}>
        {showMeta && (
          <div style={styles.meta(isUser)}>
            {!isUser && <span style={styles.name}>Hub Agent</span>}
            {!isUser && <span style={styles.dot} />}
            <span>{formatTime(message.timestamp)}</span>
          </div>
        )}

        {message.blocks.map((block, i) => {
          const delay = animate ? i * 60 : 0
          switch (block.type) {
            case 'text':
              return <div key={i} style={{ ...styles.bubble(isUser), ...(delay ? { animationDelay: `${delay}ms` } : {}) }}>{block.content}</div>
            case 'metric':
              return <div key={i} style={styles.block(delay)}><MetricCard {...block.data} /></div>
            case 'table':
              return <div key={i} style={styles.block(delay)}><DataTable columns={block.data.columns} rows={block.data.rows} /></div>
            case 'actions':
              return <div key={i} style={styles.block(delay)}><ActionButtons actions={block.data} onAction={onAction} /></div>
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}
