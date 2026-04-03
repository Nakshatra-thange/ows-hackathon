import express from 'express'
import  WebSocket from 'ws'
import { createServer } from 'http'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'

import { runAgent } from './agent'

const app = express()
app.use(cors({
    origin: 'http://localhost:5173'
  }))
  
app.use(express.json())


const server = createServer(app)
const wss = new WebSocket.Server({ port: 3002 })

export function broadcast(event: object) {
  const msg = JSON.stringify(event)
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg)
  })
}

app.post('/api/run', async (req, res) => {
  const { topic } = req.body
  res.json({ status: 'started' })
  runAgent(topic || 'AI and technology') // non-blocking
})

let paused = false
export const isPaused = () => paused
app.post('/api/pause', (_, res) => { paused = true; res.json({ paused: true }) })
app.post('/api/resume', (_, res) => { paused = false; res.json({ paused: false }) })

server.listen(3001, () => console.log('Pressly server on :3001'))