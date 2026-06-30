// /api/booking.js — Vercel Serverless Function
// On-site booking enquiries. The whole request happens in the website form;
// this endpoint receives it, (optionally) stores it, and notifies the crew by
// email that a new booking request came in. No mailto, no client email client.
//
// POST /api/booking
//   { bookingType, resident, name, email, org, venue, city, date,
//     capacity, budget, message }
//   → 200 { ok: true }
//
// Notifications go to hertzbologna@gmail.com.

const NOTIFY_TO = 'hertzbologna@gmail.com';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const b = req.body || {};
  const name = (b.name || '').toString().trim();
  const email = (b.email || '').toString().trim();
  const message = (b.message || '').toString().trim();

  // ─── validation ───
  if (name.length < 2) return res.status(400).json({ ok: false, error: 'Invalid name' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'Invalid email' });
  if (message.length < 10) return res.status(400).json({ ok: false, error: 'Message too short' });

  const entry = {
    bookingType: (b.bookingType || '').toString().trim(),   // "format" | "resident"
    resident: (b.resident || '').toString().trim(),         // resident name or "No preference"
    name,
    email,
    org: (b.org || '').toString().trim(),
    venue: (b.venue || '').toString().trim(),
    city: (b.city || '').toString().trim(),
    date: (b.date || '').toString().trim(),
    capacity: (b.capacity || '').toString().trim(),
    budget: (b.budget || '').toString().trim(),
    message,
    timestamp: new Date().toISOString(),
  };

  const subject = `Booking — ${entry.bookingType === 'resident' ? (entry.resident || 'Resident') : 'Hertz format'} · ${entry.name}`;
  const body = [
    `Type: ${entry.bookingType}`,
    entry.resident ? `Resident: ${entry.resident}` : null,
    `Name: ${entry.name}`,
    `Email: ${entry.email}`,
    entry.org ? `Org/Promoter: ${entry.org}` : null,
    entry.venue ? `Venue/Event: ${entry.venue}` : null,
    entry.city ? `City: ${entry.city}` : null,
    entry.date ? `Date: ${entry.date}` : null,
    entry.capacity ? `Capacity: ${entry.capacity}` : null,
    entry.budget ? `Budget: ${entry.budget}` : null,
    '',
    entry.message,
    '',
    `— ${entry.timestamp}`,
  ].filter(Boolean).join('\n');

  // ─── OPTION 1: Log to Vercel (default — visible in Runtime Logs) ───
  console.log(`[BOOKING → ${NOTIFY_TO}] ${subject}\n${body}`);

  // ─── OPTION 2: Email the crew via Resend (uncomment + set RESEND_API_KEY) ───
  // const RESEND_KEY = process.env.RESEND_API_KEY;
  // if (RESEND_KEY) {
  //   await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       from: 'Hertz Bookings <noreply@hertzclubbing.com>',
  //       to: NOTIFY_TO,
  //       reply_to: entry.email,
  //       subject,
  //       text: body,
  //     }),
  //   });
  // }

  // ─── OPTION 3: Forward to a Google Sheet / Make / Zapier webhook ───
  // const HOOK = process.env.BOOKING_WEBHOOK;
  // if (HOOK) await fetch(HOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry) });

  return res.status(200).json({ ok: true, message: 'Booking request received' });
};
