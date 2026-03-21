// TEST: Intent-aware traversal policy (D3 Phase A)
import { describe, expect, it } from 'vitest';

import {
  DEFAULT_EDGE_PRIOR,
  computeIntentAwareTraversalScore,
  computeIntentEdgePrior,
  computeTraversalFreshnessFactor,
  computeTraversalHopDecay,
  getIntentEdgePriorities,
} from '../lib/search/causal-boost';

const NOW = new Date('2026-03-21T12:00:00.000Z');
const THIRTY_DAYS_MS = 30 * 86_400_000;

describe('D3 Phase A intent-aware edge traversal', () => {
  it('maps fix_bug to CORRECTION then DEPENDS_ON priority', () => {
    expect(getIntentEdgePriorities('fix_bug')).toEqual(['CORRECTION', 'DEPENDS_ON']);
    expect(computeIntentEdgePrior('fix_bug', 'CORRECTION')).toBeGreaterThan(
      computeIntentEdgePrior('fix_bug', 'DEPENDS_ON')
    );
  });

  it('maps add_feature to EXTENDS then DEPENDS_ON priority', () => {
    expect(getIntentEdgePriorities('add_feature')).toEqual(['EXTENDS', 'DEPENDS_ON']);
    expect(computeIntentEdgePrior('add_feature', 'EXTENDS')).toBeGreaterThan(
      computeIntentEdgePrior('add_feature', 'DEPENDS_ON')
    );
  });

  it('maps find_decision to PREFERENCE then CORRECTION priority', () => {
    expect(getIntentEdgePriorities('find_decision')).toEqual(['PREFERENCE', 'CORRECTION']);
    expect(computeIntentEdgePrior('find_decision', 'PREFERENCE')).toBeGreaterThan(
      computeIntentEdgePrior('find_decision', 'CORRECTION')
    );
  });

  it('computes traversal score as seedScore * edgePrior * hopDecay * freshness', () => {
    const updatedAt = new Date(NOW.getTime() - THIRTY_DAYS_MS);
    const seedScore = 0.8;
    const edgePrior = computeIntentEdgePrior('fix_bug', 'CORRECTION');
    const hopDecay = computeTraversalHopDecay(2);
    const freshness = computeTraversalFreshnessFactor(updatedAt, NOW);

    const score = computeIntentAwareTraversalScore({
      seedScore,
      intent: 'fix_bug',
      edgeType: 'CORRECTION',
      hopDistance: 2,
      updatedAt,
      now: NOW,
    });

    expect(score).toBeCloseTo(seedScore * edgePrior * hopDecay * freshness, 10);
  });

  it('uses inverse hop decay by distance', () => {
    expect(computeTraversalHopDecay(1)).toBe(1);
    expect(computeTraversalHopDecay(2)).toBe(0.5);
    expect(computeTraversalHopDecay(3)).toBeCloseTo(1 / 3, 10);
  });

  it('uses exponential freshness decay over age', () => {
    const thirtyDaysAgo = new Date(NOW.getTime() - THIRTY_DAYS_MS);

    expect(computeTraversalFreshnessFactor(NOW, NOW)).toBeCloseTo(1, 10);
    expect(computeTraversalFreshnessFactor(thirtyDaysAgo, NOW)).toBeCloseTo(Math.exp(-1), 10);
  });

  it('gives unknown intents default behavior', () => {
    const score = computeIntentAwareTraversalScore({
      seedScore: 0.5,
      intent: 'unknown_intent',
      edgeType: 'EXTENDS',
      hopDistance: 2,
      updatedAt: NOW,
      now: NOW,
    });

    expect(getIntentEdgePriorities('unknown_intent')).toEqual([]);
    expect(computeIntentEdgePrior('unknown_intent', 'EXTENDS')).toBe(DEFAULT_EDGE_PRIOR);
    expect(score).toBeCloseTo(0.25, 10);
  });
});
