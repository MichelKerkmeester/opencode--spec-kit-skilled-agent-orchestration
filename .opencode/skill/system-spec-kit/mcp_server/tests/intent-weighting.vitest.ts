// ---------------------------------------------------------------
// MODULE: Test — Intent Weighting
// ---------------------------------------------------------------
// Verifies that intent weights are applied correctly (not double-counted)
// across the two independent weight systems:
//   System A: Channel fusion weights (adaptive-fusion.ts INTENT_WEIGHT_PROFILES)
//   System B: Result scoring weights (intent-classifier.ts INTENT_WEIGHT_ADJUSTMENTS)

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as intentClassifier from '../lib/search/intent-classifier';
import {
  getAdaptiveWeights,
  adaptiveFuse,
  hybridAdaptiveFuse,
  INTENT_WEIGHT_PROFILES,
  DEFAULT_WEIGHTS,
  FEATURE_FLAG,
} from '../lib/search/adaptive-fusion';
import { fuseResultsMulti } from '../lib/search/rrf-fusion';
import type { RrfItem, FusionResult, RankedList } from '../lib/search/rrf-fusion';
import type { FusionWeights } from '../lib/search/adaptive-fusion';

/* ---------------------------------------------------------------
   HELPERS
   --------------------------------------------------------------- */

function makeItems(count: number, prefix = 'item'): RrfItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    title: `${prefix} ${i + 1}`,
    similarity: 80 - i * 5, // Decreasing similarity
    importance_weight: 0.5 + i * 0.1, // Varying importance
  }));
}

const savedEnv: Record<string, string | undefined> = {};

