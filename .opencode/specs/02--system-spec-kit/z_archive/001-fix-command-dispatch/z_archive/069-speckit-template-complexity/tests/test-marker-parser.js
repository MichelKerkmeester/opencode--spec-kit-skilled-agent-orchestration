#!/usr/bin/env node
/**
 * Test Suite: Marker Parser
 *
 * Tests for lib/expansion/marker-parser.js
 * Run with: node test-marker-parser.js
 */

const markerParser = require('../../../../.opencode/skill/system-spec-kit/lib/expansion/marker-parser');

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

function assertDeepEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

console.log('\n=== Marker Parser Tests ===\n');

// Test: parseConditions
console.log('parseConditions:');

test('parses level>=2 condition', () => {
  const result = markerParser.parseConditions('level>=2');
  assertEqual(result.minLevel, '2', 'Should extract min level');
});

test('parses level>=3+ condition', () => {
  const result = markerParser.parseConditions('level>=3+');
  assertEqual(result.minLevel, '3+', 'Should extract 3+ as min level');
});

test('parses level<=3 condition', () => {
  const result = markerParser.parseConditions('level<=3');
  assertEqual(result.maxLevel, '3', 'Should extract max level');
});

test('parses feature=ai-protocol condition', () => {
  const result = markerParser.parseConditions('feature=ai-protocol');
  assertEqual(result.feature, 'ai-protocol', 'Should extract feature');
});

test('parses specType=research condition', () => {
  const result = markerParser.parseConditions('specType=research');
  assertEqual(result.specType, 'research', 'Should extract specType');
});

test('parses combined conditions', () => {
  const result = markerParser.parseConditions('level>=3, feature=ai-protocol');
  assertEqual(result.minLevel, '3', 'Should extract min level');
  assertEqual(result.feature, 'ai-protocol', 'Should extract feature');
});

test('handles empty string', () => {
  const result = markerParser.parseConditions('');
  assertEqual(result.raw, '', 'Should return empty raw');
  assertEqual(result.minLevel, null, 'Should have null minLevel');
});

test('handles null input', () => {
  const result = markerParser.parseConditions(null);
  assertEqual(result.raw, '', 'Should return empty raw');
});

test('handles undefined input', () => {
  const result = markerParser.parseConditions(undefined);
  assertEqual(result.raw, '', 'Should return empty raw');
});

// Test: evaluateConditions
console.log('\nevaluateConditions:');

test('level>=2 includes for level 2', () => {
  const conditions = markerParser.parseConditions('level>=2');
  const result = markerParser.evaluateConditions(conditions, { level: '2' });
  assertEqual(result.include, true, 'Level 2 should be included');
});

test('level>=2 includes for level 3', () => {
  const conditions = markerParser.parseConditions('level>=2');
  const result = markerParser.evaluateConditions(conditions, { level: '3' });
  assertEqual(result.include, true, 'Level 3 should be included');
});

test('level>=3 excludes for level 2', () => {
  const conditions = markerParser.parseConditions('level>=3');
  const result = markerParser.evaluateConditions(conditions, { level: '2' });
  assertEqual(result.include, false, 'Level 2 should be excluded');
});

test('level>=3+ includes for level 3+', () => {
  const conditions = markerParser.parseConditions('level>=3+');
  const result = markerParser.evaluateConditions(conditions, { level: '3+' });
  assertEqual(result.include, true, 'Level 3+ should be included');
});

test('evaluates default context correctly', () => {
  const conditions = markerParser.parseConditions('level>=1');
  const result = markerParser.evaluateConditions(conditions, {});
  assertEqual(result.include, true, 'Default level should be 1');
});

// Test: findBlocks
console.log('\nfindBlocks:');

test('finds single block', () => {
  const template = `
Some content
<!-- COMPLEXITY_GATE: level>=2 -->
Conditional content
<!-- /COMPLEXITY_GATE -->
More content
`;
  const blocks = markerParser.findBlocks(template);
  assertEqual(blocks.length, 1, 'Should find one block');
  assertEqual(blocks[0].conditions.minLevel, '2', 'Should have correct condition');
});

test('finds multiple blocks', () => {
  const template = `
<!-- COMPLEXITY_GATE: level>=2 -->
Block 1
<!-- /COMPLEXITY_GATE -->
Middle content
<!-- COMPLEXITY_GATE: level>=3 -->
Block 2
<!-- /COMPLEXITY_GATE -->
`;
  const blocks = markerParser.findBlocks(template);
  assertEqual(blocks.length, 2, 'Should find two blocks');
});

test('handles empty template', () => {
  const blocks = markerParser.findBlocks('');
  assertEqual(blocks.length, 0, 'Should find no blocks');
});

test('handles template with no markers', () => {
  const blocks = markerParser.findBlocks('Just plain content');
  assertEqual(blocks.length, 0, 'Should find no blocks');
});

// Test: processTemplate
console.log('\nprocessTemplate:');

