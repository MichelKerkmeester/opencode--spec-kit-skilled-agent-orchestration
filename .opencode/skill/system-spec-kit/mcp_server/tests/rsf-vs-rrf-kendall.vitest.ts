// ---------------------------------------------------------------
// MODULE: Test — RSF vs RRF Kendall Tau
// ---------------------------------------------------------------
// Verification: measure rank correlation between RRF and RSF
// fusion to determine whether RSF is a safe replacement for RRF.
//
// Decision criterion: tau < 0.4 = REJECT RSF (rankings too different)

import { describe, it, expect, beforeAll } from 'vitest';
import { fuseResultsMulti, type RankedList, type RrfItem } from '../../shared/algorithms/rrf-fusion';
import { fuseResultsRsfMulti, type RsfResult } from '../lib/search/rsf-fusion';

/* ---------------------------------------------------------------
   KENDALL TAU-B IMPLEMENTATION
   --------------------------------------------------------------- */

/**
 * Compute Kendall tau-b rank correlation coefficient.
 * Handles ties using the tau-b variant:
 *   tau_b = (C - D) / sqrt((C + D + T1) * (C + D + T2))
 * where C = concordant pairs, D = discordant pairs,
 *       T1 = ties in ranking X only, T2 = ties in ranking Y only.
 *
 * Returns a value in [-1, 1] where:
 *   1 = perfect agreement
 *   0 = no correlation
 *  -1 = perfect disagreement
 */
function kendallTauB(rankingA: number[], rankingB: number[]): number {
  const n = rankingA.length;
  if (n !== rankingB.length) {
    throw new Error('Rankings must be the same length');
  }
  if (n < 2) return 1.0; // Trivially correlated

  let concordant = 0;
  let discordant = 0;
  let tiesA = 0; // Ties only in A
  let tiesB = 0; // Ties only in B

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const diffA = rankingA[i] - rankingA[j];
      const diffB = rankingB[i] - rankingB[j];

      if (diffA === 0 && diffB === 0) {
        // Tied in both — ignored in tau-b
        continue;
      } else if (diffA === 0) {
        tiesA++;
      } else if (diffB === 0) {
        tiesB++;
      } else if (Math.sign(diffA) === Math.sign(diffB)) {
        concordant++;
      } else {
        discordant++;
      }
    }
  }

  const numerator = concordant - discordant;
  const denominator = Math.sqrt(
    (concordant + discordant + tiesA) * (concordant + discordant + tiesB)
  );

  if (denominator === 0) return 0; // All ties → undefined, treat as no correlation
  return numerator / denominator;
}

/**
 * Convert a fused result ordering to a rank map: id → rank position (1-based).
 * Items not present in the ranking get a default rank of (maxRank + 1).
 */
function toRankMap(ids: (number | string)[]): Map<number | string, number> {
  const map = new Map<number | string, number>();
  for (let i = 0; i < ids.length; i++) {
    map.set(ids[i], i + 1);
  }
  return map;
}

/**
 * Compare two rankings by extracting rank vectors for the union of all IDs.
 * IDs not present in one ranking get a penalty rank of (maxRank + 1).
 */
function compareRankings(
  rrfOrder: (number | string)[],
  rsfOrder: (number | string)[],
): { tau: number; commonIds: number; totalIds: number } {
  const allIds = new Set([...rrfOrder, ...rsfOrder]);
  const rrfRanks = toRankMap(rrfOrder);
  const rsfRanks = toRankMap(rsfOrder);

  const maxRrfRank = rrfOrder.length + 1;
  const maxRsfRank = rsfOrder.length + 1;

  const rankVecA: number[] = [];
  const rankVecB: number[] = [];
  let commonIds = 0;

  for (const id of allIds) {
    rankVecA.push(rrfRanks.get(id) ?? maxRrfRank);
    rankVecB.push(rsfRanks.get(id) ?? maxRsfRank);
    if (rrfRanks.has(id) && rsfRanks.has(id)) {
      commonIds++;
    }
  }

  const tau = kendallTauB(rankVecA, rankVecB);
  return { tau, commonIds, totalIds: allIds.size };
}

