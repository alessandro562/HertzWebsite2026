// POST /api/booking  { firstName, lastName, phone, email, type, artist, eventName, date, city, budget, message }
// Stores a booking request (Hertz format or a single resident) in Vercel KV.
const { kv } = require('@vercel/kv');

const clean = (s, n) => String(s == null ? '' : s).trim().slice(0, n);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const b = req.body || {};
  const firstName = clean(b.firstName, 80);
  const lastName = clean(b.lastName, 80);
  const email = clean(b.email, 140).toLowerCase();
  const phone = clean(b.phone, 40);

  if (!firstName || !lastName || !/.+@.+\..+/.test(email) || !phone) {
    return res.status(400).json({ ok: false, error: 'Missing or invalid fields' });
  }

  const entry = {
    firstName, lastName, email, phone,
    type: clean(b.type, 40),                 // 'hertz' | 'artist'
    artist: clean(b.artist, 80),             // resident name if type === 'artist'
    eventName: clean(b.eventName, 160),
    date: clean(b.date, 40),
    city: clean(b.city, 120),
    budget: clean(b.budget, 60),
    message: clean(b.message, 1200),
    ts: new Date().toISOString(),
  };

  try {
    await kv.rpush('bookings', JSON.stringify(entry));
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Storage not configured' });
  }
};
