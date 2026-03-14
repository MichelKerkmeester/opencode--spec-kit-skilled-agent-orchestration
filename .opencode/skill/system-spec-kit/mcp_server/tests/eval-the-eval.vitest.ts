// ───────────────────────────────────────────────────────────────
// 1. TEST — EVAL THE EVAL
// ───────────────────────────────────────────────────────────────
// Eval-the-Eval Validation (Hand-Calculate MRR@5 & NDCG@10)
//
// PURPOSE: Validate that computeMRR and computeNDCG produce correct
// Results by comparing to hand-calculated expected values.
// Tolerance: ±0.01 on every assertion.
//
// This file IS the "eval-the-eval" deliverable. The hand-calculation
// Comments show full working — they are not incidental documentation.
//
// HAND-CALC REFERENCE — computeMRR implementation (eval-metrics.ts):
// 1. buildRelevanceMap(groundTruth) → Map<memoryId, relevance>
// 2. topK(results, k) → sort by rank asc, slice first k
// 3. Iterate 0-indexed through topK:
// If relevance > 0 → return 1 / (i + 1)   [1-based rank]
// 4. If no relevant found → return 0
//
// HAND-CALC REFERENCE — computeNDCG implementation (eval-metrics.ts):
// DCG  = Σ rel_i / log2(i+2)  for i = 0..k-1  (0-indexed over topK)
// IDCG = DCG of ideal ranking (sort all GT relevances desc, take top-k)
// NDCG = min(1, DCG / IDCG)
//
// Log2 values used below:
// Log2(2) = 1.000000
// Log2(3) = 1.584963
// Log2(4) = 2.000000
// Log2(5) = 2.321928
// Log2(6) = 2.584963

import { describe, it, expect } from 'vitest';
import { computeMRR, computeNDCG } from '../lib/eval/eval-metrics';
import type { EvalResult, GroundTruthEntry } from '../lib/eval/eval-metrics';

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

function makeResult(memoryId: number, rank: number, score = 1.0): EvalResult {
  return { memoryId, rank, score };
}

function makeGT(memoryId: number, relevance: number): GroundTruthEntry {
  return { queryId: 1, memoryId, relevance };
}

/* ───────────────────────────────────────────────────────────────
   DISCREPANCY LOG — populated during test execution
──────────────────────────────────────────────────────────────── */

interface DiscrepancyRecord {
  scenario: string;
  metric: string;
  expected: number;
  computed: number;
  delta: number;
  status: 'PASS' | 'FAIL';
}

const discrepancyLog: DiscrepancyRecord[] = [];

function logAndAssert(
  scenario: string,
  metric: string,
  expected: number,
  computed: number,
  tolerance = 0.01,
): void {
  const delta = Math.abs(computed - expected);
  const status: 'PASS' | 'FAIL' = delta <= tolerance ? 'PASS' : 'FAIL';
  discrepancyLog.push({ scenario, metric, expected, computed, delta, status });

  // Fail the test if over tolerance (vitest assertion carries the test name)
  expect(
    delta,
    `[${scenario}] ${metric}: expected=${expected.toFixed(6)}, computed=${computed.toFixed(6)}, delta=${delta.toFixed(6)} > tolerance ${tolerance}`,
  ).toBeLessThanOrEqual(tolerance);
}

/* ───────────────────────────────────────────────────────────────
   MRR@5 — 5 HAND-CALCULATED SCENARIOS
──────────────────────────────────────────────────────────────── */

