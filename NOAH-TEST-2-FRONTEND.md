# Test 2: Hub Agent Conversation Component

Noah —

Nice work on the Webhook Hub. The architecture, provider registry pattern, and the agent API layer all showed strong product thinking. We're moving you to a second evaluation.

This one is different. I need to understand your frontend range, not just backend infrastructure.

## What to Build

A React conversation component that an AI agent uses to talk with a user. This is a business tool, not a chatbot — it should feel like talking to a sharp colleague, not customer support.

## Requirements

- React (.jsx, no TypeScript)
- Inline styles only (no CSS files, no Tailwind, no styled-components)
- Design system: IBM Plex Sans for text, IBM Plex Mono for code/data, accent color #4F6EF7, background #f8f7f4, text #12110f
- Must render these response types inline in the conversation:
  - Regular prose (agent talking naturally)
  - A metric card (e.g., "Revenue: $112K" with a trend arrow showing +12%)
  - A data table (e.g., 5 clients with status and amounts)
  - An action button row (e.g., "Send Invoice", "Schedule Call", "Flag for Review")
- Input bar at the bottom with a send button
- Conversation should feel alive — timestamps, agent name/icon, smooth scroll to latest message
- Mobile responsive (works at 375px and 1440px)
- Deploy live (Cloudflare Pages, Vercel, whatever you prefer) and send me the URL + repo link

## What I'm Evaluating

- Design eye — does this look like a product I'd ship, or does it look like a demo?
- React quality — clean components, good state management, no over-engineering
- Product instinct — the small details I didn't specify that you add because they obviously should be there


## RULES

1. **Use Claude.** Expected and encouraged. The evaluation is how you use AI tooling to ship, not whether you can write code from memory.

2. **24 hours.** Pencils down means pencils down. Push to the repo. Record your Loom. Send the links. Whatever isn't done, isn't done — that's data too.

3. **If something in this spec is ambiguous** — make a decision, document it in DECISIONS.md, and keep moving. Don't wait for clarification. Your judgment is part of the evaluation.

4. **Commit history matters.** Frequent, descriptive commits show your process. One giant commit at hour 23 tells a different story.

## Timeline

24 hours from now. This is less code than the webhook platform but the bar is higher on polish.

— Aaron
