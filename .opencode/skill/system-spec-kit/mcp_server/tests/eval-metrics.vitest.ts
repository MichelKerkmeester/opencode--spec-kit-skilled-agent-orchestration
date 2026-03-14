// ───────────────────────────────────────────────────────────────
// 1. TEST — EVAL METRICS
// ───────────────────────────────────────────────────────────────
// 12 evaluation metrics: 7 core + 5 diagnostic.
// All functions are pure computation — no DB access.

import { describe, it, expect } from 'vitest';
import {
  computeMRR,
  computeNDCG,
  computeRecall,
  computeHitRate,
  computeInversionRate,
  computeConstitutionalSurfacingRate,
  computeImportanceWeightedRecall,
  computeColdStartDetectionRate,
  computeIntentWeightedNDCG,
  computeAllMetrics,
  computePrecision,
  computeF1,
  computeMAP,
} from '../lib/eval/eval-metrics';
import type { EvalResult, GroundTruthEntry } from '../lib/eval/eval-metrics';

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

function makeResult(memoryId: number, rank: number, score = 1.0): EvalResult {
  return { memoryId, rank, score };
}

function makeGT(memoryId: number, relevance: number, tier?: string, createdAt?: Date): GroundTruthEntry {
  return { queryId: 1, memoryId, relevance, tier, createdAt };
}

/* ───────────────────────────────────────────────────────────────
   CORE: MRR@5
──────────────────────────────────────────────────────────────── */

describe('MRR@5 (Mean Reciprocal Rank)', () => {
  it('T006-C01: Perfect ranking — relevant at rank 1 → MRR = 1.0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 2), makeGT(2, 0), makeGT(3, 0)];
    expect(computeMRR(results, gt)).toBeCloseTo(1.0, 5);
  });

  it('T006-C02: Relevant at rank 3 → MRR = 1/3 ≈ 0.333', () => {
    const results = [makeResult(10, 1), makeResult(20, 2), makeResult(30, 3)];
    const gt = [makeGT(10, 0), makeGT(20, 0), makeGT(30, 2)];
    expect(computeMRR(results, gt)).toBeCloseTo(1 / 3, 4);
  });

  it('T006-C03: No relevant result in top 5 → MRR = 0.0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(99, 3)]; // id 99 not in results
    expect(computeMRR(results, gt)).toBe(0);
  });

  it('T006-C04: Empty results → MRR = 0', () => {
    expect(computeMRR([], [makeGT(1, 2)])).toBe(0);
  });

  it('T006-C05: Empty ground truth → MRR = 0', () => {
    expect(computeMRR([makeResult(1, 1)], [])).toBe(0);
  });

  it('T006-C06: Relevant at rank 2 → MRR = 0.5', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const gt = [makeGT(1, 0), makeGT(2, 1)];
    expect(computeMRR(results, gt)).toBeCloseTo(0.5, 5);
  });

  it('T006-C07: Custom k=1 — relevant item only at rank 2 → MRR = 0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const gt = [makeGT(1, 0), makeGT(2, 3)];
    expect(computeMRR(results, gt, 1)).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   CORE: NDCG@10
──────────────────────────────────────────────────────────────── */

describe('NDCG@10 (Normalized Discounted Cumulative Gain)', () => {
  it('T006-C08: Perfect ranking → NDCG = 1.0', () => {
    // Sorted highest relevance first = ideal
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 3), makeGT(2, 2), makeGT(3, 1)];
    expect(computeNDCG(results, gt)).toBeCloseTo(1.0, 5);
  });

  it('T006-C09: Inverted ranking → NDCG < 1.0', () => {
    // Worst first, best last
    const results = [makeResult(3, 1), makeResult(2, 2), makeResult(1, 3)];
    const gt = [makeGT(1, 3), makeGT(2, 2), makeGT(3, 1)];
    const ndcg = computeNDCG(results, gt);
    expect(ndcg).toBeGreaterThan(0);
    expect(ndcg).toBeLessThan(1);
  });

  it('T006-C10: Empty results → NDCG = 0.0', () => {
    const gt = [makeGT(1, 3), makeGT(2, 2)];
    expect(computeNDCG([], gt)).toBe(0);
  });

  it('T006-C11: Empty ground truth → NDCG = 0.0', () => {
    expect(computeNDCG([makeResult(1, 1)], [])).toBe(0);
  });

  it('T006-C12: All results have relevance 0 → NDCG = 0.0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const gt = [makeGT(1, 0), makeGT(2, 0)];
    expect(computeNDCG(results, gt)).toBe(0);
  });

  it('T006-C13: NDCG value is always in [0, 1]', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(2, 3), makeGT(1, 1), makeGT(3, 2)];
    const ndcg = computeNDCG(results, gt);
    expect(ndcg).toBeGreaterThanOrEqual(0);
    expect(ndcg).toBeLessThanOrEqual(1);
  });
});

