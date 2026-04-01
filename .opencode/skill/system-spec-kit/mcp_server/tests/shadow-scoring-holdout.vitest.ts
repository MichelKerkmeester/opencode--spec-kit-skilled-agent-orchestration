// TEST: Shadow Scoring with Holdout (REQ-D4-006)
// Tests holdout selection, rank comparison engine, Kendall tau,
// NDCG/MRR metrics, SQLite logging, weekly tracker, promotion gate,
// feature flag gating, and edge cases.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import Database from 'better-sqlite3';

import {
  // Feature flag
  isShadowFeedbackEnabled,

  // Constants
  DEFAULT_HOLDOUT_PERCENT,
  PROMOTION_THRESHOLD_WEEKS,

  // Holdout selection
  selectHoldoutQueries,
  seededRandom,

  // Rank comparison
  compareRanks,
  classifyDirection,
  computeKendallTau,
  computeNDCG,
  computeMRR,

  // Logging
  initShadowScoringLog,
  logRankDelta,
  getShadowScoringHistory,

  // Weekly tracker
  recordCycleResult,
  getConsecutiveImprovements,
  isPromotionReady,
  getCycleResults,

  // Promotion gate
  evaluatePromotionGate,

  // Pipeline
  runShadowEvaluation,

  // Types
  type RankedItem,
  type CycleResult,
  type RankComparisonResult,
} from '../lib/feedback/shadow-scoring';

/* ───────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

type TestDatabase = InstanceType<typeof Database>;

function createTestDb(): { db: TestDatabase; dbPath: string } {
  const dbPath = path.join(
    os.tmpdir(),
    `shadow-scoring-test-${Date.now()}-${Math.random().toString(36).slice(2)}.sqlite`
  );
  const db = new Database(dbPath);
  return { db, dbPath };
}

function cleanupDb(db: TestDatabase, dbPath: string): void {
  try { db.close(); } catch { /* ignore */ }
  try { fs.unlinkSync(dbPath); } catch { /* ignore */ }
}

/** Build a ranked list with default relevance scores. */
function makeRankedItems(ids: string[], relevanceScores?: number[]): RankedItem[] {
  return ids.map((id, idx) => ({
    resultId: id,
    rank: idx + 1,
    relevanceScore: relevanceScores ? relevanceScores[idx] : 1.0 - idx * 0.1,
  }));
}

/** Save/restore env helper. */
function envGuard(key: string) {
  const original = process.env[key];
  return {
    set(val: string) { process.env[key] = val; },
    delete() { delete process.env[key]; },
    restore() {
      if (original === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = original;
      }
    },
  };
}

/* ───────────────────────────────────────────────────────────────
   1. FEATURE FLAG TESTS
   ──────────────────────────────────────────────────────────────── */

