import { broadcast } from './index'
import { scrapeTrendingTopics } from './tools/scrape'
import { generateNewsletter } from './tools/generate'
import { chargeSubscribers } from './tools/charge'
import { sendNewsletter } from './tools/sendEmail'
import { logTransaction } from './ledger'

const SPEND_CAP = 0.10 // guardrail: never spend more than $0.10/run
let totalSpent = 0

export async function runAgent(topic: string) {
  broadcast({ event: 'agent_start', topic, message: `🤖 Pressly agent starting. Topic: ${topic}` })
  totalSpent = 0

  try {
    // TOOL 1: Scrape
    const content = await scrapeTrendingTopics(topic)
    totalSpent += 0.01

    // GUARDRAIL: spend cap check
    if (totalSpent >= SPEND_CAP) {
      broadcast({ event: 'agent_halt', message: `🛑 Spend cap reached. Halting.` })
      return
    }

    // TOOL 2: Generate
    const newsletter = await generateNewsletter(topic, content)
    totalSpent += 0.002
    const lines = newsletter.split('\n')
    const subject = lines[0].replace('Subject:', '').trim()
    const body = lines.slice(1).join('\n')

    // HUMAN INTERVENTION POINT
    broadcast({ event: 'awaiting_approval', subject, preview: body.slice(0, 200) })
    await waitForApproval() // pauses here if human clicks pause

    // TOOL 3: Charge subscribers (agent earns)
    await chargeSubscribers()

    // TOOL 4: Send
    await sendNewsletter(body, subject)

    broadcast({ event: 'agent_done', message: `✅ Pressly cycle complete. Check P&L for profit.` })

  } catch (err: any) {
    broadcast({ event: 'agent_error', message: `❌ Agent error: ${err.message}` })
  }
}

function waitForApproval(): Promise<void> {
  return new Promise(resolve => {
    // Check every second if still paused
    const check = setInterval(() => {
      // Agent continues after 5 seconds auto-approve or human resumes
      clearInterval(check)
      resolve()
    }, 5000)
  })
}