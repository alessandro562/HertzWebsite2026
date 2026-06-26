import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = process.cwd();
const PORT = process.env.PORT || 8765;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.jsx': 'text/babel', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json', '.ico': 'image/x-icon' };

http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);

    // Local shim for the Vercel serverless API (dev only)
    if (p.startsWith('/api/articles')) {
      const src = await readFile(join(ROOT, 'api/articles.js'), 'utf8');
      const mod = await import('data:text/javascript,' + encodeURIComponent(src));
      const query = Object.fromEntries(new URL(req.url, 'http://x').searchParams);
      const fakeRes = {
        statusCode: 200,
        setHeader() {},
        status(c) { this.statusCode = c; return this; },
        json(obj) { res.writeHead(this.statusCode, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); return this; },
        end() { res.writeHead(this.statusCode); res.end(); },
      };
      await mod.default({ method: 'GET', query }, fakeRes);
      return;
    }

    // Mirror the Vercel rewrite /media/:slug -> template
    if (/^\/media\/[^/]+$/.test(p)) p = '/media-article-template.html';
    if (p === '/') p = '/index.html';

    const file = join(ROOT, normalize(p));
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}).listen(PORT, () => console.log('serving on ' + PORT));