/* ───────────────────────────────────────────────────────────────
   CORE: Recall@20
──────────────────────────────────────────────────────────────── */

describe('Recall@20', () => {
  it('T006-C14: All relevant found in top 20 → Recall = 1.0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 2), makeGT(2, 1), makeGT(3, 3)];
    expect(computeRecall(results, gt)).toBeCloseTo(1.0, 5);
  });

  it('T006-C15: Half of relevant found → Recall = 0.5', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const gt = [makeGT(1, 2), makeGT(2, 0), makeGT(3, 2), makeGT(4, 2)]; // 3 relevant, 2 found
    // Relevant: 1 and 3 and 4. found: 1 (yes), 2 (not relevant). hits=1, total=3 → 1/3
    // Let's use a cleaner case: relevant = {1, 2}, found = {1}
    const results2 = [makeResult(1, 1), makeResult(99, 2)];
    const gt2 = [makeGT(1, 2), makeGT(2, 2)]; // 2 relevant, only 1 found
    expect(computeRecall(results2, gt2)).toBeCloseTo(0.5, 5);
  });

  it('T006-C16: None found → Recall = 0.0', () => {
    const results = [makeResult(10, 1), makeResult(20, 2)];
    const gt = [makeGT(1, 2), makeGT(2, 3)]; // different IDs
    expect(computeRecall(results, gt)).toBe(0);
  });

  it('T006-C17: Empty results → Recall = 0', () => {
    expect(computeRecall([], [makeGT(1, 2)])).toBe(0);
  });

  it('T006-C18: No relevant items in ground truth → Recall = 0', () => {
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 0)];
    expect(computeRecall(results, gt)).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   CORE: Hit Rate@1
──────────────────────────────────────────────────────────────── */

describe('Hit Rate@1', () => {
  it('T006-C19: Top result is relevant → Hit Rate = 1.0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const gt = [makeGT(1, 2), makeGT(2, 0)];
    expect(computeHitRate(results, gt)).toBe(1);
  });

  it('T006-C20: Top result is not relevant → Hit Rate = 0.0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const gt = [makeGT(1, 0), makeGT(2, 3)];
    expect(computeHitRate(results, gt)).toBe(0);
  });

  it('T006-C21: Empty results → Hit Rate = 0', () => {
    expect(computeHitRate([], [makeGT(1, 2)])).toBe(0);
  });

  it('T006-C22: Empty ground truth → Hit Rate = 0', () => {
    expect(computeHitRate([makeResult(1, 1)], [])).toBe(0);
  });

  it('T006-C23: Custom k=3, relevant at rank 2 → Hit Rate = 1', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 0), makeGT(2, 2), makeGT(3, 0)];
    expect(computeHitRate(results, gt, 3)).toBe(1);
  });
});

/* ───────────────────────────────────────────────────────────────
   DIAGNOSTIC: T006a — Inversion Rate
──────────────────────────────────────────────────────────────── */

