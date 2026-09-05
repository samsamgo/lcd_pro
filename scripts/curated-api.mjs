import http from 'node:http';
import fs from 'node:fs';

const indexPath = process.env.DISPLAY_CURATED_INDEX ?? 'D:/전광판/data/normalized/curated-keep-index.json';
const port = Number(process.env.DISPLAY_DATA_PORT ?? 3400);
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  if (req.method !== 'GET' || url.pathname !== '/api/data') return json(res, 404, { error: 'Not found' });
  const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
  const category = (url.searchParams.get('category') ?? '').trim();
  const rawLimit = Number(url.searchParams.get('limit') ?? 25);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.floor(rawLimit), 1), 100) : 25;
  const records = index.records
    .filter((row) => !category || row.category === category)
    .filter((row) => !q || `${row.path} ${row.sourceGroup} ${row.extension}`.toLowerCase().includes(q))
    .slice(0, limit);
  json(res, 200, { generatedAt: index.generatedAt, total: records.length, available: index.count, records });
});

server.listen(port, '127.0.0.1', () => console.log(`Curated data API listening on http://127.0.0.1:${port}/api/data`));
