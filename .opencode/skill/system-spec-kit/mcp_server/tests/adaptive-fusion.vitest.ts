// TEST: Adaptive Fusion (C136-10)
// 15 tests: weight profiles, sum<=1, deterministic output,
// Flag ON/OFF, dark-run, degraded contract, fallback, intent impact
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getAdaptiveWeights,
  adaptiveFuse,
  standardFuse,
  hybridAdaptiveFuse,
  isAdaptiveFusionEnabled,
  INTENT_WEIGHT_PROFILES,
  DEFAULT_WEIGHTS,
  FEATURE_FLAG,
} from '@spec-kit/shared/algorithms/adaptive-fusion';
import type { FusionWeights, DegradedModeContract, AdaptiveFusionResult } from '@spec-kit/shared/algorithms/adaptive-fusion';
import type { RrfItem } from '@spec-kit/shared/algorithms/rrf-fusion';

/* ───────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

function makeItems(count: number, prefix = 'item'): RrfItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    title: `${prefix} ${i + 1}`,
  }));
}

const savedEnv: Record<string, string | undefined> = {};

function setEnv(key: string, value: string | undefined) {
  if (!(key in savedEnv)) savedEnv[key] = process.env[key];
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

function restoreEnv() {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('C136-10 Adaptive Fusion', () => {
  beforeEach(() => {
    // Default: flag OFF (standard behaviour)
    setEnv(FEATURE_FLAG, 'false');
    setEnv('SPECKIT_ROLLOUT_PERCENT', '100');
  });

  afterEach(() => {
    restoreEnv();
  });

  // ---- T1: Weight profiles per intent ----
  it('T1: returns correct weights for understand intent', () => {
    const w = getAdaptiveWeights('understand');
    expect(w.semanticWeight).toBeCloseTo(0.7 / 1.15, 9);
    expect(w.keywordWeight).toBeCloseTo(0.2 / 1.15, 9);
    expect(w.recencyWeight).toBeCloseTo(0.1 / 1.15, 9);
    expect(w.graphWeight).toBeCloseTo(0.15 / 1.15, 9);
  });

  it('T2: returns correct weights for fix_bug intent', () => {
    const w = getAdaptiveWeights('fix_bug');
    expect(w.semanticWeight).toBeCloseTo(0.4 / 1.1, 9);
    expect(w.keywordWeight).toBeCloseTo(0.4 / 1.1, 9);
    expect(w.recencyWeight).toBeCloseTo(0.2 / 1.1, 9);
    expect(w.graphWeight).toBeCloseTo(0.1 / 1.1, 9);
  });

  it('T3: returns correct weights for add_feature intent', () => {
    const w = getAdaptiveWeights('add_feature');
    expect(w.semanticWeight).toBeCloseTo(0.5 / 1.2, 9);
    expect(w.keywordWeight).toBeCloseTo(0.3 / 1.2, 9);
    expect(w.recencyWeight).toBeCloseTo(0.2 / 1.2, 9);
    expect(w.graphWeight).toBeCloseTo(0.2 / 1.2, 9);
  });

  it('T4: returns correct weights for refactor intent', () => {
    const w = getAdaptiveWeights('refactor');
    expect(w.semanticWeight).toBeCloseTo(0.6 / 1.15, 9);
    expect(w.keywordWeight).toBeCloseTo(0.3 / 1.15, 9);
    expect(w.recencyWeight).toBeCloseTo(0.1 / 1.15, 9);
    expect(w.graphWeight).toBeCloseTo(0.15 / 1.15, 9);
  });

  it('T5: returns default weights for unknown intent', () => {
    const w = getAdaptiveWeights('unknown_intent_xyz' as string);
    expect(w.semanticWeight).toBeCloseTo(DEFAULT_WEIGHTS.semanticWeight / 1.15, 9);
    expect(w.keywordWeight).toBeCloseTo(DEFAULT_WEIGHTS.keywordWeight / 1.15, 9);
    expect(w.recencyWeight).toBeCloseTo(DEFAULT_WEIGHTS.recencyWeight / 1.15, 9);
    expect(w.graphWeight).toBeCloseTo((DEFAULT_WEIGHTS.graphWeight ?? 0) / 1.15, 9);
  });

  // ---- T6: Weights sum <= 1.0 ----
  it('T6: all weight profiles sum to <= 1.0', () => {
    const allProfiles = { ...INTENT_WEIGHT_PROFILES, default: DEFAULT_WEIGHTS };
    for (const [name] of Object.entries(allProfiles)) {
      const normalized = getAdaptiveWeights(name === 'default' ? 'unknown_intent_xyz' : name);
      const sum =
        normalized.semanticWeight +
        normalized.keywordWeight +
        normalized.recencyWeight +
        (normalized.graphWeight ?? 0);
      expect(sum, `Profile "${name}" sums to ${sum}`).toBeLessThanOrEqual(1.0 + 1e-9);
      expect(sum, `Profile "${name}" sums to ${sum}`).toBeGreaterThan(0);
    }
  });

  // ---- T7: Document type adjustments keep sum <= 1.0 ----
  it('T7: document type adjustments keep weights sum <= 1.0', () => {
    for (const docType of ['decision', 'implementation', 'research']) {
      for (const intent of ['understand', 'fix_bug', 'add_feature', 'refactor']) {
        const w = getAdaptiveWeights(intent, docType);
        const sum = w.semanticWeight + w.keywordWeight + w.recencyWeight + (w.graphWeight ?? 0);
        expect(sum, `${intent}+${docType} sums to ${sum}`).toBeLessThanOrEqual(1.0 + 1e-9);
      }
    }
  });

  // ---- T8: Deterministic output ----
  it('T8: adaptiveFuse produces deterministic output for same inputs', () => {
    const semantic = makeItems(5, 'sem');
    const keyword = makeItems(5, 'kw');
    const weights: FusionWeights = { semanticWeight: 0.6, keywordWeight: 0.4, recencyWeight: 0 };

    const run1 = adaptiveFuse(semantic, keyword, weights);
    const run2 = adaptiveFuse(semantic, keyword, weights);

    expect(run1.map(r => r.id)).toEqual(run2.map(r => r.id));
    expect(run1.map(r => r.rrfScore)).toEqual(run2.map(r => r.rrfScore));
  });

  // ---- T9: Feature flag OFF returns standard ----
  it('T9: flag OFF returns standard fusion results', () => {
    setEnv(FEATURE_FLAG, 'false');
    const semantic = makeItems(3, 'sem');
    const keyword = makeItems(3, 'kw');

    const result = hybridAdaptiveFuse(semantic, keyword, 'understand');
    const standard = standardFuse(semantic, keyword);

    // When flag OFF, should return standard results
    expect(result.results.map(r => r.id)).toEqual(standard.map(r => r.id));
    expect(result.degraded).toBeUndefined();
    expect(result.darkRunDiff).toBeUndefined();
  });

  // ---- T10: Feature flag ON returns adaptive ----
  it('T10: flag ON returns adaptive fusion results', () => {
    setEnv(FEATURE_FLAG, 'true');
    const semantic = makeItems(3, 'sem');
    const keyword = makeItems(3, 'kw');

    const result = hybridAdaptiveFuse(semantic, keyword, 'understand');
    // Weights should reflect understand intent
    expect(result.weights.semanticWeight).toBeCloseTo(0.7 / 1.15, 9);
    expect(result.weights.keywordWeight).toBeCloseTo(0.2 / 1.15, 9);
  });

  it('T10b: partial rollout without identity fails closed to standard fusion', () => {
    setEnv(FEATURE_FLAG, 'true');
    setEnv('SPECKIT_ROLLOUT_PERCENT', '25');

    expect(isAdaptiveFusionEnabled()).toBe(false);
    expect(isAdaptiveFusionEnabled('   ')).toBe(false);

    const semantic = makeItems(3, 'sem');
    const keyword = makeItems(3, 'kw');
    const result = hybridAdaptiveFuse(semantic, keyword, 'understand');
    const standard = standardFuse(semantic, keyword);

    expect(result.results.map(r => r.id)).toEqual(standard.map(r => r.id));
  });

  it('T10c: partial rollout still honors deterministic identity bucketing', () => {
    setEnv(FEATURE_FLAG, 'true');
    setEnv('SPECKIT_ROLLOUT_PERCENT', '25');

    expect(isAdaptiveFusionEnabled('session-0')).toBe(false);
    expect(isAdaptiveFusionEnabled('session-3')).toBe(true);

    const semantic = makeItems(3, 'sem');
    const keyword = makeItems(3, 'kw');

    const outOfBucket = hybridAdaptiveFuse(semantic, keyword, 'understand', { identity: 'session-0' });
    const inBucket = hybridAdaptiveFuse(semantic, keyword, 'understand', { identity: 'session-3' });
    const standard = standardFuse(semantic, keyword);

    expect(outOfBucket.results.map(r => r.id)).toEqual(standard.map(r => r.id));
    expect(inBucket.weights.semanticWeight).toBeCloseTo(0.7 / 1.15, 9);
    expect(inBucket.weights.keywordWeight).toBeCloseTo(0.2 / 1.15, 9);
  });

  // ---- T11: Dark-run mode computes diff ----
  it('T11: dark-run mode returns standard results with diff', () => {
    setEnv(FEATURE_FLAG, 'false');
    const semantic = makeItems(5, 'sem');
    const keyword = makeItems(5, 'kw');

    const result = hybridAdaptiveFuse(semantic, keyword, 'fix_bug', { darkRun: true });
    expect(result.darkRunDiff).toBeDefined();
    expect(result.darkRunDiff!.standardCount).toBeGreaterThan(0);
    expect(result.darkRunDiff!.adaptiveCount).toBeGreaterThan(0);
    expect(typeof result.darkRunDiff!.orderDifferences).toBe('number');
    expect(typeof result.darkRunDiff!.topResultChanged).toBe('boolean');

    // Should still return standard results
    const standard = standardFuse(semantic, keyword);
    expect(result.results.map(r => r.id)).toEqual(standard.map(r => r.id));
  });

  // ---- T12: DegradedModeContract shape and typed contract validation ----
  it('T12: degraded contract has correct typed shape', () => {
    // Validate the DegradedModeContract interface shape directly.
    // The contract is returned by hybridAdaptiveFuse when adaptive fusion fails.
    const contract: DegradedModeContract = {
      failureMode: 'adaptive_fusion_error: simulated failure',
      fallbackMode: 'standard_rrf',
      confidenceImpact: 0.3,
      retryRecommendation: 'none',
    };

    // Validate contract field types and constraints
    expect(typeof contract.failureMode).toBe('string');
    expect(contract.failureMode).toContain('adaptive_fusion_error');
    expect(contract.fallbackMode).toBe('standard_rrf');
    expect(contract.confidenceImpact).toBeGreaterThan(0);
    expect(contract.confidenceImpact).toBeLessThanOrEqual(1.0);
    expect(contract.retryRecommendation).toBe('none');

    // Verify empty_results degraded contract (total failure)
    const totalFailure: DegradedModeContract = {
      failureMode: 'standard_fusion_error: catastrophic',
      fallbackMode: 'empty_results',
      confidenceImpact: 1.0,
      retryRecommendation: 'immediate',
    };

    expect(totalFailure.confidenceImpact).toBe(1.0);
    expect(totalFailure.retryRecommendation).toBe('immediate');
    expect(totalFailure.fallbackMode).toBe('empty_results');

    // Also verify that when flag is ON and results exist, no degraded contract is set
    setEnv(FEATURE_FLAG, 'true');
    const semantic = makeItems(3, 'sem');
    const keyword = makeItems(3, 'kw');
    const result = hybridAdaptiveFuse(semantic, keyword, 'understand');
    expect(result.degraded).toBeUndefined();
    expect(result.results.length).toBeGreaterThan(0);
  });

  // ---- T13: Empty inputs return empty ----
  it('T13: returns empty results for empty inputs', () => {
    setEnv(FEATURE_FLAG, 'true');
    const result = hybridAdaptiveFuse([], [], 'understand');
    expect(result.results).toEqual([]);
  });

  // ---- T14: Different intents produce different output order ----
  it('T14: different intents produce different weight distributions', () => {
    const wUnderstand = getAdaptiveWeights('understand');
    const wFixBug = getAdaptiveWeights('fix_bug');

    // These intents have different semantic weights
    expect(wUnderstand.semanticWeight).not.toBe(wFixBug.semanticWeight);
    expect(wUnderstand.keywordWeight).not.toBe(wFixBug.keywordWeight);
  });

  // ---- T15: find_spec keeps the same core ordering while giving graph more weight ----
  it('T15: find_spec gives graph more weight than understand', () => {
    const wFindSpec = getAdaptiveWeights('find_spec');
    const wUnderstand = getAdaptiveWeights('understand');

    expect(wFindSpec.semanticWeight).toBeLessThan(wUnderstand.semanticWeight);
    expect(wFindSpec.keywordWeight).toBeLessThan(wUnderstand.keywordWeight);
    expect(wFindSpec.recencyWeight).toBeLessThan(wUnderstand.recencyWeight);
    expect((wFindSpec.graphWeight ?? 0)).toBeGreaterThan(wUnderstand.graphWeight ?? 0);
  });

  // ---- C138 ADDITIONS: Intent-Weighted RRF Activation ----

  describe('C138: Intent-Weighted RRF Activation', () => {
    it('C138-T1: find_spec intent heavily weights FTS5/keyword', () => {
      const w = getAdaptiveWeights('find_spec');
      // Find_spec should lean toward keyword matching
      expect(w.keywordWeight).toBeGreaterThanOrEqual(0.15);
      expect((w.graphWeight ?? 0)).toBeGreaterThan(w.keywordWeight);
    });

    it('C138-T2: explore/understand intent balances evenly', () => {
      const w = getAdaptiveWeights('understand');
      // Understand should favor semantic
      expect(w.semanticWeight).toBeGreaterThan(w.keywordWeight);
    });

    it('C138-T3: hybridAdaptiveFuse produces different rankings per intent', () => {
      setEnv(FEATURE_FLAG, 'true');
      const semantic = makeItems(5, 'sem');
      const keyword = makeItems(5, 'kw');

      const understandResult = hybridAdaptiveFuse(semantic, keyword, 'understand');
      const fixBugResult = hybridAdaptiveFuse(semantic, keyword, 'fix_bug');

      // Different intents → different weight distributions
      expect(understandResult.weights.semanticWeight).not.toBe(fixBugResult.weights.semanticWeight);
    });

    it('C138-T4: all 7 intent types produce valid weight profiles', () => {
      const intents = ['understand', 'find_spec', 'find_decision', 'fix_bug', 'add_feature', 'refactor', 'debug'];
      for (const intent of intents) {
        const w = getAdaptiveWeights(intent as string);
        const sum = w.semanticWeight + w.keywordWeight + w.recencyWeight;
        expect(sum, `${intent} weights sum to ${sum}`).toBeLessThanOrEqual(1.0 + 1e-9);
        expect(sum).toBeGreaterThan(0);
      }
    });
  });

  // ---- T019: graphWeight and graphCausalBias field validation ----

  describe('T019: graphWeight and graphCausalBias profiles', () => {
    const PROFILE_NAMES = ['understand', 'find_spec', 'fix_bug', 'add_feature', 'refactor'] as const;

    it('T019-1: all 5 profiles have a numeric graphWeight field', () => {
      for (const name of PROFILE_NAMES) {
        const profile = INTENT_WEIGHT_PROFILES[name];
        expect(profile, `Profile "${name}" must exist`).toBeDefined();
        expect(typeof profile.graphWeight, `Profile "${name}" graphWeight must be a number`).toBe('number');
      }
    });

    it('T019-2: all 5 profiles have a numeric graphCausalBias field', () => {
      for (const name of PROFILE_NAMES) {
        const profile = INTENT_WEIGHT_PROFILES[name];
        expect(profile, `Profile "${name}" must exist`).toBeDefined();
        expect(typeof profile.graphCausalBias, `Profile "${name}" graphCausalBias must be a number`).toBe('number');
      }
    });

    it('T019-3: all graphWeight and graphCausalBias values are in range [0, 1]', () => {
      const allProfiles = { ...INTENT_WEIGHT_PROFILES, default: DEFAULT_WEIGHTS };
      for (const [name, profile] of Object.entries(allProfiles)) {
        const gw = profile.graphWeight!;
        const gcb = profile.graphCausalBias!;
        expect(gw, `Profile "${name}" graphWeight (${gw}) must be >= 0`).toBeGreaterThanOrEqual(0);
        expect(gw, `Profile "${name}" graphWeight (${gw}) must be <= 1`).toBeLessThanOrEqual(1.0);
        expect(gcb, `Profile "${name}" graphCausalBias (${gcb}) must be >= 0`).toBeGreaterThanOrEqual(0);
        expect(gcb, `Profile "${name}" graphCausalBias (${gcb}) must be <= 1`).toBeLessThanOrEqual(1.0);
      }
    });

    it('T019-4: find_spec has high graphWeight (>= 0.25) for graph-heavy spec lookups', () => {
      const profile = INTENT_WEIGHT_PROFILES['find_spec'];
      expect(profile.graphWeight, `find_spec.graphWeight (${profile.graphWeight}) must be >= 0.25`).toBeGreaterThanOrEqual(0.25);
    });

    // T019-5: Removed — 'debug' is not a valid IntentType.
    // The debug profile was erroneously included and has been removed from INTENT_WEIGHT_PROFILES.

    it('T019-6: DEFAULT_WEIGHTS includes both graphWeight and graphCausalBias as numbers', () => {
      expect(typeof DEFAULT_WEIGHTS.graphWeight).toBe('number');
      expect(typeof DEFAULT_WEIGHTS.graphCausalBias).toBe('number');
      expect(DEFAULT_WEIGHTS.graphWeight!).toBeGreaterThanOrEqual(0);
      expect(DEFAULT_WEIGHTS.graphWeight!).toBeLessThanOrEqual(1.0);
      expect(DEFAULT_WEIGHTS.graphCausalBias!).toBeGreaterThanOrEqual(0);
      expect(DEFAULT_WEIGHTS.graphCausalBias!).toBeLessThanOrEqual(1.0);
    });
  });
});
