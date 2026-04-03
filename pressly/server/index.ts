import express from 'express'
import  WebSocketServer from 'ws'
import { createServer } from 'http'
import dotenv from 'dotenv'
import { runAgent } from './agent'

dotenv.config()

const app = express()
app.use(express.json())

const server = createServer(app)
const wss = new WebSocketServer({ server })

// Global broadcast — agent uses this to push live updates
export function broadcast(event: object) {
  const msg = JSON.stringify(event)
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg)
  })
}

// Trigger agent run
app.post('/api/run', async (req, res) => {
  const { topic } = req.body
  res.json({ status: 'started' })
  runAgent(topic || 'AI and technology') // non-blocking
})

// Pause flag
let paused = false
export const isPaused = () => paused
app.post('/api/pause', (_, res) => { paused = true; res.json({ paused: true }) })
app.post('/api/resume', (_, res) => { paused = false; res.json({ paused: false }) })

server.listen(3001, () => console.log('Pressly server on :3001'))