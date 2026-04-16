import { useEffect, useRef, useState } from 'react'
import theme from '../theme.js'
import MessageBubble from './MessageBubble.jsx'
import WelcomeScreen from './WelcomeScreen.jsx'
import InputBar from './InputBar.jsx'

const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes orbFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes typing {
    0%, 60%, 100% { opacity: 0.2; transform: translateY(0); }
    30% { opacity: 0.7; transform: translateY(-3px); }
  }
  @keyframes drift1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(40px, -30px) scale(1.05); }
    50% { transform: translate(-15px, -50px) scale(0.95); }
    75% { transform: translate(-35px, -15px) scale(1.02); }
  }
  @keyframes drift2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-50px, 25px) scale(1.08); }
    66% { transform: translate(30px, -35px) scale(0.96); }
  }
  @keyframes drift3 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, 30px); }
  }
  @keyframes drift4 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    40% { transform: translate(-25px, -40px) scale(1.1); }
    80% { transform: translate(15px, 20px) scale(0.97); }
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
    position: 'relative',
    overflow: 'hidden',
  },
  floatingBg: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  shape: (top, left, size, color, opacity, anim, dur) => ({
    position: 'absolute',
    top, left,
    width: size,
    height: size,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    opacity,
    filter: 'blur(80px)',
    animation: `${anim} ${dur}s ease-in-out infinite`,
    willChange: 'transform',
  }),
  content: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
  },
  messages: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 680,
    width: '100%',
    margin: '0 auto',
    padding: '48px 24px 24px',
    gap: 28,
  },
  typingRow: {
    display: 'flex',
    gap: 5,
    alignItems: 'center',
    padding: '4px 0',
    opacity: 0,
    animation: 'fadeUp 0.3s ease forwards',
  },
  dot: (delay) => ({
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: theme.colors.textMuted,
    animation: `typing 1.4s ease-in-out ${delay}s infinite`,
  }),
  scrollBtn: (vis) => ({
    position: 'fixed',
    bottom: 110,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 36,
    height: 36,
    borderRadius: '50%',
    ...theme.glass,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: vis ? 1 : 0,
    pointerEvents: vis ? 'auto' : 'none',
    transition: `opacity ${theme.transition.base}`,
    zIndex: 10,
  }),
  inputWrap: { position: 'relative', zIndex: 1 },
}

function Bg() {
  return (
    <div style={styles.floatingBg}>
      <div style={styles.shape('5%', '70%', 320, 'rgba(79, 110, 247, 0.12)', 0.7, 'drift1', 30)} />
      <div style={styles.shape('55%', '2%', 280, 'rgba(140, 100, 240, 0.08)', 0.6, 'drift2', 38)} />
      <div style={styles.shape('25%', '80%', 200, 'rgba(80, 170, 255, 0.06)', 0.5, 'drift3', 24)} />
      <div style={styles.shape('70%', '55%', 260, 'rgba(79, 110, 247, 0.05)', 0.5, 'drift4', 44)} />
    </div>
  )
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

  const processed = messages.map((msg, i) => {
    const prev = messages[i - 1]
    const showMeta = !prev || prev.role !== msg.role || (new Date(msg.timestamp) - new Date(prev.timestamp)) > 120000
    const shouldAnimate = mountedAt && new Date(msg.timestamp) > new Date(mountedAt)
    return { ...msg, showMeta, _animate: shouldAnimate }
  })

  return (
    <div style={styles.page}>
      <style>{STYLES}</style>
      <Bg />

      <div className="chat-scroll" style={styles.content} ref={scrollRef} onScroll={onScrollHandler}>
        {messages.length === 0 ? (
          <WelcomeScreen onSend={onSend} />
        ) : (
          <div style={styles.messages}>
            {processed.map((msg) => (
              <MessageBubble key={msg.id} message={msg} onAction={onAction} animate={msg._animate} />
            ))}
            {isTyping && (
              <div style={styles.typingRow}>
                <div style={styles.dot(0)} />
                <div style={styles.dot(0.15)} />
                <div style={styles.dot(0.3)} />
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

      <div style={styles.inputWrap}>
        <InputBar onSend={onSend} speechSupported={speechSupported} isListening={isListening} onToggleMic={onToggleMic} />
      </div>
    </div>
  )
}
