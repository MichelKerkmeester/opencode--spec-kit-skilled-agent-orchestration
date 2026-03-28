// ───────────────────────────────────────────────────────────────
// 1. TEST — ABLATION FRAMEWORK
// ───────────────────────────────────────────────────────────────
//
// Unit and integration tests for the ablation study framework.
// Verifies feature flag gating, channel-to-flag mapping, ablation runner
// With dependency-injected mock search functions, report formatting,
// And DB persistence of ablation results.
//
// Acceptance criterion: ablation run shows per-channel Recall@20 delta
// And can isolate the contribution of at least 1 individual channel.

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import Database from 'better-sqlite3';

import {
  isAblationEnabled,
  inspectGroundTruthAlignment,
  assertGroundTruthAlignment,
  runAblation,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  ALL_CHANNELS,
} from '../lib/eval/ablation-framework';
import type {
  AblationChannel,
  AblationSearchFn,
  AblationConfig,
  AblationReport,
  AblationResult,
  AblationMetrics,
  AblationMetricEntry,
} from '../lib/eval/ablation-framework';
import type { EvalResult } from '../lib/eval/eval-metrics';
import { initEvalDb, closeEvalDb, getEvalDb } from '../lib/eval/eval-db';

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Create a mock search function that returns different results
 * depending on which channels are disabled.
 *
 * When all channels active (baseline): returns memoryIds 1..count (high quality).
 * When a channel is disabled: drops some results to simulate quality degradation.
 *
 * @param relevantIds - The set of memory IDs that are "relevant" in ground truth.
 * @param channelContributions - Map of channel name to the IDs that channel uniquely provides.
 */
function createMockSearchFn(
  relevantIds: number[],
  channelContributions: Map<AblationChannel, number[]>,
): AblationSearchFn {
  return (query: string, disabledChannels: Set<AblationChannel>): EvalResult[] => {
    // Start with all relevant IDs as results
    let resultIds = [...relevantIds];

    // When a channel is disabled, remove the IDs it contributes
    for (const [channel, ids] of channelContributions) {
      if (disabledChannels.has(channel)) {
        const removeSet = new Set(ids);
        resultIds = resultIds.filter(id => !removeSet.has(id));
      }
    }

    // Return as EvalResult[] with descending scores
    return resultIds.map((memoryId, idx) => ({
      memoryId,
      score: 1.0 - idx * 0.01,
      rank: idx + 1,
    }));
  };
}

/**
 * Build mock AblationMetrics for testing multi-metric report/storage.
 */
function buildMockMetrics(recallDelta: number): AblationMetrics {
  function entry(b: number, delta: number): AblationMetricEntry {
    return { baseline: b, ablated: b + delta, delta };
  }
  return {
    'MRR@5': entry(0.65, recallDelta * 0.8),
    'precision@5': entry(0.5, recallDelta * 0.7),
    'recall@5': entry(0.6, recallDelta),
    'NDCG@5': entry(0.7, recallDelta * 0.9),
    'MAP': entry(0.55, recallDelta * 0.6),
    'hit_rate': entry(0.9, recallDelta * 0.3),
    'latency_p50': entry(12, 0.5),
    'latency_p95': entry(25, 1.2),
    'token_usage': entry(0, 0),
  };
}

/**
 * Build a minimal AblationReport for testing formatAblationReport and storeAblationResults.
 */
function buildMockReport(overrides: Partial<AblationReport> = {}): AblationReport {
  const defaultResults: AblationResult[] = [
    {
      channel: 'vector',
      baselineRecall20: 0.8,
      ablatedRecall20: 0.5,
      delta: -0.3,
      pValue: 0.01,
      queriesChannelHelped: 8,
      queriesChannelHurt: 1,
      queriesUnchanged: 1,
      queryCount: 10,
      metrics: buildMockMetrics(-0.3),
    },
    {
      channel: 'bm25',
      baselineRecall20: 0.8,
      ablatedRecall20: 0.75,
      delta: -0.05,
      pValue: 0.12,
      queriesChannelHelped: 4,
      queriesChannelHurt: 2,
      queriesUnchanged: 4,
      queryCount: 10,
      metrics: buildMockMetrics(-0.05),
    },
    {
      channel: 'fts5',
      baselineRecall20: 0.8,
      ablatedRecall20: 0.82,
      delta: 0.02,
      pValue: 0.45,
      queriesChannelHelped: 2,
      queriesChannelHurt: 3,
      queriesUnchanged: 5,
      queryCount: 10,
      metrics: buildMockMetrics(0.02),
    },
  ];

  return {
    timestamp: '2026-02-28T12:00:00.000Z',
    runId: 'ablation-test-1234',
    config: { channels: ['vector', 'bm25', 'fts5'] as AblationChannel[] },
    results: defaultResults,
    overallBaselineRecall: 0.8,
    queryCount: 10,
    durationMs: 500,
    ...overrides,
  };
}

/** Saved env state for clean restoration. */
let savedAblationEnv: string | undefined;

// ═══════════════════════════════════════════════════════════════════
// UNIT TESTS
// ═══════════════════════════════════════════════════════════════════

