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

  // ── Packet 016 / F-009: error → missing fixture ─────────────────
  // The helper at readiness-contract.ts:73-87 already maps `error` →
  // `missing`. The shared fixture was missing this coverage; without
  // it a future regression on the `error` arm would only be caught
  // by handler-level tests, not the contract-level suite.
  it('maps "error" → "missing" (PR 4 / F71: unreachable scope is structurally missing)', () => {
    expect(canonicalReadinessFromFreshness('error')).toBe('missing');
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

  // ── Packet 016 / F-009: error → unavailable fixture ────────────────
  // Mirrors the canonicalReadiness fixture above. The helper at
  // readiness-contract.ts:109-123 already projects `error` → `unavailable`,
  // but the shared fixture didn't pin it. Lock it down so cross-handler
  // vocabulary parity (context/status/query) stays enforceable from a
  // single place.
  it('maps "error" → "unavailable" (PR 4 / F71: scope unreachable, not absent)', () => {
    expect(queryTrustStateFromFreshness('error')).toBe('unavailable');
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
    // Packet 016 / F-009: include 'error' in the iteration so the
    // sweep proves all four freshness states project into the canonical
    // 8-state union (no escapes).
    for (const freshness of ['fresh', 'stale', 'empty', 'error'] as const) {
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

  // ── Packet 016 / F-009: error → no provenance lookup fixture ──────
  // Per readiness-contract.ts:143, an unreachable scope must short-circuit
  // BEFORE the db call to avoid surfacing stale or partial provenance from
  // a crashed probe. Lock that contract from the shared suite.
  it('returns undefined when freshness === "error" and skips db lookup (probe crashed)', () => {
    mocks.getLastDetectorProvenance.mockReturnValue('ast');
    expect(buildQueryGraphMetadata(makeReadiness('error'))).toBeUndefined();
    expect(mocks.getLastDetectorProvenance).not.toHaveBeenCalled();
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

  // ── Packet 016 / F-009: error → missing/unavailable fixture ───────
  // The crash-on-probe path must project to canonicalReadiness='missing'
  // (structurally missing scope) AND trustState='unavailable' (not 'absent';
  // that would conflate a crash with a genuinely empty graph). This is the
  // single source of truth for the shared degraded-readiness vocabulary
  // referenced by all three handlers (context / status / query) — see
  // packet 016 decision-record.md ADR-001.
  it('augments the block with canonicalReadiness="missing" + trustState="unavailable" (error)', () => {
    const block = buildReadinessBlock(makeReadiness('error'));
    expect(block.canonicalReadiness).toBe('missing');
    expect(block.trustState).toBe('unavailable');
    // Raw fields preserved.
    expect(block.freshness).toBe('error');
    expect(block.action).toBe('full_scan');
    expect(block.reason).toBe('fixture:error');
  });
});
