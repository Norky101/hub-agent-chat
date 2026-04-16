import theme from '../theme.js'
import useViewportFade from '../hooks/useViewportFade.js'
import MetricCard from './MetricCard.jsx'
import DataTable from './DataTable.jsx'
import ActionButtons from './ActionButtons.jsx'
import ReasoningTrail from './ReasoningTrail.jsx'
import FollowUps from './FollowUps.jsx'
import SourceTag from './SourceTag.jsx'

const styles = {
  row: (isUser) => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    transition: 'opacity 0.3s ease',
  }),
  agentContent: {
    maxWidth: 560,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  agentText: {
    fontSize: '15.5px',
    lineHeight: 1.75,
    fontFamily: theme.fonts.sans,
    fontWeight: 400,
    color: theme.colors.text,
    letterSpacing: '0.01em',
  },
  userPill: {
    fontSize: 15,
    lineHeight: 1.6,
    fontFamily: theme.fonts.sans,
    fontWeight: 400,
    color: theme.colors.userText,
    background: theme.colors.userBubble,
    padding: '11px 18px',
    borderRadius: '20px 20px 4px 20px',
    maxWidth: '70%',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
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

function renderText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export default function MessageBubble({ message, onAction, onSend, animate, scrollContainerRef }) {
  const isUser = message.role === 'user'
  const { ref, opacity } = useViewportFade(scrollContainerRef)

  const animStyle = animate
    ? { opacity: 0, animation: 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }
    : { opacity }

  if (isUser) {
    return (
      <div ref={ref} style={{ ...styles.row(true), ...animStyle }}>
        <div>
          <div style={styles.userPill}>{message.blocks[0]?.content}</div>
          {message.showMeta && <div style={{ ...styles.timestamp, textAlign: 'right' }}>{formatTime(message.timestamp)}</div>}
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} style={{ ...styles.row(false), ...animStyle }}>
      <div style={styles.agentContent}>
        {message.showMeta && <div style={styles.timestamp}>{formatTime(message.timestamp)}</div>}
        {message.blocks.map((block, i) => {
          switch (block.type) {
            case 'text':
              return (
                <div key={i} style={styles.agentText}>
                  {renderText(block.content)}
                  {block.source && <SourceTag source={block.source} />}
                </div>
              )
            case 'metric': return <MetricCard key={i} {...block.data} />
            case 'table': return <DataTable key={i} columns={block.data.columns} rows={block.data.rows} details={block.data.details} />
            case 'actions': return <ActionButtons key={i} actions={block.data} onAction={onAction} />
            default: return null
          }
        })}
        {message.reasoning && <ReasoningTrail steps={message.reasoning} />}
        {message.followUps && onSend && <FollowUps suggestions={message.followUps} onSend={onSend} />}
      </div>
    </div>
  )
}