describe('Ablation Framework (R13-S3)', () => {

  beforeEach(() => {
    savedAblationEnv = process.env.SPECKIT_ABLATION;
  });

  afterEach(() => {
    // Restore env var to pre-test state
    if (savedAblationEnv !== undefined) {
      process.env.SPECKIT_ABLATION = savedAblationEnv;
    } else {
      delete process.env.SPECKIT_ABLATION;
    }
  });

  // 1. isAblationEnabled() — feature flag gating
  describe('isAblationEnabled()', () => {
    it('returns false when SPECKIT_ABLATION is not set', () => {
      delete process.env.SPECKIT_ABLATION;
      expect(isAblationEnabled()).toBe(false);
    });

    it('returns true when SPECKIT_ABLATION=true', () => {
      process.env.SPECKIT_ABLATION = 'true';
      expect(isAblationEnabled()).toBe(true);
    });

    it('returns true when SPECKIT_ABLATION=TRUE (case-insensitive)', () => {
      process.env.SPECKIT_ABLATION = 'TRUE';
      expect(isAblationEnabled()).toBe(true);
    });

    it('returns true when SPECKIT_ABLATION=True (mixed case)', () => {
      process.env.SPECKIT_ABLATION = 'True';
      expect(isAblationEnabled()).toBe(true);
    });

    it('returns false when SPECKIT_ABLATION=false', () => {
      process.env.SPECKIT_ABLATION = 'false';
      expect(isAblationEnabled()).toBe(false);
    });

    it('returns false when SPECKIT_ABLATION=1', () => {
      process.env.SPECKIT_ABLATION = '1';
      expect(isAblationEnabled()).toBe(false);
    });

    it('returns false when SPECKIT_ABLATION is empty string', () => {
      process.env.SPECKIT_ABLATION = '';
      expect(isAblationEnabled()).toBe(false);
    });
  });

  // 2. ALL_CHANNELS constant
  describe('ALL_CHANNELS', () => {
    it('contains exactly 5 known channels', () => {
      expect(ALL_CHANNELS).toHaveLength(5);
    });

    it('contains vector, bm25, fts5, graph, trigger', () => {
      expect(ALL_CHANNELS).toContain('vector');
      expect(ALL_CHANNELS).toContain('bm25');
      expect(ALL_CHANNELS).toContain('fts5');
      expect(ALL_CHANNELS).toContain('graph');
      expect(ALL_CHANNELS).toContain('trigger');
    });
  });

  describe('ground truth alignment preflight', () => {
    let alignmentDb: Database.Database | null = null;
    let alignmentDbPath = '';

    afterEach(() => {
      if (alignmentDb) {
        try { alignmentDb.close(); } catch { /* ignore */ }
      }
      alignmentDb = null;

      if (alignmentDbPath && fs.existsSync(alignmentDbPath)) {
        try { fs.unlinkSync(alignmentDbPath); } catch { /* ignore */ }
      }
      alignmentDbPath = '';
    });

    async function createAlignmentDb(overrides: {
      chunkIds?: number[];
      omitIds?: number[];
    } = {}): Promise<Database.Database> {
      const { GROUND_TRUTH_RELEVANCES } = await import('../lib/eval/ground-truth-data');
      const uniqueIds = Array.from(
        new Set(GROUND_TRUTH_RELEVANCES.map((row) => row.memoryId)),
      ).sort((left, right) => left - right);

      alignmentDbPath = path.join(os.tmpdir(), `ablation-alignment-${Date.now()}-${Math.random()}.sqlite`);
      alignmentDb = new Database(alignmentDbPath);
      alignmentDb.exec(`
        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          parent_id INTEGER
        );
      `);

      const chunkIdSet = new Set(overrides.chunkIds ?? []);
      const omitIdSet = new Set(overrides.omitIds ?? []);
      const insert = alignmentDb.prepare('INSERT INTO memory_index (id, parent_id) VALUES (?, ?)');

      for (const id of uniqueIds) {
        if (omitIdSet.has(id)) continue;
        insert.run(id, chunkIdSet.has(id) ? 999999 : null);
      }

      return alignmentDb;
    }

    it('passes when all ground-truth IDs resolve to parent rows', async () => {
      const db = await createAlignmentDb();
      const summary = inspectGroundTruthAlignment(db);

      expect(summary.totalRelevances).toBeGreaterThan(0);
      expect(summary.chunkRelevanceCount).toBe(0);
      expect(summary.missingRelevanceCount).toBe(0);
      expect(assertGroundTruthAlignment(db)).toEqual(summary);
    });

    it('throws when ground truth includes chunk-backed or missing IDs for the active DB', async () => {
      const { GROUND_TRUTH_RELEVANCES } = await import('../lib/eval/ground-truth-data');
      const uniqueIds = Array.from(new Set(GROUND_TRUTH_RELEVANCES.map((row) => row.memoryId)));
      const [chunkId, missingId] = uniqueIds;
      expect(chunkId).toBeDefined();
      expect(missingId).toBeDefined();
      const db = await createAlignmentDb({
        chunkIds: [chunkId!],
        omitIds: [missingId!],
      });

      const summary = inspectGroundTruthAlignment(db);
      expect(summary.chunkRelevanceCount).toBeGreaterThan(0);
      expect(summary.missingRelevanceCount).toBeGreaterThan(0);

      expect(() => assertGroundTruthAlignment(db, {
        dbPath: '/tmp/test-context-index.sqlite',
        context: 'unit-test',
      })).toThrow(/chunk-backed relevances=.*missing relevances=/i);
    });
  });

  // 3. toHybridSearchFlags()
  describe('toHybridSearchFlags()', () => {
    it('returns all true when no channels are disabled', () => {
      const flags = toHybridSearchFlags(new Set());
      expect(flags).toEqual({
        useVector: true,
        useBm25: true,
        useFts: true,
        useGraph: true,
        useTrigger: true,
      });
    });

    it('disables vector channel correctly', () => {
      const flags = toHybridSearchFlags(new Set<AblationChannel>(['vector']));
      expect(flags.useVector).toBe(false);
      expect(flags.useBm25).toBe(true);
      expect(flags.useFts).toBe(true);
      expect(flags.useGraph).toBe(true);
    });

    it('disables bm25 channel correctly', () => {
      const flags = toHybridSearchFlags(new Set<AblationChannel>(['bm25']));
      expect(flags.useVector).toBe(true);
      expect(flags.useBm25).toBe(false);
      expect(flags.useFts).toBe(true);
      expect(flags.useGraph).toBe(true);
    });

    it('disables fts5 channel correctly (maps to useFts)', () => {
      const flags = toHybridSearchFlags(new Set<AblationChannel>(['fts5']));
      expect(flags.useVector).toBe(true);
      expect(flags.useBm25).toBe(true);
      expect(flags.useFts).toBe(false);
      expect(flags.useGraph).toBe(true);
    });

    it('disables graph channel correctly', () => {
      const flags = toHybridSearchFlags(new Set<AblationChannel>(['graph']));
      expect(flags.useVector).toBe(true);
      expect(flags.useBm25).toBe(true);
      expect(flags.useFts).toBe(true);
      expect(flags.useGraph).toBe(false);
    });

    it('disables multiple channels simultaneously', () => {
      const flags = toHybridSearchFlags(new Set<AblationChannel>(['vector', 'graph']));
      expect(flags.useVector).toBe(false);
      expect(flags.useBm25).toBe(true);
      expect(flags.useFts).toBe(true);
      expect(flags.useGraph).toBe(false);
    });

    it('disables trigger channel correctly', () => {
      const flags = toHybridSearchFlags(new Set<AblationChannel>(['trigger']));
      expect(flags).toEqual({
        useVector: true,
        useBm25: true,
        useFts: true,
        useGraph: true,
        useTrigger: false,
      });
    });

    it('disabling all channels returns all false', () => {
      const flags = toHybridSearchFlags(
        new Set<AblationChannel>(['vector', 'bm25', 'fts5', 'graph', 'trigger']),
      );
      expect(flags).toEqual({
        useVector: false,
        useBm25: false,
        useFts: false,
        useGraph: false,
        useTrigger: false,
      });
    });
  });

  // 4. runAblation() — returns null when disabled
  describe('runAblation() — gating', () => {
    it('returns null when SPECKIT_ABLATION is not set', async () => {
      delete process.env.SPECKIT_ABLATION;
      const mockFn: AblationSearchFn = () => [];
      const result = await runAblation(mockFn);
      expect(result).toBeNull();
    });

    it('returns null when SPECKIT_ABLATION=false', async () => {
      process.env.SPECKIT_ABLATION = 'false';
      const mockFn: AblationSearchFn = () => [];
      const result = await runAblation(mockFn);
      expect(result).toBeNull();
    });
  });

  // 5. runAblation() — computes correct baseline and ablated recalls
  describe('runAblation() — computation', () => {
    beforeEach(() => {
      process.env.SPECKIT_ABLATION = 'true';
    });

    it('enforces ground-truth alignment before running ablation iterations when an alignment DB is provided', async () => {
      const { GROUND_TRUTH_QUERIES, GROUND_TRUTH_RELEVANCES } = await import(
        '../lib/eval/ground-truth-data'
      );
      const queryWithGT = GROUND_TRUTH_QUERIES.find(q =>
        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
      );
      expect(queryWithGT).toBeDefined();

      const relevantIds = GROUND_TRUTH_RELEVANCES
        .filter(r => r.queryId === queryWithGT!.id && r.relevance > 0)
        .map(r => r.memoryId);
      expect(relevantIds.length).toBeGreaterThan(1);

      const alignmentDb = new Database(':memory:');
      alignmentDb.exec(`
        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          parent_id INTEGER
        );
      `);
      alignmentDb.prepare('INSERT INTO memory_index (id, parent_id) VALUES (?, ?)').run(relevantIds[0], null);
      alignmentDb.prepare('INSERT INTO memory_index (id, parent_id) VALUES (?, ?)').run(relevantIds[1], 999999);

      const searchSpy = vi.fn<AblationSearchFn>(() => []);
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const report = await runAblation(searchSpy, {
        channels: ['vector'],
        groundTruthQueryIds: [queryWithGT!.id],
        alignmentDb,
        alignmentDbPath: '/tmp/test-context-index.sqlite',
        alignmentContext: 'unit-test',
      });

      expect(report).toBeNull();
      expect(searchSpy).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ablation] runAblation failed'),
        expect.stringContaining('Ground truth is not aligned to parent memories'),
      );

      warnSpy.mockRestore();
      alignmentDb.close();
    });

    it('computes baseline and ablated recalls with mock search', async () => {
      // Mock the ground truth data module so we control exactly which queries/relevances exist
      // We use vi.mock to replace the ground truth imports used inside ablation-framework.ts
      const { GROUND_TRUTH_QUERIES, GROUND_TRUTH_RELEVANCES } = await import(
        '../lib/eval/ground-truth-data'
      );

      expect(GROUND_TRUTH_QUERIES.length).toBeGreaterThan(0);

      // Pick the first query that has relevance entries
      const queryWithGT = GROUND_TRUTH_QUERIES.find(q =>
        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id),
      );

      expect(queryWithGT).toBeDefined();

      // Get relevant memory IDs for this query
      const relevances = GROUND_TRUTH_RELEVANCES.filter(
        r => r.queryId === queryWithGT!.id && r.relevance > 0,
      );
      const relevantIds = relevances.map(r => r.memoryId);

      // Set up channel contributions: vector provides first half, bm25 provides second half
      const mid = Math.ceil(relevantIds.length / 2);
      const channelContributions = new Map<AblationChannel, number[]>([
        ['vector', relevantIds.slice(0, mid)],
        ['bm25', relevantIds.slice(mid)],
      ]);

      const mockSearchFn = createMockSearchFn(relevantIds, channelContributions);

      const config: AblationConfig = {
        channels: ['vector', 'bm25'],
        groundTruthQueryIds: [queryWithGT!.id],
        recallK: 20,
      };

      const report = await runAblation(mockSearchFn, config);

      expect(report).not.toBeNull();
      if (!report) return; // TypeScript narrowing

      // Verify report structure
      expect(report.runId).toMatch(/^ablation-/);
      expect(report.timestamp).toBeTruthy();
      expect(report.config).toEqual(config);
      expect(report.results).toHaveLength(2);
      expect(report.durationMs).toBeGreaterThanOrEqual(0);

      // Baseline should be 1.0 (all relevant IDs returned when no channel disabled)
      expect(report.overallBaselineRecall).toBeCloseTo(1.0, 2);

      // Each ablated channel should show reduced recall (delta < 0)
      for (const result of report.results) {
        expect(result.baselineRecall20).toBeCloseTo(1.0, 2);
        expect(result.ablatedRecall20).toBeLessThan(1.0);
        expect(result.delta).toBeLessThan(0);
        expect(result.queryCount).toBe(1);
        expect(result.queriesChannelHelped).toBeGreaterThanOrEqual(0);
      }
    });

    it('handles async search function', async () => {
      const { GROUND_TRUTH_QUERIES, GROUND_TRUTH_RELEVANCES } = await import(
        '../lib/eval/ground-truth-data'
      );

      const queryWithGT = GROUND_TRUTH_QUERIES.find(q =>
        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id),
      );

      expect(queryWithGT).toBeDefined();

      const relevances = GROUND_TRUTH_RELEVANCES.filter(
        r => r.queryId === queryWithGT!.id && r.relevance > 0,
      );
      const relevantIds = relevances.map(r => r.memoryId);

      // Async search function
      const asyncSearchFn: AblationSearchFn = async (
        query: string,
        disabled: Set<AblationChannel>,
      ) => {
        await new Promise(resolve => setTimeout(resolve, 1));
        return relevantIds.map((id, idx) => ({
          memoryId: id,
          score: 1.0 - idx * 0.01,
          rank: idx + 1,
        }));
      };

      const config: AblationConfig = {
        channels: ['vector'],
        groundTruthQueryIds: [queryWithGT!.id],
      };

      const report = await runAblation(asyncSearchFn, config);
      expect(report).not.toBeNull();
      expect(report!.results).toHaveLength(1);
    });

    it('continues when one channel ablation fails and returns partial results', async () => {
      const { GROUND_TRUTH_QUERIES, GROUND_TRUTH_RELEVANCES } = await import(
        '../lib/eval/ground-truth-data'
      );

      const queryWithGT = GROUND_TRUTH_QUERIES.find(q =>
        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
      );

      expect(queryWithGT).toBeDefined();

      const relevances = GROUND_TRUTH_RELEVANCES.filter(
        r => r.queryId === queryWithGT!.id && r.relevance > 0,
      );
      const relevantIds = relevances.map(r => r.memoryId);
      if (relevantIds.length === 0) return;

      const conditionalFailSearchFn: AblationSearchFn = (
        query: string,
        disabledChannels: Set<AblationChannel>,
      ) => {
        if (disabledChannels.has('vector')) {
          throw new Error('vector channel outage');
        }
        return relevantIds.map((id, idx) => ({
          memoryId: id,
          score: 1.0 - idx * 0.01,
          rank: idx + 1,
        }));
      };

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const report = await runAblation(conditionalFailSearchFn, {
        channels: ['vector', 'bm25'],
        groundTruthQueryIds: [queryWithGT!.id],
      });

      expect(report).not.toBeNull();
      if (!report) {
        warnSpy.mockRestore();
        return;
      }

      // Vector fails, bm25 still succeeds (partial report)
      expect(report.results).toHaveLength(1);
      expect(report.results[0].channel).toBe('bm25');
      expect(report.channelFailures).toHaveLength(1);
      expect(report.channelFailures![0]).toMatchObject({
        channel: 'vector',
        error: 'vector channel outage',
        queryId: queryWithGT!.id,
      });
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ablation] Channel "vector" failed'),
        expect.stringContaining('vector channel outage'),
      );

      warnSpy.mockRestore();
    });

    it('retains baseline queryCount and records all channel failures when every ablation fails', async () => {
      const { GROUND_TRUTH_QUERIES, GROUND_TRUTH_RELEVANCES } = await import(
        '../lib/eval/ground-truth-data'
      );

      const queryWithGT = GROUND_TRUTH_QUERIES.find(q =>
        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
      );

      expect(queryWithGT).toBeDefined();

      const relevances = GROUND_TRUTH_RELEVANCES.filter(
        r => r.queryId === queryWithGT!.id && r.relevance > 0,
      );
      const relevantIds = relevances.map(r => r.memoryId);
      if (relevantIds.length === 0) return;

      const allFailAblationSearchFn: AblationSearchFn = (
        query: string,
        disabledChannels: Set<AblationChannel>,
      ) => {
        if (disabledChannels.size > 0) {
          const [disabledChannel] = [...disabledChannels];
          throw new Error(`${disabledChannel} ablation failed`);
        }

        return relevantIds.map((id, idx) => ({
          memoryId: id,
          score: 1.0 - idx * 0.01,
          rank: idx + 1,
        }));
      };

      const channels: AblationChannel[] = ['vector', 'bm25', 'fts5'];
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const report = await runAblation(allFailAblationSearchFn, {
        channels,
        groundTruthQueryIds: [queryWithGT!.id],
        recallK: 20,
      });

      expect(report).not.toBeNull();
      if (!report) {
        warnSpy.mockRestore();
        return;
      }

      expect(report.overallBaselineRecall).toBeCloseTo(1.0, 2);
      expect(report.queryCount).toBe(1);
      expect(report.results).toHaveLength(0);
      expect(report.channelFailures).toHaveLength(channels.length);

      const failedChannels = report.channelFailures!.map(f => f.channel).sort();
      expect(failedChannels).toEqual([...channels].sort());

      for (const failure of report.channelFailures!) {
        expect(failure.queryId).toBe(queryWithGT!.id);
        expect(failure.query).toBe(queryWithGT!.query);
        expect(failure.error).toContain('ablation failed');
      }

      warnSpy.mockRestore();
    });

    it('returns null gracefully on search function error', async () => {
      const throwingFn: AblationSearchFn = () => {
        throw new Error('Search failed!');
      };

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const report = await runAblation(throwingFn);

      expect(report).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ablation] runAblation failed'),
        expect.any(String),
      );

      warnSpy.mockRestore();
    });
  });

  // 6. formatAblationReport()
  describe('formatAblationReport()', () => {
    it('produces valid markdown with table headers', () => {
      const report = buildMockReport();
      const md = formatAblationReport(report);

      expect(md).toContain('## Ablation Study Report');
      expect(md).toContain('| Channel |');
      expect(md).toContain('| Baseline |');
      expect(md).toContain('| Verdict |');
      expect(md).toContain('|---------|');
    });

    it('includes run metadata in the report', () => {
      const report = buildMockReport();
      const md = formatAblationReport(report);

      expect(md).toContain(`**Run ID:** ${report.runId}`);
      expect(md).toContain(`**Timestamp:** ${report.timestamp}`);
      expect(md).toContain(`**Baseline Recall@20:** 0.8000`);
      expect(md).toContain(`**Duration:** 500ms`);
    });

    it('includes all channels in the table', () => {
      const report = buildMockReport();
      const md = formatAblationReport(report);

      expect(md).toContain('| vector ');
      expect(md).toContain('| bm25 ');
      expect(md).toContain('| fts5 ');
    });

    it('sorts channels by absolute delta descending (most impactful first)', () => {
      const report = buildMockReport();
      const md = formatAblationReport(report);
      const lines = md.split('\n');

      // Find the recall-delta table data rows (first table only — between first header and first blank line after it)
      const headerIdx = lines.findIndex(l => l.startsWith('| Channel | Baseline'));
      const dataRows: string[] = [];
      for (let i = headerIdx + 2; i < lines.length; i++) {
        if (!lines[i].startsWith('| ')) break;
        dataRows.push(lines[i]);
      }

      // Vector (|delta|=0.3) should come before bm25 (|delta|=0.05) before fts5 (|delta|=0.02)
      expect(dataRows.length).toBe(3);
      expect(dataRows[0]).toContain('vector');
      expect(dataRows[1]).toContain('bm25');
      expect(dataRows[2]).toContain('fts5');
    });

    it('marks significant results with asterisk', () => {
      const report = buildMockReport();
      const md = formatAblationReport(report);

      // Vector has p=0.01 (< 0.05) so its delta should have an asterisk
      const vectorLine = md.split('\n').find(l => l.includes('| vector'));
      expect(vectorLine).toBeDefined();
      expect(vectorLine).toContain('*');
    });

    it('shows correct delta sign (negative for contributing channels)', () => {
      const report = buildMockReport();
      const md = formatAblationReport(report);

      // Vector delta is -0.3 (no + prefix)
      expect(md).toContain('-0.3000');

      // Fts5 delta is +0.02 (has + prefix)
      expect(md).toContain('+0.0200');
    });

    it('includes verdict column with correct verdicts', () => {
      const report = buildMockReport();
      const md = formatAblationReport(report);

      // Vector: delta=-0.3, p=0.01, significant, |delta|>=0.05 => CRITICAL
      const vectorLine = md.split('\n').find(l => l.includes('| vector'));
      expect(vectorLine).toContain('CRITICAL');

      // Fts5: delta=+0.02, p=0.45, not significant => likely redundant
      const fts5Line = md.split('\n').find(l => l.includes('| fts5'));
      expect(fts5Line).toContain('likely redundant');
    });

    it('includes channel contribution ranking section', () => {
      const report = buildMockReport();
      const md = formatAblationReport(report);

      expect(md).toContain('### Channel Contribution Ranking');
      expect(md).toContain('**vector**');
      expect(md).toContain('**bm25**');
      expect(md).toContain('**fts5**');
    });

    it('includes legend text', () => {
      const report = buildMockReport();
      const md = formatAblationReport(report);

      expect(md).toContain('**Legend:**');
      expect(md).toContain('Negative delta = channel contributes positively');
    });

    it('handles report with empty results array', () => {
      const report = buildMockReport({ results: [] });
      const md = formatAblationReport(report);

      // Should still produce valid markdown, just no data rows
      expect(md).toContain('## Ablation Study Report');
      expect(md).toContain('| Channel |');
    });

    it('shows n/a for null p-values', () => {
      const report = buildMockReport({
        results: [
          {
            channel: 'vector',
            baselineRecall20: 0.8,
            ablatedRecall20: 0.6,
            delta: -0.2,
            pValue: null, // insufficient data
            queriesChannelHelped: 2,
            queriesChannelHurt: 1,
            queriesUnchanged: 0,
            queryCount: 3,
          },
        ],
      });
      const md = formatAblationReport(report);
      expect(md).toContain('n/a');
    });

    it('includes channel failure details when present', () => {
      const report = buildMockReport({
        channelFailures: [
          {
            channel: 'graph',
            error: 'Graph timeout',
            queryId: 42,
          },
        ],
      });

      const md = formatAblationReport(report);
      expect(md).toContain('### Channel Failures');
      expect(md).toContain('`graph` (queryId=42): Graph timeout');
    });
  });

  // 7. storeAblationResults() — gating
  describe('storeAblationResults() — gating', () => {
    it('returns false when SPECKIT_ABLATION is not set', () => {
      delete process.env.SPECKIT_ABLATION;
      const report = buildMockReport();
      expect(storeAblationResults(report)).toBe(false);
    });

    it('returns false when SPECKIT_ABLATION=false', () => {
      process.env.SPECKIT_ABLATION = 'false';
      const report = buildMockReport();
      expect(storeAblationResults(report)).toBe(false);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════
// INTEGRATION TESTS — DB persistence
// ═══════════════════════════════════════════════════════════════════

describe('Ablation Framework — DB Integration (R13-S3)', () => {
  let testDataDir: string;
  let savedEnv: string | undefined;

  beforeAll(() => {
    savedEnv = process.env.SPECKIT_ABLATION;
    process.env.SPECKIT_ABLATION = 'true';

    // Use a temporary directory for test isolation
    testDataDir = path.join(os.tmpdir(), `ablation-test-${Date.now()}`);
    fs.mkdirSync(testDataDir, { recursive: true });

    // Initialize the eval DB in the test directory
    initEvalDb(testDataDir);
  });

  afterAll(() => {
    // Close DB singleton before cleanup
    closeEvalDb();

    // Restore env var
    if (savedEnv !== undefined) {
      process.env.SPECKIT_ABLATION = savedEnv;
    } else {
      delete process.env.SPECKIT_ABLATION;
    }

    // Remove test directory
    if (testDataDir && fs.existsSync(testDataDir)) {
      try {
        fs.rmSync(testDataDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  it('storeAblationResults() writes to eval_metric_snapshots table', () => {
    const report = buildMockReport();
    const success = storeAblationResults(report);

    expect(success).toBe(true);

    // Verify rows were inserted
    const db = getEvalDb();
    const rows = db.prepare(
      `SELECT * FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%' ORDER BY id`,
    ).all() as Array<{
      metric_name: string;
      metric_value: number;
      channel: string;
      query_count: number;
      metadata: string;
    }>;

    // Token usage rows are skipped until real measurements exist.
    // 1 baseline + 3 channels * (1 recall_delta + 8 metric deltas) = 28 total
    expect(rows.length).toBe(28);

    // First row should be the baseline
    const baselineRow = rows.find(r => r.metric_name === 'ablation_baseline_recall@20');
    expect(baselineRow).toBeDefined();
    expect(baselineRow!.channel).toBe('all');
    expect(baselineRow!.metric_value).toBeCloseTo(0.8);

    // Delta rows
    const deltaRows = rows.filter(r => r.metric_name === 'ablation_recall@20_delta');
    expect(deltaRows).toHaveLength(3);

    // Verify each channel's delta was stored
    const channels = deltaRows.map(r => r.channel);
    expect(channels).toContain('vector');
    expect(channels).toContain('bm25');
    expect(channels).toContain('fts5');

    // Verify vector channel delta value
    const vectorRow = deltaRows.find(r => r.channel === 'vector');
    expect(vectorRow).toBeDefined();
    expect(vectorRow!.metric_value).toBeCloseTo(-0.3);

    // Verify metadata is valid JSON
    const meta = JSON.parse(vectorRow!.metadata);
    expect(meta.runId).toBe('ablation-test-1234');
    expect(meta.baselineRecall20).toBeCloseTo(0.8);
    expect(meta.ablatedRecall20).toBeCloseTo(0.5);
    expect(meta.pValue).toBeCloseTo(0.01);
  });

  it('storeAblationResults() uses negative timestamp as eval_run_id', () => {
    // Clear previous data
    const db = getEvalDb();
    db.exec(`DELETE FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%'`);

    const report = buildMockReport({ timestamp: '2026-02-28T12:00:00.000Z' });
    storeAblationResults(report);

    const row = db.prepare(
      `SELECT eval_run_id FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%' LIMIT 1`,
    ).get() as { eval_run_id: number } | undefined;

    expect(row).toBeDefined();
    expect(row!.eval_run_id).toBeLessThan(0); // Negative timestamp convention
  });

  it('storeAblationResults() persists baseline query_count when all channel runs failed', () => {
    const db = getEvalDb();
    db.exec(`DELETE FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%'`);

    const report = buildMockReport({
      results: [],
      queryCount: 4,
      channelFailures: [
        { channel: 'vector', error: 'vector outage', queryId: 1, query: 'q1' },
        { channel: 'bm25', error: 'bm25 outage', queryId: 1, query: 'q1' },
      ],
    });

    const success = storeAblationResults(report);
    expect(success).toBe(true);

    const baseline = db.prepare(
      `SELECT query_count, metadata
       FROM eval_metric_snapshots
       WHERE metric_name = 'ablation_baseline_recall@20'
       ORDER BY id DESC
       LIMIT 1`,
    ).get() as { query_count: number; metadata: string } | undefined;

    expect(baseline).toBeDefined();
    expect(baseline!.query_count).toBe(4);

    const metadata = JSON.parse(baseline!.metadata);
    expect(metadata.channelFailures).toHaveLength(2);
  });

  it('storeAblationResults() prefers evaluatedQueryCount for baseline query_count', () => {
    const db = getEvalDb();
    db.exec(`DELETE FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%'`);

    const report = buildMockReport({
      queryCount: 10,
      evaluatedQueryCount: 4,
    });

    const success = storeAblationResults(report);
    expect(success).toBe(true);

    const baseline = db.prepare(
      `SELECT query_count, metadata
       FROM eval_metric_snapshots
       WHERE metric_name = 'ablation_baseline_recall@20'
       ORDER BY id DESC
       LIMIT 1`,
    ).get() as { query_count: number; metadata: string } | undefined;

    expect(baseline).toBeDefined();
    expect(baseline!.query_count).toBe(4);
    const metadata = JSON.parse(baseline!.metadata);
    expect(metadata.queryCount).toBe(4);
  });
});

// ═══════════════════════════════════════════════════════════════════
// INTEGRATION: Channel contribution isolation
// ═══════════════════════════════════════════════════════════════════

describe('Ablation Framework — Channel Isolation (R13-S3 acceptance)', () => {
  let savedEnv: string | undefined;

  beforeEach(() => {
    savedEnv = process.env.SPECKIT_ABLATION;
    process.env.SPECKIT_ABLATION = 'true';
  });

  afterEach(() => {
    if (savedEnv !== undefined) {
      process.env.SPECKIT_ABLATION = savedEnv;
    } else {
      delete process.env.SPECKIT_ABLATION;
    }
  });

  it('ablation can isolate >= 1 channel contribution (acceptance criterion)', async () => {
    // ACCEPTANCE CRITERION: ablation run shows per-channel Recall@20 delta
    // And can isolate the contribution of at least 1 individual channel.
    //
    // Strategy: Use known ground truth with a mock search function where
    // Vector provides unique results that no other channel provides.
    // Ablating vector should show a measurable negative delta.

    const { GROUND_TRUTH_QUERIES, GROUND_TRUTH_RELEVANCES } = await import(
      '../lib/eval/ground-truth-data'
    );

    // Find queries with ground truth
    const queriesWithGT = GROUND_TRUTH_QUERIES.filter(q =>
      GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
    );

    if (queriesWithGT.length === 0) {
      console.warn('No queries with ground truth — skipping isolation test');
      return;
    }

    // Use first 3 queries (or all if fewer) for a controlled test
    const testQueries = queriesWithGT.slice(0, 3);
    const testQueryIds = testQueries.map(q => q.id);

    // Build a search function where vector uniquely contributes some results
    const mockSearchFn: AblationSearchFn = (
      query: string,
      disabledChannels: Set<AblationChannel>,
    ) => {
      // Find the matching query in our test set
      const matchedQuery = testQueries.find(q => q.query === query);
      if (!matchedQuery) return [];

      const relevances = GROUND_TRUTH_RELEVANCES.filter(
        r => r.queryId === matchedQuery.id && r.relevance > 0,
      );
      const relevantIds = relevances.map(r => r.memoryId);

      if (relevantIds.length === 0) return [];

      // When vector is disabled, only return the second half of relevant IDs
      // This simulates vector contributing the first half uniquely
      let returnedIds: number[];
      if (disabledChannels.has('vector')) {
        const mid = Math.ceil(relevantIds.length / 2);
        returnedIds = relevantIds.slice(mid);
      } else {
        returnedIds = relevantIds;
      }

      return returnedIds.map((id, idx) => ({
        memoryId: id,
        score: 1.0 - idx * 0.01,
        rank: idx + 1,
      }));
    };

    const config: AblationConfig = {
      channels: ['vector', 'bm25'],
      groundTruthQueryIds: testQueryIds,
      recallK: 20,
    };

    const report = await runAblation(mockSearchFn, config);

    // Core assertion: report is not null (ablation ran)
    expect(report).not.toBeNull();
    if (!report) return;

    // Must have per-channel results
    expect(report.results.length).toBeGreaterThanOrEqual(1);

    // At least one channel must show a non-zero delta (isolated contribution)
    const channelWithContribution = report.results.find(
      r => Math.abs(r.delta) > 1e-9,
    );
    expect(channelWithContribution).toBeDefined();

    // Specifically, vector should show negative delta (removing it hurts)
    const vectorResult = report.results.find(r => r.channel === 'vector');
    expect(vectorResult).toBeDefined();
    expect(vectorResult!.delta).toBeLessThan(0);

    // Bm25 should show 0 delta (removing it has no effect in our mock)
    const bm25Result = report.results.find(r => r.channel === 'bm25');
    expect(bm25Result).toBeDefined();
    expect(bm25Result!.delta).toBeCloseTo(0, 4);

    // The report should have a valid format
    const md = formatAblationReport(report);
    expect(md).toContain('## Ablation Study Report');
    expect(md).toContain('vector');
    expect(md).toContain('Recall@20');
  });

  it('ablation report shows distinct per-channel Recall@20 deltas', async () => {
    const { GROUND_TRUTH_QUERIES, GROUND_TRUTH_RELEVANCES } = await import(
      '../lib/eval/ground-truth-data'
    );

    const queryWithGT = GROUND_TRUTH_QUERIES.find(q =>
      GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
    );

    expect(queryWithGT).toBeDefined();

    const relevances = GROUND_TRUTH_RELEVANCES.filter(
      r => r.queryId === queryWithGT!.id && r.relevance > 0,
    );
    const relevantIds = relevances.map(r => r.memoryId);

    if (relevantIds.length < 3) return;

    // Give each channel a different unique contribution
    const third = Math.ceil(relevantIds.length / 3);
    const channelContributions = new Map<AblationChannel, number[]>([
      ['vector', relevantIds.slice(0, third)],
      ['bm25', relevantIds.slice(third, 2 * third)],
      ['fts5', relevantIds.slice(2 * third)],
    ]);

    const mockSearchFn = createMockSearchFn(relevantIds, channelContributions);

    const config: AblationConfig = {
      channels: ['vector', 'bm25', 'fts5'],
      groundTruthQueryIds: [queryWithGT!.id],
    };

    const report = await runAblation(mockSearchFn, config);
    expect(report).not.toBeNull();
    if (!report) return;

    // All three channels should show negative delta (each contributes)
    for (const result of report.results) {
      expect(result.delta).toBeLessThan(0);
    }

    // Verify the report contains per-channel delta values
    const md = formatAblationReport(report);
    for (const channel of ['vector', 'bm25', 'fts5']) {
      expect(md).toContain(channel);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// MULTI-METRIC WIRING (CHK-088–091)
// ═══════════════════════════════════════════════════════════════════

describe('Ablation Framework — Multi-Metric Wiring (CHK-088–091)', () => {
  const ALL_METRIC_KEYS: (keyof AblationMetrics)[] = [
    'MRR@5', 'precision@5', 'recall@5', 'NDCG@5', 'MAP',
    'hit_rate', 'latency_p50', 'latency_p95', 'token_usage',
  ];

  it('report.results[*].metrics contains all 9 metric keys with baseline/ablated/delta', () => {
    const report = buildMockReport();
    for (const result of report.results) {
      expect(result.metrics).toBeDefined();
      for (const key of ALL_METRIC_KEYS) {
        const entry = result.metrics![key];
        expect(entry).toBeDefined();
        expect(typeof entry.baseline).toBe('number');
        expect(typeof entry.ablated).toBe('number');
        expect(typeof entry.delta).toBe('number');
        expect(entry.delta).toBeCloseTo(entry.ablated - entry.baseline, 6);
      }
    }
  });

  it('latency_p50 and latency_p95 are non-negative', () => {
    const report = buildMockReport();
    for (const result of report.results) {
      expect(result.metrics!['latency_p50'].baseline).toBeGreaterThanOrEqual(0);
      expect(result.metrics!['latency_p95'].baseline).toBeGreaterThanOrEqual(0);
      expect(result.metrics!['latency_p50'].ablated).toBeGreaterThanOrEqual(0);
      expect(result.metrics!['latency_p95'].ablated).toBeGreaterThanOrEqual(0);
    }
  });

  it('token_usage defaults to 0', () => {
    const report = buildMockReport();
    for (const result of report.results) {
      expect(result.metrics!['token_usage'].baseline).toBe(0);
      expect(result.metrics!['token_usage'].ablated).toBe(0);
      expect(result.metrics!['token_usage'].delta).toBe(0);
    }
  });

  it('formatAblationReport includes "Full Metric Breakdown" section', () => {
    const report = buildMockReport();
    const md = formatAblationReport(report);
    expect(md).toContain('### Full Metric Breakdown');
    expect(md).toContain('| Channel | MRR@5');
    expect(md).toContain('| vector ');
    expect(md).toContain('| bm25 ');
  });

  describe('storeAblationResults — multi-metric rows', () => {
    let testDataDir: string;
    let savedEnv: string | undefined;

    beforeAll(() => {
      savedEnv = process.env.SPECKIT_ABLATION;
      process.env.SPECKIT_ABLATION = 'true';
      testDataDir = path.join(os.tmpdir(), `ablation-mm-test-${Date.now()}`);
      fs.mkdirSync(testDataDir, { recursive: true });
      initEvalDb(testDataDir);
    });

    afterAll(() => {
      closeEvalDb();
      if (savedEnv !== undefined) {
        process.env.SPECKIT_ABLATION = savedEnv;
      } else {
        delete process.env.SPECKIT_ABLATION;
      }
      try { fs.rmSync(testDataDir, { recursive: true, force: true }); } catch {}
    });

    it('stores 9 additional metric rows per channel plus baseline + recall delta', () => {
      const report = buildMockReport();
      const success = storeAblationResults(report);
      expect(success).toBe(true);

      const db = getEvalDb();
      const rows = db.prepare(
        `SELECT metric_name, channel FROM eval_metric_snapshots WHERE metric_name LIKE 'ablation%' ORDER BY id`,
      ).all() as Array<{ metric_name: string; channel: string }>;

      // Token usage rows are skipped until real measurements exist.
      // 1 baseline + 3 channels * (1 recall_delta + 8 persisted metric deltas) = 1 + 27 = 28
      expect(rows.length).toBe(28);

      // Verify multi-metric rows exist for vector
      const vectorMetricRows = rows.filter(
        r => r.channel === 'vector' && r.metric_name.startsWith('ablation_') && r.metric_name !== 'ablation_recall@20_delta' && r.metric_name !== 'ablation_baseline_recall@20',
      );
      expect(vectorMetricRows.length).toBe(8);

      // Check specific metric names
      const metricNames = vectorMetricRows.map(r => r.metric_name);
      expect(metricNames).toContain('ablation_MRR@5_delta');
      expect(metricNames).toContain('ablation_precision@5_delta');
      expect(metricNames).toContain('ablation_recall@5_delta');
      expect(metricNames).toContain('ablation_NDCG@5_delta');
      expect(metricNames).toContain('ablation_MAP_delta');
      expect(metricNames).toContain('ablation_hit_rate_delta');
      expect(metricNames).toContain('ablation_latency_p50_delta');
      expect(metricNames).toContain('ablation_latency_p95_delta');
      expect(metricNames).not.toContain('ablation_token_usage_delta');
    });
  });

  it('runAblation populates metrics on each result', async () => {
    const savedEnv = process.env.SPECKIT_ABLATION;
    process.env.SPECKIT_ABLATION = 'true';

    try {
      const { GROUND_TRUTH_QUERIES, GROUND_TRUTH_RELEVANCES } = await import(
        '../lib/eval/ground-truth-data'
      );

      const queryWithGT = GROUND_TRUTH_QUERIES.find(q =>
        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
      );
      expect(queryWithGT).toBeDefined();

      const relevances = GROUND_TRUTH_RELEVANCES.filter(
        r => r.queryId === queryWithGT!.id && r.relevance > 0,
      );
      const relevantIds = relevances.map(r => r.memoryId);

      const mockSearchFn: AblationSearchFn = (_q, disabled) => {
        let ids = [...relevantIds];
        if (disabled.has('vector')) ids = ids.slice(Math.ceil(ids.length / 2));
        return ids.map((id, idx) => ({ memoryId: id, score: 1 - idx * 0.01, rank: idx + 1 }));
      };

      const report = await runAblation(mockSearchFn, {
        channels: ['vector'],
        groundTruthQueryIds: [queryWithGT!.id],
      });

      expect(report).not.toBeNull();
      if (!report) return;

      for (const result of report.results) {
        expect(result.metrics).toBeDefined();
        for (const key of ALL_METRIC_KEYS) {
          expect(result.metrics![key]).toBeDefined();
        }
      }
    } finally {
      if (savedEnv !== undefined) {
        process.env.SPECKIT_ABLATION = savedEnv;
      } else {
        delete process.env.SPECKIT_ABLATION;
      }
    }
  });

  it('warns about missing requested groundTruthQueryIds and records the resolved set', async () => {
    const savedEnv = process.env.SPECKIT_ABLATION;
    process.env.SPECKIT_ABLATION = 'true';

    try {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { GROUND_TRUTH_QUERIES, GROUND_TRUTH_RELEVANCES } = await import(
        '../lib/eval/ground-truth-data'
      );
      const queryWithGT = GROUND_TRUTH_QUERIES.find(q =>
        GROUND_TRUTH_RELEVANCES.some(r => r.queryId === q.id && r.relevance > 0),
      );
      expect(queryWithGT).toBeDefined();

      const missingId = 999999;
      const report = await runAblation(() => [], {
        channels: ['vector'],
        groundTruthQueryIds: [queryWithGT!.id, missingId],
      });

      expect(report).not.toBeNull();
      if (!report) return;

      expect(report.requestedQueryIds).toEqual([queryWithGT!.id, missingId]);
      expect(report.resolvedQueryIds).toEqual([queryWithGT!.id]);
      expect(report.missingQueryIds).toEqual([missingId]);

      const formatted = formatAblationReport(report);
      expect(formatted).toContain(`Requested query IDs:** ${queryWithGT!.id}, ${missingId}`);
      expect(formatted).toContain(`Missing query IDs:** ${missingId}`);
      expect(warnSpy).toHaveBeenCalledWith(
        `[ablation] Requested groundTruthQueryIds not found in the static dataset: ${missingId}`,
      );
    } finally {
      if (savedEnv !== undefined) {
        process.env.SPECKIT_ABLATION = savedEnv;
      } else {
        delete process.env.SPECKIT_ABLATION;
      }
    }
  });
});
