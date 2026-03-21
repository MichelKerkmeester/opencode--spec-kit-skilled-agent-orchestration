// TEST: Batch Feedback Learning (REQ-D4-004)
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import Database from 'better-sqlite3';
import {
  initBatchLearning,
  aggregateEvents,
  applyMinSupportFilter,
  enforceBoostCap,
  computeShadowRankDelta,
  shadowApply,
  runBatchLearning,
  getBatchLearningHistory,
  getBatchLearningCount,
  isBatchLearnedFeedbackEnabled,
  MIN_SUPPORT_SESSIONS,
  MAX_BOOST_DELTA,
  BATCH_WINDOW_MS,
  CONFIDENCE_WEIGHTS,
  BATCH_LEARNING_LOG_SCHEMA_SQL,
  BATCH_LEARNING_LOG_INDICES_SQL,
} from '../lib/feedback/batch-learning';
import type { AggregatedSignal } from '../lib/feedback/batch-learning';
import {
  initFeedbackLedger,
  logFeedbackEvent,
} from '../lib/feedback/feedback-ledger';
import type { FeedbackEvent } from '../lib/feedback/feedback-ledger';

/* ───────────────────────────────────────────────────────────────
   HELPERS
----------------------------------------------------------------*/

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  initBatchLearning(db);
  return db;
}

function createTestDbWithMemoryIndex(): Database.Database {
  const db = new Database(':memory:');
  initBatchLearning(db);
  // Minimal memory_index table for shadow delta tests
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL DEFAULT '',
      file_path TEXT NOT NULL DEFAULT '',
      title TEXT,
      content_text TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  return db;
}

const BASE_TS = 1_700_000_000_000; // arbitrary fixed epoch-ms

function makeEvent(overrides: Partial<FeedbackEvent> = {}): FeedbackEvent {
  return {
    type: 'result_cited',
    memoryId: 'mem-1',
    queryId: 'q-001',
    confidence: 'strong',
    timestamp: BASE_TS,
    sessionId: 'sess-A',
    ...overrides,
  };
}

/**
 * Insert feedback events directly using a separate in-process env stub.
 * Restores only SPECKIT_IMPLICIT_FEEDBACK_LOG after seeding so that any
 * SPECKIT_BATCH_LEARNED_FEEDBACK stub set by the caller is preserved.
 */
function seedEvents(
  db: Database.Database,
  events: FeedbackEvent[]
): void {
  const prev = process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG;
  process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG = 'true';
  for (const ev of events) {
    logFeedbackEvent(db, ev);
  }
  if (prev === undefined) {
    delete process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG;
  } else {
    process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG = prev;
  }
}

/* ───────────────────────────────────────────────────────────────
   CONSTANTS
----------------------------------------------------------------*/

