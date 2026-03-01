#!/usr/bin/env node
/**
 * Runtime Test: Anchor System (MCP Server)
 *
 * Tests the extract_anchors() function on real memory files to verify:
 * 1. Anchor extraction works on production-format memory files
 * 2. Complex anchor IDs (with slashes, hyphens) are handled
 * 3. Token savings calculations are accurate
 * 4. Edge cases (nested, broken) are handled gracefully
 *
 * @created 2026-01-15
 * @spec 065-anchor-system-implementation
 */

'use strict';

const path = require('path');
const fs = require('fs');

// Load the memory-parser module
const PARSER_PATH = path.join(__dirname, '../../../../.opencode/skill/system-spec-kit/mcp_server/lib/memory-parser.js');
const parser = require(PARSER_PATH);

// Test configuration
const SPEC_ROOT = path.join(__dirname, '..');
const TEST_RESULTS = [];

// Simple token estimation (characters / 4)
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

// Test runner
function runTest(name, fn) {
  const start = Date.now();
  try {
    const result = fn();
    const duration = Date.now() - start;
    TEST_RESULTS.push({ name, status: 'PASS', duration, result });
    console.log(`  [PASS] ${name} (${duration}ms)`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    TEST_RESULTS.push({ name, status: 'FAIL', duration, error: error.message });
    console.log(`  [FAIL] ${name} (${duration}ms)`);
    console.log(`         Error: ${error.message}`);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// TEST SUITE 1: Fixture File Tests
// ═══════════════════════════════════════════════════════════════════════

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  ANCHOR SYSTEM RUNTIME TESTS                                ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('═══ TEST SUITE 1: Fixture File Tests ═══\n');

const fixtureFile = path.join(SPEC_ROOT, 'scratch/fixture-memory.md');
let fixtureContent = '';

runTest('Load fixture file', () => {
  if (!fs.existsSync(fixtureFile)) {
    throw new Error(`Fixture not found: ${fixtureFile}`);
  }
  fixtureContent = fs.readFileSync(fixtureFile, 'utf-8');
  return { size: fixtureContent.length };
});

runTest('Extract anchors from fixture', () => {
  const anchors = parser.extractAnchors(fixtureContent);
  const anchorIds = Object.keys(anchors);

  // Expected: summary, details, nested-parent, nested-child (broken has no closing tag)
  if (anchorIds.length !== 4) {
    throw new Error(`Expected 4 anchors, got ${anchorIds.length}: ${anchorIds.join(', ')}`);
  }

  const expected = ['summary', 'details', 'nested-parent', 'nested-child'];
  for (const id of expected) {
    if (!anchors[id]) {
      throw new Error(`Missing expected anchor: ${id}`);
    }
  }

  return { anchorIds, anchorCount: anchorIds.length };
});

runTest('Verify anchor content extraction', () => {
  const anchors = parser.extractAnchors(fixtureContent);

  // Check summary content
  if (!anchors.summary.includes('Session Summary')) {
    throw new Error('summary anchor missing expected content');
  }

  // Check nested-child is independent
  if (!anchors['nested-child'].includes('Child Section')) {
    throw new Error('nested-child anchor missing expected content');
  }

  // Check nested-parent contains but is larger
  if (anchors['nested-parent'].length <= anchors['nested-child'].length) {
    throw new Error('nested-parent should be larger than nested-child');
  }

  return { verified: true };
});

runTest('Validate broken anchor handling', () => {
  const anchors = parser.extractAnchors(fixtureContent);

  // 'broken' anchor should NOT be in results (no closing tag)
  if (anchors.broken) {
    throw new Error('Broken anchor should not be extracted');
  }

  // Validation function should warn about it
  const validation = parser.validateAnchors(fixtureContent);
  if (validation.valid) {
    throw new Error('Validation should fail for unclosed anchor');
  }
  if (!validation.unclosedAnchors.includes('broken')) {
    throw new Error('Validation should report "broken" as unclosed');
  }

  return { unclosedDetected: true, warnings: validation.warnings };
});

// ═══════════════════════════════════════════════════════════════════════
// TEST SUITE 2: Real Memory File Tests
// ═══════════════════════════════════════════════════════════════════════

console.log('\n═══ TEST SUITE 2: Real Memory File Tests ═══\n');

const memoryDir = path.join(SPEC_ROOT, 'memory');
let realMemoryFiles = [];

runTest('Find real memory files', () => {
  if (!fs.existsSync(memoryDir)) {
    throw new Error(`Memory directory not found: ${memoryDir}`);
  }

  realMemoryFiles = fs.readdirSync(memoryDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(memoryDir, f));

  if (realMemoryFiles.length === 0) {
    throw new Error('No memory files found');
  }

  return { fileCount: realMemoryFiles.length, files: realMemoryFiles.map(f => path.basename(f)) };
});

runTest('Extract anchors from real memory file', () => {
  const memoryFile = realMemoryFiles[0];
  const content = fs.readFileSync(memoryFile, 'utf-8');
  const anchors = parser.extractAnchors(content);
  const anchorIds = Object.keys(anchors);

  // Check what anchor tags exist in the file
  const anchorTagPattern = /<!--\s*(?:ANCHOR|anchor):\s*([^>\s]+)\s*-->/gi;
  const foundTags = [];
  let match;
  while ((match = anchorTagPattern.exec(content)) !== null) {
    foundTags.push(match[1]);
  }

  // BUG DETECTION: If tags exist but no anchors extracted, regex pattern is too restrictive
  if (foundTags.length > 0 && anchorIds.length === 0) {
    const hasSlash = foundTags.some(t => t.includes('/'));
    throw new Error(
      `BUG DETECTED: Found ${foundTags.length} anchor tags but extractAnchors() returned 0.\n` +
      `         Tags contain slashes: ${hasSlash}\n` +
      `         Sample tag: ${foundTags[0]}\n` +
      `         Regex pattern [a-zA-Z0-9-]+ does not match IDs with forward slashes.`
    );
  }

  if (anchorIds.length === 0) {
    throw new Error('No anchors found in memory file');
  }

  return {
    file: path.basename(memoryFile),
    anchorCount: anchorIds.length,
    anchorIds: anchorIds.map(id => id.slice(0, 50) + (id.length > 50 ? '...' : ''))
  };
});

runTest('Verify complex anchor ID handling', () => {
  const memoryFile = realMemoryFiles[0];
  const content = fs.readFileSync(memoryFile, 'utf-8');
  const anchors = parser.extractAnchors(content);

  // Real memory files have IDs with slashes like:
  // summary-session-xxx-003-memory-and-spec-kit/065-anchor-system-implementation
  const complexIds = Object.keys(anchors).filter(id => id.includes('/') || id.includes('-'));

  if (complexIds.length === 0) {
    // If no complex IDs, check for any IDs with hyphens
    const hyphenIds = Object.keys(anchors).filter(id => id.includes('-'));
    if (hyphenIds.length === 0) {
      throw new Error('Expected complex anchor IDs with hyphens');
    }
  }

  return { complexIdCount: complexIds.length };
});

// ═══════════════════════════════════════════════════════════════════════
// TEST SUITE 3: Token Savings Calculation
// ═══════════════════════════════════════════════════════════════════════

console.log('\n═══ TEST SUITE 3: Token Savings Calculation ═══\n');

runTest('Calculate token savings with anchor filtering', () => {
  const memoryFile = realMemoryFiles[0];
  const content = fs.readFileSync(memoryFile, 'utf-8');
  const anchors = parser.extractAnchors(content);
  const anchorIds = Object.keys(anchors);

  if (anchorIds.length < 2) {
    throw new Error('Need at least 2 anchors for meaningful test');
  }

  // Calculate original tokens
  const originalTokens = estimateTokens(content);

  // Simulate requesting only first anchor (like memory_search with anchors param)
  const requestedAnchorId = anchorIds[0];
  const filteredContent = anchors[requestedAnchorId];
  const filteredTokens = estimateTokens(filteredContent);

  // Calculate savings
  const savings = ((originalTokens - filteredTokens) / originalTokens * 100).toFixed(1);

  return {
    originalTokens,
    filteredTokens,
    savingsPercent: savings,
    anchorUsed: requestedAnchorId.slice(0, 40) + '...'
  };
});

runTest('Calculate multi-anchor selection savings', () => {
  const memoryFile = realMemoryFiles[0];
  const content = fs.readFileSync(memoryFile, 'utf-8');
  const anchors = parser.extractAnchors(content);
  const anchorIds = Object.keys(anchors);

  if (anchorIds.length < 2) {
    throw new Error('Need at least 2 anchors for meaningful test');
  }

  const originalTokens = estimateTokens(content);

  // Select half the anchors
  const selectedIds = anchorIds.slice(0, Math.ceil(anchorIds.length / 2));
  const combinedContent = selectedIds.map(id => anchors[id]).join('\n\n---\n\n');
  const combinedTokens = estimateTokens(combinedContent);

  const savings = ((originalTokens - combinedTokens) / originalTokens * 100).toFixed(1);

  return {
    originalTokens,
    selectedAnchors: selectedIds.length,
    totalAnchors: anchorIds.length,
    combinedTokens,
    savingsPercent: savings
  };
});

// ═══════════════════════════════════════════════════════════════════════
// TEST SUITE 4: Edge Case Tests
// ═══════════════════════════════════════════════════════════════════════

console.log('\n═══ TEST SUITE 4: Edge Case Tests ═══\n');

runTest('Case-insensitive anchor matching', () => {
  const testContent = `
<!-- anchor:lowercase -->
Lowercase anchor content
<!-- /anchor:lowercase -->

<!-- ANCHOR:UPPERCASE -->
Uppercase anchor content
<!-- /ANCHOR:UPPERCASE -->

<!-- Anchor:MixedCase -->
Mixed case anchor content
<!-- /Anchor:MixedCase -->
`;

  const anchors = parser.extractAnchors(testContent);
  const ids = Object.keys(anchors);

  if (ids.length !== 3) {
    throw new Error(`Expected 3 anchors, got ${ids.length}`);
  }

  return { anchorIds: ids, caseInsensitive: true };
});

runTest('Anchor with special content (code blocks)', () => {
  const testContent = `
<!-- ANCHOR:code-example -->
\`\`\`javascript
function test() {
  return "Hello World";
}
\`\`\`
<!-- /ANCHOR:code-example -->
`;

  const anchors = parser.extractAnchors(testContent);

  if (!anchors['code-example']) {
    throw new Error('Failed to extract anchor with code block');
  }

  if (!anchors['code-example'].includes('function test()')) {
    throw new Error('Code block content not preserved');
  }

  return { contentPreserved: true };
});

runTest('Empty content handling', () => {
  const anchors = parser.extractAnchors('');

  if (Object.keys(anchors).length !== 0) {
    throw new Error('Expected empty result for empty content');
  }

  return { emptyHandled: true };
});

runTest('Content without anchors', () => {
  const testContent = `
# Regular Markdown

This is just regular content without any anchors.

## Section 2

More content here.
`;

  const anchors = parser.extractAnchors(testContent);

  if (Object.keys(anchors).length !== 0) {
    throw new Error('Expected empty result for content without anchors');
  }

  return { noAnchorsHandled: true };
});

// ═══════════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════════

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  TEST SUMMARY                                               ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

const passed = TEST_RESULTS.filter(t => t.status === 'PASS').length;
const failed = TEST_RESULTS.filter(t => t.status === 'FAIL').length;
const total = TEST_RESULTS.length;

console.log(`Total Tests: ${total}`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log(`  Pass Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

// Print detailed results
console.log('Detailed Results:');
console.log('─'.repeat(60));

TEST_RESULTS.forEach(test => {
  const icon = test.status === 'PASS' ? '✓' : '✗';
  console.log(`${icon} ${test.name}`);
  if (test.status === 'PASS' && test.result) {
    const resultStr = JSON.stringify(test.result, null, 2)
      .split('\n')
      .map(line => '    ' + line)
      .join('\n');
    console.log(resultStr);
  }
  if (test.status === 'FAIL') {
    console.log(`    Error: ${test.error}`);
  }
});

console.log('\n' + '═'.repeat(60));
console.log(failed === 0 ? '✓ ALL TESTS PASSED' : `✗ ${failed} TEST(S) FAILED`);
console.log('═'.repeat(60) + '\n');

// Exit with appropriate code
process.exit(failed > 0 ? 1 : 0);
