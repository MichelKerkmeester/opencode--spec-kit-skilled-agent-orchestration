// ───────────────────────────────────────────────────────────────
// 1. TEST — BM25 BASELINE
// ───────────────────────────────────────────────────────────────
//
// Validates:
// T008.1  — evaluateContingency: PAUSE for MRR >= 0.80
// T008.2  — evaluateContingency: RATIONALIZE for 0.50 <= MRR < 0.80
// T008.3  — evaluateContingency: PROCEED for MRR < 0.50
// T008.4  — evaluateContingency: exact boundary 0.80 → PAUSE
// T008.5  — evaluateContingency: exact boundary 0.50 → RATIONALIZE
// T008.6  — recordBaselineMetrics: writes all 5 metric rows to eval DB
// T008.7  — recordBaselineMetrics: contingency metadata stored as JSON
// T008.8  — runBM25Baseline: runs with mocked search function
// T008.9  — runBM25Baseline: respects queryLimit config option
// T008.10 — runBM25Baseline: skipHardNegatives reduces query count
// T008.11 — runBM25Baseline: returns well-structured BM25BaselineResult
// T008.12 — runBM25Baseline: disables non-BM25 channels (only calls searchFn)
// T009.1  — computeBootstrapCI: iterations=0 returns safe degenerate CI
// T009.2  — computeBootstrapCI: negative iterations return safe degenerate CI
// T009.3  — computeBootstrapCI: empty input returns safe degenerate CI
// T009.4  — computeBootstrapCI: single-element input behaves correctly
// T009.5  — computeBootstrapCI: NaN values in perQueryMRR are filtered out
// T009.6  — computeBootstrapCI: Infinity values in perQueryMRR are filtered out
// T009.7  — computeBootstrapCI: all-NaN input returns degenerate zero CI
// T009.8  — computeBootstrapCI: fractional iterations are floored
// T009.9  — computeBootstrapCI: NaN iterations treated as 0
// T009.10 — computeBootstrapCI: Infinity iterations treated as 0

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import Database from 'better-sqlite3';

import {
  evaluateContingency,
  evaluateContingencyRelative,
  computeBootstrapCI,
  recordBaselineMetrics,
  runBM25Baseline,
  type BM25BaselineResult,
  type BM25SearchResult,
} from '../lib/eval/bm25-baseline';

import { initEvalDb, closeEvalDb } from '../lib/eval/eval-db';
import { GROUND_TRUTH_QUERIES, GROUND_TRUTH_RELEVANCES } from '../lib/eval/ground-truth-data';

/* ───────────────────────────────────────────────────────────────
   SETUP / TEARDOWN
──────────────────────────────────────────────────────────────── */

let testDataDir: string;
let evalDb: ReturnType<typeof Database>;

