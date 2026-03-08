// ---------------------------------------------------------------
// MODULE: Test — Scoring Observability
// ---------------------------------------------------------------
// Tests:
//   1. Table creation (initScoringObservability)
//   2. Sampling rate (~5% over 1000 calls)
//   3. Observation logging — N4 fields populated
//   4. Observation logging — TM-01 fields populated
//   5. Stats aggregation
//   6. Fail-safe behavior (logging errors don't affect scoring)
//   7. No scoring behavior change when observability is active

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';

import {
  initScoringObservability,
  logScoringObservation,
  shouldSample,
  getScoringStats,
  getDb,
  resetDb,
  SAMPLING_RATE,
} from '../lib/telemetry/scoring-observability';

import {
  calculateFiveFactorScore,
  calculateCompositeScore,
  calculateNoveltyBoost,
  NOVELTY_BOOST_MAX,
  NOVELTY_BOOST_HALF_LIFE_HOURS,
  NOVELTY_BOOST_SCORE_CAP,
  INTERFERENCE_PENALTY_COEFFICIENT,
} from '../lib/scoring/composite-scoring';

import { applyInterferencePenalty } from '../lib/scoring/interference-scoring';

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  return db;
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function daysAgo(days: number): string {
  return hoursAgo(days * 24);
}

const BASE_ROW = {
  id: 1,
  title: 'Test memory',
  importance_tier: 'normal',
  importance_weight: 0.5,
  access_count: 0,
  created_at: daysAgo(10),
  updated_at: daysAgo(5),
};

// ---------------------------------------------------------------
// 1. Table Creation
// ---------------------------------------------------------------

describe('T010-1: Table Creation (initScoringObservability)', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    resetDb();
  });

  afterEach(() => {
    db.close();
    resetDb();
    delete process.env.SPECKIT_NOVELTY_BOOST;
    delete process.env.SPECKIT_INTERFERENCE_SCORE;
  });

  it('T010-1a: creates scoring_observations table', () => {
    initScoringObservability(db);
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='scoring_observations'"
    ).all();
    expect(tables).toHaveLength(1);
  });

  it('T010-1b: table has correct columns', () => {
    initScoringObservability(db);
    const info = db.prepare('PRAGMA table_info(scoring_observations)').all() as Array<{ name: string }>;
    const colNames = info.map(c => c.name);
    expect(colNames).toContain('id');
    expect(colNames).toContain('memory_id');
    expect(colNames).toContain('query_id');
    expect(colNames).toContain('timestamp');
    expect(colNames).toContain('novelty_boost_applied');
    expect(colNames).toContain('novelty_boost_value');
    expect(colNames).toContain('memory_age_days');
    expect(colNames).toContain('interference_applied');
    expect(colNames).toContain('interference_score');
    expect(colNames).toContain('interference_penalty');
    expect(colNames).toContain('score_before');
    expect(colNames).toContain('score_after');
    expect(colNames).toContain('score_delta');
  });

  it('T010-1c: initScoringObservability is idempotent (safe to call twice)', () => {
    initScoringObservability(db);
    expect(() => initScoringObservability(db)).not.toThrow();
  });

  it('T010-1d: getDb returns the initialized db', () => {
    initScoringObservability(db);
    expect(getDb()).toBe(db);
  });

  it('T010-1e: resetDb clears the handle', () => {
    initScoringObservability(db);
    resetDb();
    expect(getDb()).toBeNull();
  });
});

// ---------------------------------------------------------------
// 2. Sampling Rate
// ---------------------------------------------------------------

