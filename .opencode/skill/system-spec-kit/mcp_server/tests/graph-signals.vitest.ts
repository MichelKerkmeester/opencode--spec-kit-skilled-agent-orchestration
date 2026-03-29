// TEST: GRAPH SIGNALS — Momentum + Causal Depth (N2a + N2b)
// Covers: snapshotDegrees, computeMomentum,
// ComputeCausalDepthScores, applyGraphSignals, clearGraphSignalsCache
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import * as corrections from '../lib/learning/corrections';
import {
  snapshotDegrees,
  computeMomentum,
  computeMomentumScores,
  computeCausalDepthScores,
  applyGraphSignals,
  clearGraphSignalsCache,
  __testables,
} from '../lib/graph/graph-signals.js';
import { computeDegreeScores } from '../lib/search/graph-search-fn';
import { recomputeLocal } from '../lib/search/graph-lifecycle';
import { delete_memory_from_database } from '../lib/search/vector-index-mutations';

// TEST HELPERS
function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      title TEXT,
      importance_tier TEXT DEFAULT 'normal',
      stability REAL DEFAULT 1.0,
      difficulty REAL DEFAULT 5.0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      extracted_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT
    );

    CREATE TABLE degree_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      degree_count INTEGER NOT NULL DEFAULT 0,
      snapshot_date TEXT NOT NULL,
      UNIQUE(memory_id, snapshot_date)
    );
  `);
  return db;
}

function insertMemory(
  db: Database.Database,
  memoryId: number,
  title = `Memory ${memoryId}`,
  stability = 1.0,
): void {
  db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, stability)
    VALUES (?, 'specs/001-test', ?, ?, ?)
  `).run(memoryId, `memory-${memoryId}.md`, title, stability);
}

/** Insert a causal edge into the test DB. */
function insertEdge(
  db: Database.Database,
  sourceId: number,
  targetId: number,
  relation = 'caused',
  strength = 1.0,
): void {
  db.prepare(`
    INSERT INTO causal_edges (source_id, target_id, relation, strength)
    VALUES (?, ?, ?, ?)
  `).run(String(sourceId), String(targetId), relation, strength);
}

/** Insert a degree snapshot for a specific date. */
function insertSnapshot(
  db: Database.Database,
  memoryId: number,
  degreeCount: number,
  snapshotDate: string,
): void {
  db.prepare(`
    INSERT OR REPLACE INTO degree_snapshots (memory_id, degree_count, snapshot_date)
    VALUES (?, ?, ?)
  `).run(memoryId, degreeCount, snapshotDate);
}

function seedReferenceDegreePeak(db: Database.Database): void {
  for (const memoryId of [4, 5, 6, 7]) {
    insertMemory(db, memoryId);
  }

  insertEdge(db, 4, 5);
  insertEdge(db, 6, 5);
  insertEdge(db, 5, 7);
}

function populateGraphSignalCaches(db: Database.Database, memoryIds: number[]): void {
  computeMomentumScores(db, memoryIds);
  computeCausalDepthScores(db, memoryIds);
  expect(__testables.momentumCache.size).toBeGreaterThan(0);
  expect(__testables.depthCache.size).toBeGreaterThan(0);
}

function expectGraphSignalCachesCleared(): void {
  expect(__testables.momentumCache.size).toBe(0);
  expect(__testables.depthCache.size).toBe(0);
}

