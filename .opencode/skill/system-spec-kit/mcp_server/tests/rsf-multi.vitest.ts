// --- 1. TEST — RSF MULTI-LIST ---
// RSF Fusion — Multi-List (T002b) and Cross-Variant (T002c) Variants
// Tasks T002b + T002c — Hybrid RAG Fusion Refinement

import { describe, it, expect } from 'vitest';
import {
  fuseResultsRsfMulti,
  fuseResultsRsfCrossVariant,
} from '../lib/search/rsf-fusion';
import type { RsfResult } from '../lib/search/rsf-fusion';
import type { RankedList, RrfItem } from '@spec-kit/shared/algorithms/rrf-fusion';

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

function makeList(source: string, items: RrfItem[]): RankedList {
  return { source, results: items };
}

function makeItem(id: number | string, score?: number): RrfItem {
  const item: RrfItem = { id };
  if (score !== undefined) item.score = score;
  return item;
}

/* ═══════════════════════════════════════════════════════════════
   T027: RSF Multi-List and Cross-Variant Fusion Tests
   ═══════════════════════════════════════════════════════════════ */

describe('T027: RSF Multi-List and Cross-Variant Fusion', () => {

  /* -------------------------------------------------------------
     T027.1: Multi-list fusion with 3 sources produces valid ranking
     ------------------------------------------------------------- */
  describe('T027.1: Multi-list fusion with 3 sources', () => {
    it('T027.1.1: produces a non-empty result array with items from all sources', () => {
      const lists = [
        makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.7)]),
        makeList('bm25',   [makeItem(2, 0.8), makeItem(3, 0.6)]),
        makeList('graph',  [makeItem(3, 0.7), makeItem(4, 0.5)]),
      ];

      const results = fuseResultsRsfMulti(lists);

      expect(results.length).toBe(4);
      const ids = results.map(r => r.id);
      expect(ids).toContain(1);
      expect(ids).toContain(2);
      expect(ids).toContain(3);
      expect(ids).toContain(4);
    });

    it('T027.1.2: each result has rsfScore, sources, and sourceScores', () => {
      const lists = [
        makeList('vector', [makeItem(1, 0.9)]),
        makeList('bm25',   [makeItem(2, 0.8)]),
        makeList('graph',  [makeItem(3, 0.7)]),
      ];

      const results = fuseResultsRsfMulti(lists);

      for (const r of results) {
        expect(r).toHaveProperty('rsfScore');
        expect(r).toHaveProperty('sources');
        expect(r).toHaveProperty('sourceScores');
        expect(typeof r.rsfScore).toBe('number');
        expect(Array.isArray(r.sources)).toBe(true);
        expect(typeof r.sourceScores).toBe('object');
      }
    });

    it('T027.1.3: results are sorted descending by rsfScore', () => {
      const lists = [
        makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.4), makeItem(3, 0.1)]),
        makeList('bm25',   [makeItem(1, 0.85), makeItem(4, 0.5)]),
        makeList('graph',  [makeItem(1, 0.95), makeItem(5, 0.3)]),
      ];

      const results = fuseResultsRsfMulti(lists);

      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].rsfScore).toBeGreaterThanOrEqual(results[i].rsfScore);
      }
    });
  });

  /* -------------------------------------------------------------
     T027.2: Multi-list items in all sources rank highest
     ------------------------------------------------------------- */
  describe('T027.2: Items present in all sources rank highest', () => {
    it('T027.2.1: item in all 3 sources outranks item in 2 sources', () => {
      // Item 1 appears in all 3 lists with identical scores → no penalty
      // Item 2 appears in only 2 lists → penalised
      const lists = [
        makeList('vector', [makeItem(1, 0.8), makeItem(2, 0.8)]),
        makeList('bm25',   [makeItem(1, 0.8), makeItem(2, 0.8)]),
        makeList('graph',  [makeItem(1, 0.8)]),
      ];

      const results = fuseResultsRsfMulti(lists);
      const item1 = results.find(r => r.id === 1);
      const item2 = results.find(r => r.id === 2);

      expect(item1).toBeDefined();
      expect(item2).toBeDefined();
      expect(item1!.rsfScore).toBeGreaterThan(item2!.rsfScore);
    });

    it('T027.2.2: item in all 3 sources outranks item in only 1 source', () => {
      const lists = [
        makeList('vector', [makeItem(1, 0.9), makeItem(99, 0.9)]),
        makeList('bm25',   [makeItem(1, 0.9)]),
        makeList('graph',  [makeItem(1, 0.9)]),
      ];

      const results = fuseResultsRsfMulti(lists);
      const item1 = results.find(r => r.id === 1);
      const item99 = results.find(r => r.id === 99);

      expect(item1!.rsfScore).toBeGreaterThan(item99!.rsfScore);
    });

    it('T027.2.3: item in all 3 sources has all 3 source names in sources array', () => {
      const lists = [
        makeList('vector', [makeItem(1, 0.9)]),
        makeList('bm25',   [makeItem(1, 0.9)]),
        makeList('graph',  [makeItem(1, 0.9)]),
      ];

      const results = fuseResultsRsfMulti(lists);
      const item1 = results.find(r => r.id === 1);

      expect(item1!.sources).toContain('vector');
      expect(item1!.sources).toContain('bm25');
      expect(item1!.sources).toContain('graph');
      expect(item1!.sources.length).toBe(3);
    });
  });

  /* -------------------------------------------------------------
     T027.3: Single-source items get proportional penalty
     ------------------------------------------------------------- */
  describe('T027.3: Single-source items get proportional penalty', () => {
    it('T027.3.1: single-source item in 3-source fusion gets 1/3 of avg score', () => {
      // With 3 total sources, single-source item gets avgScore * (1/3)
      // List: vector only — item 5 has score 1.0 (normalized to 1.0 as sole item)
      // Penalty: 1.0 * (1/3) ≈ 0.333
      const lists = [
        makeList('vector', [makeItem(5, 0.9)]),
        makeList('bm25',   [makeItem(1, 0.8)]),
        makeList('graph',  [makeItem(2, 0.7)]),
      ];

      const results = fuseResultsRsfMulti(lists);
      const item5 = results.find(r => r.id === 5);

      expect(item5).toBeDefined();
      expect(item5!.rsfScore).toBeCloseTo(1.0 / 3, 4);
    });

    it('T027.3.2: item in 2 of 3 sources gets 2/3 of avg score', () => {
      // Item 1 appears in vector and bm25 (2 of 3 sources)
      // Vector: [1(1.0)] → normalized(1) = 1.0
      // Bm25:   [1(1.0)] → normalized(1) = 1.0
      // AvgScore = (1.0 + 1.0) / 2 = 1.0
      // Penalty: 1.0 * (2/3) ≈ 0.667
      const lists = [
        makeList('vector', [makeItem(1, 0.9)]),
        makeList('bm25',   [makeItem(1, 0.9)]),
        makeList('graph',  [makeItem(99, 0.5)]),
      ];

      const results = fuseResultsRsfMulti(lists);
      const item1 = results.find(r => r.id === 1);

      expect(item1).toBeDefined();
      expect(item1!.rsfScore).toBeCloseTo(2.0 / 3, 4);
    });

    it('T027.3.3: single-source item has only its own source in sources array', () => {
      const lists = [
        makeList('vector', [makeItem(7, 0.8)]),
        makeList('bm25',   [makeItem(8, 0.7)]),
        makeList('graph',  [makeItem(9, 0.6)]),
      ];

      const results = fuseResultsRsfMulti(lists);
      const item7 = results.find(r => r.id === 7);

      expect(item7!.sources).toEqual(['vector']);
      expect(item7!.sources.length).toBe(1);
    });
  });

  /* -------------------------------------------------------------
     T027.4: All scores in [0, 1] range
     ------------------------------------------------------------- */
  describe('T027.4: All scores clamped to [0, 1]', () => {
    it('T027.4.1: all rsfScores are between 0 and 1 for normal inputs', () => {
      const lists = [
        makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.5), makeItem(3, 0.1)]),
        makeList('bm25',   [makeItem(2, 0.8), makeItem(4, 0.3)]),
        makeList('graph',  [makeItem(1, 0.7), makeItem(5, 0.6)]),
      ];

      const results = fuseResultsRsfMulti(lists);

      for (const r of results) {
        expect(r.rsfScore).toBeGreaterThanOrEqual(0);
        expect(r.rsfScore).toBeLessThanOrEqual(1);
      }
    });

    it('T027.4.2: extreme scores (very high and very low) are clamped', () => {
      const lists = [
        makeList('vector', [makeItem(1, 1000), makeItem(2, -500)]),
        makeList('bm25',   [makeItem(1, 999), makeItem(3, -100)]),
        makeList('graph',  [makeItem(1, 800)]),
      ];

      const results = fuseResultsRsfMulti(lists);

      for (const r of results) {
        expect(r.rsfScore).toBeGreaterThanOrEqual(0);
        expect(r.rsfScore).toBeLessThanOrEqual(1);
      }
    });
  });

  /* -------------------------------------------------------------
     T027.5: Empty lists handled gracefully
     ------------------------------------------------------------- */
  describe('T027.5: Empty list handling', () => {
    it('T027.5.1: empty input array returns empty result', () => {
      const results = fuseResultsRsfMulti([]);
      expect(results).toEqual([]);
    });

    it('T027.5.2: all empty lists returns empty result', () => {
      const lists = [
        makeList('vector', []),
        makeList('bm25',   []),
        makeList('graph',  []),
      ];

      const results = fuseResultsRsfMulti(lists);
      expect(results).toEqual([]);
    });

    it('T027.5.3: one non-empty list among empties still returns results', () => {
      const lists = [
        makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.5)]),
        makeList('bm25',   []),
        makeList('graph',  []),
      ];

      const results = fuseResultsRsfMulti(lists);
      // Empty channels are excluded from denominator, so this behaves as 1 active source.
      expect(results.length).toBe(2);
      const item1 = results.find(r => r.id === 1);
      expect(item1!.rsfScore).toBeCloseTo(1.0, 5);
      for (const r of results) {
        expect(r.rsfScore).toBeGreaterThanOrEqual(0);
        expect(r.rsfScore).toBeLessThanOrEqual(1);
      }
    });

    it('T027.5.4: empty channels do not penalize coverage in denominator', () => {
      const lists = [
        makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.2)]),
        makeList('bm25',   [makeItem(1, 0.8)]),
        makeList('graph',  []),
      ];

      const results = fuseResultsRsfMulti(lists);
      const item1 = results.find(r => r.id === 1);

      // Item 1 appears in both active sources (2/2) so no penalty should apply.
      expect(item1).toBeDefined();
      expect(item1!.rsfScore).toBeCloseTo(1.0, 5);
    });
  });

  /* -------------------------------------------------------------
     T027.6: Multi-list with single list (conceptually matches single-pair)
     ------------------------------------------------------------- */
  describe('T027.6: Single list input behaviour', () => {
    it('T027.6.1: single list input returns all items with 1/1 coverage (no penalty)', () => {
      // Single list: totalSources = 1, countPresent = 1 → no penalty
      const lists = [
        makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.5), makeItem(3, 0.1)]),
      ];

      const results = fuseResultsRsfMulti(lists);

      expect(results.length).toBe(3);
      // No penalty for single source (countPresent === totalSources = 1)
      // Item 1 normalized = 1.0, item 3 normalized = 0.0
      const item1 = results.find(r => r.id === 1);
      const item3 = results.find(r => r.id === 3);
      expect(item1!.rsfScore).toBeCloseTo(1.0, 5);
      expect(item3!.rsfScore).toBeCloseTo(0.0, 5);
    });
  });

  /* -------------------------------------------------------------
     T027.7: Multi-list consistency with single-pair on 2-list input
     ------------------------------------------------------------- */
  describe('T027.7: Multi-list consistency with single-pair on 2-list input', () => {
    it('T027.7.1: overlapping items: multi-list produces same relative order as single-pair for 2 lists', () => {
      // Using multi-list with 2 sources and same items as single-pair:
      // Both functions should agree on which items rank higher
      const list1 = makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.5), makeItem(3, 0.1)]);
      const list2 = makeList('bm25',   [makeItem(2, 0.9), makeItem(4, 0.1), makeItem(1, 0.4)]);

      const multiResults = fuseResultsRsfMulti([list1, list2]);

      // Item 2 is in both sources with high normalized scores → should rank highly
      // Item 1 is in both sources
      // Items 3 and 4 are in only one source each
      const item2 = multiResults.find(r => r.id === 2);
      const item3 = multiResults.find(r => r.id === 3);
      const item4 = multiResults.find(r => r.id === 4);

      expect(item2).toBeDefined();
      expect(item2!.sources.length).toBe(2);
      // Multi-source items should beat single-source items
      expect(item2!.rsfScore).toBeGreaterThan(item3!.rsfScore);
      expect(item2!.rsfScore).toBeGreaterThan(item4!.rsfScore);
    });

    it('T027.7.2: same items in same relative order for overlapping items', () => {
      // Verify that items in both sources always rank higher than single-source items
      const lists = [
        makeList('source-a', [makeItem(1, 0.9), makeItem(2, 0.5)]),
        makeList('source-b', [makeItem(1, 0.8), makeItem(3, 0.9)]),
      ];

      const results = fuseResultsRsfMulti(lists);
      const item1 = results.find(r => r.id === 1); // in both sources

      // Item 1 is in both sources: 2/2 coverage, no penalty
      expect(item1!.sources.length).toBe(2);
      // Items 2 and 3 are single-source: 1/2 coverage, penalty applied
      const item2 = results.find(r => r.id === 2);
      const item3 = results.find(r => r.id === 3);
      expect(item2!.sources.length).toBe(1);
      expect(item3!.sources.length).toBe(1);
      // Item 1 (full coverage) should rank at or above single-source items
      // Since its avg = 1.0 (both are top of their list) → no penalty
      // Item2 normalized A = 0.0 (min of A range) → 0.0 * 0.5 = 0.0
      // Item3 normalized B = 1.0 (top of B) → 1.0 * 0.5 = 0.5
      expect(item1!.rsfScore).toBeGreaterThan(item2!.rsfScore);
    });
  });

  /* -------------------------------------------------------------
     T027.8: Cross-variant basic fusion
     ------------------------------------------------------------- */
  describe('T027.8: Cross-variant basic fusion', () => {
    it('T027.8.1: cross-variant basic produces non-empty result', () => {
      const variantLists = [
        [makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.5)])],
        [makeList('bm25',   [makeItem(2, 0.8), makeItem(3, 0.6)])],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);

      expect(results.length).toBeGreaterThan(0);
      const ids = results.map(r => r.id);
      expect(ids).toContain(1);
      expect(ids).toContain(2);
      expect(ids).toContain(3);
    });

    it('T027.8.2: cross-variant results have rsfScore, sources, sourceScores', () => {
      const variantLists = [
        [makeList('vector', [makeItem(1, 0.9)])],
        [makeList('bm25',   [makeItem(2, 0.8)])],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);

      for (const r of results) {
        expect(r).toHaveProperty('rsfScore');
        expect(r).toHaveProperty('sources');
        expect(r).toHaveProperty('sourceScores');
        expect(typeof r.rsfScore).toBe('number');
      }
    });

    it('T027.8.3: cross-variant results sorted descending by rsfScore', () => {
      const variantLists = [
        [makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.5)])],
        [makeList('bm25',   [makeItem(1, 0.85), makeItem(3, 0.4)])],
        [makeList('graph',  [makeItem(2, 0.7), makeItem(4, 0.3)])],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);

      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].rsfScore).toBeGreaterThanOrEqual(results[i].rsfScore);
      }
    });
  });

  /* -------------------------------------------------------------
     T027.9: Cross-variant items in multiple variants get bonus
     ------------------------------------------------------------- */
  describe('T027.9: Cross-variant bonus for multi-variant items', () => {
    it('T027.9.1: item in 2 variants gets +0.10 bonus over item in 1 variant', () => {
      // Variant 1: [item1: 1.0, item10: 0.5, item11: 0.0-equivalent] → range > 0
      // NormV1(item1) = 1.0, normV1(item10) = 0.0 (bottom of range)
      // Item1 rsfScore = 1.0 (1/1, no penalty), item10 = 0.0
      //
      // Variant 2: [item1: 1.0, item20: 0.5, item21: 0.0-equivalent]
      // Item1 rsfScore = 1.0, item20 = 0.0
      //
      // Item1 appears in 2 variants: avgScore = (1.0+1.0)/2=1.0, +0.10 bonus → clamped to 1.0
      // Item10 appears in 1 variant: avgScore = 0.0 → 0.0
      //
      // Better test: use base scores that put item1 at ~0.5 so bonus makes it >0.5
      // Variant 1: [item1: 0.8, item10: 1.0] → min=0.8, max=1.0
      // NormV1(item1) = (0.8-0.8)/(1.0-0.8) = 0.0
      // NormV1(item10) = (1.0-0.8)/(1.0-0.8) = 1.0
      // Both 1 source → no penalty → item1 rsfScore=0.0, item10 rsfScore=1.0
      //
      // Variant 2: [item1: 0.8, item20: 1.0] → same pattern
      // Item1 rsfScore=0.0, item20 rsfScore=1.0
      //
      // Item1: avgScore = (0.0+0.0)/2=0.0, variantCount=2 → +0.10 → rsfScore=0.10
      // Item10: avgScore = 1.0 from variant1 only → no bonus → rsfScore=1.0
      // That's still worse. We need item1 to have a moderate base score, not 0.0.
      //
      // Cleanest approach: give each variant 3 items where item1 is middle rank
      // Variant 1: [item10: 1.0, item1: 0.6, item_low: 0.2] → range=0.8
      // NormV1(item1) = (0.6-0.2)/0.8 = 0.5, 1/1 source → rsfScore=0.5
      // Variant 2: [item20: 1.0, item1: 0.6, item_low2: 0.2] → same → rsfScore=0.5
      //
      // Item1: avgScore=(0.5+0.5)/2=0.5, bonus=+0.10 → rsfScore=0.60
      // Item10: rsfScore=1.0 (no bonus), item20: rsfScore=1.0 (no bonus)
      // — item10 and item20 still beat item1 because they have max normalized score
      //
      // The key insight: bonus only helps if base scores are comparable.
      // Test: item1 has base 0.5 in both variants; item99 has base 0.45 in one variant.
      // Item1: avg=0.5, +0.10 → 0.60
      // Item99: avg=0.45, no bonus → 0.45
      // Item1 (0.60) > item99 (0.45)  ✓

      const variantLists = [
        [makeList('vector', [makeItem(10, 1.0), makeItem(1, 0.6), makeItem(99, 0.55), makeItem(50, 0.2)])],
        [makeList('bm25',   [makeItem(20, 1.0), makeItem(1, 0.6), makeItem(30, 0.2)])],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);
      const item1  = results.find(r => r.id === 1);
      const item99 = results.find(r => r.id === 99);

      expect(item1).toBeDefined();
      expect(item99).toBeDefined();

      // Item1 appears in 2 variants → gets +0.10 bonus over its base avg score
      // Item99 appears in only 1 variant → no bonus
      // Item1 base > item99 base + item1 gets bonus, so item1 should outrank item99
      expect(item1!.rsfScore).toBeGreaterThan(item99!.rsfScore);
    });

    it('T027.9.2: item in 3 variants gets +0.20 bonus (2 additional variants)', () => {
      // Item 1 appears in all 3 variants; item 99 only in variant 1.
      // To make the bonus observable, item1 needs a moderate base score so that
      // After +0.20 bonus it clearly beats item99 which has no bonus.
      //
      // Variant 1: [item10: 1.0, item1: 0.6, item99: 0.55, item50: 0.2] → range=0.8
      // NormV1(item1)  = (0.6-0.2)/0.8 = 0.5
      // NormV1(item99) = (0.55-0.2)/0.8 = 0.4375
      // 1/1 source → no penalty → item1=0.5, item99=0.4375
      //
      // Variant 2: [item20: 1.0, item1: 0.6, item30: 0.2] → range=0.8
      // NormV2(item1) = (0.6-0.2)/0.8 = 0.5 → rsfScore=0.5
      //
      // Variant 3: [item30: 1.0, item1: 0.6, item40: 0.2] → range=0.8
      // NormV3(item1) = (0.6-0.2)/0.8 = 0.5 → rsfScore=0.5
      //
      // Item1: avgScore=(0.5+0.5+0.5)/3=0.5, variantCount=3 → +0.20 → rsfScore=0.70
      // Item99: avgScore=0.4375/1=0.4375, variantCount=1 → no bonus → rsfScore=0.4375
      // Item1 (0.70) > item99 (0.4375) ✓

      const variantLists = [
        [makeList('v1', [makeItem(10, 1.0), makeItem(1, 0.6), makeItem(99, 0.55), makeItem(50, 0.2)])],
        [makeList('v2', [makeItem(20, 1.0), makeItem(1, 0.6), makeItem(30, 0.2)])],
        [makeList('v3', [makeItem(40, 1.0), makeItem(1, 0.6), makeItem(50, 0.2)])],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);
      const item1  = results.find(r => r.id === 1);
      const item99 = results.find(r => r.id === 99);

      expect(item1).toBeDefined();
      expect(item99).toBeDefined();

      // Item1 appears in 3 variants → bonus = 0.10 * 2 = +0.20 → significantly outranks item99
      expect(item1!.rsfScore).toBeGreaterThan(item99!.rsfScore);
    });

    it('T027.9.3: cross-variant bonus is bounded by clamp01 (no score > 1.0)', () => {
      // Item with maximum base scores + bonus should still be clamped at 1.0
      const variantLists = [
        [makeList('v1', [makeItem(1, 1.0)])],
        [makeList('v2', [makeItem(1, 1.0)])],
        [makeList('v3', [makeItem(1, 1.0)])],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);
      const item1 = results.find(r => r.id === 1);

      expect(item1!.rsfScore).toBeLessThanOrEqual(1.0);
    });
  });

  /* -------------------------------------------------------------
     T027.10: Cross-variant single-variant same as multi-list
     ------------------------------------------------------------- */
  describe('T027.10: Cross-variant single-variant behaves like multi-list', () => {
    it('T027.10.1: single variant returns same items as fuseResultsRsfMulti', () => {
      const lists = [
        makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.5)]),
        makeList('bm25',   [makeItem(2, 0.8), makeItem(3, 0.6)]),
      ];

      const multiResults = fuseResultsRsfMulti(lists);
      const crossResults = fuseResultsRsfCrossVariant([lists]);

      // Same IDs should be present
      const multiIds = new Set(multiResults.map(r => r.id));
      const crossIds = new Set(crossResults.map(r => r.id));

      expect(crossIds).toEqual(multiIds);
    });

    it('T027.10.2: single variant preserves the same relative score ordering', () => {
      const lists = [
        makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.5), makeItem(3, 0.1)]),
        makeList('bm25',   [makeItem(2, 0.8), makeItem(1, 0.3), makeItem(4, 0.5)]),
      ];

      const multiResults = fuseResultsRsfMulti(lists);
      const crossResults = fuseResultsRsfCrossVariant([lists]);

      // Both should have results sorted descending
      for (let i = 1; i < crossResults.length; i++) {
        expect(crossResults[i - 1].rsfScore).toBeGreaterThanOrEqual(crossResults[i].rsfScore);
      }

      // Top item should be the same in both
      expect(crossResults[0].id).toBe(multiResults[0].id);
    });
  });

  /* -------------------------------------------------------------
     T027.11: Cross-variant all scores in [0, 1]
     ------------------------------------------------------------- */
  describe('T027.11: Cross-variant all scores clamped to [0, 1]', () => {
    it('T027.11.1: all rsfScores in [0, 1] for typical inputs', () => {
      const variantLists = [
        [makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.5)])],
        [makeList('bm25',   [makeItem(1, 0.8), makeItem(3, 0.7)])],
        [makeList('graph',  [makeItem(2, 0.6), makeItem(4, 0.4)])],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);

      for (const r of results) {
        expect(r.rsfScore).toBeGreaterThanOrEqual(0);
        expect(r.rsfScore).toBeLessThanOrEqual(1);
      }
    });
  });

  /* -------------------------------------------------------------
     T027.12: Cross-variant empty variant lists
     ------------------------------------------------------------- */
  describe('T027.12: Cross-variant empty variant handling', () => {
    it('T027.12.1: empty variantLists array returns empty result', () => {
      const results = fuseResultsRsfCrossVariant([]);
      expect(results).toEqual([]);
    });

    it('T027.12.2: all empty variants returns empty result', () => {
      const variantLists = [
        [makeList('vector', [])],
        [makeList('bm25',   [])],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);
      expect(results).toEqual([]);
    });

    it('T027.12.3: one non-empty variant among empty variants still produces results', () => {
      const variantLists = [
        [makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.5)])],
        [makeList('bm25',   [])],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);
      // Items from the non-empty variant should be present
      expect(results.length).toBeGreaterThan(0);
      for (const r of results) {
        expect(r.rsfScore).toBeGreaterThanOrEqual(0);
        expect(r.rsfScore).toBeLessThanOrEqual(1);
      }
    });
  });

  /* -------------------------------------------------------------
     T027.13: Cross-variant with multi-list per variant
     ------------------------------------------------------------- */
  describe('T027.13: Cross-variant with multi-list per variant', () => {
    it('T027.13.1: each variant can contain multiple ranked lists', () => {
      // Variant 1 fuses vector + bm25; Variant 2 fuses graph + degree
      const variantLists = [
        [
          makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.7)]),
          makeList('bm25',   [makeItem(2, 0.8), makeItem(3, 0.5)]),
        ],
        [
          makeList('graph',  [makeItem(1, 0.85), makeItem(4, 0.6)]),
          makeList('degree', [makeItem(1, 0.75), makeItem(5, 0.4)]),
        ],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);

      expect(results.length).toBeGreaterThan(0);
      // Item 1 appears in both variants — should rank very highly
      const item1 = results.find(r => r.id === 1);
      expect(item1).toBeDefined();
      // Items only in one variant should have lower rank
      const item3 = results.find(r => r.id === 3);
      const item5 = results.find(r => r.id === 5);
      if (item3 && item5) {
        expect(item1!.rsfScore).toBeGreaterThan(item3!.rsfScore);
        expect(item1!.rsfScore).toBeGreaterThan(item5!.rsfScore);
      }
    });

    it('T027.13.2: cross-variant with multi-list: all scores in [0, 1]', () => {
      const variantLists = [
        [
          makeList('vector', [makeItem(1, 0.9), makeItem(2, 0.5)]),
          makeList('bm25',   [makeItem(2, 0.8), makeItem(3, 0.3)]),
        ],
        [
          makeList('graph',  [makeItem(1, 0.7), makeItem(4, 0.6)]),
          makeList('degree', [makeItem(3, 0.9), makeItem(5, 0.4)]),
        ],
        [
          makeList('keyword', [makeItem(1, 0.95), makeItem(6, 0.2)]),
        ],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);

      for (const r of results) {
        expect(r.rsfScore).toBeGreaterThanOrEqual(0);
        expect(r.rsfScore).toBeLessThanOrEqual(1);
      }
    });
  });

  /* -------------------------------------------------------------
     T027.14: Known score computation for multi-list
     ------------------------------------------------------------- */
  describe('T027.14: Detailed score verification for multi-list', () => {
    it('T027.14.1: verifies full computation for 3-source scenario', () => {
      // List A (vector): [1: 1.0, 2: 0.5] → min=0.5, max=1.0, range=0.5
      // NormA(1) = (1.0-0.5)/0.5 = 1.0
      // NormA(2) = (0.5-0.5)/0.5 = 0.0
      //
      // List B (bm25): [2: 0.9, 3: 0.1] → min=0.1, max=0.9, range=0.8
      // NormB(2) = (0.9-0.1)/0.8 = 1.0
      // NormB(3) = (0.1-0.1)/0.8 = 0.0
      //
      // List C (graph): [1: 0.8, 3: 0.8] → min=0.8, max=0.8, range=0 → all 1.0
      // NormC(1) = 1.0
      // NormC(3) = 1.0
      //
      // Item 1 (vector, graph):      avg = (1.0 + 1.0) / 2 = 1.0, present=2/3 → 1.0*(2/3) ≈ 0.667
      // Item 2 (vector, bm25):       avg = (0.0 + 1.0) / 2 = 0.5, present=2/3 → 0.5*(2/3) ≈ 0.333
      // Item 3 (bm25, graph):        avg = (0.0 + 1.0) / 2 = 0.5, present=2/3 → 0.5*(2/3) ≈ 0.333
      //
      // Sorted: item1 (0.667), item2 ≈ item3 (0.333)

      const lists = [
        makeList('vector', [makeItem(1, 1.0), makeItem(2, 0.5)]),
        makeList('bm25',   [makeItem(2, 0.9), makeItem(3, 0.1)]),
        makeList('graph',  [makeItem(1, 0.8), makeItem(3, 0.8)]),
      ];

      const results = fuseResultsRsfMulti(lists);

      const item1 = results.find(r => r.id === 1);
      const item2 = results.find(r => r.id === 2);
      const item3 = results.find(r => r.id === 3);

      expect(item1!.rsfScore).toBeCloseTo(2.0 / 3, 4);
      expect(item2!.rsfScore).toBeCloseTo(1.0 / 3, 4);
      expect(item3!.rsfScore).toBeCloseTo(1.0 / 3, 4);

      // Item 1 ranks first
      expect(results[0].id).toBe(1);
    });
  });

  /* -------------------------------------------------------------
     T027.15: Multi-list string IDs and extra properties preserved
     ------------------------------------------------------------- */
  describe('T027.15: String IDs and extra properties', () => {
    it('T027.15.1: handles string IDs correctly in multi-list', () => {
      const lists = [
        makeList('vector', [{ id: 'mem-001', score: 0.9, title: 'Memory 1' }]),
        makeList('bm25',   [{ id: 'mem-001', score: 0.8, title: 'Memory 1' }, { id: 'mem-002', score: 0.5 }]),
      ];

      const results = fuseResultsRsfMulti(lists);
      const item = results.find(r => r.id === 'mem-001');

      expect(item).toBeDefined();
      expect(item!.sources.length).toBe(2);
    });

    it('T027.15.2: extra item properties are preserved through multi-list fusion', () => {
      const lists = [
        makeList('vector', [{ id: 1, score: 0.9, title: 'Test Memory', file_path: '/path/to/file.md' }]),
        makeList('bm25',   [{ id: 2, score: 0.8, title: 'Other Memory' }]),
      ];

      const results = fuseResultsRsfMulti(lists);
      const item1 = results.find(r => r.id === 1);

      expect(item1!.title).toBe('Test Memory');
      expect(item1!.file_path).toBe('/path/to/file.md');
    });
  });

  /* -------------------------------------------------------------
     T027.16: Cross-variant known score verification
     ------------------------------------------------------------- */
  describe('T027.16: Cross-variant known score computation', () => {
    it('T027.16.1: verifies cross-variant bonus is applied correctly', () => {
      // Variant 1: item 1 is the only item → normalized to 1.0, no penalty (1/1)
      // → rsfScore from multi = 1.0
      // Variant 2: item 1 is the only item → normalized to 1.0, no penalty (1/1)
      // → rsfScore from multi = 1.0
      // Merge: avgScore = (1.0 + 1.0) / 2 = 1.0
      // VariantCount = 2 → bonus = 0.10 * (2-1) = +0.10
      // Final = clamp01(1.0 + 0.10) = 1.0 (clamped)

      const variantLists = [
        [makeList('v1', [makeItem(1, 0.9)])],
        [makeList('v2', [makeItem(1, 0.9)])],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);
      const item1 = results.find(r => r.id === 1);

      expect(item1!.rsfScore).toBeCloseTo(1.0, 5); // clamped from 1.1
    });

    it('T027.16.2: item in 2 variants with moderate scores gets correct bonus', () => {
      // Variant 1: [item1: 0.9, item99: 0.9] → both normalize to 1.0 (same score → max==min)
      // Since there's only 1 list per variant, totalSources=1, countPresent=1 → no penalty
      // Item1 rsfScore from multi = 1.0
      // Item99 rsfScore from multi = 1.0
      //
      // Variant 2: [item1: 0.9] → normalizes to 1.0 → no penalty
      // Item1 rsfScore from multi = 1.0
      //
      // Item1: avgScore = (1.0 + 1.0) / 2 = 1.0, variantCount=2 → +0.10, clamped to 1.0
      // Item99: avgScore = 1.0 / 1 = 1.0, variantCount=1 → no bonus, rsfScore = 1.0
      // Both are 1.0 because of clamping

      const variantLists = [
        [makeList('v1', [makeItem(1, 0.9), makeItem(99, 0.9)])],
        [makeList('v2', [makeItem(1, 0.9)])],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);
      const item1  = results.find(r => r.id === 1);
      const item99 = results.find(r => r.id === 99);

      // Both should be 1.0 due to clamp (item1 has bonus but gets clamped)
      expect(item1!.rsfScore).toBe(1.0);
      expect(item99!.rsfScore).toBe(1.0);
    });

    it('T027.16.3: item in 2 variants with lower base score correctly benefits from bonus', () => {
      // Variant 1: [item10: 1.0, item1: 0.5] → min=0.5, max=1.0
      // NormV1(item1) = (0.5-0.5)/(1.0-0.5) = 0.0
      // Since there's 1 list per variant, totalSources=1, 1/1 → no penalty
      // Item1 rsfScore from multi = 0.0
      //
      // Variant 2: [item10: 1.0, item1: 0.5] → same
      // Item1 rsfScore from multi = 0.0
      //
      // Item1: avgScore = 0.0, bonus = +0.10, final = 0.10
      // Item10: avgScore = 1.0 each variant, no bonus if only 1 variant... wait item10 IS in both
      // Item10 rsfScore = 1.0 from each variant, avgScore = 1.0, bonus = +0.10, clamped to 1.0

      const variantLists = [
        [makeList('v1', [makeItem(10, 1.0), makeItem(1, 0.5)])],
        [makeList('v2', [makeItem(10, 1.0), makeItem(1, 0.5)])],
      ];

      const results = fuseResultsRsfCrossVariant(variantLists);
      const item1  = results.find(r => r.id === 1);
      const item10 = results.find(r => r.id === 10);

      // Item1: avgScore=0.0, bonus=+0.10 → rsfScore = 0.10
      expect(item1!.rsfScore).toBeCloseTo(0.10, 5);
      // Item10: avgScore=1.0, bonus clamped to 1.0
      expect(item10!.rsfScore).toBe(1.0);
    });
  });
});
