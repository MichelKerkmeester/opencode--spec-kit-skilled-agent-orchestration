#!/usr/bin/env node
'use strict';

/**
 * Test: Bug Regression Tests
 * Spec: 091-naming-convention-test-suite
 *
 * Covers:
 *   T5 - 3 specific runtime bugs discovered during naming convention audit
 *
 * Uses source-level analysis (reads file content, checks specific patterns)
 * to verify bugs are fixed without requiring DB or runtime state.
 */

const fs = require('fs');
const path = require('path');

// ───────────────────────────────────────────────────────────────
// 1. PATHS
// ───────────────────────────────────────────────────────────────
const MCP_ROOT = path.resolve(__dirname, '../../mcp_server');
const BASE_ROOT = path.resolve(MCP_ROOT, '..');

// ───────────────────────────────────────────────────────────────
// 2. TEST STATE
// ───────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const failures = [];

function pass(msg) { passed++; console.log(`  \u2713 ${msg}`); }
function fail(msg, detail) {
  failed++;
  failures.push({ msg, detail });
  console.log(`  \u2717 ${msg}`);
  if (detail) console.log(`    ${detail}`);
}
function section(name) { console.log(`\n\u2501\u2501 ${name} ${'\u2501'.repeat(Math.max(0, 56 - name.length))}`); }

// ───────────────────────────────────────────────────────────────
// 3. SOURCE ANALYSIS HELPER
// ───────────────────────────────────────────────────────────────
/**
 * Find lines in a function body that match a pattern.
 * @param {string} source - File source code
 * @param {string} funcName - Function name to search within
 * @param {RegExp} pattern - Pattern to search for
 * @returns {{ found: boolean, lines: Array<{num: number, text: string}> }}
 */
function findInFunction(source, funcName, pattern) {
  const lines = source.split('\n');
  const results = [];
  let inFunc = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect function start (handles: function name(, async function name(, const name = )
    if (!inFunc) {
      if (line.includes(`function ${funcName}`) || line.includes(`${funcName} =`) || line.includes(`${funcName}(`)) {
        inFunc = true;
        braceDepth = 0;
      }
    }

    if (inFunc) {
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;

      if (pattern.test(line)) {
        results.push({ num: i + 1, text: line.trim() });
      }

      if (braceDepth <= 0 && results.length > 0) break;
      if (braceDepth <= 0 && i > 0) { inFunc = false; }
    }
  }

  return { found: results.length > 0, lines: results };
}

/**
 * Search entire file for a pattern, returning matching lines.
 */
function findInFile(source, pattern) {
  const lines = source.split('\n');
  const results = [];
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      results.push({ num: i + 1, text: lines[i].trim() });
    }
  }
  return results;
}

// ════════════════════════════════════════════════════════════════════════
// BUG 1: memory-context.js - normalizedInput
// ════════════════════════════════════════════════════════════════════════
//
// Bug: Line ~259 declares `const normalizedInput = input.trim()`
//      Line ~299 references `normalized_input` (snake_case - ReferenceError)
// Fix: Line ~299 should use `normalizedInput` (camelCase)
//
function testBug1() {
  section('Bug 1: memory-context.js - normalizedInput');

  const filePath = path.join(MCP_ROOT, 'handlers', 'memory-context.ts');
  if (!fs.existsSync(filePath)) {
    fail('memory-context.ts not found', filePath);
    return;
  }

  const source = fs.readFileSync(filePath, 'utf8');

  // Check 1: normalizedInput is declared
  const declaration = findInFile(source, /const\s+normalizedInput\s*=/);
  if (declaration.length > 0) {
    pass(`normalizedInput declared at line ${declaration[0].num}`);
  } else {
    fail('normalizedInput declaration not found',
      'Expected: const normalizedInput = input.trim()');
    return;
  }

  // Check 2: No references to normalized_input (the bug)
  const bugPattern = findInFile(source, /\bnormalized_input\b/);
  // Filter out comments and strings
  const realBugs = bugPattern.filter(l =>
    !l.text.startsWith('//') && !l.text.startsWith('*')
  );

  if (realBugs.length === 0) {
    pass('No references to normalized_input (bug is fixed)');
  } else {
    fail(`${realBugs.length} reference(s) to normalized_input remain`,
      realBugs.map(l => `Line ${l.num}: ${l.text}`).join('\n    '));
  }

  // Check 3: The resume keywords regex uses normalizedInput
  const resumeRegex = findInFile(source, /resume|continue|pick up|where was i/);
  if (resumeRegex.length > 0) {
    const line = resumeRegex[0];
    if (line.text.includes('normalizedInput')) {
      pass(`Resume keywords test uses normalizedInput (line ${line.num})`);
    } else if (line.text.includes('normalized_input')) {
      fail(`Resume keywords test still uses normalized_input (line ${line.num})`, line.text);
    } else {
      pass(`Resume keywords line found at ${line.num} (variable reference unclear)`);
    }
  }
}

