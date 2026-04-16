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
        content: 'Morning. Your pipeline processed **24,847 events** overnight. Four providers are clean, but **GitHub** needs attention.',
        source: 'live',
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
          breakdown: [
            { label: 'Delivered', value: '24,312' },
            { label: 'Failed', value: '488' },
            { label: 'Retried', value: '47' },
            { label: 'Peak Hour', value: '2:00 AM' },
            { label: 'Avg Latency', value: '134ms' },
            { label: 'P99 Latency', value: '890ms' },
          ],
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
        content: 'Provider breakdown \u2014 click any row for details:',
        source: 'live',
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
        content: '**GitHub\u2019s** push event endpoint has been returning **503s** for about **45 minutes**. **Response times** jumped from **200ms to 12s** before timing out. **47 events** are sitting in the **retry queue** and will **expire in 6 hours**.',
        source: 'logs',
      },
      {
        type: 'text',
        content: 'My recommendation: retry the batch with an extended **30s timeout**. Based on the pattern, about **80% should recover** once we get past the gateway bottleneck. For the rest, I can hold them and retry again in **an hour** when GitHub\u2019s load typically drops.',
      },
      {
        type: 'actions',
        data: [
          { id: 'retry-now', label: 'Retry with extended timeout' },
          { id: 'pause-endpoint', label: 'Pause \u0026 buffer' },
          { id: 'view-logs', label: 'Show me the logs' },
        ],
      },
    ],
    reasoning: [
      'Queried delivery logs for the last 24 hours',
      'Detected 47 failures clustered on GitHub push webhook endpoint',
      'Cross-referenced with GitHub status API \u2014 no reported incidents',
      'Analyzed response patterns: gateway timeout at 10s, not endpoint failure',
      'Checked historical data \u2014 similar pattern resolved within 2 hours last time',
    ],
    followUps: [
      'What about the other providers?',
      'Show me the last 7 days trend',
      'Set up an alert for GitHub',
    ],
  },
]

const actionResponses = {
  'retry-now': [
    {
      type: 'text',
      content: 'Retrying all **47 events** with a **30s timeout**. I\u2019ll batch them in groups of **10** to avoid hammering the endpoint.',
    },
    {
      type: 'text',
      content: 'First batch is through \u2014 **8 of 10 delivered** successfully. The 2 that failed are both large payload push events (**>500KB**). I\u2019ll split those into chunked deliveries and retry separately.',
    },
  ],
  'pause-endpoint': [
    {
      type: 'text',
      content: '**GitHub endpoint paused.** All incoming push, PR, and issue events will buffer \u2014 current queue can hold about **72 hours** at this volume.',
    },
    {
      type: 'text',
      content: 'I\u2019m watching GitHub\u2019s status page. Their last incident took **~2 hours** to resolve. I\u2019ll **auto-resume delivery** and drain the buffer once their API returns to **<500ms** response times. You\u2019ll get a notification either way.',
    },
  ],
  'view-logs': [
    {
      type: 'text',
      content: 'Here\u2019s the pattern I\u2019m seeing across the **47 failures**:',
    },
    {
      type: 'text',
      content: '\u2022 **43** are **503 gateway timeouts** \u2014 all push events, avg payload 128KB, response cut off at 10s\n\u2022 **4** returned 200 but with **malformed JSON** bodies (likely partial responses from the gateway)\n\u2022 All failures started at **2:14 AM**, correlating with a spike in GitHub\u2019s own event volume\n\u2022 The endpoint itself is fine \u2014 this is **upstream GitHub infrastructure**',
    },
    {
      type: 'text',
      content: 'I\u2019d recommend retrying the **43 timeouts** with an extended window. The **4 malformed responses** need a full re-delivery since the original payloads were corrupted. Want me to handle both?',
    },
    {
      type: 'actions',
      data: [
        { id: 'retry-all', label: 'Retry all 47' },
        { id: 'retry-timeouts', label: 'Just the 43 timeouts' },
      ],
    },
  ],
}

// Second-level action responses
const secondaryActions = {
  'retry-all': 'On it. Retrying all 47 \u2014 43 with extended timeout, 4 with full payload re-delivery. I\u2019ll report back in a few minutes with results.',
  'retry-timeouts': 'Retrying the 43 timeout events now. I\u2019ll hold the 4 malformed ones for your review \u2014 they may need manual payload inspection before re-delivery.',
}

const keywords = /\b(shopify|stripe|github|twilio|sendgrid|webhook|event|endpoint|retry|fail|error|503|log|provider|latency|queue|alert|pause|status|deliver|pipeline)\b/i

const relevantReplies = [
  'Checking on that now. Give me a moment to pull the latest data.',
  'Got it. I\u2019ll look into that and report back with what I find.',
  'Running that query now. I\u2019ll have results in a few seconds.',
  'I\u2019ll investigate and follow up with a recommendation.',
  'Let me pull the relevant logs and get back to you.',
]

const fallbackReply = 'I\u2019m not sure what you\u2019re asking. I can help with webhook pipeline monitoring, provider health, delivery logs, retries, and event troubleshooting. Try asking about a specific provider or issue.'

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

  const handleNewChat = useCallback(() => {
    setMessages([])
    setIsTyping(false)
    mountedAt.current = new Date().toISOString()
  }, [])

  const handleSend = useCallback((text) => {
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      timestamp: new Date().toISOString(),
      blocks: [{ type: 'text', content: text }],
    })

    const isRelevant = keywords.test(text)
    const reply = isRelevant
      ? relevantReplies[Math.floor(Math.random() * relevantReplies.length)]
      : fallbackReply

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const msg = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        timestamp: new Date().toISOString(),
        blocks: [{ type: 'text', content: reply }],
      }
      if (!isRelevant) {
        msg.followUps = ['Show provider health', 'Any failed events?', 'Pipeline overview']
      }
      addMessage(msg)
    }, isRelevant ? 1000 + Math.random() * 1200 : 500)
  }, [addMessage])

  const handleAction = useCallback((action) => {
    // Check primary action responses (multi-block)
    const blocks = actionResponses[action.id]
    if (blocks) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'agent',
          timestamp: new Date().toISOString(),
          blocks,
        })
      }, 900 + Math.random() * 800)
      return
    }

    // Check secondary (single text)
    const text = secondaryActions[action.id]
    if (text) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'agent',
          timestamp: new Date().toISOString(),
          blocks: [{ type: 'text', content: text }],
        })
      }, 800 + Math.random() * 600)
    }
  }, [addMessage])

  return (
    <ChatWindow
      messages={messages}
      isTyping={isTyping}
      onSend={handleSend}
      onAction={handleAction}
      onNewChat={handleNewChat}
      mountedAt={mountedAt.current}
      speechSupported={speechSupported}
      isListening={isListening}
      onToggleMic={toggleMic}
    />
  )
}

export default App