describe('T006a: Inversion Rate', () => {
  it('T006-D01: Perfect ordering (high relevance first) → Inversion Rate = 0.0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 3), makeGT(2, 2), makeGT(3, 1)];
    expect(computeInversionRate(results, gt)).toBe(0);
  });

  it('T006-D02: Fully inverted (worst first, best last) → Inversion Rate = 1.0', () => {
    const results = [makeResult(3, 1), makeResult(2, 2), makeResult(1, 3)];
    const gt = [makeGT(1, 3), makeGT(2, 2), makeGT(3, 1)];
    // Pairs: (3,2): rel=1 vs rel=2 → inverted; (3,1): rel=1 vs rel=3 → inverted; (2,1): rel=2 vs rel=3 → inverted
    // 3 inversions / 3 pairs = 1.0
    expect(computeInversionRate(results, gt)).toBeCloseTo(1.0, 5);
  });

  it('T006-D03: Single result → Inversion Rate = 0 (no pairs)', () => {
    expect(computeInversionRate([makeResult(1, 1)], [makeGT(1, 2)])).toBe(0);
  });

  it('T006-D04: Empty results → Inversion Rate = 0', () => {
    expect(computeInversionRate([], [makeGT(1, 2)])).toBe(0);
  });

  it('T006-D05: Partial inversion → Inversion Rate between 0 and 1', () => {
    // Results: rank1=id1(rel=3), rank2=id3(rel=1), rank3=id2(rel=2)
    const results = [makeResult(1, 1), makeResult(3, 2), makeResult(2, 3)];
    const gt = [makeGT(1, 3), makeGT(2, 2), makeGT(3, 1)];
    // Pairs: (id1,id3): 3 vs 1 — ok; (id1,id2): 3 vs 2 — ok; (id3,id2): 1 vs 2 — inverted
    // 1 inversion / 3 pairs ≈ 0.333
    expect(computeInversionRate(results, gt)).toBeCloseTo(1 / 3, 4);
  });

  it('T006-D06: All results have same relevance → Inversion Rate = 0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 2), makeGT(2, 2), makeGT(3, 2)];
    expect(computeInversionRate(results, gt)).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   DIAGNOSTIC: T006b — Constitutional Surfacing Rate
──────────────────────────────────────────────────────────────── */

describe('T006b: Constitutional Surfacing Rate', () => {
  it('T006-D07: Constitutional memory in top-5 → rate = 1.0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(100, 3)];
    const constitutionalIds = [100];
    expect(computeConstitutionalSurfacingRate(results, constitutionalIds)).toBe(1);
  });

  it('T006-D08: Constitutional memory not in results → rate = 0.0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const constitutionalIds = [99, 100];
    expect(computeConstitutionalSurfacingRate(results, constitutionalIds)).toBe(0);
  });

  it('T006-D09: Constitutional memory present but beyond top-k=2 → rate = 0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(100, 3)];
    const constitutionalIds = [100];
    expect(computeConstitutionalSurfacingRate(results, constitutionalIds, 2)).toBe(0);
  });

  it('T006-D10: Empty constitutionalIds → rate = 0', () => {
    const results = [makeResult(1, 1)];
    expect(computeConstitutionalSurfacingRate(results, [])).toBe(0);
  });

  it('T006-D11: Empty results → rate = 0', () => {
    expect(computeConstitutionalSurfacingRate([], [1, 2])).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   DIAGNOSTIC: T006c — Importance-Weighted Recall
──────────────────────────────────────────────────────────────── */

describe('T006c: Importance-Weighted Recall', () => {
  it('T006-D12: All relevant found — constitutional weighted 3x → higher than unweighted', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    // Id=1 is constitutional (weight 3), id=2 is normal (weight 1)
    const gt = [makeGT(1, 2, 'constitutional'), makeGT(2, 2, 'normal'), makeGT(3, 2, 'normal')];
    // Found: id1 (weight=3) + id2 (weight=1) = 4 out of total 3+1+1=5 → 4/5 = 0.8
    expect(computeImportanceWeightedRecall(results, gt)).toBeCloseTo(0.8, 4);
  });

  it('T006-D13: Weighted recall ≠ unweighted recall when tiers differ', () => {
    const results = [makeResult(1, 1)];
    // Id=1 is constitutional, id=2 is normal — only id=1 found
    const gt = [makeGT(1, 2, 'constitutional'), makeGT(2, 2, 'normal')];
    const unweighted = computeRecall(results, gt);      // 1/2 = 0.5
    const weighted = computeImportanceWeightedRecall(results, gt); // 3/(3+1) = 0.75
    expect(weighted).toBeGreaterThan(unweighted);
    expect(weighted).toBeCloseTo(0.75, 4);
  });

  it('T006-D14: All relevant found → weighted recall = 1.0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const gt = [makeGT(1, 2, 'critical'), makeGT(2, 1, 'normal')];
    expect(computeImportanceWeightedRecall(results, gt)).toBeCloseTo(1.0, 5);
  });

  it('T006-D15: No relevant items → weighted recall = 0', () => {
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 0, 'normal')];
    expect(computeImportanceWeightedRecall(results, gt)).toBe(0);
  });

  it('T006-D16: Custom tier weights override defaults', () => {
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 2, 'custom'), makeGT(2, 2, 'custom')];
    const customWeights = { custom: 5 };
    // Found: id1 (weight=5) out of total 5+5=10 → 5/10 = 0.5
    expect(computeImportanceWeightedRecall(results, gt, customWeights)).toBeCloseTo(0.5, 5);
  });

  it('T006-D17: Duplicate memoryIds in results do not inflate weighted recall', () => {
    // Id=1 appears 3 times in results but should count only once
    const results = [makeResult(1, 1), makeResult(1, 2), makeResult(1, 3), makeResult(2, 4)];
    const gt = [makeGT(1, 2, 'constitutional'), makeGT(2, 2, 'normal'), makeGT(3, 2, 'normal')];
    // Found: id1 (weight=3) + id2 (weight=1) = 4 out of total 3+1+1=5 → 4/5 = 0.8
    expect(computeImportanceWeightedRecall(results, gt)).toBeCloseTo(0.8, 4);
  });
});