describe('T013: MRR@5 — Hand-Calculated Validation (eval-the-eval)', () => {
  // SCENARIO 1: First relevant result at rank 1
  //
  // Results (by rank):
  // Rank 1 → mem:10   rank 2 → mem:20   rank 3 → mem:30
  // Rank 4 → mem:40   rank 5 → mem:50
  //
  // Ground truth relevance:
  // Mem:10 = 3  (highly relevant)
  // All others = 0
  //
  // Hand calculation:
  // TopK(results, 5) → [mem:10, mem:20, mem:30, mem:40, mem:50]
  // I=0: mem:10 → rel=3 > 0 → RETURN 1/(0+1) = 1/1 = 1.000
  //
  // MRR@5 = 1.000
  it('T013-MRR-1: First relevant at rank 1 → MRR = 1.000', () => {
    const results = [
      makeResult(10, 1),
      makeResult(20, 2),
      makeResult(30, 3),
      makeResult(40, 4),
      makeResult(50, 5),
    ];
    const groundTruth = [
      makeGT(10, 3), // highly relevant — at rank 1
      makeGT(20, 0),
      makeGT(30, 0),
      makeGT(40, 0),
      makeGT(50, 0),
    ];

    const expected = 1.000;
    const computed = computeMRR(results, groundTruth, 5);
    logAndAssert('T013-MRR-1', 'MRR@5', expected, computed);
  });

  // SCENARIO 2: First relevant result at rank 3
  //
  // Results (by rank):
  // Rank 1 → mem:10   rank 2 → mem:20   rank 3 → mem:30
  // Rank 4 → mem:40   rank 5 → mem:50
  //
  // Ground truth relevance:
  // Mem:30 = 2  (relevant)
  // All others = 0
  //
  // Hand calculation:
  // TopK(results, 5) → [mem:10, mem:20, mem:30, mem:40, mem:50]
  // I=0: mem:10 → rel=0 → skip
  // I=1: mem:20 → rel=0 → skip
  // I=2: mem:30 → rel=2 > 0 → RETURN 1/(2+1) = 1/3 ≈ 0.333333
  //
  // MRR@5 ≈ 0.333
  it('T013-MRR-2: First relevant at rank 3 → MRR ≈ 0.333', () => {
    const results = [
      makeResult(10, 1),
      makeResult(20, 2),
      makeResult(30, 3),
      makeResult(40, 4),
      makeResult(50, 5),
    ];
    const groundTruth = [
      makeGT(10, 0),
      makeGT(20, 0),
      makeGT(30, 2), // relevant — at rank 3
      makeGT(40, 0),
      makeGT(50, 0),
    ];

    const expected = 1 / 3; // 0.333333...
    const computed = computeMRR(results, groundTruth, 5);
    logAndAssert('T013-MRR-2', 'MRR@5', expected, computed);
  });

  // SCENARIO 3: Multiple relevant results, first relevant at rank 2
  //
  // Results (by rank):
  // Rank 1 → mem:10   rank 2 → mem:20   rank 3 → mem:30
  // Rank 4 → mem:40   rank 5 → mem:50
  //
  // Ground truth relevance:
  // Mem:20 = 3  (highly relevant — at rank 2)
  // Mem:40 = 2  (relevant — at rank 4)
  // All others = 0
  //
  // Hand calculation (MRR uses FIRST relevant rank only):
  // TopK(results, 5) → [mem:10, mem:20, mem:30, mem:40, mem:50]
  // I=0: mem:10 → rel=0 → skip
  // I=1: mem:20 → rel=3 > 0 → RETURN 1/(1+1) = 1/2 = 0.500
  // (mem:40 at i=3 is never reached — function returns early)
  //
  // MRR@5 = 0.500
  it('T013-MRR-3: Multiple relevant, first at rank 2 → MRR = 0.500', () => {
    const results = [
      makeResult(10, 1),
      makeResult(20, 2),
      makeResult(30, 3),
      makeResult(40, 4),
      makeResult(50, 5),
    ];
    const groundTruth = [
      makeGT(10, 0),
      makeGT(20, 3), // highly relevant — at rank 2 (first relevant)
      makeGT(30, 0),
      makeGT(40, 2), // relevant — at rank 4 (second relevant, ignored for MRR)
      makeGT(50, 0),
    ];

    const expected = 0.500;
    const computed = computeMRR(results, groundTruth, 5);
    logAndAssert('T013-MRR-3', 'MRR@5', expected, computed);
  });

  // SCENARIO 4: No relevant result in top 5
  //
  // Results (by rank):
  // Rank 1 → mem:10   rank 2 → mem:20   rank 3 → mem:30
  // Rank 4 → mem:40   rank 5 → mem:50
  //
  // Ground truth relevance:
  // Mem:99 = 3  (highly relevant, but NOT in results)
  // All result IDs have relevance 0 (not in GT → treated as 0)
  //
  // Hand calculation:
  // TopK(results, 5) → [mem:10, mem:20, mem:30, mem:40, mem:50]
  // I=0: mem:10 → relevanceMap.get(10) = undefined → ?? 0 → skip
  // I=1: mem:20 → relevanceMap.get(20) = undefined → ?? 0 → skip
  // I=2: mem:30 → relevanceMap.get(30) = undefined → ?? 0 → skip
  // I=3: mem:40 → relevanceMap.get(40) = undefined → ?? 0 → skip
  // I=4: mem:50 → relevanceMap.get(50) = undefined → ?? 0 → skip
  // Loop ends → RETURN 0
  //
  // MRR@5 = 0.000
  it('T013-MRR-4: No relevant in top 5 → MRR = 0.000', () => {
    const results = [
      makeResult(10, 1),
      makeResult(20, 2),
      makeResult(30, 3),
      makeResult(40, 4),
      makeResult(50, 5),
    ];
    const groundTruth = [
      makeGT(99, 3), // highly relevant — NOT in results
    ];

    const expected = 0.000;
    const computed = computeMRR(results, groundTruth, 5);
    logAndAssert('T013-MRR-4', 'MRR@5', expected, computed);
  });

  // SCENARIO 5: Relevant result at rank 5 (boundary case)
  //
  // Results (by rank):
  // Rank 1 → mem:10   rank 2 → mem:20   rank 3 → mem:30
  // Rank 4 → mem:40   rank 5 → mem:50
  //
  // Ground truth relevance:
  // Mem:50 = 1  (partially relevant — at rank 5)
  // All others = 0
  //
  // Hand calculation:
  // TopK(results, 5) → [mem:10, mem:20, mem:30, mem:40, mem:50]
  // I=0: mem:10 → rel=0 → skip
  // I=1: mem:20 → rel=0 → skip
  // I=2: mem:30 → rel=0 → skip
  // I=3: mem:40 → rel=0 → skip
  // I=4: mem:50 → rel=1 > 0 → RETURN 1/(4+1) = 1/5 = 0.200
  //
  // MRR@5 = 0.200
  it('T013-MRR-5: Relevant at rank 5 (boundary) → MRR = 0.200', () => {
    const results = [
      makeResult(10, 1),
      makeResult(20, 2),
      makeResult(30, 3),
      makeResult(40, 4),
      makeResult(50, 5),
    ];
    const groundTruth = [
      makeGT(10, 0),
      makeGT(20, 0),
      makeGT(30, 0),
      makeGT(40, 0),
      makeGT(50, 1), // partially relevant — at rank 5 (k boundary)
    ];

    const expected = 0.200;
    const computed = computeMRR(results, groundTruth, 5);
    logAndAssert('T013-MRR-5', 'MRR@5', expected, computed);
  });
});

