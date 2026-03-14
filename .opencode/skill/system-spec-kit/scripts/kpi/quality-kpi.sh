#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SCRIPT: Quality KPI
# Computes memory quality KPI rates and prints JSON + summary
# ───────────────────────────────────────────────────────────────
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET_SPEC_FOLDER="${1:-}"

node - "$ROOT_DIR" "$TARGET_SPEC_FOLDER" <<'NODE'
const fs = require('fs');
const path = require('path');

const rootDir = process.argv[2];
const specFolderArg = process.argv[3];

const fallbackRegex = /No (specific )?decisions were made/i;
const contaminationRegex = /\b(I'll execute this step by step|Let me analyze|I'll now|Step\s+\d+:|Let me check|I need to|I'll start by)\b/i;

function readFilesRecursive(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'z_archive' || entry.name === '.git' || entry.name === 'node_modules') continue;
      readFilesRecursive(fullPath, out);
      continue;
    }
    if (entry.isFile() && /\.md$/i.test(entry.name) && fullPath.includes(`${path.sep}memory${path.sep}`)) {
      out.push(fullPath);
    }
  }
  return out;
}

function extractTriggerCount(content) {
  const yamlBlockMatch = content.match(/```yaml\n([\s\S]*?)\n```/);
  if (!yamlBlockMatch) return 0;
  const yaml = yamlBlockMatch[1];
  const lines = yaml.split('\n');
  let count = 0;
  let inBlock = false;
  for (const line of lines) {
    if (!inBlock && /^trigger_phrases:\s*$/.test(line.trim())) {
      inBlock = true;
      continue;
    }
    if (!inBlock) continue;
    if (/^\s*-\s+/.test(line)) {
      count += 1;
      continue;
    }
    if (line.trim() && !line.trim().startsWith('#')) break;
  }
  return count;
}

const specsRoot = path.join(rootDir, '.opencode', 'specs');
const scanRoot = specFolderArg
  ? path.join(specsRoot, specFolderArg)
  : specsRoot;

const files = readFilesRecursive(scanRoot);
const totals = {
  total: files.length,
  placeholders: 0,
  fallback: 0,
  contamination: 0,
  emptyTriggerPhrases: 0,
};

for (const filePath of files) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (/\[(TBD|Not assessed|N\/A)\]/i.test(content)) totals.placeholders += 1;
  if (fallbackRegex.test(content)) totals.fallback += 1;
  if (contaminationRegex.test(content)) totals.contamination += 1;
  if (extractTriggerCount(content) === 0) totals.emptyTriggerPhrases += 1;
}

const rate = (value) => (totals.total === 0 ? 0 : Number(((value / totals.total) * 100).toFixed(2)));
const output = {
  generatedAt: new Date().toISOString(),
  scope: specFolderArg || 'all-active-specs',
  totalFiles: totals.total,
  rates: {
    placeholderRate: rate(totals.placeholders),
    fallbackRate: rate(totals.fallback),
    contaminationRate: rate(totals.contamination),
    emptyTriggerPhrasesRate: rate(totals.emptyTriggerPhrases),
  },
  counts: totals,
};

console.log(JSON.stringify(output, null, 2));
console.error(`KPI Summary: files=${totals.total}, placeholder=${output.rates.placeholderRate}%, fallback=${output.rates.fallbackRate}%, contamination=${output.rates.contaminationRate}%, empty_trigger=${output.rates.emptyTriggerPhrasesRate}%`);
NODE

# Exit codes:
#   0 - Success
