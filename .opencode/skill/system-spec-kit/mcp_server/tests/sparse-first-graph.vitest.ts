// TEST: Sparse-first graph policy (D3 Phase A)
import { afterEach, describe, expect, it } from 'vitest';

import {
  DEFAULT_TYPED_TRAVERSAL_DEPTH,
  MAX_HOPS,
  resolveSparseFirstTraversalPolicy,
  resolveTraversalDepth,
} from '../lib/search/causal-boost';
import { isTypedTraversalEnabled } from '../lib/search/graph-flags';

const ORIGINAL_TYPED_TRAVERSAL = process.env.SPECKIT_TYPED_TRAVERSAL;
const ORIGINAL_COMMUNITY_DETECTION = process.env.SPECKIT_COMMUNITY_DETECTION;

function restoreEnv() {
  if (ORIGINAL_TYPED_TRAVERSAL === undefined) {
    delete process.env.SPECKIT_TYPED_TRAVERSAL;
  } else {
    process.env.SPECKIT_TYPED_TRAVERSAL = ORIGINAL_TYPED_TRAVERSAL;
  }

  if (ORIGINAL_COMMUNITY_DETECTION === undefined) {
    delete process.env.SPECKIT_COMMUNITY_DETECTION;
  } else {
    process.env.SPECKIT_COMMUNITY_DETECTION = ORIGINAL_COMMUNITY_DETECTION;
  }
}

describe('D3 Phase A sparse-first graph policy', () => {
  afterEach(() => {
    restoreEnv();
  });

  it('disables community detection when graph density is below 0.5', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'true';
    process.env.SPECKIT_COMMUNITY_DETECTION = 'true';

    const policy = resolveSparseFirstTraversalPolicy(0.49);

    expect(policy.typedTraversalEnabled).toBe(true);
    expect(policy.allowCommunityDetection).toBe(false);
    expect(policy.traversalDepth).toBe(DEFAULT_TYPED_TRAVERSAL_DEPTH);
  });

  it('enables community detection when graph density is above 0.5', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'true';
    process.env.SPECKIT_COMMUNITY_DETECTION = 'true';

    const policy = resolveSparseFirstTraversalPolicy(0.75);

    expect(policy.allowCommunityDetection).toBe(true);
    expect(policy.preserveLegacyBehavior).toBe(false);
  });

  it('defaults to 1-hop typed expansion when typed traversal is enabled', () => {
    delete process.env.SPECKIT_TYPED_TRAVERSAL;
    process.env.SPECKIT_COMMUNITY_DETECTION = 'true';

    expect(isTypedTraversalEnabled()).toBe(true);
    expect(resolveTraversalDepth()).toBe(DEFAULT_TYPED_TRAVERSAL_DEPTH);
    expect(resolveSparseFirstTraversalPolicy(0.9).traversalDepth).toBe(DEFAULT_TYPED_TRAVERSAL_DEPTH);
  });

  it('gates traversal depth to the supported range', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'true';

    expect(resolveTraversalDepth(0)).toBe(1);
    expect(resolveTraversalDepth(MAX_HOPS + 5)).toBe(MAX_HOPS);
  });

  it('preserves existing behavior when SPECKIT_TYPED_TRAVERSAL is off', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'false';
    process.env.SPECKIT_COMMUNITY_DETECTION = 'true';

    const policy = resolveSparseFirstTraversalPolicy(0.1, 99);

    expect(isTypedTraversalEnabled()).toBe(false);
    expect(policy.preserveLegacyBehavior).toBe(true);
    expect(policy.allowCommunityDetection).toBe(true);
    expect(policy.traversalDepth).toBe(MAX_HOPS);
  });
});