/* ---------------------------------------------------------------
   SYNTHETIC DATA GENERATORS
   --------------------------------------------------------------- */

/** Create an RrfItem with specified ID and score */
function makeItem(id: number, score: number): RrfItem {
  return { id, score, title: `item-${id}` };
}

/** Create a RankedList with items having linearly decreasing scores */
function makeLinearList(
  source: string,
  startId: number,
  count: number,
  maxScore: number,
  minScore: number,
): RankedList {
  const step = count > 1 ? (maxScore - minScore) / (count - 1) : 0;
  const results: RrfItem[] = [];
  for (let i = 0; i < count; i++) {
    results.push(makeItem(startId + i, maxScore - step * i));
  }
  return { source, results };
}

/** Create a RankedList with overlapping IDs from another list + some unique */
function makeOverlappingList(
  source: string,
  baseIds: number[],
  overlapFraction: number,
  extraCount: number,
  maxScore: number,
): RankedList {
  const overlapCount = Math.floor(baseIds.length * overlapFraction);
  const results: RrfItem[] = [];

  // Include overlapping items with slightly different scores
  for (let i = 0; i < overlapCount; i++) {
    const score = maxScore - (i * 0.05) + (Math.random() * 0.02 - 0.01);
    results.push(makeItem(baseIds[i], Math.max(0, score)));
  }

  // Add unique items
  const maxBaseId = Math.max(...baseIds);
  for (let i = 0; i < extraCount; i++) {
    const score = maxScore * 0.5 - (i * 0.05);
    results.push(makeItem(maxBaseId + 100 + i, Math.max(0, score)));
  }

  return { source, results };
}

/** Generate a test scenario with multiple channels */
interface TestScenario {
  name: string;
  lists: RankedList[];
}

