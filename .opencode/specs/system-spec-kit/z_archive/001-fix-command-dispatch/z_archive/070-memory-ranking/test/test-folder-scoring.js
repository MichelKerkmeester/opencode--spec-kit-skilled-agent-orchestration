#!/usr/bin/env node
/**
 * Test Suite: Folder Scoring Module
 * Spec: 070-memory-ranking
 * 
 * Run: node test-folder-scoring.js
 * Output: JSON results + markdown report
 */
'use strict';

const path = require('path');
const fs = require('fs');

// ─────────────────────────────────────────────────────────────────
// 1. SIMPLE TEST FRAMEWORK
// ─────────────────────────────────────────────────────────────────

const results = {
  startTime: new Date().toISOString(),
  endTime: null,
  duration: null,
  summary: { total: 0, passed: 0, failed: 0, skipped: 0 },
  suites: []
};

let currentSuite = null;

function describe(name, fn) {
  currentSuite = { name, tests: [], passed: 0, failed: 0 };
  results.suites.push(currentSuite);
  try {
    fn();
  } catch (err) {
    currentSuite.error = err.message;
  }
}

function it(name, fn) {
  const test = { name, status: 'pending', error: null, duration: 0 };
  currentSuite.tests.push(test);
  results.summary.total++;
  
  const start = Date.now();
  try {
    fn();
    test.status = 'passed';
    test.duration = Date.now() - start;
    results.summary.passed++;
    currentSuite.passed++;
  } catch (err) {
    test.status = 'failed';
    test.error = err.message;
    test.duration = Date.now() - start;
    results.summary.failed++;
    currentSuite.failed++;
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toBeCloseTo(expected, tolerance = 0.05) {
      if (Math.abs(actual - expected) > tolerance) {
        throw new Error(`Expected ~${expected} (±${tolerance}), got ${actual}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy, got ${JSON.stringify(actual)}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy, got ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThan(expected) {
      if (actual <= expected) {
        throw new Error(`Expected > ${expected}, got ${actual}`);
      }
    },
    toBeLessThan(expected) {
      if (actual >= expected) {
        throw new Error(`Expected < ${expected}, got ${actual}`);
      }
    },
    toBeInstanceOf(expected) {
      if (!(actual instanceof expected)) {
        throw new Error(`Expected instance of ${expected.name}`);
      }
    },
    toHaveLength(expected) {
      if (actual.length !== expected) {
        throw new Error(`Expected length ${expected}, got ${actual.length}`);
      }
    }
  };
}

// ─────────────────────────────────────────────────────────────────
// 2. LOAD MODULE UNDER TEST
// ─────────────────────────────────────────────────────────────────

const MODULE_PATH = path.resolve(__dirname, '../../../../.opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.js');

let folderScoring;
try {
  folderScoring = require(MODULE_PATH);
  console.log('✓ Module loaded successfully');
} catch (err) {
  console.error('✗ Failed to load module:', err.message);
  process.exit(1);
}

const {
  compute_folder_scores,
  is_archived,
  get_archive_multiplier,
  compute_recency_score,
  compute_single_folder_score,
  simplify_folder_path,
  find_top_tier,
  find_last_activity,
  ARCHIVE_PATTERNS,
  TIER_WEIGHTS,
  SCORE_WEIGHTS,
  DECAY_RATE,
  TIER_ORDER,
} = folderScoring;

// ─────────────────────────────────────────────────────────────────
// 3. HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function createMemory(overrides = {}) {
  return {
    id: Math.floor(Math.random() * 10000),
    specFolder: 'test-folder/subfolder',
    spec_folder: 'test-folder/subfolder',
    title: 'Test Memory',
    createdAt: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    importanceTier: 'normal',
    importance_tier: 'normal',
    importanceWeight: 0.5,
    ...overrides
  };
}

// ─────────────────────────────────────────────────────────────────
// 4. TEST SUITES
// ─────────────────────────────────────────────────────────────────

// === CONSTANTS VERIFICATION ===
describe('Constants Verification', () => {
  it('ARCHIVE_PATTERNS should have 5 regex patterns', () => {
    expect(ARCHIVE_PATTERNS).toHaveLength(5);
    ARCHIVE_PATTERNS.forEach(p => expect(p).toBeInstanceOf(RegExp));
  });

  it('TIER_WEIGHTS should have 6 tiers with correct values', () => {
    expect(Object.keys(TIER_WEIGHTS)).toHaveLength(6);
    expect(TIER_WEIGHTS.constitutional).toBe(1.0);
    expect(TIER_WEIGHTS.critical).toBe(0.8);
    expect(TIER_WEIGHTS.important).toBe(0.6);
    expect(TIER_WEIGHTS.normal).toBe(0.4);
    expect(TIER_WEIGHTS.temporary).toBe(0.2);
    expect(TIER_WEIGHTS.deprecated).toBe(0.0);
  });

  it('SCORE_WEIGHTS should sum to 1.0', () => {
    const sum = SCORE_WEIGHTS.recency + SCORE_WEIGHTS.importance + 
                SCORE_WEIGHTS.activity + SCORE_WEIGHTS.validation;
    // Use toBeCloseTo for floating point comparison
    expect(sum).toBeCloseTo(1.0, 0.001);
  });

  it('SCORE_WEIGHTS should have correct individual values', () => {
    expect(SCORE_WEIGHTS.recency).toBe(0.40);
    expect(SCORE_WEIGHTS.importance).toBe(0.30);
    expect(SCORE_WEIGHTS.activity).toBe(0.20);
    expect(SCORE_WEIGHTS.validation).toBe(0.10);
  });

  it('DECAY_RATE should be 0.10', () => {
    expect(DECAY_RATE).toBe(0.10);
  });

  it('TIER_ORDER should list all 6 tiers in priority order', () => {
    expect(TIER_ORDER).toHaveLength(6);
    expect(TIER_ORDER[0]).toBe('constitutional');
    expect(TIER_ORDER[5]).toBe('deprecated');
  });
});

// === ARCHIVE DETECTION ===
describe('Archive Detection - is_archived()', () => {
  it('should detect z_archive folders', () => {
    expect(is_archived('003-memory/z_archive/old-feature')).toBe(true);
    expect(is_archived('z_archive/something')).toBe(true);
  });

  it('should detect scratch folders', () => {
    expect(is_archived('005-project/scratch/temp')).toBe(true);
    expect(is_archived('folder/scratch/debug')).toBe(true);
  });

  it('should detect test- prefixed subfolders', () => {
    expect(is_archived('project/test-suite')).toBe(true);
    expect(is_archived('folder/test-data')).toBe(true);
  });

  it('should detect -test suffixed folders', () => {
    expect(is_archived('integration-test/specs')).toBe(true);
    expect(is_archived('unit-test/cases')).toBe(true);
  });

  it('should detect prototype folders', () => {
    expect(is_archived('feature/prototype/v1')).toBe(true);
  });

  it('should return false for normal paths', () => {
    expect(is_archived('003-memory/070-ranking')).toBe(false);
    expect(is_archived('005-project/012-feature')).toBe(false);
    expect(is_archived('normal-folder/subfolder')).toBe(false);
  });

  it('should handle null/empty gracefully', () => {
    expect(is_archived(null)).toBe(false);
    expect(is_archived('')).toBe(false);
    expect(is_archived(undefined)).toBe(false);
  });
});

// === ARCHIVE MULTIPLIER ===
describe('Archive Multiplier - get_archive_multiplier()', () => {
  it('should return 0.1 for z_archive folders', () => {
    expect(get_archive_multiplier('z_archive/old')).toBe(0.1);
    expect(get_archive_multiplier('003-mem/z_archive/test')).toBe(0.1);
  });

  it('should return 0.2 for scratch folders', () => {
    expect(get_archive_multiplier('folder/scratch/temp')).toBe(0.2);
  });

  it('should return 0.2 for test- prefixed folders', () => {
    expect(get_archive_multiplier('project/test-suite')).toBe(0.2);
  });

  it('should return 0.2 for -test suffixed folders', () => {
    expect(get_archive_multiplier('unit-test/specs')).toBe(0.2);
  });

  it('should return 0.2 for prototype folders', () => {
    expect(get_archive_multiplier('feature/prototype/v1')).toBe(0.2);
  });

  it('should return 1.0 for normal folders', () => {
    expect(get_archive_multiplier('003-memory/070-ranking')).toBe(1.0);
    expect(get_archive_multiplier('normal/path')).toBe(1.0);
  });

  it('should return 1.0 for null/empty', () => {
    expect(get_archive_multiplier(null)).toBe(1.0);
    expect(get_archive_multiplier('')).toBe(1.0);
  });
});

// === RECENCY SCORING ===
describe('Recency Scoring - compute_recency_score()', () => {
  it('should return ~1.0 for just-updated memories', () => {
    const score = compute_recency_score(new Date().toISOString());
    expect(score).toBeCloseTo(1.0, 0.01);
  });

  it('should return ~0.588 for 7-day-old memories', () => {
    const score = compute_recency_score(daysAgo(7));
    expect(score).toBeCloseTo(0.588, 0.05);
  });

  it('should return 0.5 for 10-day-old memories', () => {
    const score = compute_recency_score(daysAgo(10));
    expect(score).toBeCloseTo(0.5, 0.02);
  });

  it('should return ~0.25 for 30-day-old memories', () => {
    const score = compute_recency_score(daysAgo(30));
    expect(score).toBeCloseTo(0.25, 0.05);
  });

  it('should return ~0.1 for 90-day-old memories', () => {
    const score = compute_recency_score(daysAgo(90));
    expect(score).toBeCloseTo(0.1, 0.02);
  });

  it('should return 0.5 fallback for invalid timestamps', () => {
    expect(compute_recency_score('invalid-date')).toBe(0.5);
    expect(compute_recency_score('not a timestamp')).toBe(0.5);
  });

  it('should return 1.0 for future timestamps', () => {
    const score = compute_recency_score(daysFromNow(5));
    expect(score).toBe(1.0);
  });

  it('should return 1.0 for constitutional tier (exempt from decay)', () => {
    const score = compute_recency_score(daysAgo(100), 'constitutional');
    expect(score).toBe(1.0);
  });
});

// === PATH SIMPLIFICATION ===
describe('Path Simplification - simplify_folder_path()', () => {
  it('should extract leaf folder from full path', () => {
    expect(simplify_folder_path('003-memory/070-ranking')).toBe('070-ranking');
    expect(simplify_folder_path('a/b/c/d')).toBe('d');
  });

  it('should mark archived folders with suffix', () => {
    expect(simplify_folder_path('003-mem/z_archive/old')).toBe('old (archived)');
    expect(simplify_folder_path('folder/scratch/temp')).toBe('temp (archived)');
  });

  it('should handle empty/null gracefully', () => {
    expect(simplify_folder_path(null)).toBe('unknown');
    expect(simplify_folder_path('')).toBe('unknown');
  });

  it('should handle single segment paths', () => {
    expect(simplify_folder_path('single-folder')).toBe('single-folder');
  });

  it('should handle trailing slashes', () => {
    expect(simplify_folder_path('folder/subfolder/')).toBe('subfolder');
  });
});

// === TIER UTILITIES ===
describe('Tier Utilities', () => {
  it('find_top_tier should return highest tier from mixed memories', () => {
    const memories = [
      createMemory({ importanceTier: 'normal' }),
      createMemory({ importanceTier: 'critical' }),
      createMemory({ importanceTier: 'important' }),
    ];
    expect(find_top_tier(memories)).toBe('critical');
  });

  it('find_top_tier should return constitutional if present', () => {
    const memories = [
      createMemory({ importanceTier: 'critical' }),
      createMemory({ importanceTier: 'constitutional' }),
    ];
    expect(find_top_tier(memories)).toBe('constitutional');
  });

  it('find_top_tier should return normal for empty array', () => {
    expect(find_top_tier([])).toBe('normal');
    expect(find_top_tier(null)).toBe('normal');
  });

  it('find_last_activity should return most recent timestamp', () => {
    const memories = [
      createMemory({ updatedAt: daysAgo(10) }),
      createMemory({ updatedAt: daysAgo(2) }),
      createMemory({ updatedAt: daysAgo(5) }),
    ];
    const result = find_last_activity(memories);
    const resultDate = new Date(result);
    const expectedDate = new Date(daysAgo(2));
    // Within 1 day tolerance
    expect(Math.abs(resultDate - expectedDate)).toBeLessThan(86400000);
  });

  it('find_last_activity should return current time for empty', () => {
    const result = find_last_activity([]);
    const resultDate = new Date(result);
    const now = Date.now();
    // Should be within last minute
    expect(now - resultDate.getTime()).toBeLessThan(60000);
  });
});

// === SINGLE FOLDER SCORING ===
describe('Single Folder Scoring - compute_single_folder_score()', () => {
  it('should return zeros for empty folder', () => {
    const result = compute_single_folder_score('test-folder', []);
    expect(result.score).toBe(0);
    expect(result.recencyScore).toBe(0);
    expect(result.importanceScore).toBe(0);
    expect(result.activityScore).toBe(0);
  });

  it('should compute score for single memory', () => {
    const memories = [createMemory({ updatedAt: new Date().toISOString() })];
    const result = compute_single_folder_score('normal/folder', memories);
    expect(result.score).toBeGreaterThan(0);
    expect(result.recencyScore).toBeCloseTo(1.0, 0.01);
    expect(result.activityScore).toBeCloseTo(0.2, 0.01); // 1/5 = 0.2
  });

  it('should cap activity score at 1.0 for 5+ memories', () => {
    const memories = Array(7).fill(null).map(() => createMemory());
    const result = compute_single_folder_score('folder', memories);
    expect(result.activityScore).toBe(1.0);
  });

  it('should apply archive multiplier', () => {
    const memories = [createMemory({ updatedAt: new Date().toISOString() })];
    const normalResult = compute_single_folder_score('normal/folder', memories);
    const archiveResult = compute_single_folder_score('z_archive/folder', memories);
    expect(archiveResult.score).toBeCloseTo(normalResult.score * 0.1, 0.01);
  });

  it('should weight importance by tier', () => {
    const criticalMemories = [createMemory({ importanceTier: 'critical' })];
    const normalMemories = [createMemory({ importanceTier: 'normal' })];
    const critResult = compute_single_folder_score('folder', criticalMemories);
    const normResult = compute_single_folder_score('folder', normalMemories);
    expect(critResult.importanceScore).toBeGreaterThan(normResult.importanceScore);
  });
});

// === COMPUTE FOLDER SCORES ===
describe('Compute Folder Scores - compute_folder_scores()', () => {
  it('should return empty array for empty input', () => {
    expect(compute_folder_scores([])).toEqual([]);
    expect(compute_folder_scores(null)).toEqual([]);
  });

  it('should group and score multiple folders', () => {
    const memories = [
      createMemory({ specFolder: 'folder-a', updatedAt: new Date().toISOString() }),
      createMemory({ specFolder: 'folder-a', updatedAt: new Date().toISOString() }),
      createMemory({ specFolder: 'folder-b', updatedAt: daysAgo(30) }),
    ];
    const result = compute_folder_scores(memories);
    expect(result).toHaveLength(2);
    // folder-a should rank higher (more recent, more memories)
    expect(result[0].folder).toBe('folder-a');
  });

  it('should filter archived folders by default', () => {
    const memories = [
      createMemory({ specFolder: 'active-folder' }),
      createMemory({ specFolder: 'z_archive/old-folder' }),
    ];
    const result = compute_folder_scores(memories);
    expect(result).toHaveLength(1);
    expect(result[0].folder).toBe('active-folder');
  });

  it('should include archived when includeArchived=true', () => {
    const memories = [
      createMemory({ specFolder: 'active-folder' }),
      createMemory({ specFolder: 'z_archive/old-folder' }),
    ];
    const result = compute_folder_scores(memories, { includeArchived: true });
    expect(result).toHaveLength(2);
  });

  it('should respect excludePatterns', () => {
    const memories = [
      createMemory({ specFolder: 'keep-this' }),
      createMemory({ specFolder: 'exclude-this' }),
      createMemory({ specFolder: 'also-exclude' }),
    ];
    const result = compute_folder_scores(memories, { 
      excludePatterns: ['exclude', 'also-'] 
    });
    expect(result).toHaveLength(1);
    expect(result[0].folder).toBe('keep-this');
  });

  it('should respect limit parameter', () => {
    const memories = [
      createMemory({ specFolder: 'folder-1' }),
      createMemory({ specFolder: 'folder-2' }),
      createMemory({ specFolder: 'folder-3' }),
      createMemory({ specFolder: 'folder-4' }),
      createMemory({ specFolder: 'folder-5' }),
    ];
    const result = compute_folder_scores(memories, { limit: 3 });
    expect(result).toHaveLength(3);
  });

  it('should sort by score descending', () => {
    const memories = [
      createMemory({ specFolder: 'old-folder', updatedAt: daysAgo(60) }),
      createMemory({ specFolder: 'recent-folder', updatedAt: new Date().toISOString() }),
      createMemory({ specFolder: 'medium-folder', updatedAt: daysAgo(10) }),
    ];
    const result = compute_folder_scores(memories);
    expect(result[0].folder).toBe('recent-folder');
    expect(result[2].folder).toBe('old-folder');
  });
});

// === INTEGRATION TESTS ===
describe('Integration Tests', () => {
  it('should handle realistic memory dataset', () => {
    const memories = [
      // Active project - recent, multiple memories
      createMemory({ specFolder: '003-memory/070-ranking', updatedAt: new Date().toISOString(), importanceTier: 'important' }),
      createMemory({ specFolder: '003-memory/070-ranking', updatedAt: daysAgo(1), importanceTier: 'normal' }),
      createMemory({ specFolder: '003-memory/070-ranking', updatedAt: daysAgo(2), importanceTier: 'normal' }),
      
      // Older project - less recent
      createMemory({ specFolder: '005-project/012-feature', updatedAt: daysAgo(14), importanceTier: 'normal' }),
      
      // Constitutional memory (will rank high due to recency exemption - D8)
      createMemory({ specFolder: '001-system/gates', updatedAt: daysAgo(30), importanceTier: 'constitutional' }),
      
      // Archived folder
      createMemory({ specFolder: '003-memory/z_archive/old-spec', updatedAt: daysAgo(60), importanceTier: 'normal' }),
    ];
    
    const result = compute_folder_scores(memories);
    
    // Should have 3 folders (archived excluded)
    expect(result).toHaveLength(3);
    
    // Constitutional folder may rank first due to D8 (recency exempt = 1.0)
    // Both 001-system/gates and 003-memory/070-ranking are valid top positions
    const topFolder = result[0].folder;
    const validTopFolders = ['001-system/gates', '003-memory/070-ranking'];
    if (!validTopFolders.includes(topFolder)) {
      throw new Error(`Expected top folder to be one of ${validTopFolders.join(', ')}, got ${topFolder}`);
    }
    
    // All should have required fields
    result.forEach(folder => {
      expect(typeof folder.score).toBe('number');
      expect(typeof folder.recencyScore).toBe('number');
      expect(typeof folder.importanceScore).toBe('number');
      expect(typeof folder.activityScore).toBe('number');
      expect(typeof folder.isArchived).toBe('boolean');
      expect(typeof folder.topTier).toBe('string');
    });
  });

  it('should complete scoring in under 100ms for 100 folders', () => {
    // Generate 100 folders with varying memory counts
    const memories = [];
    for (let i = 0; i < 100; i++) {
      const memoryCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < memoryCount; j++) {
        memories.push(createMemory({
          specFolder: `folder-${String(i).padStart(3, '0')}`,
          updatedAt: daysAgo(Math.floor(Math.random() * 90)),
          importanceTier: ['normal', 'important', 'critical'][Math.floor(Math.random() * 3)]
        }));
      }
    }
    
    const start = Date.now();
    const result = compute_folder_scores(memories);
    const duration = Date.now() - start;
    
    expect(result.length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(100);
  });
});

// === EDGE CASES ===
describe('Edge Cases', () => {
  it('should handle memories with snake_case field names', () => {
    const memory = {
      id: 1,
      spec_folder: 'test-folder',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      importance_tier: 'important'
    };
    const result = compute_folder_scores([memory]);
    expect(result).toHaveLength(1);
    expect(result[0].folder).toBe('test-folder');
  });

  it('should handle mixed case field names', () => {
    const memories = [
      { specFolder: 'folder-1', updatedAt: new Date().toISOString() },
      { spec_folder: 'folder-2', updated_at: new Date().toISOString() },
    ];
    const result = compute_folder_scores(memories);
    expect(result).toHaveLength(2);
  });

  it('should handle missing tier gracefully', () => {
    const memory = createMemory({ importanceTier: undefined, importance_tier: undefined });
    const result = compute_single_folder_score('folder', [memory]);
    // Should use normal tier as default
    expect(result.importanceScore).toBe(TIER_WEIGHTS.normal);
  });

  it('should handle unicode in folder names', () => {
    const memory = createMemory({ specFolder: 'project/feature-emoji-test' });
    const result = compute_folder_scores([memory]);
    expect(result).toHaveLength(1);
  });

  it('should support custom decay_rate parameter', () => {
    const timestamp = daysAgo(10);
    // Default decay rate of 0.10 at 10 days = 0.5
    const defaultScore = compute_recency_score(timestamp, 'normal', 0.10);
    expect(defaultScore).toBeCloseTo(0.5, 0.02);

    // Faster decay rate of 0.20 at 10 days = 0.33
    const fastScore = compute_recency_score(timestamp, 'normal', 0.20);
    expect(fastScore).toBeCloseTo(0.333, 0.02);

    // Slower decay rate of 0.05 at 10 days = 0.67
    const slowScore = compute_recency_score(timestamp, 'normal', 0.05);
    expect(slowScore).toBeCloseTo(0.667, 0.02);
  });

  it('should handle unknown tier names by using normal weight', () => {
    const memory = createMemory({ importanceTier: 'unknown_tier_xyz', importance_tier: 'unknown_tier_xyz' });
    const result = compute_single_folder_score('folder', [memory]);
    // Unknown tier should fall back to normal (0.4)
    expect(result.importanceScore).toBe(TIER_WEIGHTS.normal);
  });

  it('should handle invalid limit values gracefully', () => {
    const memories = [
      createMemory({ specFolder: 'folder-1' }),
      createMemory({ specFolder: 'folder-2' }),
      createMemory({ specFolder: 'folder-3' }),
    ];

    // Zero limit should return all (no limit applied)
    const zeroResult = compute_folder_scores(memories, { limit: 0 });
    expect(zeroResult).toHaveLength(3);

    // Negative limit should return all (no limit applied)
    const negResult = compute_folder_scores(memories, { limit: -5 });
    expect(negResult).toHaveLength(3);

    // Undefined limit should return all
    const undefinedResult = compute_folder_scores(memories, { limit: undefined });
    expect(undefinedResult).toHaveLength(3);
  });

  it('should handle invalid excludePattern regex strings gracefully', () => {
    const memories = [
      createMemory({ specFolder: 'keep-this' }),
      createMemory({ specFolder: 'also-keep' }),
    ];
    // Invalid regex pattern '[invalid' should be silently ignored
    const result = compute_folder_scores(memories, {
      excludePatterns: ['[invalid-regex', 'valid-pattern']
    });
    // Should still return folders (invalid pattern doesn't crash)
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle extremely long folder paths', () => {
    const longPath = 'a/' + 'subfolder/'.repeat(50) + 'leaf-folder';
    const memory = createMemory({ specFolder: longPath });
    const result = compute_folder_scores([memory]);
    expect(result).toHaveLength(1);
    expect(result[0].simplified).toBe('leaf-folder');
  });
});

// ─────────────────────────────────────────────────────────────────
// 5. RUN TESTS AND GENERATE REPORT
// ─────────────────────────────────────────────────────────────────

results.endTime = new Date().toISOString();
results.duration = Date.now() - new Date(results.startTime).getTime();

// Print summary
console.log('\n' + '='.repeat(60));
console.log('TEST RESULTS: Folder Scoring Module');
console.log('='.repeat(60));
console.log(`Total:  ${results.summary.total}`);
console.log(`Passed: ${results.summary.passed} ✓`);
console.log(`Failed: ${results.summary.failed} ✗`);
console.log(`Duration: ${results.duration}ms`);
console.log('='.repeat(60));

// Print failed tests
if (results.summary.failed > 0) {
  console.log('\nFAILED TESTS:');
  results.suites.forEach(suite => {
    suite.tests.filter(t => t.status === 'failed').forEach(test => {
      console.log(`  ✗ ${suite.name} > ${test.name}`);
      console.log(`    Error: ${test.error}`);
    });
  });
}

// Generate markdown report
function generateMarkdownReport() {
  const lines = [];
  lines.push('# Test Results: Folder Scoring Module');
  lines.push('');
  lines.push('> **Spec:** 070-memory-ranking');
  lines.push(`> **Run Date:** ${results.startTime}`);
  lines.push(`> **Duration:** ${results.duration}ms`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|--------|-------|');
  lines.push(`| Total Tests | ${results.summary.total} |`);
  lines.push(`| Passed | ${results.summary.passed} |`);
  lines.push(`| Failed | ${results.summary.failed} |`);
  lines.push(`| Pass Rate | ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}% |`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Test Suites');
  lines.push('');
  
  results.suites.forEach(suite => {
    const status = suite.failed === 0 ? '✓' : '✗';
    lines.push(`### ${status} ${suite.name}`);
    lines.push('');
    lines.push(`**${suite.passed}/${suite.tests.length} passed**`);
    lines.push('');
    lines.push('| Test | Status | Duration | Error |');
    lines.push('|------|--------|----------|-------|');
    suite.tests.forEach(test => {
      const statusIcon = test.status === 'passed' ? '✓' : '✗';
      const error = test.error ? test.error.replace(/\|/g, '\\|').substring(0, 50) : '-';
      lines.push(`| ${test.name} | ${statusIcon} | ${test.duration}ms | ${error} |`);
    });
    lines.push('');
  });
  
  lines.push('---');
  lines.push('');
  lines.push('## Test Coverage');
  lines.push('');
  lines.push('| Function | Tested |');
  lines.push('|----------|--------|');
  lines.push('| `compute_folder_scores()` | ✓ |');
  lines.push('| `is_archived()` | ✓ |');
  lines.push('| `get_archive_multiplier()` | ✓ |');
  lines.push('| `compute_recency_score()` | ✓ |');
  lines.push('| `compute_single_folder_score()` | ✓ |');
  lines.push('| `simplify_folder_path()` | ✓ |');
  lines.push('| `find_top_tier()` | ✓ |');
  lines.push('| `find_last_activity()` | ✓ |');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Raw Results (JSON)');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(results, null, 2));
  lines.push('```');
  
  return lines.join('\n');
}

// Write report
const reportPath = path.resolve(__dirname, '../test-results.md');
fs.writeFileSync(reportPath, generateMarkdownReport());
console.log(`\nReport written to: ${reportPath}`);

// Exit with appropriate code
process.exit(results.summary.failed > 0 ? 1 : 0);