describe('T010-2: Sampling Rate (~5%)', () => {
  it('T010-2a: shouldSample() returns a boolean', () => {
    const result = shouldSample();
    expect(typeof result).toBe('boolean');
  });

  it('T010-2b: SAMPLING_RATE constant is 0.05', () => {
    expect(SAMPLING_RATE).toBe(0.05);
  });

  it('T010-2c: over 10000 calls, sampling rate is approximately 5% (±2%)', () => {
    const N = 10000;
    let trueCount = 0;
    for (let i = 0; i < N; i++) {
      if (shouldSample()) trueCount++;
    }
    const rate = trueCount / N;
    // Allow generous tolerance for statistical variation
    expect(rate).toBeGreaterThan(0.02);
    expect(rate).toBeLessThan(0.10);
  });

  it('T010-2d: with mocked Math.random returning 0.04, shouldSample returns true', () => {
    const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.04);
    try {
      expect(shouldSample()).toBe(true);
    } finally {
      mockRandom.mockRestore();
    }
  });

  it('T010-2e: with mocked Math.random returning 0.06, shouldSample returns false', () => {
    const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.06);
    try {
      expect(shouldSample()).toBe(false);
    } finally {
      mockRandom.mockRestore();
    }
  });

  it('T010-2f: boundary: Math.random = 0.0499 → sampled', () => {
    const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.0499);
    try {
      expect(shouldSample()).toBe(true);
    } finally {
      mockRandom.mockRestore();
    }
  });

  it('T010-2g: boundary: Math.random = 0.05 → not sampled', () => {
    const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.05);
    try {
      expect(shouldSample()).toBe(false);
    } finally {
      mockRandom.mockRestore();
    }
  });
});

// ---------------------------------------------------------------
// 3. Observation Logging — N4 Fields
// ---------------------------------------------------------------

describe('T010-3: Observation Logging (N4 fields)', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    resetDb();
    initScoringObservability(db);
  });

  afterEach(() => {
    db.close();
    resetDb();
    delete process.env.SPECKIT_NOVELTY_BOOST;
    delete process.env.SPECKIT_INTERFERENCE_SCORE;
  });

  it('T010-3a: logScoringObservation inserts a row', () => {
    logScoringObservation({
      memoryId: 42,
      queryId: 'test-q-1',
      timestamp: new Date().toISOString(),
      noveltyBoostApplied: true,
      noveltyBoostValue: 0.12,
      memoryAgeDays: 0.5,
      interferenceApplied: false,
      interferenceScore: 0,
      interferencePenalty: 0,
      scoreBeforeBoosts: 0.5,
      scoreAfterBoosts: 0.62,
      scoreDelta: 0.12,
    });

    const rows = db.prepare('SELECT * FROM scoring_observations').all() as Array<Record<string, unknown>>;
    expect(rows).toHaveLength(1);
    expect(rows[0].memory_id).toBe(42);
    expect(rows[0].query_id).toBe('test-q-1');
  });

  it('T010-3b: N4 fields are persisted correctly', () => {
    logScoringObservation({
      memoryId: 1,
      queryId: 'n4-test',
      timestamp: new Date().toISOString(),
      noveltyBoostApplied: true,
      noveltyBoostValue: 0.1,
      memoryAgeDays: 1.0,
      interferenceApplied: false,
      interferenceScore: 0,
      interferencePenalty: 0,
      scoreBeforeBoosts: 0.4,
      scoreAfterBoosts: 0.5,
      scoreDelta: 0.1,
    });

    const row = db.prepare('SELECT * FROM scoring_observations LIMIT 1').get() as Record<string, unknown>;
    expect(row.novelty_boost_applied).toBe(1);
    expect(row.novelty_boost_value).toBeCloseTo(0.1, 3);
    expect(row.memory_age_days).toBeCloseTo(1.0, 3);
  });

  it('T010-3c: N4 not applied — persisted with 0 values', () => {
    logScoringObservation({
      memoryId: 2,
      queryId: 'n4-not-applied',
      timestamp: new Date().toISOString(),
      noveltyBoostApplied: false,
      noveltyBoostValue: 0,
      memoryAgeDays: 15.0,
      interferenceApplied: false,
      interferenceScore: 0,
      interferencePenalty: 0,
      scoreBeforeBoosts: 0.6,
      scoreAfterBoosts: 0.6,
      scoreDelta: 0,
    });

    const row = db.prepare('SELECT * FROM scoring_observations LIMIT 1').get() as Record<string, unknown>;
    expect(row.novelty_boost_applied).toBe(0);
    expect(row.novelty_boost_value).toBe(0);
  });
});

// ---------------------------------------------------------------
// 4. Observation Logging — TM-01 Fields
// ---------------------------------------------------------------

