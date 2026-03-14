// ───────────────────────────────────────────────────────────────
// 1. TEST — EDGE DENSITY
// ───────────────────────────────────────────────────────────────
// T003 acceptance tests for lib/eval/edge-density.ts
//
// Test cases:
// D1 — Dense graph returns density >= 1.0 ("dense")
// D2 — Sparse graph returns density < 0.5 with R10 escalation
// D3 — Moderate graph returns 0.5 <= density < 1.0 ("moderate")
// D4 — Empty graph (no edges) handles gracefully
// D5 — Report format includes all required fields

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { measureEdgeDensity, formatDensityReport } from '../lib/eval/edge-density';

/* ───────────────────────────────────────────────────────────────
   HELPERS — build an in-memory test DB with required tables
──────────────────────────────────────────────────────────────── */

function createTestDb(): InstanceType<typeof Database> {
  const db = new Database(':memory:');

  db.exec(`
    CREATE TABLE IF NOT EXISTS causal_edges (
      id   TEXT PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation  TEXT NOT NULL,
      strength  REAL DEFAULT 1.0,
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT (datetime('now')),
      reason TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id              INTEGER PRIMARY KEY,
      title           TEXT,
      importance_tier TEXT DEFAULT 'normal'
    )
  `);

  return db;
}

/** Insert edges by (source, target) pairs. IDs are auto-generated. */
function insertEdges(db: InstanceType<typeof Database>, pairs: Array<[string, string]>): void {
  const stmt = db.prepare(
    'INSERT INTO causal_edges (id, source_id, target_id, relation) VALUES (?, ?, ?, ?)',
  );
  pairs.forEach(([src, tgt], idx) => {
    stmt.run(`e${idx + 1}`, src, tgt, 'caused');
  });
}

/** Insert N memory rows (IDs 1..n). */
function insertMemories(db: InstanceType<typeof Database>, count: number): void {
  const stmt = db.prepare(
    'INSERT INTO memory_index (id, title) VALUES (?, ?)',
  );
  for (let i = 1; i <= count; i++) {
    stmt.run(i, `Memory ${i}`);
  }
}