describe('Feature Flag: SPECKIT_SHADOW_FEEDBACK', () => {
  const flag = envGuard('SPECKIT_SHADOW_FEEDBACK');
  afterEach(() => flag.restore());

  it('returns true when env var is unset (graduated)', () => {
    flag.delete();
    expect(isShadowFeedbackEnabled()).toBe(true);
  });

  it('returns false when env var is "false"', () => {
    flag.set('false');
    expect(isShadowFeedbackEnabled()).toBe(false);
  });

  it('returns true when env var is "true"', () => {
    flag.set('true');
    expect(isShadowFeedbackEnabled()).toBe(true);
  });

  it('returns true when env var is "1"', () => {
    flag.set('1');
    expect(isShadowFeedbackEnabled()).toBe(true);
  });

  it('returns true when env var has surrounding whitespace', () => {
    flag.set('  true  ');
    expect(isShadowFeedbackEnabled()).toBe(true);
  });

  it('returns true when env var is "TRUE" (case-insensitive)', () => {
    flag.set('TRUE');
    expect(isShadowFeedbackEnabled()).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   2. SEEDED PRNG TESTS
   ──────────────────────────────────────────────────────────────── */

describe('seededRandom', () => {
  it('produces deterministic sequence for same seed', () => {
    const rng1 = seededRandom(42);
    const rng2 = seededRandom(42);
    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());
    expect(seq1).toEqual(seq2);
  });

  it('produces different sequences for different seeds', () => {
    const rng1 = seededRandom(42);
    const rng2 = seededRandom(99);
    const seq1 = Array.from({ length: 5 }, () => rng1());
    const seq2 = Array.from({ length: 5 }, () => rng2());
    expect(seq1).not.toEqual(seq2);
  });

  it('produces values in [0, 1)', () => {
    const rng = seededRandom(123);
    for (let i = 0; i < 100; i++) {
      const val = rng();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   3. HOLDOUT SELECTION TESTS
   ──────────────────────────────────────────────────────────────── */

describe('selectHoldoutQueries', () => {
  const queryIds = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];

  it('selects ~20% of queries by default', () => {
    const holdout = selectHoldoutQueries(queryIds);
    // 20% of 10 = 2
    expect(holdout.length).toBe(2);
  });

  it('respects custom holdout percentage', () => {
    const holdout = selectHoldoutQueries(queryIds, { holdoutPercent: 0.50 });
    expect(holdout.length).toBe(5);
  });

  it('is deterministic with the same seed', () => {
    const h1 = selectHoldoutQueries(queryIds, { seed: 42 });
    const h2 = selectHoldoutQueries(queryIds, { seed: 42 });
    expect(h1).toEqual(h2);
  });

  it('produces different results with different seeds', () => {
    // Use a larger holdout to make collision extremely unlikely
    const h1 = selectHoldoutQueries(queryIds, { seed: 42, holdoutPercent: 0.50 });
    const h2 = selectHoldoutQueries(queryIds, { seed: 7777, holdoutPercent: 0.50 });
    // Different seeds should give different selections with 5-choose-from-10
    expect(h1).not.toEqual(h2);
  });

  it('returns empty array for empty input', () => {
    expect(selectHoldoutQueries([])).toEqual([]);
  });

  it('returns empty array for 0% holdout', () => {
    expect(selectHoldoutQueries(queryIds, { holdoutPercent: 0 })).toEqual([]);
  });

  it('returns all queries for 100% holdout', () => {
    const holdout = selectHoldoutQueries(queryIds, { holdoutPercent: 1.0 });
    expect(holdout.length).toBe(queryIds.length);
    // Should contain all original IDs
    for (const q of queryIds) {
      expect(holdout).toContain(q);
    }
  });

  it('selects at least 1 query even for very small holdout on small sets', () => {
    const small = ['q1', 'q2', 'q3'];
    const holdout = selectHoldoutQueries(small, { holdoutPercent: 0.01 });
    expect(holdout.length).toBeGreaterThanOrEqual(1);
  });

  it('returns only items from the input set', () => {
    const holdout = selectHoldoutQueries(queryIds, { holdoutPercent: 0.50 });
    for (const q of holdout) {
      expect(queryIds).toContain(q);
    }
  });

  describe('stratified sampling', () => {
    it('provides representative coverage across intent classes', () => {
      const ids = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
      const intentClasses = new Map<string, string>([
        ['q1', 'navigation'], ['q2', 'navigation'], ['q3', 'navigation'],
        ['q4', 'research'], ['q5', 'research'], ['q6', 'research'],
        ['q7', 'debug'], ['q8', 'debug'],
        ['q9', 'status'], ['q10', 'status'],
      ]);

      const holdout = selectHoldoutQueries(ids, {
        holdoutPercent: 0.50,
        seed: 42,
        intentClasses,
      });

      // Each intent class should have at least 1 representative
      const holdoutClasses = new Set(holdout.map(q => intentClasses.get(q)));
      expect(holdoutClasses.size).toBeGreaterThanOrEqual(3);
    });

    it('handles queries with no intent classification', () => {
      const ids = ['q1', 'q2', 'q3', 'q4'];
      const intentClasses = new Map<string, string>([
        ['q1', 'navigation'],
        // q2, q3, q4 have no classification
      ]);

      const holdout = selectHoldoutQueries(ids, {
        holdoutPercent: 0.50,
        seed: 42,
        intentClasses,
      });

      expect(holdout.length).toBeGreaterThan(0);
      for (const q of holdout) {
        expect(ids).toContain(q);
      }
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   4. DIRECTION CLASSIFICATION TESTS
   ──────────────────────────────────────────────────────────────── */

describe('classifyDirection', () => {
  it('classifies positive delta as improved', () => {
    expect(classifyDirection(3)).toBe('improved');
    expect(classifyDirection(1)).toBe('improved');
  });

  it('classifies negative delta as degraded', () => {
    expect(classifyDirection(-2)).toBe('degraded');
    expect(classifyDirection(-1)).toBe('degraded');
  });

  it('classifies zero delta as unchanged', () => {
    expect(classifyDirection(0)).toBe('unchanged');
  });
});

/* ───────────────────────────────────────────────────────────────
   5. KENDALL TAU CORRELATION TESTS
   ──────────────────────────────────────────────────────────────── */

describe('computeKendallTau', () => {
  it('returns 1 for identical orderings', () => {
    const live = new Map([['a', 1], ['b', 2], ['c', 3]]);
    const shadow = new Map([['a', 1], ['b', 2], ['c', 3]]);
    expect(computeKendallTau(live, shadow)).toBe(1);
  });

  it('returns -1 for fully reversed orderings', () => {
    const live = new Map([['a', 1], ['b', 2], ['c', 3]]);
    const shadow = new Map([['a', 3], ['b', 2], ['c', 1]]);
    expect(computeKendallTau(live, shadow)).toBe(-1);
  });

  it('returns 0 for fewer than 2 overlapping items', () => {
    const live = new Map([['a', 1]]);
    const shadow = new Map([['a', 1]]);
    expect(computeKendallTau(live, shadow)).toBe(0);
  });

  it('returns 0 when no overlap', () => {
    const live = new Map([['a', 1], ['b', 2]]);
    const shadow = new Map([['c', 1], ['d', 2]]);
    expect(computeKendallTau(live, shadow)).toBe(0);
  });

  it('computes correct intermediate value for partial reorder', () => {
    // a:1, b:2, c:3, d:4 vs a:1, c:2, b:3, d:4
    // Swap b and c: one discordant pair out of 6
    const live = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4]]);
    const shadow = new Map([['a', 1], ['c', 2], ['b', 3], ['d', 4]]);

    const tau = computeKendallTau(live, shadow);
    // pairs: (a,b) conc, (a,c) conc, (a,d) conc, (b,c) disc, (b,d) conc, (c,d) conc
    // concordant=5, discordant=1, tau=(5-1)/6=0.6667
    expect(tau).toBeCloseTo(4 / 6, 5);
  });

  it('handles ties correctly (neither concordant nor discordant)', () => {
    const live = new Map([['a', 1], ['b', 1], ['c', 2]]);
    const shadow = new Map([['a', 1], ['b', 2], ['c', 3]]);
    // Pair (a,b): liveDiff=0 → product=0 → tie, not counted
    // tau computation excludes ties from total pairs
    const tau = computeKendallTau(live, shadow);
    expect(typeof tau).toBe('number');
    expect(tau).toBeGreaterThanOrEqual(-1);
    expect(tau).toBeLessThanOrEqual(1);
  });
});

/* ───────────────────────────────────────────────────────────────
   6. NDCG TESTS
   ──────────────────────────────────────────────────────────────── */

describe('computeNDCG', () => {
  it('returns 1 for perfectly ordered items', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 3 },
      { resultId: 'b', rank: 2, relevanceScore: 2 },
      { resultId: 'c', rank: 3, relevanceScore: 1 },
    ];
    expect(computeNDCG(items)).toBeCloseTo(1, 5);
  });

  it('returns < 1 for suboptimal ordering', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 1 },
      { resultId: 'b', rank: 2, relevanceScore: 3 },
      { resultId: 'c', rank: 3, relevanceScore: 2 },
    ];
    expect(computeNDCG(items)).toBeLessThan(1);
    expect(computeNDCG(items)).toBeGreaterThan(0);
  });

  it('returns 0 for empty items', () => {
    expect(computeNDCG([])).toBe(0);
  });

  it('returns 0 when all relevance scores are 0', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 0 },
      { resultId: 'b', rank: 2, relevanceScore: 0 },
    ];
    expect(computeNDCG(items)).toBe(0);
  });

  it('respects k cutoff', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 3 },
      { resultId: 'b', rank: 2, relevanceScore: 2 },
      { resultId: 'c', rank: 3, relevanceScore: 1 },
      { resultId: 'd', rank: 4, relevanceScore: 0 },
    ];
    // NDCG@2 should only consider first 2 items
    const ndcg2 = computeNDCG(items, 2);
    expect(ndcg2).toBeCloseTo(1, 5); // Items at positions 1,2 are in ideal order for top-2
  });

  it('returns 1 for single perfectly relevant item', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 5 },
    ];
    expect(computeNDCG(items)).toBeCloseTo(1, 5);
  });

  it('preserves sparse rank gaps instead of compressing judged items upward', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1 },
      { resultId: 'b', rank: 2, relevanceScore: 3 },
      { resultId: 'c', rank: 3 },
      { resultId: 'd', rank: 4, relevanceScore: 2 },
    ];

    const compressedEquivalent: RankedItem[] = [
      { resultId: 'b', rank: 1, relevanceScore: 3 },
      { resultId: 'd', rank: 2, relevanceScore: 2 },
    ];

    expect(computeNDCG(items)).toBeLessThan(computeNDCG(compressedEquivalent));
    expect(computeNDCG(items)).toBeCloseTo(
      (3 / Math.log2(3) + 2 / Math.log2(5)) / (3 + 2 / Math.log2(3)),
      6,
    );
  });
});

