import fs from 'node:fs';

const file = process.argv[2] ?? 'D:/전광판/data/normalized/curated-keep-index.json';
const index = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Array.isArray(index.records) || index.count !== index.records.length) throw new Error('Index count mismatch');
if (index.records.some((row) => !row.path || !row.category || Number.isNaN(row.sizeBytes))) throw new Error('Invalid record');
const smps = index.records.filter((row) => `${row.path} ${row.sourceGroup}`.toLowerCase().includes('smps'));
const drawings = index.records.filter((row) => ['.dwg', '.dxf'].includes(row.extension.toLowerCase()));
if (smps.length === 0 || drawings.length === 0) throw new Error('Expected display records not found');
console.log(`CURATED_INDEX_OK records=${index.count} smpsMatches=${smps.length} drawings=${drawings.length}`);
