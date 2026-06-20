/**
 * /api/contact.js
 * POST /api/contact
 * Riceve messaggi di contatto
 * 
 * Request: { name, email, message }
 * Response: { ok: true }
 */

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: 'Message too short' });
  }

  try {
    console.log(`[CONTACT] ${name} <${email}>: ${message}`);

    // TODO: Invia email o salva nel database
    
    return res.status(200).json({
      ok: true,
      message: 'Message received',
    });
  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
