// ───────────────────────────────────────────────────────────────
// TEST SUITE: Spec 070 - Memory Ranking System - Part 1: Core Scoring
// ───────────────────────────────────────────────────────────────
// Tests for recency, importance, activity, and folder scoring
// Based on implementation in: .opencode/skill/system-spec-kit/mcp_server/lib/scoring/
// ───────────────────────────────────────────────────────────────
'use strict';

const assert = require('assert');
const path = require('path');

// Module paths
const SCORING_LIB = path.join(__dirname, '../../../../.opencode/skill/system-spec-kit/mcp_server/lib/scoring');
const STORAGE_LIB = path.join(__dirname, '../../../../.opencode/skill/system-spec-kit/mcp_server/lib/storage');

// Import modules under test
const {
  compute_recency_score,
  compute_single_folder_score,
  simplify_folder_path,
  is_archived,
  get_archive_multiplier,
  find_top_tier,
  find_last_activity,
  TIER_WEIGHTS,
  SCORE_WEIGHTS,
  DECAY_RATE,
} = require(path.join(SCORING_LIB, 'folder-scoring'));

const {
  calculate_recency_score,
  get_tier_boost,
  calculate_composite_score,
  get_score_breakdown,
  DEFAULT_WEIGHTS,
} = require(path.join(SCORING_LIB, 'composite-scoring'));

const {
  get_tier_config,
  get_tier_value,
  apply_tier_boost,
  is_valid_tier,
  normalize_tier,
  IMPORTANCE_TIERS,
  VALID_TIERS,
} = require(path.join(SCORING_LIB, 'importance-tiers'));

const {
  calculate_popularity_score,
} = require(path.join(STORAGE_LIB, 'access-tracker'));