/* ───────────────────────────────────────────────────────────────
   7. MRR TESTS
   ──────────────────────────────────────────────────────────────── */

describe('computeMRR', () => {
  it('returns 1 when first result is relevant', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 1 },
      { resultId: 'b', rank: 2, relevanceScore: 0 },
    ];
    expect(computeMRR(items)).toBe(1);
  });

  it('returns 0.5 when second result is first relevant', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 0 },
      { resultId: 'b', rank: 2, relevanceScore: 1 },
    ];
    expect(computeMRR(items)).toBe(0.5);
  });

  it('returns 0 when no relevant results', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 0 },
      { resultId: 'b', rank: 2, relevanceScore: 0 },
    ];
    expect(computeMRR(items)).toBe(0);
  });

  it('returns 0 for empty list', () => {
    expect(computeMRR([])).toBe(0);
  });

  it('returns 1/3 when third result is first relevant', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 0 },
      { resultId: 'b', rank: 2, relevanceScore: 0 },
      { resultId: 'c', rank: 3, relevanceScore: 1 },
    ];
    expect(computeMRR(items)).toBeCloseTo(1 / 3, 5);
  });

  it('uses original sparse ranks for the first relevant result', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1 },
      { resultId: 'b', rank: 2 },
      { resultId: 'c', rank: 3, relevanceScore: 1 },
    ];

    expect(computeMRR(items)).toBeCloseTo(1 / 3, 5);
  });
});

/* ───────────────────────────────────────────────────────────────
   8. RANK COMPARISON ENGINE TESTS
   ──────────────────────────────────────────────────────────────── */