/* ───────────────────────────────────────────────────────────────
   NDCG@10 — 2 HAND-CALCULATED SCENARIOS
──────────────────────────────────────────────────────────────── */

describe('T013: NDCG@10 — Hand-Calculated Validation (eval-the-eval)', () => {
  // NDCG SCENARIO A: Perfect ranking (DCG = IDCG → NDCG = 1.0)
  //
  // Results (by rank):
  // Rank 1 → mem:1 (rel=3)
  // Rank 2 → mem:2 (rel=2)
  // Rank 3 → mem:3 (rel=1)
  //
  // Ground truth: mem:1=3, mem:2=2, mem:3=1
  //
  // Hand calculation of DCG (0-indexed):
  // I=0 (rank 1): rel=3, divisor=log2(0+2)=log2(2)=1.000000
  // Contribution = 3 / 1.000000 = 3.000000
  // I=1 (rank 2): rel=2, divisor=log2(1+2)=log2(3)=1.584963
  // Contribution = 2 / 1.584963 = 1.261860
  // I=2 (rank 3): rel=1, divisor=log2(2+2)=log2(4)=2.000000
  // Contribution = 1 / 2.000000 = 0.500000
  // DCG = 3.000000 + 1.261860 + 0.500000 = 4.761860
  //
  // Hand calculation of IDCG:
  // Ideal ordering (sort GT relevances desc): [3, 2, 1]
  // I=0: 3 / log2(2) = 3 / 1.000000 = 3.000000
  // I=1: 2 / log2(3) = 2 / 1.584963 = 1.261860
  // I=2: 1 / log2(4) = 1 / 2.000000 = 0.500000
  // IDCG = 4.761860
  //
  // NDCG = min(1, DCG / IDCG) = min(1, 4.761860 / 4.761860) = min(1, 1.0) = 1.000
  it('T013-NDCG-A: Perfect ranking (3 items, already ideal) → NDCG = 1.000', () => {
    const results = [
      makeResult(1, 1),
      makeResult(2, 2),
      makeResult(3, 3),
    ];
    const groundTruth = [
      makeGT(1, 3), // highly relevant → rank 1 ✓
      makeGT(2, 2), // relevant        → rank 2 ✓
      makeGT(3, 1), // partial         → rank 3 ✓
    ];

    // Hand-calculated:
    // DCG  = 3/log2(2) + 2/log2(3) + 1/log2(4) = 3.000000 + 1.261860 + 0.500000 = 4.761860
    // IDCG = 3/log2(2) + 2/log2(3) + 1/log2(4) = 4.761860  (same — ideal = actual)
    // NDCG = 4.761860 / 4.761860 = 1.000
    const expected = 1.000;
    const computed = computeNDCG(results, groundTruth, 10);
    logAndAssert('T013-NDCG-A', 'NDCG@10', expected, computed);
  });

  // NDCG SCENARIO B: Imperfect ranking (worst-first ordering)
  //
  // Results (by rank):
  // Rank 1 → mem:3 (GT rel=1)   ← worst placed first
  // Rank 2 → mem:2 (GT rel=2)
  // Rank 3 → mem:1 (GT rel=3)   ← best placed last
  //
  // Ground truth: mem:1=3, mem:2=2, mem:3=1
  //
  // Hand calculation of DCG (actual retrieval order):
  // I=0 (rank 1): mem:3 rel=1, divisor=log2(2)=1.000000
  // Contribution = 1 / 1.000000 = 1.000000
  // I=1 (rank 2): mem:2 rel=2, divisor=log2(3)=1.584963
  // Contribution = 2 / 1.584963 = 1.261860
  // I=2 (rank 3): mem:1 rel=3, divisor=log2(4)=2.000000
  // Contribution = 3 / 2.000000 = 1.500000
  // DCG = 1.000000 + 1.261860 + 1.500000 = 3.761860
  //
  // Hand calculation of IDCG:
  // Ideal ordering (sort GT relevances desc): [3, 2, 1]
  // I=0: 3 / log2(2) = 3.000000
  // I=1: 2 / log2(3) = 1.261860
  // I=2: 1 / log2(4) = 0.500000
  // IDCG = 4.761860
  //
  // NDCG = min(1, DCG / IDCG) = min(1, 3.761860 / 4.761860) = 0.789990
  //
  // Simplified check: 3.761860 / 4.761860 ≈ 0.790
  // Verify: 0.790 × 4.761860 = 3.761869 ≈ 3.761860 ✓
  it('T013-NDCG-B: Worst-first ranking (3 items reversed) → NDCG ≈ 0.790', () => {
    const results = [
      makeResult(3, 1), // rel=1 placed first (worst)
      makeResult(2, 2), // rel=2 placed second
      makeResult(1, 3), // rel=3 placed third (best)
    ];
    const groundTruth = [
      makeGT(1, 3),
      makeGT(2, 2),
      makeGT(3, 1),
    ];

    // Hand-calculated:
    // DCG  = 1/log2(2) + 2/log2(3) + 3/log2(4) = 1.000000 + 1.261860 + 1.500000 = 3.761860
    // IDCG = 3/log2(2) + 2/log2(3) + 1/log2(4) = 3.000000 + 1.261860 + 0.500000 = 4.761860
    // NDCG = 3.761860 / 4.761860 ≈ 0.789990
    const expected = 3.761860 / 4.761860; // ≈ 0.78999
    const computed = computeNDCG(results, groundTruth, 10);
    logAndAssert('T013-NDCG-B', 'NDCG@10', expected, computed);
  });
});