describe('Batch Learning — Constants', () => {
  it('MIN_SUPPORT_SESSIONS is 3', () => {
    expect(MIN_SUPPORT_SESSIONS).toBe(3);
  });

  it('MAX_BOOST_DELTA is 0.10', () => {
    expect(MAX_BOOST_DELTA).toBeCloseTo(0.10);
  });

  it('BATCH_WINDOW_MS is 7 days', () => {
    expect(BATCH_WINDOW_MS).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it('CONFIDENCE_WEIGHTS has correct values', () => {
    expect(CONFIDENCE_WEIGHTS.strong).toBe(1.0);
    expect(CONFIDENCE_WEIGHTS.medium).toBe(0.5);
    expect(CONFIDENCE_WEIGHTS.weak).toBe(0.1);
  });

  it('BATCH_LEARNING_LOG_SCHEMA_SQL references correct table and columns', () => {
    expect(BATCH_LEARNING_LOG_SCHEMA_SQL).toContain('batch_learning_log');
    expect(BATCH_LEARNING_LOG_SCHEMA_SQL).toContain('memory_id');
    expect(BATCH_LEARNING_LOG_SCHEMA_SQL).toContain('batch_run_at');
    expect(BATCH_LEARNING_LOG_SCHEMA_SQL).toContain('weighted_score');
    expect(BATCH_LEARNING_LOG_SCHEMA_SQL).toContain('computed_boost');
    expect(BATCH_LEARNING_LOG_SCHEMA_SQL).toContain('promoted');
  });

  it('BATCH_LEARNING_LOG_INDICES_SQL creates expected indices', () => {
    expect(BATCH_LEARNING_LOG_INDICES_SQL).toContain('idx_batch_log_memory_id');
    expect(BATCH_LEARNING_LOG_INDICES_SQL).toContain('idx_batch_log_run_at');
  });
});

/* ───────────────────────────────────────────────────────────────
   FEATURE FLAG
----------------------------------------------------------------*/

describe('Batch Learning — Feature Flag', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('isBatchLearnedFeedbackEnabled returns true by default (graduated)', () => {
    vi.stubEnv('SPECKIT_BATCH_LEARNED_FEEDBACK', '');
    expect(isBatchLearnedFeedbackEnabled()).toBe(true);
  });

  it('isBatchLearnedFeedbackEnabled returns true for "true"', () => {
    vi.stubEnv('SPECKIT_BATCH_LEARNED_FEEDBACK', 'true');
    expect(isBatchLearnedFeedbackEnabled()).toBe(true);
  });

  it('isBatchLearnedFeedbackEnabled returns true for "1"', () => {
    vi.stubEnv('SPECKIT_BATCH_LEARNED_FEEDBACK', '1');
    expect(isBatchLearnedFeedbackEnabled()).toBe(true);
  });

  it('isBatchLearnedFeedbackEnabled returns false for "false"', () => {
    vi.stubEnv('SPECKIT_BATCH_LEARNED_FEEDBACK', 'false');
    expect(isBatchLearnedFeedbackEnabled()).toBe(false);
  });
});

/* ───────────────────────────────────────────────────────────────
   SCHEMA INITIALIZATION
----------------------------------------------------------------*/

describe('Batch Learning — Schema Initialization', () => {
  it('creates batch_learning_log table', () => {
    const db = createTestDb();
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='batch_learning_log'"
    ).all() as Array<{ name: string }>;
    expect(tables).toHaveLength(1);
  });

  it('creates required indices', () => {
    const db = createTestDb();
    const indices = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='batch_learning_log'"
    ).all() as Array<{ name: string }>;
    const names = indices.map(i => i.name);
    expect(names).toContain('idx_batch_log_memory_id');
    expect(names).toContain('idx_batch_log_run_at');
  });

  it('initBatchLearning is idempotent', () => {
    const db = createTestDb();
    expect(() => initBatchLearning(db)).not.toThrow();
    expect(() => initBatchLearning(db)).not.toThrow();
  });

  it('initBatchLearning also initializes feedback_events', () => {
    const db = new Database(':memory:');
    initBatchLearning(db);
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='feedback_events'"
    ).all() as Array<{ name: string }>;
    expect(tables).toHaveLength(1);
  });
});

/* ───────────────────────────────────────────────────────────────
   AGGREGATION
----------------------------------------------------------------*/

