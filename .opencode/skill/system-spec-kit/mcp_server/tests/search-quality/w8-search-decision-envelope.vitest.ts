import { describe, expect, it } from 'vitest';

import { createEmptyQueryPlan } from '../../lib/query/query-plan.js';
import {
  attachCocoIndexCalibration,
  attachDegradedReadiness,
  attachRerankDecision,
  attachShadowDeltas,
  buildSearchDecisionEnvelope,
} from '../../lib/search/search-decision-envelope.js';

describe('W8 SearchDecisionEnvelope', () => {
  it('builds an empty versioned envelope with request identity and QueryPlan', () => {
    const queryPlan = createEmptyQueryPlan({ selectedChannels: ['vector', 'fts'] });

    const envelope = buildSearchDecisionEnvelope({
      requestId: 'req-empty',
      queryPlan,
      timestamp: '2026-04-29T00:00:00.000Z',
      latencyMs: 12.4,
    });

    expect(envelope).toMatchObject({
      envelopeVersion: 1,
      requestId: 'req-empty',
      queryPlan,
      timestamp: '2026-04-29T00:00:00.000Z',
      latencyMs: 12,
    });
    expect(envelope.trustTree).toBeUndefined();
  });

  it('composes trust tree, rerank decision, shadow deltas, calibration, and degraded readiness', () => {
    const queryPlan = createEmptyQueryPlan({
      complexity: 'complex',
      authorityNeed: 'high',
      selectedChannels: ['vector', 'fts', 'graph'],
    });

    const envelope = buildSearchDecisionEnvelope({
      requestId: 'req-full',
      tenantId: 'tenant-a',
      userId: 'user-a',
      agentId: 'agent-a',
      queryPlan,
      trustTreeInput: {
        responsePolicy: { state: 'live', decision: 'cite_results' },
        codeGraph: { trustState: 'stale', canonicalReadiness: 'stale' },
      },
      rerankGateDecision: {
        shouldRerank: true,
        reason: 'eligible:complex-query+high-authority',
        triggers: ['complex-query', 'high-authority'],
      },
      shadowDeltas: [{
        recommendation: 'sk-code-web',
        liveScore: 0.7,
        shadowScore: 0.9,
        delta: 0.2,
        dominantLane: 'semantic_shadow',
        timestamp: '2026-04-29T00:00:00.000Z',
      }],
      cocoindexCalibration: {
        requestedLimit: 5,
        effectiveLimit: 5,
        duplicateDensity: 0.5,
        duplicateCount: 2,
        uniquePathCount: 2,
        adaptiveOverfetchApplied: false,
        overfetchMultiplier: 1,
        pathClassCounts: { runtime: 4 },
      },
      degradedReadiness: {
        freshness: 'stale',
        canonicalReadiness: 'stale',
        trustState: 'stale',
      },
      timestamp: '2026-04-29T00:00:00.000Z',
      latencyMs: 5,
    });

    expect(envelope.trustTree?.decision).toBe('degraded');
    expect(envelope.rerankGateDecision?.triggers).toEqual(['complex-query', 'high-authority']);
    expect(envelope.shadowDeltas?.[0]?.dominantLane).toBe('semantic_shadow');
    expect(envelope.cocoindexCalibration?.recommendedMultiplier).toBe(4);
    expect(envelope.cocoindexCalibration?.adaptiveOverfetchApplied).toBe(false);
    expect(envelope.degradedReadiness?.trustState).toBe('stale');
    expect(envelope.tenantId).toBe('tenant-a');
  });

  it('supports partial attach composition without mutating the original envelope', () => {
    const base = buildSearchDecisionEnvelope({
      requestId: 'req-partial',
      queryPlan: createEmptyQueryPlan(),
      timestamp: '2026-04-29T00:00:00.000Z',
    });

    const withRerank = attachRerankDecision(base, {
      shouldRerank: false,
      reason: 'no_eligible_ambiguity_or_disagreement',
      triggers: [],
    });
    const withShadow = attachShadowDeltas(withRerank, [{
      liveScore: 0.3,
      shadowScore: 0.4,
      delta: 0.1,
      dominantLane: 'semantic_shadow',
      timestamp: '2026-04-29T00:00:00.000Z',
    }]);
    const withCalibration = attachCocoIndexCalibration(withShadow, {
      requestedLimit: 10,
      effectiveLimit: 10,
      duplicateDensity: 0,
      duplicateCount: 0,
      uniquePathCount: 10,
      adaptiveOverfetchApplied: false,
      overfetchMultiplier: 1,
      pathClassCounts: {},
    });
    const complete = attachDegradedReadiness(withCalibration, { freshness: 'empty', trustState: 'absent' });

    expect(base.rerankGateDecision).toBeUndefined();
    expect(complete.rerankGateDecision?.shouldRerank).toBe(false);
    expect(complete.shadowDeltas).toHaveLength(1);
    expect(complete.cocoindexCalibration?.recommendedMultiplier).toBe(1);
    expect(complete.degradedReadiness?.freshness).toBe('empty');
  });
});

