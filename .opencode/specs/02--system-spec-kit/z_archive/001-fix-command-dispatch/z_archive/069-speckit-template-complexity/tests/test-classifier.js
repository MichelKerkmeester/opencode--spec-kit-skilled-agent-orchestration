#!/usr/bin/env node
/**
 * Test Suite: Complexity Classifier & Features
 *
 * Tests for lib/complexity/classifier.js and lib/complexity/features.js
 * Specifically covers level boundary thresholds and feature availability.
 * Run with: node test-classifier.js
 */

const classifier = require('../../../../.opencode/skill/system-spec-kit/lib/complexity/classifier');
const features = require('../../../../.opencode/skill/system-spec-kit/lib/complexity/features');

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  \u2713 ${name}`);
  } catch (error) {
    failed++;
    failures.push({ name, error: error.message });
    console.log(`  \u2717 ${name}`);
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

console.log('\n=== Classifier & Features Tests ===\n');

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL BOUNDARY THRESHOLD TESTS (Critical Gap #1)
// ═══════════════════════════════════════════════════════════════════════════

console.log('Level Boundary Thresholds:');

// Level 1 boundaries (0-25)
test('score 0 maps to Level 1', () => {
  const result = classifier.classify(0);
  assertEqual(result.level, 1, 'Score 0 should be Level 1');
  assertEqual(result.levelString, '1', 'Level string should be "1"');
});

test('score 25 maps to Level 1 (upper boundary)', () => {
  const result = classifier.classify(25);
  assertEqual(result.level, 1, 'Score 25 should be Level 1');
  assertEqual(result.levelString, '1', 'Level string should be "1"');
});

test('score 26 maps to Level 2 (lower boundary)', () => {
  const result = classifier.classify(26);
  assertEqual(result.level, 2, 'Score 26 should be Level 2');
  assertEqual(result.levelString, '2', 'Level string should be "2"');
});

// Level 2 boundaries (26-55)
test('score 55 maps to Level 2 (upper boundary)', () => {
  const result = classifier.classify(55);
  assertEqual(result.level, 2, 'Score 55 should be Level 2');
  assertEqual(result.levelString, '2', 'Level string should be "2"');
});

test('score 56 maps to Level 3 (lower boundary)', () => {
  const result = classifier.classify(56);
  assertEqual(result.level, 3, 'Score 56 should be Level 3');
  assertEqual(result.levelString, '3', 'Level string should be "3"');
});

// Level 3 boundaries (56-79)
test('score 79 maps to Level 3 (upper boundary)', () => {
  const result = classifier.classify(79);
  assertEqual(result.level, 3, 'Score 79 should be Level 3');
  assertEqual(result.levelString, '3', 'Level string should be "3"');
  assertEqual(result.isExtended, false, 'Should not be extended');
});

test('score 80 maps to Level 3+ (lower boundary)', () => {
  const result = classifier.classify(80);
  assertEqual(result.level, 3, 'Score 80 should be Level 3');
  assertEqual(result.levelString, '3+', 'Level string should be "3+"');
  assertEqual(result.isExtended, true, 'Should be extended');
});

// Level 3+ boundaries (80-100)
test('score 100 maps to Level 3+', () => {
  const result = classifier.classify(100);
  assertEqual(result.level, 3, 'Score 100 should be Level 3');
  assertEqual(result.levelString, '3+', 'Level string should be "3+"');
  assertEqual(result.isExtended, true, 'Should be extended');
});

// ═══════════════════════════════════════════════════════════════════════════
// DISTANCE CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\nDistance Calculations:');

test('Level 1 has distance to Level 2', () => {
  const result = classifier.classify(20);
  assertEqual(result.distanceToNextLevel, 6, 'Distance from 20 to 26 should be 6');
});

test('Level 2 has distance to Level 3', () => {
  const result = classifier.classify(50);
  assertEqual(result.distanceToNextLevel, 6, 'Distance from 50 to 56 should be 6');
});

test('Level 3 has distance to Level 3+', () => {
  const result = classifier.classify(70);
  assertEqual(result.distanceToNextLevel, 10, 'Distance from 70 to 80 should be 10');
});

test('Level 3+ has null distance to next', () => {
  const result = classifier.classify(85);
  assertEqual(result.distanceToNextLevel, null, 'Level 3+ should have null distance');
});

test('Level 2 has distance from Level 1', () => {
  const result = classifier.classify(30);
  assertEqual(result.distanceToPrevLevel, 5, 'Distance from 30 to 25 should be 5');
});

test('Level 1 has null distance to prev', () => {
  const result = classifier.classify(10);
  assertEqual(result.distanceToPrevLevel, null, 'Level 1 should have null prev distance');
});

// ═══════════════════════════════════════════════════════════════════════════
// BOUNDARY PROXIMITY
// ═══════════════════════════════════════════════════════════════════════════

console.log('\nBoundary Proximity:');

test('score near boundary is detected', () => {
  const result = classifier.checkBoundaryProximity(23);
  assertEqual(result.isNearBoundary, true, 'Score 23 should be near boundary 25');
  assertEqual(result.nearestBoundary, 25, 'Nearest boundary should be 25');
});

test('score far from boundary is not flagged', () => {
  const result = classifier.checkBoundaryProximity(40);
  assertEqual(result.isNearBoundary, false, 'Score 40 should not be near boundary');
});

test('score exactly at boundary is near', () => {
  const result = classifier.checkBoundaryProximity(55);
  assertEqual(result.isNearBoundary, true, 'Score 55 should be at boundary');
});

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL NAMES
// ═══════════════════════════════════════════════════════════════════════════

console.log('\nLevel Names:');

test('Level 1 is named "Baseline"', () => {
  const result = classifier.classify(10);
  assertEqual(result.levelName, 'Baseline', 'Level 1 name should be Baseline');
});

test('Level 2 is named "Verification"', () => {
  const result = classifier.classify(40);
  assertEqual(result.levelName, 'Verification', 'Level 2 name should be Verification');
});

test('Level 3 is named "Full"', () => {
  const result = classifier.classify(70);
  assertEqual(result.levelName, 'Full', 'Level 3 name should be Full');
});

test('Level 3+ is named "Extended"', () => {
  const result = classifier.classify(90);
  assertEqual(result.levelName, 'Extended', 'Level 3+ name should be Extended');
});

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL REQUIREMENTS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\nLevel Requirements:');

test('Level 1 requires base files', () => {
  const result = classifier.getLevelRequirements('1');
  assertEqual(result.requiredFiles.includes('spec.md'), true, 'Should require spec.md');
  assertEqual(result.requiredFiles.includes('checklist.md'), false, 'Should not require checklist.md');
});

test('Level 2 requires checklist.md', () => {
  const result = classifier.getLevelRequirements('2');
  assertEqual(result.requiredFiles.includes('checklist.md'), true, 'Should require checklist.md');
  assertEqual(result.requiredFiles.includes('decision-record.md'), false, 'Should not require decision-record.md');
});

test('Level 3 requires decision-record.md', () => {
  const result = classifier.getLevelRequirements('3');
  assertEqual(result.requiredFiles.includes('decision-record.md'), true, 'Should require decision-record.md');
});

test('Level 3+ requires decision-record.md', () => {
  const result = classifier.getLevelRequirements('3+');
  assertEqual(result.requiredFiles.includes('decision-record.md'), true, 'Should require decision-record.md');
});

// ═══════════════════════════════════════════════════════════════════════════
// FEATURES - AVAILABILITY AT LEVELS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\nFeature Availability:');

test('aiProtocol not available at Level 1', () => {
  const available = features.getAvailableFeatures('1');
  assertEqual('aiProtocol' in available, false, 'aiProtocol should not be at Level 1');
});

test('aiProtocol not available at Level 2', () => {
  const available = features.getAvailableFeatures('2');
  assertEqual('aiProtocol' in available, false, 'aiProtocol should not be at Level 2');
});

test('aiProtocol available at Level 3', () => {
  const available = features.getAvailableFeatures('3');
  assertEqual('aiProtocol' in available, true, 'aiProtocol should be at Level 3');
});

test('aiProtocol available at Level 3+', () => {
  const available = features.getAvailableFeatures('3+');
  assertEqual('aiProtocol' in available, true, 'aiProtocol should be at Level 3+');
});

test('dependencyGraph available at Level 2', () => {
  const available = features.getAvailableFeatures('2');
  assertEqual('dependencyGraph' in available, true, 'dependencyGraph should be at Level 2');
});

test('dependencyGraph not available at Level 1', () => {
  const available = features.getAvailableFeatures('1');
  assertEqual('dependencyGraph' in available, false, 'dependencyGraph should not be at Level 1');
});

test('extendedChecklist only at Level 3+', () => {
  const available3 = features.getAvailableFeatures('3');
  const available3plus = features.getAvailableFeatures('3+');
  assertEqual('extendedChecklist' in available3, false, 'extendedChecklist should not be at Level 3');
  assertEqual('extendedChecklist' in available3plus, true, 'extendedChecklist should be at Level 3+');
});

// ═══════════════════════════════════════════════════════════════════════════
// FEATURES - REQUIRED AT LEVELS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\nFeature Requirements:');

test('aiProtocol required at Level 3+', () => {
  const required = features.getRequiredFeatures('3+');
  assertEqual('aiProtocol' in required, true, 'aiProtocol should be required at 3+');
});

test('aiProtocol not required at Level 3', () => {
  const required = features.getRequiredFeatures('3');
  assertEqual('aiProtocol' in required, false, 'aiProtocol should not be required at 3');
});

test('extendedChecklist required at Level 3+', () => {
  const required = features.getRequiredFeatures('3+');
  assertEqual('extendedChecklist' in required, true, 'extendedChecklist should be required at 3+');
});

test('workstreamOrganization required at Level 3+', () => {
  const required = features.getRequiredFeatures('3+');
  assertEqual('workstreamOrganization' in required, true, 'workstreamOrganization should be required at 3+');
});

// ═══════════════════════════════════════════════════════════════════════════
// FEATURES - SPEC TYPE FILTERING
// ═══════════════════════════════════════════════════════════════════════════

console.log('\nSpec Type Filtering:');

test('researchMethodology available for research specs', () => {
  const applicable = features.getFeaturesForSpecType('research', '2');
  assertEqual('researchMethodology' in applicable, true, 'Should have researchMethodology');
});

test('researchMethodology not for feature specs', () => {
  const applicable = features.getFeaturesForSpecType('feature', '2');
  assertEqual('researchMethodology' in applicable, false, 'Should not have researchMethodology for feature');
});

// ═══════════════════════════════════════════════════════════════════════════
// GATE EXPRESSION BUILDING AND PARSING
// ═══════════════════════════════════════════════════════════════════════════

console.log('\nGate Expressions:');

test('buildGateExpression creates correct expression', () => {
  const feature = { minLevel: 3, gateMarker: 'ai-protocol' };
  const expr = features.buildGateExpression('aiProtocol', feature);
  assertEqual(expr.includes('level>=3'), true, 'Should have level>=3');
  assertEqual(expr.includes('feature=ai-protocol'), true, 'Should have feature marker');
});

test('parseGateExpression parses level>=3', () => {
  const result = features.parseGateExpression('level>=3');
  assertEqual(result.minLevel, '3', 'Should parse minLevel');
});

test('parseGateExpression parses feature', () => {
  const result = features.parseGateExpression('feature=test-feature');
  assertEqual(result.feature, 'test-feature', 'Should parse feature');
});

test('parseGateExpression parses combined', () => {
  const result = features.parseGateExpression('level>=2, level<=3, feature=dep-graph');
  assertEqual(result.minLevel, '2', 'Should parse minLevel');
  assertEqual(result.maxLevel, '3', 'Should parse maxLevel');
  assertEqual(result.feature, 'dep-graph', 'Should parse feature');
});

// ═══════════════════════════════════════════════════════════════════════════
// GATE EVALUATION
// ═══════════════════════════════════════════════════════════════════════════

console.log('\nGate Evaluation:');

test('evaluateGate passes for matching level', () => {
  const conditions = { minLevel: '2' };
  const result = features.evaluateGate(conditions, { level: '3' });
  assertEqual(result, true, 'Level 3 should pass level>=2');
});

test('evaluateGate fails for insufficient level', () => {
  const conditions = { minLevel: '3' };
  const result = features.evaluateGate(conditions, { level: '2' });
  assertEqual(result, false, 'Level 2 should fail level>=3');
});

test('evaluateGate handles maxLevel', () => {
  const conditions = { maxLevel: '2' };
  const result = features.evaluateGate(conditions, { level: '3' });
  assertEqual(result, false, 'Level 3 should fail level<=2');
});

test('evaluateGate handles 3+ as level 4', () => {
  const conditions = { minLevel: '3+' };
  const result3 = features.evaluateGate(conditions, { level: '3' });
  const result3plus = features.evaluateGate(conditions, { level: '3+' });
  assertEqual(result3, false, 'Level 3 should fail level>=3+');
  assertEqual(result3plus, true, 'Level 3+ should pass level>=3+');
});

// ═══════════════════════════════════════════════════════════════════════════
// SUGGEST ADJUSTMENT
// ═══════════════════════════════════════════════════════════════════════════

console.log('\nSuggest Adjustment:');

test('suggests upgrade for many user stories', () => {
  const result = classifier.suggestAdjustment(2, { userStoryCount: 10, taskCount: 50 });
  assertEqual(result.hasAdjustments, true, 'Should suggest adjustments');
  assertEqual(result.suggestions[0].type, 'upgrade', 'Should suggest upgrade');
});

test('suggests downgrade for few user stories', () => {
  const result = classifier.suggestAdjustment(2, { userStoryCount: 1, taskCount: 10 });
  assertEqual(result.hasAdjustments, true, 'Should suggest adjustments');
  assertEqual(result.suggestions[0].type, 'downgrade', 'Should suggest downgrade');
});

test('no adjustment for appropriate content', () => {
  const result = classifier.suggestAdjustment(2, { userStoryCount: 4, taskCount: 30 });
  assertEqual(result.hasAdjustments, false, 'Should not suggest adjustments');
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
