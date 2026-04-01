// TEST: TEMPORAL EDGES, CONTRADICTION DETECTION, USAGE TRACKING
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import {
  ensureTemporalColumns,
  invalidateEdge,
  getValidEdges,
} from '../lib/graph/temporal-edges.js';
import { detectContradictions } from '../lib/graph/contradiction-detection.js';
import {
  ensureUsageColumn,
  incrementAccessCount,
  getAccessCount,
} from '../lib/graph/usage-tracking.js';
import { computeUsageBoost } from '../lib/graph/usage-ranking-signal.js';

type SqliteDatabase = InstanceType<typeof Database>;

describe('Temporal Edges', () => {
  let db: SqliteDatabase;

  beforeAll(() => {
    process.env.SPECKIT_TEMPORAL_EDGES = 'true';
    process.env.SPECKIT_USAGE_RANKING = 'true';
    db = new Database(':memory:');

    // Create causal_edges table matching production schema
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
        UNIQUE(source_id, target_id, relation)
      )
    `);

    // Create memory_index table (needed for usage tracking)
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
  });

  afterAll(() => {
    delete process.env.SPECKIT_TEMPORAL_EDGES;
    delete process.env.SPECKIT_USAGE_RANKING;
    db.close();
  });

  // ─────────────────────────────────────────────────────────────
  // TEMPORAL COLUMNS
  // ─────────────────────────────────────────────────────────────

  describe('ensureTemporalColumns', () => {
    it('should add valid_at and invalid_at columns', () => {
      ensureTemporalColumns(db);

      // Verify columns exist by inserting a row that uses them
      db.exec(`
        INSERT INTO causal_edges (source_id, target_id, relation, valid_at, invalid_at)
        VALUES ('100', '200', 'caused', '2026-01-01T00:00:00Z', NULL)
      `);

      const row = db.prepare(`
        SELECT valid_at, invalid_at FROM causal_edges WHERE source_id = '100' AND target_id = '200'
      `).get() as { valid_at: string | null; invalid_at: string | null };

      expect(row.valid_at).toBe('2026-01-01T00:00:00Z');
      expect(row.invalid_at).toBeNull();

      // Cleanup
      db.exec(`DELETE FROM causal_edges WHERE source_id = '100'`);
    });

    it('should be idempotent — second call does not throw', () => {
      ensureTemporalColumns(db);
      expect(() => ensureTemporalColumns(db)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // EDGE INVALIDATION
  // ─────────────────────────────────────────────────────────────

  describe('invalidateEdge', () => {
    beforeEach(() => {
      db.exec('DELETE FROM causal_edges');
    });

    it('should set invalid_at on a valid edge', () => {
      db.exec(`
        INSERT INTO causal_edges (source_id, target_id, relation)
        VALUES ('1', '2', 'caused')
      `);

      invalidateEdge(db, 1, 2);

      const row = db.prepare(`
        SELECT invalid_at FROM causal_edges WHERE source_id = '1' AND target_id = '2'
      `).get() as { invalid_at: string | null };

      expect(row.invalid_at).not.toBeNull();
      expect(row.invalid_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should record reason in evidence column', () => {
      db.exec(`
        INSERT INTO causal_edges (source_id, target_id, relation)
        VALUES ('3', '4', 'supports')
      `);

      invalidateEdge(db, 3, 4, 'Superseded by new edge');

      const row = db.prepare(`
        SELECT evidence FROM causal_edges WHERE source_id = '3' AND target_id = '4'
      `).get() as { evidence: string | null };

      expect(row.evidence).toContain('Superseded by new edge');
    });

    it('should not re-invalidate an already invalidated edge', () => {
      db.exec(`
        INSERT INTO causal_edges (source_id, target_id, relation, invalid_at)
        VALUES ('5', '6', 'enabled', '2026-01-01T00:00:00Z')
      `);

      invalidateEdge(db, 5, 6);

      const row = db.prepare(`
        SELECT invalid_at FROM causal_edges WHERE source_id = '5' AND target_id = '6'
      `).get() as { invalid_at: string | null };

      // Should remain the original timestamp, not updated
      expect(row.invalid_at).toBe('2026-01-01T00:00:00Z');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // VALID EDGE RETRIEVAL
  // ─────────────────────────────────────────────────────────────

  describe('getValidEdges', () => {
    beforeEach(() => {
      db.exec('DELETE FROM causal_edges');
    });

    it('should return only edges where invalid_at IS NULL', () => {
      db.exec(`
        INSERT INTO causal_edges (source_id, target_id, relation) VALUES ('10', '20', 'caused');
        INSERT INTO causal_edges (source_id, target_id, relation, invalid_at)
          VALUES ('10', '30', 'supports', '2026-01-01T00:00:00Z');
        INSERT INTO causal_edges (source_id, target_id, relation) VALUES ('40', '10', 'enabled');
      `);

      const edges = getValidEdges(db, 10);
      expect(edges).toHaveLength(2);

      const relations = edges.map((e) => e.relation).sort();
      expect(relations).toEqual(['caused', 'enabled']);
    });

    it('should return empty array for a node with no edges', () => {
      const edges = getValidEdges(db, 9999);
      expect(edges).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // CONTRADICTION DETECTION
  // ─────────────────────────────────────────────────────────────

  describe('detectContradictions', () => {
    beforeEach(() => {
      db.exec('DELETE FROM causal_edges');
    });

    it('should detect supersedes contradiction and invalidate old edge', () => {
      db.exec(`
        INSERT INTO causal_edges (source_id, target_id, relation)
        VALUES ('50', '60', 'caused')
      `);

      const contradictions = detectContradictions(db, 50, 60, 'supersedes');
      expect(contradictions).toHaveLength(1);
      expect(contradictions[0]!.oldEdge.relation).toBe('caused');
      expect(contradictions[0]!.oldRelation).toBe('caused');
      expect(contradictions[0]!.reason).toContain('Superseded');

      // Verify the old edge was invalidated
      const row = db.prepare(`
        SELECT invalid_at FROM causal_edges WHERE source_id = '50' AND target_id = '60' AND relation = 'caused'
      `).get() as { invalid_at: string | null };
      expect(row.invalid_at).not.toBeNull();
    });

    it('should detect conflicting relation pairs (supports vs contradicts)', () => {
      db.exec(`
        INSERT INTO causal_edges (source_id, target_id, relation)
        VALUES ('70', '80', 'supports')
      `);

      const contradictions = detectContradictions(db, 70, 80, 'contradicts');
      expect(contradictions).toHaveLength(1);
      expect(contradictions[0]!.reason).toContain('Conflicting relations');
    });

    it('should return empty array when no contradictions exist', () => {
      db.exec(`
        INSERT INTO causal_edges (source_id, target_id, relation)
        VALUES ('90', '100', 'caused')
      `);

      const contradictions = detectContradictions(db, 90, 100, 'enabled');
      expect(contradictions).toEqual([]);
    });

    it('should ignore already-invalidated edges', () => {
      db.exec(`
        INSERT INTO causal_edges (source_id, target_id, relation, invalid_at)
        VALUES ('110', '120', 'supports', '2026-01-01T00:00:00Z')
      `);

      const contradictions = detectContradictions(db, 110, 120, 'contradicts');
      expect(contradictions).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // USAGE TRACKING
  // ─────────────────────────────────────────────────────────────

  describe('ensureUsageColumn', () => {
    it('should add access_count column to memory_index', () => {
      ensureUsageColumn(db);

      // Insert a row and verify the column works
      db.exec(`INSERT INTO memory_index (spec_folder, file_path, title) VALUES ('test', '/test.md', 'Test')`);
      const row = db.prepare(`SELECT access_count FROM memory_index WHERE spec_folder = 'test'`).get() as { access_count: number | null };
      expect(row.access_count).toBe(0);

      // Cleanup
      db.exec(`DELETE FROM memory_index WHERE spec_folder = 'test'`);
    });

    it('should be idempotent', () => {
      expect(() => ensureUsageColumn(db)).not.toThrow();
    });
  });

  describe('incrementAccessCount', () => {
    beforeEach(() => {
      db.exec(`DELETE FROM memory_index`);
      db.exec(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (1, 'test', '/test.md', 'Test')`);
    });

    it('should increment from 0 to 1', () => {
      incrementAccessCount(db, 1);
      expect(getAccessCount(db, 1)).toBe(1);
    });

    it('should increment multiple times', () => {
      incrementAccessCount(db, 1);
      incrementAccessCount(db, 1);
      incrementAccessCount(db, 1);
      expect(getAccessCount(db, 1)).toBe(3);
    });

    it('should return 0 for non-existent memory', () => {
      expect(getAccessCount(db, 9999)).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // USAGE BOOST COMPUTATION
  // ─────────────────────────────────────────────────────────────

  describe('computeUsageBoost', () => {
    it('should return 0 for zero access count', () => {
      expect(computeUsageBoost(0, 100)).toBe(0);
    });

    it('should return 0 for zero maxAccess', () => {
      expect(computeUsageBoost(5, 0)).toBe(0);
    });

    it('should return max boost (0.10) when count equals maxAccess', () => {
      const boost = computeUsageBoost(100, 100);
      expect(boost).toBeCloseTo(0.10, 4);
    });

    it('should return intermediate boost for partial access', () => {
      const boost = computeUsageBoost(10, 100);
      expect(boost).toBeGreaterThan(0);
      expect(boost).toBeLessThan(0.10);
    });

    it('should never exceed 0.10', () => {
      // Even if accessCount > maxAccess (edge case)
      const boost = computeUsageBoost(200, 100);
      expect(boost).toBeLessThanOrEqual(0.10);
    });

    it('should handle negative inputs gracefully', () => {
      expect(computeUsageBoost(-5, 100)).toBe(0);
      expect(computeUsageBoost(5, -100)).toBe(0);
    });

    it('should handle NaN inputs gracefully', () => {
      expect(computeUsageBoost(NaN, 100)).toBe(0);
      expect(computeUsageBoost(5, NaN)).toBe(0);
    });

    it('should use log-scale (low counts get proportionally more boost)', () => {
      const boost1 = computeUsageBoost(1, 1000);
      const boost10 = computeUsageBoost(10, 1000);
      const boost100 = computeUsageBoost(100, 1000);

      // Each 10x increase should give less than 10x the boost (log-scale)
      expect(boost10 / boost1).toBeLessThan(10);
      expect(boost100 / boost10).toBeLessThan(10);
      // But still monotonically increasing
      expect(boost10).toBeGreaterThan(boost1);
      expect(boost100).toBeGreaterThan(boost10);
    });
  });
});
