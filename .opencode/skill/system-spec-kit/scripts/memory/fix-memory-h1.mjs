#!/usr/bin/env node
// One-shot repair script: Fix H1 headings in all memory files.
//
// For each .md file under .opencode/specs/**/memory/ -
//   1. Extract the slug from the filename (everything after __, before .md)
//   2. Convert slug to title case
//   3. Replace existing H1 (or insert one if missing) with the title-cased slug
//   4. Ensure a blank line exists between closing --- and # H1
//
// Usage: node fix-memory-h1.mjs [--dry-run]

import fs from 'node:fs';
import path from 'node:path';

const SPECS_ROOT = path.resolve(import.meta.dirname, '..', '..', '..', '..', 'specs');
const DRY_RUN = process.argv.includes('--dry-run');

function slugToTitle(slug) {
  return slug
    .replace(/(?<=\d)-(?=\d)/g, '\x00')   // protect digit-digit hyphens (dates like 2026-03-13)
    .replace(/-/g, ' ')
    .replace(/\x00/g, '-')                 // restore digit-digit hyphens
    .replace(/\s{2,}/g, ' ')              // collapse consecutive spaces
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function extractSlugFromFilename(filename) {
  const stem = path.basename(filename, '.md');
  const doubleUnderIdx = stem.indexOf('__');
  if (doubleUnderIdx === -1) return null;
  return stem.slice(doubleUnderIdx + 2);
}

function findMemoryFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'quarantine' || entry.name === 'scratch') continue;
      results.push(...findMemoryFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md') && path.basename(path.dirname(full)) === 'memory') {
      results.push(full);
    }
  }
  return results;
}

function fixFile(filePath) {
  const slug = extractSlugFromFilename(filePath);
  if (!slug) {
    return { path: filePath, status: 'skipped', reason: 'no slug in filename' };
  }

  const title = slugToTitle(slug);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Parse frontmatter
  const fmMatch = content.match(/^(---\r?\n[\s\S]*?\r?\n---)([\s\S]*)$/);
  if (!fmMatch) {
    return { path: filePath, status: 'skipped', reason: 'no frontmatter' };
  }

  const frontmatter = fmMatch[1];
  let body = fmMatch[2];

  // Remove existing H1 if present (with or without blank line before it)
  body = body.replace(/^\s*#\s+[^\n]*\n?/, '');

  // Ensure body starts with a blank line, then H1, then blank line
  body = body.replace(/^\n*/, '');
  const newBody = `\n\n# ${title}\n\n${body}`;

  const newContent = frontmatter + newBody;

  if (newContent === content) {
    return { path: filePath, status: 'unchanged' };
  }

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }

  return { path: filePath, status: 'fixed', title };
}

// Main
const files = findMemoryFiles(SPECS_ROOT);
console.log(`Found ${files.length} memory files under ${SPECS_ROOT}`);
if (DRY_RUN) console.log('DRY RUN — no files will be modified\n');

let fixed = 0;
let unchanged = 0;
let skipped = 0;

for (const f of files) {
  const result = fixFile(f);
  if (result.status === 'fixed') {
    fixed++;
    console.log(`  FIXED: ${path.relative(SPECS_ROOT, result.path)} → # ${result.title}`);
  } else if (result.status === 'unchanged') {
    unchanged++;
  } else {
    skipped++;
    console.log(`  SKIP:  ${path.relative(SPECS_ROOT, result.path)} (${result.reason})`);
  }
}

console.log(`\nDone: ${fixed} fixed, ${unchanged} unchanged, ${skipped} skipped`);
