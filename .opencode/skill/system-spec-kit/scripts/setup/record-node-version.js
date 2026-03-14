#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// 1. RECORD NODE VERSION
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');

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