/* ───────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('Edge Density (T011)', () => {
  let db: InstanceType<typeof Database>;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    try { db.close(); } catch {}
  });

  /* ───────────────────────────────────────────────────────────────
     D1: Dense graph — density >= 1.0
     5 nodes (1,2,3,4,5), 6 edges → density = 6/5 = 1.2
  ──────────────────────────────────────────────────────────────── */
  describe('D1: Dense graph', () => {
    it('returns edgeCount = 6', () => {
      insertMemories(db, 5);
      insertEdges(db, [
        ['1', '2'], ['1', '3'], ['2', '3'],
        ['3', '4'], ['4', '5'], ['5', '1'],
      ]);
      const result = measureEdgeDensity(db);
      expect(result.edgeCount).toBe(6);
    });

    it('returns nodeCount = 5', () => {
      insertMemories(db, 5);
      insertEdges(db, [
        ['1', '2'], ['1', '3'], ['2', '3'],
        ['3', '4'], ['4', '5'], ['5', '1'],
      ]);
      const result = measureEdgeDensity(db);
      expect(result.nodeCount).toBe(5);
    });

    it('returns density = 1.2', () => {
      insertMemories(db, 5);
      insertEdges(db, [
        ['1', '2'], ['1', '3'], ['2', '3'],
        ['3', '4'], ['4', '5'], ['5', '1'],
      ]);
      const result = measureEdgeDensity(db);
      expect(result.density).toBeCloseTo(1.2, 5);
    });

    it('classifies as "dense"', () => {
      insertMemories(db, 5);
      insertEdges(db, [
        ['1', '2'], ['1', '3'], ['2', '3'],
        ['3', '4'], ['4', '5'], ['5', '1'],
      ]);
      const result = measureEdgeDensity(db);
      expect(result.classification).toBe('dense');
    });

    it('r10Escalation is false', () => {
      insertMemories(db, 5);
      insertEdges(db, [
        ['1', '2'], ['1', '3'], ['2', '3'],
        ['3', '4'], ['4', '5'], ['5', '1'],
      ]);
      const result = measureEdgeDensity(db);
      expect(result.r10Escalation).toBe(false);
    });

    it('r10Recommendation is undefined', () => {
      insertMemories(db, 5);
      insertEdges(db, [
        ['1', '2'], ['1', '3'], ['2', '3'],
        ['3', '4'], ['4', '5'], ['5', '1'],
      ]);
      const result = measureEdgeDensity(db);
      expect(result.r10Recommendation).toBeUndefined();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     D2: Sparse graph → R10 escalation
     Density uses edgeCount / totalMemories, so non-empty sparse graphs
     are possible and should trigger escalation when below 0.5.
  ──────────────────────────────────────────────────────────────── */
  describe('D2: Sparse graph → R10 escalation', () => {
    // No edges inserted in beforeEach — sparse = empty edge table
    beforeEach(() => {
      insertMemories(db, 10);
    });

    it('returns density = 0 when no edges exist', () => {
      const result = measureEdgeDensity(db);
      expect(result.density).toBe(0);
    });

    it('returns density < 0.5 when no edges exist', () => {
      const result = measureEdgeDensity(db);
      expect(result.density).toBeLessThan(0.5);
    });

    it('classifies as "sparse" when density = 0', () => {
      const result = measureEdgeDensity(db);
      expect(result.classification).toBe('sparse');
    });

    it('r10Escalation is true when density = 0 (no edges)', () => {
      const result = measureEdgeDensity(db);
      expect(result.r10Escalation).toBe(true);
    });

    it('r10Recommendation is defined when r10Escalation is true', () => {
      const result = measureEdgeDensity(db);
      expect(result.r10Recommendation).toBeDefined();
      expect(typeof result.r10Recommendation).toBe('string');
      expect(result.r10Recommendation!.length).toBeGreaterThan(0);
    });

    it('r10Recommendation mentions R10 and R4', () => {
      const result = measureEdgeDensity(db);
      expect(result.r10Recommendation).toContain('R10');
      expect(result.r10Recommendation).toContain('R4');
    });

    it('r10Recommendation mentions timeline', () => {
      const result = measureEdgeDensity(db);
      expect(result.r10Recommendation).toMatch(/sprint|timeline|priority/i);
    });

    it('returns density = 0.4 for 4 edges over 10 memories (non-empty sparse graph)', () => {
      insertEdges(db, [
        ['1', '2'],
        ['3', '4'],
        ['5', '6'],
        ['7', '8'],
      ]);
      const result = measureEdgeDensity(db);
      expect(result.edgeCount).toBe(4);
      expect(result.totalMemories).toBe(10);
      expect(result.density).toBeCloseTo(0.4, 10);
      expect(result.classification).toBe('sparse');
      expect(result.r10Escalation).toBe(true);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     D3: Moderate graph — 0.5 <= density < 1.0
     4 nodes in a chain (1→2→3→4, 2→4) → 3 edges, 4 nodes = 0.75
  ──────────────────────────────────────────────────────────────── */
  describe('D3: Moderate graph (0.5 <= density < 1.0)', () => {
    beforeEach(() => {
      insertMemories(db, 4);
      // Chain: 1→2→3→4 plus extra edge 2→4 → 3 edges, 4 unique nodes → density = 0.75
      insertEdges(db, [['1', '2'], ['2', '3'], ['3', '4']]);
    });

    it('returns density = 0.75', () => {
      const result = measureEdgeDensity(db);
      expect(result.density).toBeCloseTo(0.75, 5);
    });

    it('classifies as "moderate"', () => {
      const result = measureEdgeDensity(db);
      expect(result.classification).toBe('moderate');
    });

    it('r10Escalation is false', () => {
      const result = measureEdgeDensity(db);
      expect(result.r10Escalation).toBe(false);
    });

    it('density is in [0.5, 1.0)', () => {
      const result = measureEdgeDensity(db);
      expect(result.density).toBeGreaterThanOrEqual(0.5);
      expect(result.density).toBeLessThan(1.0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     D4: Empty graph — no edges at all
  ──────────────────────────────────────────────────────────────── */
  describe('D4: Empty graph', () => {
    it('returns edgeCount = 0', () => {
      insertMemories(db, 5);
      const result = measureEdgeDensity(db);
      expect(result.edgeCount).toBe(0);
    });

    it('returns nodeCount = 0', () => {
      insertMemories(db, 5);
      const result = measureEdgeDensity(db);
      expect(result.nodeCount).toBe(0);
    });

    it('returns density = 0', () => {
      insertMemories(db, 5);
      const result = measureEdgeDensity(db);
      expect(result.density).toBe(0);
    });

    it('classifies as "sparse"', () => {
      insertMemories(db, 5);
      const result = measureEdgeDensity(db);
      expect(result.classification).toBe('sparse');
    });

    it('r10Escalation is true', () => {
      insertMemories(db, 5);
      const result = measureEdgeDensity(db);
      expect(result.r10Escalation).toBe(true);
    });

    it('totalMemories reflects memory_index count', () => {
      insertMemories(db, 5);
      const result = measureEdgeDensity(db);
      expect(result.totalMemories).toBe(5);
    });

    it('totalMemories = 0 on completely empty DB', () => {
      const result = measureEdgeDensity(db);
      expect(result.totalMemories).toBe(0);
      expect(result.edgeCount).toBe(0);
      expect(result.density).toBe(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     D5: Report format includes all required fields
  ──────────────────────────────────────────────────────────────── */
  describe('D5: Report format', () => {
    it('report includes "Edge Density Report" header', () => {
      insertMemories(db, 3);
      insertEdges(db, [['1', '2'], ['2', '3']]);
      const result = measureEdgeDensity(db);
      const report = formatDensityReport(result);
      expect(report).toContain('Edge Density Report');
    });

    it('report includes edgeCount', () => {
      insertMemories(db, 3);
      insertEdges(db, [['1', '2'], ['2', '3']]);
      const result = measureEdgeDensity(db);
      const report = formatDensityReport(result);
      expect(report).toContain('2'); // 2 edges
    });

    it('report includes nodeCount', () => {
      insertMemories(db, 3);
      insertEdges(db, [['1', '2'], ['2', '3']]);
      const result = measureEdgeDensity(db);
      const report = formatDensityReport(result);
      expect(report).toMatch(/Unique nodes/i);
    });

    it('report includes totalMemories', () => {
      insertMemories(db, 3);
      insertEdges(db, [['1', '2'], ['2', '3']]);
      const result = measureEdgeDensity(db);
      const report = formatDensityReport(result);
      expect(report).toMatch(/Total memories/i);
    });

    it('report includes density value', () => {
      insertMemories(db, 3);
      insertEdges(db, [['1', '2'], ['2', '3']]);
      const result = measureEdgeDensity(db);
      const report = formatDensityReport(result);
      expect(report).toMatch(/Density/i);
      expect(report).toContain(result.density.toFixed(4));
    });

    it('report includes classification label', () => {
      insertMemories(db, 3);
      insertEdges(db, [['1', '2'], ['2', '3']]);
      const result = measureEdgeDensity(db);
      const report = formatDensityReport(result);
      expect(report).toMatch(/Classification/i);
      expect(report).toMatch(/MODERATE|DENSE|SPARSE/);
    });

    it('report includes R10 escalation field', () => {
      insertMemories(db, 3);
      insertEdges(db, [['1', '2'], ['2', '3']]);
      const result = measureEdgeDensity(db);
      const report = formatDensityReport(result);
      expect(report).toMatch(/R10 escalation/i);
    });

    it('report includes R10 recommendation block when escalation is true', () => {
      const result = measureEdgeDensity(db); // no edges → sparse
      const report = formatDensityReport(result);
      expect(report).toContain('R10 Recommendation');
    });

    it('report does NOT include R10 recommendation block when escalation is false', () => {
      insertMemories(db, 3);
      insertEdges(db, [['1', '2'], ['2', '3']]);
      // Density = 2/3 = 0.667 → moderate, no escalation
      const result = measureEdgeDensity(db);
      expect(result.r10Escalation).toBe(false);
      const report = formatDensityReport(result);
      expect(report).not.toContain('R10 Recommendation');
    });

    it('formatDensityReport returns a string', () => {
      const result = measureEdgeDensity(db);
      const report = formatDensityReport(result);
      expect(typeof report).toBe('string');
      expect(report.length).toBeGreaterThan(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     D6: Boundary — density exactly 0.5 classifies as "moderate"
  ──────────────────────────────────────────────────────────────── */
  describe('D6: Boundary density = 0.5', () => {
    it('density = 0.5 classifies as "moderate" not "sparse"', () => {
      insertMemories(db, 2);
      // 1 edge, 2 unique nodes → density = 0.5
      insertEdges(db, [['A', 'B']]);
      const result = measureEdgeDensity(db);
      expect(result.density).toBeCloseTo(0.5, 10);
      expect(result.classification).toBe('moderate');
      expect(result.r10Escalation).toBe(false);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     D7: Boundary — density exactly 1.0 classifies as "dense"
  ──────────────────────────────────────────────────────────────── */
  describe('D7: Boundary density = 1.0', () => {
    it('density = 1.0 classifies as "dense"', () => {
      insertMemories(db, 2);
      // 2 edges between same 2 nodes is disallowed by uniqueness, use 3 nodes with 3 edges
      // But unique: A→B, B→A → if schema allows, 2 edges, 2 nodes → 1.0
      db.prepare(
        'INSERT INTO causal_edges (id, source_id, target_id, relation) VALUES (?, ?, ?, ?)',
      ).run('bd1', 'M', 'N', 'caused');
      db.prepare(
        'INSERT INTO causal_edges (id, source_id, target_id, relation) VALUES (?, ?, ?, ?)',
      ).run('bd2', 'N', 'M', 'caused');
      const result = measureEdgeDensity(db);
      expect(result.density).toBeCloseTo(1.0, 10);
      expect(result.classification).toBe('dense');
    });
  });
});