test('includes block for matching level', () => {
  const template = `Before
<!-- COMPLEXITY_GATE: level>=2 -->
INCLUDED
<!-- /COMPLEXITY_GATE -->
After`;

  const result = markerParser.processTemplate(template, { level: '2' });
  assertEqual(result.content.includes('INCLUDED'), true, 'Should include content');
  assertEqual(result.content.includes('COMPLEXITY_GATE'), false, 'Should remove markers');
});

test('excludes block for non-matching level', () => {
  const template = `Before
<!-- COMPLEXITY_GATE: level>=3 -->
EXCLUDED
<!-- /COMPLEXITY_GATE -->
After`;

  const result = markerParser.processTemplate(template, { level: '2' });
  assertEqual(result.content.includes('EXCLUDED'), false, 'Should exclude content');
});

test('handles mixed inclusion/exclusion', () => {
  const template = `Start
<!-- COMPLEXITY_GATE: level>=2 -->
LEVEL2
<!-- /COMPLEXITY_GATE -->
<!-- COMPLEXITY_GATE: level>=3 -->
LEVEL3
<!-- /COMPLEXITY_GATE -->
End`;

  const result = markerParser.processTemplate(template, { level: '2' });
  assertEqual(result.content.includes('LEVEL2'), true, 'Should include Level 2 content');
  assertEqual(result.content.includes('LEVEL3'), false, 'Should exclude Level 3 content');
});

test('reports stats correctly', () => {
  const template = `
<!-- COMPLEXITY_GATE: level>=2 -->
A
<!-- /COMPLEXITY_GATE -->
<!-- COMPLEXITY_GATE: level>=3 -->
B
<!-- /COMPLEXITY_GATE -->
`;

  const result = markerParser.processTemplate(template, { level: '2' });
  assertEqual(result.stats.totalBlocks, 2, 'Should count total blocks');
  assertEqual(result.stats.includedBlocks, 1, 'Should count included blocks');
  assertEqual(result.stats.excludedBlocks, 1, 'Should count excluded blocks');
});

// Test: validateMarkers
console.log('\nvalidateMarkers:');

test('validates balanced markers as valid', () => {
  const template = `
<!-- COMPLEXITY_GATE: level>=2 -->
Content
<!-- /COMPLEXITY_GATE -->
`;
  const result = markerParser.validateMarkers(template);
  assertEqual(result.valid, true, 'Balanced markers should be valid');
  assertEqual(result.markerCount, 1, 'Should count one marker');
});

test('detects unbalanced markers', () => {
  const template = `
<!-- COMPLEXITY_GATE: level>=2 -->
Content
`;
  const result = markerParser.validateMarkers(template);
  assertEqual(result.valid, false, 'Missing closing marker should be invalid');
  assertEqual(result.errors.length > 0, true, 'Should have errors');
});

test('handles template without markers', () => {
  const result = markerParser.validateMarkers('Plain content');
  assertEqual(result.valid, true, 'No markers should be valid');
  assertEqual(result.markerCount, 0, 'Should have zero markers');
});

// Test: levelToNumber
console.log('\nlevelToNumber:');

test('converts "1" to 1', () => {
  assertEqual(markerParser.levelToNumber('1'), 1, 'Should convert "1" to 1');
});

test('converts "2" to 2', () => {
  assertEqual(markerParser.levelToNumber('2'), 2, 'Should convert "2" to 2');
});

test('converts "3" to 3', () => {
  assertEqual(markerParser.levelToNumber('3'), 3, 'Should convert "3" to 3');
});

test('converts "3+" to 4', () => {
  assertEqual(markerParser.levelToNumber('3+'), 4, 'Should convert "3+" to 4');
});

test('converts number 2 to 2', () => {
  assertEqual(markerParser.levelToNumber(2), 2, 'Should handle number input');
});

test('defaults invalid input to 1', () => {
  assertEqual(markerParser.levelToNumber('invalid'), 1, 'Should default to 1');
});

// Test: Exact Level (Gap #4)
console.log('\nexactLevel condition:');

test('parses level=2 exact condition', () => {
  const result = markerParser.parseConditions('level=2');
  assertEqual(result.exactLevel, '2', 'Should extract exact level 2');
});

test('parses level=3 exact condition', () => {
  const result = markerParser.parseConditions('level=3');
  assertEqual(result.exactLevel, '3', 'Should extract exact level 3');
});

test('exact level takes precedence over range when alone', () => {
  const result = markerParser.parseConditions('level=2');
  assertEqual(result.exactLevel, '2', 'Should have exact level');
  assertEqual(result.minLevel, null, 'Should not have min level');
  assertEqual(result.maxLevel, null, 'Should not have max level');
});

test('evaluates exactLevel correctly for match', () => {
  const conditions = markerParser.parseConditions('level=2');
  const result = markerParser.evaluateConditions(conditions, { level: '2' });
  assertEqual(result.include, true, 'Level 2 should match level=2');
});

