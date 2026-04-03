import { broadcast } from '../index'
import { logTransaction } from '../ledger'

export async function sendNewsletter(content: string, subject: string): Promise<void> {
  broadcast({ 
    event: 'agent_step', 
    message: `Sending newsletter...`, 
    status: 'running' })
  await new Promise(r => setTimeout(r, 1000))

  logTransaction('spend', 0.005, 'Simulated email delivery')

  broadcast({
    event: 'agent_step',
    message: `Newsletter sent! (simulated)`,
    status: 'done'
  })
}