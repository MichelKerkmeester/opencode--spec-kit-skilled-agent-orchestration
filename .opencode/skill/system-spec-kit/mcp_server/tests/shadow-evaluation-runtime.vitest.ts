// ───────────────────────────────────────────────────────────────
// MODULE: Shadow Evaluation Runtime Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';
import {
  getCycleResults,
  getShadowScoringHistory,
  recordCycleResult,
} from '../lib/feedback/shadow-scoring';
import { initConsumptionLog } from '../lib/telemetry/consumption-logger';
import {
  isShadowEvaluationSchedulerRunning,
  runScheduledShadowEvaluationCycle,
  startShadowEvaluationScheduler,
  stopShadowEvaluationScheduler,
} from '../lib/feedback/shadow-evaluation-runtime';
import { executePipeline } from '../lib/search/pipeline';
import { buildAdaptiveShadowProposal } from '../lib/cognitive/adaptive-ranking';

vi.mock('../core', () => ({
  isEmbeddingModelReady: vi.fn(() => true),
  waitForEmbeddingModel: vi.fn(async () => true),
  checkDatabaseUpdated: vi.fn(async () => undefined),
}));

vi.mock('../lib/search/pipeline', () => ({
  executePipeline: vi.fn(),
}));

vi.mock('../lib/cognitive/adaptive-ranking', () => ({
  buildAdaptiveShadowProposal: vi.fn(),
}));

vi.mock('../lib/search/session-boost', () => ({
  isEnabled: vi.fn(() => false),
}));

vi.mock('../lib/search/causal-boost', () => ({
  isEnabled: vi.fn(() => false),
}));

interface ReplayResultShape {
  results: Array<{ id: number; score: number }>;
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

    const started = startShadowEvaluationScheduler(db, {
      intervalMs: 1_000,
      holdoutPercent: 1,
      queryLookbackMs: 14 * 24 * 60 * 60 * 1000,
    });

    expect(started).toBe(true);
    expect(isShadowEvaluationSchedulerRunning()).toBe(true);

    await vi.advanceTimersByTimeAsync(1_100);
    expect(vi.mocked(executePipeline)).toHaveBeenCalled();

    const stopped = stopShadowEvaluationScheduler();
    expect(stopped).toBe(true);
    expect(isShadowEvaluationSchedulerRunning()).toBe(false);
  });
});
