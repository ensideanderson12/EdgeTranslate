#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
function usage() {
  console.log('Usage: node index.js <file.csv>');
  process.exit(1);
}

if (process.argv.length < 3) {
  usage();
}

const filePath = process.argv[2];
const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
const firstLine = content.split(/\n/)[0];
const delimiter = firstLine.includes(';') ? ';' : ',';
const lines = content.trim().split(/\r?\n/);
const headers = lines.shift().split(delimiter).map(h => h.trim());
const records = lines.map(line => {
  const cells = line.split(delimiter);
  const record = {};
  headers.forEach((h, i) => {
    record[h] = (cells[i] || '').trim();
  });
  return record;
});

function parseNumber(value) {
  if (typeof value !== 'string') {
    return parseFloat(value) || 0;
  }
  let cleaned = value.replace(/R\$|\$/g, '').trim();
  if (cleaned.includes(',') && cleaned.includes('.')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes(',')) {
    cleaned = cleaned.replace(',', '.');
  }
  return parseFloat(cleaned) || 0;
}

let totalRevenue = 0;
let totalCost = 0;

for (const row of records) {
  const volume = parseNumber(row.volume_m3 || row.volume || 0);
  const buy = parseNumber(row.buy_price || row.buy || 0);
  const sell = parseNumber(row.sell_price || row.sell || 0);
  const freight = parseNumber(row.freight_per_m3 || row.freight || 0);
  totalRevenue += sell * volume;
  totalCost += (buy + freight) * volume;
}

const profit = totalRevenue - totalCost;
console.log(`Revenue: ${totalRevenue.toFixed(2)}`);
console.log(`Cost: ${totalCost.toFixed(2)}`);
console.log(`Profit: ${profit.toFixed(2)}`);

