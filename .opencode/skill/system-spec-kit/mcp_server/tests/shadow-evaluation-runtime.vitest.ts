// ───────────────────────────────────────────────────────────────
// MODULE: Shadow Evaluation Runtime Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';
import {
  EVALUATION_WINDOW_MS,
  getCycleResults,
  getShadowScoringHistory,
  recordCycleResult,
} from '../lib/feedback/shadow-scoring.js';
import { initConsumptionLog } from '../lib/telemetry/consumption-logger.js';
import {
  isShadowEvaluationSchedulerRunning,
  runScheduledShadowEvaluationCycle,
  startShadowEvaluationScheduler,
  stopShadowEvaluationScheduler,
} from '../lib/feedback/shadow-evaluation-runtime.js';
import { executePipeline } from '../lib/search/pipeline/index.js';
import {
  buildAdaptiveShadowProposal,
  getAdaptiveMode,
  tuneAdaptiveThresholdsAfterEvaluation,
} from '../lib/cognitive/adaptive-ranking.js';

vi.mock('../core/index.js', () => ({
  isEmbeddingModelReady: vi.fn(() => true),
  waitForEmbeddingModel: vi.fn(async () => true),
  checkDatabaseUpdated: vi.fn(async () => undefined),
}));

vi.mock('../lib/search/pipeline/index.js', () => ({
  executePipeline: vi.fn(),
}));

vi.mock('../lib/cognitive/adaptive-ranking.js', () => ({
  buildAdaptiveShadowProposal: vi.fn(),
  getAdaptiveMode: vi.fn(() => 'disabled'),
  tuneAdaptiveThresholdsAfterEvaluation: vi.fn(),
}));

vi.mock('../lib/search/session-boost.js', () => ({
  isEnabled: vi.fn(() => false),
}));

vi.mock('../lib/search/causal-boost.js', () => ({
  isEnabled: vi.fn(() => false),
}));

interface ReplayResultShape {
  results: Array<{ id: number; score: number }>;
}

