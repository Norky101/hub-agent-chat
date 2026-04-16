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
    timestamp: t(12),
    blocks: [
      {
        type: 'text',
        content: 'Morning. Your webhook pipeline processed 24,847 events overnight. Most providers are healthy, but there\u2019s one issue worth looking at.',
      },
    ],
  },
  {
    id: '2',
    role: 'agent',
    timestamp: t(11),
    blocks: [
      {
        type: 'metric',
        data: {
          label: 'Events Processed',
          value: '24.8K',
          trend: 18,
          positive: true,
          period: 'last 24 hours',
          sparkline: [180, 210, 195, 240, 220, 260, 310, 290, 340, 248],
        },
      },
    ],
  },
  {
    id: '3',
    role: 'agent',
    timestamp: t(11),
    blocks: [
      {
        type: 'text',
        content: 'Delivery breakdown by provider:',
      },
      {
        type: 'table',
        data: {
          columns: [
            { key: 'provider', label: 'Provider', type: 'name' },
            { key: 'status', label: 'Health', type: 'status' },
            { key: 'events', label: 'Events', align: 'right' },
          ],
          rows: [
            { provider: 'Shopify', status: 'Healthy', events: '12,340' },
            { provider: 'Stripe', status: 'Healthy', events: '8,204' },
            { provider: 'GitHub', status: 'Degraded', events: '2,891' },
            { provider: 'Twilio', status: 'Healthy', events: '1,105' },
            { provider: 'SendGrid', status: 'Healthy', events: '307' },
          ],
          details: {
            Shopify: [
              { label: 'Endpoints', value: '3 active' },
              { label: 'Success Rate', value: '99.8%' },
              { label: 'Avg Latency', value: '142ms' },
              { label: 'Last Event', value: '12s ago' },
            ],
            Stripe: [
              { label: 'Endpoints', value: '2 active' },
              { label: 'Success Rate', value: '99.9%' },
              { label: 'Avg Latency', value: '89ms' },
              { label: 'Last Event', value: '34s ago' },
            ],
            GitHub: [
              { label: 'Endpoints', value: '2 active' },
              { label: 'Success Rate', value: '94.2%', warn: true },
              { label: 'Failed Events', value: '47 in queue', warn: true },
              { label: 'Error Type', value: '503 Timeout', warn: true },
            ],
            Twilio: [
              { label: 'Endpoints', value: '1 active' },
              { label: 'Success Rate', value: '100%' },
              { label: 'Avg Latency', value: '203ms' },
              { label: 'Last Event', value: '2m ago' },
            ],
            SendGrid: [
              { label: 'Endpoints', value: '1 active' },
              { label: 'Success Rate', value: '100%' },
              { label: 'Avg Latency', value: '167ms' },
              { label: 'Last Event', value: '8m ago' },
            ],
          },
        },
      },
    ],
  },
  {
    id: '4',
    role: 'agent',
    timestamp: t(10),
    blocks: [
      {
        type: 'text',
        content: 'GitHub\u2019s webhook endpoint is returning 503s intermittently \u2014 47 events failed delivery in the last hour. The retry queue is holding them but they\u2019ll expire in 6 hours.',
      },
      {
        type: 'actions',
        data: [
          { id: 'retry-now', label: 'Retry Failed Events' },
          { id: 'pause-endpoint', label: 'Pause Endpoint' },
          { id: 'view-logs', label: 'View Logs' },
        ],
      },
    ],
  },
]

const agentReplies = [
  'Done. I\u2019ve queued those events for immediate retry \u2014 I\u2019ll flag any that fail again.',
  'Endpoint paused. Incoming GitHub events will buffer until you re-enable it.',
  'Pulling the delivery logs now. 43 of the 47 failures are timeout errors, 4 are malformed responses.',
  'Got it. I\u2019ll monitor the endpoint and alert you if the error rate exceeds 5% again.',
  'Updated. I\u2019ve extended the retry window to 12 hours for the affected batch.',
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
    }, 1000 + Math.random() * 1200)
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