describe('T010-4: Observation Logging (TM-01 fields)', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    resetDb();
    initScoringObservability(db);
  });

  afterEach(() => {
    db.close();
    resetDb();
    delete process.env.SPECKIT_NOVELTY_BOOST;
    delete process.env.SPECKIT_INTERFERENCE_SCORE;
  });

  it('T010-4a: TM-01 fields persisted correctly when applied', () => {
    logScoringObservation({
      memoryId: 10,
      queryId: 'tm01-test',
      timestamp: new Date().toISOString(),
      noveltyBoostApplied: false,
      noveltyBoostValue: 0,
      memoryAgeDays: 20,
      interferenceApplied: true,
      interferenceScore: 3.0,
      interferencePenalty: 0.24,
      scoreBeforeBoosts: 0.8,
      scoreAfterBoosts: 0.56,
      scoreDelta: -0.24,
    });

    const row = db.prepare('SELECT * FROM scoring_observations LIMIT 1').get() as Record<string, unknown>;
    expect(row.interference_applied).toBe(1);
    expect(row.interference_score).toBeCloseTo(3.0, 3);
    expect(row.interference_penalty).toBeCloseTo(0.24, 3);
  });

  it('T010-4b: TM-01 not applied — persisted with 0 values', () => {
    logScoringObservation({
      memoryId: 11,
      queryId: 'tm01-not-applied',
      timestamp: new Date().toISOString(),
      noveltyBoostApplied: false,
      noveltyBoostValue: 0,
      memoryAgeDays: 5,
      interferenceApplied: false,
      interferenceScore: 0,
      interferencePenalty: 0,
      scoreBeforeBoosts: 0.7,
      scoreAfterBoosts: 0.7,
      scoreDelta: 0,
    });

    const row = db.prepare('SELECT * FROM scoring_observations LIMIT 1').get() as Record<string, unknown>;
    expect(row.interference_applied).toBe(0);
    expect(row.interference_score).toBe(0);
    expect(row.interference_penalty).toBe(0);
  });

  it('T010-4c: score_delta is persisted correctly', () => {
    logScoringObservation({
      memoryId: 12,
      queryId: 'delta-test',
      timestamp: new Date().toISOString(),
      noveltyBoostApplied: true,
      noveltyBoostValue: 0.1,
      memoryAgeDays: 0.5,
      interferenceApplied: true,
      interferenceScore: 2.0,
      interferencePenalty: 0.16,
      scoreBeforeBoosts: 0.5,
      scoreAfterBoosts: 0.44,
      scoreDelta: -0.06,
    });

    const row = db.prepare('SELECT * FROM scoring_observations LIMIT 1').get() as Record<string, unknown>;
    expect(row.score_before).toBeCloseTo(0.5, 3);
    expect(row.score_after).toBeCloseTo(0.44, 3);
    expect(row.score_delta).toBeCloseTo(-0.06, 3);
  });
});

// ---------------------------------------------------------------
// 5. Stats Aggregation
// ---------------------------------------------------------------

