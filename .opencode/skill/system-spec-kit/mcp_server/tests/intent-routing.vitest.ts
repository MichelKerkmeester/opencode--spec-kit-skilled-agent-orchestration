// TEST: Intent-routing regression coverage
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  DEGREE_BOOST_CAP,
  EDGE_TYPE_WEIGHTS,
  normalizeDegreeToBoostedScore,
} from '../lib/search/graph-search-fn';
import * as graphSearchFn from '../lib/search/graph-search-fn';
import { createContentRouter } from '../lib/routing/content-router.js';

function makeEmbeddingFn() {
  return (text: string): number[] => {
    const buckets = Array.from({ length: 64 }, () => 0);
    for (const token of text.toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean)) {
      const digest = createHash('sha256').update(token).digest();
      const bucketIndex = digest[0] % buckets.length;
      buckets[bucketIndex] += 1;
    }
    return buckets;
  };
}

function makeRouterContext() {
  return {
    specFolder: '026-graph-and-context-optimization/015-save-flow-planner-first-trim',
    packetLevel: 'L3+' as const,
    existingAnchors: ['phase-1', 'phase-2', 'what-built', 'how-delivered'],
    sessionMeta: {
      packet_kind: 'phase' as const,
      save_mode: 'route-as' as const,
      recent_docs_touched: ['handover.md'],
      recent_anchors_touched: ['session-log'],
      likely_phase_anchor: 'phase-2',
      session_id: 'intent-routing-test',
    },
  };
}

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

  it('keeps route overrides auditable after Tier 3 default trim', async () => {
    const router = createContentRouter({
      embedText: makeEmbeddingFn(),
    });

    const decision = await router.classifyContent({
      id: 'intent-route-01',
      text: '2026-04-11 assistant: Applying targeted fix. 2026-04-11 tool: git diff.',
      sourceField: 'unknown',
      routeAs: 'handover_state',
    }, makeRouterContext());

    expect(decision.overrideApplied).toBe(true);
    expect(decision.category).toBe('handover_state');
    expect(decision.naturalDecision?.category).toBe('drop');
    expect(decision.warningMessage).toContain('Override accepted');
  });
});
