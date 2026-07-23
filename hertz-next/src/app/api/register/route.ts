import { notify, isEmail, clip } from '@/lib/notify'

/**
 * POST /api/register — iscrizione alla LISTA HERTZ per un evento specifico.
 * Hertz lavora solo con le liste: niente biglietti, si entra dalla guest list.
 * Payload: { n, title, date, venue, city, name, email, phone? }.
 * Logga sempre; se RESEND_API_KEY è configurata invia la notifica al crew
 * (hertzbologna@gmail.com). Nessun dato inventato: solo ciò che l'utente inserisce.
 */
export async function POST(req: Request) {
  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }

  const name = clip(b.name, 120)
  const email = clip(b.email, 160).toLowerCase()
  const phone = clip(b.phone, 40)
  if (name.length < 2) return Response.json({ ok: false, error: 'Please enter your full name.' }, { status: 400 })
  if (!isEmail(email)) return Response.json({ ok: false, error: 'Please enter a valid email.' }, { status: 400 })

  const n = clip(b.n, 12)
  const title = clip(b.title, 160) || 'Hertz event'
  const date = clip(b.date, 60)
  const venue = clip(b.venue, 120)
  const city = clip(b.city, 80)
  const where = [venue, city].filter(Boolean).join(', ')

  const text = [
    `List: ${title}${n ? ` (N°${n})` : ''}`,
    date && `Date: ${date}`,
    where && `Venue: ${where}`,
    `Name: ${name}`,
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    `When: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    await notify({
      subject: `Hertz list — ${title}${date ? ` · ${date}` : ''} · ${name}`,
      text,
      replyTo: email,
    })
  } catch {
    return Response.json(
      { ok: false, error: 'Could not add you to the list. Please try again.' },
      { status: 502 },
    )
  }
  return Response.json({ ok: true, message: 'You’re on the list.' })
}
