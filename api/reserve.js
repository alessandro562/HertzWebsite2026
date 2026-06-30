// /api/reserve.js — Vercel Serverless Function
// Lanyard (Drop 01) reservations. Emails the crew a reservation notice.
//
// POST /api/reserve
//   { "item": "Lanyard · Drop 01", "name": "Mario Rossi",
//     "email": "mario@example.com", "quantity": 1, "note": "..." }
//   → 200 { ok: true }
//
// To make the email actually arrive, set these in Vercel → Settings → Environment Variables:
//   RESEND_API_KEY   (from https://resend.com — required)
//   RESERVE_TO       (optional, default hertzbologna@gmail.com)
//   RESEND_FROM      (optional, default "Hertz <onboarding@resend.dev>")
// Without a verified domain, Resend's onboarding@resend.dev only delivers to the
// Resend account owner's address — fine for notifying the crew. Verify
// hertzclubbing.com in Resend to send from noreply@hertzclubbing.com.

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const { item, name, email, quantity, note } = req.body || {};

  if (!name || String(name).trim().length < 2) {
    return res.status(400).json({ ok: false, error: 'Invalid name' });
  }
  if (!email || !String(email).includes('@') || String(email).length < 5) {
    return res.status(400).json({ ok: false, error: 'Invalid email' });
  }
  let qty = parseInt(quantity, 10);
  if (!Number.isFinite(qty) || qty < 1) qty = 1;
  if (qty > 10) qty = 10;

  const entry = {
    item: (item || 'Lanyard · Drop 01').toString().trim().slice(0, 120),
    name: String(name).trim().slice(0, 120),
    email: String(email).trim().toLowerCase().slice(0, 160),
    quantity: qty,
    note: (note || '').toString().trim().slice(0, 600),
    timestamp: new Date().toISOString(),
  };

  // Always log (visible in Vercel Runtime Logs even without email configured)
  console.log(`[RESERVE] ${entry.item} ×${entry.quantity} — ${entry.name} <${entry.email}> ${entry.note ? '· ' + entry.note : ''}`);

  // Send the crew an email via Resend, if configured
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const TO = process.env.RESERVE_TO || 'hertzbologna@gmail.com';
  const FROM = process.env.RESEND_FROM || 'Hertz <onboarding@resend.dev>';
  if (RESEND_KEY) {
    const body =
      `New reservation\n\n` +
      `Item:     ${entry.item}\n` +
      `Quantity: ${entry.quantity}\n` +
      `Name:     ${entry.name}\n` +
      `Email:    ${entry.email}\n` +
      (entry.note ? `Note:     ${entry.note}\n` : '') +
      `When:     ${entry.timestamp}\n`;
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: TO,
          reply_to: entry.email,
          subject: `Reservation — ${entry.item} ×${entry.quantity} · ${entry.name}`,
          text: body,
        }),
      });
      if (!r.ok) {
        const detail = await r.text().catch(() => '');
        console.error('[RESERVE] Resend error', r.status, detail);
        return res.status(502).json({ ok: false, error: 'Could not send the reservation. Please try again.', debug: { status: r.status, detail: String(detail).slice(0, 300), from: FROM, to: TO } });
      }
    } catch (err) {
      console.error('[RESERVE] Resend exception', err && err.message);
      return res.status(502).json({ ok: false, error: 'Could not send the reservation. Please try again.' });
    }
  }

  return res.status(200).json({ ok: true, message: 'Reservation received.' });
};
