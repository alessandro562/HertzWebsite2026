import { notify, isEmail, clip } from '@/lib/notify'

/** POST /api/reserve — prenotazione merch (Drop 01 Lanyard). */
export async function POST(req: Request) {
  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }

  const name = clip(b.name, 120)
  const email = clip(b.email, 160).toLowerCase()
  if (name.length < 2) return Response.json({ ok: false, error: 'Invalid name' }, { status: 400 })
  if (!isEmail(email)) return Response.json({ ok: false, error: 'Invalid email' }, { status: 400 })

  let qty = parseInt(String(b.quantity ?? 1), 10)
  if (!Number.isFinite(qty) || qty < 1) qty = 1
  if (qty > 10) qty = 10

  const item = clip(b.item, 120) || 'Lanyard · Drop 01'
  const note = clip(b.note, 600)
  const text = [
    `Item: ${item}`,
    `Quantity: ${qty}`,
    `Name: ${name}`,
    `Email: ${email}`,
    note && `Note: ${note}`,
    `When: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    await notify({ subject: `Reservation — ${item} ×${qty} · ${name}`, text, replyTo: email })
  } catch {
    return Response.json({ ok: false, error: 'Could not send the reservation. Please try again.' }, { status: 502 })
  }
  return Response.json({ ok: true, message: 'Reservation received.' })
}
