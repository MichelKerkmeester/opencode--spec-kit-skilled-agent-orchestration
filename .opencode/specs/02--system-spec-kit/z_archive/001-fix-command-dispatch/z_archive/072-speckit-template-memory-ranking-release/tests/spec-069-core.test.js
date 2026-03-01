#!/usr/bin/env node
/**
 * Test Suite: Spec 069 - Template Complexity Detection (Core Features)
 *
 * Part 1: Tests for core complexity detection features:
 * - 5-dimension scoring algorithm
 * - Level determination
 * - Template selection logic
 * - Marker processing
 *
 * Run with: node spec-069-core.test.js
 */

const path = require('path');

// Import modules under test
const detector = require('../../../../.opencode/skill/system-spec-kit/lib/complexity/detector');
const classifier = require('../../../../.opencode/skill/system-spec-kit/lib/complexity/classifier');
const markerParser = require('../../../../.opencode/skill/system-spec-kit/lib/expansion/marker-parser');
const preprocessor = require('../../../../.opencode/skill/system-spec-kit/lib/expansion/preprocessor');

// =============================================================================
// Test Framework
// =============================================================================

let passed = 0;
let failed = 0;
let skipped = 0;
const failures = [];
const results = {
  suites: []
};

let currentSuite = null;

function describe(name, fn) {
  currentSuite = { name, tests: [], passed: 0, failed: 0 };
  console.log(`\n=== ${name} ===\n`);
  fn();
  results.suites.push(currentSuite);
}

function test(name, fn) {
  try {
    fn();
    passed++;
    if (currentSuite) currentSuite.passed++;
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failed++;
    if (currentSuite) currentSuite.failed++;
    failures.push({ suite: currentSuite?.name || 'Unknown', name, error: error.message });
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
  }
}

function skip(name, fn) {
  skipped++;
  console.log(`  ○ ${name} (skipped)`);
}

