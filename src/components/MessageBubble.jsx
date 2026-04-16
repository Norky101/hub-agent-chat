import theme from '../theme.js'
import MetricCard from './MetricCard.jsx'
import DataTable from './DataTable.jsx'
import ActionButtons from './ActionButtons.jsx'

const styles = {
  row: (isUser, animate) => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    padding: '2px 0',
    opacity: animate ? 0 : 1,
    animation: animate ? `fadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards` : 'none',
  }),
  agentContent: {
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  agentText: {
    fontSize: 16,
    lineHeight: 1.75,
    fontFamily: theme.fonts.sans,
    fontWeight: 400,
    color: theme.colors.text,
    letterSpacing: '0.005em',
    maxWidth: 600,
  },
  userPill: {
    fontSize: 15,
    lineHeight: 1.6,
    fontFamily: theme.fonts.sans,
    fontWeight: 400,
    color: theme.colors.userText,
    background: theme.colors.userBubble,
    padding: '12px 20px',
    borderRadius: '22px 22px 6px 22px',
    maxWidth: '70%',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  timestamp: {
    fontSize: 11,
    color: theme.colors.textFaint,
    fontFamily: theme.fonts.sans,
    marginTop: 6,
    letterSpacing: '0.03em',
    fontVariantNumeric: 'tabular-nums',
  },
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export default function MessageBubble({ message, onAction, animate }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div style={styles.row(true, animate)}>
        <div>
          <div style={styles.userPill}>{message.blocks[0]?.content}</div>
          {message.showMeta && (
            <div style={{ ...styles.timestamp, textAlign: 'right' }}>
              {formatTime(message.timestamp)}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={styles.row(false, animate)}>
      <div style={styles.agentContent}>
        {message.showMeta && (
          <div style={styles.timestamp}>{formatTime(message.timestamp)}</div>
        )}
        {message.blocks.map((block, i) => {
          switch (block.type) {
            case 'text':
              return <div key={i} style={styles.agentText}>{block.content}</div>
            case 'metric':
              return <MetricCard key={i} {...block.data} />
            case 'table':
              return <DataTable key={i} columns={block.data.columns} rows={block.data.rows} />
            case 'actions':
              return <ActionButtons key={i} actions={block.data} onAction={onAction} />
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}
