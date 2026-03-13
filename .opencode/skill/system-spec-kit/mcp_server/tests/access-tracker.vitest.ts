// TEST: ACCESS TRACKER
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import Database from 'better-sqlite3';
import * as mod from '../lib/storage/access-tracker';

type TestDatabase = Database.Database;
type AccessCountRow = {
  access_count: number;
};

let db: TestDatabase | null = null;
let dbPath = '';

function requireDb(): TestDatabase {
  if (!db) {
    throw new Error('Test database not initialized');
  }
  return db;
}

describe('Access Tracker (T507)', () => {
  beforeAll(() => {
    dbPath = path.join(os.tmpdir(), `access-tracker-test-${Date.now()}.sqlite`);
    db = new Database(dbPath);

    db.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY,
        title TEXT,
        access_count INTEGER DEFAULT 0,
        last_accessed INTEGER DEFAULT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const insert = db.prepare('INSERT INTO memory_index (id, title) VALUES (?, ?)');
    insert.run(1, 'Test Memory 1');
    insert.run(2, 'Test Memory 2');
    insert.run(3, 'Test Memory 3');
    insert.run(4, 'Test Memory 4');
    insert.run(5, 'Test Memory 5');

    mod.init(db);
  });

  afterAll(() => {
    try {
      if (mod && typeof mod.reset === 'function') {
        mod.reset();
      }
      if (db) {
        db.close();
        db = null;
      }
      if (dbPath && fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
    } catch { /* ignore cleanup errors */ }
  });

  describe('Track Access (T507-01)', () => {
    it('T507-01: trackAccess returns true on accumulate', () => {
      const result1 = mod.trackAccess(1);
      expect(result1).toBe(true);
    });

    it('T507-01b: Accumulator state updated after trackAccess', () => {
      const state = mod.getAccumulatorState(1);
      expect(state).toBeDefined();
      expect(typeof state.accumulated).toBe('number');
      expect(state.accumulated).toBeGreaterThan(0);
    });
  });

  describe('Access Count Flush at Threshold (T507-02)', () => {
    it('T507-02: Access count flushed to database at threshold', () => {
      mod.reset();
      mod.init(requireDb());

      // Track access 5 times for memory 2 (5 * 0.1 = 0.5 >= threshold)
      for (let i = 0; i < 4; i++) {
        mod.trackAccess(2);
      }

      // The 5th call should trigger flush (0.4 + 0.1 = 0.5 >= ACCUMULATOR_THRESHOLD)
      mod.trackAccess(2);

      const row = requireDb().prepare('SELECT access_count FROM memory_index WHERE id = 2').get() as AccessCountRow;
      expect(row.access_count).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Track Multiple Accesses (T507-03)', () => {
    it('T507-03: trackMultipleAccesses tracks correct count', () => {
      mod.reset();
      mod.init(requireDb());

      const memoryIds = [3, 4, 5, 3, 4];
      const result = mod.trackMultipleAccesses(memoryIds);

      expect(result).toBeDefined();
      expect(typeof result.tracked).toBe('number');
      expect(typeof result.flushed).toBe('number');
      expect(result.tracked).toBe(5);
    });
  });

  describe('Calculate Popularity Score (T507-04)', () => {
    it('T507-04a: Zero access count returns score 0', () => {
      const zeroScore = mod.calculatePopularityScore(0, null, null);
      expect(zeroScore).toBe(0);
    });

    it('T507-04b: Positive access count returns valid score', () => {
      const recentAccess = Date.now() - (1000 * 60 * 60); // 1 hour ago
      const score = mod.calculatePopularityScore(10, recentAccess, null);
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('T507-04c: Negative and non-finite access counts clamp to 0', () => {
      expect(mod.calculatePopularityScore(-5, null, null)).toBe(0);
      expect(mod.calculatePopularityScore(Number.NaN, null, null)).toBe(0);
      expect(mod.calculatePopularityScore(Number.POSITIVE_INFINITY, null, null)).toBe(0);
    });
  });

  describe('Calculate Usage Boost (T507-05)', () => {
    it('T507-05a: Zero access returns zero boost', () => {
      const zeroBoost = mod.calculateUsageBoost(0, null);
      expect(zeroBoost).toBe(0);
    });

    it('T507-05b: Recent access gets higher boost than old access', () => {
      const recentTime = Date.now() - (1000 * 60 * 30); // 30 minutes ago
      const recentBoost = mod.calculateUsageBoost(5, recentTime);
      const oldBoost = mod.calculateUsageBoost(5, null);
      expect(recentBoost).toBeGreaterThan(oldBoost);
    });

    it('T507-05c: Usage boost capped at 0.2 max', () => {
      const maxBoost = mod.calculateUsageBoost(100, null);
      expect(maxBoost).toBeLessThanOrEqual(0.2);
    });

    it('T507-05d: Negative and non-finite access counts return zero boost', () => {
      expect(mod.calculateUsageBoost(-3, null)).toBe(0);
      expect(mod.calculateUsageBoost(Number.NaN, null)).toBe(0);
      expect(mod.calculateUsageBoost(Number.POSITIVE_INFINITY, null)).toBe(0);
    });
  });

  describe('Get Accumulator State (T507-06)', () => {
    it('T507-06a: Untracked memory has zero accumulator', () => {
      mod.reset();
      mod.init(requireDb());

      const emptyState = mod.getAccumulatorState(999);
      expect(emptyState).toBeDefined();
      expect(emptyState.memoryId).toBe(999);
      expect(emptyState.accumulated).toBe(0);
    });

    it('T507-06b: Tracked memory shows correct accumulation', () => {
      mod.trackAccess(1);
      const tracked = mod.getAccumulatorState(1);
      const expectedAccumulated = mod.INCREMENT_VALUE || 0.1;
      expect(Math.abs(tracked.accumulated - expectedAccumulated)).toBeLessThan(0.001);
    });
  });
});
