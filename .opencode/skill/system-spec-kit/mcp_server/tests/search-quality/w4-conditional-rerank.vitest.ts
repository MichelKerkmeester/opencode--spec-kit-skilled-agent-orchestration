import { describe, expect, it } from 'vitest';

import { createEmptyQueryPlan } from '../../lib/query/query-plan.js';
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

  it('improves ambiguous-query precision in the variant fixture', async () => {
    const baseline = await runMeasurement({ workstream: 'W4', variant: 'baseline' });
    const variant = await runMeasurement({ workstream: 'W4', variant: 'variant' });

    expect(variant.summary.precisionAt3).toBeGreaterThan(baseline.summary.precisionAt3);
    expect(variant.summary.latency.p95).toBeLessThanOrEqual(5);
  });
});
