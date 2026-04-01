// ───────────────────────────────────────────────────────────────
// TESTS: Adaptive Ranking E2E Lifecycle
// ───────────────────────────────────────────────────────────────
// End-to-end coverage for adaptive signal persistence, bounded
// proposal generation, shadow evaluation, threshold tuning, and
// rollback/reset behavior using a real in-memory SQLite database.
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  buildAdaptiveShadowProposal,
  ensureAdaptiveTables,
  getAdaptiveThresholdSnapshot,
  recordAdaptiveSignal,
  resetAdaptiveState,
  resetAdaptiveThresholdOverrides,
  tuneAdaptiveThresholdsAfterEvaluation,
} from '../lib/cognitive/adaptive-ranking.js';
import {
  recordCycleResult,
  runShadowEvaluation,
} from '../lib/feedback/shadow-scoring.js';
import { runScheduledShadowEvaluationCycle } from '../lib/feedback/shadow-evaluation-runtime.js';
import type { RankedItem } from '../lib/feedback/rank-metrics.js';
import { initConsumptionLog } from '../lib/telemetry/consumption-logger.js';
import { executePipeline } from '../lib/search/pipeline/index.js';

vi.mock('../core/index.js', () => ({
  isEmbeddingModelReady: vi.fn(() => true),
  waitForEmbeddingModel: vi.fn(async () => true),
  checkDatabaseUpdated: vi.fn(async () => undefined),
}));

vi.mock('../lib/search/session-boost.js', () => ({
  isEnabled: vi.fn(() => false),
}));

vi.mock('../lib/search/causal-boost.js', () => ({
  isEnabled: vi.fn(() => false),
}));

vi.mock('../lib/search/pipeline/index.js', () => ({
  executePipeline: vi.fn(),
}));

type AdaptiveTestResult = {
  id: number;
  score: number;
  similarity: number;
  specFolder?: string;
};

const DEFAULT_THRESHOLDS = {
  maxAdaptiveDelta: 0.08,
  minSignalsForPromotion: 3,
  signalWeights: {
    access: 0.005,
    outcome: 0.02,
    correction: -0.03,
  },
} as const;

function toLiveRanks(results: AdaptiveTestResult[]): RankedItem[] {
  return results.map((result, index) => ({
    resultId: String(result.id),
    rank: index + 1,
    relevanceScore: result.score,
  }));
}

function toShadowRanks(
  proposalRows: Array<{
    memoryId: number;
    shadowRank: number;
    shadowScore: number;
  }>,
): RankedItem[] {
  return [...proposalRows]
    .sort((left, right) => left.shadowRank - right.shadowRank)
    .map((row) => ({
      resultId: String(row.memoryId),
      rank: row.shadowRank,
      relevanceScore: row.shadowScore,
    }));
}

function insertSearchEvent(db: Database.Database, id: number, queryText: string, timestamp: string): void {
  db.prepare(`
    INSERT INTO consumption_log (
      id,
      event_type,
      query_text,
      result_count,
      timestamp
    ) VALUES (?, 'search', ?, 3, ?)
  `).run(id, queryText, timestamp);
}

