#!/usr/bin/env node
/**
 * Test Suite: Template Preprocessor
 *
 * Tests for lib/expansion/preprocessor.js
 * Run with: node test-preprocessor.js
 */

const path = require('path');
const fs = require('fs');
const preprocessor = require('../../../../.opencode/skill/system-spec-kit/lib/expansion/preprocessor');

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failed++;
    failures.push({ name, error: error.message });
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function assertType(actual, type, message) {
  if (typeof actual !== type) {
    throw new Error(`${message}: expected type ${type}, got ${typeof actual}`);
  }
}

function assertThrows(fn, message) {
  let threw = false;
  try {
    fn();
  } catch (e) {
    threw = true;
  }
  if (!threw) {
    throw new Error(`${message}: expected function to throw`);
  }
}

console.log('\n=== Preprocessor Tests ===\n');

// Test: loadTemplate
console.log('loadTemplate:');

test('throws for non-existent file', () => {
  assertThrows(
    () => preprocessor.loadTemplate('/nonexistent/path/file.md'),
    'Should throw for non-existent file'
  );
});

test('throws for empty path', () => {
  assertThrows(
    () => preprocessor.loadTemplate(''),
    'Should throw for empty path'
  );
});

test('throws for null path', () => {
  assertThrows(
    () => preprocessor.loadTemplate(null),
    'Should throw for null path'
  );
});

test('loads existing template', () => {
  const templatesDir = path.join(__dirname, '../../../../.opencode/skill/system-spec-kit/templates');
  const specTemplate = path.join(templatesDir, 'spec.md');
  if (fs.existsSync(specTemplate)) {
    const content = preprocessor.loadTemplate(specTemplate);
    assertType(content, 'string', 'Should return string');
    assertEqual(content.length > 0, true, 'Should have content');
  } else {
    console.log('    (skipped - template not found)');
    passed--; // Don't count as passed
  }
});

// Test: preprocess
console.log('\npreprocess:');

test('throws for non-string content', () => {
  assertThrows(
    () => preprocessor.preprocess(123, { level: '2' }),
    'Should throw for number input'
  );
  assertThrows(
    () => preprocessor.preprocess(null, { level: '2' }),
    'Should throw for null input'
  );
});

test('handles empty content', () => {
  const result = preprocessor.preprocess('', { level: '2' });
  assertType(result.content, 'string', 'Should return string content');
  assertEqual(result.content, '', 'Should return empty string');
});

test('returns content without markers unchanged', () => {
  const content = 'Simple content without markers';
  const result = preprocessor.preprocess(content, { level: '2' });
  assertEqual(result.content.trim(), content, 'Content should be unchanged');
});

test('processes COMPLEXITY_GATE markers for Level 2', () => {
  const content = `Before
<!-- COMPLEXITY_GATE: level>=2 -->
Level 2 content
<!-- /COMPLEXITY_GATE -->
<!-- COMPLEXITY_GATE: level>=3 -->
Level 3 content
<!-- /COMPLEXITY_GATE -->
After`;

  const result = preprocessor.preprocess(content, { level: '2' });
  assertEqual(result.content.includes('Level 2 content'), true, 'Should include Level 2');
  assertEqual(result.content.includes('Level 3 content'), false, 'Should exclude Level 3');
});

test('processes COMPLEXITY_GATE markers for Level 3', () => {
  const content = `Before
<!-- COMPLEXITY_GATE: level>=2 -->
Level 2 content
<!-- /COMPLEXITY_GATE -->
<!-- COMPLEXITY_GATE: level>=3 -->
Level 3 content
<!-- /COMPLEXITY_GATE -->
After`;

  const result = preprocessor.preprocess(content, { level: '3' });
  assertEqual(result.content.includes('Level 2 content'), true, 'Should include Level 2');
  assertEqual(result.content.includes('Level 3 content'), true, 'Should include Level 3');
});

test('handles null context', () => {
  const result = preprocessor.preprocess('Content', null);
  assertType(result.content, 'string', 'Should return string');
});

test('handles empty context', () => {
  const result = preprocessor.preprocess('Content', {});
  assertType(result.content, 'string', 'Should return string');
});

test('warns for invalid level', () => {
  // Just ensure it doesn't throw
  const result = preprocessor.preprocess('Content', { level: 'invalid' });
  assertType(result.content, 'string', 'Should return string');
});

test('returns stats in result', () => {
  const content = `<!-- COMPLEXITY_GATE: level>=2 -->A<!-- /COMPLEXITY_GATE -->`;
  const result = preprocessor.preprocess(content, { level: '2' });
  assertEqual('stats' in result, true, 'Should have stats');
  assertType(result.stats.totalBlocks, 'number', 'Should have totalBlocks');
});

