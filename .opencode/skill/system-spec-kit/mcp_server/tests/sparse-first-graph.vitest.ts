import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_TYPED_TRAVERSAL_DEPTH,
  MAX_HOPS,
  resolveSparseFirstTraversalPolicy,
  resolveTraversalDepth,
} from '../lib/search/causal-boost';
import { isTypedTraversalEnabled } from '../lib/search/graph-flags';

describe('D3 Phase A sparse-first graph policy', () => {
  const previousTypedTraversal = process.env.SPECKIT_TYPED_TRAVERSAL;

  beforeEach(() => {
    delete process.env.SPECKIT_TYPED_TRAVERSAL;
  });

  afterEach(() => {
    if (previousTypedTraversal === undefined) {
      delete process.env.SPECKIT_TYPED_TRAVERSAL;
    } else {
      process.env.SPECKIT_TYPED_TRAVERSAL = previousTypedTraversal;
    }
  });

  it('disables community detection when graph density is below 0.5', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'true';

    expect(resolveSparseFirstTraversalPolicy(0.49)).toEqual({
      sparseModeActive: true,
      communityDetectionEnabled: false,
    });
  });

  it('enables community detection when graph density is above 0.5', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'true';

    expect(resolveSparseFirstTraversalPolicy(0.75)).toEqual({
      sparseModeActive: false,
      communityDetectionEnabled: true,
    });
  });

  it('defaults to 1-hop typed expansion when typed traversal is enabled', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'true';

    expect(isTypedTraversalEnabled()).toBe(true);
    expect(DEFAULT_TYPED_TRAVERSAL_DEPTH).toBe(1);
    expect(resolveTraversalDepth()).toBe(DEFAULT_TYPED_TRAVERSAL_DEPTH);
  });

  it('gates traversal depth to the supported range', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'true';

    expect(resolveTraversalDepth(0)).toBe(DEFAULT_TYPED_TRAVERSAL_DEPTH);
    expect(resolveTraversalDepth(99)).toBe(MAX_HOPS);
  });

  it('preserves existing behavior when SPECKIT_TYPED_TRAVERSAL is off', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'false';

    expect(isTypedTraversalEnabled()).toBe(false);
    expect(resolveSparseFirstTraversalPolicy(0.1)).toEqual({
      sparseModeActive: false,
      communityDetectionEnabled: true,
    });
    expect(resolveTraversalDepth()).toBe(MAX_HOPS);
  });
});
