// POST /api/admin  { password }  -> { ok, bookings:[...], events:[{id,title,entries:[...]}] }
// Team-only read endpoint, gated by the ADMIN_PASSWORD env var. Returns every
// guest list (grouped by event) and every booking request.
const { kv } = require('@vercel/kv');

const parse = (v) => {
  if (v && typeof v === 'object') return v;
  try { return JSON.parse(v); } catch (e) { return { raw: v }; }
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return res.status(500).json({ ok: false, error: 'ADMIN_PASSWORD not set' });
  const { password } = req.body || {};
  if (!password || String(password) !== String(expected)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  try {
    const bookingsRaw = (await kv.lrange('bookings', 0, -1)) || [];
    const bookings = bookingsRaw.map(parse).reverse();

    const eventIds = (await kv.smembers('gl:events')) || [];
    const titles = (await kv.hgetall('gl:titles')) || {};
    const events = [];
    for (const id of eventIds) {
      const listRaw = (await kv.lrange(`gl:list:${id}`, 0, -1)) || [];
      events.push({ id, title: (titles && titles[id]) || id, entries: listRaw.map(parse) });
    }
    events.sort((a, b) => String(b.id).localeCompare(String(a.id)));

    return res.status(200).json({ ok: true, bookings, events });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Storage not configured' });
  }
};
