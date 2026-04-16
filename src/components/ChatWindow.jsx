import { useEffect, useRef, useState } from 'react'
import theme from '../theme.js'
import MessageBubble from './MessageBubble.jsx'
import WelcomeScreen from './WelcomeScreen.jsx'
import InputBar from './InputBar.jsx'
import HubLogo from './HubLogo.jsx'

const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes typing {
    0%, 60%, 100% { opacity: 0.2; transform: translateY(0); }
    30% { opacity: 0.7; transform: translateY(-3px); }
  }
  @keyframes logoPulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.15); opacity: 1; }
  }
  .chat-scroll::-webkit-scrollbar { width: 5px; }
  .chat-scroll::-webkit-scrollbar-track { background: transparent; }
  .chat-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 4px; }
  .chat-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
`

const styles = {
  page: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: theme.colors.bg,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  messages: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 680,
    width: '100%',
    margin: '0 auto',
    padding: '40px 24px 24px',
    gap: 28,
  },
  agentId: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  agentLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.sans,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  separator: {
    width: '100%',
    height: 1,
    background: theme.colors.border,
  },
  typingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '4px 0',
    opacity: 0,
    animation: 'fadeUp 0.3s ease forwards',
  },
  typingLogo: {},
  typingLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.sans,
  },
  scrollBtn: (vis) => ({
    position: 'fixed',
    bottom: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: vis ? 1 : 0,
    pointerEvents: vis ? 'auto' : 'none',
    transition: `opacity ${theme.transition.base}`,
    zIndex: 10,
  }),
}

export default function ChatWindow({ messages, isTyping, onSend, onAction, mountedAt, speechSupported, isListening, onToggleMic }) {
  const endRef = useRef(null)
  const scrollRef = useRef(null)
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const onScrollHandler = () => {
    const el = scrollRef.current
    if (!el) return
    setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 120)
  }

  const items = []
  messages.forEach((msg, i) => {
    const prev = messages[i - 1]
    const timeDiff = prev ? new Date(msg.timestamp) - new Date(prev.timestamp) : Infinity
    const showMeta = !prev || prev.role !== msg.role || timeDiff > 300000
    if (prev && timeDiff > 300000) items.push({ type: 'separator', key: `sep-${i}` })
    const shouldAnimate = mountedAt && new Date(msg.timestamp) > new Date(mountedAt)

    items.push({ type: 'message', message: { ...msg, showMeta }, animate: shouldAnimate, key: msg.id })
  })

  return (
    <div style={styles.page}>
      <style>{STYLES}</style>
      <div className="chat-scroll" style={styles.content} ref={scrollRef} onScroll={onScrollHandler}>
        {messages.length === 0 ? (
          <WelcomeScreen onSend={onSend} />
        ) : (
          <div style={styles.messages}>
            <div style={styles.agentId}>
              <HubLogo size={18} />
              <span style={styles.agentLabel}>Hub Agent</span>
            </div>
            {items.map((item) => {
              if (item.type === 'separator') return <div key={item.key} style={styles.separator} />
              return <MessageBubble key={item.key} message={item.message} onAction={onAction} onSend={onSend} animate={item.animate} scrollContainerRef={scrollRef} />
            })}
            {isTyping && (
              <div style={styles.typingRow}>
                <HubLogo size={20} animate />
                <span style={styles.typingLabel}>Thinking...</span>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>
      <button style={styles.scrollBtn(showScroll)} onClick={() => endRef.current?.scrollIntoView({ behavior: 'smooth' })}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <InputBar onSend={onSend} speechSupported={speechSupported} isListening={isListening} onToggleMic={onToggleMic} />
    </div>
  )
}
