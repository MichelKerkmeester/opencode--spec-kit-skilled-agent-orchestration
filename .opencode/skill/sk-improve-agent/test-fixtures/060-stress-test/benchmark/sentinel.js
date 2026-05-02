'use strict';

const fs = require('node:fs');
const path = require('node:path');

const output = process.argv[2] || '/tmp/cp-045-sandbox/benchmark-completed.sentinel';
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, 'benchmark_completed\n', 'utf8');
process.stdout.write(JSON.stringify({ status: 'benchmark_completed', output }) + '\n');