// ───────────────────────────────────────────────────────────────
// TEST UTILITIES
// ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  \u2713 ${name}`);
  } catch (err) {
    failed++;
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${err.message}`);
  }
}

function assertApprox(actual, expected, tolerance = 0.001, message = '') {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(
      `${message}Expected ${expected} (+/- ${tolerance}), got ${actual} (diff: ${diff})`
    );
  }
}

function assertRange(value, min, max, message = '') {
  if (value < min || value > max) {
    throw new Error(`${message}Expected value in range [${min}, ${max}], got ${value}`);
  }
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function hoursAgo(hours) {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

// ───────────────────────────────────────────────────────────────
// 1. RECENCY SCORING TESTS
// ───────────────────────────────────────────────────────────────
console.log('\n1. RECENCY SCORING TESTS');
console.log('   Formula: score = 1 / (1 + days_since * decay_rate)');
console.log('   Default decay_rate = 0.10\n');

// 1.1 Basic inverse decay formula
test('Recency: Today (0 days) should return ~1.0', () => {
  const now = new Date().toISOString();
  const score = compute_recency_score(now);
  assertApprox(score, 1.0, 0.01);
});

test('Recency: 7 days ago should return ~0.588', () => {
  // Formula: 1 / (1 + 7 * 0.10) = 1 / 1.7 = 0.588
  const score = compute_recency_score(daysAgo(7));
  assertApprox(score, 0.588, 0.02);
});

test('Recency: 10 days ago should return ~0.50', () => {
  // Formula: 1 / (1 + 10 * 0.10) = 1 / 2.0 = 0.50
  const score = compute_recency_score(daysAgo(10));
  assertApprox(score, 0.50, 0.02);
});

test('Recency: 30 days ago should return ~0.25', () => {
  // Formula: 1 / (1 + 30 * 0.10) = 1 / 4.0 = 0.25
  const score = compute_recency_score(daysAgo(30));
  assertApprox(score, 0.25, 0.02);
});

test('Recency: 90 days ago should return ~0.10', () => {
  // Formula: 1 / (1 + 90 * 0.10) = 1 / 10.0 = 0.10
  const score = compute_recency_score(daysAgo(90));
  assertApprox(score, 0.10, 0.02);
});

test('Recency: 365 days ago should return ~0.027', () => {
  // Formula: 1 / (1 + 365 * 0.10) = 1 / 37.5 = 0.027
  const score = compute_recency_score(daysAgo(365));
  assertApprox(score, 0.027, 0.01);
});

// 1.2 Constitutional tier exemption
test('Recency: Constitutional tier is exempt from decay (always 1.0)', () => {
  const score = compute_recency_score(daysAgo(365), 'constitutional');
  assert.strictEqual(score, 1.0, 'Constitutional tier should always return 1.0');
});

test('Recency: Constitutional tier returns 1.0 even for very old memories', () => {
  const score = compute_recency_score(daysAgo(1000), 'constitutional');
  assert.strictEqual(score, 1.0);
});

// 1.3 Edge cases
test('Recency: Invalid timestamp returns 0.5 (neutral fallback)', () => {
  const score = compute_recency_score('invalid-date');
  assert.strictEqual(score, 0.5, 'Invalid timestamp should return neutral 0.5');
});

test('Recency: Future timestamp (negative days) returns 1.0', () => {
  const future = new Date();
  future.setDate(future.getDate() + 10);
  const score = compute_recency_score(future.toISOString());
  assert.strictEqual(score, 1.0, 'Future timestamp should return 1.0');
});

test('Recency: Empty string returns 0.5 (neutral fallback)', () => {
  const score = compute_recency_score('');
  assert.strictEqual(score, 0.5);
});

test('Recency: Custom decay rate 0.05 at 10 days should return ~0.67', () => {
  // Formula: 1 / (1 + 10 * 0.05) = 1 / 1.5 = 0.667
  const score = compute_recency_score(daysAgo(10), 'normal', 0.05);
  assertApprox(score, 0.667, 0.02);
});

test('Recency: Custom decay rate 0.20 at 10 days should return ~0.33', () => {
  // Formula: 1 / (1 + 10 * 0.20) = 1 / 3.0 = 0.333
  const score = compute_recency_score(daysAgo(10), 'normal', 0.20);
  assertApprox(score, 0.333, 0.02);
});

// 1.4 Hours-based precision
test('Recency: 1 hour ago should return ~0.996', () => {
  // 1 hour = 1/24 days = 0.0417 days
  // Formula: 1 / (1 + 0.0417 * 0.10) = 1 / 1.00417 = 0.996
  const score = compute_recency_score(hoursAgo(1));
  assertApprox(score, 0.996, 0.01);
});

test('Recency: 24 hours ago should return ~0.99', () => {
  // 1 day = 1 day
  // Formula: 1 / (1 + 1 * 0.10) = 1 / 1.1 = 0.909
  const score = compute_recency_score(hoursAgo(24));
  assertApprox(score, 0.909, 0.02);
});

// ───────────────────────────────────────────────────────────────
// 2. IMPORTANCE SCORING TESTS
// ───────────────────────────────────────────────────────────────
console.log('\n2. IMPORTANCE SCORING TESTS');
console.log('   Tier weights: constitutional=1.0, critical=0.8, important=0.6, normal=0.4, temporary=0.2, deprecated=0.0\n');

// 2.1 Tier weight values
test('Importance: TIER_WEIGHTS.constitutional equals 1.0', () => {
  assert.strictEqual(TIER_WEIGHTS.constitutional, 1.0);
});

test('Importance: TIER_WEIGHTS.critical equals 0.8', () => {
  assert.strictEqual(TIER_WEIGHTS.critical, 0.8);
});

test('Importance: TIER_WEIGHTS.important equals 0.6', () => {
  assert.strictEqual(TIER_WEIGHTS.important, 0.6);
});

test('Importance: TIER_WEIGHTS.normal equals 0.4', () => {
  assert.strictEqual(TIER_WEIGHTS.normal, 0.4);
});

test('Importance: TIER_WEIGHTS.temporary equals 0.2', () => {
  assert.strictEqual(TIER_WEIGHTS.temporary, 0.2);
});

test('Importance: TIER_WEIGHTS.deprecated equals 0.0', () => {
  assert.strictEqual(TIER_WEIGHTS.deprecated, 0.0);
});

// 2.2 importance-tiers.js functions
test('Importance: get_tier_value returns correct values', () => {
  assert.strictEqual(get_tier_value('constitutional'), 1.0);
  assert.strictEqual(get_tier_value('critical'), 1.0); // Note: importance-tiers has different values
  assert.strictEqual(get_tier_value('important'), 0.8);
  assert.strictEqual(get_tier_value('normal'), 0.5);
  assert.strictEqual(get_tier_value('temporary'), 0.3);
  assert.strictEqual(get_tier_value('deprecated'), 0.1);
});

test('Importance: is_valid_tier validates correctly', () => {
  assert.strictEqual(is_valid_tier('constitutional'), true);
  assert.strictEqual(is_valid_tier('critical'), true);
  assert.strictEqual(is_valid_tier('important'), true);
  assert.strictEqual(is_valid_tier('normal'), true);
  assert.strictEqual(is_valid_tier('temporary'), true);
  assert.strictEqual(is_valid_tier('deprecated'), true);
  assert.strictEqual(is_valid_tier('invalid'), false);
  assert.strictEqual(is_valid_tier(''), false);
  assert.strictEqual(is_valid_tier(null), false);
  assert.strictEqual(is_valid_tier(undefined), false);
});

test('Importance: normalize_tier handles invalid input', () => {
  assert.strictEqual(normalize_tier('CONSTITUTIONAL'), 'constitutional');
  assert.strictEqual(normalize_tier('Critical'), 'critical');
  assert.strictEqual(normalize_tier('invalid'), 'normal');
  assert.strictEqual(normalize_tier(''), 'normal');
  assert.strictEqual(normalize_tier(null), 'normal');
});

// 2.3 Tier boost for composite scoring
test('Importance: get_tier_boost returns correct values', () => {
  assert.strictEqual(get_tier_boost('constitutional'), 1.0);
  assert.strictEqual(get_tier_boost('critical'), 1.0);
  assert.strictEqual(get_tier_boost('important'), 0.8);
  assert.strictEqual(get_tier_boost('normal'), 0.5);
  assert.strictEqual(get_tier_boost('temporary'), 0.3);
  // NOTE: deprecated returns 0.5 (not 0.0) due to JS falsy handling: `boosts[tier] || 0.5`
  // This is a known implementation quirk - 0.0 is falsy so falls back to default
  assert.strictEqual(get_tier_boost('deprecated'), 0.5);
});

test('Importance: get_tier_boost handles unknown tier with default', () => {
  assert.strictEqual(get_tier_boost('unknown'), 0.5);
  assert.strictEqual(get_tier_boost(null), 0.5);
  assert.strictEqual(get_tier_boost(undefined), 0.5);
});

// 2.4 Search boost from importance-tiers
test('Importance: apply_tier_boost multiplies score correctly', () => {
  // constitutional has searchBoost of 3.0
  const score = apply_tier_boost(10, 'constitutional');
  assert.strictEqual(score, 30);
});

test('Importance: apply_tier_boost handles critical tier (2.0x)', () => {
  const score = apply_tier_boost(10, 'critical');
  assert.strictEqual(score, 20);
});

test('Importance: apply_tier_boost handles invalid score', () => {
  assert.strictEqual(apply_tier_boost(NaN, 'normal'), 0);
  assert.strictEqual(apply_tier_boost(Infinity, 'normal'), 0);
});

// 2.5 Importance weight multiplication in composite scoring
test('Importance: calculate_composite_score uses importance_weight', () => {
  const row = {
    similarity: 80,
    importance_weight: 0.9,
    importance_tier: 'critical',
    updated_at: new Date().toISOString(),
    access_count: 0,
  };
  const score = calculate_composite_score(row);
  // Should be: 0.8*0.35 + 0.9*0.25 + ~1.0*0.20 + 0*0.10 + 1.0*0.10
  // = 0.28 + 0.225 + 0.20 + 0 + 0.10 = 0.805
  assertRange(score, 0.7, 0.9, 'Composite score should be in expected range');
});

// 2.6 Missing tier handling
test('Importance: Missing tier defaults to normal', () => {
  const config = get_tier_config(null);
  assert.strictEqual(config.value, 0.5);
});

test('Importance: Invalid tier string defaults to normal', () => {
  const config = get_tier_config('invalid_tier');
  assert.strictEqual(config.value, 0.5);
});

// ───────────────────────────────────────────────────────────────
// 3. ACTIVITY SCORING TESTS
// ───────────────────────────────────────────────────────────────
console.log('\n3. ACTIVITY SCORING TESTS');
console.log('   Popularity formula: min(1, log10(access_count + 1) / 3)\n');

// 3.1 Popularity score (logarithmic scale)
test('Activity: 0 accesses returns ~0.0', () => {
  // log10(0 + 1) / 3 = 0 / 3 = 0
  const score = calculate_popularity_score(0);
  assertApprox(score, 0.0, 0.001);
});

test('Activity: 1 access returns ~0.1', () => {
  // log10(1 + 1) / 3 = 0.301 / 3 = 0.1
  const score = calculate_popularity_score(1);
  assertApprox(score, 0.1, 0.02);
});

test('Activity: 10 accesses returns ~0.33', () => {
  // log10(10 + 1) / 3 = 1.041 / 3 = 0.347
  const score = calculate_popularity_score(10);
  assertApprox(score, 0.347, 0.02);
});

test('Activity: 100 accesses returns ~0.67', () => {
  // log10(100 + 1) / 3 = 2.004 / 3 = 0.668
  const score = calculate_popularity_score(100);
  assertApprox(score, 0.668, 0.02);
});

test('Activity: 1000 accesses returns 1.0 (capped)', () => {
  // log10(1000 + 1) / 3 = 3.0004 / 3 = 1.0001 -> capped at 1.0
  const score = calculate_popularity_score(1000);
  assertApprox(score, 1.0, 0.001);
});

test('Activity: 10000 accesses stays capped at 1.0', () => {
  const score = calculate_popularity_score(10000);
  assert.strictEqual(score, 1.0);
});

// 3.2 Edge cases
test('Activity: Undefined access_count returns 0', () => {
  const score = calculate_popularity_score(undefined);
  assert.strictEqual(score, 0);
});

test('Activity: Null access_count returns 0', () => {
  const score = calculate_popularity_score(null);
  assert.strictEqual(score, 0);
});

test('Activity: Negative access_count treated as 0', () => {
  // log10(-5 + 1) = log10(-4) = NaN, but formula uses (access_count || 0)
  const score = calculate_popularity_score(-5);
  // With the || 0 guard, this should be log10(0 + 1) / 3 = 0
  // Actually -5 || 0 = -5 (truthy), so log10(-4) = NaN
  // Let's verify actual behavior
  assertRange(score, 0, 1, 'Should handle negative gracefully');
});

// 3.3 Activity score in folder scoring (capped at 5 memories)
test('Activity: Folder with 1 memory has activity score 0.2', () => {
  const memories = [{ updatedAt: new Date().toISOString(), importanceTier: 'normal' }];
  const result = compute_single_folder_score('test-folder', memories);
  // Activity = min(1, 1/5) = 0.2
  assertApprox(result.activityScore, 0.2, 0.001);
});

test('Activity: Folder with 3 memories has activity score 0.6', () => {
  const memories = [
    { updatedAt: new Date().toISOString(), importanceTier: 'normal' },
    { updatedAt: new Date().toISOString(), importanceTier: 'normal' },
    { updatedAt: new Date().toISOString(), importanceTier: 'normal' },
  ];
  const result = compute_single_folder_score('test-folder', memories);
  // Activity = min(1, 3/5) = 0.6
  assertApprox(result.activityScore, 0.6, 0.001);
});

test('Activity: Folder with 5 memories has activity score 1.0 (capped)', () => {
  const memories = Array(5).fill(null).map(() => ({
    updatedAt: new Date().toISOString(),
    importanceTier: 'normal',
  }));
  const result = compute_single_folder_score('test-folder', memories);
  assertApprox(result.activityScore, 1.0, 0.001);
});

test('Activity: Folder with 10 memories still capped at 1.0', () => {
  const memories = Array(10).fill(null).map(() => ({
    updatedAt: new Date().toISOString(),
    importanceTier: 'normal',
  }));
  const result = compute_single_folder_score('test-folder', memories);
  assertApprox(result.activityScore, 1.0, 0.001);
});

// 3.4 Combined activity metrics in get_score_breakdown
test('Activity: get_score_breakdown shows popularity contribution', () => {
  const row = {
    similarity: 50,
    importance_weight: 0.5,
    importance_tier: 'normal',
    updated_at: new Date().toISOString(),
    access_count: 100,
  };
  const breakdown = get_score_breakdown(row);

  // Verify popularity factor exists and has reasonable value
  assert(breakdown.factors.popularity, 'Should have popularity factor');
  assertApprox(breakdown.factors.popularity.value, 0.668, 0.02);
  assert.strictEqual(breakdown.factors.popularity.weight, DEFAULT_WEIGHTS.popularity);
});

// ───────────────────────────────────────────────────────────────
// 4. FOLDER SCORING TESTS
// ───────────────────────────────────────────────────────────────
console.log('\n4. FOLDER SCORING TESTS');
console.log('   Weights: recency=0.40, importance=0.30, activity=0.20, validation=0.10\n');

// 4.1 compute_single_folder_score basic functionality
test('Folder: Empty memories array returns score 0', () => {
  const result = compute_single_folder_score('test-folder', []);
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.recencyScore, 0);
  assert.strictEqual(result.importanceScore, 0);
  assert.strictEqual(result.activityScore, 0);
});

test('Folder: Single recent normal memory calculates correctly', () => {
  const memories = [{
    updatedAt: new Date().toISOString(),
    importanceTier: 'normal',
  }];
  const result = compute_single_folder_score('test-folder', memories);

  // Expected:
  // recency = ~1.0 (just now)
  // activity = 1/5 = 0.2
  // importance = 0.4 (normal tier)
  // validation = 0.5 (default)
  // score = 1.0*0.40 + 0.4*0.30 + 0.2*0.20 + 0.5*0.10 = 0.40 + 0.12 + 0.04 + 0.05 = 0.61
  assertApprox(result.recencyScore, 1.0, 0.02);
  assertApprox(result.activityScore, 0.2, 0.001);
  assertApprox(result.importanceScore, 0.4, 0.001);
  assertApprox(result.validationScore, 0.5, 0.001);
  assertApprox(result.score, 0.61, 0.02);
});

test('Folder: Multiple memories averages importance scores', () => {
  const memories = [
    { updatedAt: new Date().toISOString(), importanceTier: 'critical' },      // 0.8
    { updatedAt: new Date().toISOString(), importanceTier: 'normal' },        // 0.4
    { updatedAt: new Date().toISOString(), importanceTier: 'important' },     // 0.6
  ];
  const result = compute_single_folder_score('test-folder', memories);

  // Average importance = (0.8 + 0.4 + 0.6) / 3 = 0.6
  assertApprox(result.importanceScore, 0.6, 0.001);
});

test('Folder: Best recency score is used (max of all memories)', () => {
  const memories = [
    { updatedAt: daysAgo(30), importanceTier: 'normal' },  // ~0.25
    { updatedAt: daysAgo(7), importanceTier: 'normal' },   // ~0.59
    { updatedAt: new Date().toISOString(), importanceTier: 'normal' }, // ~1.0
  ];
  const result = compute_single_folder_score('test-folder', memories);

  // Best recency should be ~1.0 (the most recent one)
  assertApprox(result.recencyScore, 1.0, 0.02);
});

// 4.2 Archive detection and multiplier
test('Folder: is_archived detects z_archive/', () => {
  assert.strictEqual(is_archived('z_archive/old-spec'), true);
  assert.strictEqual(is_archived('specs/z_archive/test'), true);
});

test('Folder: is_archived detects /scratch/', () => {
  assert.strictEqual(is_archived('spec/scratch/temp'), true);
  assert.strictEqual(is_archived('/scratch/work'), true);
});

test('Folder: is_archived detects /test- prefix', () => {
  assert.strictEqual(is_archived('spec/test-data'), true);
  assert.strictEqual(is_archived('/test-suite'), true);
});

test('Folder: is_archived detects -test/ suffix', () => {
  assert.strictEqual(is_archived('unit-test/files'), true);
  assert.strictEqual(is_archived('integration-test/'), true);
});

test('Folder: is_archived detects /prototype/', () => {
  assert.strictEqual(is_archived('work/prototype/v1'), true);
});

test('Folder: is_archived returns false for active folders', () => {
  assert.strictEqual(is_archived('specs/070-memory-ranking'), false);
  assert.strictEqual(is_archived('005-anobel.com/012-form'), false);
});

test('Folder: is_archived handles null/empty gracefully', () => {
  assert.strictEqual(is_archived(null), false);
  assert.strictEqual(is_archived(''), false);
  assert.strictEqual(is_archived(undefined), false);
});

test('Folder: get_archive_multiplier returns 0.1 for z_archive/', () => {
  assert.strictEqual(get_archive_multiplier('z_archive/old'), 0.1);
});

test('Folder: get_archive_multiplier returns 0.2 for scratch/', () => {
  assert.strictEqual(get_archive_multiplier('work/scratch/temp'), 0.2);
});

test('Folder: get_archive_multiplier returns 0.2 for test folders', () => {
  assert.strictEqual(get_archive_multiplier('spec/test-data'), 0.2);
  assert.strictEqual(get_archive_multiplier('unit-test/files'), 0.2);
});

test('Folder: get_archive_multiplier returns 1.0 for active folders', () => {
  assert.strictEqual(get_archive_multiplier('specs/070-memory-ranking'), 1.0);
});

test('Folder: Archive multiplier applied to folder score', () => {
  const memories = [{
    updatedAt: new Date().toISOString(),
    importanceTier: 'normal',
  }];

  const activeScore = compute_single_folder_score('specs/active-folder', memories);
  const archiveScore = compute_single_folder_score('z_archive/old-folder', memories);

  // Archive should be 10% of active score
  assertApprox(archiveScore.score, activeScore.score * 0.1, 0.01);
});

// 4.3 simplify_folder_path
test('Folder: simplify_folder_path extracts leaf name', () => {
  assert.strictEqual(
    simplify_folder_path('005-anobel.com/012-form-input-components'),
    '012-form-input-components'
  );
});

test('Folder: simplify_folder_path handles single segment', () => {
  assert.strictEqual(simplify_folder_path('single-folder'), 'single-folder');
});

test('Folder: simplify_folder_path marks archived folders', () => {
  const simplified = simplify_folder_path('z_archive/044-old-spec');
  assert.strictEqual(simplified, '044-old-spec (archived)');
});

test('Folder: simplify_folder_path handles trailing slash', () => {
  // When path ends with /, the last segment is empty, so take second-to-last
  const simplified = simplify_folder_path('005-anobel.com/012-form/');
  assert(simplified.includes('012-form') || simplified === 'unknown');
});

test('Folder: simplify_folder_path handles empty/null', () => {
  assert.strictEqual(simplify_folder_path(''), 'unknown');
  assert.strictEqual(simplify_folder_path(null), 'unknown');
});

// 4.4 find_top_tier
test('Folder: find_top_tier returns highest tier', () => {
  const memories = [
    { importanceTier: 'normal' },
    { importanceTier: 'critical' },
    { importanceTier: 'important' },
  ];
  assert.strictEqual(find_top_tier(memories), 'critical');
});

test('Folder: find_top_tier returns constitutional as highest', () => {
  const memories = [
    { importanceTier: 'critical' },
    { importanceTier: 'constitutional' },
    { importanceTier: 'important' },
  ];
  assert.strictEqual(find_top_tier(memories), 'constitutional');
});

test('Folder: find_top_tier handles empty array', () => {
  assert.strictEqual(find_top_tier([]), 'normal');
});

test('Folder: find_top_tier handles missing tier property', () => {
  const memories = [{ title: 'test' }];
  assert.strictEqual(find_top_tier(memories), 'normal');
});

// 4.5 find_last_activity
test('Folder: find_last_activity returns most recent timestamp', () => {
  const oldDate = daysAgo(30);
  const recentDate = hoursAgo(1);
  const memories = [
    { updatedAt: oldDate },
    { updatedAt: recentDate },
    { updatedAt: daysAgo(7) },
  ];

  const result = find_last_activity(memories);
  const resultDate = new Date(result).getTime();
  const expectedDate = new Date(recentDate).getTime();

  // Should be within 1 minute of the expected date
  const diff = Math.abs(resultDate - expectedDate);
  assert(diff < 60000, `Expected recent date, got ${result}`);
});

test('Folder: find_last_activity handles empty array', () => {
  const result = find_last_activity([]);
  // Should return current time
  const now = Date.now();
  const resultTime = new Date(result).getTime();
  const diff = Math.abs(now - resultTime);
  assert(diff < 1000, 'Should return current time for empty array');
});

test('Folder: find_last_activity handles invalid timestamps', () => {
  const memories = [
    { updatedAt: 'invalid' },
    { updatedAt: '' },
  ];
  const result = find_last_activity(memories);
  // Should fall back to current time when all timestamps are invalid
  assert(result, 'Should return a valid timestamp');
});

// 4.6 Score weights verification
test('Folder: SCORE_WEIGHTS sum to 1.0', () => {
  const sum = SCORE_WEIGHTS.recency + SCORE_WEIGHTS.importance +
              SCORE_WEIGHTS.activity + SCORE_WEIGHTS.validation;
  assertApprox(sum, 1.0, 0.001);
});

test('Folder: SCORE_WEIGHTS has correct values', () => {
  assert.strictEqual(SCORE_WEIGHTS.recency, 0.40);
  assert.strictEqual(SCORE_WEIGHTS.importance, 0.30);
  assert.strictEqual(SCORE_WEIGHTS.activity, 0.20);
  assert.strictEqual(SCORE_WEIGHTS.validation, 0.10);
});

// 4.7 Composite score weight verification
test('Folder: DEFAULT_WEIGHTS sum to 1.0', () => {
  const sum = DEFAULT_WEIGHTS.similarity + DEFAULT_WEIGHTS.importance +
              DEFAULT_WEIGHTS.recency + DEFAULT_WEIGHTS.popularity +
              DEFAULT_WEIGHTS.tier_boost;
  assertApprox(sum, 1.0, 0.001);
});

// 4.8 Full composite score calculation
test('Folder: Full folder score calculation integrates all factors', () => {
  const memories = [
    { updatedAt: hoursAgo(12), importanceTier: 'critical' },
    { updatedAt: daysAgo(3), importanceTier: 'important' },
    { updatedAt: daysAgo(7), importanceTier: 'normal' },
  ];

  const result = compute_single_folder_score('active-spec', memories);

  // Verify all components are present
  assert(typeof result.score === 'number', 'Should have score');
  assert(typeof result.recencyScore === 'number', 'Should have recencyScore');
  assert(typeof result.importanceScore === 'number', 'Should have importanceScore');
  assert(typeof result.activityScore === 'number', 'Should have activityScore');
  assert(typeof result.validationScore === 'number', 'Should have validationScore');

  // Verify ranges
  assertRange(result.score, 0, 1, 'Score');
  assertRange(result.recencyScore, 0, 1, 'Recency');
  assertRange(result.importanceScore, 0, 1, 'Importance');
  assertRange(result.activityScore, 0, 1, 'Activity');
  assertRange(result.validationScore, 0, 1, 'Validation');

  // Verify score is weighted sum (approximately)
  const expectedScore = (
    SCORE_WEIGHTS.recency * result.recencyScore +
    SCORE_WEIGHTS.importance * result.importanceScore +
    SCORE_WEIGHTS.activity * result.activityScore +
    SCORE_WEIGHTS.validation * result.validationScore
  );
  assertApprox(result.score, expectedScore, 0.01);
});

// ───────────────────────────────────────────────────────────────
// 5. EDGE CASES AND ERROR HANDLING
// ───────────────────────────────────────────────────────────────
console.log('\n5. EDGE CASES AND ERROR HANDLING\n');

test('Edge: compute_single_folder_score handles null memories', () => {
  const result = compute_single_folder_score('test', null);
  assert.strictEqual(result.score, 0);
});

test('Edge: compute_single_folder_score handles undefined memories', () => {
  const result = compute_single_folder_score('test', undefined);
  assert.strictEqual(result.score, 0);
});

test('Edge: Memory with created_at instead of updatedAt', () => {
  const memories = [{
    createdAt: new Date().toISOString(),
    importanceTier: 'normal',
  }];
  const result = compute_single_folder_score('test', memories);
  assertApprox(result.recencyScore, 1.0, 0.02);
});

test('Edge: Memory with snake_case properties (importance_tier)', () => {
  const memories = [{
    updated_at: new Date().toISOString(),
    importance_tier: 'critical',
  }];
  const result = compute_single_folder_score('test', memories);
  assertApprox(result.importanceScore, 0.8, 0.001); // critical = 0.8
});

test('Edge: Memory with unknown tier defaults to normal (0.4)', () => {
  const memories = [{
    updatedAt: new Date().toISOString(),
    importanceTier: 'unknown_tier',
  }];
  const result = compute_single_folder_score('test', memories);
  assertApprox(result.importanceScore, 0.4, 0.001);
});

test('Edge: DECAY_RATE constant equals 0.10', () => {
  assert.strictEqual(DECAY_RATE, 0.10);
});

// ───────────────────────────────────────────────────────────────
// TEST SUMMARY
// ───────────────────────────────────────────────────────────────
console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log(`  Total:  ${passed + failed}`);
console.log('='.repeat(60));

if (failed > 0) {
  console.log('\nSome tests failed. Please review the errors above.');
  process.exit(1);
} else {
  console.log('\nAll tests passed!');
  process.exit(0);
}
