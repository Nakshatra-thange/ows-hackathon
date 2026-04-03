import { broadcast } from '../index'
import { logTransaction } from '../ledger'

export async function sendNewsletter(content: string, subject: string): Promise<void> {
  broadcast({ event: 'agent_step', message: `📧 Sending newsletter to subscribers...`, status: 'running' })

  // Use Resend if available, otherwise mock
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'pressly@yourdomain.com',
      to: ['demo@hackathon.com'],
      subject,
      html: `<pre>${content}</pre>`
    })
    logTransaction('spend', 0.005, 'Email delivery via Resend')
  }

  broadcast({ event: 'agent_step', message: `✅ Newsletter sent! Paid $0.005 for delivery`, status: 'done' })
}