import { useEffect, useRef, useState } from 'react'
import theme from '../theme.js'
import MessageBubble from './MessageBubble.jsx'
import WelcomeScreen from './WelcomeScreen.jsx'
import InputBar from './InputBar.jsx'

const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes orbFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes typing {
    0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
    30% { opacity: 1; transform: translateY(-3px); }
  }
  .chat-scroll::-webkit-scrollbar { width: 5px; }
  .chat-scroll::-webkit-scrollbar-track { background: transparent; }
  .chat-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 4px; }
  .chat-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.12); }
`

const styles = {
  page: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: theme.colors.bg,
    position: 'relative',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  messagesWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 680,
    width: '100%',
    margin: '0 auto',
    padding: '32px 24px 16px',
    gap: 20,
  },
  typingRow: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    padding: '4px 0',
    animation: 'fadeUp 0.3s ease forwards',
    opacity: 0,
  },
  typingDot: (delay) => ({
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: theme.colors.textFaint,
    animation: `typing 1.2s ease-in-out ${delay}s infinite`,
  }),
  scrollBtn: (visible) => ({
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
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transition: `opacity ${theme.transition.base}`,
    zIndex: 10,
  }),
}

function TypingIndicator() {
  return (
    <div style={styles.typingRow}>
      <div style={styles.typingDot(0)} />
      <div style={styles.typingDot(0.15)} />
      <div style={styles.typingDot(0.3)} />
    </div>
  )
}

export default function ChatWindow({ messages, isTyping, onSend, onAction, mountedAt, speechSupported, isListening, onToggleMic }) {
  const endRef = useRef(null)
  const scrollRef = useRef(null)
  const [showScroll, setShowScroll] = useState(false)
  const hasMessages = messages.length > 0

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 120)
  }

  // Compute showMeta dynamically
  const processed = messages.map((msg, i) => {
    const prev = messages[i - 1]
    const showMeta = !prev || prev.role !== msg.role || (new Date(msg.timestamp) - new Date(prev.timestamp)) > 120000
    const shouldAnimate = mountedAt && new Date(msg.timestamp) > new Date(mountedAt)
    return { ...msg, showMeta, _animate: shouldAnimate }
  })

  return (
    <div style={styles.page}>
      <style>{STYLES}</style>

      <div className="chat-scroll" style={styles.scrollArea} ref={scrollRef} onScroll={onScroll}>
        {!hasMessages ? (
          <WelcomeScreen onSend={onSend} />
        ) : (
          <div style={styles.messagesWrap}>
            {processed.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onAction={onAction}
                animate={msg._animate}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <button
        style={styles.scrollBtn(showScroll)}
        onClick={() => endRef.current?.scrollIntoView({ behavior: 'smooth' })}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <InputBar
        onSend={onSend}
        speechSupported={speechSupported}
        isListening={isListening}
        onToggleMic={onToggleMic}
      />
    </div>
  )
}