describe('Batch Learning — aggregateEvents', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns empty array when no events in window', () => {
    const db = createTestDb();
    const result = aggregateEvents(db, BASE_TS, BASE_TS + 1000);
    expect(result).toHaveLength(0);
  });

  it('aggregates events by memoryId', () => {
    const db = createTestDb();
    seedEvents(db, [
      makeEvent({ memoryId: 'mem-A', sessionId: 'sess-1' }),
      makeEvent({ memoryId: 'mem-A', sessionId: 'sess-2' }),
      makeEvent({ memoryId: 'mem-B', sessionId: 'sess-3' }),
    ]);
    const signals = aggregateEvents(db, BASE_TS - 1, BASE_TS + 1);
    expect(signals).toHaveLength(2);
    const memA = signals.find(s => s.memoryId === 'mem-A');
    expect(memA).toBeDefined();
    expect(memA!.strongCount).toBe(2);
    expect(memA!.sessionCount).toBe(2);
  });

  it('counts confidence tiers separately', () => {
    const db = createTestDb();
    seedEvents(db, [
      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
      makeEvent({ confidence: 'medium', sessionId: 'sess-2' }),
      makeEvent({ confidence: 'weak',   sessionId: 'sess-3' }),
    ]);
    const signals = aggregateEvents(db, BASE_TS - 1, BASE_TS + 1);
    expect(signals).toHaveLength(1);
    const s = signals[0]!;
    expect(s.strongCount).toBe(1);
    expect(s.mediumCount).toBe(1);
    expect(s.weakCount).toBe(1);
  });

  it('computes weighted score correctly', () => {
    const db = createTestDb();
    // 2 strong (1.0 each) + 1 medium (0.5) = 2.5
    seedEvents(db, [
      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
      makeEvent({ confidence: 'strong', sessionId: 'sess-2' }),
      makeEvent({ confidence: 'medium', sessionId: 'sess-3' }),
    ]);
    const signals = aggregateEvents(db, BASE_TS - 1, BASE_TS + 1);
    expect(signals[0]!.weightedScore).toBeCloseTo(2.5);
  });

  it('computedBoost is capped at MAX_BOOST_DELTA', () => {
    const db = createTestDb();
    // Even with many strong events, boost must not exceed MAX_BOOST_DELTA
    const events = Array.from({ length: 50 }, (_, i) =>
      makeEvent({ confidence: 'strong', sessionId: `sess-${i}`, memoryId: 'mem-X' })
    );
    seedEvents(db, events);
    const signals = aggregateEvents(db, BASE_TS - 1, BASE_TS + 1);
    expect(signals[0]!.computedBoost).toBeLessThanOrEqual(MAX_BOOST_DELTA + 1e-9);
  });

  it('respects timestamp window boundaries', () => {
    const db = createTestDb();
    seedEvents(db, [
      makeEvent({ timestamp: 1000, sessionId: 'sess-in' }),
      makeEvent({ timestamp: 5000, sessionId: 'sess-out' }),
    ]);
    const signals = aggregateEvents(db, 500, 2000);
    expect(signals).toHaveLength(1);
  });

  it('treats distinct sessionIds as distinct sessions', () => {
    const db = createTestDb();
    seedEvents(db, [
      makeEvent({ sessionId: 'sess-1' }),
      makeEvent({ sessionId: 'sess-1' }), // same session, not counted twice
      makeEvent({ sessionId: 'sess-2' }),
    ]);
    const signals = aggregateEvents(db, BASE_TS - 1, BASE_TS + 1);
    expect(signals[0]!.sessionCount).toBe(2);
  });

  it('returns signals sorted by weightedScore DESC', () => {
    const db = createTestDb();
    seedEvents(db, [
      makeEvent({ memoryId: 'mem-low',  confidence: 'weak',   sessionId: 's1' }),
      makeEvent({ memoryId: 'mem-high', confidence: 'strong', sessionId: 's2' }),
    ]);
    const signals = aggregateEvents(db, BASE_TS - 1, BASE_TS + 1);
    expect(signals[0]!.memoryId).toBe('mem-high');
    expect(signals[1]!.memoryId).toBe('mem-low');
  });
});

/* ───────────────────────────────────────────────────────────────
   MIN-SUPPORT FILTER
----------------------------------------------------------------*/

describe('Batch Learning — applyMinSupportFilter', () => {
  it('passes signals meeting min-support threshold', () => {
    const signal: AggregatedSignal = {
      memoryId: 'mem-1', sessionCount: 3, strongCount: 3,
      mediumCount: 0, weakCount: 0, weightedScore: 3.0, computedBoost: 0.05,
    };
    const { eligible, skipped } = applyMinSupportFilter([signal], 3);
    expect(eligible).toHaveLength(1);
    expect(skipped).toHaveLength(0);
  });

  it('skips signals below min-support threshold', () => {
    const signal: AggregatedSignal = {
      memoryId: 'mem-1', sessionCount: 2, strongCount: 2,
      mediumCount: 0, weakCount: 0, weightedScore: 2.0, computedBoost: 0.05,
    };
    const { eligible, skipped } = applyMinSupportFilter([signal], 3);
    expect(eligible).toHaveLength(0);
    expect(skipped).toHaveLength(1);
  });

  it('uses MIN_SUPPORT_SESSIONS as default', () => {
    const borderline: AggregatedSignal = {
      memoryId: 'mem-border', sessionCount: MIN_SUPPORT_SESSIONS, strongCount: 1,
      mediumCount: 0, weakCount: 0, weightedScore: 1.0, computedBoost: 0.01,
    };
    const below: AggregatedSignal = {
      memoryId: 'mem-below', sessionCount: MIN_SUPPORT_SESSIONS - 1, strongCount: 1,
      mediumCount: 0, weakCount: 0, weightedScore: 1.0, computedBoost: 0.01,
    };
    const { eligible, skipped } = applyMinSupportFilter([borderline, below]);
    expect(eligible).toHaveLength(1);
    expect(skipped).toHaveLength(1);
    expect(eligible[0]!.memoryId).toBe('mem-border');
  });

  it('returns empty eligible when no signals', () => {
    const { eligible, skipped } = applyMinSupportFilter([]);
    expect(eligible).toHaveLength(0);
    expect(skipped).toHaveLength(0);
  });

  it('correctly partitions mixed input', () => {
    const signals: AggregatedSignal[] = [
      { memoryId: 'a', sessionCount: 5, strongCount: 1, mediumCount: 0, weakCount: 0, weightedScore: 1.0, computedBoost: 0.01 },
      { memoryId: 'b', sessionCount: 1, strongCount: 1, mediumCount: 0, weakCount: 0, weightedScore: 1.0, computedBoost: 0.01 },
      { memoryId: 'c', sessionCount: 3, strongCount: 1, mediumCount: 0, weakCount: 0, weightedScore: 1.0, computedBoost: 0.01 },
    ];
    const { eligible, skipped } = applyMinSupportFilter(signals, 3);
    expect(eligible.map(s => s.memoryId).sort()).toEqual(['a', 'c']);
    expect(skipped.map(s => s.memoryId)).toEqual(['b']);
  });
});

