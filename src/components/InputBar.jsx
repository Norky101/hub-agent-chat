import { useState, useRef, useEffect } from 'react'
import theme from '../theme.js'

const styles = {
  outer: {
    padding: '0 24px 28px',
    width: '100%',
    maxWidth: 680,
    margin: '0 auto',
  },
  container: (focused) => ({
    ...theme.glass,
    borderRadius: theme.radius.xl,
    padding: '16px 18px 12px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    transition: `all ${theme.transition.base}`,
    boxShadow: focused
      ? '0 0 0 3px rgba(79, 110, 247, 0.06), 0 8px 32px rgba(0, 0, 0, 0.04)'
      : '0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
    border: focused
      ? '1px solid rgba(79, 110, 247, 0.2)'
      : theme.glass.border,
  }),
  textarea: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: theme.fonts.sans,
    fontSize: 16,
    lineHeight: '26px',
    color: theme.colors.text,
    resize: 'none',
    padding: 0,
    maxHeight: 140,
    overflow: 'auto',
    width: '100%',
    letterSpacing: '0.005em',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  iconBtn: (active) => ({
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    border: 'none',
    background: active ? theme.colors.accentSoft : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `all ${theme.transition.fast}`,
  }),
  sendBtn: (canSend) => ({
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    border: 'none',
    background: canSend
      ? 'linear-gradient(135deg, #4F6EF7, #6B5CF7)'
      : 'transparent',
    cursor: canSend ? 'pointer' : 'default',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `all ${theme.transition.base}`,
    boxShadow: canSend ? '0 2px 8px rgba(79, 110, 247, 0.25)' : 'none',
  }),
}

function MicIcon({ color }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="1" width="6" height="12" rx="3" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  )
}

function SendIcon({ canSend }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={canSend ? '#fff' : theme.colors.textFaint} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  )
}

export default function InputBar({ onSend, speechSupported, isListening, onToggleMic }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef(null)
  const canSend = value.trim().length > 0

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px'
    }
  }, [value])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSend) return
    onSend(value.trim())
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  InputBar.setValue = setValue

  return (
    <div style={styles.outer}>
      <style>{`
        textarea::placeholder { color: ${theme.colors.textFaint}; }
      `}</style>
      <form onSubmit={handleSubmit} style={styles.container(focused)}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isListening ? 'Listening...' : 'Ask about your webhooks...'}
          style={styles.textarea}
        />
        <div style={styles.toolbar}>
          <div style={styles.toolLeft}>
            {speechSupported && (
              <button type="button" style={styles.iconBtn(isListening)} onClick={onToggleMic}>
                <MicIcon color={isListening ? theme.colors.accent : theme.colors.textFaint} />
              </button>
            )}
          </div>
          <button type="submit" style={styles.sendBtn(canSend)} disabled={!canSend}>
            <SendIcon canSend={canSend} />
          </button>
        </div>
      </form>
    </div>
  )
}
