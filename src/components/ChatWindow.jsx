import { useEffect, useRef, useState } from 'react'
import theme from '../theme.js'
import MessageBubble from './MessageBubble.jsx'
import InputBar from './InputBar.jsx'
import AgentAvatar from './AgentAvatar.jsx'

const KEYFRAMES = `
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(8px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes typing {
    0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
    30% { opacity: 1; transform: translateY(-3px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes micPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(79, 110, 247, 0.3); }
    50% { box-shadow: 0 0 0 8px rgba(79, 110, 247, 0); }
  }
  .chat-messages::-webkit-scrollbar { width: 6px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 3px; }
  .chat-messages::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.14); }
`

const styles = {
  outer: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientOrb: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 180, 120, 0.12) 0%, rgba(255, 140, 180, 0.06) 40%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: 720,
    width: '100%',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.04)',
    position: 'relative',
    zIndex: 2,
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  headerName: {
    fontSize: 15,
    fontWeight: 500,
    color: theme.colors.text,
    fontFamily: theme.fonts.sans,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  headerStatus: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.sans,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: theme.colors.green,
    animation: 'pulse 2.5s ease-in-out infinite',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '28px 24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  typingRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '2px 0',
    animation: 'fadeIn 0.2s ease forwards',
  },
  typingBubble: {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '20px 20px 20px 4px',
    padding: '14px 20px',
    display: 'flex',
    gap: 5,
    alignItems: 'center',
  },
  dateSeparator: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '8px 0',
  },
  dateLine: {
    flex: 1,
    height: 1,
    background: theme.colors.border,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.sans,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    whiteSpace: 'nowrap',
  },
  scrollBtn: (visible) => ({
    position: 'absolute',
    bottom: 90,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadow.md,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transition: `opacity ${theme.transition.normal}`,
    zIndex: 3,
  }),
}

function TypingIndicator() {
  const dotStyle = (delay) => ({
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: theme.colors.textTertiary,
    animation: `typing 1.2s ease-in-out ${delay}s infinite`,
  })

  return (
    <div style={styles.typingRow}>
      <AgentAvatar />
      <div style={styles.typingBubble}>
        <div style={dotStyle(0)} />
        <div style={dotStyle(0.15)} />
        <div style={dotStyle(0.3)} />
      </div>
    </div>
  )
}

function DateSeparator({ label }) {
  return (
    <div style={styles.dateSeparator}>
      <div style={styles.dateLine} />
      <span style={styles.dateLabel}>{label}</span>
      <div style={styles.dateLine} />
    </div>
  )
}

function ScrollDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function getDateLabel(ts) {
  const d = new Date(ts)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const msgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = (today - msgDay) / 86400000
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function ChatWindow({ messages, isTyping, onSend, onAction, mountedAt, speechSupported, isListening, onToggleMic }) {
  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  const handleScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollBtn(distFromBottom > 100)
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Compute showMeta dynamically and insert date separators
  const renderItems = []
  let lastDate = null

  messages.forEach((msg, i) => {
    const msgDate = getDateLabel(msg.timestamp)
    if (msgDate !== lastDate) {
      renderItems.push({ type: 'date', label: msgDate, key: `date-${i}` })
      lastDate = msgDate
    }

    const prev = messages[i - 1]
    const showMeta =
      !prev ||
      prev.role !== msg.role ||
      new Date(msg.timestamp) - new Date(prev.timestamp) > 120000

    const shouldAnimate = mountedAt && new Date(msg.timestamp) > new Date(mountedAt)

    renderItems.push({
      type: 'message',
      message: { ...msg, showMeta },
      animate: shouldAnimate,
      key: msg.id,
    })
  })

  return (
    <div style={styles.outer}>
      <style>{KEYFRAMES}</style>
      <div style={styles.ambientOrb} />

      <div style={styles.container}>
        <div style={styles.header}>
          <AgentAvatar size={36} />
          <div style={styles.headerText}>
            <span style={styles.headerName}>Hub Agent</span>
            <span style={styles.headerStatus}>
              <span style={styles.statusDot} />
              Online
            </span>
          </div>
        </div>

        <div
          className="chat-messages"
          style={styles.messages}
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {renderItems.map((item) => {
            if (item.type === 'date') {
              return <DateSeparator key={item.key} label={item.label} />
            }
            return (
              <MessageBubble
                key={item.key}
                message={item.message}
                onAction={onAction}
                animate={item.animate}
              />
            )
          })}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <button style={styles.scrollBtn(showScrollBtn)} onClick={scrollToBottom}>
          <ScrollDownIcon />
        </button>

        <InputBar
          onSend={onSend}
          speechSupported={speechSupported}
          isListening={isListening}
          onToggleMic={onToggleMic}
        />
      </div>
    </div>
  )
}
