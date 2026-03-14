// TEST: Intent-routing regression coverage
import { describe, expect, it } from 'vitest';
import {
  DEGREE_BOOST_CAP,
  EDGE_TYPE_WEIGHTS,
  normalizeDegreeToBoostedScore,
} from '../lib/search/graph-search-fn';
import * as graphSearchFn from '../lib/search/graph-search-fn';

describe('intent-routing regression coverage', () => {
  it('keeps removed getSubgraphWeights helper absent from public exports', () => {
    expect('getSubgraphWeights' in graphSearchFn).toBe(false);
  });

  it('uses fixed causal edge weight baseline (caused=1.0)', () => {
    expect(EDGE_TYPE_WEIGHTS.caused).toBe(1.0);
    expect(EDGE_TYPE_WEIGHTS.enabled).toBeGreaterThan(0);
    expect(EDGE_TYPE_WEIGHTS.supports).toBeGreaterThan(0);
  });

  it('caps typed-degree boost at configured ceiling', () => {
    const boosted = normalizeDegreeToBoostedScore(10_000, 100);
    expect(boosted).toBeLessThanOrEqual(DEGREE_BOOST_CAP);
  });
});
