import { useState } from 'react'
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
  agentOuter: {
    position: 'relative',
    maxWidth: '100%',
  },
  agentContent: {
    maxWidth: '100%',
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
  copyBtn: (visible) => ({
    position: 'absolute',
    top: 0,
    right: -36,
    width: 28,
    height: 28,
    borderRadius: theme.radius.sm,
    border: 'none',
    background: visible ? theme.colors.surfaceHover : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: visible ? 1 : 0,
    transition: `opacity ${theme.transition.fast}`,
  }),
  copied: {
    fontSize: 10,
    color: theme.colors.green,
    fontFamily: theme.fonts.sans,
    fontWeight: 500,
    position: 'absolute',
    top: 0,
    right: -56,
    whiteSpace: 'nowrap',
  },
}

function formatRelativeTime(ts) {
  const now = new Date()
  const then = new Date(ts)
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)

  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  return then.toLocaleDateString([], { month: 'short', day: 'numeric' })
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

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textMuted} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function getPlainText(blocks) {
  return blocks
    .filter((b) => b.type === 'text')
    .map((b) => b.content.replace(/\*\*/g, ''))
    .join('\n\n')
}

export default function MessageBubble({ message, onAction, onSend, animate, scrollContainerRef }) {
  const isUser = message.role === 'user'
  const { ref, opacity } = useViewportFade(scrollContainerRef)
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = getPlainText(message.blocks)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const animStyle = animate
    ? { opacity: 0, animation: 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }
    : { opacity }

  if (isUser) {
    return (
      <div ref={ref} style={{ ...styles.row(true), ...animStyle }}>
        <div>
          <div style={styles.userPill}>{message.blocks[0]?.content}</div>
          {message.showMeta && <div style={{ ...styles.timestamp, textAlign: 'right' }}>{formatRelativeTime(message.timestamp)}</div>}
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} style={{ ...styles.row(false), ...animStyle }}>
      <div
        style={styles.agentOuter}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={styles.agentContent}>
          {message.showMeta && <div style={styles.timestamp}>{formatRelativeTime(message.timestamp)}</div>}
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

        <button style={styles.copyBtn(hovered && !copied)} onClick={handleCopy} title="Copy response">
          <CopyIcon />
        </button>
        {copied && <span style={styles.copied}>Copied</span>}
      </div>
    </div>
  )
}
