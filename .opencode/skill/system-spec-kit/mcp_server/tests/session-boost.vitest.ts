// TEST: SESSION BOOST (T010-T015)
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import * as sessionBoost from '../lib/search/session-boost';

function createDb() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE working_memory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      memory_id INTEGER NOT NULL,
      attention_score REAL NOT NULL,
      event_counter INTEGER NOT NULL DEFAULT 0,
      mention_count INTEGER NOT NULL DEFAULT 0,
      last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(session_id, memory_id)
    );
  `);
  sessionBoost.init(db);
  return db;
}

describe('T010-T015: session-attention boost', () => {
  let db: Database.Database | null = null;
  const previousSessionBoostFlag = process.env.SPECKIT_SESSION_BOOST;

  beforeEach(() => {
    process.env.SPECKIT_SESSION_BOOST = 'true';
  });

  afterEach(() => {
    if (db) {
      db.close();
      db = null;
    }

    if (previousSessionBoostFlag === undefined) {
      delete process.env.SPECKIT_SESSION_BOOST;
    } else {
      process.env.SPECKIT_SESSION_BOOST = previousSessionBoostFlag;
    }
  });

  it('T010/T011: getAttentionBoost reads working_memory rows by session and IDs', () => {
    db = createDb();

    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score)
      VALUES ('session-A', 101, 1.0), ('session-A', 102, 0.4), ('session-B', 101, 0.9)
    `).run();

    const boosts = sessionBoost.getAttentionBoost('session-A', [101, 102, 999]);

    expect(boosts.size).toBe(2);
    expect(boosts.get(101)).toBeCloseTo(0.15, 9);
    expect(boosts.get(102)).toBeCloseTo(0.06, 9);
    expect(boosts.has(999)).toBe(false);
  });

  it('T012/T014: bounded boost caps at max combined 0.20', () => {
    expect(sessionBoost.capCombinedBoost(0)).toBe(0);
    expect(sessionBoost.capCombinedBoost(0.10)).toBe(0.10);
    expect(sessionBoost.capCombinedBoost(0.20)).toBe(0.20);
    expect(sessionBoost.capCombinedBoost(0.30)).toBe(0.20);
    expect(sessionBoost.capCombinedBoost(0.15, 0.05)).toBe(0.15);
    expect(sessionBoost.capCombinedBoost(0.15, 0.10)).toBe(0.10);
  });

  it('T015: RRF + session boost pipeline keeps score order stable with equal boosts', () => {
    db = createDb();

    db.prepare(`
      INSERT INTO working_memory (session_id, memory_id, attention_score)
      VALUES ('session-C', 1, 1.0), ('session-C', 2, 1.0), ('session-C', 3, 1.0)
    `).run();

    const fusedResults = [
      { id: 1, rrfScore: 0.90 },
      { id: 2, rrfScore: 0.70 },
      { id: 3, rrfScore: 0.50 },
    ];

    const { results, metadata } = sessionBoost.applySessionBoost(fusedResults, 'session-C');

    expect(results.map(row => row.id)).toEqual([1, 2, 3]);
    expect(results[0].score).toBeCloseTo(1.0, 9);
    expect(results[0].rrfScore).toBeCloseTo(1.0, 9);
    expect(results[1].score).toBeCloseTo(0.70 * 1.15, 9);
    expect(results[2].score).toBeCloseTo(0.50 * 1.15, 9);

    expect(metadata.applied).toBe(true);
    expect(metadata.boostedCount).toBe(3);
    expect(metadata.maxBoostApplied).toBeCloseTo(0.15, 9);
  });
});