// TESTS
describe('Graph Signals (S8 — N2a + N2b)', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    clearGraphSignalsCache();
  });

  afterEach(() => {
    db.close();
  });

  // 1. snapshotDegrees
  describe('snapshotDegrees', () => {
    it('returns 0 snapshotted for an empty graph', () => {
      const result = snapshotDegrees(db);
      expect(result).toEqual({ snapshotted: 0 });
    });

    it('snapshots 2 nodes for a single edge', () => {
      insertEdge(db, 1, 2);

      const result = snapshotDegrees(db);
      expect(result.snapshotted).toBe(2);

      // Verify snapshots were written
      const rows = db.prepare('SELECT * FROM degree_snapshots ORDER BY memory_id').all() as Array<{
        memory_id: number;
        degree_count: number;
      }>;
      expect(rows).toHaveLength(2);
      expect(rows[0].memory_id).toBe(1);
      expect(rows[0].degree_count).toBe(1);
      expect(rows[1].memory_id).toBe(2);
      expect(rows[1].degree_count).toBe(1);
    });

    it('snapshots correct degree counts for multiple edges', () => {
      // Node 1 -> Node 2, Node 1 -> Node 3, Node 2 -> Node 3
      insertEdge(db, 1, 2);
      insertEdge(db, 1, 3);
      insertEdge(db, 2, 3);

      const result = snapshotDegrees(db);
      expect(result.snapshotted).toBe(3);

      const rows = db.prepare('SELECT * FROM degree_snapshots ORDER BY memory_id').all() as Array<{
        memory_id: number;
        degree_count: number;
      }>;
      // Node 1: source of 2 edges = degree 2
      // Node 2: target of 1 + source of 1 = degree 2
      // Node 3: target of 2 edges = degree 2
      const degreeMap = new Map(rows.map((r) => [r.memory_id, r.degree_count]));
      expect(degreeMap.get(1)).toBe(2);
      expect(degreeMap.get(2)).toBe(2);
      expect(degreeMap.get(3)).toBe(2);
    });

    it('re-snapshot same day uses INSERT OR REPLACE (idempotent)', () => {
      insertEdge(db, 1, 2);

      const result1 = snapshotDegrees(db);
      expect(result1.snapshotted).toBe(2);

      // Add another edge and re-snapshot
      insertEdge(db, 1, 3);
      const result2 = snapshotDegrees(db);
      expect(result2.snapshotted).toBe(3);

      // Verify no duplicate rows — only one row per (memory_id, snapshot_date)
      const rows = db.prepare('SELECT * FROM degree_snapshots').all();
      expect(rows).toHaveLength(3); // nodes 1, 2, 3
    });

    it('handles non-numeric source_id gracefully (skips it)', () => {
      // Insert edge with non-numeric ID via raw SQL
      db.prepare(`
        INSERT INTO causal_edges (source_id, target_id, relation) VALUES ('abc', '2', 'caused')
      `).run();

      const result = snapshotDegrees(db);
      // Node 'abc' would be NaN and skipped; node 2 still counted
      // 'abc' appears once (source), '2' appears once (target)
      // Only node 2 is finite, so snapshotted = 1
      expect(result.snapshotted).toBe(1);
    });
  });

  // 2. computeMomentum
  describe('computeMomentum', () => {
    it('returns 0 when no edges and no history exist', () => {
      const momentum = computeMomentum(db, 1);
      expect(momentum).toBe(0);
    });

    it('returns positive momentum when node gained connections since 7 days ago', () => {
      // Current: node 1 has 3 edges
      insertEdge(db, 1, 2);
      insertEdge(db, 1, 3);
      insertEdge(db, 4, 1);

      // Historical: node 1 had degree 1 seven days ago
      const sevenDaysAgo = db
        .prepare("SELECT date('now', '-7 days') AS d")
        .get() as { d: string };
      insertSnapshot(db, 1, 1, sevenDaysAgo.d);

      const momentum = computeMomentum(db, 1);
      // Current degree = 3, past degree = 1, momentum = 2
      expect(momentum).toBe(2);
    });

    it('returns negative momentum when node lost connections since 7 days ago', () => {
      // Current: node 1 has 1 edge
      insertEdge(db, 1, 2);

      // Historical: node 1 had degree 4 seven days ago
      const sevenDaysAgo = db
        .prepare("SELECT date('now', '-7 days') AS d")
        .get() as { d: string };
      insertSnapshot(db, 1, 4, sevenDaysAgo.d);

      const momentum = computeMomentum(db, 1);
      // Current degree = 1, past degree = 4, momentum = -3
      expect(momentum).toBe(-3);
    });

    it('returns 0 when no historical snapshot exists', () => {
      // Current: node 1 has 2 edges
      insertEdge(db, 1, 2);
      insertEdge(db, 1, 3);
      // No snapshot at -7 days -> pastDegree = null -> momentum = 0

      const momentum = computeMomentum(db, 1);
      expect(momentum).toBe(0);
    });

    it('returns 0 for a node not in the graph', () => {
      insertEdge(db, 1, 2);
      const momentum = computeMomentum(db, 999);
      expect(momentum).toBe(0);
    });
  });

  // 3. computeMomentumScores
  describe('computeMomentumScores', () => {
    it('batch-computes momentum for multiple nodes', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 1, 3);

      const scores = computeMomentumScores(db, [1, 2, 3]);
      expect(scores.size).toBe(3);
      // No historical snapshots for any node -> momentum is 0 for all
      expect(scores.get(1)).toBe(0);
      expect(scores.get(2)).toBe(0);
      expect(scores.get(3)).toBe(0);
    });

    it('uses cache on second call (returns same results)', () => {
      insertEdge(db, 1, 2);

      const scores1 = computeMomentumScores(db, [1, 2]);
      // Mutate graph AFTER first call
      insertEdge(db, 1, 3);
      const scores2 = computeMomentumScores(db, [1, 2]);

      // Cache returns stale values — should be identical
      expect(scores2.get(1)).toBe(scores1.get(1));
      expect(scores2.get(2)).toBe(scores1.get(2));
    });

    it('returns empty map for empty list', () => {
      const scores = computeMomentumScores(db, []);
      expect(scores.size).toBe(0);
    });
  });

  // 5. computeCausalDepthScores
  describe('computeCausalDepthScores', () => {
    it('batch-computes depth for multiple nodes', () => {
      // Chain: 1 -> 2 -> 3
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);

      const scores = computeCausalDepthScores(db, [1, 2, 3]);
      expect(scores.size).toBe(3);
      expect(scores.get(1)).toBeCloseTo(0, 5);    // root
      expect(scores.get(2)).toBeCloseTo(0.5, 5);  // 1/2
      expect(scores.get(3)).toBeCloseTo(1, 5);    // 2/2
    });

    it('uses cache on second call (returns same results despite graph mutation)', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);

      const scores1 = computeCausalDepthScores(db, [1, 2, 3]);
      // Mutate the graph
      insertEdge(db, 3, 4);
      const scores2 = computeCausalDepthScores(db, [1, 2, 3]);

      // Cache returns stale values — identical to first call
      expect(scores2.get(1)).toBe(scores1.get(1));
      expect(scores2.get(2)).toBe(scores1.get(2));
      expect(scores2.get(3)).toBe(scores1.get(3));
    });

    it('returns empty map for empty list', () => {
      const scores = computeCausalDepthScores(db, []);
      expect(scores.size).toBe(0);
    });

    it('collapses rooted cycles to a bounded SCC depth layer', () => {
      // Rooted cycle: 1 -> 2 -> 3 -> 2 and 3 -> 4
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);
      insertEdge(db, 3, 2);
      insertEdge(db, 3, 4);

      const scores = computeCausalDepthScores(db, [1, 2, 3, 4]);

      expect(scores.get(1)).toBeCloseTo(0, 5);
      expect(scores.get(2)).toBeCloseTo(0.5, 5);
      expect(scores.get(3)).toBeCloseTo(0.5, 5);
      expect(scores.get(4)).toBeCloseTo(1, 5);
    });

    it('returns zero depth for a pure cyclic SCC with no downstream path', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);
      insertEdge(db, 3, 1);

      const scores = computeCausalDepthScores(db, [1, 2, 3]);

      expect(scores.get(1)).toBe(0);
      expect(scores.get(2)).toBe(0);
      expect(scores.get(3)).toBe(0);
    });

    it('treats a rootless cycle with an outgoing tail as a root SCC', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 1);
      insertEdge(db, 2, 3);

      const scores = computeCausalDepthScores(db, [1, 2, 3]);

      expect(scores.get(1)).toBeCloseTo(0, 5);
      expect(scores.get(2)).toBeCloseTo(0, 5);
      expect(scores.get(3)).toBeCloseTo(1, 5);
    });

    it('uses longest-root depth when shortcut edges exist', () => {
      // Graph: 1 -> 2 -> 3 -> 4 plus shortcut 1 -> 4
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);
      insertEdge(db, 3, 4);
      insertEdge(db, 1, 4);

      const scores = computeCausalDepthScores(db, [1, 2, 3, 4]);

      expect(scores.get(1)).toBeCloseTo(0, 5);
      expect(scores.get(2)).toBeCloseTo(1 / 3, 5);
      expect(scores.get(3)).toBeCloseTo(2 / 3, 5);
      expect(scores.get(4)).toBeCloseTo(1, 5);
    });
  });

  // 6. applyGraphSignals
  describe('applyGraphSignals', () => {
    it('returns empty array for empty rows', () => {
      const result = applyGraphSignals([], db);
      expect(result).toEqual([]);
    });

    it('returns original rows (unchanged reference content) when no graph data', () => {
      const rows = [
        { id: 1, score: 0.8, title: 'test' },
        { id: 2, score: 0.6, title: 'test2' },
      ];
      const result = applyGraphSignals(rows, db);
      // No edges, so momentum = 0 and depth = 0 -> bonuses are 0
      expect(result).toHaveLength(2);
      expect(result[0].score).toBe(0.8);
      expect(result[1].score).toBe(0.6);
    });

    it('adds momentum bonus to row scores', () => {
      // Node 1 has no historical snapshot -> momentum = 0
      insertEdge(db, 1, 2);
      insertEdge(db, 3, 1);

      const rows = [{ id: 1, score: 0.5 }];
      const result = applyGraphSignals(rows, db);

      // MomentumBonus = 0 (no historical snapshot)
      // DepthBonus: node 1 has in-degree 1 (from 3->1), node 3 is root
      // Graph: 3->1, 1->2; roots=[3], BFS: 3=0,1=1,2=2; maxDepth=2
      // Depth(1) = 1/2 = 0.5, depthBonus = 0.5 * 0.05 = 0.025
      // Total: 0.5 + 0 + 0.025 = 0.525
      expect(result[0].score).toBeCloseTo(0.525, 5);
    });

    it('adds depth bonus to row scores', () => {
      // Chain: 10 -> 20 -> 30
      insertEdge(db, 10, 20);
      insertEdge(db, 20, 30);

      // Query node 30 (deepest, depth = 1.0)
      const rows = [{ id: 30, score: 0.4 }];
      const result = applyGraphSignals(rows, db);

      // Momentum for 30: no historical snapshot -> momentum = 0
      // MomentumBonus = 0
      // Depth for 30: depth=2, maxDepth=2, normalized=1.0
      // DepthBonus = 1.0 * 0.05 = 0.05
      // Total: 0.4 + 0 + 0.05 = 0.45
      expect(result[0].score).toBeCloseTo(0.45, 5);
    });

    it('applies combined momentum + depth bonus', () => {
      // Chain: 1 -> 2 -> 3
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);
      // Add more edges to node 2 to increase momentum
      insertEdge(db, 4, 2);

      const rows = [{ id: 2, score: 0.5 }];
      const result = applyGraphSignals(rows, db);

      // Node 2 has no historical snapshot -> momentum = 0
      // MomentumBonus = 0
      // Roots: 1, 4 (in-degree 0)
      // BFS from roots [1,4]:
      //   1 -> depth 0, 4 -> depth 0
      //   2 -> depth 1 (from 1 or 4)
      //   3 -> depth 2
      // MaxDepth = 2, depth(2) = 1/2 = 0.5
      // DepthBonus = 0.5 * 0.05 = 0.025
      // Total: 0.5 + 0 + 0.025 = 0.525
      expect(result[0].score).toBeCloseTo(0.525, 5);
    });

    it('caps momentum bonus at 0.05', () => {
      // Create many edges for node 1 to drive high momentum
      for (let i = 2; i <= 12; i++) {
        insertEdge(db, 1, i);
      }
      // Node 1 has no historical snapshot -> momentum = 0
      // MomentumBonus = 0

      const rows = [{ id: 1, score: 0.5 }];
      const result = applyGraphSignals(rows, db);

      // DepthBonus for root node = 0
      // Total: 0.5 + 0 + 0 = 0.5
      expect(result[0].score).toBeCloseTo(0.5, 5);
    });

    it('caps depth bonus at 0.05 (max normalized depth is 1.0)', () => {
      // Chain: 1 -> 2 -> 3
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);

      // Node 3: depth = 1.0, depthBonus = 1.0 * 0.05 = 0.05 (this IS the cap)
      const rows = [{ id: 3, score: 0.0 }];
      const result = applyGraphSignals(rows, db);

      // Momentum for 3: no historical snapshot -> momentum 0
      // MomentumBonus = 0
      // DepthBonus = 0.05
      // Total = 0 + 0 + 0.05 = 0.05
      expect(result[0].score).toBeCloseTo(0.05, 5);
    });

    it('defaults score to 0 for rows without a score property', () => {
      insertEdge(db, 1, 2);

      const rows = [{ id: 1 }];
      const result = applyGraphSignals(rows, db);

      // BaseScore defaults to 0 when score is undefined
      // Momentum = 0 (no historical snapshot)
      // MomentumBonus = 0
      // Roots: [1], BFS: 1=0, 2=1, maxDepth=1
      // Depth(1) = 0/1 = 0, depthBonus = 0
      // Total: 0 + 0 + 0 = 0
      expect(result[0].score).toBeCloseTo(0, 5);
    });

    it('handles rows with non-finite score gracefully', () => {
      const rows = [{ id: 1, score: NaN }];
      const result = applyGraphSignals(rows, db);

      // NaN is not finite, so baseScore defaults to 0
      // No edges, so bonuses are 0
      expect(result[0].score).toBe(0);
    });

    it('adds a bounded graph-walk bonus for locally connected candidate rows', () => {
      // Chain: 1 -> 2 -> 3
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);

      const rows = [
        { id: 1, score: 0 },
        { id: 2, score: 0 },
        { id: 3, score: 0 },
      ];
      const result = applyGraphSignals(rows, db);

      // Node 2 sees both other candidates directly, so it receives the full walk cap (+0.03)
      // alongside the existing depth bonus (+0.025).
      expect(result[1].score).toBeCloseTo(0.055, 5);
      // Endpoints still receive a smaller walk bonus and preserve ordering by structural depth.
      expect(result[0].score).toBeCloseTo(0.0225, 5);
      expect(result[2].score).toBeCloseTo(0.0725, 5);
    });

    it('caps graph-walk bonus at 0.03 for dense candidate neighborhoods', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);
      insertEdge(db, 3, 1);
      insertEdge(db, 2, 1);
      insertEdge(db, 3, 2);
      insertEdge(db, 1, 3);

      const rows = [
        { id: 1, score: 0.2 },
        { id: 2, score: 0.2 },
        { id: 3, score: 0.2 },
      ];
      const result = applyGraphSignals(rows, db);

      for (const row of result) {
        expect(row.score).toBeGreaterThanOrEqual(0.23);
        expect(row.score).toBeLessThanOrEqual(0.28);
      }
    });

    it('records distinct raw and normalized graph-walk diagnostics', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);

      const rows = [
        { id: 1, score: 0 },
        { id: 2, score: 0 },
        { id: 3, score: 0 },
      ];
      const result = applyGraphSignals(rows, db);
      const graphContribution = result[1].graphContribution as {
        raw?: number;
        normalized?: number;
        appliedBonus?: number;
        capApplied?: boolean;
        rolloutState?: string;
      };

      expect(graphContribution.raw).toBe(2);
      expect(graphContribution.normalized).toBe(1);
      expect(graphContribution.appliedBonus).toBeCloseTo(0.03, 5);
      expect(graphContribution.capApplied).toBe(true);
      expect(graphContribution.rolloutState).toBe('bounded_runtime');
    });

    it('trace_only rollout records graph-walk diagnostics without applying the graph-walk bonus', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);

      const rows = [
        { id: 1, score: 0 },
        { id: 2, score: 0 },
        { id: 3, score: 0 },
      ];
      const result = applyGraphSignals(rows, db, { rolloutState: 'trace_only' });
      const graphContribution = result[1].graphContribution as {
        raw?: number;
        normalized?: number;
        appliedBonus?: number;
        capApplied?: boolean;
        rolloutState?: string;
      };

      expect(result[1].score).toBeCloseTo(0.025, 5);
      expect(graphContribution.raw).toBe(2);
      expect(graphContribution.normalized).toBe(1);
      expect(graphContribution.appliedBonus).toBe(0);
      expect(graphContribution.capApplied).toBe(false);
      expect(graphContribution.rolloutState).toBe('trace_only');
    });

    it('off rollout keeps momentum/depth scoring while suppressing the graph-walk bonus', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);

      const rows = [
        { id: 1, score: 0 },
        { id: 2, score: 0 },
        { id: 3, score: 0 },
      ];
      const result = applyGraphSignals(rows, db, { rolloutState: 'off' });
      const graphContribution = result[1].graphContribution as {
        raw?: number;
        normalized?: number;
        appliedBonus?: number;
        capApplied?: boolean;
        rolloutState?: string;
      };

      expect(result[1].score).toBeCloseTo(0.025, 5);
      expect(graphContribution.raw).toBe(2);
      expect(graphContribution.normalized).toBe(1);
      expect(graphContribution.appliedBonus).toBe(0);
      expect(graphContribution.capApplied).toBe(false);
      expect(graphContribution.rolloutState).toBe('off');
    });
  });

  // 7. clearGraphSignalsCache
  describe('clearGraphSignalsCache', () => {
    it('clears populated caches', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);

      // Populate the caches
      computeMomentumScores(db, [1, 2]);
      computeCausalDepthScores(db, [1, 2, 3]);

      expect(__testables.momentumCache.size).toBeGreaterThan(0);
      expect(__testables.depthCache.size).toBeGreaterThan(0);

      clearGraphSignalsCache();

      expect(__testables.momentumCache.size).toBe(0);
      expect(__testables.depthCache.size).toBe(0);
    });

    it('allows scores to be recomputed after clear (reflects graph mutations)', () => {
      insertEdge(db, 1, 2);
      const sevenDaysAgo = db
        .prepare("SELECT date('now', '-7 days') AS d")
        .get() as { d: string };
      insertSnapshot(db, 1, 0, sevenDaysAgo.d);

      // First computation
      const scores1 = computeMomentumScores(db, [1]);
      const momentum1 = scores1.get(1)!;

      // Mutate graph
      insertEdge(db, 3, 1);

      // Without clearing, cache returns stale value
      const stale = computeMomentumScores(db, [1]);
      expect(stale.get(1)).toBe(momentum1);

      // After clearing, fresh computation reflects mutation
      clearGraphSignalsCache();
      const fresh = computeMomentumScores(db, [1]);
      // Node 1 now has degree 2 (1->2 and 3->1), past = 0, momentum = 2
      expect(fresh.get(1)).toBe(2);
      expect(fresh.get(1)).not.toBe(momentum1);
    });

    it('is safe to call on already-empty caches', () => {
      // Should not throw
      clearGraphSignalsCache();
      clearGraphSignalsCache();
      expect(__testables.momentumCache.size).toBe(0);
      expect(__testables.depthCache.size).toBe(0);
    });
  });

  describe('cache invalidation after causal edge mutations', () => {
    it('invalidates graph and degree caches after memory deletion removes causal edges', () => {
      for (const memoryId of [1, 2, 3]) {
        insertMemory(db, memoryId);
      }
      seedReferenceDegreePeak(db);

      insertEdge(db, 1, 2);
      insertEdge(db, 3, 1);

      const sevenDaysAgo = db
        .prepare("SELECT date('now', '-7 days') AS d")
        .get() as { d: string };
      insertSnapshot(db, 1, 0, sevenDaysAgo.d);

      populateGraphSignalCaches(db, [1, 2, 3, 4, 5, 6, 7]);
      const degreeBefore = computeDegreeScores(db, [1]).get('1') ?? 0;
      const momentumBefore = computeMomentumScores(db, [1]).get(1) ?? 0;

      const deleted = delete_memory_from_database(db, 3);

      expect(deleted).toBe(true);
      expectGraphSignalCachesCleared();

      const momentumAfter = computeMomentumScores(db, [1]).get(1) ?? 0;
      const degreeAfter = computeDegreeScores(db, [1]).get('1') ?? 0;

      expect(momentumBefore).toBe(2);
      expect(momentumAfter).toBe(1);
      expect(degreeAfter).toBeLessThan(degreeBefore);
    });

    it('invalidates graph and degree caches when correction edges are added and removed', () => {
      insertMemory(db, 1, 'Original memory', 10);
      insertMemory(db, 2, 'Correction memory', 8);
      insertMemory(db, 3, 'Linked memory', 4);
      seedReferenceDegreePeak(db);

      insertEdge(db, 1, 3);

      const sevenDaysAgo = db
        .prepare("SELECT date('now', '-7 days') AS d")
        .get() as { d: string };
      insertSnapshot(db, 1, 0, sevenDaysAgo.d);

      corrections.init(db);

      populateGraphSignalCaches(db, [1, 2, 3, 4, 5, 6, 7]);
      const degreeBefore = computeDegreeScores(db, [1]).get('1') ?? 0;
      const momentumBefore = computeMomentumScores(db, [1]).get(1) ?? 0;

      const recorded = corrections.recordCorrection({
        original_memory_id: 1,
        correction_memory_id: 2,
        correction_type: 'superseded',
        reason: 'Newer memory supersedes the original',
        corrected_by: 'test',
      });

      expect(recorded.success).toBe(true);
      expectGraphSignalCachesCleared();

      const momentumAfterInsert = computeMomentumScores(db, [1]).get(1) ?? 0;
      const degreeAfterInsert = computeDegreeScores(db, [1]).get('1') ?? 0;

      expect(momentumBefore).toBe(1);
      expect(momentumAfterInsert).toBe(2);
      expect(degreeAfterInsert).toBeGreaterThan(degreeBefore);

      populateGraphSignalCaches(db, [1, 2, 3, 4, 5, 6, 7]);

      const undone = corrections.undoCorrection(Number(recorded.correction_id));

      expect(undone.success).toBe(true);
      expectGraphSignalCachesCleared();

      const momentumAfterUndo = computeMomentumScores(db, [1]).get(1) ?? 0;
      const degreeAfterUndo = computeDegreeScores(db, [1]).get('1') ?? 0;

      expect(momentumAfterUndo).toBe(1);
      expect(degreeAfterUndo).toBeCloseTo(degreeBefore, 5);
    });

    it('invalidates graph and degree caches after local graph lifecycle strength updates', () => {
      for (const memoryId of [1, 2, 3]) {
        insertMemory(db, memoryId);
      }
      seedReferenceDegreePeak(db);

      insertEdge(db, 1, 2, 'caused', 0.5);
      insertEdge(db, 3, 2, 'caused', 0.5);

      populateGraphSignalCaches(db, [1, 2, 3, 4, 5, 6, 7]);
      const degreeBefore = computeDegreeScores(db, [2]).get('2') ?? 0;

      const updated = recomputeLocal(db, ['2']);

      expect(updated).toBeGreaterThan(0);
      expectGraphSignalCachesCleared();

      const degreeAfter = computeDegreeScores(db, [2]).get('2') ?? 0;

      expect(degreeAfter).toBeGreaterThan(degreeBefore);
    });
  });

  describe('search and degree performance regressions', () => {
    it('reuses cached max typed degree across repeated lookups for the same DB', () => {
      let maxDegreeQueryCount = 0;
      let batchDegreeQueryCount = 0;

      const mockDb = {
        prepare(sql: string) {
          return {
            get() {
              if (sql.includes('SELECT MAX(typed_degree) AS max_degree')) {
                maxDegreeQueryCount += 1;
                return { max_degree: 10 };
              }
              return undefined;
            },
            all(...params: unknown[]) {
              if (sql.includes("importance_tier = 'constitutional'")) {
                return [];
              }
              if (sql.includes('WITH candidate_nodes(node_id)')) {
                batchDegreeQueryCount += 1;
                const ids = params.slice(0, -1).map(String);
                return ids.map((id) => ({ node_id: id, typed_degree: id === '1' ? 5 : 1 }));
              }
              return [];
            },
          };
        },
      } as unknown as Database.Database;

      const first = computeDegreeScores(mockDb, [1]).get('1') ?? 0;
      const second = computeDegreeScores(mockDb, [1]).get('1') ?? 0;

      expect(first).toBeGreaterThan(0);
      expect(second).toBe(first);
      expect(maxDegreeQueryCount).toBe(1);
      expect(batchDegreeQueryCount).toBe(1);
    });

    it('uses CTE-based FTS edge lookup and caches FTS table availability per DB', async () => {
      let ftsProbeCount = 0;
      const preparedSql: string[] = [];

      const mockDb = {
        prepare(sql: string) {
          preparedSql.push(sql);
          return {
            get() {
              if (sql.includes('sqlite_master') && sql.includes("name='memory_fts'")) {
                ftsProbeCount += 1;
                return { name: 'memory_fts' };
              }
              return undefined;
            },
            all() {
              if (sql.includes('WITH matched_memories')) {
                return [{
                  id: '1',
                  source_id: '1',
                  target_id: '2',
                  relation: 'caused',
                  strength: 1,
                  fts_score: 1.25,
                }];
              }
              return [];
            },
          };
        },
      } as unknown as Database.Database;

      const graphSearchModule = await import('../lib/search/graph-search-fn');
      const createSearchFn = (
        graphSearchModule as unknown as { createUnifiedGraphSearchFn?: unknown; default?: { createUnifiedGraphSearchFn?: unknown } }
      ).createUnifiedGraphSearchFn
        ?? (graphSearchModule as unknown as { default?: { createUnifiedGraphSearchFn?: unknown } }).default?.createUnifiedGraphSearchFn;

      expect(typeof createSearchFn).toBe('function');
      const search = (createSearchFn as (database: Database.Database) => (query: string, options: Record<string, unknown>) => Array<Record<string, unknown>>)(mockDb);
      const first = search('authentication', { limit: 5 });
      const second = search('authentication', { limit: 5 });

      expect(first.length).toBeGreaterThan(0);
      expect(second.length).toBeGreaterThan(0);
      expect(ftsProbeCount).toBe(1);

      const ftsSql = preparedSql.find((sql) => sql.includes('WITH matched_memories'));
      expect(ftsSql).toBeDefined();
      expect(ftsSql).toContain('UNION ALL');
      expect(ftsSql).not.toContain('JOIN memory_fts ON (');
    });
  });

  // 8. Edge cases
  describe('Edge cases', () => {
    it('non-existent memoryId returns 0 for momentum signal', () => {
      insertEdge(db, 1, 2);

      const momentum = computeMomentum(db, 9999);

      expect(momentum).toBe(0);
    });

    it('self-referencing edge is handled correctly', () => {
      // Insert a self-loop: 1 -> 1
      insertEdge(db, 1, 1);

      // SnapshotDegrees should handle it
      const snapshot = snapshotDegrees(db);
      expect(snapshot.snapshotted).toBe(1);
      const storedSnapshot = db.prepare(
        'SELECT degree_count FROM degree_snapshots WHERE memory_id = 1'
      ).get() as { degree_count: number } | undefined;
      expect(storedSnapshot?.degree_count).toBe(1);

      // GetCurrentDegree uses COUNT(*) with WHERE source_id = ? OR target_id = ?
      // A self-loop is a single row where both conditions match, so COUNT = 1
      const degree = __testables.getCurrentDegree(db, 1);
      expect(degree).toBe(1);

      // Momentum: no historical snapshot -> 0
      const momentum = computeMomentum(db, 1);
      expect(momentum).toBe(0);

      const scores = computeCausalDepthScores(db, [1]);
      expect(scores.get(1)).toBe(0);
    });

    it('very large graph does not throw', () => {
      // Create a chain of 200 nodes
      const insertStmt = db.prepare(`
        INSERT INTO causal_edges (source_id, target_id, relation, strength)
        VALUES (?, ?, 'caused', 1.0)
      `);
      const insertAll = db.transaction(() => {
        for (let i = 1; i < 200; i++) {
          insertStmt.run(String(i), String(i + 1));
        }
      });
      insertAll();

      // Should not throw
      expect(() => snapshotDegrees(db)).not.toThrow();
      expect(() => computeMomentum(db, 100)).not.toThrow();
      expect(() => computeCausalDepthScores(db, [1, 50, 100, 150, 200])).not.toThrow();
      expect(() => applyGraphSignals([{ id: 100, score: 0.5 }], db)).not.toThrow();

      // Verify reasonable depth results via batch function
      const scores = computeCausalDepthScores(db, [200]);
      // Node 200 is the deepest: depth 199, maxDepth 199, normalized = 1.0
      expect(scores.get(200)).toBeCloseTo(1.0, 5);
    });
  });

  // 9. __testables internal helpers
  describe('__testables internal helpers', () => {
    it('getCurrentDegree returns correct degree count', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 1, 3);
      insertEdge(db, 4, 1);

      expect(__testables.getCurrentDegree(db, 1)).toBe(3);
      expect(__testables.getCurrentDegree(db, 2)).toBe(1);
      expect(__testables.getCurrentDegree(db, 4)).toBe(1);
      expect(__testables.getCurrentDegree(db, 999)).toBe(0);
    });

    it('getPastDegree returns snapshot from 7 days ago', () => {
      const sevenDaysAgo = db
        .prepare("SELECT date('now', '-7 days') AS d")
        .get() as { d: string };
      insertSnapshot(db, 1, 5, sevenDaysAgo.d);

      expect(__testables.getPastDegree(db, 1)).toBe(5);
    });

    it('getPastDegree returns null when no snapshot at -7 days', () => {
      // Insert snapshot for a different date (not 7 days ago)
      insertSnapshot(db, 1, 5, '2020-01-01');
      expect(__testables.getPastDegree(db, 1)).toBeNull();
    });

    it('buildAdjacencyList constructs correct graph structure', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 1, 3);
      insertEdge(db, 2, 3);

      const { adjacency, allNodes, inDegree } = __testables.buildAdjacencyList(db);

      expect(allNodes.size).toBe(3);
      expect(allNodes.has(1)).toBe(true);
      expect(allNodes.has(2)).toBe(true);
      expect(allNodes.has(3)).toBe(true);

      expect(adjacency.get(1)).toEqual(expect.arrayContaining([2, 3]));
      expect(adjacency.get(2)).toEqual([3]);
      expect(adjacency.has(3)).toBe(false); // node 3 has no outgoing edges

      expect(inDegree.get(1)).toBe(0); // root
      expect(inDegree.get(2)).toBe(1);
      expect(inDegree.get(3)).toBe(2);
    });

    it('buildUndirectedAdjacency mirrors edges in both directions', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);

      const { adjacency } = __testables.buildAdjacencyList(db);
      const undirected = __testables.buildUndirectedAdjacency(adjacency);

      expect(Array.from(undirected.get(1) ?? [])).toEqual([2]);
      expect(Array.from(undirected.get(2) ?? [])).toEqual(expect.arrayContaining([1, 3]));
      expect(Array.from(undirected.get(3) ?? [])).toEqual([2]);
    });

    it('computeGraphWalkScores returns bounded local connectivity scores', () => {
      // Candidate set has one direct hub and one two-hop path.
      insertEdge(db, 10, 20);
      insertEdge(db, 20, 30);

      const scores = __testables.computeGraphWalkScores(db, [10, 20, 30]);

      expect(scores.get(10)).toBeCloseTo(0.75, 5);
      expect(scores.get(20)).toBe(1);
      expect(scores.get(30)).toBeCloseTo(0.75, 5);
    });

    it('computeGraphWalkScores is a no-op for singleton candidate sets', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);

      const scores = __testables.computeGraphWalkScores(db, [2]);

      expect(scores.get(2)).toBe(0);
    });

    it('clamp works correctly', () => {
      expect(__testables.clamp(0.5, 0, 1)).toBe(0.5);
      expect(__testables.clamp(-1, 0, 1)).toBe(0);
      expect(__testables.clamp(2, 0, 1)).toBe(1);
      expect(__testables.clamp(0.03, 0, 0.05)).toBe(0.03);
      expect(__testables.clamp(0.1, 0, 0.05)).toBe(0.05);
      expect(__testables.clamp(-0.5, 0, 0.05)).toBe(0);
    });
  });
});
