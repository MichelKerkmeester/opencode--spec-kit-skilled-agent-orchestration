// ---------------------------------------------------------------
// MODULE: Test — RSF Fusion
// ---------------------------------------------------------------
// Relative Score Fusion — Single-Pair Variant
// Hybrid RAG Fusion Refinement

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  fuseResultsRsf,
  extractScore,
  minMaxNormalize,
  clamp01,
} from '../lib/search/rsf-fusion';
import type { RsfResult } from '../lib/search/rsf-fusion';
import type { RankedList, RrfItem } from '@spec-kit/shared/algorithms/rrf-fusion';

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

function makeList(source: string, items: RrfItem[]): RankedList {
  return { source, results: items };
}

function makeItem(id: number | string, score?: number, similarity?: number): RrfItem {
  const item: RrfItem = { id };
  if (score !== undefined) item.score = score;
  if (similarity !== undefined) item.similarity = similarity;
  return item;
}

/* ═══════════════════════════════════════════════════════════════
   T023: RSF Fusion Tests
   ═══════════════════════════════════════════════════════════════ */

describe('T023: RSF Fusion (Relative Score Fusion)', () => {

  /* -------------------------------------------------------------
     T023.1: Basic 2-list fusion produces valid ranking
     ------------------------------------------------------------- */
  describe('T023.1: Basic 2-list fusion', () => {
    it('T023.1.1: produces a non-empty result array', () => {
      const listA = makeList('vector', [
        makeItem(1, 0.9),
        makeItem(2, 0.7),
        makeItem(3, 0.5),
      ]);
      const listB = makeList('bm25', [
        makeItem(2, 0.8),
        makeItem(4, 0.6),
        makeItem(1, 0.3),
      ]);

      const results = fuseResultsRsf(listA, listB);
      expect(results.length).toBeGreaterThan(0);
    });

    it('T023.1.2: includes items from both lists', () => {
      const listA = makeList('vector', [
        makeItem(1, 0.9),
        makeItem(2, 0.7),
      ]);
      const listB = makeList('bm25', [
        makeItem(3, 0.8),
        makeItem(4, 0.6),
      ]);

      const results = fuseResultsRsf(listA, listB);
      const ids = results.map(r => r.id);
      expect(ids).toContain(1);
      expect(ids).toContain(2);
      expect(ids).toContain(3);
      expect(ids).toContain(4);
      expect(results.length).toBe(4);
    });

    it('T023.1.3: each result has rsfScore, sources, sourceScores', () => {
      const listA = makeList('vector', [makeItem(1, 0.9)]);
      const listB = makeList('bm25', [makeItem(2, 0.8)]);

      const results = fuseResultsRsf(listA, listB);
      for (const r of results) {
        expect(r).toHaveProperty('rsfScore');
        expect(r).toHaveProperty('sources');
        expect(r).toHaveProperty('sourceScores');
        expect(typeof r.rsfScore).toBe('number');
        expect(Array.isArray(r.sources)).toBe(true);
        expect(typeof r.sourceScores).toBe('object');
      }
    });
  });

  /* -------------------------------------------------------------
     T023.2: Overlapping items get averaged scores
     ------------------------------------------------------------- */
  describe('T023.2: Overlapping items get averaged scores', () => {
    it('T023.2.1: overlapping item has both sources listed', () => {
      const listA = makeList('vector', [
        makeItem(1, 0.9),
        makeItem(2, 0.5),
      ]);
      const listB = makeList('bm25', [
        makeItem(1, 0.8),
        makeItem(3, 0.4),
      ]);

      const results = fuseResultsRsf(listA, listB);
      const item1 = results.find(r => r.id === 1);
      expect(item1).toBeDefined();
      expect(item1!.sources).toContain('vector');
      expect(item1!.sources).toContain('bm25');
      expect(item1!.sources.length).toBe(2);
    });

    it('T023.2.2: overlapping item score is average of normalized scores', () => {
      // List A: items 1 (0.9) and 2 (0.5) → min=0.5, max=0.9
      // normalizedA(1) = (0.9 - 0.5) / (0.9 - 0.5) = 1.0
      // List B: items 1 (0.8) and 3 (0.4) → min=0.4, max=0.8
      // normalizedB(1) = (0.8 - 0.4) / (0.8 - 0.4) = 1.0
      // fused(1) = (1.0 + 1.0) / 2 = 1.0
      const listA = makeList('vector', [
        makeItem(1, 0.9),
        makeItem(2, 0.5),
      ]);
      const listB = makeList('bm25', [
        makeItem(1, 0.8),
        makeItem(3, 0.4),
      ]);

      const results = fuseResultsRsf(listA, listB);
      const item1 = results.find(r => r.id === 1);
      expect(item1!.rsfScore).toBeCloseTo(1.0, 5);
    });

    it('T023.2.3: overlapping item with mid-range scores', () => {
      // List A: items 1 (1.0), 2 (0.6), 3 (0.2) → min=0.2, max=1.0
      // normalizedA(2) = (0.6 - 0.2) / (1.0 - 0.2) = 0.4 / 0.8 = 0.5
      // List B: items 2 (0.7), 4 (0.3) → min=0.3, max=0.7
      // normalizedB(2) = (0.7 - 0.3) / (0.7 - 0.3) = 1.0
      // fused(2) = (0.5 + 1.0) / 2 = 0.75
      const listA = makeList('vector', [
        makeItem(1, 1.0),
        makeItem(2, 0.6),
        makeItem(3, 0.2),
      ]);
      const listB = makeList('bm25', [
        makeItem(2, 0.7),
        makeItem(4, 0.3),
      ]);

      const results = fuseResultsRsf(listA, listB);
      const item2 = results.find(r => r.id === 2);
      expect(item2!.rsfScore).toBeCloseTo(0.75, 5);
    });

    it('T023.2.4: sourceScores record both normalized values', () => {
      const listA = makeList('vector', [
        makeItem(1, 0.9),
        makeItem(2, 0.5),
      ]);
      const listB = makeList('bm25', [
        makeItem(1, 0.8),
        makeItem(3, 0.4),
      ]);

      const results = fuseResultsRsf(listA, listB);
      const item1 = results.find(r => r.id === 1);
      expect(item1!.sourceScores).toHaveProperty('vector');
      expect(item1!.sourceScores).toHaveProperty('bm25');
    });
  });

  /* -------------------------------------------------------------
     T023.3: Single-source items get 0.5 penalty
     ------------------------------------------------------------- */
  describe('T023.3: Single-source items get 0.5 penalty', () => {
    it('T023.3.1: item only in list A gets normalizedScore * 0.5', () => {
      // List A: items 1 (0.9), 2 (0.5) → min=0.5, max=0.9
      // normalizedA(2) = (0.5 - 0.5) / (0.9 - 0.5) = 0.0
      // fused(2) = 0.0 * 0.5 = 0.0
      const listA = makeList('vector', [
        makeItem(1, 0.9),
        makeItem(2, 0.5),
      ]);
      const listB = makeList('bm25', [
        makeItem(1, 0.8),
      ]);

      const results = fuseResultsRsf(listA, listB);
      const item2 = results.find(r => r.id === 2);
      expect(item2!.sources).toEqual(['vector']);
      expect(item2!.rsfScore).toBeCloseTo(0.0, 5);
    });

    it('T023.3.2: item only in list B gets normalizedScore * 0.5', () => {
      // List B: items 3 (0.8), 4 (0.4) → min=0.4, max=0.8
      // normalizedB(3) = (0.8 - 0.4) / (0.8 - 0.4) = 1.0
      // fused(3) = 1.0 * 0.5 = 0.5
      const listA = makeList('vector', [
        makeItem(1, 0.9),
      ]);
      const listB = makeList('bm25', [
        makeItem(3, 0.8),
        makeItem(4, 0.4),
      ]);

      const results = fuseResultsRsf(listA, listB);
      const item3 = results.find(r => r.id === 3);
      expect(item3!.sources).toEqual(['bm25']);
      expect(item3!.rsfScore).toBeCloseTo(0.5, 5);
    });

    it('T023.3.3: overlapping items rank higher than single-source items', () => {
      // Overlapping item 1: both sources → averaged score
      // Single item 2: only A → penalized
      const listA = makeList('vector', [
        makeItem(1, 0.8),
        makeItem(2, 0.8),
      ]);
      const listB = makeList('bm25', [
        makeItem(1, 0.8),
        makeItem(3, 0.8),
      ]);

      const results = fuseResultsRsf(listA, listB);
      const item1 = results.find(r => r.id === 1);
      const item2 = results.find(r => r.id === 2);
      // When all scores are the same, normalized = 1.0
      // item1 (overlap): (1.0 + 1.0) / 2 = 1.0
      // item2 (single): 1.0 * 0.5 = 0.5
      expect(item1!.rsfScore).toBeGreaterThan(item2!.rsfScore);
    });
  });

  /* -------------------------------------------------------------
     T023.4: All scores in [0, 1] range
     ------------------------------------------------------------- */
  describe('T023.4: Score clamping to [0, 1]', () => {
    it('T023.4.1: all rsfScores are between 0 and 1', () => {
      const listA = makeList('vector', [
        makeItem(1, 0.99),
        makeItem(2, 0.01),
        makeItem(3, 0.5),
      ]);
      const listB = makeList('bm25', [
        makeItem(3, 0.99),
        makeItem(4, 0.01),
        makeItem(1, 0.5),
      ]);

      const results = fuseResultsRsf(listA, listB);
      for (const r of results) {
        expect(r.rsfScore).toBeGreaterThanOrEqual(0);
        expect(r.rsfScore).toBeLessThanOrEqual(1);
      }
    });

    it('T023.4.2: extreme score values still clamped', () => {
      const listA = makeList('vector', [
        makeItem(1, 100),
        makeItem(2, -50),
      ]);
      const listB = makeList('bm25', [
        makeItem(1, 200),
        makeItem(3, -100),
      ]);

      const results = fuseResultsRsf(listA, listB);
      for (const r of results) {
        expect(r.rsfScore).toBeGreaterThanOrEqual(0);
        expect(r.rsfScore).toBeLessThanOrEqual(1);
      }
    });
  });

  /* -------------------------------------------------------------
     T023.5: Sort order is descending by rsfScore
     ------------------------------------------------------------- */
  describe('T023.5: Sort order descending', () => {
    it('T023.5.1: results are sorted descending by rsfScore', () => {
      const listA = makeList('vector', [
        makeItem(1, 0.9),
        makeItem(2, 0.7),
        makeItem(3, 0.3),
      ]);
      const listB = makeList('bm25', [
        makeItem(4, 0.85),
        makeItem(2, 0.6),
        makeItem(5, 0.1),
      ]);

      const results = fuseResultsRsf(listA, listB);
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].rsfScore).toBeGreaterThanOrEqual(results[i].rsfScore);
      }
    });
  });

  /* -------------------------------------------------------------
     T023.6: Empty list handling
     ------------------------------------------------------------- */
  describe('T023.6: Empty list handling', () => {
    it('T023.6.1: both lists empty returns empty array', () => {
      const listA = makeList('vector', []);
      const listB = makeList('bm25', []);

      const results = fuseResultsRsf(listA, listB);
      expect(results).toEqual([]);
    });

    it('T023.6.2: list A empty, list B non-empty returns B items with penalty', () => {
      const listA = makeList('vector', []);
      const listB = makeList('bm25', [
        makeItem(1, 0.9),
        makeItem(2, 0.5),
      ]);

      const results = fuseResultsRsf(listA, listB);
      expect(results.length).toBe(2);
      // All items from B only, penalized
      for (const r of results) {
        expect(r.sources).toEqual(['bm25']);
      }
    });

    it('T023.6.3: list B empty, list A non-empty returns A items with penalty', () => {
      const listA = makeList('vector', [
        makeItem(1, 0.9),
        makeItem(2, 0.5),
      ]);
      const listB = makeList('bm25', []);

      const results = fuseResultsRsf(listA, listB);
      expect(results.length).toBe(2);
      for (const r of results) {
        expect(r.sources).toEqual(['vector']);
      }
    });
  });

  /* -------------------------------------------------------------
     T023.7: Single-item lists
     ------------------------------------------------------------- */
  describe('T023.7: Single-item lists', () => {
    it('T023.7.1: single item in each list, no overlap', () => {
      const listA = makeList('vector', [makeItem(1, 0.8)]);
      const listB = makeList('bm25', [makeItem(2, 0.6)]);

      const results = fuseResultsRsf(listA, listB);
      expect(results.length).toBe(2);
      // Single item → normalized = 1.0 (max==min), penalty = 0.5
      for (const r of results) {
        expect(r.rsfScore).toBeCloseTo(0.5, 5);
      }
    });

    it('T023.7.2: single item in each list, overlap', () => {
      const listA = makeList('vector', [makeItem(1, 0.8)]);
      const listB = makeList('bm25', [makeItem(1, 0.6)]);

      const results = fuseResultsRsf(listA, listB);
      expect(results.length).toBe(1);
      // Both normalized = 1.0 (single item → max==min)
      // fused = (1.0 + 1.0) / 2 = 1.0
      expect(results[0].rsfScore).toBeCloseTo(1.0, 5);
      expect(results[0].sources).toContain('vector');
      expect(results[0].sources).toContain('bm25');
    });

    it('T023.7.3: single item in A, empty B', () => {
      const listA = makeList('vector', [makeItem(1, 0.8)]);
      const listB = makeList('bm25', []);

      const results = fuseResultsRsf(listA, listB);
      expect(results.length).toBe(1);
      // normalized = 1.0, penalized = 0.5
      expect(results[0].rsfScore).toBeCloseTo(0.5, 5);
    });
  });

  /* -------------------------------------------------------------
     T023.8: All-same-scores edge case
     ------------------------------------------------------------- */
  describe('T023.8: All-same-scores edge case', () => {
    it('T023.8.1: all items in list A have same score', () => {
      const listA = makeList('vector', [
        makeItem(1, 0.7),
        makeItem(2, 0.7),
        makeItem(3, 0.7),
      ]);
      const listB = makeList('bm25', [
        makeItem(1, 0.9),
        makeItem(4, 0.3),
      ]);

      const results = fuseResultsRsf(listA, listB);
      // All items in A normalized to 1.0 (max==min)
      // Item 1 in both: normalizedA=1.0, normalizedB=1.0, fused=1.0
      const item1 = results.find(r => r.id === 1);
      expect(item1!.rsfScore).toBeCloseTo(1.0, 5);
    });

    it('T023.8.2: all items in both lists have same score', () => {
      const listA = makeList('vector', [
        makeItem(1, 0.5),
        makeItem(2, 0.5),
      ]);
      const listB = makeList('bm25', [
        makeItem(3, 0.5),
        makeItem(4, 0.5),
      ]);

      const results = fuseResultsRsf(listA, listB);
      // All normalized to 1.0 (max==min), all single-source → 0.5
      for (const r of results) {
        expect(r.rsfScore).toBeCloseTo(0.5, 5);
      }
    });

    it('T023.8.3: all same scores with overlap → averaged to 1.0', () => {
      const listA = makeList('vector', [
        makeItem(1, 0.5),
        makeItem(2, 0.5),
      ]);
      const listB = makeList('bm25', [
        makeItem(1, 0.5),
        makeItem(2, 0.5),
      ]);

      const results = fuseResultsRsf(listA, listB);
      for (const r of results) {
        // normalized=1.0 each, average=1.0
        expect(r.rsfScore).toBeCloseTo(1.0, 5);
        expect(r.sources.length).toBe(2);
      }
    });
  });

  /* -------------------------------------------------------------
     T023.10: Rank-based fallback when no score/similarity field
     ------------------------------------------------------------- */
  describe('T023.10: Rank-based fallback', () => {
    it('T023.10.1: items without score or similarity use rank-based scoring', () => {
      const listA = makeList('vector', [
        { id: 1, title: 'First' },
        { id: 2, title: 'Second' },
        { id: 3, title: 'Third' },
      ]);
      const listB = makeList('bm25', [
        { id: 1, title: 'First' },
        { id: 4, title: 'Fourth' },
      ]);

      const results = fuseResultsRsf(listA, listB);
      expect(results.length).toBe(4);
      // All scores valid
      for (const r of results) {
        expect(r.rsfScore).toBeGreaterThanOrEqual(0);
        expect(r.rsfScore).toBeLessThanOrEqual(1);
      }
    });

    it('T023.10.2: extractScore prefers score over similarity', () => {
      const item: RrfItem = { id: 1, score: 0.9, similarity: 0.5 };
      expect(extractScore(item, 0, 3)).toBe(0.9);
    });

    it('T023.10.3: extractScore falls back to similarity if no score', () => {
      const item: RrfItem = { id: 1, similarity: 0.7 };
      expect(extractScore(item, 0, 3)).toBe(0.7);
    });

    it('T023.10.4: extractScore uses rank-based when neither exists', () => {
      const item: RrfItem = { id: 1, title: 'no scores' };
      // rank=0, total=4 → 1 - 0/4 = 1.0
      expect(extractScore(item, 0, 4)).toBeCloseTo(1.0, 5);
      // rank=2, total=4 → 1 - 2/4 = 0.5
      expect(extractScore(item, 2, 4)).toBeCloseTo(0.5, 5);
      // rank=3, total=4 → 1 - 3/4 = 0.25
      expect(extractScore(item, 3, 4)).toBeCloseTo(0.25, 5);
    });

    it('T023.10.5: rank-based fallback with single item returns 1.0', () => {
      const item: RrfItem = { id: 1 };
      // total <= 1 → returns 1.0
      expect(extractScore(item, 0, 1)).toBe(1.0);
    });
  });

  /* -------------------------------------------------------------
     T023.11: Helper function unit tests
     ------------------------------------------------------------- */
  describe('T023.11: Helper functions', () => {
    it('T023.11.1: minMaxNormalize standard case', () => {
      expect(minMaxNormalize(0.5, 0.0, 1.0)).toBeCloseTo(0.5, 5);
      expect(minMaxNormalize(0.0, 0.0, 1.0)).toBeCloseTo(0.0, 5);
      expect(minMaxNormalize(1.0, 0.0, 1.0)).toBeCloseTo(1.0, 5);
    });

    it('T023.11.2: minMaxNormalize when max === min returns 1.0', () => {
      expect(minMaxNormalize(0.5, 0.5, 0.5)).toBe(1.0);
      expect(minMaxNormalize(0.0, 0.0, 0.0)).toBe(1.0);
    });

    it('T023.11.3: clamp01 handles edge cases', () => {
      expect(clamp01(-0.5)).toBe(0);
      expect(clamp01(0)).toBe(0);
      expect(clamp01(0.5)).toBe(0.5);
      expect(clamp01(1.0)).toBe(1);
      expect(clamp01(1.5)).toBe(1);
    });
  });

  /* -------------------------------------------------------------
     T023.12: String IDs
     ------------------------------------------------------------- */
  describe('T023.12: String IDs', () => {
    it('T023.12.1: handles string IDs correctly', () => {
      const listA = makeList('vector', [
        makeItem('abc', 0.9),
        makeItem('def', 0.5),
      ]);
      const listB = makeList('bm25', [
        makeItem('abc', 0.7),
        makeItem('ghi', 0.3),
      ]);

      const results = fuseResultsRsf(listA, listB);
      const abc = results.find(r => r.id === 'abc');
      expect(abc).toBeDefined();
      expect(abc!.sources.length).toBe(2);
    });
  });

  /* -------------------------------------------------------------
     T023.13: Large list stress test
     ------------------------------------------------------------- */
  describe('T023.13: Larger lists', () => {
    it('T023.13.1: handles 100 items per list', () => {
      const itemsA: RrfItem[] = Array.from({ length: 100 }, (_, i) => makeItem(i, 1.0 - i * 0.01));
      const itemsB: RrfItem[] = Array.from({ length: 100 }, (_, i) => makeItem(i + 50, 1.0 - i * 0.01));

      const listA = makeList('vector', itemsA);
      const listB = makeList('bm25', itemsB);

      const results = fuseResultsRsf(listA, listB);
      // 100 unique from A (0-99) + 100 from B (50-149) = 150 unique IDs
      expect(results.length).toBe(150);
      // All scores in range
      for (const r of results) {
        expect(r.rsfScore).toBeGreaterThanOrEqual(0);
        expect(r.rsfScore).toBeLessThanOrEqual(1);
      }
      // Sorted descending
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].rsfScore).toBeGreaterThanOrEqual(results[i].rsfScore);
      }
    });
  });

  /* -------------------------------------------------------------
     T023.14: Item properties preserved
     ------------------------------------------------------------- */
  describe('T023.14: Item properties preserved', () => {
    it('T023.14.1: extra properties from source items are preserved', () => {
      const listA = makeList('vector', [
        { id: 1, score: 0.9, title: 'Memory A', file_path: '/a.md' },
      ]);
      const listB = makeList('bm25', [
        { id: 2, score: 0.8, title: 'Memory B', file_path: '/b.md' },
      ]);

      const results = fuseResultsRsf(listA, listB);
      const item1 = results.find(r => r.id === 1);
      const item2 = results.find(r => r.id === 2);
      expect(item1!.title).toBe('Memory A');
      expect(item1!.file_path).toBe('/a.md');
      expect(item2!.title).toBe('Memory B');
      expect(item2!.file_path).toBe('/b.md');
    });

    it('T023.14.2: overlapping item merges properties (A takes precedence)', () => {
      const listA = makeList('vector', [
        { id: 1, score: 0.9, title: 'Title from A', extra_a: true },
      ]);
      const listB = makeList('bm25', [
        { id: 1, score: 0.8, title: 'Title from B', extra_b: true },
      ]);

      const results = fuseResultsRsf(listA, listB);
      const item1 = results.find(r => r.id === 1);
      // A properties take precedence on conflict
      expect(item1!.title).toBe('Title from A');
      // B's unique properties are also present
      expect(item1!.extra_b).toBe(true);
    });
  });

  /* -------------------------------------------------------------
     T023.15: Computed scores verification
     ------------------------------------------------------------- */
  describe('T023.15: Detailed score computation verification', () => {
    it('T023.15.1: verifies full computation for a known scenario', () => {
      // List A: [id1: 1.0, id2: 0.6, id3: 0.2] → min=0.2, max=1.0, range=0.8
      //   normalizedA(1) = (1.0-0.2)/0.8 = 1.0
      //   normalizedA(2) = (0.6-0.2)/0.8 = 0.5
      //   normalizedA(3) = (0.2-0.2)/0.8 = 0.0
      //
      // List B: [id2: 0.9, id4: 0.1] → min=0.1, max=0.9, range=0.8
      //   normalizedB(2) = (0.9-0.1)/0.8 = 1.0
      //   normalizedB(4) = (0.1-0.1)/0.8 = 0.0
      //
      // id1: A only → 1.0 * 0.5 = 0.5
      // id2: both   → (0.5 + 1.0) / 2 = 0.75
      // id3: A only → 0.0 * 0.5 = 0.0
      // id4: B only → 0.0 * 0.5 = 0.0
      //
      // Sorted: id2 (0.75), id1 (0.5), id3 (0.0), id4 (0.0)

      const listA = makeList('vector', [
        makeItem(1, 1.0),
        makeItem(2, 0.6),
        makeItem(3, 0.2),
      ]);
      const listB = makeList('bm25', [
        makeItem(2, 0.9),
        makeItem(4, 0.1),
      ]);

      const results = fuseResultsRsf(listA, listB);

      expect(results[0].id).toBe(2);
      expect(results[0].rsfScore).toBeCloseTo(0.75, 5);

      expect(results[1].id).toBe(1);
      expect(results[1].rsfScore).toBeCloseTo(0.5, 5);

      // id3 and id4 both have 0.0, order between them is implementation-defined
      const item3 = results.find(r => r.id === 3);
      const item4 = results.find(r => r.id === 4);
      expect(item3!.rsfScore).toBeCloseTo(0.0, 5);
      expect(item4!.rsfScore).toBeCloseTo(0.0, 5);
    });
  });
});
