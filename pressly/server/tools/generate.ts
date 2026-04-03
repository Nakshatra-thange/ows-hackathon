import { GoogleGenerativeAI } from '@google/generative-ai'
import { broadcast } from '../index'
import { logTransaction } from '../ledger'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateNewsletter(topic: string, scrapedContent: string): Promise<string> {
  console.log('[Generate] Starting...')
  broadcast({ event: 'agent_step', message: `✍️ Writing newsletter about: ${topic}`, status: 'running' })

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const prompt = `You are Pressly, an autonomous newsletter agent.
Write a short newsletter (200 words max) about "${topic}" using these trends:

${scrapedContent}

Rules:
- First line must be: Subject: [your subject line]
- Then write the newsletter body
- Keep it sharp and interesting
- No fluff`

    const result = await model.generateContent(prompt)
    const content = result.response.text()

    console.log('[Generate] Gemini responded:', content.slice(0, 60))
    logTransaction('spend', 0.002, 'Gemini Flash newsletter generation')
    broadcast({ event: 'agent_step', message: `✅ Newsletter written. Paid ~$0.002.`, status: 'done' })
    return content

  } catch(err: any) {
    console.error('[Generate] Gemini error:', err.message)
    throw err
  }
}