// ---------------------------------------------------------------
// TEST: GRAPH SIGNALS — Momentum + Causal Depth (N2a + N2b)
// Covers: snapshotDegrees, computeMomentum,
//         computeCausalDepthScores, applyGraphSignals, clearGraphSignalsCache
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import {
  snapshotDegrees,
  computeMomentum,
  computeMomentumScores,
  computeCausalDepthScores,
  applyGraphSignals,
  clearGraphSignalsCache,
  __testables,
} from '../lib/graph/graph-signals.js';

// ---------------------------------------------------------------------------
// TEST HELPERS
// ---------------------------------------------------------------------------

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      title TEXT
    );

    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
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

// ---------------------------------------------------------------------------
// TESTS
// ---------------------------------------------------------------------------

describe('Graph Signals (S8 — N2a + N2b)', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    clearGraphSignalsCache();
  });

  afterEach(() => {
    db.close();
  });

  // ─────────────────────────────────────────────────────────────
  // 1. snapshotDegrees
  // ─────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────
  // 2. computeMomentum
  // ─────────────────────────────────────────────────────────────
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

    it('returns current degree as momentum when no historical snapshot exists', () => {
      // Current: node 1 has 2 edges
      insertEdge(db, 1, 2);
      insertEdge(db, 1, 3);
      // No snapshot at -7 days, so past degree = 0

      const momentum = computeMomentum(db, 1);
      // Current degree = 2, past degree = 0, momentum = 2
      expect(momentum).toBe(2);
    });

    it('returns 0 for a node not in the graph', () => {
      insertEdge(db, 1, 2);
      const momentum = computeMomentum(db, 999);
      expect(momentum).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. computeMomentumScores
  // ─────────────────────────────────────────────────────────────
  describe('computeMomentumScores', () => {
    it('batch-computes momentum for multiple nodes', () => {
      insertEdge(db, 1, 2);
      insertEdge(db, 1, 3);

      const scores = computeMomentumScores(db, [1, 2, 3]);
      expect(scores.size).toBe(3);
      // Node 1: degree 2, no history -> momentum 2
      expect(scores.get(1)).toBe(2);
      // Node 2: degree 1, no history -> momentum 1
      expect(scores.get(2)).toBe(1);
      // Node 3: degree 1, no history -> momentum 1
      expect(scores.get(3)).toBe(1);
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

  // ─────────────────────────────────────────────────────────────
  // 5. computeCausalDepthScores
  // ─────────────────────────────────────────────────────────────
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
  });

  // ─────────────────────────────────────────────────────────────
  // 6. applyGraphSignals
  // ─────────────────────────────────────────────────────────────
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
      // Node 1 has current degree 2, no history -> momentum = 2
      insertEdge(db, 1, 2);
      insertEdge(db, 3, 1);

      const rows = [{ id: 1, score: 0.5 }];
      const result = applyGraphSignals(rows, db);

      // momentumBonus = clamp(2 * 0.01, 0, 0.05) = 0.02
      // depthBonus: node 1 has in-degree 1 (from 3->1), node 3 is root
      // Graph: 3->1, 1->2; roots=[3], BFS: 3=0,1=1,2=2; maxDepth=2
      // depth(1) = 1/2 = 0.5, depthBonus = 0.5 * 0.05 = 0.025
      // Total: 0.5 + 0.02 + 0.025 = 0.545
      expect(result[0].score).toBeCloseTo(0.545, 5);
    });

    it('adds depth bonus to row scores', () => {
      // Chain: 10 -> 20 -> 30
      insertEdge(db, 10, 20);
      insertEdge(db, 20, 30);

      // Query node 30 (deepest, depth = 1.0)
      const rows = [{ id: 30, score: 0.4 }];
      const result = applyGraphSignals(rows, db);

      // momentum for 30: current degree = 1, past = 0, momentum = 1
      // momentumBonus = clamp(1 * 0.01, 0, 0.05) = 0.01
      // depth for 30: depth=2, maxDepth=2, normalized=1.0
      // depthBonus = 1.0 * 0.05 = 0.05
      // Total: 0.4 + 0.01 + 0.05 = 0.46
      expect(result[0].score).toBeCloseTo(0.46, 5);
    });

    it('applies combined momentum + depth bonus', () => {
      // Chain: 1 -> 2 -> 3
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);
      // Add more edges to node 2 to increase momentum
      insertEdge(db, 4, 2);

      const rows = [{ id: 2, score: 0.5 }];
      const result = applyGraphSignals(rows, db);

      // Node 2: degree = 3 (1->2, 2->3, 4->2), past = 0, momentum = 3
      // momentumBonus = clamp(3 * 0.01, 0, 0.05) = 0.03
      // Roots: 1, 4 (in-degree 0)
      // BFS from roots [1,4]:
      //   1 -> depth 0, 4 -> depth 0
      //   2 -> depth 1 (from 1 or 4)
      //   3 -> depth 2
      // maxDepth = 2, depth(2) = 1/2 = 0.5
      // depthBonus = 0.5 * 0.05 = 0.025
      // Total: 0.5 + 0.03 + 0.025 = 0.555
      expect(result[0].score).toBeCloseTo(0.555, 5);
    });

    it('caps momentum bonus at 0.05', () => {
      // Create many edges for node 1 to drive high momentum
      for (let i = 2; i <= 12; i++) {
        insertEdge(db, 1, i);
      }
      // Node 1: degree 10, momentum = 10
      // momentumBonus = clamp(10 * 0.01, 0, 0.05) = min(0.10, 0.05) = 0.05

      const rows = [{ id: 1, score: 0.5 }];
      const result = applyGraphSignals(rows, db);

      // depthBonus for root node = 0
      // Total: 0.5 + 0.05 + 0 = 0.55
      expect(result[0].score).toBeCloseTo(0.55, 5);
    });

    it('caps depth bonus at 0.05 (max normalized depth is 1.0)', () => {
      // Chain: 1 -> 2 -> 3
      insertEdge(db, 1, 2);
      insertEdge(db, 2, 3);

      // Node 3: depth = 1.0, depthBonus = 1.0 * 0.05 = 0.05 (this IS the cap)
      const rows = [{ id: 3, score: 0.0 }];
      const result = applyGraphSignals(rows, db);

      // momentum for 3: degree 1, past 0 -> momentum 1
      // momentumBonus = 0.01
      // depthBonus = 0.05
      // Total = 0 + 0.01 + 0.05 = 0.06
      expect(result[0].score).toBeCloseTo(0.06, 5);
    });

    it('defaults score to 0 for rows without a score property', () => {
      insertEdge(db, 1, 2);

      const rows = [{ id: 1 }];
      const result = applyGraphSignals(rows, db);

      // baseScore defaults to 0 when score is undefined
      // momentum = 1 (degree 1, no history)
      // momentumBonus = 0.01
      // Roots: [1], BFS: 1=0, 2=1, maxDepth=1
      // depth(1) = 0/1 = 0, depthBonus = 0
      // Total: 0 + 0.01 + 0 = 0.01
      expect(result[0].score).toBeCloseTo(0.01, 5);
    });

    it('handles rows with non-finite score gracefully', () => {
      const rows = [{ id: 1, score: NaN }];
      const result = applyGraphSignals(rows, db);

      // NaN is not finite, so baseScore defaults to 0
      // No edges, so bonuses are 0
      expect(result[0].score).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 7. clearGraphSignalsCache
  // ─────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────
  // 8. Edge cases
  // ─────────────────────────────────────────────────────────────
  describe('Edge cases', () => {
    it('non-existent memoryId returns 0 for momentum signal', () => {
      insertEdge(db, 1, 2);

      const momentum = computeMomentum(db, 9999);

      expect(momentum).toBe(0);
    });

    it('self-referencing edge is handled correctly', () => {
      // Insert a self-loop: 1 -> 1
      insertEdge(db, 1, 1);

      // snapshotDegrees should handle it
      const snapshot = snapshotDegrees(db);
      expect(snapshot.snapshotted).toBe(1);

      // getCurrentDegree uses COUNT(*) with WHERE source_id = ? OR target_id = ?
      // A self-loop is a single row where both conditions match, so COUNT = 1
      const degree = __testables.getCurrentDegree(db, 1);
      expect(degree).toBe(1);

      // Momentum: degree 1, no past -> 1
      const momentum = computeMomentum(db, 1);
      expect(momentum).toBe(1);
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

  // ─────────────────────────────────────────────────────────────
  // 9. __testables internal helpers
  // ─────────────────────────────────────────────────────────────
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

    it('getPastDegree returns 0 when no snapshot at -7 days', () => {
      // Insert snapshot for a different date (not 7 days ago)
      insertSnapshot(db, 1, 5, '2020-01-01');
      expect(__testables.getPastDegree(db, 1)).toBe(0);
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