// Assertion helpers
function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertDeepEqual(actual, expected, message = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertRange(actual, min, max, message = '') {
  if (actual < min || actual > max) {
    throw new Error(`${message}: expected ${min}-${max}, got ${actual}`);
  }
}

function assertTrue(condition, message = '') {
  if (!condition) {
    throw new Error(`${message}: expected truthy value, got ${condition}`);
  }
}

function assertFalse(condition, message = '') {
  if (condition) {
    throw new Error(`${message}: expected falsy value, got ${condition}`);
  }
}

function assertType(actual, type, message = '') {
  if (typeof actual !== type) {
    throw new Error(`${message}: expected type ${type}, got ${typeof actual}`);
  }
}

function assertThrows(fn, message = '') {
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

function assertNotThrows(fn, message = '') {
  try {
    fn();
  } catch (e) {
    throw new Error(`${message}: expected function not to throw, but threw: ${e.message}`);
  }
}

function assertContains(str, substring, message = '') {
  if (!str.includes(substring)) {
    throw new Error(`${message}: expected "${str.substring(0, 100)}..." to contain "${substring}"`);
  }
}

function assertNotContains(str, substring, message = '') {
  if (str.includes(substring)) {
    throw new Error(`${message}: expected string not to contain "${substring}"`);
  }
}

function assertArrayLength(arr, length, message = '') {
  if (!Array.isArray(arr) || arr.length !== length) {
    throw new Error(`${message}: expected array of length ${length}, got ${Array.isArray(arr) ? arr.length : 'non-array'}`);
  }
}

// =============================================================================
// SECTION 1: Complexity Detection Algorithm (5-Dimension Scoring)
// =============================================================================

describe('1. Complexity Detection Algorithm - 5-Dimension Scoring', () => {

  // ---------------------------------------------------------------------------
  // 1.1 Dimension Scoring Basics
  // ---------------------------------------------------------------------------

  test('1.1.1 detect() returns all 5 dimensions in breakdown', () => {
    const result = detector.detect('Add a new feature');
    const dimensions = ['scope', 'risk', 'research', 'multiAgent', 'coordination'];
    for (const dim of dimensions) {
      assertTrue(dim in result.breakdown, `Missing dimension: ${dim}`);
    }
  });

  test('1.1.2 each dimension has score, weight, weightedScore, and triggers', () => {
    const result = detector.detect('Add authentication feature');
    const dimensions = ['scope', 'risk', 'research', 'multiAgent', 'coordination'];
    for (const dim of dimensions) {
      const d = result.breakdown[dim];
      assertType(d.score, 'number', `${dim}.score`);
      assertType(d.weight, 'number', `${dim}.weight`);
      assertType(d.weightedScore, 'number', `${dim}.weightedScore`);
      assertTrue(Array.isArray(d.triggers), `${dim}.triggers should be array`);
    }
  });

  test('1.1.3 dimension weights sum to 100', () => {
    const result = detector.detect('Test feature');
    const breakdown = result.breakdown;
    const totalWeight = breakdown.scope.weight +
                        breakdown.risk.weight +
                        breakdown.research.weight +
                        breakdown.multiAgent.weight +
                        breakdown.coordination.weight;
    assertEqual(totalWeight, 100, 'Weights should sum to 100');
  });

  test('1.1.4 default weights match specification (scope:25, risk:25, research:20, multiAgent:15, coordination:15)', () => {
    const result = detector.detect('Test');
    assertEqual(result.breakdown.scope.weight, 25, 'Scope weight');
    assertEqual(result.breakdown.risk.weight, 25, 'Risk weight');
    assertEqual(result.breakdown.research.weight, 20, 'Research weight');
    assertEqual(result.breakdown.multiAgent.weight, 15, 'MultiAgent weight');
    assertEqual(result.breakdown.coordination.weight, 15, 'Coordination weight');
  });

  // ---------------------------------------------------------------------------
  // 1.2 Individual Dimension Detection
  // ---------------------------------------------------------------------------

  test('1.2.1 scope dimension detects LOC indicators', () => {
    const result = detector.detect('This will be about 500 lines of code across 10 files');
    assertTrue(result.breakdown.scope.score > 0, 'Should detect LOC signals');
  });

  test('1.2.2 scope dimension detects file count indicators', () => {
    const result = detector.detect('Modify 20 files in the codebase');
    assertTrue(result.breakdown.scope.score > 0, 'Should detect file count signals');
  });

  test('1.2.3 risk dimension detects authentication keywords', () => {
    const result = detector.detect('Add OAuth2 authentication with JWT tokens');
    assertTrue(result.breakdown.risk.score > 0, 'Should detect auth signals');
    assertTrue(result.breakdown.risk.triggers.length > 0, 'Should have triggers');
  });

  test('1.2.4 risk dimension detects security keywords', () => {
    const result = detector.detect('Implement password hashing and encryption');
    assertTrue(result.breakdown.risk.score > 0, 'Should detect security signals');
  });

  test('1.2.5 research dimension detects investigation keywords', () => {
    const result = detector.detect('Investigate and analyze the performance bottleneck');
    assertTrue(result.breakdown.research.score > 0, 'Should detect research signals');
  });

  test('1.2.6 research dimension detects uncertainty indicators', () => {
    const result = detector.detect('Unknown dependencies need exploration before implementation');
    assertTrue(result.breakdown.research.score > 0, 'Should detect uncertainty signals');
  });

  test('1.2.7 multiAgent dimension detects workstream keywords', () => {
    const result = detector.detect('Implement with 10 parallel workstreams');
    assertTrue(result.breakdown.multiAgent.score > 0, 'Should detect workstream signals');
  });

  test('1.2.8 multiAgent dimension detects agent coordination keywords', () => {
    const result = detector.detect('Multiple agents need to coordinate on this task');
    assertTrue(result.breakdown.multiAgent.score > 0, 'Should detect agent signals');
  });

  test('1.2.9 coordination dimension detects dependency keywords', () => {
    const result = detector.detect('This depends on the auth module completing first');
    assertTrue(result.breakdown.coordination.score > 0, 'Should detect dependency signals');
  });

  test('1.2.10 coordination dimension detects blocking keywords', () => {
    const result = detector.detect('Blocked by external API availability');
    assertTrue(result.breakdown.coordination.score > 0, 'Should detect blocking signals');
  });

  // ---------------------------------------------------------------------------
  // 1.3 Score Calculation
  // ---------------------------------------------------------------------------

  test('1.3.1 totalScore is between 0 and 100', () => {
    const tasks = ['Fix typo', 'Major platform migration with OAuth2, 50 files, external APIs'];
    for (const task of tasks) {
      const result = detector.detect(task);
      assertRange(result.totalScore, 0, 100, `Score for: ${task.substring(0, 30)}`);
    }
  });

  test('1.3.2 weightedScore formula is correct (score * weight / 100)', () => {
    const result = detector.detect('Add authentication with OAuth2');
    for (const dim of ['scope', 'risk', 'research', 'multiAgent', 'coordination']) {
      const d = result.breakdown[dim];
      const expected = Math.round((d.score * d.weight) / 100);
      assertEqual(d.weightedScore, expected, `${dim} weightedScore calculation`);
    }
  });

  test('1.3.3 totalScore equals sum of all weightedScores', () => {
    const result = detector.detect('Add feature with moderate complexity');
    const sumWeighted = result.breakdown.scope.weightedScore +
                        result.breakdown.risk.weightedScore +
                        result.breakdown.research.weightedScore +
                        result.breakdown.multiAgent.weightedScore +
                        result.breakdown.coordination.weightedScore;
    assertEqual(result.totalScore, sumWeighted, 'Total should equal sum of weighted');
  });

  test('1.3.4 confidence is between 50 and 95', () => {
    const result = detector.detect('Add a feature');
    assertRange(result.confidence, 50, 95, 'Confidence range');
  });

  // ---------------------------------------------------------------------------
  // 1.4 Edge Cases - Scoring
  // ---------------------------------------------------------------------------

  test('1.4.1 empty string returns Level 1 with score 0', () => {
    const result = detector.detect('');
    assertEqual(result.recommendedLevel, 1, 'Empty returns Level 1');
    assertEqual(result.totalScore, 0, 'Empty has score 0');
  });

  test('1.4.2 whitespace-only returns Level 1', () => {
    const result = detector.detect('   \n\t  ');
    assertEqual(result.recommendedLevel, 1, 'Whitespace returns Level 1');
  });

  test('1.4.3 handles very long input without error', () => {
    const longText = 'Add feature '.repeat(1000);
    assertNotThrows(() => detector.detect(longText), 'Should handle long input');
  });

  test('1.4.4 handles special characters', () => {
    const result = detector.detect('Fix bug in user\'s profile: "name" & <email> @#$%');
    assertType(result.recommendedLevel, 'number', 'Should handle special chars');
  });

  test('1.4.5 handles unicode characters', () => {
    const result = detector.detect('修复用户界面 bugの修正 исправление 🔧');
    assertType(result.recommendedLevel, 'number', 'Should handle unicode');
  });

  test('1.4.6 throws for non-string input (number)', () => {
    assertThrows(() => detector.detect(123), 'Should throw for number');
  });

  test('1.4.7 throws for non-string input (null)', () => {
    assertThrows(() => detector.detect(null), 'Should throw for null');
  });

  test('1.4.8 throws for non-string input (undefined)', () => {
    assertThrows(() => detector.detect(undefined), 'Should throw for undefined');
  });

  test('1.4.9 throws for non-string input (object)', () => {
    assertThrows(() => detector.detect({ text: 'test' }), 'Should throw for object');
  });

  test('1.4.10 throws for non-string input (array)', () => {
    assertThrows(() => detector.detect(['test']), 'Should throw for array');
  });
});

// =============================================================================
// SECTION 2: Level Determination
// =============================================================================

describe('2. Level Determination (Score to Level Mapping)', () => {

  // ---------------------------------------------------------------------------
  // 2.1 Threshold Boundaries
  // ---------------------------------------------------------------------------

  test('2.1.1 score 0 maps to Level 1', () => {
    const result = classifier.classify(0);
    assertEqual(result.level, 1, 'Score 0 = Level 1');
    assertEqual(result.levelString, '1', 'Level string');
    assertEqual(result.levelName, 'Baseline', 'Level name');
  });

  test('2.1.2 score 25 maps to Level 1 (upper boundary)', () => {
    const result = classifier.classify(25);
    assertEqual(result.level, 1, 'Score 25 = Level 1');
  });

  test('2.1.3 score 26 maps to Level 2 (lower boundary)', () => {
    const result = classifier.classify(26);
    assertEqual(result.level, 2, 'Score 26 = Level 2');
    assertEqual(result.levelName, 'Verification', 'Level name');
  });

  test('2.1.4 score 55 maps to Level 2 (upper boundary)', () => {
    const result = classifier.classify(55);
    assertEqual(result.level, 2, 'Score 55 = Level 2');
  });

  test('2.1.5 score 56 maps to Level 3 (lower boundary)', () => {
    const result = classifier.classify(56);
    assertEqual(result.level, 3, 'Score 56 = Level 3');
    assertEqual(result.levelName, 'Full', 'Level name');
    assertFalse(result.isExtended, 'Not extended');
  });

  test('2.1.6 score 79 maps to Level 3 (upper boundary)', () => {
    const result = classifier.classify(79);
    assertEqual(result.level, 3, 'Score 79 = Level 3');
    assertFalse(result.isExtended, 'Not extended');
  });

  test('2.1.7 score 80 maps to Level 3+ (lower boundary)', () => {
    const result = classifier.classify(80);
    assertEqual(result.level, 3, 'Score 80 = Level 3');
    assertEqual(result.levelString, '3+', 'Level string is 3+');
    assertTrue(result.isExtended, 'Is extended');
    assertEqual(result.levelName, 'Extended', 'Level name');
  });

  test('2.1.8 score 100 maps to Level 3+ (upper boundary)', () => {
    const result = classifier.classify(100);
    assertEqual(result.levelString, '3+', 'Score 100 = Level 3+');
  });

  // ---------------------------------------------------------------------------
  // 2.2 Classification Result Structure
  // ---------------------------------------------------------------------------

  test('2.2.1 classify returns all required fields', () => {
    const result = classifier.classify(50);
    assertTrue('level' in result, 'Has level');
    assertTrue('levelString' in result, 'Has levelString');
    assertTrue('levelName' in result, 'Has levelName');
    assertTrue('isExtended' in result, 'Has isExtended');
    assertTrue('score' in result, 'Has score');
    assertTrue('thresholds' in result, 'Has thresholds');
  });

  test('2.2.2 thresholds contain level boundaries', () => {
    const result = classifier.classify(50);
    assertEqual(result.thresholds.level1Max, 25, 'Level 1 max');
    assertEqual(result.thresholds.level2Max, 55, 'Level 2 max');
    assertEqual(result.thresholds.level3Max, 79, 'Level 3 max');
  });

  test('2.2.3 distanceToNextLevel calculated correctly', () => {
    const result = classifier.classify(20);
    assertEqual(result.distanceToNextLevel, 6, 'Distance to Level 2'); // 26 - 20 = 6
  });

  test('2.2.4 distanceToNextLevel is null at max level', () => {
    const result = classifier.classify(85);
    assertEqual(result.distanceToNextLevel, null, 'No next level for 3+');
  });

  test('2.2.5 distanceToPrevLevel calculated correctly', () => {
    const result = classifier.classify(30);
    assertEqual(result.distanceToPrevLevel, 5, 'Distance from Level 1'); // 30 - 25 = 5
  });

  test('2.2.6 distanceToPrevLevel is null at min level', () => {
    const result = classifier.classify(10);
    assertEqual(result.distanceToPrevLevel, null, 'No prev level for 1');
  });

  // ---------------------------------------------------------------------------
  // 2.3 Boundary Proximity Detection
  // ---------------------------------------------------------------------------

  test('2.3.1 detects proximity to Level 1 boundary', () => {
    const result = classifier.checkBoundaryProximity(23, { confidence: { boundaryRange: 5 } });
    assertTrue(result.isNearBoundary, 'Should be near boundary');
    assertEqual(result.nearestBoundary, 25, 'Nearest is Level 1 max');
  });

  test('2.3.2 detects proximity to Level 2 boundary', () => {
    const result = classifier.checkBoundaryProximity(53, { confidence: { boundaryRange: 5 } });
    assertTrue(result.isNearBoundary, 'Should be near boundary');
    assertEqual(result.nearestBoundary, 55, 'Nearest is Level 2 max');
  });

  test('2.3.3 detects proximity to Level 3 boundary', () => {
    const result = classifier.checkBoundaryProximity(77, { confidence: { boundaryRange: 5 } });
    assertTrue(result.isNearBoundary, 'Should be near boundary');
    assertEqual(result.nearestBoundary, 79, 'Nearest is Level 3 max');
  });

  test('2.3.4 not near boundary when distance > range', () => {
    const result = classifier.checkBoundaryProximity(40, { confidence: { boundaryRange: 5 } });
    assertFalse(result.isNearBoundary, 'Should not be near boundary');
  });

  // ---------------------------------------------------------------------------
  // 2.4 Level Requirements
  // ---------------------------------------------------------------------------

  test('2.4.1 Level 1 requires 4 files', () => {
    const req = classifier.getLevelRequirements('1', {});
    assertDeepEqual(
      req.requiredFiles,
      ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'],
      'Level 1 files'
    );
  });

  test('2.4.2 Level 2 requires 5 files (adds checklist)', () => {
    const req = classifier.getLevelRequirements('2', {});
    assertArrayLength(req.requiredFiles, 5, 'Level 2 file count');
    assertTrue(req.requiredFiles.includes('checklist.md'), 'Has checklist');
  });

  test('2.4.3 Level 3 requires 6 files (adds decision-record)', () => {
    const req = classifier.getLevelRequirements('3', {});
    assertArrayLength(req.requiredFiles, 6, 'Level 3 file count');
    assertTrue(req.requiredFiles.includes('decision-record.md'), 'Has decision-record');
  });

  test('2.4.4 Level 3+ requires same files as Level 3', () => {
    const req = classifier.getLevelRequirements('3+', {});
    assertArrayLength(req.requiredFiles, 6, 'Level 3+ file count');
  });

  // ---------------------------------------------------------------------------
  // 2.5 Edge Cases - Level Determination
  // ---------------------------------------------------------------------------

  test('2.5.1 negative score treated as 0', () => {
    const result = classifier.classify(-10);
    assertEqual(result.level, 1, 'Negative score = Level 1');
  });

  test('2.5.2 score > 100 still maps to 3+', () => {
    const result = classifier.classify(150);
    assertEqual(result.levelString, '3+', 'Score > 100 = Level 3+');
  });

  test('2.5.3 decimal score rounded appropriately', () => {
    // Should work with decimal scores
    const result = classifier.classify(25.5);
    assertEqual(result.level, 2, 'Score 25.5 rounds to Level 2');
  });

  test('2.5.4 custom config overrides default thresholds', () => {
    const customConfig = {
      levels: {
        level1Max: 30,
        level2Max: 60,
        level3Max: 85,
        names: { '1': 'Custom1', '2': 'Custom2', '3': 'Custom3', '3+': 'CustomExt' }
      }
    };
    const result = classifier.classify(28, customConfig);
    assertEqual(result.level, 1, 'Custom threshold: 28 = Level 1');
  });
});

// =============================================================================
// SECTION 3: Template Selection Logic
// =============================================================================

describe('3. Template Selection Logic', () => {

  // ---------------------------------------------------------------------------
  // 3.1 selectLevelFolder Function
  // ---------------------------------------------------------------------------

  test('3.1.1 selectLevelFolder("1") returns "level_1"', () => {
    assertEqual(preprocessor.selectLevelFolder('1'), 'level_1', 'Level 1 folder');
  });

  test('3.1.2 selectLevelFolder("2") returns "level_2"', () => {
    assertEqual(preprocessor.selectLevelFolder('2'), 'level_2', 'Level 2 folder');
  });

  test('3.1.3 selectLevelFolder("3") returns "level_3"', () => {
    assertEqual(preprocessor.selectLevelFolder('3'), 'level_3', 'Level 3 folder');
  });

  test('3.1.4 selectLevelFolder("3+") returns "level_3+"', () => {
    assertEqual(preprocessor.selectLevelFolder('3+'), 'level_3+', 'Level 3+ folder');
  });

  test('3.1.5 selectLevelFolder with numeric 1 returns "level_1"', () => {
    assertEqual(preprocessor.selectLevelFolder(1), 'level_1', 'Numeric Level 1');
  });

  test('3.1.6 selectLevelFolder with numeric 2 returns "level_2"', () => {
    assertEqual(preprocessor.selectLevelFolder(2), 'level_2', 'Numeric Level 2');
  });

  test('3.1.7 selectLevelFolder with numeric 3 returns "level_3"', () => {
    assertEqual(preprocessor.selectLevelFolder(3), 'level_3', 'Numeric Level 3');
  });

  test('3.1.8 selectLevelFolder with invalid input returns "level_1" (default)', () => {
    assertEqual(preprocessor.selectLevelFolder('invalid'), 'level_1', 'Invalid defaults to level_1');
  });

  test('3.1.9 selectLevelFolder with null returns "level_1" (default)', () => {
    assertEqual(preprocessor.selectLevelFolder(null), 'level_1', 'Null defaults to level_1');
  });

  test('3.1.10 selectLevelFolder with undefined returns "level_1" (default)', () => {
    assertEqual(preprocessor.selectLevelFolder(undefined), 'level_1', 'Undefined defaults to level_1');
  });

  // ---------------------------------------------------------------------------
  // 3.2 Template Loading
  // ---------------------------------------------------------------------------

  test('3.2.1 loadTemplate throws for non-existent file', () => {
    assertThrows(
      () => preprocessor.loadTemplate('/nonexistent/path/file.md'),
      'Should throw for missing file'
    );
  });

  test('3.2.2 loadTemplate throws for null path', () => {
    assertThrows(
      () => preprocessor.loadTemplate(null),
      'Should throw for null path'
    );
  });

  test('3.2.3 loadTemplate throws for empty string path', () => {
    assertThrows(
      () => preprocessor.loadTemplate(''),
      'Should throw for empty path'
    );
  });

  // ---------------------------------------------------------------------------
  // 3.3 Preprocess Function
  // ---------------------------------------------------------------------------

  test('3.3.1 preprocess returns content, stats, and validation', () => {
    const result = preprocessor.preprocess('Test content', { level: '2' });
    assertTrue('content' in result, 'Has content');
    assertTrue('stats' in result, 'Has stats');
    assertTrue('validation' in result, 'Has validation');
  });

  test('3.3.2 preprocess throws for non-string content', () => {
    assertThrows(
      () => preprocessor.preprocess(123, { level: '2' }),
      'Should throw for numeric content'
    );
  });

  test('3.3.3 preprocess handles empty content', () => {
    const result = preprocessor.preprocess('', { level: '2' });
    assertEqual(result.content, '', 'Empty content preserved');
  });

  test('3.3.4 preprocess defaults to level 2', () => {
    const result = preprocessor.preprocess('Test', {});
    assertType(result.content, 'string', 'Returns string');
  });

  test('3.3.5 preprocess preserves content without markers', () => {
    const content = '# Test\n\nSome content without markers';
    const result = preprocessor.preprocess(content, { level: '2' });
    assertEqual(result.content, content, 'Content preserved');
  });
});

// =============================================================================
// SECTION 4: COMPLEXITY_GATE Marker Processing
// =============================================================================

describe('4. COMPLEXITY_GATE Marker Processing', () => {

  // ---------------------------------------------------------------------------
  // 4.1 Marker Detection
  // ---------------------------------------------------------------------------

  test('4.1.1 findBlocks detects single marker block', () => {
    const template = `
Before
<!-- COMPLEXITY_GATE: level>=3 -->
Conditional content
<!-- /COMPLEXITY_GATE -->
After`;
    const blocks = markerParser.findBlocks(template);
    assertArrayLength(blocks, 1, 'Should find 1 block');
  });

  test('4.1.2 findBlocks detects multiple marker blocks', () => {
    const template = `
<!-- COMPLEXITY_GATE: level>=2 -->
Block 1
<!-- /COMPLEXITY_GATE -->
Middle content
<!-- COMPLEXITY_GATE: level>=3 -->
Block 2
<!-- /COMPLEXITY_GATE -->`;
    const blocks = markerParser.findBlocks(template);
    assertArrayLength(blocks, 2, 'Should find 2 blocks');
  });

  test('4.1.3 findBlocks returns empty array for no markers', () => {
    const template = 'No markers here';
    const blocks = markerParser.findBlocks(template);
    assertArrayLength(blocks, 0, 'Should find 0 blocks');
  });

  test('4.1.4 findBlocks captures condition string', () => {
    const template = `<!-- COMPLEXITY_GATE: level>=3, feature=ai-protocol -->
Content
<!-- /COMPLEXITY_GATE -->`;
    const blocks = markerParser.findBlocks(template);
    assertEqual(blocks[0].conditions.raw, 'level>=3, feature=ai-protocol', 'Condition string');
  });

  test('4.1.5 findBlocks captures content between markers', () => {
    const template = `<!-- COMPLEXITY_GATE: level>=3 -->
Captured content
<!-- /COMPLEXITY_GATE -->`;
    const blocks = markerParser.findBlocks(template);
    assertContains(blocks[0].content, 'Captured content', 'Content captured');
  });

  // ---------------------------------------------------------------------------
  // 4.2 Condition Parsing
  // ---------------------------------------------------------------------------

  test('4.2.1 parseConditions extracts level>=N', () => {
    const conditions = markerParser.parseConditions('level>=3');
    assertEqual(conditions.minLevel, '3', 'Min level parsed');
  });

  test('4.2.2 parseConditions extracts level<=N', () => {
    const conditions = markerParser.parseConditions('level<=2');
    assertEqual(conditions.maxLevel, '2', 'Max level parsed');
  });

  test('4.2.3 parseConditions extracts exact level=N', () => {
    const conditions = markerParser.parseConditions('level=2');
    assertEqual(conditions.exactLevel, '2', 'Exact level parsed');
  });

  test('4.2.4 parseConditions extracts feature=name', () => {
    const conditions = markerParser.parseConditions('feature=ai-protocol');
    assertEqual(conditions.feature, 'ai-protocol', 'Feature parsed');
  });

  test('4.2.5 parseConditions extracts specType=name', () => {
    const conditions = markerParser.parseConditions('specType=research');
    assertEqual(conditions.specType, 'research', 'Spec type parsed');
  });

  test('4.2.6 parseConditions handles multiple conditions', () => {
    const conditions = markerParser.parseConditions('level>=3, feature=ai-protocol, specType=feature');
    assertEqual(conditions.minLevel, '3', 'Min level');
    assertEqual(conditions.feature, 'ai-protocol', 'Feature');
    assertEqual(conditions.specType, 'feature', 'Spec type');
  });

  test('4.2.7 parseConditions handles empty string', () => {
    const conditions = markerParser.parseConditions('');
    assertEqual(conditions.minLevel, null, 'No min level');
    assertEqual(conditions.feature, null, 'No feature');
  });

  test('4.2.8 parseConditions handles null', () => {
    const conditions = markerParser.parseConditions(null);
    assertEqual(conditions.raw, '', 'Empty raw for null');
  });

  test('4.2.9 parseConditions handles level=3+', () => {
    const conditions = markerParser.parseConditions('level>=3+');
    assertEqual(conditions.minLevel, '3+', 'Level 3+ parsed');
  });

  // ---------------------------------------------------------------------------
  // 4.3 Level Conversion
  // ---------------------------------------------------------------------------

  test('4.3.1 levelToNumber converts "1" to 1', () => {
    assertEqual(markerParser.levelToNumber('1'), 1, 'Level 1');
  });

  test('4.3.2 levelToNumber converts "2" to 2', () => {
    assertEqual(markerParser.levelToNumber('2'), 2, 'Level 2');
  });

  test('4.3.3 levelToNumber converts "3" to 3', () => {
    assertEqual(markerParser.levelToNumber('3'), 3, 'Level 3');
  });

  test('4.3.4 levelToNumber converts "3+" to 4', () => {
    assertEqual(markerParser.levelToNumber('3+'), 4, 'Level 3+ = 4');
  });

  test('4.3.5 levelToNumber converts numeric 2 to 2', () => {
    assertEqual(markerParser.levelToNumber(2), 2, 'Numeric input');
  });

  test('4.3.6 levelToNumber returns 1 for invalid string', () => {
    assertEqual(markerParser.levelToNumber('invalid'), 1, 'Invalid defaults to 1');
  });

  test('4.3.7 levelToNumber returns 1 for NaN', () => {
    assertEqual(markerParser.levelToNumber(NaN), 1, 'NaN defaults to 1');
  });

  // ---------------------------------------------------------------------------
  // 4.4 Condition Evaluation
  // ---------------------------------------------------------------------------

  test('4.4.1 evaluateConditions includes when level >= minLevel', () => {
    const conditions = markerParser.parseConditions('level>=2');
    const result = markerParser.evaluateConditions(conditions, { level: '3' });
    assertTrue(result.include, 'Level 3 >= 2 should include');
  });

  test('4.4.2 evaluateConditions excludes when level < minLevel', () => {
    const conditions = markerParser.parseConditions('level>=3');
    const result = markerParser.evaluateConditions(conditions, { level: '2' });
    assertFalse(result.include, 'Level 2 < 3 should exclude');
    assertTrue(result.reasons.length > 0, 'Should have reason');
  });

  test('4.4.3 evaluateConditions includes when level <= maxLevel', () => {
    const conditions = markerParser.parseConditions('level<=2');
    const result = markerParser.evaluateConditions(conditions, { level: '1' });
    assertTrue(result.include, 'Level 1 <= 2 should include');
  });

  test('4.4.4 evaluateConditions excludes when level > maxLevel', () => {
    const conditions = markerParser.parseConditions('level<=2');
    const result = markerParser.evaluateConditions(conditions, { level: '3' });
    assertFalse(result.include, 'Level 3 > 2 should exclude');
  });

  test('4.4.5 evaluateConditions handles level range (>=2, <=3)', () => {
    const conditions = markerParser.parseConditions('level>=2, level<=3');
    const result1 = markerParser.evaluateConditions(conditions, { level: '2' });
    const result2 = markerParser.evaluateConditions(conditions, { level: '3+' });
    assertTrue(result1.include, 'Level 2 in range');
    assertFalse(result2.include, 'Level 3+ > 3 should exclude');
  });

  test('4.4.6 evaluateConditions handles feature with enabled features', () => {
    const conditions = markerParser.parseConditions('feature=ai-protocol');
    const result = markerParser.evaluateConditions(conditions, {
      level: '2',
      enabledFeatures: ['ai-protocol']
    });
    assertTrue(result.include, 'Feature enabled should include');
  });

  test('4.4.7 evaluateConditions excludes when feature not enabled', () => {
    const conditions = markerParser.parseConditions('feature=custom-feature');
    const result = markerParser.evaluateConditions(conditions, {
      level: '2',
      enabledFeatures: []
    });
    assertFalse(result.include, 'Feature not enabled should exclude');
  });

  test('4.4.8 evaluateConditions handles specType match', () => {
    const conditions = markerParser.parseConditions('specType=research');
    const result = markerParser.evaluateConditions(conditions, {
      level: '2',
      specType: 'research'
    });
    assertTrue(result.include, 'Matching specType should include');
  });

  test('4.4.9 evaluateConditions excludes when specType mismatch', () => {
    const conditions = markerParser.parseConditions('specType=research');
    const result = markerParser.evaluateConditions(conditions, {
      level: '2',
      specType: 'feature'
    });
    assertFalse(result.include, 'Mismatched specType should exclude');
  });

  // ---------------------------------------------------------------------------
  // 4.5 Template Processing
  // ---------------------------------------------------------------------------

  test('4.5.1 processTemplate removes excluded blocks', () => {
    const template = `Before
<!-- COMPLEXITY_GATE: level>=3 -->
Excluded content
<!-- /COMPLEXITY_GATE -->
After`;
    const result = markerParser.processTemplate(template, { level: '2' });
    assertNotContains(result.content, 'Excluded content', 'Excluded removed');
    assertContains(result.content, 'Before', 'Before preserved');
    assertContains(result.content, 'After', 'After preserved');
  });

  test('4.5.2 processTemplate keeps included blocks (removes markers)', () => {
    const template = `Before
<!-- COMPLEXITY_GATE: level>=2 -->
Included content
<!-- /COMPLEXITY_GATE -->
After`;
    const result = markerParser.processTemplate(template, { level: '3' });
    assertContains(result.content, 'Included content', 'Included preserved');
    assertNotContains(result.content, 'COMPLEXITY_GATE', 'Markers removed');
  });

  test('4.5.3 processTemplate returns stats', () => {
    const template = `<!-- COMPLEXITY_GATE: level>=2 -->A<!-- /COMPLEXITY_GATE -->
<!-- COMPLEXITY_GATE: level>=3 -->B<!-- /COMPLEXITY_GATE -->`;
    const result = markerParser.processTemplate(template, { level: '2' });
    assertEqual(result.stats.totalBlocks, 2, 'Total blocks');
    assertEqual(result.stats.includedBlocks, 1, 'Included');
    assertEqual(result.stats.excludedBlocks, 1, 'Excluded');
  });

  test('4.5.4 processTemplate with keepMarkers option', () => {
    const template = `<!-- COMPLEXITY_GATE: level>=2 -->Content<!-- /COMPLEXITY_GATE -->`;
    const result = markerParser.processTemplate(template, { level: '3' }, { keepMarkers: true });
    assertContains(result.content, 'COMPLEXITY_GATE', 'Markers kept');
  });

  // ---------------------------------------------------------------------------
  // 4.6 Marker Validation
  // ---------------------------------------------------------------------------

  test('4.6.1 validateMarkers reports unbalanced markers', () => {
    const template = `<!-- COMPLEXITY_GATE: level>=3 -->
Content without closing`;
    const result = markerParser.validateMarkers(template);
    assertFalse(result.valid, 'Should be invalid');
    assertTrue(result.errors.some(e => e.type === 'UNBALANCED_MARKERS'), 'Unbalanced error');
  });

  test('4.6.2 nested markers captured as single block (greedy inner match)', () => {
    // Note: The regex uses non-greedy matching which captures the outer block
    // from the first opening marker to the first closing marker.
    // True nested detection would require recursive parsing.
    const template = `<!-- COMPLEXITY_GATE: level>=2 -->
Outer
<!-- COMPLEXITY_GATE: level>=3 -->
Inner
<!-- /COMPLEXITY_GATE -->
<!-- /COMPLEXITY_GATE -->`;
    const blocks = markerParser.findBlocks(template);
    // Current implementation captures first complete block only
    assertEqual(blocks.length, 1, 'Finds 1 block with non-greedy match');
  });

  test('4.6.3 validateMarkers passes for valid markers', () => {
    const template = `<!-- COMPLEXITY_GATE: level>=3 -->
Content
<!-- /COMPLEXITY_GATE -->`;
    const result = markerParser.validateMarkers(template);
    assertTrue(result.valid, 'Should be valid');
    assertEqual(result.errors.length, 0, 'No errors');
  });

  test('4.6.4 validateMarkers returns marker count', () => {
    const template = `<!-- COMPLEXITY_GATE: level>=2 -->A<!-- /COMPLEXITY_GATE -->
<!-- COMPLEXITY_GATE: level>=3 -->B<!-- /COMPLEXITY_GATE -->`;
    const result = markerParser.validateMarkers(template);
    assertEqual(result.markerCount, 2, 'Marker count');
  });

  test('4.6.5 marker with whitespace-only condition is valid (no warning)', () => {
    // Note: The current implementation's regex requires content after colon,
    // so whitespace-only conditions are not matched as COMPLEXITY_GATE markers
    // at all (they don't match the pattern). This is by design - invalid
    // marker syntax is simply not recognized rather than flagged.
    const template = `<!-- COMPLEXITY_GATE:   -->
Content
<!-- /COMPLEXITY_GATE -->`;
    const result = markerParser.validateMarkers(template);
    // With whitespace-only condition, opening marker doesn't match pattern
    assertTrue(result.valid, 'Valid because marker is not recognized');
  });

  // ---------------------------------------------------------------------------
  // 4.7 Edge Cases - Markers
  // ---------------------------------------------------------------------------

  test('4.7.1 handles whitespace in marker syntax', () => {
    const template = `<!--   COMPLEXITY_GATE:   level>=3   -->
Content
<!--   /COMPLEXITY_GATE   -->`;
    const blocks = markerParser.findBlocks(template);
    assertArrayLength(blocks, 1, 'Should handle whitespace');
  });

  test('4.7.2 handles multiline content in block', () => {
    const template = `<!-- COMPLEXITY_GATE: level>=3 -->
Line 1
Line 2
Line 3
<!-- /COMPLEXITY_GATE -->`;
    const blocks = markerParser.findBlocks(template);
    assertContains(blocks[0].content, 'Line 1', 'Line 1');
    assertContains(blocks[0].content, 'Line 2', 'Line 2');
    assertContains(blocks[0].content, 'Line 3', 'Line 3');
  });

  test('4.7.3 handles markdown content in block', () => {
    const template = `<!-- COMPLEXITY_GATE: level>=3 -->
## Header
- List item
**Bold text**
<!-- /COMPLEXITY_GATE -->`;
    const result = markerParser.processTemplate(template, { level: '3' });
    assertContains(result.content, '## Header', 'Header preserved');
    assertContains(result.content, '- List item', 'List preserved');
  });

  test('4.7.4 handles code blocks within marker block', () => {
    const template = `<!-- COMPLEXITY_GATE: level>=3 -->
\`\`\`javascript
const x = 1;
\`\`\`
<!-- /COMPLEXITY_GATE -->`;
    const result = markerParser.processTemplate(template, { level: '3' });
    assertContains(result.content, 'const x = 1;', 'Code preserved');
  });
});

// =============================================================================
// Summary
// =============================================================================

console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));

console.log(`\nTotal:   ${passed + failed + skipped}`);
console.log(`Passed:  ${passed}`);
console.log(`Failed:  ${failed}`);
console.log(`Skipped: ${skipped}`);

if (failures.length > 0) {
  console.log('\n--- FAILURES ---\n');
  for (const f of failures) {
    console.log(`Suite: ${f.suite}`);
    console.log(`Test:  ${f.name}`);
    console.log(`Error: ${f.error}\n`);
  }
}

// Per-suite summary
console.log('\n--- PER-SUITE RESULTS ---\n');
for (const suite of results.suites) {
  const status = suite.failed === 0 ? '✓' : '✗';
  console.log(`${status} ${suite.name}: ${suite.passed} passed, ${suite.failed} failed`);
}

process.exit(failed > 0 ? 1 : 0);
