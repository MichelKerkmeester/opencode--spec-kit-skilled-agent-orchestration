import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Stage2Input } from '../lib/search/pipeline/types.js';

import {
  buildAdaptiveShadowProposal,
  ensureAdaptiveTables,
  getAdaptiveThresholdSnapshot,
  recordAdaptiveSignal,
  setAdaptiveThresholdOverrides,
  resetAdaptiveThresholdOverrides,
  resetAdaptiveState,
  summarizeAdaptiveSignalQuality,
  tuneAdaptiveThresholdsAfterEvaluation,
} from '../lib/cognitive/adaptive-ranking.js';

const mockRequireDb = vi.fn();
const mockQueryLearnedTriggers = vi.fn();
const mockApplyGraphSignals = vi.fn();
const mockApplyCommunityBoost = vi.fn();
const mockCoActivationEnabled = vi.fn(() => false);
const mockSpreadActivation = vi.fn(() => []);
const mockGetRelatedMemoryCounts = vi.fn(() => new Map<number, number>());

vi.mock('../utils/db-helpers.js', () => ({
  requireDb: mockRequireDb,
}));

vi.mock('../lib/search/learned-feedback.js', () => ({
  queryLearnedTriggers: mockQueryLearnedTriggers,
}));

vi.mock('../lib/graph/graph-signals.js', () => ({
  applyGraphSignals: mockApplyGraphSignals,
}));

vi.mock('../lib/graph/community-detection.js', () => ({
  applyCommunityBoost: mockApplyCommunityBoost,
}));

vi.mock('../lib/cognitive/co-activation.js', () => ({
  isEnabled: mockCoActivationEnabled,
  spreadActivation: mockSpreadActivation,
  getRelatedMemoryCounts: mockGetRelatedMemoryCounts,
  resolveCoActivationBoostFactor: () => 0.25,
}));

vi.mock('../lib/search/session-boost.js', () => ({
  applySessionBoost: <T>(rows: T[]) => ({ results: rows, metadata: { applied: false } }),
}));

vi.mock('../lib/search/causal-boost.js', () => ({
  applyCausalBoost: <T>(rows: T[]) => ({ results: rows, metadata: { applied: false } }),
}));

vi.mock('../lib/search/anchor-metadata.js', () => ({
  enrichResultsWithAnchorMetadata: <T>(rows: T[]) => rows,
}));

vi.mock('../lib/search/validation-metadata.js', () => ({
  enrichResultsWithValidationMetadata: <T>(rows: T[]) => rows,
}));