function initAdaptiveSignalEvents(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS adaptive_signal_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      signal_type TEXT NOT NULL CHECK(signal_type IN ('access', 'outcome', 'correction')),
      signal_value REAL DEFAULT 1,
      query TEXT,
      actor TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function insertAdaptiveSignalEvent(
  db: Database.Database,
  memoryId: number,
  signalType: 'outcome' | 'correction',
  signalValue: number,
  queryText: string | null = null,
  metadata: Record<string, unknown> | null = null,
): void {
  db.prepare(`
    INSERT INTO adaptive_signal_events (memory_id, signal_type, signal_value, query, actor, metadata)
    VALUES (?, ?, ?, ?, NULL, ?)
  `).run(memoryId, signalType, signalValue, queryText, metadata ? JSON.stringify(metadata) : null);
}

function insertSearchEvent(db: Database.Database, id: number, queryText: string, timestamp: string): void {
  db.prepare(`
    INSERT INTO consumption_log (
      id,
      event_type,
      query_text,
      result_count,
      timestamp
    ) VALUES (?, 'search', ?, 2, ?)
  `).run(id, queryText, timestamp);
}

function insertQueryFeedbackLabels(
  db: Database.Database,
  queryText: string,
  memoryIds: number[],
): void {
  initAdaptiveSignalEvents(db);
  memoryIds.forEach((memoryId, index) => {
    insertAdaptiveSignalEvent(db, memoryId, 'outcome', Math.max(1, memoryIds.length - index), queryText);
  });
}

describe('shadow-evaluation-runtime', () => {
  let db: Database.Database;
  let shadowFlag: string | undefined;

  beforeEach(() => {
    shadowFlag = process.env.SPECKIT_SHADOW_FEEDBACK;
    process.env.SPECKIT_SHADOW_FEEDBACK = 'true';

    db = new Database(':memory:');
    initConsumptionLog(db);

    vi.mocked(executePipeline).mockReset();
    vi.mocked(buildAdaptiveShadowProposal).mockReset();
    vi.mocked(getAdaptiveMode).mockReset();
    vi.mocked(getAdaptiveMode).mockReturnValue('disabled');
    vi.mocked(tuneAdaptiveThresholdsAfterEvaluation).mockReset();
    stopShadowEvaluationScheduler();
  });

  afterEach(() => {
    stopShadowEvaluationScheduler();
    vi.useRealTimers();
    db.close();

    if (shadowFlag === undefined) {
      delete process.env.SPECKIT_SHADOW_FEEDBACK;
    } else {
      process.env.SPECKIT_SHADOW_FEEDBACK = shadowFlag;
    }
  });

  it('runs a due holdout cycle from recent consumption_log queries', async () => {
    insertSearchEvent(db, 101, 'alpha query', new Date('2026-03-20T10:00:00.000Z').toISOString());
    insertSearchEvent(db, 102, 'beta query', new Date('2026-03-21T10:00:00.000Z').toISOString());
    insertQueryFeedbackLabels(db, 'alpha query', [12, 11]);
    insertQueryFeedbackLabels(db, 'beta query', [22, 21]);

    vi.mocked(executePipeline).mockImplementation(async (config) => {
      const query = config.query;
      const result: ReplayResultShape = query === 'alpha query'
        ? { results: [{ id: 11, score: 0.6 }, { id: 12, score: 0.4 }] }
        : { results: [{ id: 21, score: 0.7 }, { id: 22, score: 0.5 }] };
      return result as unknown as Awaited<ReturnType<typeof executePipeline>>;
    });

    vi.mocked(buildAdaptiveShadowProposal).mockImplementation((_db, query) => {
      if (query === 'alpha query') {
        return {
          mode: 'shadow',
          bounded: true,
          maxDeltaApplied: 0.08,
          query,
          promotedIds: [12],
          demotedIds: [11],
          rows: [
            { memoryId: 12, productionRank: 2, shadowRank: 1, productionScore: 0.4, shadowScore: 0.9, scoreDelta: 0.5 },
            { memoryId: 11, productionRank: 1, shadowRank: 2, productionScore: 0.6, shadowScore: 0.5, scoreDelta: -0.1 },
          ],
        };
      }

      return {
        mode: 'shadow',
        bounded: true,
        maxDeltaApplied: 0.08,
        query,
        promotedIds: [22],
        demotedIds: [21],
        rows: [
          { memoryId: 22, productionRank: 2, shadowRank: 1, productionScore: 0.5, shadowScore: 0.95, scoreDelta: 0.45 },
          { memoryId: 21, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.6, scoreDelta: -0.1 },
        ],
      };
    });

    const report = await runScheduledShadowEvaluationCycle(db, {
      holdoutPercent: 1,
      queryLookbackMs: 14 * 24 * 60 * 60 * 1000,
      maxQueryPoolSize: 10,
      searchLimit: 5,
      seed: 42,
    });

    expect(report).not.toBeNull();
    expect(report?.cycleResult.queryCount).toBe(2);
    expect(report?.comparisons).toHaveLength(2);
    expect(vi.mocked(executePipeline)).toHaveBeenCalledTimes(2);
    expect(getCycleResults(db)).toHaveLength(1);
    expect(getShadowScoringHistory(db).length).toBeGreaterThan(0);
  });

  it('skips replay when a cycle already ran within the evaluation window', async () => {
    insertSearchEvent(db, 201, 'recent query', new Date().toISOString());
    recordCycleResult(db, {
      cycleId: 'recent-cycle',
      evaluatedAt: Date.now() - 60_000,
      queryCount: 1,
      meanNdcgDelta: 0,
      meanMrrDelta: 0,
      meanKendallTau: 0,
      totalImproved: 0,
      totalDegraded: 0,
      totalUnchanged: 1,
      isImprovement: false,
    });

    const report = await runScheduledShadowEvaluationCycle(db, {
      holdoutPercent: 1,
    });

    expect(report).toBeNull();
    expect(vi.mocked(executePipeline)).not.toHaveBeenCalled();
  });

  it('starts and stops the interval scheduler cleanly', async () => {
    vi.useFakeTimers();

    insertSearchEvent(db, 301, 'scheduled query', new Date().toISOString());
    insertQueryFeedbackLabels(db, 'scheduled query', [32, 31]);

    vi.mocked(executePipeline).mockResolvedValue({
      results: [{ id: 31, score: 0.7 }, { id: 32, score: 0.5 }],
    } as unknown as Awaited<ReturnType<typeof executePipeline>>);

    vi.mocked(buildAdaptiveShadowProposal).mockReturnValue({
      mode: 'shadow',
      bounded: true,
      maxDeltaApplied: 0.08,
      query: 'scheduled query',
      promotedIds: [32],
      demotedIds: [31],
      rows: [
        { memoryId: 32, productionRank: 2, shadowRank: 1, productionScore: 0.5, shadowScore: 0.9, scoreDelta: 0.4 },
        { memoryId: 31, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.6, scoreDelta: -0.1 },
      ],
    });

    const intervalMs = EVALUATION_WINDOW_MS + 1_000;
    const started = startShadowEvaluationScheduler(db, {
      intervalMs,
      holdoutPercent: 1,
      queryLookbackMs: 14 * 24 * 60 * 60 * 1000,
    });

    expect(started).toBe(true);
    expect(isShadowEvaluationSchedulerRunning()).toBe(true);

    await vi.advanceTimersByTimeAsync(0);
    const initialCallCount = vi.mocked(executePipeline).mock.calls.length;
    expect(initialCallCount).toBeGreaterThan(0);

    await vi.advanceTimersByTimeAsync(intervalMs + 100);
    expect(vi.mocked(executePipeline)).toHaveBeenCalledTimes(initialCallCount + 1);

    const stopped = stopShadowEvaluationScheduler();
    expect(stopped).toBe(true);
    expect(isShadowEvaluationSchedulerRunning()).toBe(false);
  });

  it('calls tuneAdaptiveThresholdsAfterEvaluation when adaptive ranking enabled and promotionGate exists', async () => {
    insertSearchEvent(db, 401, 'adaptive enabled query', new Date().toISOString());
    insertQueryFeedbackLabels(db, 'adaptive enabled query', [42, 41]);
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
    vi.mocked(getAdaptiveMode).mockReturnValue('shadow');

    vi.mocked(executePipeline).mockResolvedValue({
      results: [{ id: 41, score: 0.7 }, { id: 42, score: 0.5 }],
    } as unknown as Awaited<ReturnType<typeof executePipeline>>);

    vi.mocked(buildAdaptiveShadowProposal).mockReturnValue({
      mode: 'shadow',
      bounded: true,
      maxDeltaApplied: 0.08,
      query: 'adaptive enabled query',
      promotedIds: [42],
      demotedIds: [41],
      rows: [
        { memoryId: 42, productionRank: 2, shadowRank: 1, productionScore: 0.5, shadowScore: 0.9, scoreDelta: 0.4 },
        { memoryId: 41, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.6, scoreDelta: -0.1 },
      ],
    });

    const report = await runScheduledShadowEvaluationCycle(db, {
      holdoutPercent: 1,
      queryLookbackMs: 14 * 24 * 60 * 60 * 1000,
      maxQueryPoolSize: 10,
      searchLimit: 5,
      seed: 42,
    });

    expect(report).not.toBeNull();
    expect(vi.mocked(tuneAdaptiveThresholdsAfterEvaluation)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(tuneAdaptiveThresholdsAfterEvaluation)).toHaveBeenCalledWith(db, report?.promotionGate);
  });

  it('calls tuneAdaptiveThresholdsAfterEvaluation for completed non-ready evaluations', async () => {
    insertSearchEvent(db, 451, 'adaptive wait query', new Date().toISOString());
    insertQueryFeedbackLabels(db, 'adaptive wait query', [52, 51]);
    vi.mocked(getAdaptiveMode).mockReturnValue('shadow');

    vi.mocked(executePipeline).mockResolvedValue({
      results: [{ id: 51, score: 0.7 }, { id: 52, score: 0.5 }],
    } as unknown as Awaited<ReturnType<typeof executePipeline>>);

    vi.mocked(buildAdaptiveShadowProposal).mockReturnValue({
      mode: 'shadow',
      bounded: true,
      maxDeltaApplied: 0.08,
      query: 'adaptive wait query',
      promotedIds: [52],
      demotedIds: [51],
      rows: [
        { memoryId: 52, productionRank: 2, shadowRank: 1, productionScore: 0.5, shadowScore: 0.9, scoreDelta: 0.4 },
        { memoryId: 51, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.6, scoreDelta: -0.1 },
      ],
    });

    const report = await runScheduledShadowEvaluationCycle(db, {
      holdoutPercent: 1,
      queryLookbackMs: 14 * 24 * 60 * 60 * 1000,
      maxQueryPoolSize: 10,
      searchLimit: 5,
      seed: 42,
    });

    expect(report).not.toBeNull();
    expect(report?.promotionGate.ready).toBe(false);
    expect(report?.promotionGate.recommendation).toBe('wait');
    expect(vi.mocked(tuneAdaptiveThresholdsAfterEvaluation)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(tuneAdaptiveThresholdsAfterEvaluation)).toHaveBeenCalledWith(db, report?.promotionGate);
  });

  it('skips tuneAdaptiveThresholdsAfterEvaluation when adaptive ranking disabled', async () => {
    insertSearchEvent(db, 501, 'adaptive disabled query', new Date().toISOString());
    insertQueryFeedbackLabels(db, 'adaptive disabled query', [52, 51]);
    vi.mocked(getAdaptiveMode).mockReturnValue('disabled');

    vi.mocked(executePipeline).mockResolvedValue({
      results: [{ id: 51, score: 0.7 }, { id: 52, score: 0.5 }],
    } as unknown as Awaited<ReturnType<typeof executePipeline>>);

    vi.mocked(buildAdaptiveShadowProposal).mockReturnValue({
      mode: 'shadow',
      bounded: true,
      maxDeltaApplied: 0.08,
      query: 'adaptive disabled query',
      promotedIds: [52],
      demotedIds: [51],
      rows: [
        { memoryId: 52, productionRank: 2, shadowRank: 1, productionScore: 0.5, shadowScore: 0.9, scoreDelta: 0.4 },
        { memoryId: 51, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.6, scoreDelta: -0.1 },
      ],
    });

    const report = await runScheduledShadowEvaluationCycle(db, {
      holdoutPercent: 1,
      queryLookbackMs: 14 * 24 * 60 * 60 * 1000,
      maxQueryPoolSize: 10,
      searchLimit: 5,
      seed: 42,
    });

    expect(report).not.toBeNull();
    expect(vi.mocked(tuneAdaptiveThresholdsAfterEvaluation)).not.toHaveBeenCalled();
  });

  it('handles tuneAdaptiveThresholdsAfterEvaluation errors gracefully when promotionGate exists', async () => {
    insertSearchEvent(db, 601, 'adaptive error query', new Date().toISOString());
    insertQueryFeedbackLabels(db, 'adaptive error query', [62, 61]);
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
    vi.mocked(getAdaptiveMode).mockReturnValue('promoted');
    vi.mocked(tuneAdaptiveThresholdsAfterEvaluation).mockImplementation(() => {
      throw new Error('boom');
    });

    vi.mocked(executePipeline).mockResolvedValue({
      results: [{ id: 61, score: 0.7 }, { id: 62, score: 0.5 }],
    } as unknown as Awaited<ReturnType<typeof executePipeline>>);

    vi.mocked(buildAdaptiveShadowProposal).mockReturnValue({
      mode: 'shadow',
      bounded: true,
      maxDeltaApplied: 0.08,
      query: 'adaptive error query',
      promotedIds: [62],
      demotedIds: [61],
      rows: [
        { memoryId: 62, productionRank: 2, shadowRank: 1, productionScore: 0.5, shadowScore: 0.9, scoreDelta: 0.4 },
        { memoryId: 61, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.6, scoreDelta: -0.1 },
      ],
    });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      const report = await runScheduledShadowEvaluationCycle(db, {
        holdoutPercent: 1,
        queryLookbackMs: 14 * 24 * 60 * 60 * 1000,
        maxQueryPoolSize: 10,
        searchLimit: 5,
        seed: 42,
      });

      expect(report).not.toBeNull();
      expect(vi.mocked(tuneAdaptiveThresholdsAfterEvaluation)).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[shadow-evaluation-runtime] threshold tuning skipped/failed:',
        expect.any(Error),
      );
    } finally {
      consoleWarnSpy.mockRestore();
    }
  });

  it('uses query-scoped feedback signals as relevance labels when available', async () => {
    insertSearchEvent(db, 701, 'feedback query', new Date().toISOString());
    initAdaptiveSignalEvents(db);
    insertAdaptiveSignalEvent(db, 11, 'outcome', 4, 'feedback query');
    insertAdaptiveSignalEvent(db, 11, 'correction', 1, 'feedback query');
    insertAdaptiveSignalEvent(db, 12, 'outcome', 1, 'feedback query');
    insertAdaptiveSignalEvent(db, 12, 'correction', 2, 'feedback query');
    insertAdaptiveSignalEvent(db, 12, 'outcome', 10, 'different query');

    vi.mocked(executePipeline).mockResolvedValue({
      results: [{ id: 11, score: 0.7 }, { id: 12, score: 0.6 }],
    } as unknown as Awaited<ReturnType<typeof executePipeline>>);

    vi.mocked(buildAdaptiveShadowProposal).mockReturnValue({
      mode: 'shadow',
      bounded: true,
      maxDeltaApplied: 0.08,
      query: 'feedback query',
      promotedIds: [12],
      demotedIds: [11],
      rows: [
        { memoryId: 12, productionRank: 2, shadowRank: 1, productionScore: 0.6, shadowScore: 0.9, scoreDelta: 0.3 },
        { memoryId: 11, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.5, scoreDelta: -0.2 },
      ],
    });

    const report = await runScheduledShadowEvaluationCycle(db, {
      holdoutPercent: 1,
      queryLookbackMs: 14 * 24 * 60 * 60 * 1000,
      maxQueryPoolSize: 10,
      searchLimit: 5,
      seed: 42,
    });

    expect(report).not.toBeNull();
    expect(report?.comparisons).toHaveLength(1);
    expect(report?.comparisons[0]?.metrics.ndcgDelta).toBeLessThan(0);
    expect(report?.comparisons[0]?.metrics.mrrDelta).toBe(0);
  });

  it('skips evaluation when no feedback signals exist for a replayed query', async () => {
    insertSearchEvent(db, 801, 'fallback query', new Date().toISOString());
    initAdaptiveSignalEvents(db);

    vi.mocked(executePipeline).mockResolvedValue({
      results: [{ id: 11, score: 0.7 }, { id: 12, score: 0.6 }],
    } as unknown as Awaited<ReturnType<typeof executePipeline>>);

    vi.mocked(buildAdaptiveShadowProposal).mockReturnValue({
      mode: 'shadow',
      bounded: true,
      maxDeltaApplied: 0.08,
      query: 'fallback query',
      promotedIds: [12],
      demotedIds: [11],
      rows: [
        { memoryId: 12, productionRank: 2, shadowRank: 1, productionScore: 0.6, shadowScore: 0.9, scoreDelta: 0.3 },
        { memoryId: 11, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.5, scoreDelta: -0.2 },
      ],
    });

    const report = await runScheduledShadowEvaluationCycle(db, {
      holdoutPercent: 1,
      queryLookbackMs: 14 * 24 * 60 * 60 * 1000,
      maxQueryPoolSize: 10,
      searchLimit: 5,
      seed: 42,
    });

    expect(report).toBeNull();
    expect(getCycleResults(db)).toHaveLength(0);
  });

  it('handles mixed: some memories with feedback, some without', async () => {
    insertSearchEvent(db, 901, 'mixed feedback query', new Date().toISOString());
    initAdaptiveSignalEvents(db);
    insertAdaptiveSignalEvent(db, 11, 'outcome', 5, 'mixed feedback query');

    vi.mocked(executePipeline).mockResolvedValue({
      results: [{ id: 11, score: 0.7 }, { id: 12, score: 0.6 }, { id: 13, score: 0.4 }],
    } as unknown as Awaited<ReturnType<typeof executePipeline>>);

    vi.mocked(buildAdaptiveShadowProposal).mockReturnValue({
      mode: 'shadow',
      bounded: true,
      maxDeltaApplied: 0.08,
      query: 'mixed feedback query',
      promotedIds: [12],
      demotedIds: [11],
      rows: [
        { memoryId: 12, productionRank: 2, shadowRank: 1, productionScore: 0.6, shadowScore: 0.9, scoreDelta: 0.3 },
        { memoryId: 11, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.5, scoreDelta: -0.2 },
        { memoryId: 13, productionRank: 3, shadowRank: 3, productionScore: 0.4, shadowScore: 0.2, scoreDelta: 0 },
      ],
    });

    const report = await runScheduledShadowEvaluationCycle(db, {
      holdoutPercent: 1,
      queryLookbackMs: 14 * 24 * 60 * 60 * 1000,
      maxQueryPoolSize: 10,
      searchLimit: 5,
      seed: 42,
    });

    expect(report).not.toBeNull();
    expect(report?.comparisons).toHaveLength(1);
    expect(report?.comparisons[0]?.metrics.ndcgDelta).toBeLessThan(0);
    expect(report?.comparisons[0]?.metrics.mrrDelta).toBeLessThan(0);
  });

  it('matches replay feedback via metadata.queryText when query column is unavailable', async () => {
    insertSearchEvent(db, 1001, 'metadata fallback query', new Date().toISOString());
    initAdaptiveSignalEvents(db);
    insertAdaptiveSignalEvent(db, 11, 'outcome', 5, null, {
      queryId: 'consumption:1001',
      queryText: 'metadata fallback query',
    });
    insertAdaptiveSignalEvent(db, 12, 'correction', 2, null, {
      queryId: 'consumption:1001',
      queryText: 'metadata fallback query',
    });

    vi.mocked(executePipeline).mockResolvedValue({
      results: [{ id: 11, score: 0.7 }, { id: 12, score: 0.6 }],
    } as unknown as Awaited<ReturnType<typeof executePipeline>>);

    vi.mocked(buildAdaptiveShadowProposal).mockReturnValue({
      mode: 'shadow',
      bounded: true,
      maxDeltaApplied: 0.08,
      query: 'metadata fallback query',
      promotedIds: [12],
      demotedIds: [11],
      rows: [
        { memoryId: 12, productionRank: 2, shadowRank: 1, productionScore: 0.6, shadowScore: 0.9, scoreDelta: 0.3 },
        { memoryId: 11, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.5, scoreDelta: -0.2 },
      ],
    });

    const report = await runScheduledShadowEvaluationCycle(db, {
      holdoutPercent: 1,
      queryLookbackMs: 14 * 24 * 60 * 60 * 1000,
      maxQueryPoolSize: 10,
      searchLimit: 5,
      seed: 42,
    });

    expect(report).not.toBeNull();
    expect(report?.comparisons).toHaveLength(1);
  });
});