/* ───────────────────────────────────────────────────────────────
   BOOST CAP ENFORCEMENT
----------------------------------------------------------------*/

describe('Batch Learning — enforceBoostCap', () => {
  it('returns value as-is when within cap', () => {
    expect(enforceBoostCap(0.05)).toBeCloseTo(0.05);
  });

  it('clamps value above MAX_BOOST_DELTA to MAX_BOOST_DELTA', () => {
    expect(enforceBoostCap(0.50)).toBeCloseTo(MAX_BOOST_DELTA);
    expect(enforceBoostCap(1.0)).toBeCloseTo(MAX_BOOST_DELTA);
  });

  it('clamps negative values to 0', () => {
    expect(enforceBoostCap(-0.1)).toBe(0);
  });

  it('respects custom maxBoostDelta', () => {
    expect(enforceBoostCap(0.30, 0.20)).toBeCloseTo(0.20);
    expect(enforceBoostCap(0.10, 0.20)).toBeCloseTo(0.10);
  });

  it('exact cap boundary is inclusive', () => {
    expect(enforceBoostCap(MAX_BOOST_DELTA)).toBeCloseTo(MAX_BOOST_DELTA);
  });
});

/* ───────────────────────────────────────────────────────────────
   SHADOW RANK DELTA
----------------------------------------------------------------*/

describe('Batch Learning — computeShadowRankDelta', () => {
  it('returns null when memory not found', () => {
    const db = createTestDbWithMemoryIndex();
    const delta = computeShadowRankDelta(db, '99999', 0.05);
    expect(delta).toBeNull();
  });

  it('computes correct delta for known memory', () => {
    const db = createTestDbWithMemoryIndex();
    db.prepare(
      "INSERT INTO memory_index (id, spec_folder, file_path, importance_weight) VALUES (1, 'test', '/f.md', 0.6)"
    ).run();
    const delta = computeShadowRankDelta(db, '1', 0.05);
    // would-be = min(1.0, 0.6 + 0.05) - 0.6 = 0.05
    expect(delta).toBeCloseTo(0.05);
  });

  it('delta is capped so weight does not exceed 1.0', () => {
    const db = createTestDbWithMemoryIndex();
    db.prepare(
      "INSERT INTO memory_index (id, spec_folder, file_path, importance_weight) VALUES (2, 'test', '/f.md', 0.98)"
    ).run();
    const delta = computeShadowRankDelta(db, '2', 0.05);
    // would-be = min(1.0, 0.98 + 0.05) = 1.0 → delta = 1.0 - 0.98 = 0.02
    expect(delta).toBeCloseTo(0.02);
  });

  it('returns 0 when weight is already at 1.0', () => {
    const db = createTestDbWithMemoryIndex();
    db.prepare(
      "INSERT INTO memory_index (id, spec_folder, file_path, importance_weight) VALUES (3, 'test', '/f.md', 1.0)"
    ).run();
    const delta = computeShadowRankDelta(db, '3', 0.05);
    expect(delta).toBeCloseTo(0.0);
  });
});