/* ───────────────────────────────────────────────────────────────
   DIAGNOSTIC: T006d — Cold-Start Detection Rate
──────────────────────────────────────────────────────────────── */

describe('T006d: Cold-Start Detection Rate', () => {
  it('T006-D17: Recent relevant memory surfaced → rate = 1.0', () => {
    const recentDate = new Date(Date.now() - 10 * 60 * 60 * 1000); // 10h ago
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 2, undefined, recentDate)];
    const timestamps = { 1: recentDate };
    expect(computeColdStartDetectionRate(results, gt, timestamps)).toBe(1);
  });

  it('T006-D18: Only old memories — no cold-start candidates → rate = 0.0', () => {
    const oldDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 2)];
    const timestamps = { 1: oldDate };
    expect(computeColdStartDetectionRate(results, gt, timestamps)).toBe(0);
  });

  it('T006-D19: Recent memory present but not retrieved → rate = 0.0', () => {
    const recentDate = new Date(Date.now() - 10 * 60 * 60 * 1000); // 10h ago
    const results = [makeResult(99, 1)]; // id 99 retrieved, not id 1
    const gt = [makeGT(1, 2)];
    const timestamps = { 1: recentDate };
    expect(computeColdStartDetectionRate(results, gt, timestamps)).toBe(0);
  });

  it('T006-D19b: Top-K semantics only inspect the first K ranked results', () => {
    const recentDate = new Date(Date.now() - 10 * 60 * 60 * 1000); // 10h ago
    const results = [
      makeResult(99, 1),
      makeResult(98, 2),
      makeResult(97, 3),
      makeResult(96, 4),
      makeResult(95, 5),
      makeResult(94, 6),
      makeResult(93, 7),
      makeResult(92, 8),
      makeResult(91, 9),
      makeResult(90, 10),
      makeResult(1, 11),
    ];
    const gt = [makeGT(1, 2)];
    const timestamps = { 1: recentDate };

    expect(computeColdStartDetectionRate(results, gt, timestamps, 48, 10)).toBe(0);
    expect(computeColdStartDetectionRate(results, gt, timestamps, 48, 100)).toBe(1);
  });

  it('T006-D20: Custom cutoff hours — 2h cutoff, memory 3h old → not cold-start', () => {
    const date3hAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 2)];
    const timestamps = { 1: date3hAgo };
    expect(computeColdStartDetectionRate(results, gt, timestamps, 2)).toBe(0);
  });

  it('T006-D21: Empty results → rate = 0', () => {
    const recentDate = new Date(Date.now() - 1000);
    const gt = [makeGT(1, 2)];
    const timestamps = { 1: recentDate };
    expect(computeColdStartDetectionRate([], gt, timestamps)).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   DIAGNOSTIC: T006e — Intent-Weighted NDCG
──────────────────────────────────────────────────────────────── */

describe('T006e: Intent-Weighted NDCG', () => {
  it('T006-D22: Different intents produce different scores with same data', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 1), makeGT(2, 2), makeGT(3, 3)];

    const securityScore = computeIntentWeightedNDCG(results, gt, 'security_audit');
    const understandScore = computeIntentWeightedNDCG(results, gt, 'understand');

    // Security_audit zeros out partial relevance (grade 1 → 0), so ranking matters differently
    expect(typeof securityScore).toBe('number');
    expect(typeof understandScore).toBe('number');
    expect(securityScore).not.toBeCloseTo(understandScore, 2);
  });

  it('T006-D23: Perfect ranking for fix_bug intent → score in (0, 1]', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 3), makeGT(2, 2), makeGT(3, 1)];
    const score = computeIntentWeightedNDCG(results, gt, 'fix_bug');
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it('T006-D24: Unknown intent falls back to default weights', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const gt = [makeGT(1, 3), makeGT(2, 1)];
    const score = computeIntentWeightedNDCG(results, gt, 'unknown_intent');
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it('T006-D25: Empty results → intent-weighted NDCG = 0', () => {
    expect(computeIntentWeightedNDCG([], [makeGT(1, 2)], 'add_feature')).toBe(0);
  });

  it('T006-D26: security_audit with only partial relevance (grade=1) → NDCG = 0 (weight 0)', () => {
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 1)]; // grade 1 → security_audit multiplier is 0
    expect(computeIntentWeightedNDCG(results, gt, 'security_audit')).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   CONVENIENCE: computeAllMetrics
──────────────────────────────────────────────────────────────── */

describe('computeAllMetrics (convenience wrapper)', () => {
  it('T006-E01: Returns all 12 metric keys', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const gt = [makeGT(1, 3), makeGT(2, 1)];
    const metrics = computeAllMetrics({ results, groundTruth: gt });

    expect(Object.keys(metrics)).toEqual([
      'mrr',
      'ndcg',
      'recall',
      'precision',
      'f1',
      'map',
      'hitRate',
      'inversionRate',
      'constitutionalSurfacingRate',
      'importanceWeightedRecall',
      'coldStartDetectionRate',
      'intentWeightedNdcg',
    ]);
  });

  it('T006-E02: All metric values are in [0, 1]', () => {
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 3, 'constitutional'), makeGT(2, 2, 'important'), makeGT(3, 1)];
    const recentDate = new Date(Date.now() - 5 * 60 * 60 * 1000);
    const metrics = computeAllMetrics({
      results,
      groundTruth: gt,
      constitutionalIds: [1],
      memoryTimestamps: { 1: recentDate },
      intentType: 'add_feature',
    });

    for (const [key, value] of Object.entries(metrics)) {
      expect(value, `${key} out of [0,1]`).toBeGreaterThanOrEqual(0);
      expect(value, `${key} out of [0,1]`).toBeLessThanOrEqual(1);
    }
  });

  it('T006-E03: Empty inputs return all zeros (no NaN or Infinity)', () => {
    const metrics = computeAllMetrics({ results: [], groundTruth: [] });

    for (const [key, value] of Object.entries(metrics)) {
      expect(Number.isFinite(value), `${key} should be finite`).toBe(true);
      expect(value, `${key} should be 0 for empty input`).toBe(0);
    }
  });

  it('T006-E04: constitutionalIds and memoryTimestamps default gracefully', () => {
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 2)];
    // No optional params — should not throw
    expect(() => computeAllMetrics({ results, groundTruth: gt })).not.toThrow();
  });
});