describe('compareRanks', () => {
  it('computes correct deltas for known rank lists', () => {
    const live = makeRankedItems(['a', 'b', 'c'], [3, 2, 1]);
    const shadow: RankedItem[] = [
      { resultId: 'b', rank: 1, relevanceScore: 3 },
      { resultId: 'a', rank: 2, relevanceScore: 2 },
      { resultId: 'c', rank: 3, relevanceScore: 1 },
    ];

    const result = compareRanks('q1', live, shadow);

    expect(result.queryId).toBe('q1');
    expect(result.deltas).toHaveLength(3);

    // 'a': live=1, shadow=2 → delta=-1 → degraded
    const deltaA = result.deltas.find(d => d.resultId === 'a')!;
    expect(deltaA.liveRank).toBe(1);
    expect(deltaA.shadowRank).toBe(2);
    expect(deltaA.delta).toBe(-1);
    expect(deltaA.direction).toBe('degraded');

    // 'b': live=2, shadow=1 → delta=1 → improved
    const deltaB = result.deltas.find(d => d.resultId === 'b')!;
    expect(deltaB.delta).toBe(1);
    expect(deltaB.direction).toBe('improved');

    // 'c': live=3, shadow=3 → delta=0 → unchanged
    const deltaC = result.deltas.find(d => d.resultId === 'c')!;
    expect(deltaC.delta).toBe(0);
    expect(deltaC.direction).toBe('unchanged');
  });

  it('reports correct direction counts', () => {
    const live = makeRankedItems(['a', 'b', 'c', 'd']);
    const shadow: RankedItem[] = [
      { resultId: 'c', rank: 1, relevanceScore: 1 },
      { resultId: 'a', rank: 2, relevanceScore: 0.9 },
      { resultId: 'b', rank: 3, relevanceScore: 0.8 },
      { resultId: 'd', rank: 4, relevanceScore: 0.7 },
    ];

    const result = compareRanks('q1', live, shadow);
    // a: 1→2 degraded, b: 2→3 degraded, c: 3→1 improved, d: 4→4 unchanged
    expect(result.metrics.improvedCount).toBe(1);
    expect(result.metrics.degradedCount).toBe(2);
    expect(result.metrics.unchangedCount).toBe(1);
  });

  it('computes Kendall tau correctly', () => {
    const live = makeRankedItems(['a', 'b', 'c']);
    const shadow: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 1 },
      { resultId: 'b', rank: 2, relevanceScore: 0.9 },
      { resultId: 'c', rank: 3, relevanceScore: 0.8 },
    ];

    const result = compareRanks('q1', live, shadow);
    expect(result.metrics.kendallTau).toBe(1);
  });

  it('computes NDCG delta', () => {
    // Shadow has better ordering → positive NDCG delta
    const live: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 1 },
      { resultId: 'b', rank: 2, relevanceScore: 3 },
    ];
    const shadow: RankedItem[] = [
      { resultId: 'b', rank: 1, relevanceScore: 3 },
      { resultId: 'a', rank: 2, relevanceScore: 1 },
    ];

    const result = compareRanks('q1', live, shadow);
    expect(result.metrics.ndcgDelta).toBeGreaterThan(0);
  });

  it('computes MRR delta', () => {
    // Shadow has relevant item at rank 1, live has it at rank 2
    const live: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 0 },
      { resultId: 'b', rank: 2, relevanceScore: 1 },
    ];
    const shadow: RankedItem[] = [
      { resultId: 'b', rank: 1, relevanceScore: 1 },
      { resultId: 'a', rank: 2, relevanceScore: 0 },
    ];

    const result = compareRanks('q1', live, shadow);
    // liveMRR = 0.5, shadowMRR = 1.0, delta = 0.5
    expect(result.metrics.mrrDelta).toBeCloseTo(0.5, 5);
  });

  it('keeps unjudged positions in NDCG and MRR deltas', () => {
    const live: RankedItem[] = [
      { resultId: 'x', rank: 1 },
      { resultId: 'a', rank: 2, relevanceScore: 3 },
      { resultId: 'b', rank: 3, relevanceScore: 1 },
    ];
    const shadow: RankedItem[] = [
      { resultId: 'a', rank: 1, relevanceScore: 3 },
      { resultId: 'x', rank: 2 },
      { resultId: 'b', rank: 3, relevanceScore: 1 },
    ];

    const result = compareRanks('q1', live, shadow);

    expect(result.metrics.ndcgDelta).toBeGreaterThan(0);
    expect(result.metrics.ndcgDelta).toBeCloseTo(
      ((3 / Math.log2(2) + 1 / Math.log2(4)) / (3 + 1 / Math.log2(3)))
      - ((3 / Math.log2(3) + 1 / Math.log2(4)) / (3 + 1 / Math.log2(3))),
      6,
    );
    expect(result.metrics.mrrDelta).toBeCloseTo(0.5, 6);
  });

  it('handles identical rankings', () => {
    const items = makeRankedItems(['a', 'b', 'c']);
    const result = compareRanks('q1', items, items);

    expect(result.metrics.kendallTau).toBe(1);
    expect(result.metrics.ndcgDelta).toBeCloseTo(0, 10);
    expect(result.metrics.mrrDelta).toBeCloseTo(0, 10);
    expect(result.metrics.improvedCount).toBe(0);
    expect(result.metrics.degradedCount).toBe(0);
    expect(result.metrics.unchangedCount).toBe(3);
  });

  it('handles empty live list', () => {
    const shadow = makeRankedItems(['a', 'b']);
    const result = compareRanks('q1', [], shadow);

    expect(result.deltas).toHaveLength(0);
    expect(result.metrics.improvedCount).toBe(0);
    expect(result.metrics.degradedCount).toBe(0);
    expect(result.metrics.unchangedCount).toBe(0);
  });

  it('handles empty shadow list', () => {
    const live = makeRankedItems(['a', 'b']);
    const result = compareRanks('q1', live, []);

    expect(result.deltas).toHaveLength(0);
    expect(result.metrics.kendallTau).toBe(0);
  });

  it('handles single-item rankings', () => {
    const live: RankedItem[] = [{ resultId: 'a', rank: 1, relevanceScore: 1 }];
    const shadow: RankedItem[] = [{ resultId: 'a', rank: 1, relevanceScore: 1 }];

    const result = compareRanks('q1', live, shadow);
    expect(result.deltas).toHaveLength(1);
    expect(result.deltas[0].direction).toBe('unchanged');
    expect(result.metrics.kendallTau).toBe(0); // Kendall needs >= 2 items
  });

  it('only includes overlapping items in deltas', () => {
    const live = makeRankedItems(['a', 'b', 'c']);
    const shadow: RankedItem[] = [
      { resultId: 'b', rank: 1, relevanceScore: 1 },
      { resultId: 'd', rank: 2, relevanceScore: 0.5 }, // not in live
    ];

    const result = compareRanks('q1', live, shadow);
    // Only 'b' is in both lists
    expect(result.deltas).toHaveLength(1);
    expect(result.deltas[0].resultId).toBe('b');
  });
});

/* ───────────────────────────────────────────────────────────────
   9. SQLITE LOGGING TESTS
   ──────────────────────────────────────────────────────────────── */

