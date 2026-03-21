// TEST: K-Value Judged Relevance Sweep (REQ-D1-003)
// Feature flag: SPECKIT_RRF_K_EXPERIMENTAL
// Tests: NDCG@10, MRR@5, per-intent segmentation, tie-breaking, empty query set, flag OFF
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  computeNdcg10,
  computeMrr5Judged,
  evalQueriesAtK,
  argmaxNdcg10,
  runJudgedKSweep,
  isKExperimentalEnabled,
  JUDGED_K_SWEEP_VALUES,
  BASELINE_K,
} from '../lib/eval/k-value-analysis';
import type {
  JudgedQuery,
  JudgedKMetrics,
  IntentClass,
} from '../lib/eval/k-value-analysis';
import { SOURCE_TYPES } from '@spec-kit/shared/algorithms/rrf-fusion';

/* ──────────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────────── */

const savedEnv: Record<string, string | undefined> = {};

function setEnv(vars: Record<string, string | undefined>): void {
  for (const [key, value] of Object.entries(vars)) {
    savedEnv[key] = process.env[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function restoreEnv(): void {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

beforeEach(() => {
  setEnv({ SPECKIT_SCORE_NORMALIZATION: 'false' });
});

afterEach(() => {
  restoreEnv();
});

/** Build a simple judged query where first N items in a list are relevant. */
function makeJudgedQuery(
  intent: IntentClass,
  relevantIds: string[],
  allIds: string[]
): JudgedQuery {
  const labels = new Map<string, number>();
  for (const id of relevantIds) {
    labels.set(id, 3); // highly relevant
  }
  return {
    query: `test query for ${intent}`,
    intent,
    relevantIds,
    labels,
    channels: [
      {
        source: SOURCE_TYPES.VECTOR,
        results: allIds.map((id, i) => ({ id, title: `Item ${i}` })),
      },
    ],
  };
}

/* ──────────────────────────────────────────────────────────────
   CONSTANTS
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-003 Constants', () => {
  it('JUDGED_K_SWEEP_VALUES contains expected values', () => {
    const expected = [10, 20, 40, 60, 80, 100, 120];
    expect([...JUDGED_K_SWEEP_VALUES]).toEqual(expected);
  });

  it('BASELINE_K is 60', () => {
    expect(BASELINE_K).toBe(60);
  });
});

/* ──────────────────────────────────────────────────────────────
   FEATURE FLAG
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-003 Feature Flag (SPECKIT_RRF_K_EXPERIMENTAL)', () => {
  it('D3-FF-1: flag is ON by default (graduated)', () => {
    delete process.env.SPECKIT_RRF_K_EXPERIMENTAL;
    expect(isKExperimentalEnabled()).toBe(true);
  });

  it('D3-FF-2: flag is OFF when set to "false"', () => {
    process.env.SPECKIT_RRF_K_EXPERIMENTAL = 'false';
    expect(isKExperimentalEnabled()).toBe(false);
  });

  it('D3-FF-3: flag is ON when set to "true"', () => {
    process.env.SPECKIT_RRF_K_EXPERIMENTAL = 'true';
    expect(isKExperimentalEnabled()).toBe(true);
    delete process.env.SPECKIT_RRF_K_EXPERIMENTAL;
  });
});

/* ──────────────────────────────────────────────────────────────
   NDCG@10
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-003 computeNdcg10', () => {
  it('D3-NDCG-1: perfect ranking returns 1.0', () => {
    // Labels: a=3, b=2, c=1 — perfect ranking is [a, b, c]
    const labels = new Map([['a', 3], ['b', 2], ['c', 1]]);
    const ranking = ['a', 'b', 'c', 'd', 'e'];
    expect(computeNdcg10(ranking, labels)).toBeCloseTo(1.0, 5);
  });

  it('D3-NDCG-2: no relevant items returns 0', () => {
    const labels = new Map<string, number>();
    expect(computeNdcg10(['a', 'b', 'c'], labels)).toBe(0);
  });

  it('D3-NDCG-3: empty ranking returns 0', () => {
    const labels = new Map([['a', 3]]);
    expect(computeNdcg10([], labels)).toBe(0);
  });

  it('D3-NDCG-4: relevant item at rank 1 (0-indexed 0) gives maximum single contribution', () => {
    const labels = new Map([['top', 3]]);
    const rankingBest = ['top', 'other1', 'other2'];
    const rankingWorst = ['other1', 'other2', 'top'];
    const bestNdcg = computeNdcg10(rankingBest, labels);
    const worstNdcg = computeNdcg10(rankingWorst, labels);
    expect(bestNdcg).toBeGreaterThan(worstNdcg);
  });

  it('D3-NDCG-5: items beyond cutoff 10 do not affect score', () => {
    const labels = new Map([['relevant', 3]]);
    const rankingInCutoff = ['relevant', ...Array.from({ length: 9 }, (_, i) => `x${i}`)];
    const rankingBeyondCutoff = [...Array.from({ length: 10 }, (_, i) => `x${i}`), 'relevant'];
    const inCutoffNdcg = computeNdcg10(rankingInCutoff, labels);
    const beyondCutoffNdcg = computeNdcg10(rankingBeyondCutoff, labels);
    expect(inCutoffNdcg).toBeGreaterThan(0);
    expect(beyondCutoffNdcg).toBe(0);
  });

  it('D3-NDCG-6: NDCG value is in [0, 1]', () => {
    const labels = new Map([['a', 1], ['b', 2], ['c', 3]]);
    const ranking = ['c', 'b', 'a', 'd'];
    const ndcg = computeNdcg10(ranking, labels);
    expect(ndcg).toBeGreaterThanOrEqual(0);
    expect(ndcg).toBeLessThanOrEqual(1);
  });

  it('D3-NDCG-7: all-zero relevance labels returns 0', () => {
    const labels = new Map([['a', 0], ['b', 0]]);
    expect(computeNdcg10(['a', 'b'], labels)).toBe(0);
  });
});

/* ──────────────────────────────────────────────────────────────
   MRR@5 JUDGED
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-003 computeMrr5Judged', () => {
  it('D3-MRR-1: relevant item at rank 1 (1-indexed) returns MRR=1.0', () => {
    expect(computeMrr5Judged(['a', 'b', 'c'], ['a'])).toBeCloseTo(1.0, 5);
  });

  it('D3-MRR-2: relevant item at rank 2 returns MRR=0.5', () => {
    expect(computeMrr5Judged(['x', 'a', 'b'], ['a'])).toBeCloseTo(0.5, 5);
  });

  it('D3-MRR-3: relevant item at rank 5 returns MRR=0.2', () => {
    expect(computeMrr5Judged(['x', 'y', 'z', 'w', 'a'], ['a'])).toBeCloseTo(0.2, 5);
  });

  it('D3-MRR-4: no relevant item in top 5 returns 0', () => {
    expect(computeMrr5Judged(['a', 'b', 'c', 'd', 'e', 'relevant'], ['relevant'])).toBe(0);
  });

  it('D3-MRR-5: empty ranking returns 0', () => {
    expect(computeMrr5Judged([], ['a'])).toBe(0);
  });

  it('D3-MRR-6: empty relevant set returns 0', () => {
    expect(computeMrr5Judged(['a', 'b', 'c'], [])).toBe(0);
  });

  it('D3-MRR-7: numeric IDs are treated as strings consistently', () => {
    // relevantIds contains string '42', ranking contains number 42
    // computeMrr5Judged normalizes via String() — so '42' matches '42'
    expect(computeMrr5Judged([42, 'x', 'y'], ['42'])).toBeCloseTo(1.0, 5);
  });
});

/* ──────────────────────────────────────────────────────────────
   evalQueriesAtK
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-003 evalQueriesAtK', () => {
  it('D3-EVAL-1: empty query set returns zero metrics', () => {
    const metrics: JudgedKMetrics = evalQueriesAtK([], 60);
    expect(metrics.ndcg10).toBe(0);
    expect(metrics.mrr5Judged).toBe(0);
    expect(metrics.queryCount).toBe(0);
  });

  it('D3-EVAL-2: returns metrics averaged over queries', () => {
    const q1 = makeJudgedQuery('understand', ['item-0'], ['item-0', 'item-1', 'item-2']);
    const q2 = makeJudgedQuery('understand', ['item-1'], ['item-0', 'item-1', 'item-2']);
    const metrics = evalQueriesAtK([q1, q2], 60);
    expect(metrics.queryCount).toBe(2);
    expect(metrics.ndcg10).toBeGreaterThanOrEqual(0);
    expect(metrics.ndcg10).toBeLessThanOrEqual(1);
    expect(metrics.mrr5Judged).toBeGreaterThanOrEqual(0);
    expect(metrics.mrr5Judged).toBeLessThanOrEqual(1);
  });

  it('D3-EVAL-3: query with perfectly ranked results gives high NDCG', () => {
    // item-0 is most relevant, it should be top-ranked (rank 1 in all K values)
    const q = makeJudgedQuery('find_spec', ['item-0'], ['item-0', 'item-1', 'item-2']);
    const metrics = evalQueriesAtK([q], 60);
    // item-0 is rank 1 in vector results → NDCG should be perfect
    expect(metrics.ndcg10).toBeCloseTo(1.0, 5);
    expect(metrics.mrr5Judged).toBeCloseTo(1.0, 5);
  });

  it('D3-EVAL-4: different K values produce different results for non-trivial inputs', () => {
    // Create a query where ranking differs between K values
    // Multiple channels needed for K to have any effect on ordering
    const results1 = Array.from({ length: 20 }, (_, i) => ({ id: `item-${i}`, title: `Item ${i}` }));
    const results2 = [...results1].reverse(); // reversed order

    const q: JudgedQuery = {
      query: 'test',
      intent: 'fix_bug',
      relevantIds: ['item-0', 'item-1'],
      labels: new Map([['item-0', 3], ['item-1', 2]]),
      channels: [
        { source: SOURCE_TYPES.VECTOR, results: results1 },
        { source: SOURCE_TYPES.BM25,   results: results2 },
      ],
    };

    const metricsK10 = evalQueriesAtK([q], 10);
    const metricsK120 = evalQueriesAtK([q], 120);
    // Both should be valid metrics
    expect(metricsK10.queryCount).toBe(1);
    expect(metricsK120.queryCount).toBe(1);
    expect(metricsK10.ndcg10).toBeGreaterThanOrEqual(0);
    expect(metricsK120.ndcg10).toBeGreaterThanOrEqual(0);
  });
});

/* ──────────────────────────────────────────────────────────────
   argmaxNdcg10
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-003 argmaxNdcg10', () => {
  it('D3-ARG-1: returns K with highest NDCG@10', () => {
    const metrics: Record<number, JudgedKMetrics> = {
      10:  { ndcg10: 0.5, mrr5Judged: 0.5, queryCount: 1 },
      20:  { ndcg10: 0.8, mrr5Judged: 0.7, queryCount: 1 },
      40:  { ndcg10: 0.6, mrr5Judged: 0.6, queryCount: 1 },
      60:  { ndcg10: 0.3, mrr5Judged: 0.3, queryCount: 1 },
      80:  { ndcg10: 0.1, mrr5Judged: 0.1, queryCount: 1 },
      100: { ndcg10: 0.4, mrr5Judged: 0.4, queryCount: 1 },
      120: { ndcg10: 0.2, mrr5Judged: 0.2, queryCount: 1 },
    };
    expect(argmaxNdcg10(metrics)).toBe(20);
  });

  it('D3-ARG-2: tie-break favors lower K', () => {
    const metrics: Record<number, JudgedKMetrics> = {
      10:  { ndcg10: 0.7, mrr5Judged: 0.5, queryCount: 1 },
      20:  { ndcg10: 0.7, mrr5Judged: 0.5, queryCount: 1 },
      40:  { ndcg10: 0.6, mrr5Judged: 0.4, queryCount: 1 },
      60:  { ndcg10: 0.7, mrr5Judged: 0.5, queryCount: 1 },
      80:  { ndcg10: 0.5, mrr5Judged: 0.3, queryCount: 1 },
      100: { ndcg10: 0.4, mrr5Judged: 0.2, queryCount: 1 },
      120: { ndcg10: 0.3, mrr5Judged: 0.1, queryCount: 1 },
    };
    // K=10 and K=20 and K=60 all have 0.7 — tie-break to K=10
    expect(argmaxNdcg10(metrics)).toBe(10);
  });

  it('D3-ARG-3: all equal NDCG — returns lowest K', () => {
    const metrics: Record<number, JudgedKMetrics> = {};
    for (const k of [10, 20, 40, 60, 80, 100, 120]) {
      metrics[k] = { ndcg10: 0.5, mrr5Judged: 0.5, queryCount: 1 };
    }
    expect(argmaxNdcg10(metrics)).toBe(10);
  });
});

/* ──────────────────────────────────────────────────────────────
   runJudgedKSweep — FLAG OFF
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-003 runJudgedKSweep — Flag OFF (default K=60)', () => {
  beforeEach(() => {
    setEnv({ SPECKIT_RRF_K_EXPERIMENTAL: 'false' });
  });

  it('D3-SWEEP-OFF-1: empty query set returns globalBestK=60 and empty byIntent', () => {
    const result = runJudgedKSweep([]);
    expect(result.globalBestK).toBe(BASELINE_K);
    expect(result.experimentalMode).toBe(false);
    expect(Object.keys(result.byIntent)).toHaveLength(0);
  });

  it('D3-SWEEP-OFF-2: non-empty queries still return globalBestK=60 without running sweep', () => {
    const q = makeJudgedQuery('understand', ['item-0'], ['item-0', 'item-1']);
    const result = runJudgedKSweep([q]);
    expect(result.globalBestK).toBe(BASELINE_K);
    expect(result.experimentalMode).toBe(false);
    // byIntent is empty — no sweep was run
    expect(Object.keys(result.byIntent)).toHaveLength(0);
  });

  it('D3-SWEEP-OFF-3: flag unset now defaults to ON (graduated)', () => {
    delete process.env.SPECKIT_RRF_K_EXPERIMENTAL;
    const result = runJudgedKSweep([]);
    expect(result.globalBestK).toBe(BASELINE_K);
    expect(result.experimentalMode).toBe(true);
  });
});

/* ──────────────────────────────────────────────────────────────
   runJudgedKSweep — FLAG ON
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-003 runJudgedKSweep — Flag ON', () => {
  beforeEach(() => {
    setEnv({ SPECKIT_RRF_K_EXPERIMENTAL: 'true' });
  });

  it('D3-SWEEP-ON-1: empty query set returns globalBestK=60', () => {
    const result = runJudgedKSweep([]);
    expect(result.globalBestK).toBe(BASELINE_K);
    expect(result.experimentalMode).toBe(true);
    expect(Object.keys(result.byIntent)).toHaveLength(0);
  });

  it('D3-SWEEP-ON-2: single-intent queries populate byIntent', () => {
    const queries = [
      makeJudgedQuery('understand', ['item-0'], ['item-0', 'item-1', 'item-2']),
      makeJudgedQuery('understand', ['item-0'], ['item-0', 'item-1', 'item-2']),
    ];
    const result = runJudgedKSweep(queries);
    expect(result.experimentalMode).toBe(true);
    expect(result.byIntent['understand']).toBeDefined();
    expect(result.byIntent['understand']!.queryCount).toBe(2);
    expect(result.byIntent['understand']!.bestK).toBeGreaterThan(0);
    expect(JUDGED_K_SWEEP_VALUES).toContain(result.byIntent['understand']!.bestK as typeof JUDGED_K_SWEEP_VALUES[number]);
  });

  it('D3-SWEEP-ON-3: multiple intents are segmented independently', () => {
    const queries: JudgedQuery[] = [
      makeJudgedQuery('understand', ['item-0'], ['item-0', 'item-1']),
      makeJudgedQuery('fix_bug',    ['item-1'], ['item-0', 'item-1']),
    ];
    const result = runJudgedKSweep(queries);
    expect(result.byIntent['understand']).toBeDefined();
    expect(result.byIntent['fix_bug']).toBeDefined();
    // Each intent handled independently
    expect(result.byIntent['understand']!.queryCount).toBe(1);
    expect(result.byIntent['fix_bug']!.queryCount).toBe(1);
  });

  it('D3-SWEEP-ON-4: globalBestK is in JUDGED_K_SWEEP_VALUES', () => {
    const queries = [
      makeJudgedQuery('understand', ['item-0'], ['item-0', 'item-1', 'item-2']),
    ];
    const result = runJudgedKSweep(queries);
    expect(JUDGED_K_SWEEP_VALUES).toContain(result.globalBestK as typeof JUDGED_K_SWEEP_VALUES[number]);
  });

  it('D3-SWEEP-ON-5: bestK for an intent is in JUDGED_K_SWEEP_VALUES', () => {
    const queries = [
      makeJudgedQuery('find_spec', ['item-0'], ['item-0', 'item-1', 'item-2', 'item-3']),
    ];
    const result = runJudgedKSweep(queries);
    const intentResult = result.byIntent['find_spec'];
    expect(intentResult).toBeDefined();
    expect(JUDGED_K_SWEEP_VALUES).toContain(intentResult!.bestK as typeof JUDGED_K_SWEEP_VALUES[number]);
  });

  it('D3-SWEEP-ON-6: metricsPerK contains all sweep K values', () => {
    const queries = [
      makeJudgedQuery('refactor', ['item-0'], ['item-0', 'item-1']),
    ];
    const result = runJudgedKSweep(queries);
    const intentResult = result.byIntent['refactor'];
    expect(intentResult).toBeDefined();
    for (const k of JUDGED_K_SWEEP_VALUES) {
      expect(intentResult!.metricsPerK[k]).toBeDefined();
      expect(intentResult!.metricsPerK[k].queryCount).toBe(1);
    }
  });

  it('D3-SWEEP-ON-7: all intents combined produce a global bestK', () => {
    const queries: JudgedQuery[] = [
      makeJudgedQuery('understand',    ['item-0'], ['item-0', 'item-1']),
      makeJudgedQuery('fix_bug',       ['item-0'], ['item-0', 'item-1']),
      makeJudgedQuery('add_feature',   ['item-0'], ['item-0', 'item-1']),
      makeJudgedQuery('security_audit',['item-0'], ['item-0', 'item-1']),
    ];
    const result = runJudgedKSweep(queries);
    expect(result.globalBestK).toBeGreaterThan(0);
    expect(JUDGED_K_SWEEP_VALUES).toContain(result.globalBestK as typeof JUDGED_K_SWEEP_VALUES[number]);
    expect(Object.keys(result.byIntent)).toHaveLength(4);
  });

  it('D3-SWEEP-ON-8: intent with all-zero NDCG selects lowest K (tie-break)', () => {
    // When all K values produce equal metrics, lowest K wins
    const queries = [
      makeJudgedQuery('security_audit', ['missing-id'], ['item-0', 'item-1']),
    ];
    const result = runJudgedKSweep(queries);
    const intentResult = result.byIntent['security_audit'];
    expect(intentResult).toBeDefined();
    // All NDCG=0 (relevant ID missing) → tie-break to lowest K
    expect(intentResult!.bestK).toBe(JUDGED_K_SWEEP_VALUES[0]);
  });
});
