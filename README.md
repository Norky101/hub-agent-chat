# Hub Agent Chat

A React conversation component for an AI-powered webhook pipeline assistant. Built as a frontend evaluation — the focus is on design eye, React quality, and product instinct.

**Live:** [hub-agent-chat.pages.dev](https://hub-agent-chat.pages.dev)

## Setup

```bash
git clone https://github.com/Norky101/hub-agent-chat.git
cd hub-agent-chat
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build to `dist/` |
| `npm test` | Run test suite (36 tests) |
| `npm run preview` | Preview production build locally |

## Deploy to Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist --project-name hub-agent-chat
```

Requires a Cloudflare account with Pages write access. Outputs a `.pages.dev` URL.

## Architecture

```
src/
├── App.jsx                  # State management, conversation data, action handlers
├── theme.js                 # Design tokens (colors, fonts, spacing, radii, transitions)
├── hooks/
│   ├── useSpeechRecognition.js  # Web Speech API hook for voice input
│   └── useViewportFade.js       # Scroll-aware opacity for message focus
├── components/
│   ├── ChatWindow.jsx       # Main container — scroll area, typing indicator, new chat
│   ├── MessageBubble.jsx    # Message renderer — routes blocks to the right component
│   ├── MetricCard.jsx       # Expandable metric with sparkline and breakdown
│   ├── DataTable.jsx        # Expandable provider table with status badges
│   ├── ActionButtons.jsx    # Click-once buttons that trigger agent responses
│   ├── InputBar.jsx         # Auto-growing textarea, mic button, send
│   ├── WelcomeScreen.jsx    # Empty state with logo and prompt pills
│   ├── HubLogo.jsx          # Custom SVG mark — hub node with provider connections
│   ├── SourceTag.jsx        # Inline trust indicators (LIVE, FROM LOGS, etc.)
│   ├── ReasoningTrail.jsx   # Collapsible "How I got here" investigation steps
│   └── FollowUps.jsx        # Contextual next-question suggestions
└── __tests__/               # 36 tests across 6 files
```

## Response Types

The conversation renders four inline response types:

1. **Prose** — agent text with bold keyword support
2. **Metric card** — value, trend badge, sparkline SVG, expandable breakdown
3. **Data table** — expandable rows with provider details, status dot badges
4. **Action buttons** — click-once pills that trigger contextual agent responses

## Key Features

- **Expandable data** — click table rows or metric cards to drill into details
- **Inline trust signals** — LIVE / FROM LOGS tags showing data provenance
- **Reasoning trail** — collapsible "How I got here" showing agent investigation steps
- **Contextual follow-ups** — suggested next questions after agent responses
- **Viewport focus fade** — messages fade as they scroll out, sharpen when you scroll back
- **Voice input** — Web Speech API with graceful fallback
- **Agent reasoning** — diagnoses root causes, recommends remediation, chains actions
- **Gibberish handling** — admits when it doesn't understand, suggests relevant queries

## Design System

| Token | Value |
|-------|-------|
| Background | `#f8f7f4` |
| Text | `#12110f` |
| Accent | `#4F6EF7` |
| Font (text) | IBM Plex Sans |
| Font (data) | IBM Plex Mono |
| Inline styles only | No CSS files, no Tailwind |

## Decisions

See [DECISIONS.md](./decisions.md) for every architectural and design decision, what was considered, what was chosen, and why.
