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

  // F-011-C1-02: lower the rerank-gate floor for weak-margin / disagreement
  // triggers. Three-candidate ambiguous cases used to be blocked by the
  // hard floor of 4 even when the gate had clear signals (weak margin or
  // disagreement). The relaxed floor lets the rerank actually run for the
  // exact cases where it has the highest payoff.
  it('passes 3-candidate weak-margin case under relaxed floor (F-011-C1-02)', () => {
    const queryPlan = createEmptyQueryPlan({
      complexity: 'simple',
      authorityNeed: 'low',
      // Weak-margin trigger requires multi-channel + topScoreMargin <= 0.08;
      // selectedChannels.length supplies channelCount fallback when the
      // signal is omitted.
      selectedChannels: ['memory_search', 'skill_graph_query'],
    });

    const decision = decideConditionalRerank({
      queryPlan,
      signals: { channelCount: 2, topScoreMargin: 0.02, candidateCount: 3 },
    });

    expect(decision).toMatchObject({
      shouldRerank: true,
    });
    // Trigger surface must surface the weak-margin signal so the relaxed
    // floor was used for the right reason — not by accident.
    expect(decision.triggers).toContain('multi-channel-weak-margin');
  });

  it('still blocks 3-candidate case when only complex-query/high-authority triggers fire (no ambiguity)', () => {
    // F-011-C1-02 backward-compat guard: complex-query / high-authority
    // alone (no weak-margin or disagreement) still respect the original
    // floor of 4. This protects the baseline cost contract for complex
    // queries that don't actually have ambiguity signals.
    const queryPlan = createEmptyQueryPlan({
      complexity: 'complex',
      authorityNeed: 'high',
      selectedChannels: ['memory_search'],
    });

    expect(decideConditionalRerank({
      queryPlan,
      signals: { channelCount: 1, topScoreMargin: 0.5, candidateCount: 3 },
    })).toMatchObject({
      shouldRerank: false,
      reason: 'candidate_count_below_rerank_floor',
    });
  });

  it('passes 2-candidate case when a disagreement trigger fires', () => {
    // F-011-C1-02: disagreement-reason triggers also count as ambiguity
    // signals. Even with only 2 candidates, rerank should run when channels
    // disagree about the top result.
    const queryPlan = createEmptyQueryPlan({
      complexity: 'simple',
      authorityNeed: 'low',
      selectedChannels: ['memory_search'],
    });

    const decision = decideConditionalRerank({
      queryPlan,
      signals: {
        channelCount: 1,
        topScoreMargin: 0.5,
        candidateCount: 2,
        disagreementReasons: ['top1_mismatch'],
      },
    });

    expect(decision).toMatchObject({ shouldRerank: true });
    expect(decision.triggers).toContain('disagreement:top1_mismatch');
  });
});
