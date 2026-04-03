# Pressly

An AI agent that runs a newsletter business on its own.

It finds trending topics, writes a newsletter, charges readers, and sends the email.
No human does any of this. The agent does.

---

## What it does

You give it a topic. It does the rest:

1. Scrapes trending content about that topic
2. Writes a newsletter using an LLM
3. Charges each subscriber $0.01 via x402 micropayment
4. Sends the newsletter to their inbox
5. Shows you a live P&L — what it earned, what it spent, profit

The agent has its own wallet (OWS). It earns money when subscribers pay.
It spends money on scraping and email delivery. You watch this happen in real time.

---

## Why this is different

Most AI demos show an agent that thinks. Pressly shows an agent that transacts.

Every action costs or earns real money:
- $0.01 per scrape (paid via x402 to Firecrawl)
- ~$0.002 per newsletter (LLM inference)
- $0.01 per subscriber (earned via x402)
- $0.005 per email delivery

The agent manages its own budget. It won't spend more than $0.10 per run.
If something fails, it stops and tells you why.

---

## Tech stack

- **OWS** — the agent's wallet. Holds funds, signs transactions, enforces spend limits
- **x402** — payment protocol. Agent pays for APIs per call, no subscriptions
- **Node.js** — runs the agent loop
- **React** — live dashboard showing agent steps and P&L
- **WebSocket** — pushes every agent action to the UI in real time
- **Gemini Flash** — writes the newsletter
- **Resend** — delivers the email

---

## How the agent works

The agent follows a simple loop:
scrape → generate → charge subscribers → send email → report P&L

Each step is a tool. The agent calls tools in order, checks its budget after
each spend, and stops if something goes wrong.

This follows the single-agent pattern from OpenAI's agent building guide —
one model, well-defined tools, clear instructions, simple loop.

---

## Running it

### Requirements
- Node.js 18+
- OWS CLI installed (`npm install -g @open-wallet-standard/core`)
- A funded OWS wallet on Base chain

### Setup

# Clone and install
git clone https://github.com/Nakshatra-thange/ows-hackathon
cd pressly/server && npm install
cd ../client2 && npm install


Create `server/.env`:
GEMINI_API_KEY=your-key (can replace with any other api key too)
RESEND_API_KEY=your-key
RESEND_FROM_EMAIL=onboarding@resend.dev
DEMO_EMAIL=your@email.com

### Run

# Terminal 1
cd server && npx tsx index.ts

# Terminal 2
cd client2 && npm run dev

Open http://localhost:8080, type a topic, hit Run.

---

## Project structure
pressly/
├── server/
│   ├── agent.ts          # the agent loop
│   ├── ledger.ts         # tracks every earn and spend
│   ├── index.ts          # express server + websocket
│   └── tools/
│       ├── scrape.ts     # fetches trending content
│       ├── generate.ts   # writes the newsletter
│       ├── charge.ts     # collects payment from subscribers
│       └── sendEmail.ts  # delivers to inbox
└── client/
└── src/
├── App.tsx           # main layout
├── AgentLog.tsx      # live step feed
└── PnLDashboard.tsx  # earned / spent / profit

---

## The demo

1. Open the dashboard
2. Type a topic (e.g. "AI agents")
3. Hit Run
4. Watch the agent work step by step in real time
5. See the P&L update as it earns and spends
6. Check your inbox — the email actually arrives

The whole thing takes about 15 seconds.

---

## What's next

- Real subscriber wallets paying via x402
- Multiple topics running in parallel
- Agent decides topic based on what performed well last week
- Spend analytics across newsletter runs
- Let the agent reinvest profits into better scraping tools
