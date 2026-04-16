import { useState } from 'react'
import theme from '../theme.js'
import HubLogo from './HubLogo.jsx'

const styles = {
  overlay: (visible) => ({
    position: 'fixed',
    inset: 0,
    background: 'rgba(18, 17, 15, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 24px',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transition: 'opacity 0.3s ease',
  }),
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
    color: '#f8f7f4',
    fontFamily: theme.fonts.sans,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
    width: '100%',
    maxWidth: 960,
  },
  card: (hovered) => ({
    background: hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
    border: `1px solid ${hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
    borderRadius: theme.radius.lg,
    padding: '20px',
    cursor: 'pointer',
    transition: `all ${theme.transition.base}`,
    transform: hovered ? 'scale(1.02)' : 'scale(1)',
    minHeight: 140,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  }),
  cardTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#f8f7f4',
    fontFamily: theme.fonts.sans,
  },
  cardPreview: {
    fontSize: 12,
    color: 'rgba(248,247,244,0.5)',
    fontFamily: theme.fonts.sans,
    lineHeight: 1.5,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
  cardMeta: {
    marginTop: 'auto',
    fontSize: 11,
    color: 'rgba(248,247,244,0.3)',
    fontFamily: theme.fonts.mono,
  },
  newCard: (hovered) => ({
    background: hovered ? 'rgba(79,110,247,0.12)' : 'rgba(255,255,255,0.03)',
    border: `1px dashed ${hovered ? theme.colors.accent : 'rgba(255,255,255,0.1)'}`,
    borderRadius: theme.radius.lg,
    padding: '20px',
    cursor: 'pointer',
    transition: `all ${theme.transition.base}`,
    minHeight: 140,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  }),
  newLabel: {
    fontSize: 14,
    color: 'rgba(248,247,244,0.4)',
    fontFamily: theme.fonts.sans,
  },
  newIcon: {
    fontSize: 24,
    color: 'rgba(248,247,244,0.3)',
    lineHeight: 1,
  },
  closeHint: {
    marginTop: 24,
    fontSize: 12,
    color: 'rgba(248,247,244,0.25)',
    fontFamily: theme.fonts.sans,
  },
}

function getSessionTitle(session) {
  if (session.messages.length === 0) return 'New conversation'
  const firstAgent = session.messages.find(m => m.role === 'agent')
  if (!firstAgent) return 'New conversation'
  const textBlock = firstAgent.blocks.find(b => b.type === 'text')
  if (!textBlock) return 'Conversation'
  return textBlock.content.replace(/\*\*/g, '').slice(0, 50) + (textBlock.content.length > 50 ? '...' : '')
}

function getPreview(session) {
  const texts = session.messages
    .filter(m => m.role === 'agent')
    .flatMap(m => m.blocks.filter(b => b.type === 'text'))
    .map(b => b.content.replace(/\*\*/g, ''))
  return texts.slice(0, 2).join(' ') || 'Empty conversation'
}

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diffMin = Math.floor((now - d) / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function Card({ session, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={styles.card(hovered)}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardTitle}>{getSessionTitle(session)}</div>
      <div style={styles.cardPreview}>{getPreview(session)}</div>
      <div style={styles.cardMeta}>
        {session.messages.length} messages · {formatTime(session.createdAt)}
      </div>
    </div>
  )
}

function NewCard({ onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={styles.newCard(hovered)}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={styles.newIcon}>+</span>
      <span style={styles.newLabel}>New conversation</span>
    </div>
  )
}

export default function MissionControl({ visible, sessions, activeId, onSelect, onNew, onClose }) {
  return (
    <div style={styles.overlay(visible)} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <HubLogo size={22} />
          <span style={styles.title}>Conversations</span>
        </div>
        <div style={styles.grid}>
          {sessions.map(s => (
            <Card key={s.id} session={s} onClick={() => onSelect(s.id)} />
          ))}
          <NewCard onClick={onNew} />
        </div>
        <div style={styles.closeHint}>Click outside or press Esc to close</div>
      </div>
    </div>
  )
}
