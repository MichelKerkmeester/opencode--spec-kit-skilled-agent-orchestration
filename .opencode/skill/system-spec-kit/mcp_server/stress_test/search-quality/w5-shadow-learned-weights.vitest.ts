// ───────────────────────────────────────────────────────────────
// MODULE: W5 Shadow Learned Weights Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises live weight isolation and shadow diagnostics quality deltas.

import { describe, expect, it } from 'vitest';

import {
  DEFAULT_SCORER_LANE_WEIGHTS,
  DEFAULT_SHADOW_SCORER_LANE_WEIGHTS,
  SCORER_LANE_IDS,
} from '../../skill_advisor/lib/scorer/lane-registry.js';
import { AdvisorRecommendOutputSchema } from '../../skill_advisor/schemas/advisor-tool-schemas.js';
// F-011-C1-05: __testables exposes resolveLearnedBlendWeight so the env-clamp
// behavior can be verified without spinning up the full pipeline.
import { __testables as stage2Testables } from '../../lib/search/pipeline/stage2-fusion.js';
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

  // F-011-C1-05: learned blend weight clamp. The env-controlled blend weight
  // is parsed and clamped at the source so the live blend (1-w)*manual +
  // w*learned can never exceed 5%. Default 0 means shadow-only behavior is
  // preserved when the flag is unset.
  describe('F-011-C1-05 learned blend weight clamp', () => {
    it('returns 0 when SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT is unset', () => {
      expect(stage2Testables.resolveLearnedBlendWeight({})).toBe(0);
    });

    it('returns the parsed weight when it falls within [0, 0.05]', () => {
      expect(stage2Testables.resolveLearnedBlendWeight({
        SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT: '0.03',
      })).toBeCloseTo(0.03, 5);
    });

    it('clamps weights above 0.05 down to the guard (no flip into a steering wheel)', () => {
      expect(stage2Testables.resolveLearnedBlendWeight({
        SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT: '0.5',
      })).toBe(0.05);
    });

    it('returns 0 when the env value is non-numeric (e.g. "abc")', () => {
      expect(stage2Testables.resolveLearnedBlendWeight({
        SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT: 'abc',
      })).toBe(0);
    });

    it('returns 0 when the env value is negative or zero', () => {
      expect(stage2Testables.resolveLearnedBlendWeight({
        SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT: '-0.05',
      })).toBe(0);
      expect(stage2Testables.resolveLearnedBlendWeight({
        SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT: '0',
      })).toBe(0);
    });

    it('result stays in [0, 0.05] across diverse env values (boundary guard)', () => {
      const fixtures = ['0', '0.01', '0.04999', '0.05', '0.1', '999', 'NaN', '', undefined];
      for (const value of fixtures) {
        const env = value === undefined ? {} : { SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT: value };
        const weight = stage2Testables.resolveLearnedBlendWeight(env);
        expect(weight).toBeGreaterThanOrEqual(0);
        expect(weight).toBeLessThanOrEqual(0.05);
      }
    });
  });
});
