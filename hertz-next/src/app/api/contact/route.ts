import { notify, isEmail, clip } from '@/lib/notify'

/** POST /api/contact — messaggi di contatto generici. */
export async function POST(req: Request) {
  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }

  const name = clip(b.name, 120)
  const email = clip(b.email, 160)
  const message = clip(b.message, 2000)
  if (name.length < 2) return Response.json({ ok: false, error: 'Invalid name' }, { status: 400 })
  if (!isEmail(email)) return Response.json({ ok: false, error: 'Invalid email' }, { status: 400 })
  if (message.length < 10) return Response.json({ ok: false, error: 'Message too short' }, { status: 400 })

  const text = `Name: ${name}\nEmail: ${email}\n\n${message}\n\n${new Date().toISOString()}`
  try {
    await notify({ subject: `Contact · ${name}`, text, replyTo: email })
  } catch {
    return Response.json({ ok: false, error: 'Could not send the message. Please try again.' }, { status: 502 })
  }
  return Response.json({ ok: true, message: 'Message received.' })
}
