// TEST: SCORING
/**
 * scoring.vitest.ts — Decay & Recency Scoring Tests (T505)
 *
 * Tests the decay/recency/boost behavior of composite-scoring.ts.
 * Focuses on temporal decay curves, recency scoring, constitutional
 * exemptions, edge cases, and batch ordering — complementing the
 * broader API coverage in composite-scoring.vitest.ts.
 *
 * Original intent: 19 tests for legacy scoring.js (calculateDecayBoost,
 * adjustScoreWithDecay, batchAdjustScores, DECAY_CONFIG). Rewritten
 * to target the actual composite-scoring.ts exports.
 */
import { describe, it, expect } from 'vitest';

import {
  calculateRecencyScore,
  calculateRetrievabilityScore,
  calculateTemporalScore,
  calculateUsageScore,
  calculateImportanceScore,
  calculateCitationScore,
  calculateCompositeScore,
  calculateFiveFactorScore,
  applyCompositeScoring,
  applyFiveFactorScoring,
  RECENCY_SCALE_DAYS,
  FSRS_FACTOR,
  FSRS_DECAY,
  DEFAULT_WEIGHTS,
  FIVE_FACTOR_WEIGHTS,
  IMPORTANCE_MULTIPLIERS,
  CITATION_DECAY_RATE,
  CITATION_MAX_DAYS,
} from '../lib/scoring/composite-scoring';

// Helpers
/** Create an ISO timestamp N days in the past */
function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

/** Create an ISO timestamp N days in the future */
function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString();
}

// T505-01: Recency Scoring
describe('T505-01: Recency Scoring (calculateRecencyScore)', () => {
  it('should produce higher score for newer timestamps', () => {
    const recent = calculateRecencyScore(daysAgo(1));
    const older = calculateRecencyScore(daysAgo(30));

    expect(recent).toBeGreaterThan(older);
  });

  it('should return 1.0 for constitutional tier regardless of age', () => {
    const score = calculateRecencyScore(daysAgo(365), 'constitutional');
    expect(score).toBe(1.0);
  });

  it('should return 0.5 for invalid/missing timestamp', () => {
    const invalid = calculateRecencyScore('not-a-date');
    expect(invalid).toBe(0.5);

    const empty = calculateRecencyScore(undefined);
    expect(empty).toBe(0.5);
  });
});

// T505-02: Retrievability / Adjusted Score with Decay
describe('T505-02: Retrievability Decay (calculateRetrievabilityScore)', () => {
  it('should produce higher score for more recent memories', () => {
    const recentRow = { stability: 5.0, lastReview: daysAgo(1) };
    const olderRow = { stability: 5.0, lastReview: daysAgo(30) };

    const recentScore = calculateRetrievabilityScore(recentRow);
    const olderScore = calculateRetrievabilityScore(olderRow);

    expect(recentScore).toBeGreaterThan(olderScore);
  });

  it('should give constitutional memory full composite score boost', () => {
    // Constitutional tier gets high importance multiplier and recency exemption
    const constitutionalRow = {
      similarity: 80,
      importance_weight: 1.0,
      importance_tier: 'constitutional',
      updated_at: daysAgo(60), // old timestamp
      access_count: 5,
      stability: 5.0,
      lastReview: daysAgo(60),
    };

    const normalRow = {
      similarity: 80,
      importance_weight: 1.0,
      importance_tier: 'normal',
      updated_at: daysAgo(60),
      access_count: 5,
      stability: 5.0,
      lastReview: daysAgo(60),
    };

    const constitutionalScore = calculateCompositeScore(constitutionalRow);
    const normalScore = calculateCompositeScore(normalRow);

    // Constitutional should score higher due to tier boost and recency exemption
    expect(constitutionalScore).toBeGreaterThan(normalScore);
  });
});

// T505-03: Score Normalization
describe('T505-03: Score Normalization', () => {
  it('should normalize composite scores to 0-1 range', () => {
    const zeroSim = calculateCompositeScore({ similarity: 0 });
    const midSim = calculateCompositeScore({ similarity: 50 });
    const fullSim = calculateCompositeScore({ similarity: 100 });

    for (const s of [zeroSim, midSim, fullSim]) {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(1);
    }
  });

  it('should preserve ordering: higher similarity = higher composite score (all else equal)', () => {
    const now = new Date().toISOString();
    const base = {
      importance_weight: 0.5,
      importance_tier: 'normal',
      updated_at: now,
      access_count: 5,
      stability: 5.0,
      lastReview: now,
    };

    const low = calculateCompositeScore({ ...base, similarity: 30 });
    const mid = calculateCompositeScore({ ...base, similarity: 60 });
    const high = calculateCompositeScore({ ...base, similarity: 90 });

    expect(high).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(low);
  });
});