/* ───────────────────────────────────────────────────────────────
   SHADOW APPLY
----------------------------------------------------------------*/

describe('Batch Learning — shadowApply', () => {
  it('inserts a row into batch_learning_log and returns row ID', () => {
    // createTestDbWithMemoryIndex so computeShadowRankDelta does not error
    const db = createTestDbWithMemoryIndex();
    const signal: AggregatedSignal = {
      memoryId: 'mem-1', sessionCount: 4, strongCount: 3,
      mediumCount: 1, weakCount: 0, weightedScore: 3.5, computedBoost: 0.08,
    };
    const id = shadowApply(db, signal, BASE_TS);
    expect(id).toBeGreaterThan(0);
    expect(getBatchLearningCount(db, 'mem-1')).toBe(1);
  });

  it('records the correct field values', () => {
    const db = createTestDbWithMemoryIndex();
    const signal: AggregatedSignal = {
      memoryId: 'mem-check', sessionCount: 5, strongCount: 2,
      mediumCount: 2, weakCount: 1, weightedScore: 3.1, computedBoost: 0.09,
    };
    shadowApply(db, signal, BASE_TS);
    const rows = getBatchLearningHistory(db, 'mem-check');
    expect(rows).toHaveLength(1);
    const row = rows[0]!;
    expect(row.memory_id).toBe('mem-check');
    expect(row.batch_run_at).toBe(BASE_TS);
    expect(row.session_count).toBe(5);
    expect(row.weighted_score).toBeCloseTo(3.1);
    expect(row.promoted).toBe(1);
  });

  it('caps boost before writing', () => {
    const db = createTestDbWithMemoryIndex();
    const signal: AggregatedSignal = {
      memoryId: 'mem-cap', sessionCount: 10, strongCount: 10,
      mediumCount: 0, weakCount: 0, weightedScore: 10.0, computedBoost: 0.99, // above cap
    };
    shadowApply(db, signal, BASE_TS);
    const rows = getBatchLearningHistory(db, 'mem-cap');
    expect(rows[0]!.computed_boost).toBeCloseTo(MAX_BOOST_DELTA);
  });

  it('does NOT modify memory_index importance_weight (shadow-only)', () => {
    const db = createTestDbWithMemoryIndex();
    db.prepare(
      "INSERT INTO memory_index (id, spec_folder, file_path, importance_weight) VALUES (10, 'test', '/f.md', 0.5)"
    ).run();
    const signal: AggregatedSignal = {
      memoryId: '10', sessionCount: 4, strongCount: 4,
      mediumCount: 0, weakCount: 0, weightedScore: 4.0, computedBoost: 0.10,
    };
    shadowApply(db, signal, BASE_TS);
    const row = db.prepare('SELECT importance_weight FROM memory_index WHERE id = 10').get() as { importance_weight: number };
    // importance_weight must remain unchanged
    expect(row.importance_weight).toBeCloseTo(0.5);
  });
});

/* ───────────────────────────────────────────────────────────────
   INTEGRATION: runBatchLearning end-to-end
----------------------------------------------------------------*/

