// ───────────────────────────────────────────────────────────────
// MODULE: W4 Conditional Rerank Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises rerank gating, telemetry, and ambiguous-query quality deltas.

import { describe, expect, it } from 'vitest';

import { createEmptyQueryPlan } from '../../lib/query/query-plan.js';
import { executeStage3 } from '../../lib/search/pipeline/stage3-rerank.js';
import { decideConditionalRerank } from '../../lib/search/rerank-gate.js';
import { runMeasurement } from './measurement-fixtures.js';

describe('W4 conditional rerank gate', () => {
  it('reranks ambiguous multi-channel queries when triggers are present', () => {
    const queryPlan = createEmptyQueryPlan({
      complexity: 'complex',
      authorityNeed: 'high',
      selectedChannels: ['memory_search', 'skill_graph_query'],
    });

    expect(decideConditionalRerank({
      queryPlan,
      signals: { channelCount: 2, topScoreMargin: 0.01, candidateCount: 5 },
    })).toMatchObject({
      shouldRerank: true,
    });
  });

  it('skips rerank when no ambiguity or disagreement triggers fire', () => {
    const queryPlan = createEmptyQueryPlan({
      complexity: 'simple',
      authorityNeed: 'low',
      selectedChannels: ['memory_search'],
    });

    expect(decideConditionalRerank({
      queryPlan,
      signals: { channelCount: 1, topScoreMargin: 0.5, candidateCount: 5 },
    })).toMatchObject({
      shouldRerank: false,
      reason: 'no_eligible_ambiguity_or_disagreement',
    });
  });

  it('passes real QueryPlan into Stage 3 rerank gate telemetry', async () => {
    const queryPlan = createEmptyQueryPlan({
      complexity: 'complex',
      authorityNeed: 'high',
      selectedChannels: ['vector', 'fts', 'graph'],
    });

    const result = await executeStage3({
      scored: [
        { id: 1, score: 0.9, content: 'alpha' },
        { id: 2, score: 0.88, content: 'beta' },
        { id: 3, score: 0.5, content: 'gamma' },
        { id: 4, score: 0.4, content: 'delta' },
      ],
      config: {
        query: 'audit the decision record for runtime wiring',
        searchType: 'hybrid',
        limit: 4,
        includeArchived: false,
        includeConstitutional: true,
        includeContent: false,
        minState: '',
        applyStateLimits: false,
        useDecay: true,
        rerank: true,
        applyLengthPenalty: true,
        enableDedup: false,
        enableSessionBoost: false,
        enableCausalBoost: false,
        trackAccess: false,
        detectedIntent: 'security_audit',
        intentConfidence: 1,
        intentWeights: null,
        queryPlan,
      },
    });

    expect(result.metadata.rerankGateDecision).toMatchObject({
      shouldRerank: true,
      triggers: expect.arrayContaining(['complex-query', 'high-authority']),
    });
  });

  it('improves ambiguous-query precision in the variant fixture', async () => {
    const baseline = await runMeasurement({ workstream: 'W4', variant: 'baseline' });
    const variant = await runMeasurement({ workstream: 'W4', variant: 'variant' });

    expect(variant.summary.precisionAt3).toBeGreaterThan(baseline.summary.precisionAt3);
    expect(variant.summary.latency.p95).toBeLessThanOrEqual(5);
  });
});
