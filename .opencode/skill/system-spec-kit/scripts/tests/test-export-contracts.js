#!/usr/bin/env node
'use strict';

/**
 * Test: Export Contract Verification
 * Spec: 091-naming-convention-test-suite
 *
 * Covers:
 *   T3 - Export contract verification (handlers, lib, barrels)
 *   T6 - Backward-compat alias verification (snake_case in handler exports)
 *
 * Uses source-level analysis (no require) to avoid DB dependencies.
 */

const fs = require('fs');
const path = require('path');

// ───────────────────────────────────────────────────────────────
// 1. PATHS
// ───────────────────────────────────────────────────────────────
const MCP_ROOT = path.resolve(__dirname, '../../mcp_server');
const SCRIPTS_ROOT = path.resolve(__dirname, '..');
const HANDLERS_DIR = path.join(MCP_ROOT, 'handlers');
const BASE_ROOT = path.resolve(MCP_ROOT, '..');

// ───────────────────────────────────────────────────────────────
// 2. TEST STATE
// ───────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
let skipped = 0;
const failures = [];

function pass(msg) { passed++; console.log(`  \u2713 ${msg}`); }
function fail(msg, detail) {
  failed++;
  failures.push({ msg, detail });
  console.log(`  \u2717 ${msg}`);
  if (detail) console.log(`    ${detail}`);
}
function skip(msg) { skipped++; console.log(`  \u25CB ${msg}`); }
function section(name) { console.log(`\n\u2501\u2501 ${name} ${'\u2501'.repeat(Math.max(0, 56 - name.length))}`); }

function rel(filePath) {
  return path.relative(BASE_ROOT, filePath);
}

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────
function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * Extract exported keys from:
 *  - CJS module.exports = { ... }
 *  - ESM export default { ... }
 *  - ESM named exports: export { a, b as c } [from '...']
 *  - Direct ESM declarations: export function foo() {}
 * Returns array of { key, value, line } objects.
 */
function extractExportKeys(source) {
  const keys = [];
  const lines = source.split('\n');

  // 1) CJS/ESM default object export blocks
  let inExports = false;
  let braceDepth = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/module\.exports\s*=\s*\{/.test(line) || /export\s+default\s*\{/.test(line)) {
      inExports = true;
      braceDepth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      const afterBrace = line.substring(line.indexOf('{') + 1);
      extractKeysFromLine(afterBrace, i, keys);
      continue;
    }

    if (inExports) {
      braceDepth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (braceDepth <= 0) {
        inExports = false;
        continue;
      }

      extractKeysFromLine(line, i, keys);
    }
  }

  // 2) ESM named export blocks (supports multiline and "from" re-export)
  const exportBlockRegex = /export\s*\{([\s\S]*?)\}\s*(?:from\s+['"][^'"]+['"])?\s*;/g;
  for (const match of source.matchAll(exportBlockRegex)) {
    const exportClause = match[1] || '';
    const lineNum = source.slice(0, match.index).split('\n').length;
    extractKeysFromExportClause(exportClause, lineNum, keys);
  }

  // 3) Direct exported declarations
  const directExportRegexes = [
    /export\s+(?:async\s+)?function\s+(\w+)/g,
    /export\s+(?:const|let|var|class)\s+(\w+)/g,
  ];
  for (const regex of directExportRegexes) {
    for (const match of source.matchAll(regex)) {
      const lineNum = source.slice(0, match.index).split('\n').length;
      keys.push({ key: match[1], value: match[1], line: lineNum });
    }
  }

  // Deduplicate noisy duplicates from multiple export forms
  const seen = new Set();
  const deduped = [];
  for (const item of keys) {
    const signature = `${item.key}:${item.value}`;
    if (seen.has(signature)) continue;
    seen.add(signature);
    deduped.push(item);
  }

  return deduped;
}

function extractKeysFromLine(line, lineNum, keys) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('...')) return;

  // Key-value: `handleMemorySearch: handleMemorySearch,`
  const kvMatch = trimmed.match(/^(\w+)\s*:\s*(\w+)\s*,?\s*(?:\/\/.*)?$/);
  if (kvMatch) {
    keys.push({ key: kvMatch[1], value: kvMatch[2], line: lineNum + 1 });
    return;
  }

  // Shorthand: `handleMemorySearch,`
  const shortMatch = trimmed.match(/^(\w+)\s*,?\s*(?:\/\/.*)?$/);
  if (shortMatch) {
    keys.push({ key: shortMatch[1], value: shortMatch[1], line: lineNum + 1 });
  }
}