describe('Batch Learning — runBatchLearning (integration)', () => {
  // Use direct process.env management to avoid vi.unstubAllEnvs() interactions
  // across seedEvents (which temporarily sets SPECKIT_IMPLICIT_FEEDBACK_LOG).
  let prevBatchFlag: string | undefined;
  let prevFeedbackFlag: string | undefined;

  beforeEach(() => {
    prevBatchFlag   = process.env.SPECKIT_BATCH_LEARNED_FEEDBACK;
    prevFeedbackFlag = process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG;
  });

  afterEach(() => {
    if (prevBatchFlag === undefined) {
      delete process.env.SPECKIT_BATCH_LEARNED_FEEDBACK;
    } else {
      process.env.SPECKIT_BATCH_LEARNED_FEEDBACK = prevBatchFlag;
    }
    if (prevFeedbackFlag === undefined) {
      delete process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG;
    } else {
      process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG = prevFeedbackFlag;
    }
  });

  it('returns zero-count result when feature flag is OFF', () => {
    process.env.SPECKIT_BATCH_LEARNED_FEEDBACK = 'false';
    const db = createTestDb();
    const result = runBatchLearning(db, { runAt: BASE_TS });
    expect(result.shadowApplied).toBe(0);
    expect(result.candidatesEvaluated).toBe(0);
    expect(result.candidates).toHaveLength(0);
  });

  it('processes events and shadow-applies when flag is ON and min-support met', () => {
    process.env.SPECKIT_BATCH_LEARNED_FEEDBACK = 'true';
    const db = createTestDb();

    // Seed 3 events from 3 distinct sessions for mem-1 (meets min-support of 3)
    seedEvents(db, [
      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-A', timestamp: BASE_TS }),
      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-B', timestamp: BASE_TS }),
      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-C', timestamp: BASE_TS }),
    ]);

    const result = runBatchLearning(db, {
      runAt: BASE_TS + 1,
      windowMs: BATCH_WINDOW_MS,
    });

    expect(result.candidatesEvaluated).toBeGreaterThanOrEqual(1);
    expect(result.shadowApplied).toBeGreaterThanOrEqual(1);
    expect(result.totalEventsProcessed).toBeGreaterThanOrEqual(3);
    expect(getBatchLearningCount(db, 'mem-1')).toBe(1);
  });

  it('skips memories with insufficient session support', () => {
    process.env.SPECKIT_BATCH_LEARNED_FEEDBACK = 'true';
    const db = createTestDb();

    // Only 2 distinct sessions — below MIN_SUPPORT_SESSIONS (3)
    seedEvents(db, [
      makeEvent({ memoryId: 'mem-weak', sessionId: 'sess-1', timestamp: BASE_TS }),
      makeEvent({ memoryId: 'mem-weak', sessionId: 'sess-2', timestamp: BASE_TS }),
    ]);

    const result = runBatchLearning(db, {
      runAt: BASE_TS + 1,
      windowMs: BATCH_WINDOW_MS,
    });

    expect(result.skippedMinSupport).toBe(1);
    expect(result.shadowApplied).toBe(0);
    expect(getBatchLearningCount(db, 'mem-weak')).toBe(0);
  });

  it('correctly partitions eligible and skipped memories', () => {
    process.env.SPECKIT_BATCH_LEARNED_FEEDBACK = 'true';
    const db = createTestDb();

    // mem-ok: 3 sessions (meets min-support)
    seedEvents(db, [
      makeEvent({ memoryId: 'mem-ok', sessionId: 's1', timestamp: BASE_TS }),
      makeEvent({ memoryId: 'mem-ok', sessionId: 's2', timestamp: BASE_TS }),
      makeEvent({ memoryId: 'mem-ok', sessionId: 's3', timestamp: BASE_TS }),
      // mem-skip: only 1 session
      makeEvent({ memoryId: 'mem-skip', sessionId: 's4', timestamp: BASE_TS }),
    ]);

    const result = runBatchLearning(db, { runAt: BASE_TS + 1 });

    expect(result.candidatesEvaluated).toBe(1);
    expect(result.skippedMinSupport).toBe(1);
  });

  it('respects the windowMs option', () => {
    process.env.SPECKIT_BATCH_LEARNED_FEEDBACK = 'true';
    const db = createTestDb();

    // Events outside the short window
    seedEvents(db, [
      makeEvent({ sessionId: 'sess-1', timestamp: BASE_TS - 10_000 }),
      makeEvent({ sessionId: 'sess-2', timestamp: BASE_TS - 10_000 }),
      makeEvent({ sessionId: 'sess-3', timestamp: BASE_TS - 10_000 }),
    ]);

    // Run with a tiny 1-second window — those events are outside it
    const result = runBatchLearning(db, {
      runAt: BASE_TS,
      windowMs: 1_000,
    });

    expect(result.totalEventsProcessed).toBe(0);
    expect(result.shadowApplied).toBe(0);
  });

  it('includes candidates array in result', () => {
    process.env.SPECKIT_BATCH_LEARNED_FEEDBACK = 'true';
    const db = createTestDb();

    seedEvents(db, [
      makeEvent({ sessionId: 'sX', timestamp: BASE_TS }),
      makeEvent({ sessionId: 'sY', timestamp: BASE_TS }),
      makeEvent({ sessionId: 'sZ', timestamp: BASE_TS }),
    ]);

    const result = runBatchLearning(db, { runAt: BASE_TS + 1 });

    expect(Array.isArray(result.candidates)).toBe(true);
    expect(result.candidates.length).toBeGreaterThanOrEqual(1);
    expect(result.candidates[0]).toHaveProperty('memoryId');
    expect(result.candidates[0]).toHaveProperty('weightedScore');
    expect(result.candidates[0]).toHaveProperty('computedBoost');
  });

  it('multiple batch runs produce separate log entries per run', () => {
    process.env.SPECKIT_BATCH_LEARNED_FEEDBACK = 'true';
    const db = createTestDb();

    seedEvents(db, [
      makeEvent({ sessionId: 's1', timestamp: BASE_TS }),
      makeEvent({ sessionId: 's2', timestamp: BASE_TS }),
      makeEvent({ sessionId: 's3', timestamp: BASE_TS }),
    ]);

    runBatchLearning(db, { runAt: BASE_TS + 1 });
    runBatchLearning(db, { runAt: BASE_TS + 2 });

    const count = getBatchLearningCount(db, 'mem-1');
    expect(count).toBe(2);
  });
});

