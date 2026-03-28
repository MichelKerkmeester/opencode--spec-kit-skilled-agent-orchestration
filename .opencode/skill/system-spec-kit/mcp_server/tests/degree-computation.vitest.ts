// ───────────────────────────────────────────────────────────────
// 1. TEST — DEGREE COMPUTATION
// ───────────────────────────────────────────────────────────────
// Tests for the R4 5th RRF channel: degree-based scoring

import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest';
import Database from 'better-sqlite3';
import {
  EDGE_TYPE_WEIGHTS,
  DEFAULT_MAX_TYPED_DEGREE,
  MAX_TOTAL_DEGREE,
  DEGREE_BOOST_CAP,
  DEGREE_CHANNEL_WEIGHT,
  computeTypedDegree,
  normalizeDegreeToBoostedScore,
  computeMaxTypedDegree,
  computeDegreeScores,
  clearDegreeCache,
} from '../lib/search/graph-search-fn';

// TEST SETUP
let testDb: InstanceType<typeof Database>;

function createTestSchema(db: InstanceType<typeof Database>) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL CHECK(relation IN (
        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
      )),
      strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
      evidence TEXT,
      extracted_at TEXT DEFAULT (datetime('now')),
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT,
      UNIQUE(source_id, target_id, relation)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT (datetime('now')),
      reason TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL DEFAULT '',
      file_path TEXT NOT NULL DEFAULT '',
      title TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      importance_tier TEXT DEFAULT 'normal'
    )
  `);
}

function seedTestData(db: InstanceType<typeof Database>) {
  // Insert memory records
  const insertMem = db.prepare(
    `INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier) VALUES (?, ?, ?, ?, ?)`
  );
  insertMem.run(1, 'test-spec', '/mem/1.md', 'Memory 1', 'normal');
  insertMem.run(2, 'test-spec', '/mem/2.md', 'Memory 2', 'normal');
  insertMem.run(3, 'test-spec', '/mem/3.md', 'Memory 3', 'normal');
  insertMem.run(4, 'test-spec', '/mem/4.md', 'Memory 4', 'constitutional');
  insertMem.run(5, 'test-spec', '/mem/5.md', 'Memory 5', 'normal');

  // Insert causal edges:
  // Mem 1 -> 2 (caused, strength 1.0)   => weight 1.0 * 1.0 = 1.0
  // Mem 1 -> 3 (derived_from, strength 0.8) => weight 0.9 * 0.8 = 0.72
  // Mem 2 -> 3 (enabled, strength 0.5)  => weight 0.8 * 0.5 = 0.4
  // Mem 3 -> 5 (supports, strength 1.0) => weight 0.5 * 1.0 = 0.5
  // Mem 4 -> 1 (caused, strength 1.0)   => constitutional source
  const insertEdge = db.prepare(
    `INSERT INTO causal_edges (source_id, target_id, relation, strength) VALUES (?, ?, ?, ?)`
  );
  insertEdge.run('1', '2', 'caused', 1.0);
  insertEdge.run('1', '3', 'derived_from', 0.8);
  insertEdge.run('2', '3', 'enabled', 0.5);
  insertEdge.run('3', '5', 'supports', 1.0);
  insertEdge.run('4', '1', 'caused', 1.0);
}

// TESTS
describe('Typed-Weighted Degree Computation', () => {
  beforeAll(() => {
    testDb = new Database(':memory:');
    createTestSchema(testDb);
    seedTestData(testDb);
  });

  afterAll(() => {
    testDb.close();
  });

  beforeEach(() => {
    clearDegreeCache();
  });

  // 1. Degree computation returns correct weighted sum
  describe('computeTypedDegree', () => {
    it('returns correct weighted sum for a known graph node', () => {
      // Memory 1:
      // As source: 1->2 (caused, 1.0) = 1.0*1.0 = 1.0
      // 1->3 (derived_from, 0.8) = 0.9*0.8 = 0.72
      // As target: 4->1 (caused, 1.0) = 1.0*1.0 = 1.0
      // Total = 1.0 + 0.72 + 1.0 = 2.72
      const degree = computeTypedDegree(testDb, '1');
      expect(degree).toBeCloseTo(2.72, 2);
    });

    it('counts both source and target edges', () => {
      // Memory 3:
      // As source: 3->5 (supports, 1.0) = 0.5*1.0 = 0.5
      // As target: 1->3 (derived_from, 0.8) = 0.9*0.8 = 0.72
      // 2->3 (enabled, 0.5) = 0.8*0.5 = 0.4
      // Total = 0.5 + 0.72 + 0.4 = 1.62
      const degree = computeTypedDegree(testDb, '3');
      expect(degree).toBeCloseTo(1.62, 2);
    });

    it('returns 0 for a node with no edges', () => {
      // Memory 99 doesn't exist in causal_edges
      const degree = computeTypedDegree(testDb, '99');
      expect(degree).toBe(0);
    });

    it('returns 0 for empty graph', () => {
      const emptyDb = new Database(':memory:');
      createTestSchema(emptyDb);
      const degree = computeTypedDegree(emptyDb, '1');
      expect(degree).toBe(0);
      emptyDb.close();
    });
  });

  // 2. Normalization output is in [0, 0.15] range
  describe('normalizeDegreeToBoostedScore', () => {
    it('returns 0 for rawDegree of 0', () => {
      expect(normalizeDegreeToBoostedScore(0, 15)).toBe(0);
    });

    it('returns 0 for maxDegree of 0', () => {
      expect(normalizeDegreeToBoostedScore(5, 0)).toBe(0);
    });

    it('returns value in [0, 0.15] for normal inputs', () => {
      const score = normalizeDegreeToBoostedScore(5, 15);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(DEGREE_BOOST_CAP);
    });

    it('returns exactly DEGREE_BOOST_CAP when rawDegree equals maxDegree', () => {
      // Log(1+x)/log(1+x) = 1.0, * 0.15 = 0.15
      const score = normalizeDegreeToBoostedScore(10, 10);
      expect(score).toBeCloseTo(DEGREE_BOOST_CAP, 5);
    });

    it('caps at DEGREE_BOOST_CAP when rawDegree exceeds maxDegree', () => {
      // When raw > max, log(1+raw)/log(1+max) > 1, so min(..., 0.15) caps
      const score = normalizeDegreeToBoostedScore(100, 10);
      expect(score).toBe(DEGREE_BOOST_CAP);
    });

    it('produces monotonically increasing scores for increasing degrees', () => {
      const s1 = normalizeDegreeToBoostedScore(1, 50);
      const s2 = normalizeDegreeToBoostedScore(5, 50);
      const s3 = normalizeDegreeToBoostedScore(20, 50);
      const s4 = normalizeDegreeToBoostedScore(50, 50);
      expect(s1).toBeLessThan(s2);
      expect(s2).toBeLessThan(s3);
      expect(s3).toBeLessThan(s4);
    });

    it('aligns the degree channel weight with the advertised boost cap', () => {
      expect(DEGREE_CHANNEL_WEIGHT).toBe(DEGREE_BOOST_CAP);
    });
  });

  // 3. Constitutional memories always return 0
  describe('constitutional memory exclusion', () => {
    it('returns 0 for constitutional memories in computeDegreeScores', () => {
      // Memory 4 is constitutional and has edges (4->1 caused)
      const scores = computeDegreeScores(testDb, [4]);
      expect(scores.get('4')).toBe(0);
    });

    it('excludes constitutional but scores normal memories in same batch', () => {
      const scores = computeDegreeScores(testDb, [1, 4]);
      expect(scores.get('4')).toBe(0);
      expect(scores.get('1')).toBeGreaterThan(0);
      expect(scores.get('1')).toBeLessThanOrEqual(DEGREE_BOOST_CAP);
    });

    it('fails closed when constitutional lookup throws', () => {
      const originalPrepare = testDb.prepare.bind(testDb);
      const prepareSpy = vi.spyOn(testDb, 'prepare').mockImplementation((sql: string) => {
        if (sql.includes("importance_tier = 'constitutional'")) {
          throw new Error('lookup failed');
        }
        return originalPrepare(sql);
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      const scores = computeDegreeScores(testDb, [1, 4, 999]);

      expect(scores.get('1')).toBe(0);
      expect(scores.get('4')).toBe(0);
      expect(scores.get('999')).toBe(0);
      expect(warnSpy).toHaveBeenCalledWith(
        '[graph-search-fn] Constitutional exclusion lookup failed; returning zero scores for safety'
      );

      prepareSpy.mockRestore();
      warnSpy.mockRestore();
    });
  });

  // 4. MAX_TOTAL_DEGREE cap works correctly
  describe('MAX_TOTAL_DEGREE cap', () => {
    it('caps raw degree at MAX_TOTAL_DEGREE', () => {
      // Create a high-degree node
      const capDb = new Database(':memory:');
      createTestSchema(capDb);

      // Insert 60 edges from node 1 (all "caused" with strength 1.0)
      // Raw degree would be 60 * 1.0 * 1.0 = 60, but capped at 50
      const insertEdge = capDb.prepare(
        `INSERT INTO causal_edges (source_id, target_id, relation, strength) VALUES (?, ?, ?, ?)`
      );
      for (let i = 2; i <= 61; i++) {
        insertEdge.run('1', String(i), 'caused', 1.0);
      }

      const degree = computeTypedDegree(capDb, '1');
      expect(degree).toBe(MAX_TOTAL_DEGREE);
      capDb.close();
    });

    it('does not cap when below threshold', () => {
      // Memory 1 has degree 2.72, well below MAX_TOTAL_DEGREE
      const degree = computeTypedDegree(testDb, '1');
      expect(degree).toBeLessThan(MAX_TOTAL_DEGREE);
      expect(degree).toBeCloseTo(2.72, 2);
    });
  });

  // 5. Empty graph returns 0
  describe('empty graph handling', () => {
    it('computeMaxTypedDegree returns fallback for empty graph', () => {
      const emptyDb = new Database(':memory:');
      createTestSchema(emptyDb);
      const maxDeg = computeMaxTypedDegree(emptyDb);
      expect(maxDeg).toBe(DEFAULT_MAX_TYPED_DEGREE);
      emptyDb.close();
    });

    it('computeDegreeScores returns empty map for empty input', () => {
      const scores = computeDegreeScores(testDb, []);
      expect(scores.size).toBe(0);
    });

    it('computeDegreeScores returns 0 for IDs not in graph', () => {
      const scores = computeDegreeScores(testDb, [999]);
      expect(scores.get('999')).toBe(0);
    });
  });

  // 6. Cache invalidation works
  describe('cache invalidation', () => {
    it('returns cached value on second call', () => {
      const scores1 = computeDegreeScores(testDb, [1]);
      const score1 = scores1.get('1');

      // Call again — should use cache
      const scores2 = computeDegreeScores(testDb, [1]);
      expect(scores2.get('1')).toBe(score1);
    });

    it('clearDegreeCache forces recomputation', () => {
      // Use memory 5 which has low degree (single edge: 3->5 supports = 0.5)
      // So it won't saturate at the DEGREE_BOOST_CAP
      const scores1 = computeDegreeScores(testDb, [5]);
      const score1 = scores1.get('5');
      expect(score1).toBeGreaterThan(0);
      expect(score1).toBeLessThan(DEGREE_BOOST_CAP); // Ensure not already capped

      // Add a new edge to increase degree for memory 5
      testDb.prepare(
        `INSERT INTO causal_edges (source_id, target_id, relation, strength) VALUES (?, ?, ?, ?)`
      ).run('5', '2', 'caused', 1.0);

      // Without clearing cache, old value is returned
      const scoresCached = computeDegreeScores(testDb, [5]);
      expect(scoresCached.get('5')).toBe(score1);

      // After clearing, new value is computed
      clearDegreeCache();
      const scoresNew = computeDegreeScores(testDb, [5]);
      const scoreNew = scoresNew.get('5');
      // New score should be higher because we added a high-weight edge
      expect(scoreNew).toBeGreaterThan(score1!);

      // Clean up the test edge
      testDb.prepare(`DELETE FROM causal_edges WHERE source_id = '5' AND target_id = '2'`).run();
      clearDegreeCache();
    });
  });

  // 7. Batch computation returns scores for multiple IDs
  describe('batch computation (computeDegreeScores)', () => {
    it('returns scores for all requested IDs', () => {
      const scores = computeDegreeScores(testDb, [1, 2, 3, 5]);
      expect(scores.size).toBe(4);
      expect(scores.has('1')).toBe(true);
      expect(scores.has('2')).toBe(true);
      expect(scores.has('3')).toBe(true);
      expect(scores.has('5')).toBe(true);
    });

    it('all scores are within [0, DEGREE_BOOST_CAP] range', () => {
      const scores = computeDegreeScores(testDb, [1, 2, 3, 5]);
      for (const [, score] of scores) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(DEGREE_BOOST_CAP);
      }
    });

    it('higher-degree nodes get higher scores', () => {
      const scores = computeDegreeScores(testDb, [1, 2, 3, 5]);
      const scoreOne = scores.get('1');
      const scoreTwo = scores.get('2');
      // Memory 1 has degree ~2.72 (3 edges)
      // Memory 2 has degree: as source 2->3 (enabled, 0.5) = 0.4, as target 1->2 (caused, 1.0) = 1.0 => 1.4
      // Memory 1 should score higher than Memory 2
      expect(scoreOne).toBeDefined();
      expect(scoreTwo).toBeDefined();
      expect(scoreOne!).toBeGreaterThan(scoreTwo!);
    });

    it('handles numeric IDs by converting to strings', () => {
      const scores = computeDegreeScores(testDb, [1, 2]);
      expect(scores.has('1')).toBe(true);
      expect(scores.has('2')).toBe(true);
    });
  });

  // 8. Edge type weight constants
  describe('EDGE_TYPE_WEIGHTS constants', () => {
    it('has all 6 relation types', () => {
      expect(Object.keys(EDGE_TYPE_WEIGHTS)).toHaveLength(6);
      expect(EDGE_TYPE_WEIGHTS['caused']).toBe(1.0);
      expect(EDGE_TYPE_WEIGHTS['derived_from']).toBe(0.9);
      expect(EDGE_TYPE_WEIGHTS['enabled']).toBe(0.8);
      expect(EDGE_TYPE_WEIGHTS['contradicts']).toBe(0.7);
      expect(EDGE_TYPE_WEIGHTS['supersedes']).toBe(0.6);
      expect(EDGE_TYPE_WEIGHTS['supports']).toBe(0.5);
    });
  });
});