describe('Adaptive Ranking E2E Lifecycle', () => {
  let db: Database.Database;
  const originalEnv: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of ['SPECKIT_MEMORY_ADAPTIVE_RANKING', 'SPECKIT_MEMORY_ADAPTIVE_MODE', 'SPECKIT_SHADOW_FEEDBACK']) {
      originalEnv[key] = process.env[key];
    }

    db = new Database(':memory:');
    ensureAdaptiveTables(db);
    initConsumptionLog(db);
    process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
    process.env.SPECKIT_SHADOW_FEEDBACK = 'true';
    delete process.env.SPECKIT_MEMORY_ADAPTIVE_MODE;
    vi.mocked(executePipeline).mockReset();
  });

  afterEach(() => {
    for (const [key, val] of Object.entries(originalEnv)) {
      if (val === undefined) delete process.env[key];
      else process.env[key] = val;
    }
    resetAdaptiveThresholdOverrides(db);
    db.close();
  });

  it('runs the full lifecycle: signals -> proposal -> evaluation -> tuning -> reset', () => {
    for (let index = 0; index < 2; index += 1) {
      recordAdaptiveSignal(db, { memoryId: 1, signalType: 'access', signalValue: 1, query: 'test query' });
      recordAdaptiveSignal(db, { memoryId: 2, signalType: 'access', signalValue: 1, query: 'test query' });
    }
    recordAdaptiveSignal(db, { memoryId: 3, signalType: 'access', signalValue: 1, query: 'test query' });

    for (let index = 0; index < 5; index += 1) {
      recordAdaptiveSignal(db, { memoryId: 1, signalType: 'outcome', signalValue: 1, query: 'test query' });
      recordAdaptiveSignal(db, { memoryId: 2, signalType: 'correction', signalValue: 1, query: 'test query' });
    }

    const results: AdaptiveTestResult[] = [
      { id: 1, score: 0.8, similarity: 80, specFolder: 'test' },
      { id: 2, score: 0.6, similarity: 60, specFolder: 'test' },
      { id: 3, score: 0.4, similarity: 40, specFolder: 'test' },
    ];

    const proposal = buildAdaptiveShadowProposal(db, 'test query', results);

    expect(proposal).not.toBeNull();
    expect(proposal?.rows).toHaveLength(3);
    expect(proposal?.mode).toBe('shadow');

    const row1 = proposal?.rows.find((row) => row.memoryId === 1);
    const row2 = proposal?.rows.find((row) => row.memoryId === 2);
    const row3 = proposal?.rows.find((row) => row.memoryId === 3);

    expect(row1?.scoreDelta).toBeCloseTo(0.08, 6);
    expect(row2?.scoreDelta).toBeCloseTo(-0.08, 6);
    expect(row3?.scoreDelta).toBeCloseTo(0.005, 6);

    const report = runShadowEvaluation(
      db,
      ['adaptive-e2e-query'],
      () => toLiveRanks(results),
      () => toShadowRanks(proposal?.rows ?? []),
      {
        holdoutPercent: 1,
        seed: 42,
        cycleId: 'adaptive-e2e-cycle',
        evaluatedAt: 1_700_000_000_000,
      },
    );

    expect(report).not.toBeNull();
    expect(report?.cycleId).toBe('adaptive-e2e-cycle');
    expect(report?.holdoutQueryIds).toEqual(['adaptive-e2e-query']);
    expect(report?.cycleResult.queryCount).toBe(1);
    expect(db.prepare('SELECT COUNT(*) AS count FROM shadow_scoring_log').get()).toEqual({ count: 3 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM shadow_cycle_results').get()).toEqual({ count: 1 });

    for (let index = 0; index < 4; index += 1) {
      recordAdaptiveSignal(db, { memoryId: 1, signalType: 'outcome', signalValue: 1, query: 'bulk' });
      recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 1, query: 'bulk' });
    }

    const before = getAdaptiveThresholdSnapshot(db);
    const tuning = tuneAdaptiveThresholdsAfterEvaluation(db);
    const after = getAdaptiveThresholdSnapshot(db);
    const repeatTuning = tuneAdaptiveThresholdsAfterEvaluation(db);

    expect(tuning).toBeDefined();
    expect(tuning.previous).toEqual(before);
    expect(after).toEqual(tuning.next);
    expect(repeatTuning.next).toEqual(after);
    expect(after).toEqual({
      maxAdaptiveDelta: 0.1,
      minSignalsForPromotion: 2,
      signalWeights: {
        access: 0.005,
        outcome: 0.025,
        correction: -0.03,
      },
    });

    const afterTuningProposal = buildAdaptiveShadowProposal(db, 'test query', results);
    expect(afterTuningProposal).not.toBeNull();
    expect(afterTuningProposal?.maxDeltaApplied).toBe(0.1);
    expect(db.prepare('SELECT last_tune_watermark FROM adaptive_thresholds WHERE id = 1').get()).toEqual({
      last_tune_watermark: '23:none',
    });

    expect(resetAdaptiveState(db)).toEqual({
      clearedSignals: 23,
      clearedRuns: 2,
    });
    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_signal_events').get()).toEqual({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_shadow_runs').get()).toEqual({ count: 0 });

    const afterReset = resetAdaptiveThresholdOverrides(db);
    expect(afterReset).toEqual(DEFAULT_THRESHOLDS);
    expect(getAdaptiveThresholdSnapshot(db)).toEqual(DEFAULT_THRESHOLDS);
  });

  it('proposal reflects adaptive signal deltas correctly', () => {
    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'outcome', signalValue: 1 });
    recordAdaptiveSignal(db, { memoryId: 1, signalType: 'outcome', signalValue: 1 });
    recordAdaptiveSignal(db, { memoryId: 2, signalType: 'correction', signalValue: 1 });

    const results: AdaptiveTestResult[] = [
      { id: 1, score: 0.5, similarity: 50 },
      { id: 2, score: 0.5, similarity: 50 },
    ];

    const proposal = buildAdaptiveShadowProposal(db, 'delta query', results);

    expect(proposal).not.toBeNull();

    const row1 = proposal?.rows.find((row) => row.memoryId === 1);
    const row2 = proposal?.rows.find((row) => row.memoryId === 2);

    expect(row1?.scoreDelta).toBeGreaterThan(0);
    expect(row1?.shadowScore).toBeGreaterThan(row1?.productionScore ?? 0);
    expect(row2?.scoreDelta).toBeLessThan(0);
    expect(row2?.shadowScore).toBeLessThan(row2?.productionScore ?? 0);
  });

  it('persists tuned thresholds across repeated reads', () => {
    for (let index = 0; index < 3; index += 1) {
      recordAdaptiveSignal(db, { memoryId: 1, signalType: 'outcome', signalValue: 1, query: 'persist' });
      recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 1, query: 'persist' });
    }

    const original = getAdaptiveThresholdSnapshot(db);
    const tuning = tuneAdaptiveThresholdsAfterEvaluation(db);
    const tuned = getAdaptiveThresholdSnapshot(db);
    const reread = getAdaptiveThresholdSnapshot(db);

    expect(tuning.previous).toEqual(original);
    expect(tuned).toEqual(tuning.next);
    expect(reread).toEqual(tuned);
    expect(tuned).not.toEqual(original);
    expect(db.prepare(`
      SELECT
        max_adaptive_delta,
        outcome_weight,
        correction_weight,
        access_weight,
        min_signals_for_promotion
      FROM adaptive_thresholds
      WHERE id = 1
    `).get()).toEqual({
      max_adaptive_delta: 0.1,
      outcome_weight: 0.025,
      correction_weight: -0.03,
      access_weight: 0.005,
      min_signals_for_promotion: 2,
    });
  });

  it('replays shadow evaluation with real proposal deltas and feedback-driven promotion tuning', async () => {
    process.env.SPECKIT_MEMORY_ADAPTIVE_MODE = 'promoted';

    const replayResults: AdaptiveTestResult[] = [
      { id: 1, score: 0.8, similarity: 80, specFolder: 'test' },
      { id: 2, score: 0.76, similarity: 76, specFolder: 'test' },
      { id: 3, score: 0.5, similarity: 50, specFolder: 'test' },
    ];

    for (let index = 0; index < 5; index += 1) {
      recordAdaptiveSignal(db, { memoryId: 2, signalType: 'outcome', signalValue: 2, query: 'replay query' });
      recordAdaptiveSignal(db, { memoryId: 1, signalType: 'correction', signalValue: 1, query: 'replay query' });
    }

    const proposal = buildAdaptiveShadowProposal(db, 'replay query', replayResults);
    expect(proposal).not.toBeNull();
    expect(proposal?.rows).toHaveLength(3);
    expect(proposal?.promotedIds).toContain(2);
    expect(proposal?.demotedIds).toContain(1);
    expect(proposal?.rows.find((row) => row.memoryId === 2)?.scoreDelta).toBeCloseTo(0.08, 6);
    expect(proposal?.rows.find((row) => row.memoryId === 1)?.scoreDelta).toBeCloseTo(-0.08, 6);

    recordCycleResult(db, {
      cycleId: 'prior-improvement-cycle',
      evaluatedAt: Date.now() - (8 * 24 * 60 * 60 * 1000),
      queryCount: 1,
      meanNdcgDelta: 0.1,
      meanMrrDelta: 0.05,
      meanKendallTau: 0.8,
      totalImproved: 1,
      totalDegraded: 0,
      totalUnchanged: 0,
      isImprovement: true,
    });

    insertSearchEvent(db, 1, 'replay query', new Date().toISOString());
    vi.mocked(executePipeline).mockResolvedValue({
      results: replayResults,
    } as Awaited<ReturnType<typeof executePipeline>>);

    const report = await runScheduledShadowEvaluationCycle(db, {
      holdoutPercent: 1,
      queryLookbackMs: 14 * 24 * 60 * 60 * 1000,
      maxQueryPoolSize: 10,
      searchLimit: 3,
      seed: 42,
    });

    expect(report).not.toBeNull();
    expect(vi.mocked(executePipeline)).toHaveBeenCalledTimes(1);
    expect(report?.cycleResult.queryCount).toBe(1);
    expect(report?.promotionGate.ready).toBe(true);
    expect(report?.promotionGate.recommendation).toBe('promote');
    expect(report?.comparisons[0]?.metrics.ndcgDelta).toBeGreaterThan(0);
    expect(report?.comparisons[0]?.metrics.improvedCount).toBeGreaterThan(0);
    expect(report?.comparisons[0]?.metrics.mrrDelta).toBeGreaterThanOrEqual(0);
    expect(getAdaptiveThresholdSnapshot(db)).toEqual({
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
