// /api/waitlist.js — Vercel Serverless Function
// Collects email addresses for the merch Drop 01 waitlist.
//
// POST /api/waitlist  { "email": "user@example.com" }
// → 200 { "ok": true }
//
// Storage options (pick one and uncomment):
//   1. Vercel KV (Redis) — best for production
//   2. Forward to a Google Sheet via webhook
//   3. Send notification email via Resend/SendGrid
//   4. Log to Vercel logs (current default — simplest start)

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || !email.includes('@') || email.length < 5) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const timestamp = new Date().toISOString();

  // ─── OPTION 1: Log to Vercel (default — check Runtime Logs in dashboard) ───
  console.log(`[WAITLIST] ${timestamp} — ${cleanEmail}`);

  // ─── OPTION 2: Vercel KV (uncomment + add KV store in Vercel dashboard) ───
  // const { kv } = await import('@vercel/kv');
  // await kv.sadd('hertz:waitlist', cleanEmail);
  // await kv.hset(`hertz:waitlist:${cleanEmail}`, { email: cleanEmail, timestamp });

  // ─── OPTION 3: Forward to Google Sheets webhook (uncomment + set env var) ───
  // const SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK;
  // if (SHEET_WEBHOOK) {
  //   await fetch(SHEET_WEBHOOK, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email: cleanEmail, timestamp }),
  //   });
  // }

  // ─── OPTION 4: Send notification via Resend (uncomment + set env var) ───
  // const RESEND_KEY = process.env.RESEND_API_KEY;
  // if (RESEND_KEY) {
  //   await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       from: 'Hertz <noreply@hertz.cc>',
  //       to: 'info@hertz.cc',
  //       subject: `New waitlist signup: ${cleanEmail}`,
  //       text: `${cleanEmail} joined the Drop 01 waitlist at ${timestamp}`,
  //     }),
  //   });
  // }

  return res.status(200).json({ ok: true, message: 'You\'re on the list.' });
}
