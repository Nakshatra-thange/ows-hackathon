import { broadcast } from '../index'
import { logTransaction } from '../ledger'

const SUBSCRIBERS = [
  { id: 'sub_001', email: 'judge1@hackathon.com', wallet: '0xMock1' },
  { id: 'sub_002', email: 'judge2@hackathon.com', wallet: '0xMock2' },
]
export async function chargeSubscribers(): Promise<number> {
  broadcast({ 
    event: 'agent_step', 
    message: `Charging ${SUBSCRIBERS.length} subscribers $0.01 each via x402`, 
    status: 'running' })

  let charged = 0
  for (const sub of SUBSCRIBERS) {
   
    await new Promise(r => setTimeout(r, 800))
    logTransaction('earn', 0.01, `Subscriber ${sub.id} paid for newsletter`)
    charged += 0.01
    broadcast({ event: 'agent_step', message: `✅ Charged ${sub.wallet.slice(0,8)}... $0.01`, status: 'done' })
  }

  return charged
}