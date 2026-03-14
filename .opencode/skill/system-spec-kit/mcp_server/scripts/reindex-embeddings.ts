#!/usr/bin/env node
// Feature catalog: Architecture boundary enforcement
// ───────────────────────────────────────────────────────────────
// 1. REINDEX EMBEDDINGS COMPATIBILITY WRAPPER
// ───────────────────────────────────────────────────────────────
import { spawnSync } from 'child_process';
import path from 'path';

const targetScript = path.resolve(__dirname, '../../scripts/dist/memory/reindex-embeddings.js');
const result = spawnSync(process.execPath, [targetScript, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