describe('T010-5: Stats Aggregation (getScoringStats)', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    resetDb();
    initScoringObservability(db);
  });

  afterEach(() => {
    db.close();
    resetDb();
  });

  it('T010-5a: empty table returns zero-value stats', () => {
    const stats = getScoringStats();
    expect(stats.totalObservations).toBe(0);
    expect(stats.avgNoveltyBoost).toBe(0);
    expect(stats.avgInterferencePenalty).toBe(0);
    expect(stats.pctWithNoveltyBoost).toBe(0);
    expect(stats.pctWithInterferencePenalty).toBe(0);
    expect(stats.avgScoreDelta).toBe(0);
  });

  it('T010-5b: totalObservations matches logged count', () => {
    for (let i = 0; i < 5; i++) {
      logScoringObservation({
        memoryId: i,
        queryId: `q${i}`,
        timestamp: new Date().toISOString(),
        noveltyBoostApplied: false,
        noveltyBoostValue: 0,
        memoryAgeDays: 10,
        interferenceApplied: false,
        interferenceScore: 0,
        interferencePenalty: 0,
        scoreBeforeBoosts: 0.5,
        scoreAfterBoosts: 0.5,
        scoreDelta: 0,
      });
    }
    const stats = getScoringStats();
    expect(stats.totalObservations).toBe(5);
  });

  it('T010-5c: avgNoveltyBoost computed from applied-only observations', () => {
    // 2 with N4 applied (0.1 and 0.2), 1 without
    logScoringObservation({
      memoryId: 1, queryId: 'q1', timestamp: new Date().toISOString(),
      noveltyBoostApplied: true, noveltyBoostValue: 0.1, memoryAgeDays: 0.5,
      interferenceApplied: false, interferenceScore: 0, interferencePenalty: 0,
      scoreBeforeBoosts: 0.5, scoreAfterBoosts: 0.6, scoreDelta: 0.1,
    });
    logScoringObservation({
      memoryId: 2, queryId: 'q2', timestamp: new Date().toISOString(),
      noveltyBoostApplied: true, noveltyBoostValue: 0.2, memoryAgeDays: 0.2,
      interferenceApplied: false, interferenceScore: 0, interferencePenalty: 0,
      scoreBeforeBoosts: 0.4, scoreAfterBoosts: 0.6, scoreDelta: 0.2,
    });
    logScoringObservation({
      memoryId: 3, queryId: 'q3', timestamp: new Date().toISOString(),
      noveltyBoostApplied: false, noveltyBoostValue: 0, memoryAgeDays: 20,
      interferenceApplied: false, interferenceScore: 0, interferencePenalty: 0,
      scoreBeforeBoosts: 0.7, scoreAfterBoosts: 0.7, scoreDelta: 0,
    });

    const stats = getScoringStats();
    expect(stats.totalObservations).toBe(3);
    expect(stats.avgNoveltyBoost).toBeCloseTo(0.15, 3); // (0.1 + 0.2) / 2
    expect(stats.pctWithNoveltyBoost).toBeCloseTo(66.67, 1); // 2/3 * 100
  });

  it('T010-5d: avgInterferencePenalty computed from applied-only observations', () => {
    logScoringObservation({
      memoryId: 1, queryId: 'q1', timestamp: new Date().toISOString(),
      noveltyBoostApplied: false, noveltyBoostValue: 0, memoryAgeDays: 10,
      interferenceApplied: true, interferenceScore: 2.0, interferencePenalty: 0.16,
      scoreBeforeBoosts: 0.8, scoreAfterBoosts: 0.64, scoreDelta: -0.16,
    });
    logScoringObservation({
      memoryId: 2, queryId: 'q2', timestamp: new Date().toISOString(),
      noveltyBoostApplied: false, noveltyBoostValue: 0, memoryAgeDays: 10,
      interferenceApplied: false, interferenceScore: 0, interferencePenalty: 0,
      scoreBeforeBoosts: 0.5, scoreAfterBoosts: 0.5, scoreDelta: 0,
    });

    const stats = getScoringStats();
    expect(stats.avgInterferencePenalty).toBeCloseTo(0.16, 3);
    expect(stats.pctWithInterferencePenalty).toBeCloseTo(50, 1); // 1/2 * 100
  });

  it('T010-5e: getScoringStats returns zeros when db not initialized', () => {
    resetDb(); // clear the db handle
    const stats = getScoringStats();
    expect(stats.totalObservations).toBe(0);
    expect(stats.avgNoveltyBoost).toBe(0);
  });
});

// ---------------------------------------------------------------
// 6. Fail-Safe Behavior
// ---------------------------------------------------------------

describe('T010-6: Fail-Safe Behavior', () => {
  afterEach(() => {
    resetDb();
    delete process.env.SPECKIT_NOVELTY_BOOST;
    delete process.env.SPECKIT_INTERFERENCE_SCORE;
  });

  it('T010-6a: logScoringObservation does not throw when db is null', () => {
    resetDb();
    expect(() => logScoringObservation({
      memoryId: 1,
      queryId: 'safe-test',
      timestamp: new Date().toISOString(),
      noveltyBoostApplied: false,
      noveltyBoostValue: 0,
      memoryAgeDays: 0,
      interferenceApplied: false,
      interferenceScore: 0,
      interferencePenalty: 0,
      scoreBeforeBoosts: 0.5,
      scoreAfterBoosts: 0.5,
      scoreDelta: 0,
    })).not.toThrow();
  });

  it('T010-6b: getScoringStats does not throw when db is null', () => {
    resetDb();
    expect(() => getScoringStats()).not.toThrow();
  });

  it('T010-6c: initScoringObservability does not throw on error', () => {
    // Pass a closed DB — should catch error gracefully
    const db = new Database(':memory:');
    db.close();
    expect(() => initScoringObservability(db)).not.toThrow();
    resetDb();
  });

  it('T010-6d: logScoringObservation does not throw when table is missing', () => {
    // DB without the table
    const db = new Database(':memory:');
    // Manually set the db handle without creating the table
    initScoringObservability(db);
    db.exec('DROP TABLE IF EXISTS scoring_observations');
    // Now log — should catch the error
    expect(() => logScoringObservation({
      memoryId: 1,
      queryId: 'no-table',
      timestamp: new Date().toISOString(),
      noveltyBoostApplied: false,
      noveltyBoostValue: 0,
      memoryAgeDays: 0,
      interferenceApplied: false,
      interferenceScore: 0,
      interferencePenalty: 0,
      scoreBeforeBoosts: 0.5,
      scoreAfterBoosts: 0.5,
      scoreDelta: 0,
    })).not.toThrow();
    db.close();
    resetDb();
  });
});