/* ───────────────────────────────────────────────────────────────
   QUERY HELPERS
----------------------------------------------------------------*/

describe('Batch Learning — Query Helpers', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('getBatchLearningHistory returns rows ordered by batch_run_at DESC', () => {
    const db = createTestDbWithMemoryIndex();
    const signal: AggregatedSignal = {
      memoryId: 'mem-1', sessionCount: 3, strongCount: 3,
      mediumCount: 0, weakCount: 0, weightedScore: 3.0, computedBoost: 0.05,
    };
    shadowApply(db, signal, BASE_TS + 1000);
    shadowApply(db, signal, BASE_TS + 2000);
    shadowApply(db, signal, BASE_TS + 500);

    const rows = getBatchLearningHistory(db, 'mem-1');
    expect(rows).toHaveLength(3);
    expect(rows[0]!.batch_run_at).toBeGreaterThanOrEqual(rows[1]!.batch_run_at);
    expect(rows[1]!.batch_run_at).toBeGreaterThanOrEqual(rows[2]!.batch_run_at);
  });

  it('getBatchLearningHistory returns empty array for unknown memory', () => {
    const db = createTestDb();
    expect(getBatchLearningHistory(db, 'unknown')).toHaveLength(0);
  });

  it('getBatchLearningCount returns 0 for empty table', () => {
    const db = createTestDb();
    expect(getBatchLearningCount(db)).toBe(0);
    expect(getBatchLearningCount(db, 'any')).toBe(0);
  });

  it('getBatchLearningCount counts total when no memoryId', () => {
    const db = createTestDbWithMemoryIndex();
    const signal: AggregatedSignal = {
      memoryId: 'x', sessionCount: 3, strongCount: 3,
      mediumCount: 0, weakCount: 0, weightedScore: 3.0, computedBoost: 0.05,
    };
    shadowApply(db, signal, BASE_TS);
    shadowApply(db, { ...signal, memoryId: 'y' }, BASE_TS);
    expect(getBatchLearningCount(db)).toBe(2);
  });
});

/* ───────────────────────────────────────────────────────────────
   SHADOW-ONLY GUARANTEE
----------------------------------------------------------------*/

describe('Batch Learning — Shadow-only guarantee', () => {
  it('BATCH_LEARNING_LOG_SCHEMA_SQL does not reference memory_index ranking columns', () => {
    expect(BATCH_LEARNING_LOG_SCHEMA_SQL).not.toContain('stability');
    expect(BATCH_LEARNING_LOG_SCHEMA_SQL).not.toContain('retrievability');
    expect(BATCH_LEARNING_LOG_SCHEMA_SQL).not.toContain('importance_weight');
  });

  it('runBatchLearning result has shadow-only fields (no live mutation fields)', () => {
    vi.stubEnv('SPECKIT_BATCH_LEARNED_FEEDBACK', 'false');
    const db = createTestDb();
    const result = runBatchLearning(db);
    // Result does not include any live-ranking mutation fields
    expect(result).not.toHaveProperty('liveRankUpdated');
    expect(result).not.toHaveProperty('stabilityUpdated');
  });
});
