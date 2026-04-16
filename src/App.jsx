import { useState, useCallback, useRef, useEffect } from 'react'
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

const keywords = /\b(shopify|stripe|github|twilio|sendgrid|webhook|event|endpoint|retry|fail|error|503|log|provider|latency|queue|alert|pause|status|deliver|pipeline|trend|week|day|overview|health)\b/i

// Specific responses for follow-up suggestions and common queries
const queryResponses = {
  'show me overnight event volume': {
    blocks: [
      { type: 'text', content: 'Here\u2019s your overnight pipeline activity:', source: 'live' },
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
      { type: 'text', content: 'Volume is up **18%** compared to the same period last week. Peak traffic hit at **2:00 AM** \u2014 that\u2019s Shopify\u2019s nightly order sync. **488 failures** total, but most self-healed via auto-retry. The **47 still in queue** are all from GitHub.' },
    ],
    followUps: ['What\u2019s wrong with GitHub?', 'Show me the last 7 days trend', 'Break down by provider'],
  },
  'which providers are failing': {
    blocks: [
      { type: 'text', content: 'One provider has active failures right now:', source: 'live' },
      {
        type: 'table',
        data: {
          columns: [
            { key: 'provider', label: 'Provider', type: 'name' },
            { key: 'status', label: 'Health', type: 'status' },
            { key: 'failures', label: 'Failures', align: 'right' },
          ],
          rows: [
            { provider: 'GitHub', status: 'Degraded', failures: '47 active' },
            { provider: 'Shopify', status: 'Healthy', failures: '0' },
            { provider: 'Stripe', status: 'Healthy', failures: '0' },
            { provider: 'Twilio', status: 'Healthy', failures: '0' },
            { provider: 'SendGrid', status: 'Healthy', failures: '0' },
          ],
        },
      },
      { type: 'text', content: '**GitHub** is the only issue. Their push event endpoint has been returning **503s** for about 45 minutes. **47 events** are in the retry queue. The other four providers are clean \u2014 Shopify and Stripe had minor transient failures overnight but all recovered via auto-retry.' },
    ],
    reasoning: [
      'Queried active failure counts across all 5 providers',
      'Filtered for unresolved failures (not auto-recovered)',
      'Identified GitHub as the only provider with active issues',
    ],
    followUps: ['Handle the GitHub failures', 'Show me GitHub error details', 'Set up failure alerts'],
  },
  'retry all failed stripe events': {
    blocks: [
      { type: 'text', content: 'Stripe actually has **zero active failures** right now. There were **4 transient failures** overnight \u2014 all caused by webhook signature mismatches (likely clock skew between servers). All 4 were successfully re-delivered on the second attempt.', source: 'logs' },
      { type: 'text', content: 'No action needed on Stripe. If you\u2019re seeing issues on your end, I can pull the detailed delivery logs for the last 24 hours.' },
    ],
    followUps: ['Show Stripe delivery logs', 'Which provider does have failures?', 'Pipeline overview'],
  },
  'break down by provider': {
    blocks: [
      { type: 'text', content: 'Here\u2019s the 7-day volume split by provider:', source: 'live' },
      {
        type: 'table',
        data: {
          columns: [
            { key: 'provider', label: 'Provider', type: 'name' },
            { key: 'volume', label: '7-Day Vol', align: 'right' },
            { key: 'pct', label: 'Share', align: 'right' },
          ],
          rows: [
            { provider: 'Shopify', volume: '84,200', pct: '50.1%' },
            { provider: 'Stripe', volume: '55,400', pct: '33.0%' },
            { provider: 'GitHub', volume: '18,900', pct: '11.3%' },
            { provider: 'Twilio', volume: '7,100', pct: '4.2%' },
            { provider: 'SendGrid', volume: '2,400', pct: '1.4%' },
          ],
        },
      },
      { type: 'text', content: '**Shopify** and **Stripe** account for **83%** of your total volume. GitHub is third but has the highest failure rate this week at **5.8%** due to today\u2019s incident.' },
    ],
    followUps: ['Show failure rates by provider', 'Shopify trend this week', 'Export breakdown'],
  },
  'show failure rate trend': {
    blocks: [
      { type: 'text', content: 'Failure rate across your pipeline over the last 7 days:', source: 'logs' },
      {
        type: 'metric',
        data: {
          label: '7-Day Failure Rate',
          value: '0.6%',
          trend: -15,
          positive: true,
          period: 'down from 0.7% last week',
          sparkline: [0.8, 0.5, 0.4, 0.3, 0.5, 0.4, 2.0],
          breakdown: [
            { label: 'Mon', value: '0.8%' },
            { label: 'Tue', value: '0.5%' },
            { label: 'Wed', value: '0.4%' },
            { label: 'Thu', value: '0.3%' },
            { label: 'Fri', value: '0.5%' },
            { label: 'Sat', value: '0.4%' },
            { label: 'Sun', value: '2.0%' },
          ],
        },
      },
      { type: 'text', content: 'The spike to **2.0%** today is entirely the GitHub incident. Without that, you\u2019d be at **0.3%** \u2014 your best day this week. The overall trend is healthy and improving.' },
    ],
  },
  'export this data': {
    blocks: [
      { type: 'text', content: 'I can export in three formats:' },
      { type: 'text', content: '\u2022 **CSV** \u2014 raw data, opens in Excel/Sheets\n\u2022 **JSON** \u2014 structured, ready for API consumption\n\u2022 **PDF** \u2014 formatted report with charts' },
      {
        type: 'actions',
        data: [
          { id: 'export-csv', label: 'Export CSV' },
          { id: 'export-json', label: 'Export JSON' },
          { id: 'export-pdf', label: 'Export PDF' },
        ],
      },
    ],
  },
  'handle the github failures': {
    blocks: [
      { type: 'text', content: 'The **47 GitHub failures** are all push event webhooks hitting 503 timeouts. Here\u2019s what I\u2019d recommend:', source: 'logs' },
      { type: 'text', content: '**Option 1:** Retry with **30s extended timeout** \u2014 most should recover now that the gateway load has dropped.\n**Option 2:** Wait for GitHub\u2019s next maintenance window (**~2 hours**) and retry the full batch cleanly.' },
      {
        type: 'actions',
        data: [
          { id: 'retry-now', label: 'Retry now with extended timeout' },
          { id: 'assign-agent', label: 'Assign to AI Agent' },
        ],
      },
    ],
  },
  'yes show me github': {
    blocks: [
      { type: 'text', content: '**GitHub** has been returning **503s** on the push event endpoint for about 45 minutes. Response times jumped from **200ms to 12s** before timing out. **47 events** are in the retry queue.', source: 'logs' },
      { type: 'text', content: 'My read: their API gateway is throttling under load. This matches a pattern I\u2019ve seen before \u2014 the last time it happened, it resolved within **2 hours**. I\u2019d retry with an extended timeout now and catch most of them.' },
      {
        type: 'actions',
        data: [
          { id: 'retry-now', label: 'Retry with extended timeout' },
          { id: 'pause-endpoint', label: 'Pause & buffer' },
          { id: 'view-logs', label: 'Show me the logs' },
        ],
      },
    ],
    reasoning: [
      'Queried delivery logs filtered to GitHub push events',
      'Analyzed 47 failure responses \u2014 all 503 gateway timeouts',
      'Checked GitHub status API \u2014 no reported incidents',
      'Compared to historical pattern \u2014 matches 2-hour throttle cycle',
    ],
  },
  'provider breakdown': {
    blocks: [
      { type: 'text', content: 'Provider breakdown for today:', source: 'live' },
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
        },
      },
    ],
    followUps: ['What\u2019s wrong with GitHub?', 'Compare to yesterday', 'Set up alerts'],
  },
  'what about the other providers?': {
    blocks: [
      { type: 'text', content: 'The other four are running clean. **Shopify** is your highest volume at **12,340 events** with a **99.8%** delivery rate. **Stripe** is close behind at **8,204** and **99.9%** \u2014 essentially flawless. **Twilio** and **SendGrid** are low volume but both at **100%** delivery.', source: 'live' },
      { type: 'text', content: 'No action needed on any of them. The only thing I\u2019d flag is Twilio\u2019s latency at **203ms** \u2014 it\u2019s within normal range but higher than usual. Could be their US-East region. I\u2019ll keep an eye on it.' },
    ],
    followUps: ['Dig into Twilio latency', 'Compare this week to last', 'Set up latency alerts'],
  },
  'show me the last 7 days trend': {
    blocks: [
      { type: 'text', content: 'Here\u2019s your 7-day pipeline trend:', source: 'live' },
      {
        type: 'metric',
        data: {
          label: '7-Day Volume',
          value: '168K',
          trend: 12,
          positive: true,
          period: 'Apr 9 \u2013 Apr 15',
          sparkline: [21200, 22800, 24100, 23400, 25600, 24200, 24847],
          breakdown: [
            { label: 'Mon', value: '21,200' },
            { label: 'Tue', value: '22,800' },
            { label: 'Wed', value: '24,100' },
            { label: 'Thu', value: '23,400' },
            { label: 'Fri', value: '25,600' },
            { label: 'Sat', value: '24,200' },
            { label: 'Sun', value: '24,847' },
          ],
        },
      },
      { type: 'text', content: 'Volume is up **12%** week over week. The Friday spike correlates with Shopify\u2019s end-of-week order processing \u2014 that\u2019s consistent with the last 3 weeks. Overall delivery rate held steady at **99.4%** across the period. The only dip was today\u2019s GitHub issue.' },
    ],
    followUps: ['Break down by provider', 'Show failure rate trend', 'Export this data'],
  },
  'set up an alert for github': {
    blocks: [
      { type: 'text', content: 'I\u2019ll configure a GitHub-specific alert. Here\u2019s what I\u2019d recommend based on today\u2019s incident:' },
      { type: 'text', content: '\u2022 **Error rate threshold:** Alert when delivery failures exceed **5%** over a 15-minute window\n\u2022 **Latency threshold:** Alert when avg response time exceeds **5s** (today it hit 12s before we caught it)\n\u2022 **Queue depth:** Alert when retry queue exceeds **20 events**\n\u2022 **Notification:** Slack #ops-alerts + email' },
      {
        type: 'actions',
        data: [
          { id: 'confirm-alert', label: 'Set up these alerts' },
          { id: 'customize-alert', label: 'Customize thresholds' },
        ],
      },
    ],
  },
  'show provider health': {
    blocks: [
      { type: 'text', content: 'Current provider health across your pipeline:', source: 'live' },
      {
        type: 'table',
        data: {
          columns: [
            { key: 'provider', label: 'Provider', type: 'name' },
            { key: 'status', label: 'Health', type: 'status' },
            { key: 'rate', label: 'Success', align: 'right' },
          ],
          rows: [
            { provider: 'Shopify', status: 'Healthy', rate: '99.8%' },
            { provider: 'Stripe', status: 'Healthy', rate: '99.9%' },
            { provider: 'GitHub', status: 'Degraded', rate: '94.2%' },
            { provider: 'Twilio', status: 'Healthy', rate: '100%' },
            { provider: 'SendGrid', status: 'Healthy', rate: '100%' },
          ],
        },
      },
    ],
    followUps: ['What\u2019s wrong with GitHub?', 'Show event volume', 'Set up health alerts'],
  },
  'any failed events?': {
    blocks: [
      { type: 'text', content: 'Yes \u2014 **488 total failures** in the last 24 hours. The vast majority are from GitHub:', source: 'logs' },
      { type: 'text', content: '\u2022 **GitHub:** 47 active failures (503 timeouts), 394 recovered via auto-retry\n\u2022 **Shopify:** 43 transient failures, all recovered within 2 retries\n\u2022 **Stripe:** 4 failures, all malformed webhook signatures (likely clock skew)\n\u2022 **Twilio/SendGrid:** 0 failures' },
      { type: 'text', content: 'The 47 GitHub events in the retry queue are the ones that need attention. Everything else self-healed.' },
    ],
    reasoning: [
      'Queried failure logs for the last 24 hours across all providers',
      'Grouped by provider and failure type',
      'Cross-referenced with retry outcomes to separate recovered vs active',
      'Identified the 47 GitHub events as the only unresolved batch',
    ],
    followUps: ['Handle the GitHub failures', 'Show me the Stripe signature errors', 'Failure trend this week'],
  },
  'pipeline overview': {
    blocks: [
      { type: 'text', content: 'Here\u2019s your pipeline at a glance:', source: 'live' },
      {
        type: 'metric',
        data: {
          label: 'Events Today',
          value: '24.8K',
          trend: 18,
          positive: true,
          period: 'since midnight',
          sparkline: [180, 210, 195, 240, 220, 260, 310, 290, 340, 248],
          breakdown: [
            { label: 'Delivered', value: '24,312' },
            { label: 'Failed', value: '488' },
            { label: 'Retrying', value: '47' },
            { label: 'Providers', value: '5 active' },
            { label: 'Endpoints', value: '9 total' },
            { label: 'Uptime', value: '99.4%' },
          ],
        },
      },
      { type: 'text', content: 'One issue to flag: **GitHub** is degraded with **47 events** stuck in the retry queue. All other providers are healthy. Want me to walk through the GitHub situation?' },
    ],
    followUps: ['Yes, show me GitHub', 'Provider breakdown', 'Compare to yesterday'],
  },
}