/* ───────────────────────────────────────────────────────────────
   EDGE CASES (cross-metric)
──────────────────────────────────────────────────────────────── */

describe('Edge Cases', () => {
  it('T006-F01: Single item — all metrics handle without error', () => {
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 2)];
    expect(() => computeAllMetrics({ results, groundTruth: gt, constitutionalIds: [1] })).not.toThrow();
  });

  it('T006-F02: All items have relevance 0 — recall and MRR = 0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const gt = [makeGT(1, 0), makeGT(2, 0)];
    expect(computeMRR(results, gt)).toBe(0);
    expect(computeRecall(results, gt)).toBe(0);
  });

  it('T006-F03: Result IDs not in ground truth — treated as relevance 0', () => {
    const results = [makeResult(999, 1)];
    const gt = [makeGT(1, 3)]; // id 999 not in ground truth
    expect(computeMRR(results, gt)).toBe(0);
    expect(computeHitRate(results, gt)).toBe(0);
    expect(computeInversionRate(results, gt)).toBe(0);
  });

  it('T006-F04: No NaN or Infinity in any metric output', () => {
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 0)]; // relevance 0 everywhere
    const metrics = computeAllMetrics({ results, groundTruth: gt });
    for (const value of Object.values(metrics)) {
      expect(Number.isFinite(value)).toBe(true);
    }
  });

  it('T006-F05: Non-positive or non-finite k yields safe zero outputs', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const gt = [makeGT(1, 2), makeGT(2, 1)];

    expect(computeMRR(results, gt, 0)).toBe(0);
    expect(computeNDCG(results, gt, -3)).toBe(0);
    expect(computeRecall(results, gt, 0)).toBe(0);
    expect(computeHitRate(results, gt, -1)).toBe(0);
    expect(computeMAP(results, gt, Number.NaN)).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   DUPLICATE-ID HANDLING: Precision/F1 (T005)
──────────────────────────────────────────────────────────────── */

describe('T005: Duplicate-ID handling in Precision/F1', () => {
  it('T005-01: computePrecision deduplicates repeated relevant IDs', () => {
    const results = [makeResult(1, 1), makeResult(1, 2), makeResult(99, 3)];
    const gt = [makeGT(1, 3)];
    expect(computePrecision(results, gt, 3)).toBeCloseTo(1 / 3, 5);
  });

  it('T005-02: computeF1 matches harmonic mean of deduped precision and recall', () => {
    const results = [makeResult(1, 1), makeResult(1, 2), makeResult(2, 3)];
    const gt = [makeGT(1, 2), makeGT(2, 2)];

    const precision = computePrecision(results, gt, 3);
    const recall = computeRecall(results, gt, 3);
    const expectedF1 = (2 * precision * recall) / (precision + recall);

    expect(computeF1(results, gt, 3)).toBeCloseTo(expectedF1, 5);
  });

  it('T005-03: all results with same relevant ID count as at most one hit', () => {
    const results = [makeResult(7, 1), makeResult(7, 2), makeResult(7, 3), makeResult(7, 4)];
    const gt = [makeGT(7, 3)];

    expect(computePrecision(results, gt, 4)).toBeCloseTo(1 / 4, 5);
    expect(computeRecall(results, gt, 4)).toBe(1);
    expect(computeF1(results, gt, 4)).toBeCloseTo(0.4, 5);
  });
});

/* ───────────────────────────────────────────────────────────────
   computeMAP — Mean Average Precision (CHK-088)
──────────────────────────────────────────────────────────────── */

describe('computeMAP', () => {
  it('MAP-01: Perfect ranking — MAP equals 1.0', () => {
    // Results perfectly ordered: relevant items at top
    const results = [makeResult(1, 1), makeResult(2, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 3), makeGT(2, 2), makeGT(3, 1)];
    expect(computeMAP(results, gt, 3)).toBeCloseTo(1.0, 4);
  });

  it('MAP-02: Partial ranking — relevant items not all at top', () => {
    // Relevant: 1, 3. Results: 1, 99, 3 → P@1=1/1, P@3=2/3
    // AP = (1/2)(1 + 2/3) = 5/6 ≈ 0.8333
    const results = [makeResult(1, 1), makeResult(99, 2), makeResult(3, 3)];
    const gt = [makeGT(1, 2), makeGT(3, 1)];
    expect(computeMAP(results, gt, 3)).toBeCloseTo(5 / 6, 4);
  });

  it('MAP-03: No relevant results — MAP is 0', () => {
    const results = [makeResult(99, 1), makeResult(98, 2)];
    const gt = [makeGT(1, 3)];
    expect(computeMAP(results, gt, 2)).toBe(0);
  });

  it('MAP-04: Empty results — MAP is 0', () => {
    const gt = [makeGT(1, 3)];
    expect(computeMAP([], gt, 5)).toBe(0);
  });

  it('MAP-05: Empty ground truth — MAP is 0', () => {
    const results = [makeResult(1, 1)];
    expect(computeMAP(results, [], 5)).toBe(0);
  });

  it('MAP-06: Single relevant result at position 1 — MAP is 1.0', () => {
    const results = [makeResult(1, 1), makeResult(2, 2)];
    const gt = [makeGT(1, 2)];
    expect(computeMAP(results, gt, 2)).toBeCloseTo(1.0, 4);
  });

  it('MAP-07: computeAllMetrics includes map field', () => {
    const results = [makeResult(1, 1)];
    const gt = [makeGT(1, 2)];
    const metrics = computeAllMetrics({ results, groundTruth: gt });
    expect(metrics).toHaveProperty('map');
    expect(typeof metrics.map).toBe('number');
  });
});
