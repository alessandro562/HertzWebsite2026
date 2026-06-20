/**
 * /api/health.js
 * GET /api/health
 * Health check per il backend
 */

export default async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
