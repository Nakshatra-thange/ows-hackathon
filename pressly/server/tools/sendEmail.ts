import { broadcast } from '../index'
import { logTransaction } from '../ledger'

export async function sendNewsletter(subject: string, body: string): Promise<void> {
  broadcast({
    event: 'agent_step',
    message: `📧 Sending newsletter: "${subject}"`,
    status: 'running'
  })

  try {
    const { Resend } = await import('resend')

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      to: process.env.DEMO_EMAIL!,
      from: process.env.RESEND_FROM_EMAIL!,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; color: #fff; padding: 16px; border-radius: 8px 8px 0 0;">
            <h2 style="margin:0">📰 Pressly</h2>
            <p style="margin:0; color: #666; font-size: 12px;">Autonomous AI Newsletter • Powered by OWS</p>
          </div>
          <div style="padding: 24px; border: 1px solid #eee;">
            ${body.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `
    })

    logTransaction('spend', 0.005, 'Email delivery via Resend')

    broadcast({
      event: 'agent_step',
      message: `✅ Newsletter delivered (real email)`,
      status: 'done'
    })

  } catch (err: any) {
    console.error("EMAIL ERROR:", err)
    console.log("RESEND KEY:", process.env.RESEND_API_KEY ? "Loaded ✅" : "Missing ❌")

    // fallback (VERY IMPORTANT FOR DEMO)
    logTransaction('spend', 0.005, 'Email delivery (fallback)')

    broadcast({
      event: 'agent_step',
      message: `⚠️ Email fallback triggered`,
      status: 'warning'
    })
  }
}