beforeEach(() => {
  testDataDir = path.join(os.tmpdir(), `t008-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  fs.mkdirSync(testDataDir, { recursive: true });
  evalDb = initEvalDb(testDataDir);
});

afterEach(() => {
  closeEvalDb();
  if (testDataDir && fs.existsSync(testDataDir)) {
    try {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
});

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

/** Build a mock search function that returns `count` deterministic results. */
function makeMockSearchFn(count: number = 5): (query: string, limit: number) => BM25SearchResult[] {
  return (_query: string, limit: number) => {
    const actual = Math.min(count, limit);
    return Array.from({ length: actual }, (_, i) => ({
      id: 1000 + i,        // IDs that will NOT match mapped ground truth IDs
      score: 1.0 - i * 0.1,
      source: 'bm25',
    }));
  };
}

/** Build a mock result object representing a complete BM25 baseline run. */
function makeMockResult(mrr5: number): BM25BaselineResult {
  return {
    metrics: {
      mrr5,
      ndcg10: mrr5 * 0.9,
      recall20: mrr5 * 0.8,
      hitRate1: mrr5 > 0 ? 1 : 0,
    },
    queryCount: 10,
    timestamp: new Date().toISOString(),
    contingencyDecision: evaluateContingency(mrr5),
  };
}

/* ───────────────────────────────────────────────────────────────
   TESTS: evaluateContingency
──────────────────────────────────────────────────────────────── */

describe('T008: BM25 Contingency Decision Matrix', () => {

  it('T008.1: MRR >= 0.80 → PAUSE action', () => {
    const result = evaluateContingency(0.85);
    expect(result.action).toBe('PAUSE');
    expect(result.threshold).toBe('>=0.8');
    expect(result.bm25MRR).toBe(0.85);
    expect(result.interpretation).toContain('very strong');
  });

  it('T008.2: 0.50 <= MRR < 0.80 → RATIONALIZE action', () => {
    const result = evaluateContingency(0.65);
    expect(result.action).toBe('RATIONALIZE');
    expect(result.threshold).toBe('0.5-0.8');
    expect(result.bm25MRR).toBe(0.65);
    expect(result.interpretation).toContain('moderate');
  });

  it('T008.3: MRR < 0.50 → PROCEED action', () => {
    const result = evaluateContingency(0.30);
    expect(result.action).toBe('PROCEED');
    expect(result.threshold).toBe('<0.5');
    expect(result.bm25MRR).toBe(0.30);
    expect(result.interpretation).toContain('weak');
  });

  it('T008.4: Exact boundary 0.80 → PAUSE (inclusive)', () => {
    const result = evaluateContingency(0.80);
    expect(result.action).toBe('PAUSE');
    expect(result.threshold).toBe('>=0.8');
  });

  it('T008.5: Exact boundary 0.50 → RATIONALIZE (inclusive)', () => {
    const result = evaluateContingency(0.50);
    expect(result.action).toBe('RATIONALIZE');
    expect(result.threshold).toBe('0.5-0.8');
  });

  it('T008.5b: MRR = 0.0 → PROCEED', () => {
    const result = evaluateContingency(0.0);
    expect(result.action).toBe('PROCEED');
    expect(result.threshold).toBe('<0.5');
  });

  it('T008.5c: MRR = 1.0 → PAUSE', () => {
    const result = evaluateContingency(1.0);
    expect(result.action).toBe('PAUSE');
    expect(result.threshold).toBe('>=0.8');
  });

});

/* ───────────────────────────────────────────────────────────────
   TESTS: evaluateContingencyRelative (spec-compliant ratio mode)
──────────────────────────────────────────────────────────────── */

describe('T008: BM25 Relative Contingency Decision', () => {

  it('T008.13: ratio >= 0.80 → PAUSE', () => {
    // BM25=0.72, hybrid=0.80 → ratio=0.90 → PAUSE
    const result = evaluateContingencyRelative(0.72, 0.80);
    expect(result.action).toBe('PAUSE');
    expect(result.mode).toBe('relative');
    expect(result.ratio).toBeCloseTo(0.90, 2);
    expect(result.hybridMRR).toBe(0.80);
    expect(result.interpretation).toContain('90.0%');
  });

  it('T008.14: ratio 0.50-0.79 → RATIONALIZE', () => {
    // BM25=0.40, hybrid=0.70 → ratio=0.571 → RATIONALIZE
    const result = evaluateContingencyRelative(0.40, 0.70);
    expect(result.action).toBe('RATIONALIZE');
    expect(result.mode).toBe('relative');
    expect(result.ratio).toBeCloseTo(0.571, 2);
  });

  it('T008.15: ratio < 0.50 → PROCEED', () => {
    // BM25=0.20, hybrid=0.75 → ratio=0.267 → PROCEED
    const result = evaluateContingencyRelative(0.20, 0.75);
    expect(result.action).toBe('PROCEED');
    expect(result.mode).toBe('relative');
    expect(result.ratio).toBeCloseTo(0.267, 2);
    expect(result.interpretation).toContain('26.7%');
  });

  it('T008.16: exact boundary ratio=0.80 → PAUSE (inclusive)', () => {
    // BM25=0.40, hybrid=0.50 → ratio=0.80 exactly
    const result = evaluateContingencyRelative(0.40, 0.50);
    expect(result.action).toBe('PAUSE');
    expect(result.ratio).toBeCloseTo(0.80, 5);
  });

  it('T008.17: exact boundary ratio=0.50 → RATIONALIZE (inclusive)', () => {
    // BM25=0.25, hybrid=0.50 → ratio=0.50 exactly
    const result = evaluateContingencyRelative(0.25, 0.50);
    expect(result.action).toBe('RATIONALIZE');
    expect(result.ratio).toBeCloseTo(0.50, 5);
  });

  it('T008.18: hybridMRR=0 → safe fallback to PROCEED', () => {
    const result = evaluateContingencyRelative(0.50, 0);
    expect(result.action).toBe('PROCEED');
    expect(result.mode).toBe('relative');
    expect(result.interpretation).toContain('zero');
  });

  it('T008.18b: non-finite ratio inputs → safe fallback to PROCEED', () => {
    const result = evaluateContingencyRelative(Number.NaN, 0.5);
    expect(result.action).toBe('PROCEED');
    expect(result.mode).toBe('relative');
    expect(result.ratio).toBe(0);
    expect(result.interpretation).toContain('non-finite');
  });

  it('T008.19: absolute mode tags results with mode="absolute"', () => {
    const result = evaluateContingency(0.65);
    expect(result.mode).toBe('absolute');
    expect(result.hybridMRR).toBeUndefined();
    expect(result.ratio).toBeUndefined();
  });

});

/* ───────────────────────────────────────────────────────────────
   TESTS: computeBootstrapCI (T009)
──────────────────────────────────────────────────────────────── */

describe('T009: Bootstrap CI guards', () => {
  it('T009.1: iterations=0 returns safe degenerate CI (no NaN)', () => {
    const result = computeBootstrapCI([0.4, 0.6], 0);
    expect(result.pointEstimate).toBeCloseTo(0.5, 5);
    expect(result.ciLower).toBeCloseTo(0.5, 5);
    expect(result.ciUpper).toBeCloseTo(0.5, 5);
    expect(result.ciWidth).toBe(0);
    expect(result.iterations).toBe(0);
    expect(Number.isNaN(result.ciLower)).toBe(false);
    expect(Number.isNaN(result.ciUpper)).toBe(false);
  });

  it('T009.2: negative iterations return safe degenerate CI', () => {
    const result = computeBootstrapCI([0.2, 0.8], -5);
    expect(result.pointEstimate).toBeCloseTo(0.5, 5);
    expect(result.ciLower).toBeCloseTo(0.5, 5);
    expect(result.ciUpper).toBeCloseTo(0.5, 5);
    expect(result.ciWidth).toBe(0);
    expect(result.iterations).toBe(0);
  });

  it('T009.3: empty perQueryMRR returns degenerate zero CI', () => {
    const result = computeBootstrapCI([], 1000);
    expect(result.pointEstimate).toBe(0);
    expect(result.ciLower).toBe(0);
    expect(result.ciUpper).toBe(0);
    expect(result.ciWidth).toBe(0);
    expect(result.sampleSize).toBe(0);
    expect(Number.isFinite(result.ciLower)).toBe(true);
    expect(Number.isFinite(result.ciUpper)).toBe(true);
  });

  it('T009.4: single-element input produces stable CI around that value', () => {
    const result = computeBootstrapCI([0.75], 200);
    expect(result.pointEstimate).toBeCloseTo(0.75, 5);
    expect(result.ciLower).toBeCloseTo(0.75, 5);
    expect(result.ciUpper).toBeCloseTo(0.75, 5);
    expect(result.ciWidth).toBe(0);
    expect(result.sampleSize).toBe(1);
  });

  it('T009.5: NaN values in perQueryMRR are filtered out', () => {
    const result = computeBootstrapCI([0.4, NaN, 0.6, NaN], 100);
    // Only [0.4, 0.6] survive filtering → sampleSize=2, pointEstimate≈0.5
    expect(result.sampleSize).toBe(2);
    expect(result.pointEstimate).toBeCloseTo(0.5, 5);
    expect(Number.isFinite(result.ciLower)).toBe(true);
    expect(Number.isFinite(result.ciUpper)).toBe(true);
  });

  it('T009.6: Infinity values in perQueryMRR are filtered out', () => {
    const result = computeBootstrapCI([0.3, Infinity, -Infinity, 0.7], 100);
    expect(result.sampleSize).toBe(2);
    expect(result.pointEstimate).toBeCloseTo(0.5, 5);
    expect(Number.isFinite(result.ciLower)).toBe(true);
  });

  it('T009.7: all-NaN input returns degenerate zero CI', () => {
    const result = computeBootstrapCI([NaN, NaN, NaN], 1000);
    expect(result.sampleSize).toBe(0);
    expect(result.pointEstimate).toBe(0);
    expect(result.ciLower).toBe(0);
    expect(result.ciUpper).toBe(0);
  });

  it('T009.8: fractional iterations are floored', () => {
    const result = computeBootstrapCI([0.5, 0.5], 3.7);
    // Math.floor(3.7) = 3 iterations
    expect(result.iterations).toBe(3);
    expect(result.sampleSize).toBe(2);
  });

  it('T009.9: NaN iterations treated as 0', () => {
    const result = computeBootstrapCI([0.5, 0.5], NaN);
    expect(result.iterations).toBe(0);
    expect(result.pointEstimate).toBeCloseTo(0.5, 5);
    expect(result.ciWidth).toBe(0);
  });

  it('T009.10: Infinity iterations treated as 0', () => {
    const result = computeBootstrapCI([0.5, 0.5], Infinity);
    expect(result.iterations).toBe(0);
    expect(result.pointEstimate).toBeCloseTo(0.5, 5);
  });
});

/* ───────────────────────────────────────────────────────────────
   TESTS: recordBaselineMetrics
──────────────────────────────────────────────────────────────── */

describe('T008: recordBaselineMetrics — Eval DB Write', () => {

  it('T008.6: writes exactly 5 rows to eval_metric_snapshots', () => {
    const mockResult = makeMockResult(0.62);
    recordBaselineMetrics(evalDb, mockResult);

    const rows = evalDb.prepare(
      `SELECT * FROM eval_metric_snapshots WHERE channel = 'bm25'`
    ).all();

    // 4 core metrics + 1 contingency decision row = 5
    expect(rows).toHaveLength(5);
  });

  it('T008.7: contingency decision stored as parseable JSON metadata', () => {
    const mockResult = makeMockResult(0.62);
    recordBaselineMetrics(evalDb, mockResult);

    const row = evalDb.prepare(
      `SELECT metadata FROM eval_metric_snapshots
       WHERE metric_name = 'bm25_contingency_decision'`
    ).get() as { metadata: string } | undefined;

    expect(row).toBeDefined();
    expect(row!.metadata).not.toBeNull();

    const parsed = JSON.parse(row!.metadata!);
    expect(parsed).toHaveProperty('action');
    expect(parsed).toHaveProperty('threshold');
    expect(parsed).toHaveProperty('interpretation');
    expect(parsed.action).toBe('RATIONALIZE'); // mrr5=0.62 falls in RATIONALIZE band
  });

  it('T008.7b: metric row names are correct (mrr@5, ndcg@10, recall@20, hit_rate@1)', () => {
    const mockResult = makeMockResult(0.72);
    recordBaselineMetrics(evalDb, mockResult);

    const metricNames = (evalDb.prepare(
      `SELECT metric_name FROM eval_metric_snapshots WHERE channel = 'bm25'`
    ).all() as Array<{ metric_name: string }>).map(r => r.metric_name);

    expect(metricNames).toContain('mrr@5');
    expect(metricNames).toContain('ndcg@10');
    expect(metricNames).toContain('recall@20');
    expect(metricNames).toContain('hit_rate@1');
    expect(metricNames).toContain('bm25_contingency_decision');
  });

  it('T008.7c: mrr@5 metric value matches input', () => {
    const mockResult = makeMockResult(0.77);
    recordBaselineMetrics(evalDb, mockResult);

    const row = evalDb.prepare(
      `SELECT metric_value FROM eval_metric_snapshots WHERE metric_name = 'mrr@5'`
    ).get() as { metric_value: number } | undefined;

    expect(row).toBeDefined();
    expect(row!.metric_value).toBeCloseTo(0.77, 5);
  });

});

/* ───────────────────────────────────────────────────────────────
   TESTS: runBM25Baseline
──────────────────────────────────────────────────────────────── */

describe('T008: runBM25Baseline — Runner Integration', () => {

  it('T008.8: runs with a mocked search function and returns well-structured result', async () => {
    const mockSearch = makeMockSearchFn(5);
    const result = await runBM25Baseline(mockSearch, { queryLimit: 10 });

    expect(result).toHaveProperty('metrics');
    expect(result).toHaveProperty('queryCount');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('contingencyDecision');

    expect(result.queryCount).toBe(10);
    expect(typeof result.metrics.mrr5).toBe('number');
    expect(typeof result.metrics.ndcg10).toBe('number');
    expect(typeof result.metrics.recall20).toBe('number');
    expect(typeof result.metrics.hitRate1).toBe('number');
  });

  it('T008.9: respects queryLimit config option', async () => {
    const mockSearch = makeMockSearchFn(5);
    const result = await runBM25Baseline(mockSearch, { queryLimit: 7 });
    expect(result.queryCount).toBe(7);
  });

  it('T008.10: skipHardNegatives reduces query count below total', async () => {
    const mockSearch = makeMockSearchFn(5);

    const hardNegativeCount = GROUND_TRUTH_QUERIES.filter(q => q.category === 'hard_negative').length;
    const totalCount = GROUND_TRUTH_QUERIES.length;

    const withHardNeg = await runBM25Baseline(mockSearch, { skipHardNegatives: false });
    const withoutHardNeg = await runBM25Baseline(mockSearch, { skipHardNegatives: true });

    expect(withHardNeg.queryCount).toBe(totalCount);
    expect(withoutHardNeg.queryCount).toBe(totalCount - hardNegativeCount);
    expect(withoutHardNeg.queryCount).toBeLessThan(withHardNeg.queryCount);
  });

  it('T008.11: returns well-structured BM25BaselineResult with contingency decision', async () => {
    const mockSearch = makeMockSearchFn(5);
    const result = await runBM25Baseline(mockSearch, { queryLimit: 5 });

    const { contingencyDecision } = result;
    expect(['PAUSE', 'RATIONALIZE', 'PROCEED']).toContain(contingencyDecision.action);
    expect(['>=0.8', '0.5-0.8', '<0.5']).toContain(contingencyDecision.threshold);
    expect(typeof contingencyDecision.interpretation).toBe('string');
    expect(contingencyDecision.interpretation.length).toBeGreaterThan(0);
    expect(contingencyDecision.bm25MRR).toBe(result.metrics.mrr5);
  });

  it('T008.12: only invokes the injected searchFn — no side-channel calls', async () => {
    // Verify the runner only calls the injected function and does not attempt
    // To call vector, graph, or trigger search paths (those are controlled by
    // The caller who must disable them before passing the search function).
    const calls: string[] = [];
    const trackingSearch = (query: string, limit: number): BM25SearchResult[] => {
      calls.push(`bm25:${query.slice(0, 10)}`);
      return []; // return empty — metrics will be 0, which is valid
    };

    const result = await runBM25Baseline(trackingSearch, { queryLimit: 3 });

    // Should have been called exactly queryLimit times
    expect(calls).toHaveLength(3);
    // All calls should be tagged as bm25 (our tracking tag)
    expect(calls.every(c => c.startsWith('bm25:'))).toBe(true);
    // Metrics are all 0 because empty results never match mapped ground truth IDs
    expect(result.metrics.mrr5).toBe(0);
  });

  it('T008.12b: timestamp is a valid ISO 8601 string', async () => {
    const mockSearch = makeMockSearchFn(3);
    const result = await runBM25Baseline(mockSearch, { queryLimit: 3 });

    const parsed = new Date(result.timestamp);
    expect(isNaN(parsed.getTime())).toBe(false);
    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('T008.20: config.k overrides NDCG/Recall but MRR stays at k=5 for contingency', async () => {
    const relevantMemoryByQueryId = new Map<number, number>();
    for (const relevance of GROUND_TRUTH_RELEVANCES) {
      if (relevance.queryId <= 3 && relevance.relevance > 0 && !relevantMemoryByQueryId.has(relevance.queryId)) {
        relevantMemoryByQueryId.set(relevance.queryId, relevance.memoryId);
      }
    }

    const mockSearch = (query: string, _limit: number): BM25SearchResult[] => {
      const q = GROUND_TRUTH_QUERIES.find(item => item.query === query);
      if (!q) {
        return [{ id: 999_001, score: 1.0, source: 'bm25' }];
      }
      const relevantId = relevantMemoryByQueryId.get(q.id) ?? 999_002;
      return [
        { id: 999_000, score: 1.0, source: 'bm25' }, // non-relevant at rank 1
        { id: relevantId, score: 0.9, source: 'bm25' }, // relevant at rank 2
      ];
    };

    const baseline = await runBM25Baseline(mockSearch, { queryLimit: 3 });
    const withKOverride = await runBM25Baseline(mockSearch, { queryLimit: 3, k: 1 });

    expect(withKOverride.metrics.mrr5).toBeCloseTo(baseline.metrics.mrr5, 10);
    expect(withKOverride.contingencyDecision.bm25MRR).toBeCloseTo(baseline.contingencyDecision.bm25MRR, 10);
    expect(withKOverride.metrics.ndcg10).not.toBeCloseTo(baseline.metrics.ndcg10, 10);
    expect(withKOverride.metrics.recall20).not.toBeCloseTo(baseline.metrics.recall20, 10);
  });

});
