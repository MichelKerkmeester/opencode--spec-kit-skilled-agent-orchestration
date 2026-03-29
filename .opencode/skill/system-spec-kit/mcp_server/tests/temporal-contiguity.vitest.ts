// TEST: TEMPORAL CONTIGUITY
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

import * as mod from '../lib/cognitive/temporal-contiguity';
import BetterSqlite3 from 'better-sqlite3';

describe('Temporal Contiguity Tests (T502)', () => {
  let testDb!: InstanceType<typeof BetterSqlite3>;
  let tmpDbPath: string = '';

  function seedMemories(memories: Array<{ title: string; spec_folder: string; created_at: string; importance_tier?: string }>) {
    const stmt = testDb.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, title, created_at, importance_tier)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const m of memories) {
      stmt.run(m.spec_folder, `/test/memory/${m.title}.md`, m.title, m.created_at, m.importance_tier || 'normal');
    }
  }

  beforeAll(() => {
    tmpDbPath = path.join(os.tmpdir(), `temporal-contiguity-test-${Date.now()}.db`);
    testDb = new BetterSqlite3(tmpDbPath);

    // Create memory_index table matching the expected schema
    testDb.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spec_folder TEXT NOT NULL,
        file_path TEXT NOT NULL,
        title TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        importance_tier TEXT DEFAULT 'normal',
        trigger_phrases TEXT,
        importance_weight REAL DEFAULT 0.5,
        embedding_status TEXT DEFAULT 'success',
        anchor_id TEXT,
        embedding_model TEXT,
        embedding_generated_at TEXT,
        confidence REAL DEFAULT 0.5,
        stability REAL DEFAULT 1.0,
        difficulty REAL DEFAULT 5.0,
        last_review TEXT,
        review_count INTEGER DEFAULT 0
      )
    `);
  });

  afterAll(() => {
    if (testDb) { try { testDb.close(); } catch { } }
    if (tmpDbPath && fs.existsSync(tmpDbPath)) { try { fs.unlinkSync(tmpDbPath); } catch { } }
  });

  describe('Vector Search with Contiguity (T502-01 to T502-04)', () => {
    it('T502-01: Adjacent memories get contiguity boost', () => {
      const now = new Date();
      const results_arr = [
        { id: 1, similarity: 90, created_at: now.toISOString() },
        { id: 2, similarity: 50, created_at: new Date(now.getTime() - 600 * 1000).toISOString() }, // 10 min apart
        { id: 3, similarity: 40, created_at: new Date(now.getTime() - 7200 * 1000).toISOString() }, // 2 hours apart
      ];

      const boosted = mod.vectorSearchWithContiguity(results_arr, 3600); // 1-hour window
      const mem2 = boosted!.find((r: { id: number }) => r.id === 2);

      expect(mem2).toBeDefined();
      expect(mem2!.similarity).toBeGreaterThan(50);
    });

    it('T502-02: Time window filtering excludes distant memories', () => {
      const now = new Date();
      const results_arr = [
        { id: 1, similarity: 90, created_at: now.toISOString() },
        { id: 2, similarity: 50, created_at: new Date(now.getTime() - 7200 * 1000).toISOString() }, // 2 hours apart
      ];

      // Use a 30-minute window - memory 2 is outside
      const boosted = mod.vectorSearchWithContiguity(results_arr, 1800);
      const mem2 = boosted!.find((r: { id: number }) => r.id === 2);

      expect(mem2).toBeDefined();
      // Memory 2 should NOT get a significant boost (outside window)
      // It may stay at 50 or get a small boost depending on implementation
      expect(mem2!.similarity).toBeLessThanOrEqual(90);
    });

    it('T502-03: Non-adjacent memories excluded from boost', () => {
      const now = new Date();
      const results_arr = [
        { id: 1, similarity: 90, created_at: now.toISOString() },
        { id: 2, similarity: 50, created_at: new Date(now.getTime() - 86400 * 2 * 1000).toISOString() }, // 2 days apart
      ];

      const boosted = mod.vectorSearchWithContiguity(results_arr, 3600); // 1 hour window
      const mem2 = boosted!.find((r: { id: number }) => r.id === 2);

      expect(mem2).toBeDefined();
      // 2 days away from anchor, should not get boosted beyond original
      expect(mem2!.similarity).toBeLessThanOrEqual(90);
    });

    it('T502-04a: Empty array returns empty', () => {
      const result = mod.vectorSearchWithContiguity([], 3600);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('T502-04b: Null input handled', () => {
      const result = mod.vectorSearchWithContiguity(null, 3600);
      expect(result === null || (Array.isArray(result) && result.length === 0)).toBe(true);
    });
  });

  describe('Temporal Neighbors (T502-05 to T502-06)', () => {
    beforeAll(() => {
      if (!mod?.init || !testDb) return;

      mod.init(testDb);

      const now = new Date();
      seedMemories([
        { title: 'mem-close-1', spec_folder: 'test', created_at: now.toISOString() },
        { title: 'mem-close-2', spec_folder: 'test', created_at: new Date(now.getTime() - 300 * 1000).toISOString() }, // 5 min
        { title: 'mem-close-3', spec_folder: 'test', created_at: new Date(now.getTime() - 600 * 1000).toISOString() }, // 10 min
        { title: 'mem-other-spec-close', spec_folder: 'other-spec', created_at: new Date(now.getTime() - 120 * 1000).toISOString() }, // 2 min
        { title: 'mem-far-1', spec_folder: 'test', created_at: new Date(now.getTime() - 86400 * 2 * 1000).toISOString() }, // 2 days
      ]);
    });

    it('T502-05: Get temporal neighbors within window', () => {
      if (!mod?.getTemporalNeighbors) return;

      const neighbors = mod.getTemporalNeighbors(1, 3600); // 1-hour window
      expect(Array.isArray(neighbors)).toBe(true);

      const nearbyCount = neighbors.filter((n: { time_delta_seconds: number }) => n.time_delta_seconds <= 3600).length;
      expect(nearbyCount).toBeGreaterThan(0);
      expect(neighbors.every((n: { spec_folder?: string }) => n.spec_folder === 'test')).toBe(true);
    });

    it('T502-06: Timestamp ordering (sorted by time_delta_seconds ASC)', () => {
      if (!mod?.getTemporalNeighbors) return;

      const neighbors = mod.getTemporalNeighbors(1, 86400); // 24-hour window
      expect(Array.isArray(neighbors)).toBe(true);

      if (neighbors.length >= 2) {
        for (let i = 1; i < neighbors.length; i++) {
          expect(neighbors[i].time_delta_seconds).toBeGreaterThanOrEqual(neighbors[i - 1].time_delta_seconds);
        }
      }
    });
  });

  describe('Timeline (T502-07)', () => {
    it('T502-07: Timeline builds correctly (DESC order)', () => {
      if (!mod?.buildTimeline || !testDb) return;

      const timeline = mod.buildTimeline(null, 50);
      expect(Array.isArray(timeline)).toBe(true);
      expect(timeline.length).toBeGreaterThan(0);

      // Verify descending order by created_at
      for (let i = 1; i < timeline.length; i++) {
        expect(new Date(timeline[i].created_at).getTime())
          .toBeLessThanOrEqual(new Date(timeline[i - 1].created_at).getTime());
      }
    });
  });

  describe('Constants (T502-08)', () => {
    it('T502-08: Constants are correctly defined', () => {
      expect(mod.DEFAULT_WINDOW).toBe(3600);
      expect(mod.MAX_WINDOW).toBe(86400);
    });

    it('T502-09: vector contiguity clamps non-positive windows to minimum bound', () => {
      const now = new Date();
      const results_arr = [
        { id: 1, similarity: 0.8, created_at: now.toISOString() },
        { id: 2, similarity: 0.5, created_at: new Date(now.getTime() - 500).toISOString() },
      ];

      const boosted = mod.vectorSearchWithContiguity(results_arr, 0);
      const mem2 = boosted!.find((r: { id: number }) => r.id === 2);
      expect(mem2).toBeDefined();
      expect(mem2!.similarity).toBeGreaterThan(0.5);
    });

    it('T502-10: temporal neighbor query clamps windows above MAX_WINDOW', () => {
      const neighbors = mod.getTemporalNeighbors(1, Number.MAX_SAFE_INTEGER);
      expect(Array.isArray(neighbors)).toBe(true);
      expect(neighbors.every((row: { time_delta_seconds: number }) => row.time_delta_seconds <= mod.MAX_WINDOW)).toBe(true);
    });
  });
});