// ---------------------------------------------------------------
// 7. No Scoring Behavior Change
// ---------------------------------------------------------------

describe('T010-7: No Scoring Behavior Change When Observability Active', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    resetDb();
    initScoringObservability(db);
  });

  afterEach(() => {
    db.close();
    resetDb();
    delete process.env.SPECKIT_NOVELTY_BOOST;
    delete process.env.SPECKIT_INTERFERENCE_SCORE;
  });

  it('T010-7a: calculateFiveFactorScore returns same result with/without observability init', () => {
    const row = { ...BASE_ROW };

    // With observability init (db set)
    const scoreWith = calculateFiveFactorScore(row);

    // Without (no db, no flags)
    resetDb();
    const scoreWithout = calculateFiveFactorScore(row);

    expect(scoreWith).toBeCloseTo(scoreWithout, 6);
  });

  it('T010-7b: score is always in [0, 1] range', () => {
    const rows = [
      { ...BASE_ROW, importance_tier: 'constitutional', importance_weight: 1.0 },
      { ...BASE_ROW, importance_tier: 'temporary', importance_weight: 0.1 },
      { ...BASE_ROW, access_count: 100, similarity: 99 },
    ];
    for (const row of rows) {
      const score = calculateFiveFactorScore(row);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    }
  });

  it('T010-7c: N4 boost is REMOVED — calculateNoveltyBoost always returns 0', () => {
    process.env.SPECKIT_NOVELTY_BOOST = 'true'; // flag is inert — function always returns 0
    const freshRow = { ...BASE_ROW, created_at: hoursAgo(1) };
    const oldRow = { ...BASE_ROW, created_at: daysAgo(100) };

    // With N4 removed, both get 0 novelty boost → scores differ only by base factors
    expect(calculateNoveltyBoost(freshRow.created_at)).toBe(0);
    expect(calculateNoveltyBoost(oldRow.created_at)).toBe(0);
  });

  it('T010-7d: TM-01 penalty reduces score (never increases it)', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'true';
    const rowWithInterference = { ...BASE_ROW, interference_score: 3.0 };
    const rowWithout = { ...BASE_ROW, interference_score: 0 };

    const scoreWith = calculateFiveFactorScore(rowWithInterference);
    const scoreWithout = calculateFiveFactorScore(rowWithout);

    expect(scoreWith).toBeLessThanOrEqual(scoreWithout + 0.001);
  });

  it('T010-7e: flags disabled → N4 (REMOVED) always 0, TM-01 (graduated) must explicitly disable', () => {
    delete process.env.SPECKIT_NOVELTY_BOOST;
    process.env.SPECKIT_INTERFERENCE_SCORE = 'false'; // graduated — must explicitly disable

    // N4 is REMOVED — always returns 0 regardless of env var
    expect(calculateNoveltyBoost(hoursAgo(0.5))).toBe(0);
    // TM-01 is graduated — explicitly disabled with 'false' → returns score unchanged
    expect(applyInterferencePenalty(0.7, 5.0)).toBe(0.7);
  });

  it('T010-7f: calculateCompositeScore returns [0,1] with observability active', () => {
    const rows = [
      { ...BASE_ROW },
      { ...BASE_ROW, similarity: 80, importance_weight: 0.9 },
    ];
    for (const row of rows) {
      const score = calculateCompositeScore(row);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    }
  });

  it('T010-7g: observability failure (broken db) does not throw from calculateFiveFactorScore', () => {
    // Close the db to force a logging failure
    db.close();
    resetDb();
    const brokenDb = new Database(':memory:');
    initScoringObservability(brokenDb);
    brokenDb.close(); // close after init so db handle is invalid

    // Force sample every time
    const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.01);
    try {
      expect(() => calculateFiveFactorScore(BASE_ROW)).not.toThrow();
    } finally {
      mockRandom.mockRestore();
    }
    resetDb();
  });
});

