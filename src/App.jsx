import { useState, useCallback, useRef } from 'react'
import ChatWindow from './components/ChatWindow.jsx'
import InputBar from './components/InputBar.jsx'
import useSpeechRecognition from './hooks/useSpeechRecognition.js'

const now = new Date()
const t = (minAgo) => new Date(now.getTime() - minAgo * 60000).toISOString()

const initialMessages = [
  {
    id: '1',
    role: 'agent',
    timestamp: t(8),
    blocks: [
      {
        type: 'text',
        content: 'Good morning, Noah. I pulled together your weekly numbers \u2014 a few things worth flagging.',
      },
    ],
  },
  {
    id: '2',
    role: 'agent',
    timestamp: t(7),
    blocks: [
      {
        type: 'metric',
        data: {
          label: 'Revenue',
          value: '$112K',
          trend: 12,
          positive: true,
          period: 'vs. last week',
          sparkline: [64, 72, 68, 78, 85, 82, 94, 88, 102, 112],
        },
      },
    ],
  },
  {
    id: '3',
    role: 'agent',
    timestamp: t(7),
    blocks: [
      {
        type: 'text',
        content: 'Here\u2019s the client breakdown for this week:',
      },
      {
        type: 'table',
        data: {
          columns: [
            { key: 'client', label: 'Client', type: 'name' },
            { key: 'status', label: 'Status', type: 'status' },
            { key: 'amount', label: 'Amount', align: 'right' },
          ],
          rows: [
            { client: 'Meridian Design Co', status: 'Pending', amount: '$34,200' },
            { client: 'Ingram & Associates', status: 'Overdue', amount: '$18,750' },
            { client: 'Stonebridge Capital', status: 'Paid', amount: '$27,400' },
            { client: 'Lark Creative', status: 'Paid', amount: '$19,600' },
            { client: 'Apex Logistics', status: 'Pending', amount: '$12,050' },
          ],
        },
      },
    ],
  },
  {
    id: '4',
    role: 'agent',
    timestamp: t(6),
    blocks: [
      {
        type: 'text',
        content: 'Ingram & Associates hasn\u2019t responded to the last invoice. Want me to handle it?',
      },
      {
        type: 'actions',
        data: [
          { id: 'send-invoice', label: 'Send Invoice' },
          { id: 'schedule-call', label: 'Schedule Call' },
          { id: 'flag-review', label: 'Flag for Review' },
        ],
      },
    ],
  },
]

const agentReplies = [
  'Got it. I\u2019ll take care of that right away.',
  'Done. I\u2019ve updated the records and will keep you posted.',
  'Sure thing. I\u2019ll follow up and circle back if anything changes.',
  'Understood. Everything\u2019s queued up \u2014 I\u2019ll ping you when it\u2019s resolved.',
  'On it. Let me know if you need anything else adjusted.',
]

function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const mountedAt = useRef(new Date().toISOString())

  const handleTranscript = useCallback((transcript) => {
    if (InputBar.setValue) InputBar.setValue(transcript)
  }, [])

  const { isListening, toggle: toggleMic, supported: speechSupported } = useSpeechRecognition(handleTranscript)

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg])
  }, [])

  const handleSend = useCallback((text) => {
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      timestamp: new Date().toISOString(),
      blocks: [{ type: 'text', content: text }],
    })

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'agent',
        timestamp: new Date().toISOString(),
        blocks: [{ type: 'text', content: agentReplies[Math.floor(Math.random() * agentReplies.length)] }],
      })
    }, 1200 + Math.random() * 1300)
  }, [addMessage])

  const handleAction = useCallback(() => {}, [])

  return (
    <ChatWindow
      messages={messages}
      isTyping={isTyping}
      onSend={handleSend}
      onAction={handleAction}
      mountedAt={mountedAt.current}
      speechSupported={speechSupported}
      isListening={isListening}
      onToggleMic={toggleMic}
    />
  )
}

export default App
