#!/usr/bin/env node
/**
 * One-shot corpus scan: runs validateMemoryTemplateContract against every
 * active memory/*.md file and emits a compliance manifest.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Navigate: scratch/ -> 010-*/ -> 022-*/ -> 02--*/ -> specs/ -> .opencode/
const OPENCODE_ROOT = resolve(__dirname, '..', '..', '..', '..', '..');
const contractPath = join(OPENCODE_ROOT, 'skill', 'system-spec-kit', 'shared', 'dist', 'parsing', 'memory-template-contract.js');
const { validateMemoryTemplateContract } = await import(contractPath);

const SPECS_ROOT = join(OPENCODE_ROOT, 'specs');

function findMemoryFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'quarantine' || entry.name === 'scratch' || entry.name === 'test-suite' || entry.name === 'node_modules') continue;
      results.push(...findMemoryFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md') && dir.endsWith('/memory')) {
      results.push(full);
    }
  }
  return results;
}

const files = findMemoryFiles(SPECS_ROOT);
console.log(`\n=== Memory Template Contract Corpus Scan ===`);
console.log(`Files found: ${files.length}\n`);

let passCount = 0;
let failCount = 0;
const failures = [];
const violationCounts = {};

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  const result = validateMemoryTemplateContract(content);
  const rel = relative(SPECS_ROOT, file);

  if (result.valid) {
    passCount++;
  } else {
    failCount++;
    failures.push({ file: rel, violations: result.violations });
    for (const v of result.violations) {
      violationCounts[v.code] = (violationCounts[v.code] || 0) + 1;
    }
  }
}

console.log(`PASS: ${passCount}/${files.length}`);
console.log(`FAIL: ${failCount}/${files.length}\n`);

if (Object.keys(violationCounts).length > 0) {
  console.log(`--- Violation Summary ---`);
  for (const [code, count] of Object.entries(violationCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${code}: ${count}`);
  }
  console.log();
}

if (failures.length > 0) {
  console.log(`--- Failed Files ---`);
  for (const f of failures) {
    console.log(`\n  ${f.file}`);
    for (const v of f.violations) {
      console.log(`    [${v.code}] ${v.message}${v.sectionId ? ` (${v.sectionId})` : ''}`);
    }
  }
}

console.log(`\n=== Scan Complete ===`);
