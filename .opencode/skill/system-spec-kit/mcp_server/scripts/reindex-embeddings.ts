#!/usr/bin/env node
// Feature catalog: Architecture boundary enforcement
// ───────────────────────────────────────────────────────────────
// MODULE: Reindex Embeddings Compatibility Wrapper
// ───────────────────────────────────────────────────────────────
import { spawnSync } from 'child_process';
import path from 'path';

const targetScript = path.resolve(import.meta.dirname, '../../../scripts/dist/memory/reindex-embeddings.js');
const result = spawnSync(process.execPath, [targetScript, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
