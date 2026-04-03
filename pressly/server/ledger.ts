import { broadcast } from './index'

interface Transaction {
  type: 'earn' | 'spend'
  amount: number
  description: string
  timestamp: string
}

const transactions: Transaction[] = []

export function logTransaction(type: 'earn' | 'spend', amount: number, description: string) {
  const tx: Transaction = {
    type,
    amount,
    description,
    timestamp: new Date().toISOString()
  }

  transactions.push(tx)

  const earned = transactions
    .filter(t => t.type === 'earn')
    .reduce((sum, t) => sum + t.amount, 0)

  const spent = transactions
    .filter(t => t.type === 'spend')
    .reduce((sum, t) => sum + t.amount, 0)

  broadcast({
    event: 'pnl_update',
    earned: earned.toFixed(4),
    spent: spent.toFixed(4),
    profit: (earned - spent).toFixed(4),
    lastTx: tx
  })
}