// ════════════════════════════════════════════════════════════════════════
// BUG 2: memory-parser.js - causalLinks / causalBlockMatch
// ════════════════════════════════════════════════════════════════════════
//
// Bug: extractCausalLinks function declares `causalLinks` and `causalBlockMatch`
//      But references `causal_links` (line ~348) and `causal_block_match` (line ~351)
// Fix: References should use camelCase versions
//
function testBug2() {
  section('Bug 2: memory-parser.js - causalLinks/causalBlockMatch');

  const filePath = path.join(MCP_ROOT, 'lib', 'parsing', 'memory-parser.ts');
  if (!fs.existsSync(filePath)) {
    fail('memory-parser.ts not found', filePath);
    return;
  }

  const source = fs.readFileSync(filePath, 'utf8');

  // Check 1: causalLinks is declared (camelCase)
  const linksDecl = findInFile(source, /const\s+causalLinks\s*=/);
  if (linksDecl.length > 0) {
    pass(`causalLinks declared at line ${linksDecl[0].num}`);
  } else {
    fail('causalLinks declaration not found', 'Expected: const causalLinks = ...');
  }

  // Check 2: causalBlockMatch is declared (camelCase)
  const blockDecl = findInFile(source, /const\s+causalBlockMatch\s*=/);
  if (blockDecl.length > 0) {
    pass(`causalBlockMatch declared at line ${blockDecl[0].num}`);
  } else {
    fail('causalBlockMatch declaration not found', 'Expected: const causalBlockMatch = ...');
  }

  // Check 3: No references to causal_links (the bug)
  const bugLinks = findInFile(source, /\bcausal_links\b/);
  const realBugLinks = bugLinks.filter(l =>
    !l.text.startsWith('//') && !l.text.startsWith('*') &&
    !l.text.includes("'causal_links'") && !l.text.includes('"causal_links"')
  );
  if (realBugLinks.length === 0) {
    pass('No references to causal_links (bug is fixed)');
  } else {
    fail(`${realBugLinks.length} reference(s) to causal_links remain`,
      realBugLinks.map(l => `Line ${l.num}: ${l.text}`).join('\n    '));
  }

  // Check 4: No references to causal_block_match (the bug)
  const bugBlock = findInFile(source, /\bcausal_block_match\b/);
  const realBugBlock = bugBlock.filter(l =>
    !l.text.startsWith('//') && !l.text.startsWith('*') &&
    !l.text.includes("'causal_block_match'") && !l.text.includes('"causal_block_match"')
  );
  if (realBugBlock.length === 0) {
    pass('No references to causal_block_match (bug is fixed)');
  } else {
    fail(`${realBugBlock.length} reference(s) to causal_block_match remain`,
      realBugBlock.map(l => `Line ${l.num}: ${l.text}`).join('\n    '));
  }
}