test('returns validation in result', () => {
  const result = preprocessor.preprocess('Content', { level: '2' });
  assertEqual('validation' in result, true, 'Should have validation');
  assertEqual('valid' in result.validation, true, 'Should have valid flag');
});

// Test: expand
console.log('\nexpand:');

test('expand loads and processes template', () => {
  const templatesDir = path.join(__dirname, '../../../../.opencode/skill/system-spec-kit/templates');
  const specTemplate = path.join(templatesDir, 'spec.md');
  if (fs.existsSync(specTemplate)) {
    const result = preprocessor.expand(specTemplate, { level: '2' });
    assertType(result.content, 'string', 'Should return string content');
    assertEqual(result.templateName, 'spec.md', 'Should have templateName');
    assertEqual(result.level, '2', 'Should have level');
  } else {
    console.log('    (skipped - template not found)');
  }
});

test('expand accepts level option', () => {
  const templatesDir = path.join(__dirname, '../../../../.opencode/skill/system-spec-kit/templates');
  const specTemplate = path.join(templatesDir, 'spec.md');
  if (fs.existsSync(specTemplate)) {
    const result = preprocessor.expand(specTemplate, { level: '3' });
    assertEqual(result.level, '3', 'Should use provided level');
  } else {
    console.log('    (skipped - template not found)');
  }
});

// Test: injectComplexityMetadata
console.log('\ninjectComplexityMetadata:');

test('returns content unchanged when no complexityScore', () => {
  const content = 'Original content';
  const result = preprocessor.injectComplexityMetadata(content, { level: '2' });
  assertEqual(result, content, 'Should return unchanged content');
});

test('returns content unchanged when complexityScore is null', () => {
  const content = 'Original content';
  const result = preprocessor.injectComplexityMetadata(content, { level: '2', complexityScore: null });
  assertEqual(result, content, 'Should return unchanged content');
});

test('injects metadata when complexityScore provided', () => {
  const content = 'Before\n### Stakeholders\nAfter';
  const context = {
    level: '2',
    complexityScore: 52,
    breakdown: {
      scope: { weightedScore: 10, weight: 25, triggers: ['files'] },
      risk: { weightedScore: 15, weight: 25, triggers: ['auth'] },
      research: { weightedScore: 5, weight: 20, triggers: [] },
      multiAgent: { weightedScore: 0, weight: 15, triggers: [] },
      coordination: { weightedScore: 8, weight: 15, triggers: ['deps'] }
    }
  };
  const result = preprocessor.injectComplexityMetadata(content, context);
  assertEqual(result.includes('Complexity Assessment'), true, 'Should inject assessment');
  assertEqual(result.includes('52/100'), true, 'Should include score');
});

// Test: INJECTION_POINTS constant
console.log('\nINJECTION_POINTS:');

test('has spec.md injection points', () => {
  assertEqual('spec.md' in preprocessor.INJECTION_POINTS, true, 'Should have spec.md');
});

test('has plan.md injection points', () => {
  assertEqual('plan.md' in preprocessor.INJECTION_POINTS, true, 'Should have plan.md');
});

test('has tasks.md injection points', () => {
  assertEqual('tasks.md' in preprocessor.INJECTION_POINTS, true, 'Should have tasks.md');
});

test('has checklist.md injection points', () => {
  assertEqual('checklist.md' in preprocessor.INJECTION_POINTS, true, 'Should have checklist.md');
});

// Test: Edge Cases
console.log('\nEdge Cases:');

test('handles content with special characters', () => {
  const content = '<!-- COMPLEXITY_GATE: level>=2 -->Content with <tags> & "quotes"<!-- /COMPLEXITY_GATE -->';
  const result = preprocessor.preprocess(content, { level: '2' });
  assertEqual(result.content.includes('<tags>'), true, 'Should preserve special chars');
});

test('handles deeply nested content', () => {
  const content = `
<!-- COMPLEXITY_GATE: level>=1 -->
Level 1
<!-- COMPLEXITY_GATE: level>=2 -->
Level 2
<!-- /COMPLEXITY_GATE -->
<!-- /COMPLEXITY_GATE -->
`;
  // Note: Nested markers are not officially supported, but shouldn't crash
  const result = preprocessor.preprocess(content, { level: '2' });
  assertType(result.content, 'string', 'Should handle nested markers');
});

test('handles markers with extra whitespace', () => {
  const content = `<!--   COMPLEXITY_GATE:   level>=2   -->Content<!--   /COMPLEXITY_GATE   -->`;
  const result = preprocessor.preprocess(content, { level: '2' });
  assertEqual(result.content.includes('Content'), true, 'Should handle extra whitespace');
});

// Summary
console.log('\n=== Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failures.length > 0) {
  console.log('\nFailures:');
  for (const f of failures) {
    console.log(`  - ${f.name}: ${f.error}`);
  }
}

process.exit(failed > 0 ? 1 : 0);
