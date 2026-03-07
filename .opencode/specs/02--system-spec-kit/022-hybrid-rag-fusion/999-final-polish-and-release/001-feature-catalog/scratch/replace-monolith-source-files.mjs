#!/usr/bin/env node
/**
 * replace-monolith-source-files.mjs
 *
 * Replaces inline Source Files tables in feature_catalog.md with compact
 * references pointing to the per-feature snippet .md files.
 *
 * Usage: node replace-monolith-source-files.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_DIR = join(__dirname, '..', '..', '..', 'feature-catalog');
const MONOLITH = join(CATALOG_DIR, 'feature_catalog.md');
const DRY_RUN = process.argv.includes('--dry-run');

// ── Step 1: Build snippet title → relative-path map ──────────────────────────

/** @type {Map<string, string>} normalised title → relative path from CATALOG_DIR */
const titleToPath = new Map();

for (const dir of readdirSync(CATALOG_DIR).sort()) {
  const dirPath = join(CATALOG_DIR, dir);
  if (!statSync(dirPath).isDirectory()) continue;
  if (!dir.match(/^\d{2}-/)) continue; // only category dirs like 01-retrieval

  for (const file of readdirSync(dirPath).sort()) {
    if (!file.endsWith('.md')) continue;
    const filePath = join(dirPath, file);
    const firstLine = readFileSync(filePath, 'utf8').split('\n')[0];
    // Extract title from `# Title text`
    const m = firstLine.match(/^#\s+(.+)$/);
    if (!m) continue;
    const title = m[1].trim();
    const relPath = `${dir}/${file}`;
    titleToPath.set(normalise(title), relPath);
  }
}

console.log(`Loaded ${titleToPath.size} snippet titles.`);

// ── Step 2: Parse monolith and replace Source Files sections ──────────────────

const lines = readFileSync(MONOLITH, 'utf8').split('\n');
const out = [];

let i = 0;
let currentFeatureTitle = null;
let replacedCount = 0;
let skippedSpecialCount = 0;

while (i < lines.length) {
  const line = lines[i];

  // Track current ### feature title
  const h3 = line.match(/^### (.+)$/);
  if (h3) {
    currentFeatureTitle = h3[1].trim();
  }

  // Detect #### Source Files
  if (line.match(/^#### Source Files\s*$/)) {
    // Collect all lines of this section until the next heading (###, ##, ####) or EOF
    const sectionStart = i;
    const sectionLines = [line]; // include the heading itself
    i++;

    while (i < lines.length) {
      // Stop at next heading of level #### or higher (##, ###, ####)
      if (lines[i].match(/^#{2,4}\s/)) break;
      sectionLines.push(lines[i]);
      i++;
    }

    // Check if this is a "regular" section (has ##### Implementation table)
    const hasImplTable = sectionLines.some((l) =>
      l.match(/^##### Implementation/),
    );

    if (hasImplTable && currentFeatureTitle) {
      // Find the matching snippet path
      const snippetPath = titleToPath.get(normalise(currentFeatureTitle));

      if (snippetPath) {
        out.push('#### Source Files');
        out.push('');
        out.push(
          `See [\`${snippetPath}\`](${snippetPath}) for full implementation and test file listings.`,
        );
        out.push('');
        replacedCount++;
      } else {
        // No matching snippet — keep original (shouldn't happen)
        console.warn(
          `WARNING: No snippet found for "${currentFeatureTitle}" at line ${sectionStart + 1}`,
        );
        out.push(...sectionLines);
      }
    } else {
      // Special case — keep as-is
      out.push(...sectionLines);
      skippedSpecialCount++;
    }

    continue; // i already points past the section
  }

  out.push(line);
  i++;
}

// ── Step 3: Write output ─────────────────────────────────────────────────────

const result = out.join('\n');
const originalCount = lines.length;
const newCount = out.length;

console.log(`\nResults:`);
console.log(`  Original lines:    ${originalCount}`);
console.log(`  New lines:         ${newCount}`);
console.log(`  Lines removed:     ${originalCount - newCount}`);
console.log(`  Sections replaced: ${replacedCount}`);
console.log(`  Special (kept):    ${skippedSpecialCount}`);
console.log(`  Total:             ${replacedCount + skippedSpecialCount}`);

if (DRY_RUN) {
  console.log('\n[DRY RUN] No file written.');
} else {
  writeFileSync(MONOLITH, result, 'utf8');
  console.log(`\nWrote ${MONOLITH}`);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function normalise(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