// Secondary action responses for alert setup
const alertActions = {
  'confirm-alert': 'Done. Three alerts configured for GitHub: **error rate >5%**, **latency >5s**, and **queue depth >20**. Notifications will go to Slack #ops-alerts and your email. I\u2019ll also add a 1-minute cooldown so you don\u2019t get spammed during an incident.',
  'customize-alert': 'Sure. What would you like to adjust? You can change the thresholds, the notification channels, or add provider-specific rules. For example, you might want tighter thresholds for Stripe since payment webhooks are critical.',
  'export-csv': 'Generating CSV export of the 7-day pipeline data. File will include: provider, event count, success rate, failure count, avg latency, and timestamps. Download link ready in a moment.',
  'export-json': 'Generating structured JSON export. Includes all provider metrics, event breakdowns, and failure details. Ready for API consumption or import into your monitoring dashboard.',
  'export-pdf': 'Building a formatted PDF report with pipeline summary, provider breakdown chart, failure analysis, and the GitHub incident timeline. This will take a few seconds to render.',
}

// Proactive incident alert — fires after 45 seconds
const proactiveAlert = {
  id: 'proactive-1',
  role: 'agent',
  blocks: [
    {
      type: 'alert',
      content: '**Stripe** webhook endpoint is returning **429 rate limit** errors. **23 events** queued in the last 90 seconds. This looks like a sudden traffic spike from a bulk order import.',
      time: 'just now',
    },
    {
      type: 'text',
      content: 'The rate limit will reset in ~60 seconds, but events will keep failing until then. I can throttle outgoing deliveries to stay under the limit, or pause and batch them.',
    },
    {
      type: 'actions',
      data: [
        { id: 'throttle-stripe', label: 'Throttle deliveries' },
        { id: 'pause-stripe', label: 'Pause and batch' },
        { id: 'assign-agent', label: 'Assign to AI Agent' },
      ],
    },
  ],
}

