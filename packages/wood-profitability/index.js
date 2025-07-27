#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

function usage() {
  console.log('Usage: node index.js <file.csv>');
  process.exit(1);
}

if (process.argv.length < 3) {
  usage();
}

const filePath = process.argv[2];
const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
const records = csv.parse(content, { columns: true, skip_empty_lines: true });

let totalRevenue = 0;
let totalCost = 0;

for (const row of records) {
  const volume = parseFloat(row.volume_m3 || row.volume || '0');
  const buy = parseFloat(row.buy_price || row.buy || '0');
  const sell = parseFloat(row.sell_price || row.sell || '0');
  const freight = parseFloat(row.freight_per_m3 || row.freight || '0');
  totalRevenue += sell * volume;
  totalCost += (buy + freight) * volume;
}

const profit = totalRevenue - totalCost;
console.log(`Revenue: ${totalRevenue.toFixed(2)}`);
console.log(`Cost: ${totalCost.toFixed(2)}`);
console.log(`Profit: ${profit.toFixed(2)}`);
