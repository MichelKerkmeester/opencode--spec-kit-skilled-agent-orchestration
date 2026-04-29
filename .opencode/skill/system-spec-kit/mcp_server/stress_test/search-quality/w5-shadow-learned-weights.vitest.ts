import { describe, expect, it } from 'vitest';

import {
  DEFAULT_SCORER_LANE_WEIGHTS,
  DEFAULT_SHADOW_SCORER_LANE_WEIGHTS,
  SCORER_LANE_IDS,
} from '../../skill_advisor/lib/scorer/lane-registry.js';
import { AdvisorRecommendOutputSchema } from '../../skill_advisor/schemas/advisor-tool-schemas.js';
import { runMeasurement } from './measurement-fixtures.js';

describe('W5 advisor shadow learned weights', () => {
  it('keeps live weights fixed and exposes a separate shadow vector', () => {
    expect(DEFAULT_SCORER_LANE_WEIGHTS).toMatchObject({
      explicit_author: 0.45,
      lexical: 0.30,
      graph_causal: 0.15,
      derived_generated: 0.15,
      semantic_shadow: 0,
    });
    expect(DEFAULT_SHADOW_SCORER_LANE_WEIGHTS).toMatchObject({
      explicit_author: 0.40,
      lexical: 0.25,
      graph_causal: 0.20,
      derived_generated: 0.10,
      semantic_shadow: 0.05,
    });
    expect(SCORER_LANE_IDS).toContain('semantic_shadow');
  });

  it('accepts advisor_recommend output with _shadow diagnostics', () => {
    const parsed = AdvisorRecommendOutputSchema.parse({
      workspaceRoot: process.cwd(),
      effectiveThresholds: {
        confidenceThreshold: 0.8,
        uncertaintyThreshold: 0.35,
        confidenceOnly: false,
      },
      recommendations: [],
      ambiguous: false,
      freshness: 'live',
      trustState: {
        state: 'live',
        reason: null,
        generation: 1,
        checkedAt: '2026-04-29T03:25:25.000Z',
        lastLiveAt: '2026-04-29T03:25:25.000Z',
      },
      generatedAt: '2026-04-29T03:25:25.000Z',
      cache: {
        hit: false,
        sourceSignaturePresent: true,
      },
      _shadow: {
        model: 'advisor-shadow-learned-weights-v1',
        liveWeightsFrozen: true,
        recommendations: [{
          skillId: 'system-spec-kit',
          liveScore: 0.52,
          shadowScore: 0.49,
          delta: -0.03,
          dominantShadowLane: 'explicit_author',
        }],
      },
    });

    expect(parsed._shadow?.liveWeightsFrozen).toBe(true);
  });

  it('improves advisor diagnostic citation-quality in the variant fixture', async () => {
    const baseline = await runMeasurement({ workstream: 'W5', variant: 'baseline' });
    const variant = await runMeasurement({ workstream: 'W5', variant: 'variant' });

    expect(variant.summary.citationQuality).toBeGreaterThan(baseline.summary.citationQuality);
  });
});