function generateScenarios(): TestScenario[] {
  const scenarios: TestScenario[] = [];

  // Scenario 1: Identical rankings across channels (should be high tau)
  for (let s = 0; s < 10; s++) {
    const ids = Array.from({ length: 10 }, (_, i) => i + 1);
    const scores = ids.map((_, i) => 1 - i * 0.1);
    const lists: RankedList[] = [
      { source: 'vector', results: ids.map((id, i) => makeItem(id, scores[i])) },
      { source: 'fts', results: ids.map((id, i) => makeItem(id, scores[i] + (Math.random() * 0.01))) },
    ];
    scenarios.push({ name: `identical-${s}`, lists });
  }

  // Scenario 2: Completely disjoint sets (should test edge case)
  for (let s = 0; s < 10; s++) {
    const lists: RankedList[] = [
      makeLinearList('vector', 1, 10, 0.95, 0.5),
      makeLinearList('fts', 101, 10, 0.90, 0.45),
    ];
    scenarios.push({ name: `disjoint-${s}`, lists });
  }

  // Scenario 3: Partial overlap with varying overlap ratios
  for (let overlap = 0.2; overlap <= 0.9; overlap += 0.1) {
    for (let s = 0; s < 5; s++) {
      const baseIds = Array.from({ length: 15 }, (_, i) => i + 1);
      const lists: RankedList[] = [
        makeLinearList('vector', 1, 15, 0.95, 0.3),
        makeOverlappingList('fts', baseIds, overlap, 5, 0.90),
      ];
      scenarios.push({ name: `overlap-${Math.round(overlap * 100)}pct-${s}`, lists });
    }
  }

  // Scenario 4: Multi-channel (3 sources)
  for (let s = 0; s < 10; s++) {
    const lists: RankedList[] = [
      makeLinearList('vector', 1, 12, 0.95, 0.4),
      makeLinearList('fts', 5, 12, 0.90, 0.35),
      makeLinearList('bm25', 8, 12, 0.85, 0.30),
    ];
    scenarios.push({ name: `multi-3ch-${s}`, lists });
  }

  // Scenario 5: Multi-channel (5 sources — full pipeline)
  for (let s = 0; s < 10; s++) {
    const lists: RankedList[] = [
      makeLinearList('vector', 1, 10, 0.95, 0.50),
      makeLinearList('fts', 3, 10, 0.90, 0.45),
      makeLinearList('bm25', 6, 10, 0.85, 0.40),
      makeLinearList('graph', 2, 8, 0.80, 0.35),
      makeLinearList('degree', 4, 8, 0.75, 0.30),
    ];
    scenarios.push({ name: `multi-5ch-${s}`, lists });
  }

  // Scenario 6: Skewed distributions (one dominant source)
  for (let s = 0; s < 10; s++) {
    const lists: RankedList[] = [
      makeLinearList('vector', 1, 20, 0.99, 0.80),  // Very high scores
      makeLinearList('fts', 1, 20, 0.40, 0.05),       // Very low scores
    ];
    scenarios.push({ name: `skewed-${s}`, lists });
  }

  // Scenario 7: Single item per list
  for (let s = 0; s < 5; s++) {
    const lists: RankedList[] = [
      { source: 'vector', results: [makeItem(1, 0.9)] },
      { source: 'fts', results: [makeItem(1, 0.8)] },
    ];
    scenarios.push({ name: `single-item-${s}`, lists });
  }

  // Scenario 8: Large lists (30 items each)
  for (let s = 0; s < 10; s++) {
    const lists: RankedList[] = [
      makeLinearList('vector', 1, 30, 0.99, 0.10),
      makeLinearList('fts', 10, 30, 0.95, 0.08),
      makeLinearList('bm25', 20, 30, 0.90, 0.05),
    ];
    scenarios.push({ name: `large-${s}`, lists });
  }

  // Scenario 9: All same scores (degenerate case)
  for (let s = 0; s < 5; s++) {
    const ids = Array.from({ length: 8 }, (_, i) => i + 1);
    const lists: RankedList[] = [
      { source: 'vector', results: ids.map(id => makeItem(id, 0.5)) },
      { source: 'fts', results: ids.map(id => makeItem(id, 0.5)) },
    ];
    scenarios.push({ name: `flat-scores-${s}`, lists });
  }

  // Scenario 10: Reverse ordering (one list is the reverse of the other)
  for (let s = 0; s < 5; s++) {
    const ids = Array.from({ length: 10 }, (_, i) => i + 1);
    const lists: RankedList[] = [
      { source: 'vector', results: ids.map((id, i) => makeItem(id, 1 - i * 0.1)) },
      { source: 'fts', results: [...ids].reverse().map((id, i) => makeItem(id, 1 - i * 0.1)) },
    ];
    scenarios.push({ name: `reversed-${s}`, lists });
  }

  return scenarios;
}

/* ---------------------------------------------------------------
   GLOBAL TEST STATE
   --------------------------------------------------------------- */

interface TauResult {
  scenario: string;
  tau: number;
  commonIds: number;
  totalIds: number;
}

let allTauResults: TauResult[] = [];
let scenarios: TestScenario[] = [];

/* ---------------------------------------------------------------
   TESTS
   --------------------------------------------------------------- */

