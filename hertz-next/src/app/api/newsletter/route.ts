import { notify, isEmail, clip, looksLikeBot } from '@/lib/notify'
import { saveSubscriber } from '@/lib/supabase'

/**
 * POST /api/newsletter — iscrizione newsletter (pop-up di benvenuto + eventuali form).
 * Salva l'iscritto su Supabase (se configurato) e notifica il crew (log sempre,
 * email se Resend è configurato). Idempotente sulle email duplicate.
 * Payload: { email, consent, source?, website(honeypot) }.
 */
export async function POST(req: Request) {
  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }

  // honeypot: probabile bot → finge successo, scarta silenziosamente
  if (looksLikeBot(b)) return Response.json({ ok: true, message: "You're on the list." })

  const email = clip(b.email, 160).toLowerCase()
  if (!isEmail(email)) return Response.json({ ok: false, error: 'Enter a valid email.' }, { status: 400 })

  const consent = b.consent === true || clip(b.consent, 8) === 'yes'
  if (!consent) return Response.json({ ok: false, error: 'Please accept the privacy notice.' }, { status: 400 })

  const source = clip(b.source, 40) || 'popup'
  const userAgent = clip(req.headers.get('user-agent'), 300)

  // 1) persistenza nel database (Supabase). È questo il "salvataggio" richiesto.
  const saved = await saveSubscriber({ email, consent: true, source, userAgent })
  if (!saved.ok) {
    return Response.json(
      { ok: false, error: 'Could not sign you up. Please try again.' },
      { status: 502 },
    )
  }

  // 2) notifica al crew (log SEMPRE; email se Resend configurato). Non deve far
  //    fallire l'iscrizione se il DB ha già salvato.
  try {
    await notify({
      subject: `Newsletter · ${email}`,
      text: [
        `${email} joined the Hertz newsletter`,
        `Source: ${source}`,
        saved.stored
          ? saved.duplicate
            ? 'DB: already subscribed'
            : 'DB: stored in Supabase'
          : 'DB: NOT stored (Supabase not configured yet)',
        `When: ${new Date().toISOString()}`,
      ].join('\n'),
      replyTo: email,
    })
  } catch {
    // se Supabase ha salvato, l'iscrizione è valida anche senza la notifica email
    if (!saved.stored) {
      return Response.json(
        { ok: false, error: 'Could not sign you up. Please try again.' },
        { status: 502 },
      )
    }
  }

  return Response.json({ ok: true, message: "You're on the list.", duplicate: saved.duplicate ?? false })
}