test('evaluates exactLevel correctly for mismatch', () => {
  const conditions = markerParser.parseConditions('level=2');
  const result = markerParser.evaluateConditions(conditions, { level: '3' });
  assertEqual(result.include, false, 'Level 3 should not match level=2');
});

// Test: shouldAutoEnableFeature (Gap #3) - via evaluateConditions
console.log('\nshouldAutoEnableFeature (via evaluateConditions):');

test('ai-protocol auto-enabled at Level 3', () => {
  const conditions = markerParser.parseConditions('feature=ai-protocol');
  const result = markerParser.evaluateConditions(conditions, { level: '3', enabledFeatures: [] });
  assertEqual(result.include, true, 'ai-protocol should auto-enable at Level 3');
});

test('ai-protocol NOT auto-enabled at Level 2', () => {
  const conditions = markerParser.parseConditions('feature=ai-protocol');
  const result = markerParser.evaluateConditions(conditions, { level: '2', enabledFeatures: [] });
  assertEqual(result.include, false, 'ai-protocol should NOT auto-enable at Level 2');
});

test('dependency-graph auto-enabled at Level 2', () => {
  const conditions = markerParser.parseConditions('feature=dependency-graph');
  const result = markerParser.evaluateConditions(conditions, { level: '2', enabledFeatures: [] });
  assertEqual(result.include, true, 'dependency-graph should auto-enable at Level 2');
});

test('dependency-graph NOT auto-enabled at Level 1', () => {
  const conditions = markerParser.parseConditions('feature=dependency-graph');
  const result = markerParser.evaluateConditions(conditions, { level: '1', enabledFeatures: [] });
  assertEqual(result.include, false, 'dependency-graph should NOT auto-enable at Level 1');
});

test('effort-estimation auto-enabled at Level 2', () => {
  const conditions = markerParser.parseConditions('feature=effort-estimation');
  const result = markerParser.evaluateConditions(conditions, { level: '2', enabledFeatures: [] });
  assertEqual(result.include, true, 'effort-estimation should auto-enable at Level 2');
});

test('extended-checklist auto-enabled at Level 3+ only', () => {
  const conditions = markerParser.parseConditions('feature=extended-checklist');
  const result3 = markerParser.evaluateConditions(conditions, { level: '3', enabledFeatures: [] });
  const result3plus = markerParser.evaluateConditions(conditions, { level: '3+', enabledFeatures: [] });
  assertEqual(result3.include, false, 'extended-checklist should NOT auto-enable at Level 3');
  assertEqual(result3plus.include, true, 'extended-checklist should auto-enable at Level 3+');
});

test('executive-summary auto-enabled at Level 3', () => {
  const conditions = markerParser.parseConditions('feature=executive-summary');
  const result = markerParser.evaluateConditions(conditions, { level: '3', enabledFeatures: [] });
  assertEqual(result.include, true, 'executive-summary should auto-enable at Level 3');
});

test('workstreams auto-enabled at Level 3', () => {
  const conditions = markerParser.parseConditions('feature=workstreams');
  const result = markerParser.evaluateConditions(conditions, { level: '3', enabledFeatures: [] });
  assertEqual(result.include, true, 'workstreams should auto-enable at Level 3');
});

test('milestones auto-enabled at Level 2', () => {
  const conditions = markerParser.parseConditions('feature=milestones');
  const result = markerParser.evaluateConditions(conditions, { level: '2', enabledFeatures: [] });
  assertEqual(result.include, true, 'milestones should auto-enable at Level 2');
});

test('unknown feature not auto-enabled', () => {
  const conditions = markerParser.parseConditions('feature=unknown-feature');
  const result = markerParser.evaluateConditions(conditions, { level: '3+', enabledFeatures: [] });
  assertEqual(result.include, false, 'unknown feature should NOT auto-enable');
});

test('explicitly enabled feature overrides auto-enable', () => {
  const conditions = markerParser.parseConditions('feature=ai-protocol');
  const result = markerParser.evaluateConditions(conditions, { level: '1', enabledFeatures: ['ai-protocol'] });
  assertEqual(result.include, true, 'explicitly enabled feature should work at any level');
});

// Test: Edge Cases with level>=
console.log('\nEdge Cases (level>= regex):');

test('handles level>=2 in template correctly', () => {
  const template = `<!-- COMPLEXITY_GATE: level>=2 -->Include<!-- /COMPLEXITY_GATE -->`;
  const blocks = markerParser.findBlocks(template);
  assertEqual(blocks.length, 1, 'Should find block with >= in condition');
  assertEqual(blocks[0].conditions.minLevel, '2', 'Should parse level correctly');
});

test('handles level>=3, feature=x correctly', () => {
  const template = `<!-- COMPLEXITY_GATE: level>=3, feature=test -->Include<!-- /COMPLEXITY_GATE -->`;
  const blocks = markerParser.findBlocks(template);
  assertEqual(blocks.length, 1, 'Should find block');
  assertEqual(blocks[0].conditions.minLevel, '3', 'Should parse level');
  assertEqual(blocks[0].conditions.feature, 'test', 'Should parse feature');
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
