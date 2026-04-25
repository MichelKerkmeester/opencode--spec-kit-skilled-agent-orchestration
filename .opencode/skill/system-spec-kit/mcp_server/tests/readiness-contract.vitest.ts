// ───────────────────────────────────────────────────────────────
// TEST: Code Graph Readiness Contract (Shared Module)
// ───────────────────────────────────────────────────────────────
// Phase 017 / T-CGC-01: fixture-parity tests for the 4 helpers
// extracted from handlers/code-graph/query.ts:225-300 into
// lib/code-graph/readiness-contract.ts. Each assertion below
// encodes the pre-refactor query.ts behaviour so the extraction
// remains verifiable as pure (zero behaviour change).

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getLastDetectorProvenance: vi.fn(),
}));

vi.mock('../code_graph/lib/code-graph-db.js', () => ({
  getLastDetectorProvenance: mocks.getLastDetectorProvenance,
}));

import {
  canonicalReadinessFromFreshness,
  queryTrustStateFromFreshness,
  buildQueryGraphMetadata,
  buildReadinessBlock,
  type ReadyResult,
} from '../code_graph/lib/readiness-contract.js';

function makeReadiness(freshness: ReadyResult['freshness']): ReadyResult {
  return {
    freshness,
    action: freshness === 'fresh' ? 'none' : 'full_scan',
    inlineIndexPerformed: false,
    reason: `fixture:${freshness}`,
  };
}

describe('readiness-contract / canonicalReadinessFromFreshness', () => {
  it('maps "fresh" → "ready" (pre-refactor parity)', () => {
    expect(canonicalReadinessFromFreshness('fresh')).toBe('ready');
  });

  it('maps "stale" → "stale" (pre-refactor parity)', () => {
    expect(canonicalReadinessFromFreshness('stale')).toBe('stale');
  });

  it('maps "empty" → "missing" (pre-refactor parity)', () => {
    expect(canonicalReadinessFromFreshness('empty')).toBe('missing');
  });
});

describe('readiness-contract / queryTrustStateFromFreshness', () => {
  it('maps "fresh" → "live" (pre-refactor parity)', () => {
    expect(queryTrustStateFromFreshness('fresh')).toBe('live');
  });

  it('maps "stale" → "stale" (pre-refactor parity)', () => {
    expect(queryTrustStateFromFreshness('stale')).toBe('stale');
  });

  it('maps "empty" → "absent" (pre-refactor parity)', () => {
    expect(queryTrustStateFromFreshness('empty')).toBe('absent');
  });

  it('return value stays within the canonical SharedPayloadTrustState union', () => {
    const canonicalValues = new Set([
      'live',
      'cached',
      'stale',
      'absent',
      'unavailable',
      'imported',
      'rebuilt',
      'rehomed',
    ]);
    for (const freshness of ['fresh', 'stale', 'empty'] as const) {
      expect(canonicalValues.has(queryTrustStateFromFreshness(freshness))).toBe(true);
    }
  });
});

describe('readiness-contract / buildQueryGraphMetadata', () => {
  beforeEach(() => {
    mocks.getLastDetectorProvenance.mockReset();
  });

  it('returns undefined when freshness === "empty" (no scan has occurred)', () => {
    mocks.getLastDetectorProvenance.mockReturnValue('ast');
    expect(buildQueryGraphMetadata(makeReadiness('empty'))).toBeUndefined();
    // The db helper must not be consulted when the graph is empty.
    expect(mocks.getLastDetectorProvenance).not.toHaveBeenCalled();
  });

  it('returns undefined when the db has no persisted detector provenance', () => {
    mocks.getLastDetectorProvenance.mockReturnValue(null);
    expect(buildQueryGraphMetadata(makeReadiness('fresh'))).toBeUndefined();
  });

  it('returns the detectorProvenance envelope when fresh', () => {
    mocks.getLastDetectorProvenance.mockReturnValue('ast');
    expect(buildQueryGraphMetadata(makeReadiness('fresh'))).toEqual({
      detectorProvenance: 'ast',
      detectorProvenanceSource: 'last-persisted-scan',
    });
  });

  it('returns the detectorProvenance envelope when stale (stale graphs still carry provenance)', () => {
    mocks.getLastDetectorProvenance.mockReturnValue('structured');
    expect(buildQueryGraphMetadata(makeReadiness('stale'))).toEqual({
      detectorProvenance: 'structured',
      detectorProvenanceSource: 'last-persisted-scan',
    });
  });
});

describe('readiness-contract / buildReadinessBlock', () => {
  it('preserves the raw ensure-ready fields (freshness, action, reason, …)', () => {
    const readiness = makeReadiness('fresh');
    const block = buildReadinessBlock(readiness);
    expect(block.freshness).toBe('fresh');
    expect(block.action).toBe('none');
    expect(block.reason).toBe('fixture:fresh');
    expect(block.inlineIndexPerformed).toBe(false);
  });

  it('augments the block with canonicalReadiness + trustState fields (fresh)', () => {
    const block = buildReadinessBlock(makeReadiness('fresh'));
    expect(block.canonicalReadiness).toBe('ready');
    expect(block.trustState).toBe('live');
  });

  it('augments the block with canonicalReadiness + trustState fields (stale)', () => {
    const block = buildReadinessBlock(makeReadiness('stale'));
    expect(block.canonicalReadiness).toBe('stale');
    expect(block.trustState).toBe('stale');
  });

  it('augments the block with canonicalReadiness + trustState fields (empty)', () => {
    const block = buildReadinessBlock(makeReadiness('empty'));
    expect(block.canonicalReadiness).toBe('missing');
    expect(block.trustState).toBe('absent');
  });
});
