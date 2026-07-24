/* ────────────────────────────────────────────────────────────
   HERTZ · NOTIFY — invio notifiche form (booking/reserve/contact/waitlist)
   Migrato dagli handler Vercel legacy. Comportamento:
     · logga SEMPRE (visibile nei Runtime Logs anche senza email)
     · se RESEND_API_KEY è configurata, invia una mail al crew via Resend
   Nessuna dipendenza: usa fetch nativo. Destinatario reale = hertzbologna@gmail.com.
   ──────────────────────────────────────────────────────────── */

export const NOTIFY_TO = process.env.NOTIFY_TO || 'hertzbologna@gmail.com'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function isEmail(s: unknown): s is string {
  return typeof s === 'string' && EMAIL_RE.test(s.trim())
}

/** stringa pulita, trim + cap lunghezza */
export function clip(s: unknown, max: number): string {
  return (s ?? '').toString().trim().slice(0, max)
}

/** honeypot: se il campo nascosto `website` è valorizzato → probabile bot. */
export function looksLikeBot(b: Record<string, unknown>): boolean {
  return clip(b.website, 200).length > 0
}

export interface Notice {
  subject: string
  text: string
  replyTo?: string
}

/**
 * Logga la notifica e (se configurato Resend) la invia via email.
 * Lancia in caso di errore Resend, così il route handler può rispondere 502.
 */
export async function notify({ subject, text, replyTo }: Notice): Promise<{ sent: boolean }> {
  console.log(`[NOTIFY → ${NOTIFY_TO}] ${subject}\n${text}`)

  const key = process.env.RESEND_API_KEY
  if (!key) return { sent: false }

  const from = process.env.RESEND_FROM || 'Hertz <onboarding@resend.dev>'
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: NOTIFY_TO, reply_to: replyTo, subject, text }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error('[NOTIFY] Resend error', res.status, detail)
    throw new Error('resend_failed')
  }
  return { sent: true }
}