const incidentResponses = {
  'throttle-stripe': [
    { type: 'text', content: 'Throttling Stripe deliveries to **10 per second** (under their rate limit). Events will queue locally and drain over the next **~2 minutes**. I\u2019ll bump back to full speed once the 429s stop.' },
  ],
  'pause-stripe': [
    { type: 'text', content: '**Stripe endpoint paused.** I\u2019m batching incoming events \u2014 once the rate limit window resets (~60s), I\u2019ll send them in a single optimized batch. Expected delivery: **all 23 events within 30 seconds** of resume.' },
  ],
  'assign-agent': [
    { type: 'text', content: 'Taking this over. Here\u2019s my plan:' },
    { type: 'text', content: '\u2022 **Immediately:** Throttle to 8/sec to stay under the limit\n\u2022 **Next 60s:** Monitor the 429 response rate, adjust throttle dynamically\n\u2022 **On clear:** Drain the queue at full speed, verify all 23 events delivered\n\u2022 **After:** Run a delivery audit and send you a summary' },
    { type: 'text', content: 'I\u2019ll handle this end to end. You\u2019ll get a notification when it\u2019s resolved \u2014 no action needed from you unless I hit something unexpected.' },
  ],
}

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
  const alertFired = useRef(false)

  // Proactive alert — fires once after 45 seconds
  useEffect(() => {
    if (alertFired.current) return
    const timer = setTimeout(() => {
      if (alertFired.current) return
      alertFired.current = true
      setMessages((prev) => [...prev, { ...proactiveAlert, timestamp: new Date().toISOString() }])
    }, 45000)
    return () => clearTimeout(timer)
  }, [])

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg])
  }, [])

  const handleNewChat = useCallback(() => {
    setMessages([])
    setIsTyping(false)
    mountedAt.current = new Date().toISOString()
    alertFired.current = false
  }, [])

  const handleSend = useCallback((text) => {
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      timestamp: new Date().toISOString(),
      blocks: [{ type: 'text', content: text }],
    })

    // Check for a specific query response first
    const queryKey = text.toLowerCase().replace(/[?!.,]/g, '').trim()
    const specific = queryResponses[queryKey]

    if (specific) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'agent',
          timestamp: new Date().toISOString(),
          ...specific,
        })
      }, 1200 + Math.random() * 800)
      return
    }

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
    // Check incident responses (multi-block)
    const incident = incidentResponses[action.id]
    if (incident) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'agent',
          timestamp: new Date().toISOString(),
          blocks: incident,
        })
      }, 800 + Math.random() * 600)
      return
    }

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

    // Check secondary (single text) — includes alert actions
    const text = secondaryActions[action.id] || alertActions[action.id]
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