describe('SQLite Logging', () => {
  let db: TestDatabase;
  let dbPath: string;
  const flag = envGuard('SPECKIT_SHADOW_FEEDBACK');

  beforeEach(() => {
    const setup = createTestDb();
    db = setup.db;
    dbPath = setup.dbPath;
    flag.set('true');
  });

  afterEach(() => {
    cleanupDb(db, dbPath);
    flag.restore();
  });

  describe('initShadowScoringLog', () => {
    it('creates tables idempotently', () => {
      initShadowScoringLog(db);
      initShadowScoringLog(db); // should not throw

      // Verify tables exist
      const tables = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('shadow_scoring_log', 'shadow_cycle_results') ORDER BY name"
      ).all() as Array<{ name: string }>;

      expect(tables.map(t => t.name)).toEqual(['shadow_cycle_results', 'shadow_scoring_log']);
    });
  });

  describe('logRankDelta', () => {
    it('writes and reads rank deltas (round-trip)', () => {
      const comparison: RankComparisonResult = {
        queryId: 'q1',
        deltas: [
          { resultId: 'r1', liveRank: 1, shadowRank: 2, delta: -1, direction: 'degraded' },
          { resultId: 'r2', liveRank: 2, shadowRank: 1, delta: 1, direction: 'improved' },
          { resultId: 'r3', liveRank: 3, shadowRank: 3, delta: 0, direction: 'unchanged' },
        ],
        metrics: {
          kendallTau: 0.5,
          ndcgDelta: 0.1,
          mrrDelta: 0.05,
          improvedCount: 1,
          degradedCount: 1,
          unchangedCount: 1,
        },
      };

      const inserted = logRankDelta(db, comparison, 'cycle-1', 1000);
      expect(inserted).toBe(3);

      const history = getShadowScoringHistory(db, { queryId: 'q1' });
      expect(history).toHaveLength(3);

      const improved = history.find(r => r.direction === 'improved');
      expect(improved).toBeDefined();
      expect(improved!.result_id).toBe('r2');
      expect(improved!.live_rank).toBe(2);
      expect(improved!.shadow_rank).toBe(1);
      expect(improved!.delta).toBe(1);
      expect(improved!.cycle_id).toBe('cycle-1');
    });

    it('returns 0 when feature flag is OFF', () => {
      flag.set('false');

      const comparison: RankComparisonResult = {
        queryId: 'q1',
        deltas: [
          { resultId: 'r1', liveRank: 1, shadowRank: 1, delta: 0, direction: 'unchanged' },
        ],
        metrics: {
          kendallTau: 1,
          ndcgDelta: 0,
          mrrDelta: 0,
          improvedCount: 0,
          degradedCount: 0,
          unchangedCount: 1,
        },
      };

      const inserted = logRankDelta(db, comparison, 'cycle-1', 1000);
      expect(inserted).toBe(0);
    });

    it('handles empty deltas array', () => {
      const comparison: RankComparisonResult = {
        queryId: 'q1',
        deltas: [],
        metrics: {
          kendallTau: 0,
          ndcgDelta: 0,
          mrrDelta: 0,
          improvedCount: 0,
          degradedCount: 0,
          unchangedCount: 0,
        },
      };

      const inserted = logRankDelta(db, comparison, 'cycle-1', 1000);
      expect(inserted).toBe(0);
    });
  });

  describe('getShadowScoringHistory', () => {
    it('filters by cycleId', () => {
      initShadowScoringLog(db);

      const comp1: RankComparisonResult = {
        queryId: 'q1',
        deltas: [
          { resultId: 'r1', liveRank: 1, shadowRank: 1, delta: 0, direction: 'unchanged' },
        ],
        metrics: { kendallTau: 1, ndcgDelta: 0, mrrDelta: 0, improvedCount: 0, degradedCount: 0, unchangedCount: 1 },
      };
      const comp2: RankComparisonResult = {
        queryId: 'q2',
        deltas: [
          { resultId: 'r2', liveRank: 1, shadowRank: 2, delta: -1, direction: 'degraded' },
        ],
        metrics: { kendallTau: -1, ndcgDelta: -0.1, mrrDelta: 0, improvedCount: 0, degradedCount: 1, unchangedCount: 0 },
      };

      logRankDelta(db, comp1, 'cycle-A', 1000);
      logRankDelta(db, comp2, 'cycle-B', 2000);

      const historyA = getShadowScoringHistory(db, { cycleId: 'cycle-A' });
      expect(historyA).toHaveLength(1);
      expect(historyA[0].cycle_id).toBe('cycle-A');

      const historyB = getShadowScoringHistory(db, { cycleId: 'cycle-B' });
      expect(historyB).toHaveLength(1);
      expect(historyB[0].cycle_id).toBe('cycle-B');
    });

    it('respects limit option', () => {
      initShadowScoringLog(db);

      const comp: RankComparisonResult = {
        queryId: 'q1',
        deltas: [
          { resultId: 'r1', liveRank: 1, shadowRank: 1, delta: 0, direction: 'unchanged' },
          { resultId: 'r2', liveRank: 2, shadowRank: 2, delta: 0, direction: 'unchanged' },
          { resultId: 'r3', liveRank: 3, shadowRank: 3, delta: 0, direction: 'unchanged' },
        ],
        metrics: { kendallTau: 1, ndcgDelta: 0, mrrDelta: 0, improvedCount: 0, degradedCount: 0, unchangedCount: 3 },
      };

      logRankDelta(db, comp, 'cycle-1', 1000);

      const limited = getShadowScoringHistory(db, { limit: 2 });
      expect(limited).toHaveLength(2);
    });

    it('returns empty array with no data', () => {
      initShadowScoringLog(db);
      const history = getShadowScoringHistory(db);
      expect(history).toEqual([]);
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   10. WEEKLY EVALUATION TRACKER TESTS
   ──────────────────────────────────────────────────────────────── */

describe('Weekly Evaluation Tracker', () => {
  let db: TestDatabase;
  let dbPath: string;
  const flag = envGuard('SPECKIT_SHADOW_FEEDBACK');

  beforeEach(() => {
    const setup = createTestDb();
    db = setup.db;
    dbPath = setup.dbPath;
    flag.set('true');
  });

  afterEach(() => {
    cleanupDb(db, dbPath);
    flag.restore();
  });

  describe('recordCycleResult', () => {
    it('stores and retrieves a cycle result', () => {
      const cycle: CycleResult = {
        cycleId: 'week-1',
        evaluatedAt: 1000,
        queryCount: 5,
        meanNdcgDelta: 0.05,
        meanMrrDelta: 0.02,
        meanKendallTau: 0.8,
        totalImproved: 3,
        totalDegraded: 1,
        totalUnchanged: 1,
        isImprovement: true,
      };

      const id = recordCycleResult(db, cycle);
      expect(id).not.toBeNull();

      const results = getCycleResults(db);
      expect(results).toHaveLength(1);
      expect(results[0].cycleId).toBe('week-1');
      expect(results[0].meanNdcgDelta).toBeCloseTo(0.05, 5);
      expect(results[0].isImprovement).toBe(true);
    });

    it('returns null when feature flag is OFF', () => {
      flag.set('false');

      const cycle: CycleResult = {
        cycleId: 'week-1',
        evaluatedAt: 1000,
        queryCount: 5,
        meanNdcgDelta: 0.05,
        meanMrrDelta: 0.02,
        meanKendallTau: 0.8,
        totalImproved: 3,
        totalDegraded: 1,
        totalUnchanged: 1,
        isImprovement: true,
      };

      const id = recordCycleResult(db, cycle);
      expect(id).toBeNull();
    });
  });

  describe('getConsecutiveImprovements', () => {
    it('returns 0 when no cycle results exist', () => {
      initShadowScoringLog(db);
      expect(getConsecutiveImprovements(db)).toBe(0);
    });

    it('counts consecutive improvements from most recent', () => {
      initShadowScoringLog(db);

      // Record 3 cycles: regression, improvement, improvement
      const cycles: CycleResult[] = [
        { cycleId: 'w1', evaluatedAt: 1000, queryCount: 5, meanNdcgDelta: -0.1, meanMrrDelta: 0, meanKendallTau: 0.5, totalImproved: 1, totalDegraded: 4, totalUnchanged: 0, isImprovement: false },
        { cycleId: 'w2', evaluatedAt: 2000, queryCount: 5, meanNdcgDelta: 0.05, meanMrrDelta: 0, meanKendallTau: 0.7, totalImproved: 3, totalDegraded: 1, totalUnchanged: 1, isImprovement: true },
        { cycleId: 'w3', evaluatedAt: 3000, queryCount: 5, meanNdcgDelta: 0.08, meanMrrDelta: 0, meanKendallTau: 0.9, totalImproved: 4, totalDegraded: 0, totalUnchanged: 1, isImprovement: true },
      ];

      for (const c of cycles) {
        recordCycleResult(db, c);
      }

      // Most recent 2 are improvements, then regression breaks the streak
      expect(getConsecutiveImprovements(db)).toBe(2);
    });

    it('stops counting at first non-improvement', () => {
      initShadowScoringLog(db);

      const cycles: CycleResult[] = [
        { cycleId: 'w1', evaluatedAt: 1000, queryCount: 5, meanNdcgDelta: 0.05, meanMrrDelta: 0, meanKendallTau: 0.7, totalImproved: 3, totalDegraded: 1, totalUnchanged: 1, isImprovement: true },
        { cycleId: 'w2', evaluatedAt: 2000, queryCount: 5, meanNdcgDelta: -0.01, meanMrrDelta: 0, meanKendallTau: 0.5, totalImproved: 2, totalDegraded: 3, totalUnchanged: 0, isImprovement: false },
        { cycleId: 'w3', evaluatedAt: 3000, queryCount: 5, meanNdcgDelta: 0.08, meanMrrDelta: 0, meanKendallTau: 0.9, totalImproved: 4, totalDegraded: 0, totalUnchanged: 1, isImprovement: true },
      ];

      for (const c of cycles) {
        recordCycleResult(db, c);
      }

      // Only w3 is consecutive from the end; w2 breaks the streak
      expect(getConsecutiveImprovements(db)).toBe(1);
    });

    it('returns full count when all cycles are improvements', () => {
      initShadowScoringLog(db);

      for (let i = 0; i < 5; i++) {
        recordCycleResult(db, {
          cycleId: `w${i}`,
          evaluatedAt: (i + 1) * 1000,
          queryCount: 5,
          meanNdcgDelta: 0.05,
          meanMrrDelta: 0,
          meanKendallTau: 0.8,
          totalImproved: 3,
          totalDegraded: 1,
          totalUnchanged: 1,
          isImprovement: true,
        });
      }

      expect(getConsecutiveImprovements(db)).toBe(5);
    });
  });

  describe('isPromotionReady', () => {
    it('returns false when fewer than 2 consecutive improvements', () => {
      initShadowScoringLog(db);

      recordCycleResult(db, {
        cycleId: 'w1',
        evaluatedAt: 1000,
        queryCount: 5,
        meanNdcgDelta: 0.05,
        meanMrrDelta: 0,
        meanKendallTau: 0.8,
        totalImproved: 3,
        totalDegraded: 1,
        totalUnchanged: 1,
        isImprovement: true,
      });

      expect(isPromotionReady(db)).toBe(false);
    });

    it('returns true when exactly 2 consecutive improvements', () => {
      initShadowScoringLog(db);

      for (let i = 0; i < 2; i++) {
        recordCycleResult(db, {
          cycleId: `w${i}`,
          evaluatedAt: (i + 1) * 1000,
          queryCount: 5,
          meanNdcgDelta: 0.05,
          meanMrrDelta: 0,
          meanKendallTau: 0.8,
          totalImproved: 3,
          totalDegraded: 1,
          totalUnchanged: 1,
          isImprovement: true,
        });
      }

      expect(isPromotionReady(db)).toBe(true);
    });

    it('returns true when more than 2 consecutive improvements', () => {
      initShadowScoringLog(db);

      for (let i = 0; i < 4; i++) {
        recordCycleResult(db, {
          cycleId: `w${i}`,
          evaluatedAt: (i + 1) * 1000,
          queryCount: 5,
          meanNdcgDelta: 0.05,
          meanMrrDelta: 0,
          meanKendallTau: 0.8,
          totalImproved: 3,
          totalDegraded: 1,
          totalUnchanged: 1,
          isImprovement: true,
        });
      }

      expect(isPromotionReady(db)).toBe(true);
    });

    it('returns false when no cycle results exist', () => {
      initShadowScoringLog(db);
      expect(isPromotionReady(db)).toBe(false);
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   11. PROMOTION GATE TESTS
   ──────────────────────────────────────────────────────────────── */

describe('evaluatePromotionGate', () => {
  let db: TestDatabase;
  let dbPath: string;
  const flag = envGuard('SPECKIT_SHADOW_FEEDBACK');

  beforeEach(() => {
    const setup = createTestDb();
    db = setup.db;
    dbPath = setup.dbPath;
    flag.set('true');
  });

  afterEach(() => {
    cleanupDb(db, dbPath);
    flag.restore();
  });

  it('recommends "promote" after 2 consecutive improvements', () => {
    initShadowScoringLog(db);

    for (let i = 0; i < 2; i++) {
      recordCycleResult(db, {
        cycleId: `w${i}`,
        evaluatedAt: (i + 1) * 1000,
        queryCount: 5,
        meanNdcgDelta: 0.05,
        meanMrrDelta: 0.02,
        meanKendallTau: 0.8,
        totalImproved: 3,
        totalDegraded: 1,
        totalUnchanged: 1,
        isImprovement: true,
      });
    }

    const gate = evaluatePromotionGate(db);
    expect(gate.ready).toBe(true);
    expect(gate.consecutiveWeeks).toBe(2);
    expect(gate.recommendation).toBe('promote');
  });

  it('recommends "wait" when only 1 improvement cycle', () => {
    initShadowScoringLog(db);

    recordCycleResult(db, {
      cycleId: 'w1',
      evaluatedAt: 1000,
      queryCount: 5,
      meanNdcgDelta: 0.05,
      meanMrrDelta: 0.02,
      meanKendallTau: 0.8,
      totalImproved: 3,
      totalDegraded: 1,
      totalUnchanged: 1,
      isImprovement: true,
    });

    const gate = evaluatePromotionGate(db);
    expect(gate.ready).toBe(false);
    expect(gate.consecutiveWeeks).toBe(1);
    expect(gate.recommendation).toBe('wait');
  });

  it('recommends "rollback" when most recent cycle is regression', () => {
    initShadowScoringLog(db);

    recordCycleResult(db, {
      cycleId: 'w1',
      evaluatedAt: 1000,
      queryCount: 5,
      meanNdcgDelta: 0.05,
      meanMrrDelta: 0,
      meanKendallTau: 0.8,
      totalImproved: 3,
      totalDegraded: 1,
      totalUnchanged: 1,
      isImprovement: true,
    });

    recordCycleResult(db, {
      cycleId: 'w2',
      evaluatedAt: 2000,
      queryCount: 5,
      meanNdcgDelta: -0.1,
      meanMrrDelta: -0.05,
      meanKendallTau: 0.3,
      totalImproved: 1,
      totalDegraded: 4,
      totalUnchanged: 0,
      isImprovement: false,
    });

    const gate = evaluatePromotionGate(db);
    expect(gate.ready).toBe(false);
    expect(gate.consecutiveWeeks).toBe(0);
    expect(gate.recommendation).toBe('rollback');
  });

  it('recommends "wait" when no cycles exist', () => {
    initShadowScoringLog(db);

    const gate = evaluatePromotionGate(db);
    expect(gate.ready).toBe(false);
    expect(gate.consecutiveWeeks).toBe(0);
    expect(gate.recommendation).toBe('wait');
  });

  it('requires exactly PROMOTION_THRESHOLD_WEEKS consecutive weeks', () => {
    expect(PROMOTION_THRESHOLD_WEEKS).toBe(2);
  });
});

/* ───────────────────────────────────────────────────────────────
   12. SHADOW EVALUATION PIPELINE TESTS
   ──────────────────────────────────────────────────────────────── */

describe('runShadowEvaluation', () => {
  let db: TestDatabase;
  let dbPath: string;
  const flag = envGuard('SPECKIT_SHADOW_FEEDBACK');

  beforeEach(() => {
    const setup = createTestDb();
    db = setup.db;
    dbPath = setup.dbPath;
    flag.set('true');
  });

  afterEach(() => {
    cleanupDb(db, dbPath);
    flag.restore();
  });

  it('returns null when feature flag is OFF', () => {
    flag.set('false');

    const result = runShadowEvaluation(
      db,
      ['q1', 'q2'],
      () => [],
      () => [],
    );

    expect(result).toBeNull();
  });

  it('runs end-to-end pipeline and returns comprehensive report', () => {
    const allQueries = ['q1', 'q2', 'q3', 'q4', 'q5'];

    const computeLive = (qid: string): RankedItem[] => {
      return [
        { resultId: `${qid}-r1`, rank: 1, relevanceScore: 3 },
        { resultId: `${qid}-r2`, rank: 2, relevanceScore: 2 },
        { resultId: `${qid}-r3`, rank: 3, relevanceScore: 1 },
      ];
    };

    const computeShadow = (qid: string): RankedItem[] => {
      // Shadow has slightly different ordering — r2 promoted to rank 1
      return [
        { resultId: `${qid}-r2`, rank: 1, relevanceScore: 3 },
        { resultId: `${qid}-r1`, rank: 2, relevanceScore: 2 },
        { resultId: `${qid}-r3`, rank: 3, relevanceScore: 1 },
      ];
    };

    const report = runShadowEvaluation(db, allQueries, computeLive, computeShadow, {
      holdoutPercent: 0.40,
      seed: 42,
      cycleId: 'test-cycle-1',
      evaluatedAt: 1000,
    });

    expect(report).not.toBeNull();
    expect(report!.cycleId).toBe('test-cycle-1');
    expect(report!.evaluatedAt).toBe(1000);
    expect(report!.holdoutQueryIds.length).toBe(2); // 40% of 5 = 2
    expect(report!.comparisons.length).toBe(2);
    expect(report!.cycleResult.queryCount).toBe(2);
    expect(report!.promotionGate).toBeDefined();
  });

  it('logs rank deltas to the database', () => {
    const allQueries = ['q1', 'q2', 'q3', 'q4', 'q5'];

    const computeLive = (): RankedItem[] => [
      { resultId: 'r1', rank: 1, relevanceScore: 1 },
    ];
    const computeShadow = (): RankedItem[] => [
      { resultId: 'r1', rank: 1, relevanceScore: 1 },
    ];

    runShadowEvaluation(db, allQueries, computeLive, computeShadow, {
      holdoutPercent: 0.40,
      seed: 42,
      cycleId: 'log-test',
      evaluatedAt: 2000,
    });

    const history = getShadowScoringHistory(db, { cycleId: 'log-test' });
    expect(history.length).toBeGreaterThan(0);
  });

  it('records cycle result to the database', () => {
    const allQueries = ['q1', 'q2', 'q3', 'q4', 'q5'];

    const computeLive = (): RankedItem[] => [
      { resultId: 'r1', rank: 1, relevanceScore: 1 },
    ];
    const computeShadow = (): RankedItem[] => [
      { resultId: 'r1', rank: 1, relevanceScore: 1 },
    ];

    runShadowEvaluation(db, allQueries, computeLive, computeShadow, {
      holdoutPercent: 0.40,
      seed: 42,
      cycleId: 'cycle-record-test',
      evaluatedAt: 3000,
    });

    const cycles = getCycleResults(db);
    expect(cycles.length).toBe(1);
    expect(cycles[0].cycleId).toBe('cycle-record-test');
  });

  it('handles empty query pool', () => {
    const report = runShadowEvaluation(
      db,
      [],
      () => [],
      () => [],
      { cycleId: 'empty-test', evaluatedAt: 1000 },
    );

    expect(report).not.toBeNull();
    expect(report!.holdoutQueryIds).toEqual([]);
    expect(report!.comparisons).toEqual([]);
    expect(report!.cycleResult.queryCount).toBe(0);
  });

  it('evaluates promotion gate across multiple pipeline runs', () => {
    const allQueries = ['q1', 'q2', 'q3', 'q4', 'q5'];

    // Shadow is strictly better: puts highest relevance at rank 1
    const computeLive = (): RankedItem[] => [
      { resultId: 'r1', rank: 1, relevanceScore: 1 },
      { resultId: 'r2', rank: 2, relevanceScore: 3 },
    ];
    const computeShadow = (): RankedItem[] => [
      { resultId: 'r2', rank: 1, relevanceScore: 3 },
      { resultId: 'r1', rank: 2, relevanceScore: 1 },
    ];

    // Run 2 consecutive cycles with positive NDCG delta
    const report1 = runShadowEvaluation(db, allQueries, computeLive, computeShadow, {
      holdoutPercent: 0.40,
      seed: 42,
      cycleId: 'cycle-1',
      evaluatedAt: 1000,
    });

    expect(report1!.promotionGate.ready).toBe(false);
    expect(report1!.promotionGate.consecutiveWeeks).toBe(1);

    const report2 = runShadowEvaluation(db, allQueries, computeLive, computeShadow, {
      holdoutPercent: 0.40,
      seed: 42,
      cycleId: 'cycle-2',
      evaluatedAt: 2000,
    });

    expect(report2!.promotionGate.ready).toBe(true);
    expect(report2!.promotionGate.consecutiveWeeks).toBe(2);
    expect(report2!.promotionGate.recommendation).toBe('promote');
  });

  it('has no side effects on live ranking', () => {
    const allQueries = ['q1', 'q2', 'q3'];

    let liveCallCount = 0;
    let shadowCallCount = 0;

    const computeLive = (): RankedItem[] => {
      liveCallCount++;
      return [{ resultId: 'r1', rank: 1, relevanceScore: 1 }];
    };
    const computeShadow = (): RankedItem[] => {
      shadowCallCount++;
      return [{ resultId: 'r1', rank: 1, relevanceScore: 1 }];
    };

    runShadowEvaluation(db, allQueries, computeLive, computeShadow, {
      holdoutPercent: 1.0, // all queries
      seed: 42,
      cycleId: 'side-effect-test',
    });

    // Callbacks were called for each holdout query
    expect(liveCallCount).toBe(3);
    expect(shadowCallCount).toBe(3);

    // No tables from live ranking system were modified
    // (there are no live ranking tables in this test DB — verifying no crash)
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table'"
    ).all() as Array<{ name: string }>;

    const tableNames = tables.map(t => t.name);
    expect(tableNames).toContain('shadow_scoring_log');
    expect(tableNames).toContain('shadow_cycle_results');
    // Should NOT contain any live ranking tables
    expect(tableNames).not.toContain('memory_index');
    expect(tableNames).not.toContain('memory_fts');
  });
});

/* ───────────────────────────────────────────────────────────────
   13. EDGE CASE TESTS
   ──────────────────────────────────────────────────────────────── */

describe('Edge Cases', () => {
  let db: TestDatabase;
  let dbPath: string;
  const flag = envGuard('SPECKIT_SHADOW_FEEDBACK');

  beforeEach(() => {
    const setup = createTestDb();
    db = setup.db;
    dbPath = setup.dbPath;
    flag.set('true');
  });

  afterEach(() => {
    cleanupDb(db, dbPath);
    flag.restore();
  });

  it('compareRanks handles disjoint live and shadow sets', () => {
    const live = makeRankedItems(['a', 'b', 'c']);
    const shadow = makeRankedItems(['d', 'e', 'f']);

    const result = compareRanks('q1', live, shadow);
    expect(result.deltas).toHaveLength(0);
    expect(result.metrics.kendallTau).toBe(0);
  });

  it('selectHoldoutQueries with single query returns it', () => {
    const holdout = selectHoldoutQueries(['only-one'], { holdoutPercent: 0.20 });
    expect(holdout).toEqual(['only-one']);
  });

  it('NDCG handles items without explicit relevance scores', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1 },
      { resultId: 'b', rank: 2 },
    ];
    // No relevance scores → treated as 0 → NDCG = 0
    expect(computeNDCG(items)).toBe(0);
  });

  it('MRR handles items without explicit relevance scores', () => {
    const items: RankedItem[] = [
      { resultId: 'a', rank: 1 },
      { resultId: 'b', rank: 2 },
    ];
    expect(computeMRR(items)).toBe(0);
  });

  it('getCycleResults returns empty on fresh db', () => {
    initShadowScoringLog(db);
    expect(getCycleResults(db)).toEqual([]);
  });

  it('multiple comparisons for same query logged independently', () => {
    initShadowScoringLog(db);

    const comp: RankComparisonResult = {
      queryId: 'q1',
      deltas: [{ resultId: 'r1', liveRank: 1, shadowRank: 1, delta: 0, direction: 'unchanged' }],
      metrics: { kendallTau: 1, ndcgDelta: 0, mrrDelta: 0, improvedCount: 0, degradedCount: 0, unchangedCount: 1 },
    };

    logRankDelta(db, comp, 'cycle-1', 1000);
    logRankDelta(db, comp, 'cycle-2', 2000);

    const allHistory = getShadowScoringHistory(db, { queryId: 'q1' });
    expect(allHistory).toHaveLength(2);
    expect(allHistory.map(h => h.cycle_id).sort()).toEqual(['cycle-1', 'cycle-2']);
  });

  it('promotion gate handles regression after improvements', () => {
    initShadowScoringLog(db);

    // 3 improvements, then 1 regression
    for (let i = 0; i < 3; i++) {
      recordCycleResult(db, {
        cycleId: `w${i}`,
        evaluatedAt: (i + 1) * 1000,
        queryCount: 5,
        meanNdcgDelta: 0.05,
        meanMrrDelta: 0.02,
        meanKendallTau: 0.8,
        totalImproved: 3,
        totalDegraded: 1,
        totalUnchanged: 1,
        isImprovement: true,
      });
    }

    // This regression resets the streak
    recordCycleResult(db, {
      cycleId: 'w3-regression',
      evaluatedAt: 4000,
      queryCount: 5,
      meanNdcgDelta: -0.02,
      meanMrrDelta: -0.01,
      meanKendallTau: 0.4,
      totalImproved: 1,
      totalDegraded: 3,
      totalUnchanged: 1,
      isImprovement: false,
    });

    const gate = evaluatePromotionGate(db);
    expect(gate.ready).toBe(false);
    expect(gate.consecutiveWeeks).toBe(0);
    expect(gate.recommendation).toBe('rollback');
  });

  it('compareRanks with large rank lists computes without error', () => {
    const n = 100;
    const ids = Array.from({ length: n }, (_, i) => `r${i}`);
    const live = makeRankedItems(ids);
    // Reverse the shadow order
    const shadow = makeRankedItems([...ids].reverse());

    const result = compareRanks('q-large', live, shadow);
    expect(result.deltas).toHaveLength(n);
    expect(result.metrics.kendallTau).toBe(-1);
  });
});