// T505-04: Zero/Null Values
describe('T505-04: Zero/Null Values', () => {
  it('should handle zero similarity without error', () => {
    const score = calculateCompositeScore({ similarity: 0 });
    expect(typeof score).toBe('number');
    expect(score).not.toBeNaN();
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('should return neutral 0.5 for invalid timestamp in retrievability', () => {
    const score = calculateRetrievabilityScore({ lastReview: 'not-a-date' });
    expect(score).toBe(0.5);
  });
});

// T505-05: Negative Values
describe('T505-05: Negative Values', () => {
  it('should clamp composite score to >= 0 for negative similarity', () => {
    const score = calculateCompositeScore({ similarity: -50 });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});

// T505-06: Extreme Values
describe('T505-06: Extreme Values', () => {
  it('should cap composite score at 1.0 for very large similarity', () => {
    const score = calculateCompositeScore({ similarity: 1e10 });
    expect(score).toBeLessThanOrEqual(1);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('should handle very old timestamp (1970) without error', () => {
    const score = calculateCompositeScore({
      similarity: 50,
      updated_at: '1970-01-01T00:00:00.000Z',
      lastReview: '1970-01-01T00:00:00.000Z',
    });
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it('should handle future timestamp gracefully', () => {
    const score = calculateCompositeScore({
      similarity: 50,
      updated_at: daysFromNow(365),
      lastReview: daysFromNow(365),
    });
    expect(score).toBeLessThanOrEqual(1);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

// T505-07: Batch Score Combination
describe('T505-07: Batch Scoring (applyCompositeScoring)', () => {
  it('should batch-score and sort multiple memories by composite score descending', () => {
    const now = new Date().toISOString();
    const memories = [
      { id: 1, similarity: 20, updated_at: daysAgo(30), lastReview: daysAgo(30), stability: 1.0 },
      { id: 2, similarity: 90, updated_at: now, lastReview: now, stability: 10.0 },
      { id: 3, similarity: 60, updated_at: daysAgo(5), lastReview: daysAgo(5), stability: 5.0 },
    ];

    const ranked = applyCompositeScoring(memories);

    expect(ranked.length).toBe(3);
    expect(ranked[0].id).toBe(2);
    expect(ranked[2].id).toBe(1);
    // Verify sorted descending
    expect(ranked[0].composite_score).toBeGreaterThanOrEqual(ranked[1].composite_score);
    expect(ranked[1].composite_score).toBeGreaterThanOrEqual(ranked[2].composite_score);
  });

  it('should give constitutional memory priority in batch', () => {
    const memories = [
      {
        id: 1,
        similarity: 80,
        importance_tier: 'normal',
        importance_weight: 0.5,
        updated_at: daysAgo(0),
        lastReview: daysAgo(0),
        stability: 10.0,
        access_count: 20,
      },
      {
        id: 2,
        similarity: 80,
        importance_tier: 'constitutional',
        importance_weight: 1.0,
        updated_at: daysAgo(30),
        lastReview: daysAgo(30),
        stability: 10.0,
        access_count: 20,
      },
    ];

    const ranked = applyCompositeScoring(memories);
    // Constitutional should rank higher despite being older, due to tier boost and recency exemption
    expect(ranked[0].id).toBe(2);
  });
});

// T505-08: Configuration & Constants
describe('T505-08: Decay Configuration & Constants', () => {
  it('should have RECENCY_SCALE_DAYS defined as a positive number', () => {
    expect(typeof RECENCY_SCALE_DAYS).toBe('number');
    expect(RECENCY_SCALE_DAYS).toBeGreaterThan(0);
  });

  it('should have FSRS_FACTOR configured (19/81)', () => {
    expect(typeof FSRS_FACTOR).toBe('number');
    expect(FSRS_FACTOR).toBeCloseTo(19 / 81, 4);
  });

  it('should have FSRS_DECAY configured (-0.5)', () => {
    expect(typeof FSRS_DECAY).toBe('number');
    expect(FSRS_DECAY).toBeCloseTo(-0.5, 4);
  });

  it('should have IMPORTANCE_MULTIPLIERS for all six tiers', () => {
    const expectedTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
    for (const tier of expectedTiers) {
      expect(IMPORTANCE_MULTIPLIERS[tier]).toBeDefined();
      expect(typeof IMPORTANCE_MULTIPLIERS[tier]).toBe('number');
    }
  });

  it('should have CITATION_DECAY_RATE and CITATION_MAX_DAYS configured', () => {
    expect(typeof CITATION_DECAY_RATE).toBe('number');
    expect(CITATION_DECAY_RATE).toBeGreaterThan(0);
    expect(typeof CITATION_MAX_DAYS).toBe('number');
    expect(CITATION_MAX_DAYS).toBeGreaterThan(0);
  });

  it('should have legacy DEFAULT_WEIGHTS summing to 1.0', () => {
    const sum = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 4);
  });
});
