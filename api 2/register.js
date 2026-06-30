// /api/register.js — Vercel Serverless Function
// The "Hertz list": collects guest-list signups for a SPECIFIC event.
// Each event keeps its own list, keyed by eventId.
//
// POST /api/register
//   { "eventId": "hertz-x-atrium-280626", "eventTitle": "Hertz × Atrium",
//     "date": "28.06.26", "venue": "Noah's Dream", "city": "Ortona",
//     "name": "Mario Rossi", "email": "mario@example.com", "phone": "+39 ..." }
//   → 200 { "ok": true }
//
// GET /api/register?eventId=...        → list size + entries (basic admin read)
//
// Storage options (pick one and uncomment):
//   1. Vercel KV (Redis) — recommended for production (per-event lists)
//   2. Forward to a Google Sheet via webhook (one tab per event, or an event column)
//   3. Send a notification email via Resend/SendGrid
//   4. Log to Vercel Runtime Logs (current default — simplest start)

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ─── GET: read a single event's list (protect this in production) ───
  if (req.method === 'GET') {
    const eventId = (req.query && req.query.eventId || '').trim();
    if (!eventId) return res.status(400).json({ ok: false, error: 'Missing eventId' });
    // const { kv } = await import('@vercel/kv');
    // const entries = await kv.lrange(`hertz:list:${eventId}`, 0, -1);
    // return res.status(200).json({ ok: true, eventId, count: entries.length, entries: entries.map(e => JSON.parse(e)) });
    return res.status(200).json({ ok: true, eventId, count: 0, entries: [], note: 'Enable a storage backend below to persist + read the list.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { eventId, eventTitle, date, venue, city, name, email, phone } = req.body || {};

  // ─── validation ───
  if (!eventId || typeof eventId !== 'string') {
    return res.status(400).json({ ok: false, error: 'Missing eventId' });
  }
  if (!name || String(name).trim().length < 2) {
    return res.status(400).json({ ok: false, error: 'Invalid name' });
  }
  if (!email || !String(email).includes('@') || String(email).length < 5) {
    return res.status(400).json({ ok: false, error: 'Invalid email' });
  }

  const entry = {
    eventId: String(eventId).trim(),
    eventTitle: (eventTitle || '').toString().trim(),
    date: (date || '').toString().trim(),
    venue: (venue || '').toString().trim(),
    city: (city || '').toString().trim(),
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: (phone || '').toString().trim(),
    timestamp: new Date().toISOString(),
  };

  // ─── OPTION 1: Log to Vercel (default — check Runtime Logs in the dashboard) ───
  console.log(`[HERTZ LIST] ${entry.eventId} — ${entry.name} <${entry.email}> ${entry.phone}`);

  // ─── OPTION 2: Vercel KV — one list per event (uncomment + add a KV store) ───
  // const { kv } = await import('@vercel/kv');
  // await kv.sadd('hertz:lists', entry.eventId);                       // index of all events
  // const isNew = await kv.sadd(`hertz:list:${entry.eventId}:emails`, entry.email); // dedupe by email
  // if (isNew) await kv.rpush(`hertz:list:${entry.eventId}`, JSON.stringify(entry));
  // await kv.hset(`hertz:list:meta:${entry.eventId}`, { title: entry.eventTitle, date: entry.date, venue: entry.venue, city: entry.city });

  // ─── OPTION 3: Forward to a Google Sheets webhook (uncomment + set env var) ───
  // const SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK;
  // if (SHEET_WEBHOOK) {
  //   await fetch(SHEET_WEBHOOK, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(entry),
  //   });
  // }

  // ─── OPTION 4: Notify the crew via Resend (uncomment + set env var) ───
  // const RESEND_KEY = process.env.RESEND_API_KEY;
  // if (RESEND_KEY) {
  //   await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       from: 'Hertz <noreply@hertz.cc>',
  //       to: 'hertzbologna@gmail.com',
  //       subject: `Hertz list — ${entry.name} → ${entry.eventTitle || entry.eventId}`,
  //       text: `${entry.name} <${entry.email}> ${entry.phone}\n${entry.eventTitle} · ${entry.date} · ${entry.venue}, ${entry.city}\n${entry.timestamp}`,
  //     }),
  //   });
  // }

  return res.status(200).json({ ok: true, message: 'You\'re on the list.' });
};
