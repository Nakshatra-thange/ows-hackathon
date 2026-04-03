import { useState, useEffect, useRef } from 'react'

interface LogEntry { message: string; status?: string; timestamp: string }
interface PnL { earned: string; spent: string; profit: string; lastTx?: any }

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [pnl, setPnl] = useState<PnL>({ earned: '0.0000', spent: '0.0000', profit: '0.0000' })
  const [running, setRunning] = useState(false)
  const [topic, setTopic] = useState('AI agents and technology')
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3002')
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      if (data.event === 'pnl_update') {
        setPnl({ earned: data.earned, spent: data.spent, profit: data.profit, lastTx: data.lastTx })
      }
      if (data.message) {
        setLogs(prev => [...prev, { message: data.message, status: data.status, timestamp: new Date().toLocaleTimeString() }])
        setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 50)
      }
      if (data.event === 'agent_done' || data.event === 'agent_error') setRunning(false)
    }
    return () => ws.close()
  }, [])

  const runAgent = async () => {
    setRunning(true)
    setLogs([])
    await fetch('http://localhost:3001/api/run', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    })
  }

  const profit = parseFloat(pnl.profit)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'monospace', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>📰 Pressly</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Autonomous AI Newsletter Agent</p>

      {/* P&L DASHBOARD — the hero UI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'EARNED', value: `$${pnl.earned}`, color: '#22c55e' },
          { label: 'SPENT', value: `$${pnl.spent}`, color: '#ef4444' },
          { label: 'PROFIT', value: `$${pnl.profit}`, color: profit >= 0 ? '#22c55e' : '#ef4444' },
        ].map(card => (
          <div key={card.label} style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{card.label}</div>
            <div style={{ color: card.color, fontSize: '2rem', fontWeight: 'bold' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input
          value={topic} onChange={e => setTopic(e.target.value)}
          style={{ flex: 1, background: '#111', border: '1px solid #333', borderRadius: '6px', padding: '0.75rem', color: '#fff' }}
          placeholder="Newsletter topic..."
        />
        <button onClick={runAgent} disabled={running}
          style={{ background: running ? '#333' : '#22c55e', color: '#000', border: 'none', borderRadius: '6px', padding: '0.75rem 2rem', cursor: 'pointer', fontWeight: 'bold' }}>
          {running ? '⚙️ Running...' : '▶ Run Agent'}
        </button>
        <button onClick={() => fetch('http://localhost:3001/api/pause', { method: 'POST' })}
          style={{ background: '#f59e0b', color: '#000', border: 'none', borderRadius: '6px', padding: '0.75rem 1rem', cursor: 'pointer' }}>
          ⏸ Pause
        </button>
      </div>

      {/* Live Agent Log */}
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '1rem' }}>AGENT LOG</div>
        <div ref={logRef} style={{ height: '300px', overflowY: 'auto' }}>
          {logs.length === 0 && <div style={{ color: '#444' }}>Agent idle. Press Run to start.</div>}
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#444' }}>{log.timestamp}</span>
              {' '}
              <span>{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}