function extractKeysFromExportClause(exportClause, lineNum, keys) {
  const entries = exportClause
    .split(',')
    .map(entry => entry.replace(/\/\*.*?\*\//g, '').replace(/\/\/.*$/g, '').trim())
    .filter(Boolean);

  for (const entry of entries) {
    const aliasMatch = entry.match(/^(\w+)\s+as\s+(\w+)$/);
    if (aliasMatch) {
      keys.push({ key: aliasMatch[2], value: aliasMatch[1], line: lineNum });
      continue;
    }

    const plainMatch = entry.match(/^(\w+)$/);
    if (plainMatch) {
      keys.push({ key: plainMatch[1], value: plainMatch[1], line: lineNum });
    }
  }
}

// ───────────────────────────────────────────────────────────────
// 4. HANDLER FILES AND EXPECTED MINIMUM HANDLE* FUNCTION COUNTS
// ───────────────────────────────────────────────────────────────
const HANDLER_FILES = [
  { file: 'causal-graph.ts', minHandleFuncs: 3 },
  { file: 'checkpoints.ts', minHandleFuncs: 3 },
  { file: 'memory-context.ts', minHandleFuncs: 1 },
  { file: 'memory-crud.ts', minHandleFuncs: 4 },
  { file: 'memory-index.ts', minHandleFuncs: 1 },
  { file: 'memory-save.ts', minHandleFuncs: 1 },
  { file: 'memory-search.ts', minHandleFuncs: 1 },
  { file: 'memory-triggers.ts', minHandleFuncs: 1 },
  { file: 'session-learning.ts', minHandleFuncs: 3 },
];

// ───────────────────────────────────────────────────────────────
// 5. BARREL FILES AND EXPECTED KEY EXPORTS
// ───────────────────────────────────────────────────────────────
const BARREL_FILES = [
  {
    file: 'scripts/dist/core/index.js',
    root: SCRIPTS_ROOT,
    expectedKeys: [], // config re-exports vary; just check non-empty
    minExports: 1,
  },
  {
    file: 'scripts/dist/extractors/index.js',
    root: SCRIPTS_ROOT,
    expectedKeys: [],
    minExports: 3,
  },
  {
    file: 'scripts/dist/loaders/index.js',
    root: SCRIPTS_ROOT,
    expectedKeys: ['loadCollectedData'],
    minExports: 1,
  },
  {
    file: 'scripts/dist/renderers/index.js',
    root: SCRIPTS_ROOT,
    expectedKeys: ['populateTemplate', 'renderTemplate'],
    minExports: 2,
  },
  {
    file: 'scripts/dist/spec-folder/index.js',
    root: SCRIPTS_ROOT,
    expectedKeys: ['detectSpecFolder', 'setupContextDirectory'],
    minExports: 3,
  },
  {
    file: 'scripts/dist/utils/index.js',
    root: SCRIPTS_ROOT,
    expectedKeys: [],
    minExports: 3,
  },
];

// ════════════════════════════════════════════════════════════════════════
// T3: EXPORT CONTRACT VERIFICATION
// ════════════════════════════════════════════════════════════════════════
function t3ExportContracts() {
  section('T3: Export Contract Verification - Handlers');

  for (const { file, minHandleFuncs } of HANDLER_FILES) {
    const filePath = path.join(HANDLERS_DIR, file);
    if (!fs.existsSync(filePath)) {
      fail(`Handler missing: ${file}`, 'File does not exist');
      continue;
    }

    const source = fs.readFileSync(filePath, 'utf8');
    const exportKeys = extractExportKeys(source);
    const handleKeys = exportKeys.filter(k => /^handle[A-Z]/.test(k.key));

    if (handleKeys.length >= minHandleFuncs) {
      pass(`${file}: ${handleKeys.length} handle* exports (min: ${minHandleFuncs})`);
    } else {
      fail(`${file}: only ${handleKeys.length} handle* exports (expected >= ${minHandleFuncs})`,
        `Found: ${handleKeys.map(k => k.key).join(', ') || 'none'}`);
    }
  }

  // Handler index aggregation (supports both .js and .ts)
  section('T3: Export Contract Verification - Handler Index');
  const indexPathTs = path.join(HANDLERS_DIR, 'index.ts');
  const indexPathJs = path.join(HANDLERS_DIR, 'index.js');
  const indexPath = fs.existsSync(indexPathTs) ? indexPathTs : indexPathJs;
  if (fs.existsSync(indexPath)) {
    const source = fs.readFileSync(indexPath, 'utf8');
    // Support both CJS (require + spread) and ESM (export { } from) patterns
    const hasSpread = /\.\.\./.test(source);
    const requireCount = (source.match(/require\(/g) || []).length;
    const exportFromCount = (source.match(/export\s*\{[^}]*\}\s*from/g) || []).length;
    const aggregationCount = Math.max(requireCount, exportFromCount);
    if (aggregationCount >= HANDLER_FILES.length) {
      pass(`handlers/index: aggregates ${aggregationCount} modules`);
    } else if (hasSpread && requireCount >= HANDLER_FILES.length) {
      pass(`handlers/index: aggregates ${requireCount} modules with spread`);
    } else {
      fail(`handlers/index: incomplete aggregation`,
        `requires: ${requireCount}, export-from: ${exportFromCount}, expected: >= ${HANDLER_FILES.length}`);
    }
  } else {
    fail('handlers/index missing', 'Neither index.ts nor index.js found');
  }

  // Barrel files
  section('T3: Export Contract Verification - Barrels');
  for (const barrel of BARREL_FILES) {
    const filePath = path.resolve(BASE_ROOT, barrel.file);
    if (!fs.existsSync(filePath)) {
      fail(`Barrel missing: ${barrel.file}`, 'File does not exist');
      continue;
    }

    // Try runtime require first (more reliable)
    try {
      const exports = require(filePath);
      const exportCount = Object.keys(exports).length;

      if (exportCount < barrel.minExports) {
        fail(`${barrel.file}: only ${exportCount} exports (expected >= ${barrel.minExports})`,
          `Keys: ${Object.keys(exports).slice(0, 10).join(', ')}`);
        continue;
      }

      // Check specific expected keys
      const missing = barrel.expectedKeys.filter(k => !(k in exports));
      if (missing.length > 0) {
        fail(`${barrel.file}: missing expected exports`, missing.join(', '));
      } else {
        pass(`${barrel.file}: ${exportCount} exports OK`);
      }
    } catch (e) {
      // Fall back to source analysis
      const source = fs.readFileSync(filePath, 'utf8');
      const hasExports = /module\.exports/.test(source) || /exports\./.test(source);
      const requireCount = (source.match(/require\(/g) || []).length;
      if (hasExports && requireCount >= 1) {
        pass(`${barrel.file}: has exports + ${requireCount} requires (source check)`);
      } else {
        fail(`${barrel.file}: no exports found`, `require error: ${e.message.substring(0, 80)}`);
      }
    }
  }
}

// ════════════════════════════════════════════════════════════════════════
// T6: BACKWARD-COMPAT ALIAS VERIFICATION
// ════════════════════════════════════════════════════════════════════════
function t6BackwardCompatAliases() {
  section('T6: Backward-Compat Aliases');

  let totalHandleFuncs = 0;
  let totalAliases = 0;
  let missingAliases = [];

  for (const { file } of HANDLER_FILES) {
    const filePath = path.join(HANDLERS_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    const source = fs.readFileSync(filePath, 'utf8');
    const exportKeys = extractExportKeys(source);

    // Find all camelCase handle* keys
    const camelHandleKeys = exportKeys
      .filter(k => /^handle[A-Z]/.test(k.key))
      .map(k => k.key);
    // Deduplicate
    const uniqueHandleKeys = [...new Set(camelHandleKeys)];

    for (const camelKey of uniqueHandleKeys) {
      totalHandleFuncs++;
      const snakeKey = toSnakeCase(camelKey);

      // Check if snake_case alias exists in exports
      const hasAlias = exportKeys.some(k => k.key === snakeKey);
      if (hasAlias) {
        totalAliases++;
        // Verify alias points to same function.
        // Supports both:
        //   - direct export mapping: handle_x: handleX
        //   - local alias then export shorthand:
        //       Const handle_x = handleX;
        //       Export { handle_x };
        const aliasEntry = exportKeys.find(k => k.key === snakeKey);
        const directMappingOk = aliasEntry && aliasEntry.value === camelKey;
        const localAliasOk = new RegExp(`\\bconst\\s+${snakeKey}\\s*=\\s*${camelKey}\\b`).test(source);

        if (!directMappingOk && !localAliasOk) {
          missingAliases.push(`${file}: ${snakeKey} -> ${aliasEntry.value} (expected -> ${camelKey})`);
        }
      } else {
        missingAliases.push(`${file}: missing alias ${snakeKey} for ${camelKey}`);
      }
    }
  }

  if (missingAliases.length === 0) {
    pass(`All ${totalHandleFuncs} handle* functions have backward-compat aliases (${totalAliases} aliases)`);
  } else {
    fail(`${missingAliases.length} missing/incorrect backward-compat aliases`,
      missingAliases.slice(0, 10).join('\n    '));
  }
}

// ════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════
console.log('\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
console.log('\u2551  Export Contract & Backward-Compat Tests                    \u2551');
console.log('\u2551  Spec: 091-naming-convention-test-suite                     \u2551');
console.log('\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D');

const start = Date.now();

t3ExportContracts();
t6BackwardCompatAliases();

const elapsed = ((Date.now() - start) / 1000).toFixed(1);

console.log('\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
console.log(`  PASSED: ${passed}  |  FAILED: ${failed}  |  SKIPPED: ${skipped}  (${elapsed}s)`);
console.log('\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
if (failures.length > 0) {
  console.log('\nFailure summary:');
  failures.forEach(f => console.log(`  \u2717 ${f.msg}`));
}

process.exit(failed > 0 ? 1 : 0);