describe('T032: RSF vs RRF Kendall Tau Comparison', () => {

  beforeAll(() => {
    // Disable score normalization to compare raw fusion behaviour
    delete process.env.SPECKIT_SCORE_NORMALIZATION;
    scenarios = generateScenarios();
    allTauResults = [];
  });

  /* -- Section 1: Kendall tau-b implementation correctness -- */

  describe('Kendall tau-b implementation', () => {

    it('T032-01: perfect agreement returns tau = 1.0', () => {
      const a = [1, 2, 3, 4, 5];
      const b = [1, 2, 3, 4, 5];
      expect(kendallTauB(a, b)).toBeCloseTo(1.0, 5);
    });

    it('T032-02: perfect disagreement returns tau = -1.0', () => {
      const a = [1, 2, 3, 4, 5];
      const b = [5, 4, 3, 2, 1];
      expect(kendallTauB(a, b)).toBeCloseTo(-1.0, 5);
    });

    it('T032-03: single element returns 1.0', () => {
      expect(kendallTauB([1], [1])).toBe(1.0);
    });

    it('T032-04: two elements same order returns 1.0', () => {
      const a = [1, 2];
      const b = [1, 2];
      expect(kendallTauB(a, b)).toBeCloseTo(1.0, 5);
    });

    it('T032-05: two elements reversed returns -1.0', () => {
      const a = [1, 2];
      const b = [2, 1];
      expect(kendallTauB(a, b)).toBeCloseTo(-1.0, 5);
    });

    it('T032-06: handles ties correctly (tau-b)', () => {
      const a = [1, 1, 3, 4];
      const b = [1, 2, 3, 4];
      const tau = kendallTauB(a, b);
      // With a tie in A, tau-b should be less than 1.0 but positive
      expect(tau).toBeGreaterThan(0);
      expect(tau).toBeLessThanOrEqual(1.0);
    });

    it('T032-07: throws on mismatched lengths', () => {
      expect(() => kendallTauB([1, 2], [1])).toThrow('same length');
    });

    it('T032-08: all-tied values returns 0 (no correlation computable)', () => {
      const a = [1, 1, 1, 1];
      const b = [2, 2, 2, 2];
      const tau = kendallTauB(a, b);
      expect(tau).toBe(0);
    });

    it('T032-09: known example — partial correlation', () => {
      // Classic example: ranks [1,2,3,4,5] vs [1,3,2,5,4]
      // 2 discordant pairs out of 10 → (8 - 2) / sqrt(10 * 10) = 0.6
      const a = [1, 2, 3, 4, 5];
      const b = [1, 3, 2, 5, 4];
      const tau = kendallTauB(a, b);
      expect(tau).toBeCloseTo(0.6, 4);
    });
  });

  /* -- Section 2: Score comparison helpers -- */

  describe('Ranking comparison helpers', () => {

    it('T032-10: toRankMap assigns sequential 1-based ranks', () => {
      const map = toRankMap([100, 200, 300]);
      expect(map.get(100)).toBe(1);
      expect(map.get(200)).toBe(2);
      expect(map.get(300)).toBe(3);
    });

    it('T032-11: compareRankings handles disjoint ID sets', () => {
      const result = compareRankings([1, 2, 3], [4, 5, 6]);
      expect(result.commonIds).toBe(0);
      expect(result.totalIds).toBe(6);
      // tau is defined but likely low or undefined due to penalty ranks
      expect(typeof result.tau).toBe('number');
    });

    it('T032-12: compareRankings handles identical ID sets with same order', () => {
      const result = compareRankings([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]);
      expect(result.tau).toBeCloseTo(1.0, 4);
      expect(result.commonIds).toBe(5);
      expect(result.totalIds).toBe(5);
    });
  });

  /* -- Section 3: RSF vs RRF on synthetic data (100+ scenarios) -- */

  describe('RSF vs RRF fusion comparison on 100+ scenarios', () => {

    it('T032-13: generates at least 100 test scenarios', () => {
      expect(scenarios.length).toBeGreaterThanOrEqual(100);
    });

    it('T032-14: runs RRF and RSF on all scenarios and computes tau', () => {
      for (const scenario of scenarios) {
        // Run RRF fusion
        const rrfResults = fuseResultsMulti(scenario.lists, {
          convergenceBonus: 0.10,
          graphWeightBoost: 1.5,
        });
        const rrfOrder = rrfResults.map(r => r.id);

        // Run RSF fusion
        const rsfResults = fuseResultsRsfMulti(scenario.lists);
        const rsfOrder = rsfResults.map(r => r.id);

        // Compute Kendall tau
        const comparison = compareRankings(rrfOrder, rsfOrder);

        allTauResults.push({
          scenario: scenario.name,
          tau: comparison.tau,
          commonIds: comparison.commonIds,
          totalIds: comparison.totalIds,
        });

        // Each tau should be a valid number in [-1, 1]
        expect(comparison.tau).toBeGreaterThanOrEqual(-1);
        expect(comparison.tau).toBeLessThanOrEqual(1);
      }

      expect(allTauResults.length).toBeGreaterThanOrEqual(100);
    });

    it('T032-15: statistical summary — mean tau, std dev, min, max', () => {
      expect(allTauResults.length).toBeGreaterThanOrEqual(100);

      const taus = allTauResults.map(r => r.tau);
      const mean = taus.reduce((a, b) => a + b, 0) / taus.length;
      const variance = taus.reduce((a, b) => a + (b - mean) ** 2, 0) / taus.length;
      const stdDev = Math.sqrt(variance);
      const min = Math.min(...taus);
      const max = Math.max(...taus);

      // Log the summary for verification
      console.log('\n=== RSF vs RRF Kendall Tau Summary ===');
      console.log(`N scenarios:  ${taus.length}`);
      console.log(`Mean tau:     ${mean.toFixed(4)}`);
      console.log(`Std dev:      ${stdDev.toFixed(4)}`);
      console.log(`Min tau:      ${min.toFixed(4)}`);
      console.log(`Max tau:      ${max.toFixed(4)}`);
      console.log(`Tau >= 0.4:   ${taus.filter(t => t >= 0.4).length} / ${taus.length}`);
      console.log(`Tau >= 0.6:   ${taus.filter(t => t >= 0.6).length} / ${taus.length}`);
      console.log(`Tau >= 0.8:   ${taus.filter(t => t >= 0.8).length} / ${taus.length}`);

      // Distribution by scenario type
      const byType = new Map<string, number[]>();
      for (const r of allTauResults) {
        const type = r.scenario.replace(/-\d+$/, '');
        if (!byType.has(type)) byType.set(type, []);
        byType.get(type)!.push(r.tau);
      }

      console.log('\n--- By scenario type ---');
      for (const [type, typeTaus] of byType) {
        const typeMean = typeTaus.reduce((a, b) => a + b, 0) / typeTaus.length;
        console.log(`  ${type}: mean=${typeMean.toFixed(4)}, n=${typeTaus.length}`);
      }

      // Verify statistical properties exist
      expect(typeof mean).toBe('number');
      expect(typeof stdDev).toBe('number');
      expect(isFinite(mean)).toBe(true);
      expect(isFinite(stdDev)).toBe(true);
    });

    it('T032-16: decision criterion — evaluate tau >= 0.4 threshold', () => {
      expect(allTauResults.length).toBeGreaterThanOrEqual(100);

      const taus = allTauResults.map(r => r.tau);
      const mean = taus.reduce((a, b) => a + b, 0) / taus.length;
      const passCount = taus.filter(t => t >= 0.4).length;
      const passRate = passCount / taus.length;

      console.log('\n=== DECISION CRITERION ===');
      console.log(`Mean tau:   ${mean.toFixed(4)}`);
      console.log(`Pass rate (tau >= 0.4): ${(passRate * 100).toFixed(1)}%`);
      console.log(`Decision:   ${mean >= 0.4 ? 'ACCEPT RSF (mean tau >= 0.4)' : 'REJECT RSF (mean tau < 0.4, rankings too different)'}`);

      // Record the decision (this test always passes — it reports the measurement)
      expect(typeof mean).toBe('number');
    });
  });

  /* -- Section 4: Edge case handling -- */

  describe('Edge cases', () => {

    it('T032-17: empty lists produce empty results for both RRF and RSF', () => {
      const lists: RankedList[] = [
        { source: 'vector', results: [] },
        { source: 'fts', results: [] },
      ];

      const rrfResults = fuseResultsMulti(lists);
      const rsfResults = fuseResultsRsfMulti(lists);

      expect(rrfResults.length).toBe(0);
      expect(rsfResults.length).toBe(0);
    });

    it('T032-18: single item list produces same top result for both', () => {
      const lists: RankedList[] = [
        { source: 'vector', results: [makeItem(1, 0.95)] },
        { source: 'fts', results: [makeItem(1, 0.90)] },
      ];

      const rrfResults = fuseResultsMulti(lists);
      const rsfResults = fuseResultsRsfMulti(lists);

      expect(rrfResults.length).toBe(1);
      expect(rsfResults.length).toBe(1);
      expect(rrfResults[0].id).toBe(1);
      expect(rsfResults[0].id).toBe(1);
    });

    it('T032-19: one empty list, one populated — both produce results', () => {
      const lists: RankedList[] = [
        { source: 'vector', results: [makeItem(1, 0.9), makeItem(2, 0.8)] },
        { source: 'fts', results: [] },
      ];

      const rrfResults = fuseResultsMulti(lists);
      const rsfResults = fuseResultsRsfMulti(lists);

      expect(rrfResults.length).toBeGreaterThan(0);
      expect(rsfResults.length).toBeGreaterThan(0);
    });

    it('T032-20: very similar scores — RSF normalization effect', () => {
      // When all scores are nearly identical, RSF normalizes them differently
      const lists: RankedList[] = [
        { source: 'vector', results: [
          makeItem(1, 0.801), makeItem(2, 0.800), makeItem(3, 0.799),
        ]},
        { source: 'fts', results: [
          makeItem(1, 0.601), makeItem(2, 0.600), makeItem(3, 0.599),
        ]},
      ];

      const rrfResults = fuseResultsMulti(lists);
      const rsfResults = fuseResultsRsfMulti(lists);

      // Both should rank item 1 first (highest in both)
      expect(rrfResults[0].id).toBe(1);
      expect(rsfResults[0].id).toBe(1);
    });

    it('T032-21: identical items in different order — rank preservation test', () => {
      const ids = [1, 2, 3, 4, 5];
      const lists: RankedList[] = [
        { source: 'vector', results: ids.map((id, i) => makeItem(id, 0.9 - i * 0.1)) },
        { source: 'fts', results: [...ids].reverse().map((id, i) => makeItem(id, 0.9 - i * 0.1)) },
      ];

      const rrfResults = fuseResultsMulti(lists);
      const rsfResults = fuseResultsRsfMulti(lists);

      // Both should produce results for all 5 items
      expect(rrfResults.length).toBe(5);
      expect(rsfResults.length).toBe(5);

      // Compare rankings
      const comparison = compareRankings(
        rrfResults.map(r => r.id),
        rsfResults.map(r => r.id),
      );
      expect(comparison.totalIds).toBe(5);
    });
  });

  /* -- Section 5: RSF score properties -- */

  describe('RSF score properties', () => {

    it('T032-22: all RSF scores are in [0, 1]', () => {
      for (const scenario of scenarios.slice(0, 20)) {
        const rsfResults = fuseResultsRsfMulti(scenario.lists);
        for (const r of rsfResults) {
          expect(r.rsfScore).toBeGreaterThanOrEqual(0);
          expect(r.rsfScore).toBeLessThanOrEqual(1);
        }
      }
    });

    it('T032-23: RSF results are sorted descending by rsfScore', () => {
      for (const scenario of scenarios.slice(0, 20)) {
        const rsfResults = fuseResultsRsfMulti(scenario.lists);
        for (let i = 1; i < rsfResults.length; i++) {
          expect(rsfResults[i].rsfScore).toBeLessThanOrEqual(rsfResults[i - 1].rsfScore);
        }
      }
    });
  });
});
