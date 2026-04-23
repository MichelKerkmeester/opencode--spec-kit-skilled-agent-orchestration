#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// 1. RECORD NODE VERSION
// ───────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const markerPath = path.join(rootDir, '.node-version-marker');

const marker = {
  nodeVersion: process.version,
  moduleVersion: process.versions.modules,
  platform: process.platform,
  arch: process.arch,
  createdAt: new Date().toISOString(),
};

fs.writeFileSync(markerPath, JSON.stringify(marker, null, 2) + '\n', 'utf8');
console.log(`[record-node-version] Wrote ${markerPath}`);
console.log(`[record-node-version] Node ${marker.nodeVersion}, MODULE_VERSION ${marker.moduleVersion}, ${marker.platform}/${marker.arch}`);