// ════════════════════════════════════════════════════════════════════════
// BUG 3: causal-edges.js - stats.source_count
// ════════════════════════════════════════════════════════════════════════
//
// Bug: SQL query returns `COUNT(DISTINCT source_id) as source_count`
//      But JS accesses `stats.sourceCount` (camelCase - always undefined/0)
// Fix: JS should access `stats.source_count` to match SQL alias
//
function testBug3() {
  section('Bug 3: causal-edges.js - stats.source_count');

  const filePath = path.join(MCP_ROOT, 'lib', 'storage', 'causal-edges.ts');
  if (!fs.existsSync(filePath)) {
    fail('causal-edges.ts not found', filePath);
    return;
  }

  const source = fs.readFileSync(filePath, 'utf8');

  // Check 1: SQL counts distinct sources (alias may be 'source_count' or 'count')
  const sqlAlias = findInFile(source, /COUNT\s*\(\s*DISTINCT\s+source_id\s*\)\s*as\s+\w+/i);
  if (sqlAlias.length > 0) {
    pass(`SQL source count query found at line ${sqlAlias[0].num}`);
  } else {
    fail('SQL COUNT(DISTINCT source_id) query not found',
      'Expected: COUNT(DISTINCT source_id) as <alias>');
  }

  // Check 2: Verify no camelCase/snake_case mismatch between SQL alias and JS access
  // The original bug was: SQL returns 'source_count' but JS accesses 'sourceCount'
  // Fix verified: either consistent naming or simplified alias
  const bugAccess = findInFile(source, /stats\.sourceCount\b/);
  if (bugAccess.length === 0) {
    pass('No camelCase stats.sourceCount mismatch (bug is fixed)');
  } else {
    fail(`JS uses stats.sourceCount (camelCase) which may not match SQL alias`,
      `Line ${bugAccess[0].num}: ${bugAccess[0].text}`);
  }

  // Check 3: Verify no other SQL alias mismatches in the same function
  // Common pattern: SQL returns snake_case, JS must access snake_case too
  const sqlAliases = findInFile(source, /\bas\s+([a-z]+_[a-z]+)/);
  const jsAccesses = findInFile(source, /stats\.([a-zA-Z_]+)/);

  // Extract SQL alias names
  const aliasNames = new Set();
  for (const line of sqlAliases) {
    const m = line.text.match(/as\s+([a-z]+(?:_[a-z]+)+)/);
    if (m) aliasNames.add(m[1]);
  }

  // Check each JS stats access uses the SQL alias form
  let mismatchCount = 0;
  for (const line of jsAccesses) {
    const m = line.text.match(/stats\.(\w+)/);
    if (!m) continue;
    const jsKey = m[1];
    // Convert to snake_case to see if there's a matching SQL alias
    const snakeVersion = jsKey.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (aliasNames.has(snakeVersion) && jsKey !== snakeVersion) {
      mismatchCount++;
    }
  }

  if (mismatchCount === 0) {
    pass('All SQL alias/JS property access pairs are consistent');
  } else {
    fail(`${mismatchCount} SQL alias/JS property mismatches found`,
      'JS accesses camelCase but SQL returns snake_case');
  }
}

// ════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════
console.log('\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
console.log('\u2551  Bug Regression Tests                                       \u2551');
console.log('\u2551  Spec: 091-naming-convention-test-suite                     \u2551');
console.log('\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D');

const start = Date.now();

testBug1();
testBug2();
testBug3();

const elapsed = ((Date.now() - start) / 1000).toFixed(1);

console.log('\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
console.log(`  PASSED: ${passed}  |  FAILED: ${failed}  (${elapsed}s)`);
console.log('\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550');
if (failures.length > 0) {
  console.log('\nFailure summary:');
  failures.forEach(f => console.log(`  \u2717 ${f.msg}`));
  console.log('\nNote: These bugs must be fixed during spec 090 migration.');
}

process.exit(failed > 0 ? 1 : 0);
