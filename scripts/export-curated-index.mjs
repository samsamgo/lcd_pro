import fs from 'node:fs';
import path from 'node:path';

const manifest = process.argv[2] ?? 'D:/전광판/_RAW_통합/_정리보고서/curated/curated-manifest.csv';
const output = process.argv[3] ?? 'D:/전광판/data/normalized/curated-keep-index.json';

const text = fs.readFileSync(manifest, 'utf8').replace(/^\uFEFF/, '');
const records = [];
let record = '';
let inQuotes = false;
for (let i = 0; i < text.length; i += 1) {
  const c = text[i];
  if (c === '"' && text[i + 1] === '"' && inQuotes) { record += '""'; i += 1; continue; }
  if (c === '"') { inQuotes = !inQuotes; record += c; continue; }
  if ((c === '\n' || c === '\r') && !inQuotes) {
    if (c === '\r' && text[i + 1] === '\n') i += 1;
    if (record) records.push(record);
    record = '';
    continue;
  }
  record += c;
}
if (record) records.push(record);
const parse = (line) => {
  const out = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (c === '"' && line[i + 1] === '"' && quoted) { value += '"'; i += 1; continue; }
    if (c === '"') { quoted = !quoted; continue; }
    if (c === ',' && !quoted) { out.push(value); value = ''; continue; }
    value += c;
  }
  out.push(value);
  return out;
};
const headers = parse(records.shift());
const rows = records.map(parse).map((values) => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ''])));
const keep = rows.filter((row) => row.Action === 'KEEP').map((row) => ({
  path: row.RelativePath,
  sourceGroup: row.TopFolder,
  category: row.Category,
  extension: row.Extension,
  sizeBytes: Number(row.SizeBytes),
  lastWriteTime: row.LastWriteTime,
}));
const payload = {
  generatedAt: new Date().toISOString(),
  sourceManifest: manifest,
  sourceRoot: 'D:/전광판/_RAW_통합',
  count: keep.length,
  totalBytes: keep.reduce((sum, item) => sum + item.sizeBytes, 0),
  records: keep,
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(payload, null, 2), 'utf8');
console.log(`Wrote ${keep.length} KEEP records to ${output}`);