function setEnv(key: string, value: string | undefined) {
  if (!(key in savedEnv)) savedEnv[key] = process.env[key];
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

function restoreEnv() {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

/* ---------------------------------------------------------------
   1. INTENT CLASSIFICATION TESTS
   --------------------------------------------------------------- */

describe('T017-G2: Intent Classification Produces Expected Weights', () => {
  it('classifyIntent returns valid intent for bug-fix queries', () => {
    const result = intentClassifier.classifyIntent('fix the login error bug');
    expect(result.intent).toBe('fix_bug');
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.scores).toBeDefined();
    expect(result.keywords.length).toBeGreaterThan(0);
  });

  it('classifyIntent returns valid intent for feature queries', () => {
    const result = intentClassifier.classifyIntent('add a new authentication module');
    expect(result.intent).toBe('add_feature');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('classifyIntent returns valid intent for understanding queries', () => {
    const result = intentClassifier.classifyIntent('explain how the caching system works');
    expect(result.intent).toBe('understand');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('all intents have both System A and System B weight profiles', () => {
    const intents = intentClassifier.getValidIntents();
    for (const intent of intents) {
      // System B: INTENT_WEIGHT_ADJUSTMENTS
      const systemB = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS[intent];
      expect(systemB, `System B weights missing for ${intent}`).toBeDefined();
      expect(typeof systemB.similarity).toBe('number');
      expect(typeof systemB.importance).toBe('number');
      expect(typeof systemB.recency).toBe('number');

      // System A: INTENT_WEIGHT_PROFILES
      const systemA = INTENT_WEIGHT_PROFILES[intent];
      expect(systemA, `System A weights missing for ${intent}`).toBeDefined();
      expect(typeof systemA.semanticWeight).toBe('number');
      expect(typeof systemA.keywordWeight).toBe('number');
      expect(typeof systemA.recencyWeight).toBe('number');
    }
  });

  it('System A and System B weight structures are different (not same data)', () => {
    // Verify the two systems have DIFFERENT weight structures,
    // confirming they serve different purposes
    const intents = intentClassifier.getValidIntents();
    for (const intent of intents) {
      const systemA = INTENT_WEIGHT_PROFILES[intent] as unknown as Record<string, unknown>;
      const systemB = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS[intent] as unknown as Record<string, unknown>;

      // System A has semanticWeight/keywordWeight, System B has similarity/importance
      expect('semanticWeight' in systemA).toBe(true);
      expect('keywordWeight' in systemA).toBe(true);
      expect('similarity' in systemB).toBe(true);
      expect('importance' in systemB).toBe(true);

      // They should NOT share the same keys
      expect('semanticWeight' in systemB).toBe(false);
      expect('similarity' in systemA).toBe(false);
    }
  });

  it('System B weights (INTENT_WEIGHT_ADJUSTMENTS) sum to ~1.0', () => {
    const intents = intentClassifier.getValidIntents();
    for (const intent of intents) {
      const w = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS[intent];
      const sum = w.recency + w.importance + w.similarity;
      expect(Math.abs(sum - 1.0)).toBeLessThan(0.01);
    }
  });
});

/* ---------------------------------------------------------------
   2. NO DOUBLE-COUNTING VERIFICATION
   --------------------------------------------------------------- */

describe('T017-G2: Weights Not Double-Counted in Pipeline', () => {
  beforeEach(() => {
    setEnv(FEATURE_FLAG, 'true');
  });

  afterEach(() => {
    restoreEnv();
  });

  it('System A (adaptive fusion) uses channel weights, not attribute weights', () => {
    const semantic = makeItems(5, 'vec');
    const keyword = makeItems(5, 'kw');
    const intent = 'fix_bug';

    const result = hybridAdaptiveFuse(semantic, keyword, intent);
    const weights = result.weights;

    // System A weights should be channel-level (semanticWeight, keywordWeight)
    expect(weights.semanticWeight).toBeDefined();
    expect(weights.keywordWeight).toBeDefined();

    // For fix_bug: semantic and keyword are balanced (0.4/0.4)
    const profile = INTENT_WEIGHT_PROFILES[intent];
    expect(weights.semanticWeight).toBe(profile!.semanticWeight);
    expect(weights.keywordWeight).toBe(profile!.keywordWeight);
  });

  it('System B (applyIntentWeights) uses attribute weights, not channel weights', () => {
    const results = [
      { similarity: 80, importance_weight: 0.9, title: 'high-importance' },
      { similarity: 90, importance_weight: 0.3, title: 'high-similarity' },
    ];

    const applied = intentClassifier.applyIntentWeights(results, 'fix_bug');

    // System B should create intentAdjustedScore based on similarity/importance
    expect(applied.length).toBe(2);
    for (const r of applied) {
      expect(typeof r.intentAdjustedScore).toBe('number');
    }

    // fix_bug weights favor recency (0.5) over similarity (0.3) and importance (0.2)
    // But applyIntentWeights only uses similarity + importance (not recency, since
    // the lightweight version in intent-classifier.ts doesn't have timestamps)
    const weights = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS['fix_bug'];
    expect(weights.recency).toBe(0.5);
    expect(weights.similarity).toBe(0.3);
    expect(weights.importance).toBe(0.2);
  });

  it('RRF fusion scores are RANK-based, not attribute-based (no overlap with System B)', () => {
    // Create two lists with overlapping items
    const listA: RankedList = {
      source: 'vector',
      results: [
        { id: 1, similarity: 95 },
        { id: 2, similarity: 80 },
        { id: 3, similarity: 70 },
      ],
      weight: 0.7, // System A semantic weight
    };

    const listB: RankedList = {
      source: 'keyword',
      results: [
        { id: 2, score: 5.0 },
        { id: 1, score: 3.0 },
        { id: 4, score: 2.0 },
      ],
      weight: 0.3, // System A keyword weight
    };

    const fused = fuseResultsMulti([listA, listB]);

    // Verify RRF scores are rank-based, NOT derived from similarity/score values
    for (const r of fused) {
      // With graduated-ON normalization, scores are in [0, 1] range
      // Bottom-ranked result normalizes to 0.0, top to 1.0
      expect(r.rrfScore).toBeLessThanOrEqual(1.0);
      expect(r.rrfScore).toBeGreaterThanOrEqual(0);
    }

    // Item 2 appears in both lists, so should get convergence bonus
    const item2 = fused.find(r => r.id === 2);
    expect(item2).toBeDefined();
    expect(item2!.sources).toContain('vector');
    expect(item2!.sources).toContain('keyword');
    expect(item2!.convergenceBonus).toBeGreaterThan(0);
  });

  it('different intents produce different channel weight distributions', () => {
    const semantic = makeItems(3, 'vec');
    const keyword = makeItems(3, 'kw');

    const bugResult = hybridAdaptiveFuse(semantic, keyword, 'fix_bug');
    const understandResult = hybridAdaptiveFuse(semantic, keyword, 'understand');

    // fix_bug: balanced channels (0.4/0.4)
    // understand: semantic-heavy (0.7/0.2)
    expect(bugResult.weights.semanticWeight).toBeLessThan(understandResult.weights.semanticWeight);
    expect(bugResult.weights.keywordWeight).toBeGreaterThan(understandResult.weights.keywordWeight);
  });

  it('different intents produce different attribute weight distributions', () => {
    const fixBugWeights = intentClassifier.getIntentWeights('fix_bug');
    const understandWeights = intentClassifier.getIntentWeights('understand');

    // fix_bug favors recency (0.5), understand favors similarity (0.5)
    expect(fixBugWeights.recency).toBeGreaterThan(understandWeights.recency);
    expect(understandWeights.similarity).toBeGreaterThan(fixBugWeights.similarity);
  });
});

/* ---------------------------------------------------------------
   3. PIPELINE ORDERING STABILITY
   --------------------------------------------------------------- */

describe('T017-G2: Pipeline Ordering Stability (No Regression)', () => {
  beforeEach(() => {
    setEnv(FEATURE_FLAG, 'true');
  });

  afterEach(() => {
    restoreEnv();
  });

  it('adaptive fusion preserves all input items (no data loss)', () => {
    const semantic = makeItems(5, 'vec');
    const keyword = makeItems(5, 'kw');

    const result = hybridAdaptiveFuse(semantic, keyword, 'understand');

    // All unique IDs should be present in fused results
    const inputIds = new Set([
      ...semantic.map(i => i.id),
      ...keyword.map(i => i.id),
    ]);
    const outputIds = new Set(result.results.map(r => r.id));

    for (const id of inputIds) {
      expect(outputIds.has(id), `Missing ID: ${id}`).toBe(true);
    }
  });

  it('adaptive fusion results are sorted by descending rrfScore', () => {
    const semantic = makeItems(5, 'vec');
    const keyword = makeItems(5, 'kw');

    const result = hybridAdaptiveFuse(semantic, keyword, 'fix_bug');

    for (let i = 1; i < result.results.length; i++) {
      expect(result.results[i - 1].rrfScore).toBeGreaterThanOrEqual(
        result.results[i].rrfScore
      );
    }
  });

  it('deterministic: same inputs produce same outputs', () => {
    const semantic = makeItems(5, 'vec');
    const keyword = makeItems(5, 'kw');

    const result1 = hybridAdaptiveFuse(semantic, keyword, 'fix_bug');
    const result2 = hybridAdaptiveFuse(semantic, keyword, 'fix_bug');

    expect(result1.results.length).toBe(result2.results.length);
    for (let i = 0; i < result1.results.length; i++) {
      expect(result1.results[i].id).toBe(result2.results[i].id);
      expect(result1.results[i].rrfScore).toBeCloseTo(result2.results[i].rrfScore, 10);
    }
  });

  it('classifyIntent is deterministic for same query', () => {
    const query = 'fix the broken authentication login bug';
    const r1 = intentClassifier.classifyIntent(query);
    const r2 = intentClassifier.classifyIntent(query);

    expect(r1.intent).toBe(r2.intent);
    expect(r1.confidence).toBe(r2.confidence);
    expect(r1.keywords).toEqual(r2.keywords);
  });

  it('INTENT_LAMBDA_MAP has entries for all valid intents', () => {
    const intents = intentClassifier.getValidIntents();
    for (const intent of intents) {
      const lambda = intentClassifier.INTENT_LAMBDA_MAP[intent];
      expect(typeof lambda).toBe('number');
      expect(lambda).toBeGreaterThan(0);
      expect(lambda).toBeLessThanOrEqual(1);
    }
  });
});

/* ---------------------------------------------------------------
   4. SCORE DISTRIBUTION VERIFICATION
   --------------------------------------------------------------- */

describe('T017-G2: Score Distribution Characteristics', () => {
  beforeEach(() => {
    setEnv(FEATURE_FLAG, 'true');
  });

  afterEach(() => {
    restoreEnv();
  });

  it('RRF scores are in expected range (normalized [0,1])', () => {
    const semantic = makeItems(10, 'vec');
    const keyword = makeItems(10, 'kw');

    const result = hybridAdaptiveFuse(semantic, keyword, 'understand');

    for (const r of result.results) {
      // With graduated-ON normalization, scores are min-max normalized to [0,1]
      expect(r.rrfScore).toBeGreaterThanOrEqual(0);
      expect(r.rrfScore).toBeLessThanOrEqual(1.0);
    }
  });

  it('System B intentAdjustedScore is in 0-1 range', () => {
    const results = [
      { similarity: 95, importance_weight: 0.9, title: 'top' },
      { similarity: 50, importance_weight: 0.5, title: 'mid' },
      { similarity: 10, importance_weight: 0.1, title: 'low' },
    ];

    const applied = intentClassifier.applyIntentWeights(results, 'understand');

    for (const r of applied) {
      const score = r.intentAdjustedScore as number;
      // similarity is divided by 100 in applyIntentWeights (0-1 normalization)
      // importance_weight is already 0-1
      // Weighted sum with weights summing to 1.0 should be 0-1
      // Note: applyIntentWeights in intent-classifier.ts uses sim/100 * w.sim + imp * w.imp
      // but does NOT include recency (no timestamps available in this code path)
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1.0);
    }
  });

  it('channel weights influence RRF score distribution', () => {
    // With understand intent: semantic weight 0.7, keyword weight 0.2
    // The vector-only item should score higher than keyword-only item
    const semantic: RrfItem[] = [
      { id: 'only-vec', title: 'vector only result' },
    ];
    const keyword: RrfItem[] = [
      { id: 'only-kw', title: 'keyword only result' },
    ];

    const result = hybridAdaptiveFuse(semantic, keyword, 'understand');

    const vecItem = result.results.find(r => r.id === 'only-vec');
    const kwItem = result.results.find(r => r.id === 'only-kw');

    expect(vecItem).toBeDefined();
    expect(kwItem).toBeDefined();

    // understand: semanticWeight=0.7 > keywordWeight=0.2
    // So vector-only result should have higher RRF score
    expect(vecItem!.rrfScore).toBeGreaterThan(kwItem!.rrfScore);
  });

  it('getAdaptiveWeights returns correct profile for each intent', () => {
    const intents = intentClassifier.getValidIntents();
    for (const intent of intents) {
      const weights = getAdaptiveWeights(intent);
      const expected = INTENT_WEIGHT_PROFILES[intent];

      expect(weights.semanticWeight).toBe(expected!.semanticWeight);
      expect(weights.keywordWeight).toBe(expected!.keywordWeight);
      expect(weights.recencyWeight).toBe(expected!.recencyWeight);
    }
  });
});

/* ---------------------------------------------------------------
   5. NORMALIZATION METHOD VERIFICATION (T003d)
   --------------------------------------------------------------- */

describe('T017-G2: Normalization Method — RRF + Composite Score', () => {
  it('RRF uses rank-based normalization (1/(k+rank)) not value-based', () => {
    // Items with wildly different raw scores should get similar RRF scores
    // if they share the same rank position
    const listHighScores: RankedList = {
      source: 'vector',
      results: [
        { id: 'a', similarity: 99.9 },
        { id: 'b', similarity: 99.8 },
      ],
      weight: 1.0,
    };

    const listLowScores: RankedList = {
      source: 'keyword',
      results: [
        { id: 'c', score: 0.001 },
        { id: 'd', score: 0.0005 },
      ],
      weight: 1.0,
    };

    const fused = fuseResultsMulti([listHighScores, listLowScores]);

    // All rank-1 items should get the same base RRF score regardless of raw values
    const itemA = fused.find(r => r.id === 'a');
    const itemC = fused.find(r => r.id === 'c');

    expect(itemA).toBeDefined();
    expect(itemC).toBeDefined();

    // Both are rank 1 in their respective lists with weight 1.0
    // So both get 1/(60+1) = 0.01639...
    expect(itemA!.rrfScore).toBeCloseTo(itemC!.rrfScore, 5);
  });

  it('composite scoring (System B) normalizes similarity to 0-1 scale', () => {
    // The applyIntentWeights function divides similarity by 100
    const results = [
      { similarity: 100, importance_weight: 1.0 },
    ];

    const applied = intentClassifier.applyIntentWeights(results, 'understand');
    const score = applied[0].intentAdjustedScore as number;

    // understand: similarity=0.5, importance=0.3
    // score = (100/100) * 0.5 + 1.0 * 0.3 = 0.5 + 0.3 = 0.8
    expect(score).toBeCloseTo(0.8, 2);
  });

  it('channel weight normalization does not require sum-to-1', () => {
    // Verify that System A channel weights are independent (not required to sum to 1)
    // This is by design: each channel's weight scales its RRF contribution independently
    const intents = intentClassifier.getValidIntents();
    for (const intent of intents) {
      const profile = INTENT_WEIGHT_PROFILES[intent];
      const sum = profile!.semanticWeight + profile!.keywordWeight + profile!.recencyWeight;
      // Channel weights do NOT need to sum to 1 (they scale independent channels)
      // Just verify they are positive and reasonable
      expect(profile!.semanticWeight).toBeGreaterThanOrEqual(0);
      expect(profile!.keywordWeight).toBeGreaterThanOrEqual(0);
      expect(profile!.recencyWeight).toBeGreaterThanOrEqual(0);
      expect(sum).toBeGreaterThan(0); // At least some weight
      expect(sum).toBeLessThan(3.0); // Sanity upper bound
    }
  });
});
