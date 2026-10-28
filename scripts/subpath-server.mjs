/**
 * Static file server that mimics GitHub Pages sub-path hosting.
 * Serves ./tmp-serve/Quintixstudio/ (a copy of dist) at
 *   http://localhost:4174/Quintixstudio/
 * exactly like https://<user>.github.io/Quintixstudio/
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = 'tmp-serve';
const PREFIX = '/Quintixstudio';
const PORT = 4174;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

http
  .createServer(async (req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);

    // Root of the "site" redirects to the sub-path, like GitHub Pages does.
    if (url === '/' || url === '') {
      res.writeHead(302, { Location: PREFIX + '/' });
      return res.end();
    }

    if (!url.startsWith(PREFIX)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found (outside sub-path)');
    }

    let rel = url.slice(PREFIX.length);
    if (rel === '/' || rel === '') rel = '/index.html';

    // Prevent path traversal
    const safe = normalize(rel).replace(/^(\.\.[/\\])+/, '');
    let filePath = join(ROOT, 'Quintixstudio', safe);

    try {
      let data;
      try {
        data = await readFile(filePath);
      } catch {
        // SPA fallback: unknown paths serve index.html
        filePath = join(ROOT, 'Quintixstudio', 'index.html');
        data = await readFile(filePath);
      }
      res.writeHead(200, { 'Content-Type': TYPES[extname(filePath)] || 'application/octet-stream' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error: ' + err.message);
    }
  })
  .listen(PORT, () => console.log(`Sub-path server: http://localhost:${PORT}${PREFIX}/`));
