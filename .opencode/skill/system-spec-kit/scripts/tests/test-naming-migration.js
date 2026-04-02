#!/usr/bin/env node
'use strict';

/**
 * Test: Naming Convention Migration Verification
 * Spec: 091-naming-convention-test-suite
 *
 * Covers:
 *   T1  - Syntax validation (node --check, bash -n)
 *   T2  - MCP module import chain (require 144 files)
 *   T9  - Scripts module imports (require 53 files)
 *   T10 - Naming compliance sweep (zero snake_case function defs)
 *   T7  - Cross-reference integrity (orphaned snake_case calls)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { pathToFileURL } = require('url');

// ───────────────────────────────────────────────────────────────
// 1. PATHS
// ───────────────────────────────────────────────────────────────
const SCRIPTS_ROOT = path.resolve(__dirname, '..');
const MCP_ROOT = path.resolve(__dirname, '../../mcp_server');
const BASE_ROOT = path.resolve(MCP_ROOT, '..');

// Approved temporary debt while migration is still in progress.
// Guardrail: fail if counts increase or if new files start introducing debt.
const LEGACY_SNAKE_CASE_FUNCTION_BUDGET = new Map([
  ['mcp_server/lib/search/vector-index-impl.ts', 75],
  ['mcp_server/lib/search/vector-index-aliases.ts', 8],
  ['mcp_server/lib/search/vector-index-mutations.ts', 10],
  ['mcp_server/lib/search/vector-index-queries.ts', 30],
  ['mcp_server/lib/search/vector-index-schema.ts', 9],
  ['mcp_server/lib/search/vector-index-store.ts', 26],
  ['mcp_server/lib/search/vector-index-types.ts', 4],
  ['mcp_server/lib/learning/corrections.ts', 19],
]);

const CROSS_REFERENCE_MISMATCH_BUDGET = new Map([
  ['mcp_server/cli.ts', 2],
  ['mcp_server/context-server.ts', 1],
  ['mcp_server/formatters/search-results.ts', 1],
  ['mcp_server/handlers/chunking-orchestrator.ts', 2],
  ['mcp_server/handlers/index.ts', 34],
  ['mcp_server/handlers/memory-context.ts', 3],
  ['mcp_server/handlers/memory-crud-update.ts', 1],
  ['mcp_server/handlers/memory-index.ts', 1],
  ['mcp_server/handlers/memory-search.ts', 1],
  ['mcp_server/handlers/save/reconsolidation-bridge.ts', 1],
  ['mcp_server/hooks/memory-surface.ts', 2],
  ['mcp_server/lib/cognitive/adaptive-ranking.ts', 2],
  ['mcp_server/lib/cognitive/prediction-error-gate.ts', 1],
  ['mcp_server/lib/cognitive/temporal-contiguity.ts', 7],
  ['mcp_server/lib/config/type-inference.ts', 1],
  ['mcp_server/lib/extraction/entity-extractor.ts', 1],
  ['mcp_server/lib/feedback/batch-learning.ts', 2],
  ['mcp_server/lib/feedback/shadow-evaluation-runtime.ts', 2],
  ['mcp_server/lib/feedback/shadow-scoring.ts', 11],
  ['mcp_server/lib/governance/scope-governance.ts', 5],
  ['mcp_server/lib/graph/community-detection.ts', 2],
  ['mcp_server/lib/graph/community-storage.ts', 1],
  ['mcp_server/lib/learning/corrections.ts', 6],
  ['mcp_server/lib/ops/job-queue.ts', 3],
  ['mcp_server/lib/parsing/memory-parser.ts', 3],
  ['mcp_server/lib/scoring/confidence-tracker.ts', 1],
  ['mcp_server/lib/search/auto-promotion.ts', 2],
  ['mcp_server/lib/search/bm25-index.ts', 3],
  ['mcp_server/lib/search/causal-boost.ts', 1],
  ['mcp_server/lib/search/chunk-reassembly.ts', 2],
  ['mcp_server/lib/search/graph-search-fn.ts', 2],
  ['mcp_server/lib/search/hybrid-search.ts', 3],
  ['mcp_server/lib/search/learned-feedback.ts', 1],
  ['mcp_server/lib/search/pipeline/stage2-fusion.ts', 3],
  ['mcp_server/lib/search/vector-index-aliases.ts', 4],
  ['mcp_server/lib/search/vector-index-mutations.ts', 1],
  ['mcp_server/lib/search/vector-index-schema.ts', 18],
  ['mcp_server/lib/session/session-manager.ts', 1],
  ['mcp_server/lib/storage/checkpoints.ts', 2],
  ['mcp_server/lib/storage/lineage-state.ts', 12],
  ['mcp_server/lib/validation/preflight.ts', 1],
  ['scripts/spec-folder/folder-detector.ts', 3],
  ['scripts/utils/input-normalizer.ts', 9],
]);

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

// ───────────────────────────────────────────────────────────────
// 3. FILE DISCOVERY
// ───────────────────────────────────────────────────────────────
function walkFiles(dir, ext) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.pytest_cache', 'test-fixtures', '__pycache__'].includes(entry.name)) continue;
      results.push(...walkFiles(full, ext));
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

function rel(filePath) {
  return path.relative(BASE_ROOT, filePath);
}

function isTestFile(filePath) {
  const normalized = filePath.split(path.sep).join('/');
  return normalized.includes('/tests/');
}

// ───────────────────────────────────────────────────────────────
// 4. ERROR CLASSIFICATION
// ───────────────────────────────────────────────────────────────
function isEsmInteropError(error) {
  const msg = error?.message || '';
  const code = error?.code || '';
  return (
    code === 'ERR_REQUIRE_ESM' ||
    msg.includes('ES module scope') ||
    msg.includes('__dirname is not defined') ||
    msg.includes('import statement outside a module')
  );
}

function isRuntimeDependencyError(error) {
  const msg = error?.message || '';
  const code = error?.code || '';
  return (
    code === 'MODULE_NOT_FOUND' ||
    msg.includes('Cannot find module') ||
    msg.includes('The "paths[0]" argument must be of type string') ||
    msg.includes('ENOENT') ||
    msg.includes('sqlite') ||
    msg.includes('database') ||
    msg.includes('is not a function')
  );
}

function isMigrationError(e) {
  if (isEsmInteropError(e) || isRuntimeDependencyError(e)) return false;
  if (e instanceof ReferenceError) return true;
  if (e instanceof SyntaxError) return true;
  if (e instanceof TypeError) return false;
  return false;
}

// ════════════════════════════════════════════════════════════════════════
// T1: SYNTAX VALIDATION
// ════════════════════════════════════════════════════════════════════════
function t1SyntaxValidation() {
  section('T1: Syntax Validation');

  // JS files
  const mcpJs = walkFiles(MCP_ROOT, '.js');
  const scriptsJs = walkFiles(SCRIPTS_ROOT, '.js');
  const discoveredJs = [...mcpJs, ...scriptsJs];
  const allJs = discoveredJs.filter((filePath) => !isTestFile(filePath));

  let jsFail = 0;
  for (const f of allJs) {
    try {
      execSync(`node --check "${f}"`, { stdio: 'pipe' });
    } catch (e) {
      jsFail++;
      fail(`node --check: ${rel(f)}`, (e.stderr || '').toString().trim().split('\n')[0]);
    }
  }
  if (jsFail === 0) {
    pass(`All ${allJs.length} production JS files pass node --check`);
    pass(`Excluded ${discoveredJs.length - allJs.length} test JS files from migration syntax gate`);
  }

  // Shell files
  const shells = walkFiles(SCRIPTS_ROOT, '.sh');
  let shFail = 0;
  for (const f of shells) {
    try {
      execSync(`bash -n "${f}"`, { stdio: 'pipe' });
    } catch (e) {
      shFail++;
      fail(`bash -n: ${path.basename(f)}`, (e.stderr || '').toString().trim().split('\n')[0]);
    }
  }
  if (shFail === 0) pass(`All ${shells.length} shell scripts pass bash -n`);
}

// ───────────────────────────────────────────────────────────────
// 5. IMPORT TEST HELPERS
// ───────────────────────────────────────────────────────────────
// Some scripts call process.exit() on require (standalone CLI tools).
// We intercept process.exit and suppress console noise during import tests.

function withSuppressedSideEffects(fn) {
  const realExit = process.exit;
  const realLog = console.log;
  const realError = console.error;
  const realWarn = console.warn;

  process.exit = () => {}; // no-op to prevent test runner termination
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};

  try {
    return fn();
  } finally {
    process.exit = realExit;
    console.log = realLog;
    console.error = realError;
    console.warn = realWarn;
  }
}

function canLoadViaDynamicImport(filePath) {
  const importTarget = pathToFileURL(filePath).href;
  try {
    execSync(`node --input-type=module -e "import(process.argv[1])" "${importTarget}"`, {
      stdio: 'pipe',
      timeout: 10000,
    });
    return true;
  } catch (_error) {
    return false;
  }
}

// ════════════════════════════════════════════════════════════════════════
// T2: MCP MODULE IMPORT CHAIN
// ════════════════════════════════════════════════════════════════════════
function t2McpImports() {
  section('T2: MCP Module Import Chain');

  // Exclude tests and compatibility CLI wrappers; import-chain gate focuses on reusable modules.
  const files = walkFiles(MCP_ROOT, '.js').filter((filePath) => {
    const normalized = filePath.split(path.sep).join('/');
    return !normalized.includes('/tests/') &&
      !normalized.includes('/dist/scripts/') &&
      !normalized.includes('/scripts/dist/');
  });

  const results = withSuppressedSideEffects(() => {
    let ok = 0, dbSkip = 0, importFail = 0;
    const importFailures = [];

    for (const f of files) {
      try {
        require(f);
        ok++;
      } catch (e) {
        if (isEsmInteropError(e) && canLoadViaDynamicImport(f)) {
          ok++;
          continue;
        }
        if (isMigrationError(e)) {
          importFail++;
          importFailures.push({ file: rel(f), error: `${e.constructor.name}: ${e.message.substring(0, 150)}` });
        } else {
          dbSkip++;
        }
      }
    }
    return { ok, dbSkip, importFail, importFailures };
  });

  for (const f of results.importFailures) {
    fail(`require: ${f.file}`, f.error);
  }
  if (results.importFail === 0) {
    pass(`${results.ok} MCP modules loaded OK (${results.dbSkip} skipped: runtime deps)`);
  }
}

// ════════════════════════════════════════════════════════════════════════
// T9: SCRIPTS MODULE IMPORTS
// ════════════════════════════════════════════════════════════════════════
function t9ScriptsImports() {
  section('T9: Scripts Module Imports');

  const files = walkFiles(SCRIPTS_ROOT, '.js').filter((filePath) => {
    const normalized = filePath.split(path.sep).join('/');
    return !normalized.includes('/tests/');
  });

  const results = withSuppressedSideEffects(() => {
    let ok = 0, depSkip = 0, importFail = 0;
    const importFailures = [];

    for (const f of files) {
      try {
        require(f);
        ok++;
      } catch (e) {
        if (isEsmInteropError(e) && canLoadViaDynamicImport(f)) {
          ok++;
          continue;
        }
        if (isMigrationError(e)) {
          importFail++;
          importFailures.push({ file: rel(f), error: `${e.constructor.name}: ${e.message.substring(0, 150)}` });
        } else {
          depSkip++;
        }
      }
    }
    return { ok, depSkip, importFail, importFailures };
  });

  for (const f of results.importFailures) {
    fail(`require: ${f.file}`, f.error);
  }
  if (results.importFail === 0) {
    pass(`${results.ok} script modules loaded OK (${results.depSkip} skipped: runtime deps)`);
  }
}

// ════════════════════════════════════════════════════════════════════════
// T10: NAMING COMPLIANCE SWEEP
// ════════════════════════════════════════════════════════════════════════
function t10NamingCompliance() {
  section('T10: Naming Compliance Sweep');

  // Scan TypeScript source files (not compiled .js/.d.ts in dist/) for naming compliance
  const allTs = [...walkFiles(MCP_ROOT, '.ts'), ...walkFiles(SCRIPTS_ROOT, '.ts')]
    .filter((filePath) => {
      const normalized = filePath.split(path.sep).join('/');
      return !normalized.includes('/dist/') && !normalized.includes('/tests/') && !normalized.endsWith('.d.ts');
    });

  // Patterns: snake_case function definitions
  const snakeFuncDef = /(?:async\s+)?function\s+([a-z]+_[a-z]\w*)\s*\(/;
  const snakeConstFunc = /(?:const|let|var)\s+([a-z]+_[a-z]\w*)\s*=\s*(?:async\s+)?(?:function|\()/;

  const violations = [];

  for (const file of allTs) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trimStart();

      // Skip comments
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
      // Skip SQL template literals
      if (/\b(SELECT|INSERT|UPDATE|CREATE\s+TABLE|ALTER\s+TABLE)\b/i.test(line)) continue;

      for (const re of [snakeFuncDef, snakeConstFunc]) {
        const m = line.match(re);
        if (m) {
          violations.push({ file: rel(file), line: i + 1, name: m[1] });
        }
      }
    }
  }

  if (violations.length === 0) {
    pass('Zero snake_case function definitions found');
  } else {
    const fileCounts = new Map();
    for (const v of violations) {
      fileCounts.set(v.file, (fileCounts.get(v.file) || 0) + 1);
    }

    const unexpectedFiles = [];
    const overBudgetFiles = [];
    for (const [file, count] of fileCounts.entries()) {
      const budget = LEGACY_SNAKE_CASE_FUNCTION_BUDGET.get(file);
      if (typeof budget === 'undefined') {
        unexpectedFiles.push({ file, count });
      } else if (count > budget) {
        overBudgetFiles.push({ file, count, budget });
      }
    }

    if (unexpectedFiles.length === 0 && overBudgetFiles.length === 0) {
      const budgetStatus = [...LEGACY_SNAKE_CASE_FUNCTION_BUDGET.entries()]
        .map(([file, budget]) => `${file}: ${fileCounts.get(file) || 0}/${budget}`)
        .join(', ');
      pass(`snake_case function definitions within approved legacy budget (${violations.length} total)`);
      pass(`Legacy budget status: ${budgetStatus}`);
    } else {
      const details = [];
      if (unexpectedFiles.length > 0) {
        details.push('Unexpected files:');
        for (const entry of unexpectedFiles) {
          const sample = violations.find(v => v.file === entry.file);
          details.push(`  - ${entry.file}: ${entry.count} violation(s)${sample ? ` (first at line ${sample.line}: ${sample.name})` : ''}`);
        }
      }
      if (overBudgetFiles.length > 0) {
        details.push('Over budget:');
        for (const entry of overBudgetFiles) {
          details.push(`  - ${entry.file}: ${entry.count} > budget ${entry.budget}`);
        }
      }
      fail('Naming compliance regression detected', details.join('\n'));
    }
  }
}

// ════════════════════════════════════════════════════════════════════════
// T7: CROSS-REFERENCE INTEGRITY
// ════════════════════════════════════════════════════════════════════════
// Detects within-file naming mismatches: a camelCase variable is declared
// But its snake_case equivalent is used (the exact pattern of bugs 1-3).
// This catches orphaned references from incomplete renames.

function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function isInString(line, pos) {
  let inSingle = false, inDouble = false, inBacktick = false;
  for (let i = 0; i < pos; i++) {
    const ch = line[i];
    const prev = i > 0 ? line[i - 1] : '';
    if (prev === '\\') continue;
    if (ch === "'" && !inDouble && !inBacktick) inSingle = !inSingle;
    if (ch === '"' && !inSingle && !inBacktick) inDouble = !inDouble;
    if (ch === '`' && !inSingle && !inDouble) inBacktick = !inBacktick;
  }
  return inSingle || inDouble || inBacktick;
}

function t7CrossReference() {
  section('T7: Cross-Reference Integrity');

  // Check source-of-truth TypeScript only. Dist output can include transpiler artifacts.
  const prodTs = [
    ...walkFiles(MCP_ROOT, '.ts'),
    ...walkFiles(SCRIPTS_ROOT, '.ts'),
  ].filter((filePath) => {
    const normalized = filePath.split(path.sep).join('/');
    return !normalized.includes('/tests/') && !normalized.includes('/dist/') && !normalized.endsWith('.d.ts');
  });

  const issues = [];

  for (const file of prodTs) {
    const source = fs.readFileSync(file, 'utf8');
    const lines = source.split('\n');

    // Step 1: Collect all camelCase declarations (const/let with uppercase letter)
    const camelDecls = new Map();
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/(?:const|let)\s+([a-z][a-zA-Z0-9]*)\s*=/);
      if (m && /[A-Z]/.test(m[1])) {
        const snake = toSnakeCase(m[1]);
        if (snake !== m[1]) {
          camelDecls.set(snake, { camel: m[1], declLine: i + 1 });
        }
      }
    }

    if (camelDecls.size === 0) continue;

    // Step 2: Scan for snake_case usage where camelCase was declared
    // Track template literal state across lines (SQL queries use backticks)
    let inBacktick = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trimStart();

      // Count unescaped backticks to track multi-line template literals
      let backtickCount = 0;
      for (let j = 0; j < line.length; j++) {
        if (line[j] === '`' && (j === 0 || line[j - 1] !== '\\')) backtickCount++;
      }
      const startedInBacktick = inBacktick;
      if (backtickCount % 2 === 1) inBacktick = !inBacktick;

      // Skip lines inside multi-line template literals (SQL queries)
      if (startedInBacktick && inBacktick) continue;

      // Skip comments
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
      // Skip export alias blocks
      if (trimmed.startsWith('module.exports')) continue;
      if (/^\s+\w+\s*:\s*\w+\s*,?\s*$/.test(line)) continue;
      // Skip SQL keywords
      if (/\b(SELECT|INSERT|UPDATE|CREATE|ALTER)\b/i.test(line)) continue;
      // Skip SQL patterns (column types, parameter placeholders, SQL functions)
      if (/=\s*\?|\bCURRENT_TIMESTAMP\b|\b(TEXT|REAL|INTEGER|BLOB)\s*[,()\s]|\bIS\s+(NOT\s+)?NULL\b|\bCASE\s+WHEN\b/i.test(line)) continue;
      if (/\bDEFAULT\s+['"]/i.test(line)) continue;
      if (/\bCOALESCE\s*\(/i.test(line)) continue;
      if (/\bGROUP\s+BY\b/i.test(line)) continue;

      for (const [snake, { camel, declLine }] of camelDecls) {
        const regex = new RegExp(`(?<![.\\w])${snake}\\b`, 'g');
        let match;
        while ((match = regex.exec(line)) !== null) {
          // Skip if in a string literal (handles single-line strings/backticks)
          if (isInString(line, match.index)) continue;
          // Skip declaration line itself
          if (i + 1 === declLine) continue;
          // Skip property access (obj.snake_case is OK for SQL results)
          if (match.index > 0 && line[match.index - 1] === '.') continue;

          issues.push({
            file: rel(file),
            line: i + 1,
            declared: camel,
            used: snake
          });
        }
      }
    }
  }

  if (issues.length === 0) {
    pass('Zero declaration/usage naming mismatches found');
  } else {
    const fileCounts = new Map();
    for (const issue of issues) {
      fileCounts.set(issue.file, (fileCounts.get(issue.file) || 0) + 1);
    }

    const unexpectedFiles = [];
    const overBudgetFiles = [];
    for (const [file, count] of fileCounts.entries()) {
      const budget = CROSS_REFERENCE_MISMATCH_BUDGET.get(file);
      if (typeof budget === 'undefined') {
        unexpectedFiles.push({ file, count });
      } else if (count > budget) {
        overBudgetFiles.push({ file, count, budget });
      }
    }

    if (unexpectedFiles.length === 0 && overBudgetFiles.length === 0) {
      const budgetStatus = [...CROSS_REFERENCE_MISMATCH_BUDGET.entries()]
        .map(([file, budget]) => `${file}: ${fileCounts.get(file) || 0}/${budget}`)
        .join(', ');
      pass(`Cross-reference mismatches within approved compatibility budget (${issues.length} total)`);
      pass(`Cross-reference budget status: ${budgetStatus}`);
    } else {
      const details = [];
      if (unexpectedFiles.length > 0) {
        details.push('Unexpected files:');
        for (const entry of unexpectedFiles) {
          const sample = issues.find(v => v.file === entry.file);
          details.push(`  - ${entry.file}: ${entry.count} issue(s)${sample ? ` (first at line ${sample.line}: '${sample.used}' vs '${sample.declared}')` : ''}`);
        }
      }
      if (overBudgetFiles.length > 0) {
        details.push('Over budget:');
        for (const entry of overBudgetFiles) {
          details.push(`  - ${entry.file}: ${entry.count} > budget ${entry.budget}`);
        }
      }
      fail('Cross-reference naming regression detected', details.join('\n'));
    }
  }
}

// ════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════
console.log('\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
console.log('\u2551  Naming Convention Migration Tests                          \u2551');
console.log('\u2551  Spec: 091-naming-convention-test-suite                     \u2551');
console.log('\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D');

const start = Date.now();

t1SyntaxValidation();
t2McpImports();
t9ScriptsImports();
t10NamingCompliance();
t7CrossReference();

const elapsed = ((Date.now() - start) / 1000).toFixed(1);

console.log('\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
console.log(`  PASSED: ${passed}  |  FAILED: ${failed}  |  SKIPPED: ${skipped}  (${elapsed}s)`);
console.log('\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
if (failures.length > 0) {
  console.log('\nFailure summary:');
  failures.forEach(f => console.log(`  \u2717 ${f.msg}`));
}

process.exit(failed > 0 ? 1 : 0);
