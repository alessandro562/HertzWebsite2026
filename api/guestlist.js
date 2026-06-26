// POST /api/guestlist  { event, eventTitle, name, surname, email }
// Stores a guest-list registration for a specific event in Vercel KV.
const { kv } = require('@vercel/kv');

const clean = (s, n) => String(s == null ? '' : s).trim().slice(0, n);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const b = req.body || {};
  const event = clean(b.event, 48).replace(/[^a-zA-Z0-9._-]/g, '');
  const name = clean(b.name, 80);
  const surname = clean(b.surname, 80);
  const email = clean(b.email, 140).toLowerCase();

  if (!event || !name || !surname || !/.+@.+\..+/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Missing or invalid fields' });
  }

  const entry = { name, surname, email, ts: new Date().toISOString() };

  try {
    const isNew = await kv.sadd(`gl:emails:${event}`, email); // 1 if new, 0 if already present
    if (isNew) {
      await kv.rpush(`gl:list:${event}`, JSON.stringify(entry));
      await kv.sadd('gl:events', event);
      if (b.eventTitle) await kv.hset('gl:titles', { [event]: clean(b.eventTitle, 160) });
    }
    return res.status(200).json({ ok: true, already: !isNew });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Storage not configured' });
  }
};