function createStage2TestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      stability REAL DEFAULT 1,
      difficulty REAL DEFAULT 5,
      review_count INTEGER DEFAULT 0,
      access_count INTEGER DEFAULT 0,
      last_accessed INTEGER,
      last_review TEXT,
      created_at TEXT
    )
  `);
  ensureAdaptiveTables(db);
  return db;
}

function createStage2Input(candidates: Array<Record<string, unknown>>): Stage2Input {
  return {
    candidates: candidates as Array<Record<string, unknown> & { id: number }>,
    stage1Metadata: {
      searchType: 'vector',
      channelCount: 1,
      candidateCount: candidates.length,
      constitutionalInjected: 0,
      durationMs: 1,
    },
    config: {
      query: 'adaptive access query',
      searchType: 'vector',
      limit: candidates.length,
      includeArchived: false,
      includeConstitutional: true,
      includeContent: false,
      minState: 'hot',
      applyStateLimits: false,
      useDecay: false,
      rerank: false,
      applyLengthPenalty: false,
      enableDedup: false,
      enableSessionBoost: false,
      enableCausalBoost: false,
      trackAccess: true,
      detectedIntent: null,
      intentConfidence: 0,
      intentWeights: null,
    },
  };
}

describe('Phase 4 adaptive ranking shadow proposals', () => {
  let db: Database.Database | null = null;
  const originalEnv: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of [
      'SPECKIT_MEMORY_ADAPTIVE_RANKING',
      'SPECKIT_MEMORY_ADAPTIVE_MODE',
      'SPECKIT_NEGATIVE_FEEDBACK',
      'SPECKIT_GRAPH_UNIFIED',
      'SPECKIT_GRAPH_SIGNALS',
    ]) {
      originalEnv[key] = process.env[key];
    }

    mockRequireDb.mockReset();
    mockQueryLearnedTriggers.mockReset();
    mockApplyGraphSignals.mockReset();
    mockApplyCommunityBoost.mockReset();
    mockCoActivationEnabled.mockReset();
    mockSpreadActivation.mockReset();
    mockGetRelatedMemoryCounts.mockReset();

    mockQueryLearnedTriggers.mockReturnValue([]);
    mockApplyGraphSignals.mockImplementation((rows: Array<Record<string, unknown>>) => rows);
    mockApplyCommunityBoost.mockImplementation((rows: Array<Record<string, unknown>>) => rows);
    mockCoActivationEnabled.mockReturnValue(false);
    mockSpreadActivation.mockReturnValue([]);
    mockGetRelatedMemoryCounts.mockReturnValue(new Map());

    process.env.SPECKIT_NEGATIVE_FEEDBACK = 'false';
    process.env.SPECKIT_GRAPH_UNIFIED = 'false';
    process.env.SPECKIT_GRAPH_SIGNALS = 'false';
  });

  afterEach(() => {
    for (const [key, val] of Object.entries(originalEnv)) {
      if (val === undefined) delete process.env[key];
      else process.env[key] = val;
    }
    resetAdaptiveThresholdOverrides();
    vi.resetModules();
    vi.restoreAllMocks();
    db?.close();
    db = null;
  });

  it('defaults adaptive ranking to disabled mode until explicitly enabled', () => {
    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'access', signalValue: 1 });

    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 0 });
  });

  it('rejects NaN adaptive signals before persistence', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'access', signalValue: Number.NaN });

    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 0 });
  });

  it('rejects infinite adaptive signals before persistence', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'access', signalValue: Number.POSITIVE_INFINITY });

    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 0 });
  });

  it('rejects negative adaptive signals before persistence', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'access', signalValue: -1 });

    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 0 });
  });

  it('rejects zero-value adaptive signals before persistence', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'access', signalValue: 0 });

    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 0 });
  });

  it('persists positive adaptive signals', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'access', signalValue: 1 });

    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 1 });
  });

  it('records adaptive access signals when trackAccess is true and adaptive ranking enabled', async () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';

    db = createStage2TestDb();
    db.prepare(`
      INSERT INTO memory_index (id, stability, difficulty, review_count, access_count, last_review, created_at)
      VALUES
        (1, 2.5, 5.5, 0, 0, '2026-03-01T00:00:00.000Z', '2026-02-01T00:00:00.000Z'),
        (2, 3.0, 4.5, 1, 0, '2026-03-02T00:00:00.000Z', '2026-02-02T00:00:00.000Z')
    `).run();
    mockRequireDb.mockReturnValue(db);

    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion.js');
    await executeStage2(createStage2Input([
      { id: 1, score: 0.9, similarity: 90, stability: 2.5, last_review: '2026-03-01T00:00:00.000Z', created_at: '2026-02-01T00:00:00.000Z' },
      { id: 2, score: 0.8, similarity: 80, stability: 3.0, last_review: '2026-03-02T00:00:00.000Z', created_at: '2026-02-02T00:00:00.000Z' },
    ]));

    expect(
      db.prepare(`
        SELECT memory_id, signal_type, signal_value, query
        FROM adaptive_signal_events
        ORDER BY memory_id
      `).all()
    ).toEqual([
      { memory_id: 1, signal_type: 'access', signal_value: 1, query: 'adaptive access query' },
      { memory_id: 2, signal_type: 'access', signal_value: 1, query: 'adaptive access query' },
    ]);
  });

  it('does not record adaptive signals when adaptive ranking disabled', async () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'false';

    db = createStage2TestDb();
    db.prepare(`
      INSERT INTO memory_index (id, stability, difficulty, review_count, access_count, last_review, created_at)
      VALUES (1, 2.5, 5.5, 0, 0, '2026-03-01T00:00:00.000Z', '2026-02-01T00:00:00.000Z')
    `).run();
    mockRequireDb.mockReturnValue(db);

    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion.js');
    await executeStage2(createStage2Input([
      { id: 1, score: 0.9, similarity: 90, stability: 2.5, last_review: '2026-03-01T00:00:00.000Z', created_at: '2026-02-01T00:00:00.000Z' },
    ]));

    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 0 });
  });

  it('persists thresholds to SQLite via setAdaptiveThresholdOverrides', () => {
    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    const snapshot = setAdaptiveThresholdOverrides({
      maxAdaptiveDelta: 0.1,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.01,
        outcome: 0.025,
        correction: -0.04,
      },
    }, db);

    expect(snapshot).toEqual({
      maxAdaptiveDelta: 0.1,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.01,
        outcome: 0.025,
        correction: -0.04,
      },
    });
    expect(db.prepare(`
      SELECT
        id,
        max_adaptive_delta,
        outcome_weight,
        correction_weight,
        access_weight,
        min_signals_for_promotion
      FROM adaptive_thresholds
    `).get()).toEqual({
      id: 1,
      max_adaptive_delta: 0.1,
      outcome_weight: 0.025,
      correction_weight: -0.04,
      access_weight: 0.01,
      min_signals_for_promotion: 2,
    });
  });

  it('loads persisted thresholds on cold start (empty WeakMap)', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'adaptive-thresholds-'));
    const databasePath = join(tempDir, 'adaptive-thresholds.sqlite');
    const warmDb = new Database(databasePath);
    ensureAdaptiveTables(warmDb);

    setAdaptiveThresholdOverrides({
      maxAdaptiveDelta: 0.11,
      minSignalsForPromotion: 4,
      signalWeights: {
        access: 0.009,
        outcome: 0.03,
        correction: -0.035,
      },
    }, warmDb);
    warmDb.close();

    const coldDb = new Database(databasePath);
    try {
      expect(getAdaptiveThresholdSnapshot(coldDb)).toEqual({
        maxAdaptiveDelta: 0.11,
        minSignalsForPromotion: 4,
        signalWeights: {
          access: 0.009,
          outcome: 0.03,
          correction: -0.035,
        },
      });
    } finally {
      coldDb.close();
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('refreshes WeakMap cache when SQLite updated_at is newer', () => {
    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    setAdaptiveThresholdOverrides({
      maxAdaptiveDelta: 0.09,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.007,
        outcome: 0.022,
        correction: -0.031,
      },
    }, db);

    db.prepare(`
      UPDATE adaptive_thresholds
      SET
        max_adaptive_delta = 0.12,
        outcome_weight = 0.04,
        correction_weight = -0.01,
        access_weight = 0.02,
        min_signals_for_promotion = 6,
        updated_at = '2099-01-01T00:00:00.000Z'
      WHERE id = 1
    `).run();

    expect(getAdaptiveThresholdSnapshot(db)).toEqual({
      maxAdaptiveDelta: 0.12,
      minSignalsForPromotion: 6,
      signalWeights: {
        access: 0.02,
        outcome: 0.04,
        correction: -0.01,
      },
    });
  });

  it('records bounded shadow proposals without mutating production order', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 2, signalType: 'access', signalValue: 4 });
    recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 2 });
    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'correction', signalValue: 2 });

    const proposal = buildAdaptiveShadowProposal(db, 'test query', [
      { id: 1, score: 0.7, similarity: 70 },
      { id: 2, score: 0.68, similarity: 68 },
    ]);

    expect(proposal).not.toBeNull();
    expect(proposal?.mode).toBe('shadow');
    expect(proposal?.bounded).toBe(true);
    expect(proposal?.rows).toHaveLength(2);
    expect(proposal?.rows.some((row) => row.memoryId === 2 && row.shadowRank === 1)).toBe(true);
  });

  it('clears adaptive shadow state during rollback drills without reversing schema', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    process.env.SPECKIT_MEMORY_ADAPTIVE_MODE = 'promoted';

    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 7, signalType: 'access', signalValue: 2 });
    recordAdaptiveSignal(db, { memoryId: 7, signalType: 'outcome', signalValue: 1 });
    recordAdaptiveSignal(db, { memoryId: 9, signalType: 'correction', signalValue: 1 });

    const proposal = buildAdaptiveShadowProposal(db, 'rollback query', [
      { id: 7, score: 0.63, similarity: 63 },
      { id: 9, score: 0.61, similarity: 61 },
    ]);

    expect(proposal?.mode).toBe('promoted');
    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 3 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_shadow_runs').get()).toEqual({ count: 1 });

    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'false';
    delete process.env.SPECKIT_MEMORY_ADAPTIVE_MODE;

    expect(resetAdaptiveState(db)).toEqual({
      clearedSignals: 3,
      clearedRuns: 1,
    });

    recordAdaptiveSignal(db, { memoryId: 7, signalType: 'access', signalValue: 5 });

    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_shadow_runs').get()).toEqual({ count: 0 });
  });

  it('summarizes adaptive signal quality and threshold bounds', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    process.env.SPECKIT_MEMORY_ADAPTIVE_MODE = 'promoted';

    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 11, signalType: 'access', signalValue: 2 });
    recordAdaptiveSignal(db, { memoryId: 11, signalType: 'outcome', signalValue: 1.5 });
    recordAdaptiveSignal(db, { memoryId: 11, signalType: 'correction', signalValue: 0.5 });
    recordAdaptiveSignal(db, { memoryId: 12, signalType: 'access', signalValue: 4 });

    buildAdaptiveShadowProposal(db, 'quality summary query', [
      { id: 11, score: 0.7, similarity: 70 },
      { id: 12, score: 0.69, similarity: 69 },
    ]);

    expect(getAdaptiveThresholdSnapshot()).toEqual({
      maxAdaptiveDelta: 0.08,
      minSignalsForPromotion: 3,
      signalWeights: {
        access: 0.005,
        outcome: 0.02,
        correction: -0.03,
      },
    });

    expect(summarizeAdaptiveSignalQuality(db)).toEqual({
      totalSignals: 4,
      distinctMemories: 2,
      promotionReadyMemories: 1,
      shadowRunCount: 1,
      latestShadowMode: 'promoted',
      weightedSignalScore: 0.045,
      signalCounts: {
        access: 2,
        outcome: 1,
        correction: 1,
      },
      signalTotals: {
        access: 6,
        outcome: 1.5,
        correction: 0.5,
      },
    });
  });

  it('keeps adaptive threshold overrides isolated per database', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';

    db = new Database(':memory:');
    const dbA = db;
    const dbB = new Database(':memory:');
    ensureAdaptiveTables(dbA);
    ensureAdaptiveTables(dbB);

    recordAdaptiveSignal(dbA, { memoryId: 1, signalType: 'outcome', signalValue: 1 });
    recordAdaptiveSignal(dbA, { memoryId: 1, signalType: 'outcome', signalValue: 1 });
    recordAdaptiveSignal(dbA, { memoryId: 1, signalType: 'outcome', signalValue: 1 });
    recordAdaptiveSignal(dbA, { memoryId: 2, signalType: 'outcome', signalValue: 1 });
    recordAdaptiveSignal(dbA, { memoryId: 2, signalType: 'outcome', signalValue: 1 });
    recordAdaptiveSignal(dbA, { memoryId: 2, signalType: 'outcome', signalValue: 1 });

    const tuning = tuneAdaptiveThresholdsAfterEvaluation(dbA);

    expect(tuning.next).toEqual({
      maxAdaptiveDelta: 0.1,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.005,
        outcome: 0.025,
        correction: -0.03,
      },
    });
    expect(getAdaptiveThresholdSnapshot(dbA)).toEqual({
      maxAdaptiveDelta: 0.1,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.005,
        outcome: 0.025,
        correction: -0.03,
      },
    });
    try {
      expect(getAdaptiveThresholdSnapshot(dbB)).toEqual({
        maxAdaptiveDelta: 0.08,
        minSignalsForPromotion: 3,
        signalWeights: {
          access: 0.005,
          outcome: 0.02,
          correction: -0.03,
        },
      });
    } finally {
      dbB.close();
    }
  });

  it('requires signals from multiple memories before relaxing thresholds', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';

    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    for (let index = 0; index < 6; index += 1) {
      recordAdaptiveSignal(db, { memoryId: 1, signalType: 'outcome', signalValue: 1 });
    }

    const singleMemoryTuning = tuneAdaptiveThresholdsAfterEvaluation(db);

    expect(singleMemoryTuning.summary.totalSignals).toBe(6);
    expect(singleMemoryTuning.summary.distinctMemories).toBe(1);
    expect(singleMemoryTuning.next).toEqual({
      maxAdaptiveDelta: 0.08,
      minSignalsForPromotion: 3,
      signalWeights: {
        access: 0.005,
        outcome: 0.02,
        correction: -0.03,
      },
    });

    for (let index = 0; index < 3; index += 1) {
      recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 1 });
    }

    const multiMemoryTuning = tuneAdaptiveThresholdsAfterEvaluation(db);

    expect(multiMemoryTuning.summary.distinctMemories).toBe(2);
    expect(multiMemoryTuning.next).toEqual({
      maxAdaptiveDelta: 0.1,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.005,
        outcome: 0.025,
        correction: -0.03,
      },
    });
  });

  it('skips repeat tuning when the signal watermark has not changed', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';

    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    for (let index = 0; index < 3; index += 1) {
      recordAdaptiveSignal(db, { memoryId: 1, signalType: 'outcome', signalValue: 1 });
      recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 1 });
    }

    const firstTuning = tuneAdaptiveThresholdsAfterEvaluation(db);
    const secondTuning = tuneAdaptiveThresholdsAfterEvaluation(db);

    expect(firstTuning.next).toEqual({
      maxAdaptiveDelta: 0.1,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.005,
        outcome: 0.025,
        correction: -0.03,
      },
    });
    expect(db.prepare('SELECT last_tune_watermark FROM adaptive_thresholds WHERE id = 1').get()).toEqual({
      last_tune_watermark: '6:none',
    });
    expect(secondTuning.previous).toEqual(firstTuning.next);
    expect(secondTuning.next).toEqual(firstTuning.next);
  });

  it('retunes when the gate recommendation changes without new signals', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';

    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    for (let index = 0; index < 3; index += 1) {
      recordAdaptiveSignal(db, { memoryId: 1, signalType: 'outcome', signalValue: 1 });
      recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 1 });
    }

    const waitTuning = tuneAdaptiveThresholdsAfterEvaluation(db, { recommendation: 'wait' });
    const promoteTuning = tuneAdaptiveThresholdsAfterEvaluation(db, { recommendation: 'promote' });

    expect(waitTuning.next).toEqual({
      maxAdaptiveDelta: 0.1,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.005,
        outcome: 0.025,
        correction: -0.03,
      },
    });
    expect(promoteTuning.previous).toEqual(waitTuning.next);
    expect(promoteTuning.next).toEqual({
      maxAdaptiveDelta: 0.12,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.005,
        outcome: 0.033,
        correction: -0.03,
      },
    });
    expect(db.prepare('SELECT last_tune_watermark FROM adaptive_thresholds WHERE id = 1').get()).toEqual({
      last_tune_watermark: '6:promote',
    });
  });

  it('tunes thresholds after evaluation and applies them to promotion gating', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    process.env.SPECKIT_MEMORY_ADAPTIVE_MODE = 'promoted';

    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 3 });
    recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 2 });
    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'correction', signalValue: 1 });
    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'correction', signalValue: 1 });
    recordAdaptiveSignal(db, { memoryId: 3, signalType: 'access', signalValue: 1 });
    recordAdaptiveSignal(db, { memoryId: 3, signalType: 'access', signalValue: 1 });

    const beforeTuning = buildAdaptiveShadowProposal(db, 'threshold tuning query', [
      { id: 1, score: 0.72, similarity: 72 },
      { id: 2, score: 0.69, similarity: 69 },
      { id: 3, score: 0.67, similarity: 67 },
    ]);

    expect(beforeTuning?.promotedIds).toEqual([]);
    expect(beforeTuning?.maxDeltaApplied).toBe(0.08);
    expect(getAdaptiveThresholdSnapshot()).toEqual({
      maxAdaptiveDelta: 0.08,
      minSignalsForPromotion: 3,
      signalWeights: {
        access: 0.005,
        outcome: 0.02,
        correction: -0.03,
      },
    });

    const tuning = tuneAdaptiveThresholdsAfterEvaluation(db);
    expect(tuning.summary.totalSignals).toBe(6);
    expect(tuning.summary.distinctMemories).toBe(3);
    expect(tuning.summary.promotionReadyMemories).toBe(0);
    expect(tuning.summary.weightedSignalScore).toBeCloseTo(0.05, 6);
    expect(tuning.summary.signalCounts).toEqual({
      access: 2,
      outcome: 2,
      correction: 2,
    });
    expect(tuning.summary.signalTotals).toEqual({
      access: 2,
      outcome: 5,
      correction: 2,
    });
    expect(tuning.previous).toEqual({
      maxAdaptiveDelta: 0.08,
      minSignalsForPromotion: 3,
      signalWeights: {
        access: 0.005,
        outcome: 0.02,
        correction: -0.03,
      },
    });
    expect(tuning.next).toEqual({
      maxAdaptiveDelta: 0.1,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.005,
        outcome: 0.025,
        correction: -0.03,
      },
    });

    const afterTuning = buildAdaptiveShadowProposal(db, 'threshold tuning query', [
      { id: 1, score: 0.72, similarity: 72 },
      { id: 2, score: 0.69, similarity: 69 },
      { id: 3, score: 0.67, similarity: 67 },
    ]);

    expect(afterTuning?.maxDeltaApplied).toBe(0.1);
    expect(afterTuning?.promotedIds).toContain(2);
    expect(afterTuning?.promotedIds.length).toBeGreaterThan(0);
    expect(afterTuning?.rows.find((row) => row.memoryId === 2)).toMatchObject({
      shadowRank: 1,
      scoreDelta: 0.1,
    });
  });

  it('applies a larger relaxation multiplier when promotion is recommended', () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';

    db = new Database(':memory:');
    ensureAdaptiveTables(db);

    for (let index = 0; index < 3; index += 1) {
      recordAdaptiveSignal(db, { memoryId: 1, signalType: 'outcome', signalValue: 1 });
      recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 1 });
    }

    const tuning = tuneAdaptiveThresholdsAfterEvaluation(db, { recommendation: 'promote' });

    expect(tuning.next).toEqual({
      maxAdaptiveDelta: 0.11,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.005,
        outcome: 0.028,
        correction: -0.03,
      },
    });
  });
});
