import { notify, isEmail, clip } from '@/lib/notify'

/** POST /api/booking — richieste di booking (resident o format Hertz). */
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

  const e = {
    bookingType: clip(b.bookingType, 40),
    resident: clip(b.resident, 80),
    org: clip(b.org, 160),
    venue: clip(b.venue, 160),
    city: clip(b.city, 80),
    date: clip(b.date, 40),
    capacity: clip(b.capacity, 40),
    budget: clip(b.budget, 40),
  }

  const subject = `Booking — ${e.bookingType === 'resident' ? e.resident || 'Resident' : 'Hertz format'} · ${name}`
  const text = [
    `Type: ${e.bookingType || 'n/a'}`,
    ...(e.resident ? [`Resident: ${e.resident}`] : []),
    `Name: ${name}`,
    `Email: ${email}`,
    ...(e.org ? [`Org/Promoter: ${e.org}`] : []),
    ...(e.venue ? [`Venue/Event: ${e.venue}`] : []),
    ...(e.city ? [`City: ${e.city}`] : []),
    ...(e.date ? [`Date: ${e.date}`] : []),
    ...(e.capacity ? [`Capacity: ${e.capacity}`] : []),
    ...(e.budget ? [`Budget: ${e.budget}`] : []),
    '',
    message,
    '',
    `— ${new Date().toISOString()}`,
  ].join('\n')

  try {
    await notify({ subject, text, replyTo: email })
  } catch {
    return Response.json({ ok: false, error: 'Could not send the request. Please try again.' }, { status: 502 })
  }
  return Response.json({ ok: true, message: 'Booking request received.' })
}