/* ───────────────────────────────────────────────────────────────
   DISCREPANCY LOG SUMMARY — printed after all scenarios run
──────────────────────────────────────────────────────────────── */

describe('T013: Discrepancy Log Summary', () => {
  it('T013-SUMMARY: prints discrepancy table and asserts zero failures', () => {
    // This test runs after all scenario tests have populated discrepancyLog.
    // In vitest, describe blocks run sequentially within a file, so by the
    // Time this executes, the log should have all 7 entries (5 MRR + 2 NDCG).
    //
    // If individual scenario tests above failed, this summary is informational.
    // If all passed, this confirms zero discrepancies.

    const header = [
      '',
      '╔══════════════════════════════════════════════════════════════════════════════════╗',
      '║  T013 EVAL-THE-EVAL — DISCREPANCY LOG                                          ║',
      '╠══════════════════════════════════════════════════════════════════════════════════╣',
      '║  Scenario        │ Metric   │  Expected  │  Computed  │   Delta   │  Status     ║',
      '╠══════════════════════════════════════════════════════════════════════════════════╣',
    ];

    const rows = discrepancyLog.map(r => {
      const scenario  = r.scenario.padEnd(16);
      const metric    = r.metric.padEnd(8);
      const expected  = r.expected.toFixed(6).padStart(10);
      const computed  = r.computed.toFixed(6).padStart(10);
      const delta     = r.delta.toFixed(6).padStart(9);
      const status    = r.status.padEnd(11);
      return `║  ${scenario}  │ ${metric} │ ${expected} │ ${computed} │ ${delta} │  ${status}  ║`;
    });

    const failures = discrepancyLog.filter(r => r.status === 'FAIL').length;
    const passes   = discrepancyLog.filter(r => r.status === 'PASS').length;
    const total    = discrepancyLog.length;

    const footer = [
      '╠══════════════════════════════════════════════════════════════════════════════════╣',
      `║  RESULT: ${passes}/${total} within tolerance ±0.01   |   Failures: ${failures}${''.padEnd(38 - String(failures).length)}║`,
      '╚══════════════════════════════════════════════════════════════════════════════════╝',
      '',
    ];

    const table = [...header, ...rows, ...footer].join('\n');
    console.log(table);

    // Zero failures means all hand-calculated values match the production function
    expect(failures, `${failures} scenario(s) exceeded ±0.01 tolerance — see table above`).toBe(0);
    expect(total, 'Expected 7 scenarios total (5 MRR + 2 NDCG)').toBe(7);
  });
});