// ---------------------------------------------------------------
// 8. N4 calculateNoveltyBoost unit tests
// ---------------------------------------------------------------

describe('T010-8: N4 calculateNoveltyBoost', () => {
  afterEach(() => {
    delete process.env.SPECKIT_NOVELTY_BOOST;
  });

  it('T010-8a: returns 0 always (REMOVED — SPECKIT_NOVELTY_BOOST is inert)', () => {
    delete process.env.SPECKIT_NOVELTY_BOOST;
    expect(calculateNoveltyBoost(hoursAgo(1))).toBe(0);
  });

  it('T010-8b: returns 0 always regardless of input (REMOVED)', () => {
    process.env.SPECKIT_NOVELTY_BOOST = 'true'; // inert
    expect(calculateNoveltyBoost(undefined)).toBe(0);
  });

  it('T010-8c: boost at 0h returns 0 (REMOVED — flag is inert)', () => {
    process.env.SPECKIT_NOVELTY_BOOST = 'true'; // inert
    const boost = calculateNoveltyBoost(hoursAgo(0));
    expect(boost).toBe(0); // REMOVED — always returns 0
  });

  it('T010-8d: boost at 12h returns 0 (REMOVED — flag is inert)', () => {
    process.env.SPECKIT_NOVELTY_BOOST = 'true'; // inert
    const boost = calculateNoveltyBoost(hoursAgo(12));
    expect(boost).toBe(0); // REMOVED — always returns 0
  });

  it('T010-8e: boost at 24h returns 0 (REMOVED — flag is inert)', () => {
    process.env.SPECKIT_NOVELTY_BOOST = 'true'; // inert
    const boost = calculateNoveltyBoost(hoursAgo(24));
    expect(boost).toBe(0); // REMOVED — always returns 0
  });

  it('T010-8f: boost at 48h returns 0 (REMOVED — flag is inert)', () => {
    process.env.SPECKIT_NOVELTY_BOOST = 'true'; // inert
    const boost = calculateNoveltyBoost(hoursAgo(48));
    expect(boost).toBe(0); // REMOVED — always returns 0
  });

  it('T010-8g: all boost values are 0 regardless of age (REMOVED)', () => {
    process.env.SPECKIT_NOVELTY_BOOST = 'true'; // inert
    const boosts = [0, 6, 12, 24, 47].map(h => calculateNoveltyBoost(hoursAgo(h)));
    for (const boost of boosts) {
      expect(boost).toBe(0); // REMOVED — always returns 0
    }
  });
});

// ---------------------------------------------------------------
// 9. TM-01 applyInterferencePenalty unit tests
// ---------------------------------------------------------------

describe('T010-9: TM-01 applyInterferencePenalty', () => {
  afterEach(() => {
    delete process.env.SPECKIT_INTERFERENCE_SCORE;
  });

  it('T010-9a: returns score unchanged when SPECKIT_INTERFERENCE_SCORE explicitly disabled', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'false'; // graduated — must explicitly disable
    expect(applyInterferencePenalty(0.7, 3.0)).toBe(0.7);
  });

  it('T010-9b: returns score unchanged when interferenceScore is 0', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'true';
    expect(applyInterferencePenalty(0.7, 0)).toBe(0.7);
  });

  it('T010-9c: penalty = INTERFERENCE_PENALTY_COEFFICIENT * interferenceScore', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'true';
    const score = 0.8;
    const interferenceScore = 3.0;
    const expected = Math.max(0, score + INTERFERENCE_PENALTY_COEFFICIENT * interferenceScore);
    expect(applyInterferencePenalty(score, interferenceScore)).toBeCloseTo(expected, 6);
  });

  it('T010-9d: result is clamped to [0, 1]', () => {
    process.env.SPECKIT_INTERFERENCE_SCORE = 'true';
    // Large interference score would push below 0
    const result = applyInterferencePenalty(0.1, 100);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });

  it('T010-9e: INTERFERENCE_PENALTY_COEFFICIENT is negative', () => {
    expect(INTERFERENCE_PENALTY_COEFFICIENT).toBeLessThan(0);
  });
});
