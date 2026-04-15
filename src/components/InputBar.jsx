import { useState, useRef, useEffect } from 'react'
import theme from '../theme.js'

const styles = {
  wrapper: {
    padding: '14px 24px',
    paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
    background: theme.colors.surface,
  },
  form: (focused) => ({
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
    border: `1px solid ${focused ? theme.colors.accent : theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '6px 6px 6px 18px',
    transition: `border-color ${theme.transition.normal}, box-shadow ${theme.transition.normal}`,
    boxShadow: focused ? theme.focusRing : 'none',
    background: theme.colors.bg,
  }),
  textarea: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: theme.fonts.sans,
    fontSize: 15,
    lineHeight: '22px',
    color: theme.colors.text,
    resize: 'none',
    padding: '8px 0',
    maxHeight: 120,
    overflow: 'auto',
  },
  sendBtn: (canSend) => ({
    width: 36,
    height: 36,
    minWidth: 36,
    borderRadius: theme.radius.pill,
    border: 'none',
    background: canSend ? theme.colors.accent : 'transparent',
    cursor: canSend ? 'pointer' : 'default',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `all ${theme.transition.normal}`,
    transform: 'scale(1)',
  }),
  micBtn: (isListening) => ({
    width: 36,
    height: 36,
    minWidth: 36,
    borderRadius: theme.radius.pill,
    border: 'none',
    background: isListening ? theme.colors.accentLight : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `all ${theme.transition.normal}`,
  }),
  hint: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.sans,
    textAlign: 'right',
    padding: '6px 4px 0',
    letterSpacing: '0.02em',
  },
}

function ArrowUpIcon({ canSend }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={canSend ? '#fff' : theme.colors.textTertiary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  )
}

function MicIcon({ listening }) {
  const color = listening ? theme.colors.accent : theme.colors.textTertiary
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="1" width="6" height="12" rx="3" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  )
}

export default function InputBar({ onSend, speechSupported, isListening, onToggleMic }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef(null)
  const canSend = value.trim().length > 0

  // Allow external transcript injection
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [value])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSend) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
    if (e.key === 'Escape') {
      setValue('')
    }
  }

  // Expose setValue for speech recognition transcript
  InputBar.setValue = setValue

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form(focused)}>
        <style>{`
          textarea::placeholder { color: ${theme.colors.textTertiary}; }
        `}</style>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={isListening ? 'Listening...' : 'Message Hub Agent...'}
          style={styles.textarea}
        />
        {speechSupported && (
          <button type="button" style={styles.micBtn(isListening)} onClick={onToggleMic}>
            <MicIcon listening={isListening} />
          </button>
        )}
        <button type="submit" style={styles.sendBtn(canSend)} disabled={!canSend}>
          <ArrowUpIcon canSend={canSend} />
        </button>
      </form>
      <div style={styles.hint}>Shift + Enter for new line</div>
    </div>
  )
}
