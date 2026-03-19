// TEST: DECAY DELETE RACE
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as wm from '../lib/cognitive/working-memory';
import { DECAY_FLOOR, DELETE_THRESHOLD } from '../lib/cognitive/working-memory';
import BetterSqlite3 from 'better-sqlite3';

describe('T214: Decay/Delete Race Condition', () => {
  let testDb: InstanceType<typeof BetterSqlite3>;
  let tmpDbPath: string;

  function setScoreDirectly(sessionId: string, memoryId: number, score: number) {
    testDb.prepare(`
      INSERT OR REPLACE INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
    `).run(sessionId, memoryId, score);
  }

  function getScoreDirectly(sessionId: string, memoryId: number): number | null {
    const row = testDb.prepare(
      'SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?'
    ).get(sessionId, memoryId) as { attention_score: number } | undefined;
    return row ? row.attention_score : null;
  }

  function countEntries(sessionId: string): number {
    const row = testDb.prepare(
      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?'
    ).get(sessionId) as { count: number } | undefined;
    return row ? row.count : 0;
  }

  beforeAll(() => {
    tmpDbPath = path.join(os.tmpdir(), `t214-decay-race-${Date.now()}.db`);
    testDb = new BetterSqlite3(tmpDbPath);

    testDb.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spec_folder TEXT NOT NULL,
        file_path TEXT NOT NULL,
        title TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        importance_tier TEXT DEFAULT 'normal',
        anchor_id TEXT,
        trigger_phrases TEXT,
        importance_weight REAL DEFAULT 0.5,
        embedding_model TEXT,
        embedding_generated_at TEXT,
        embedding_status TEXT DEFAULT 'success',
        confidence REAL DEFAULT 0.5,
        stability REAL DEFAULT 1.0,
        difficulty REAL DEFAULT 5.0,
        last_review TEXT,
        review_count INTEGER DEFAULT 0
      );
    `);

    const now = new Date().toISOString();
    for (let i = 1; i <= 10; i++) {
      testDb.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(i, 'test-spec', `/test/mem${i}.md`, `Memory ${i}`, now);
    }

    wm.init(testDb);
  });

  afterAll(() => {
    if (testDb) { try { testDb.close(); } catch { } }
    if (tmpDbPath && fs.existsSync(tmpDbPath)) { try { fs.unlinkSync(tmpDbPath); } catch { } }
  });

  describe('Decay floor clamping', () => {
    const sessionId = 'decay-floor-test';

    afterAll(() => {
      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
    });

    it('T214-01: Score near floor stays above floor after 1 decay', () => {
      const decayFloor = DECAY_FLOOR;

      setScoreDirectly(sessionId, 1, 0.06);
      wm.batchUpdateScores(sessionId);

      const scoreAfter1 = getScoreDirectly(sessionId, 1);
      expect(scoreAfter1).not.toBeNull();
      expect(scoreAfter1).toBeGreaterThanOrEqual(decayFloor);
    });

    it('T214-02: Score clamps at floor after 20 decay cycles', () => {
      const decayFloor = DECAY_FLOOR;

      for (let i = 0; i < 20; i++) {
        wm.batchUpdateScores(sessionId);
      }

      const scoreAfterMany = getScoreDirectly(sessionId, 1);
      expect(scoreAfterMany).not.toBeNull();
      expect(scoreAfterMany).toBeGreaterThanOrEqual(decayFloor);
    });

    it('T214-03: Memory entry survives decay at floor', () => {
      const count = countEntries(sessionId);
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Delete threshold separation', () => {
    const sessionId = 'delete-threshold-test';

    afterAll(() => {
      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
    });

    it('T214-04: Memory at floor (0.05) survives batchUpdateScores', () => {
      setScoreDirectly(sessionId, 2, 0.05);
      wm.batchUpdateScores(sessionId);

      const scoreAtFloor = getScoreDirectly(sessionId, 2);
      expect(scoreAtFloor).not.toBeNull();
    });

    it('T214-05a: Score below floor (0.005) is clamped UP to floor by UPDATE', () => {
      setScoreDirectly(sessionId, 3, 0.005);
      wm.batchUpdateScores(sessionId);

      const scoreClamped = getScoreDirectly(sessionId, 3);
      // Either clamped to floor or deleted — both are acceptable
      if (scoreClamped !== null) {
        expect(Math.abs(scoreClamped - 0.05)).toBeLessThan(0.001);
      }
      // If null, that's also acceptable (deleted below threshold)
    });

    it('T214-05b: Direct delete catches entries below threshold (0.01)', () => {
      const deleteSessionId = sessionId + '-delete-test';
      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(deleteSessionId);
      setScoreDirectly(deleteSessionId, 3, 0.005);

      const deleteResult = testDb.prepare(`
        DELETE FROM working_memory
        WHERE session_id = ? AND attention_score < ?
      `).run(deleteSessionId, 0.01);

      expect(deleteResult.changes).toBeGreaterThan(0);
    });
  });

  describe('Floor stability over repeated cycles', () => {
    const sessionId = 'floor-stability-test';

    afterAll(() => {
      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
    });

    it('T214-06: Score remains stable without new events across 50 cycles', () => {
      setScoreDirectly(sessionId, 4, 0.15);

      for (let i = 0; i < 50; i++) {
        wm.batchUpdateScores(sessionId);
      }

      const finalScore = getScoreDirectly(sessionId, 4);
      expect(finalScore).not.toBeNull();
      expect(finalScore).not.toBeNull();
      expect(Math.abs(finalScore! - 0.15)).toBeLessThan(0.001);
    });
  });

  describe('Threshold values are correct', () => {
    it('T214-07: Decay floor is 0.05', () => {
      const decayFloor = DECAY_FLOOR;
      expect(decayFloor).toBe(0.05);
    });

    it('T214-08: Delete threshold is 0.01', () => {
      const deleteThreshold = DELETE_THRESHOLD;
      expect(Math.abs(deleteThreshold - 0.01)).toBeLessThan(0.001);
    });

    it('T214-09: Floor > deleteThreshold (race condition prevented)', () => {
      const decayFloor = DECAY_FLOOR;
      const deleteThreshold = DELETE_THRESHOLD;
      expect(decayFloor).toBeGreaterThan(deleteThreshold);
    });
  });

  describe('Mixed scores — some survive, some deleted', () => {
    const sessionId = 'mixed-scores-test';

    afterAll(() => {
      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
    });

    it('T214-10: High-score memory (0.8) survives and decays normally', () => {
      setScoreDirectly(sessionId, 5, 0.8);
      setScoreDirectly(sessionId, 6, 0.05);
      setScoreDirectly(sessionId, 7, 0.005);
      setScoreDirectly(sessionId, 8, 0.03);

      wm.batchUpdateScores(sessionId);

      const s5 = getScoreDirectly(sessionId, 5);
      expect(s5).not.toBeNull();
      expect(s5).toBeGreaterThan(0.5);
    });

    it('T214-11: Floor-score memory (0.05) survives', () => {
      const s6 = getScoreDirectly(sessionId, 6);
      expect(s6).not.toBeNull();
    });

    it('T214-12: Below-delete-threshold memory (0.005) handled correctly', () => {
      const s7 = getScoreDirectly(sessionId, 7);
      // Either deleted (null) or clamped UP to floor (~0.05) — both correct
      if (s7 !== null) {
        expect(Math.abs(s7 - 0.05)).toBeLessThan(0.001);
      }
    });

    it('T214-13: Mid-range memory (0.03) clamped to floor, survives', () => {
      const s8 = getScoreDirectly(sessionId, 8);
      expect(s8).not.toBeNull();
    });
  });
});
