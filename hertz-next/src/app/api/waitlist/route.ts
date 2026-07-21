import { notify, isEmail, clip } from '@/lib/notify'

/** POST /api/waitlist — iscrizioni alla waitlist merch (drop futuri). */
export async function POST(req: Request) {
  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }

  const email = clip(b.email, 160).toLowerCase()
  if (!isEmail(email)) return Response.json({ ok: false, error: 'Invalid email' }, { status: 400 })

  const text = `${email} joined the drop waitlist at ${new Date().toISOString()}`
  try {
    await notify({ subject: `Waitlist — ${email}`, text, replyTo: email })
  } catch {
    return Response.json({ ok: false, error: 'Could not sign you up. Please try again.' }, { status: 502 })
  }
  return Response.json({ ok: true, message: "You're on the list." })
}
