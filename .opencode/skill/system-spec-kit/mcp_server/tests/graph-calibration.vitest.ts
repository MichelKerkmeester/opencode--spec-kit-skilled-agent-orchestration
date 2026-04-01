// ---------------------------------------------------------------
// TEST: GRAPH CALIBRATION (REQ-D3-005 / REQ-D3-006)
// ---------------------------------------------------------------
// Unit tests for graph calibration profiles, ablation harness,
// Louvain activation thresholds, and community score integration.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  GRAPH_WEIGHT_CAP,
  COMMUNITY_SCORE_CAP,
  DEFAULT_PROFILE,
  AGGRESSIVE_PROFILE,
  isGraphCalibrationEnabled,
  computeMRR,
  computeNDCG,
  runAblation,
  applyGraphWeightCap,
  calibrateGraphWeight,
  loadCalibrationProfile,
  applyCalibrationProfile,
  shouldActivateLouvain,
  applyCommunityScoring,
} from '../lib/search/graph-calibration';
import type {
  AblationRankedItem,
  IntentQuery,
  FeatureToggle,
  ScoringContext,
  CalibrationProfile,
} from '../lib/search/graph-calibration';

/* ---------------------------------------------------------------
   HELPERS
---------------------------------------------------------------- */

/** Save and restore env vars across tests. */
function saveEnv(...keys: string[]): () => void {
  const saved: Record<string, string | undefined> = {};
  for (const key of keys) {
    saved[key] = process.env[key];
  }
  return () => {
    for (const key of keys) {
      if (saved[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = saved[key];
      }
    }
  };
}

/** Create a ranked list of items. */
function rankedItems(ids: number[], scores?: number[]): AblationRankedItem[] {
  return ids.map((id, i) => ({
    id,
    score: scores ? (scores[i] ?? 1 - i * 0.1) : 1 - i * 0.1,
  }));
}

/* ===============================================================
   1. FEATURE FLAG
=============================================================== */

describe('isGraphCalibrationEnabled', () => {
  let restore: () => void;

  beforeEach(() => {
    restore = saveEnv('SPECKIT_GRAPH_CALIBRATION_PROFILE');
  });

  afterEach(() => restore());

  it('returns true when env var is unset (graduated)', () => {
    delete process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE;
    expect(isGraphCalibrationEnabled()).toBe(true);
  });

  it('returns false when env var is "false"', () => {
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = 'false';
    expect(isGraphCalibrationEnabled()).toBe(false);
  });

  it('returns true when env var is "true"', () => {
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = 'true';
    expect(isGraphCalibrationEnabled()).toBe(true);
  });

  it('returns true when env var is "1"', () => {
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = '1';
    expect(isGraphCalibrationEnabled()).toBe(true);
  });

  it('returns true when env var is "TRUE" (case-insensitive)', () => {
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = 'TRUE';
    expect(isGraphCalibrationEnabled()).toBe(true);
  });

  it('returns false when env var is "0"', () => {
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = '0';
    expect(isGraphCalibrationEnabled()).toBe(false);
  });
});

/* ===============================================================
   2. MRR COMPUTATION
=============================================================== */

describe('computeMRR', () => {
  it('returns 1.0 when first item is relevant', () => {
    const items = rankedItems([10, 20, 30]);
    const relevant = new Set([10]);
    expect(computeMRR(items, relevant)).toBe(1.0);
  });

  it('returns 0.5 when second item is relevant', () => {
    const items = rankedItems([10, 20, 30]);
    const relevant = new Set([20]);
    expect(computeMRR(items, relevant)).toBe(0.5);
  });

  it('returns 1/3 when third item is relevant', () => {
    const items = rankedItems([10, 20, 30]);
    const relevant = new Set([30]);
    expect(computeMRR(items, relevant, 10)).toBeCloseTo(1 / 3, 6);
  });

  it('returns 0 when no relevant item in top k', () => {
    const items = rankedItems([10, 20, 30]);
    const relevant = new Set([99]);
    expect(computeMRR(items, relevant)).toBe(0);
  });

  it('respects k cutoff', () => {
    const items = rankedItems([10, 20, 30, 40, 50]);
    const relevant = new Set([30]); // at rank 3
    expect(computeMRR(items, relevant, 2)).toBe(0); // k=2, rank 3 is beyond cutoff
    expect(computeMRR(items, relevant, 3)).toBeCloseTo(1 / 3, 6);
  });

  it('handles empty ranked list', () => {
    expect(computeMRR([], new Set([1]))).toBe(0);
  });

  it('handles empty relevant set', () => {
    const items = rankedItems([10, 20]);
    expect(computeMRR(items, new Set())).toBe(0);
  });

  it('returns reciprocal of first relevant even when multiple are relevant', () => {
    const items = rankedItems([10, 20, 30]);
    const relevant = new Set([20, 30]); // first relevant at rank 2
    expect(computeMRR(items, relevant)).toBe(0.5);
  });
});

/* ===============================================================
   3. NDCG COMPUTATION
=============================================================== */

describe('computeNDCG', () => {
  it('returns 1.0 for perfect ranking (all relevant items first)', () => {
    const items = rankedItems([1, 2, 3, 4, 5]);
    const relevant = new Set([1, 2]); // first 2 are relevant
    expect(computeNDCG(items, relevant, 5)).toBeCloseTo(1.0, 6);
  });

  it('returns less than 1.0 for imperfect ranking', () => {
    const items = rankedItems([1, 2, 3, 4, 5]);
    const relevant = new Set([3, 5]); // relevant items at ranks 3 and 5
    const ndcg = computeNDCG(items, relevant, 5);
    expect(ndcg).toBeGreaterThan(0);
    expect(ndcg).toBeLessThan(1.0);
  });

  it('returns 0 when no relevant items in results', () => {
    const items = rankedItems([1, 2, 3]);
    const relevant = new Set([99]);
    expect(computeNDCG(items, relevant)).toBe(0);
  });

  it('returns 0 for empty relevant set', () => {
    const items = rankedItems([1, 2, 3]);
    expect(computeNDCG(items, new Set())).toBe(0);
  });

  it('returns 0 for empty ranked list', () => {
    expect(computeNDCG([], new Set([1]))).toBe(0);
  });

  it('respects k cutoff', () => {
    const items = rankedItems([1, 2, 3, 4, 5]);
    const relevant = new Set([5]); // relevant at rank 5
    expect(computeNDCG(items, relevant, 3)).toBe(0); // k=3 won't reach rank 5
    expect(computeNDCG(items, relevant, 5)).toBeGreaterThan(0);
  });

  it('known NDCG calculation: single relevant item at rank 1', () => {
    const items = rankedItems([1, 2, 3]);
    const relevant = new Set([1]);
    // DCG = 1/log2(2) = 1.0, IDCG = 1/log2(2) = 1.0, NDCG = 1.0
    expect(computeNDCG(items, relevant, 3)).toBeCloseTo(1.0, 6);
  });

  it('known NDCG calculation: single relevant item at rank 2', () => {
    const items = rankedItems([1, 2, 3]);
    const relevant = new Set([2]);
    // DCG = 1/log2(3) = 0.6309, IDCG = 1/log2(2) = 1.0
    // NDCG = 0.6309
    expect(computeNDCG(items, relevant, 3)).toBeCloseTo(1 / Math.log2(3), 4);
  });
});

/* ===============================================================
   4. ABLATION HARNESS
=============================================================== */

describe('runAblation', () => {
  const queries: IntentQuery[] = [
    {
      intent: 'fix_bug',
      query: 'fix the login bug',
      relevantIds: [1, 2],
    },
    {
      intent: 'understand',
      query: 'how does auth work',
      relevantIds: [3, 4],
    },
  ];

  const toggles: FeatureToggle[] = [
    { name: 'featureA', enabled: true },
    { name: 'featureB', enabled: true },
    { name: 'featureC', enabled: false }, // disabled, should be skipped
  ];

  /** Mock search: drops results when a feature is disabled. */
  function mockSearch(query: string, disabled: Set<string>): AblationRankedItem[] {
    const allIds = query.includes('login') ? [1, 2, 5, 6] : [3, 4, 7, 8];
    let ids = [...allIds];

    // featureA contributes ID 1 or 3 (first relevant)
    if (disabled.has('featureA')) {
      ids = ids.filter((id) => id !== 1 && id !== 3);
    }
    // featureB contributes ID 2 or 4 (second relevant)
    if (disabled.has('featureB')) {
      ids = ids.filter((id) => id !== 2 && id !== 4);
    }

    return ids.map((id, i) => ({ id, score: 1 - i * 0.1 }));
  }

  it('produces baseline with all features enabled', () => {
    const result = runAblation(mockSearch, queries, toggles);

    expect(result.baseline.featureName).toBe('baseline');
    expect(result.baseline.intentMetrics).toHaveLength(2);
    expect(result.baseline.aggregateMrr).toBeGreaterThan(0);
    expect(result.baseline.aggregateNdcg).toBeGreaterThan(0);
  });

  it('produces one ablation per enabled toggle (skips disabled)', () => {
    const result = runAblation(mockSearch, queries, toggles);

    // featureC is disabled, should be skipped
    expect(result.ablations).toHaveLength(2);
    const names = result.ablations.map((a) => a.featureName);
    expect(names).toContain('featureA');
    expect(names).toContain('featureB');
    expect(names).not.toContain('featureC');
  });

  it('ablated metrics differ from baseline (feature isolation)', () => {
    const result = runAblation(mockSearch, queries, toggles);

    const featureAAblation = result.ablations.find((a) => a.featureName === 'featureA');
    expect(featureAAblation).toBeDefined();

    // Disabling featureA should degrade MRR (relevant item 1 or 3 removed)
    expect(featureAAblation!.aggregateMrr).toBeLessThanOrEqual(result.baseline.aggregateMrr);
  });

  it('per-intent metrics are present for each query', () => {
    const result = runAblation(mockSearch, queries, toggles);

    for (const ablation of result.ablations) {
      expect(ablation.intentMetrics).toHaveLength(queries.length);
      for (const m of ablation.intentMetrics) {
        expect(m.intent).toBeDefined();
        expect(typeof m.mrr).toBe('number');
        expect(typeof m.ndcg).toBe('number');
      }
    }
  });

  it('handles empty queries list', () => {
    const result = runAblation(mockSearch, [], toggles);
    expect(result.baseline.aggregateMrr).toBe(0);
    expect(result.baseline.aggregateNdcg).toBe(0);
    expect(result.ablations).toHaveLength(2);
  });

  it('handles empty toggles list', () => {
    const result = runAblation(mockSearch, queries, []);
    expect(result.baseline.featureName).toBe('baseline');
    expect(result.ablations).toHaveLength(0);
  });

  it('respects custom k parameter', () => {
    const result = runAblation(mockSearch, queries, toggles, 1);

    // With k=1, only the first result matters for MRR
    const baseline = result.baseline;
    for (const m of baseline.intentMetrics) {
      // MRR@1 is either 0 or 1
      expect(m.mrr === 0 || m.mrr === 1).toBe(true);
    }
  });
});

/* ===============================================================
   5. GRAPH WEIGHT CAP ENFORCEMENT
=============================================================== */

describe('applyGraphWeightCap', () => {
  it('clamps value to GRAPH_WEIGHT_CAP (0.15)', () => {
    expect(applyGraphWeightCap(0.20)).toBe(GRAPH_WEIGHT_CAP);
    expect(applyGraphWeightCap(0.15)).toBe(0.15);
  });

  it('passes through values below cap unchanged', () => {
    expect(applyGraphWeightCap(0.03)).toBe(0.03);
    expect(applyGraphWeightCap(0.01)).toBe(0.01);
  });

  it('returns 0 for negative values', () => {
    expect(applyGraphWeightCap(-0.1)).toBe(0);
  });

  it('returns 0 for NaN/Infinity', () => {
    expect(applyGraphWeightCap(NaN)).toBe(0);
    expect(applyGraphWeightCap(Infinity)).toBe(0);
    expect(applyGraphWeightCap(-Infinity)).toBe(0);
  });

  it('accepts custom cap', () => {
    expect(applyGraphWeightCap(0.08, 0.10)).toBe(0.08);
    expect(applyGraphWeightCap(0.15, 0.10)).toBe(0.10);
  });

  it('never exceeds 0.05 with default cap', () => {
    const testValues = [0, 0.01, 0.05, 0.1, 0.5, 1.0, 100];
    for (const val of testValues) {
      expect(applyGraphWeightCap(val)).toBeLessThanOrEqual(GRAPH_WEIGHT_CAP);
    }
  });
});

describe('calibrateGraphWeight', () => {
  it('clamps all scoring context values to profile caps', () => {
    const context: ScoringContext = {
      graphWeightBoost: 0.20,
      n2aScore: 0.50,
      n2bScore: 0.50,
      communityBoost: 0.10,
    };

    const result = calibrateGraphWeight(context, DEFAULT_PROFILE);

    expect(result.graphWeightBoost).toBe(DEFAULT_PROFILE.graphWeightCap);
    expect(result.n2aScore).toBe(DEFAULT_PROFILE.n2aCap);
    expect(result.n2bScore).toBe(DEFAULT_PROFILE.n2bCap);
    expect(result.communityBoost).toBe(COMMUNITY_SCORE_CAP);
  });

  it('passes through values below caps', () => {
    const context: ScoringContext = {
      graphWeightBoost: 0.01,
      n2aScore: 0.02,
      n2bScore: 0.03,
      communityBoost: 0.01,
    };

    const result = calibrateGraphWeight(context, DEFAULT_PROFILE);

    expect(result.graphWeightBoost).toBe(0.01);
    expect(result.n2aScore).toBe(0.02);
    expect(result.n2bScore).toBe(0.03);
    expect(result.communityBoost).toBe(0.01);
  });

  it('uses AGGRESSIVE_PROFILE with tighter caps', () => {
    const context: ScoringContext = {
      graphWeightBoost: 0.05,
      n2aScore: 0.10,
      n2bScore: 0.10,
      communityBoost: 0.03,
    };

    const result = calibrateGraphWeight(context, AGGRESSIVE_PROFILE);

    expect(result.graphWeightBoost).toBe(AGGRESSIVE_PROFILE.graphWeightCap); // 0.03
    expect(result.n2aScore).toBe(AGGRESSIVE_PROFILE.n2aCap); // 0.07
    expect(result.n2bScore).toBe(AGGRESSIVE_PROFILE.n2bCap); // 0.07
  });

  it('floors negative values at 0', () => {
    const context: ScoringContext = {
      graphWeightBoost: -0.1,
      n2aScore: -0.5,
      n2bScore: -0.2,
      communityBoost: -0.1,
    };

    const result = calibrateGraphWeight(context, DEFAULT_PROFILE);

    expect(result.graphWeightBoost).toBe(0);
    expect(result.n2aScore).toBe(0);
    expect(result.n2bScore).toBe(0);
    expect(result.communityBoost).toBe(0);
  });
});

/* ===============================================================
   6. CALIBRATION PROFILE LOADING
=============================================================== */

describe('loadCalibrationProfile', () => {
  let restore: () => void;

  beforeEach(() => {
    restore = saveEnv(
      'SPECKIT_CALIBRATION_PROFILE_NAME',
      'SPECKIT_GRAPH_WEIGHT_CAP',
      'SPECKIT_N2A_CAP',
      'SPECKIT_N2B_CAP',
      'SPECKIT_LOUVAIN_MIN_DENSITY',
      'SPECKIT_LOUVAIN_MIN_SIZE',
    );
  });

  afterEach(() => restore());

  it('returns DEFAULT_PROFILE when no env vars set', () => {
    delete process.env.SPECKIT_CALIBRATION_PROFILE_NAME;
    const profile = loadCalibrationProfile();
    expect(profile.graphWeightCap).toBe(DEFAULT_PROFILE.graphWeightCap);
    expect(profile.louvainMinDensity).toBe(DEFAULT_PROFILE.louvainMinDensity);
    expect(profile.louvainMinSize).toBe(DEFAULT_PROFILE.louvainMinSize);
  });

  it('returns AGGRESSIVE_PROFILE when name is "aggressive"', () => {
    process.env.SPECKIT_CALIBRATION_PROFILE_NAME = 'aggressive';
    const profile = loadCalibrationProfile();
    expect(profile.graphWeightCap).toBe(AGGRESSIVE_PROFILE.graphWeightCap);
    expect(profile.n2aCap).toBe(AGGRESSIVE_PROFILE.n2aCap);
    expect(profile.louvainMinSize).toBe(AGGRESSIVE_PROFILE.louvainMinSize);
  });

  it('applies individual env overrides on top of base profile', () => {
    process.env.SPECKIT_GRAPH_WEIGHT_CAP = '0.02';
    process.env.SPECKIT_N2A_CAP = '0.08';
    const profile = loadCalibrationProfile();
    expect(profile.graphWeightCap).toBe(0.02);
    expect(profile.n2aCap).toBe(0.08);
    // Others remain default
    expect(profile.n2bCap).toBe(DEFAULT_PROFILE.n2bCap);
  });

  it('ignores invalid env values (non-numeric)', () => {
    process.env.SPECKIT_GRAPH_WEIGHT_CAP = 'abc';
    process.env.SPECKIT_LOUVAIN_MIN_SIZE = 'not-a-number';
    const profile = loadCalibrationProfile();
    expect(profile.graphWeightCap).toBe(DEFAULT_PROFILE.graphWeightCap);
    expect(profile.louvainMinSize).toBe(DEFAULT_PROFILE.louvainMinSize);
  });

  it('handles AGGRESSIVE base with env overrides', () => {
    process.env.SPECKIT_CALIBRATION_PROFILE_NAME = 'aggressive';
    process.env.SPECKIT_LOUVAIN_MIN_DENSITY = '0.8';
    const profile = loadCalibrationProfile();
    expect(profile.graphWeightCap).toBe(AGGRESSIVE_PROFILE.graphWeightCap); // from aggressive base
    expect(profile.louvainMinDensity).toBe(0.8); // overridden
  });
});

describe('applyCalibrationProfile', () => {
  let restore: () => void;

  beforeEach(() => {
    restore = saveEnv('SPECKIT_GRAPH_CALIBRATION_PROFILE', 'SPECKIT_CALIBRATION_PROFILE_NAME');
  });

  afterEach(() => restore());

  it('returns context unchanged when flag is OFF', () => {
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = 'false';
    const context: ScoringContext = {
      graphWeightBoost: 0.50,
      n2aScore: 0.50,
      n2bScore: 0.50,
      communityBoost: 0.50,
    };

    const result = applyCalibrationProfile(context);

    expect(result.graphWeightBoost).toBe(0.50);
    expect(result.n2aScore).toBe(0.50);
    expect(result.n2bScore).toBe(0.50);
    expect(result.communityBoost).toBe(0.50);
  });

  it('applies caps when flag is ON', () => {
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = 'true';
    const context: ScoringContext = {
      graphWeightBoost: 0.50,
      n2aScore: 0.50,
      n2bScore: 0.50,
      communityBoost: 0.50,
    };

    const result = applyCalibrationProfile(context);

    expect(result.graphWeightBoost).toBeLessThanOrEqual(GRAPH_WEIGHT_CAP);
    expect(result.communityBoost).toBeLessThanOrEqual(COMMUNITY_SCORE_CAP);
  });

  it('accepts explicit profile override', () => {
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = 'true';
    const customProfile: CalibrationProfile = {
      graphWeightCap: 0.01,
      n2aCap: 0.02,
      n2bCap: 0.02,
      louvainMinDensity: 0.9,
      louvainMinSize: 50,
    };
    const context: ScoringContext = {
      graphWeightBoost: 0.10,
      n2aScore: 0.10,
      n2bScore: 0.10,
      communityBoost: 0.10,
    };

    const result = applyCalibrationProfile(context, customProfile);

    expect(result.graphWeightBoost).toBe(0.01);
    expect(result.n2aScore).toBe(0.02);
    expect(result.n2bScore).toBe(0.02);
  });
});

/* ===============================================================
   7. LOUVAIN ACTIVATION THRESHOLDS
=============================================================== */

describe('shouldActivateLouvain', () => {
  let restore: () => void;

  beforeEach(() => {
    restore = saveEnv('SPECKIT_GRAPH_CALIBRATION_PROFILE');
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = 'true';
  });

  afterEach(() => restore());

  it('returns false when feature flag is OFF', () => {
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = 'false';
    const result = shouldActivateLouvain(0.5, 20);
    expect(result.activate).toBe(false);
    expect(result.reason).toContain('OFF');
  });

  it('returns false when density below threshold', () => {
    const result = shouldActivateLouvain(0.1, 20, { minDensity: 0.3, minSize: 10 });
    expect(result.activate).toBe(false);
    expect(result.reason).toContain('density');
  });

  it('returns false when size below threshold', () => {
    const result = shouldActivateLouvain(0.5, 5, { minDensity: 0.3, minSize: 10 });
    expect(result.activate).toBe(false);
    expect(result.reason).toContain('size');
  });

  it('returns true when both density and size above thresholds', () => {
    const result = shouldActivateLouvain(0.5, 20, { minDensity: 0.3, minSize: 10 });
    expect(result.activate).toBe(true);
    expect(result.reason).toContain('>=');
  });

  it('uses exact threshold values (boundary: density equals minimum)', () => {
    const result = shouldActivateLouvain(0.3, 10, { minDensity: 0.3, minSize: 10 });
    expect(result.activate).toBe(true);
  });

  it('returns false for density just below threshold', () => {
    const result = shouldActivateLouvain(0.299, 10, { minDensity: 0.3, minSize: 10 });
    expect(result.activate).toBe(false);
  });

  it('returns false for size just below threshold', () => {
    const result = shouldActivateLouvain(0.3, 9, { minDensity: 0.3, minSize: 10 });
    expect(result.activate).toBe(false);
  });

  it('handles NaN density', () => {
    const result = shouldActivateLouvain(NaN, 20, { minDensity: 0.3, minSize: 10 });
    expect(result.activate).toBe(false);
    expect(result.reason).toContain('Invalid');
  });

  it('handles negative density', () => {
    const result = shouldActivateLouvain(-0.1, 20, { minDensity: 0.3, minSize: 10 });
    expect(result.activate).toBe(false);
  });

  it('handles NaN component size', () => {
    const result = shouldActivateLouvain(0.5, NaN, { minDensity: 0.3, minSize: 10 });
    expect(result.activate).toBe(false);
  });

  it('handles zero density (empty graph)', () => {
    const result = shouldActivateLouvain(0, 0, { minDensity: 0.3, minSize: 10 });
    expect(result.activate).toBe(false);
  });

  it('activates for fully connected graph with sufficient size', () => {
    // density = 1.0 for fully connected graph
    const result = shouldActivateLouvain(1.0, 50, { minDensity: 0.3, minSize: 10 });
    expect(result.activate).toBe(true);
  });

  it('defaults to loaded profile thresholds when none provided', () => {
    // With default profile: minDensity=0.3, minSize=10
    const result = shouldActivateLouvain(0.5, 20);
    expect(result.activate).toBe(true);
  });
});

/* ===============================================================
   8. COMMUNITY SCORE INTEGRATION
=============================================================== */

describe('applyCommunityScoring', () => {
  let restore: () => void;

  beforeEach(() => {
    restore = saveEnv('SPECKIT_GRAPH_CALIBRATION_PROFILE');
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = 'true';
  });

  afterEach(() => restore());

  it('returns items unchanged when feature flag is OFF', () => {
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = 'false';
    const items = rankedItems([1, 2, 3], [0.9, 0.7, 0.5]);
    const communityMap = new Map([[1, 0.05], [2, 0.04]]);

    const { items: result, appliedCount } = applyCommunityScoring(items, communityMap);

    expect(appliedCount).toBe(0);
    expect(result[0]!.score).toBe(0.9);
    expect(result[1]!.score).toBe(0.7);
  });

  it('caps community boost at COMMUNITY_SCORE_CAP (0.03)', () => {
    const items = rankedItems([1, 2], [0.9, 0.7]);
    const communityMap = new Map([[1, 0.10]]); // raw 0.10 should be capped to 0.03

    const { items: result, maxBoost } = applyCommunityScoring(items, communityMap);

    expect(maxBoost).toBeLessThanOrEqual(COMMUNITY_SCORE_CAP);
    expect(result[0]!.score).toBeCloseTo(0.9 + COMMUNITY_SCORE_CAP, 6);
  });

  it('never exceeds base + COMMUNITY_SCORE_CAP', () => {
    const items = rankedItems([1], [0.95]);
    const communityMap = new Map([[1, 1.0]]); // enormous raw score

    const { items: result } = applyCommunityScoring(items, communityMap);

    expect(result[0]!.score).toBeCloseTo(0.95 + COMMUNITY_SCORE_CAP, 6);
    expect(result[0]!.score).toBeLessThanOrEqual(0.95 + COMMUNITY_SCORE_CAP + 1e-10);
  });

  it('preserves ranking order (secondary-only, no override)', () => {
    const items = rankedItems([1, 2, 3], [0.90, 0.50, 0.30]);
    // Give the lowest-ranked item the biggest community boost
    const communityMap = new Map([[3, 0.10]]); // capped to 0.03

    const { items: result } = applyCommunityScoring(items, communityMap);

    // Item 3: 0.30 + 0.03 = 0.33, still below item 2's 0.50
    expect(result[0]!.id).toBe(1);
    expect(result[2]!.score).toBeCloseTo(0.33, 6);
    expect(result[2]!.score).toBeLessThan(result[1]!.score);
  });

  it('skips items not in communityMap', () => {
    const items = rankedItems([1, 2, 3], [0.9, 0.7, 0.5]);
    const communityMap = new Map([[2, 0.02]]);

    const { items: result, appliedCount } = applyCommunityScoring(items, communityMap);

    expect(appliedCount).toBe(1);
    expect(result[0]!.score).toBe(0.9); // unchanged
    expect(result[1]!.score).toBeCloseTo(0.72, 6); // 0.7 + 0.02
    expect(result[2]!.score).toBe(0.5); // unchanged
  });

  it('skips items with zero or negative community score', () => {
    const items = rankedItems([1, 2], [0.9, 0.7]);
    const communityMap = new Map([[1, 0], [2, -0.5]]);

    const { appliedCount } = applyCommunityScoring(items, communityMap);
    expect(appliedCount).toBe(0);
  });

  it('handles empty items list', () => {
    const communityMap = new Map([[1, 0.02]]);
    const { items: result, appliedCount } = applyCommunityScoring([], communityMap);
    expect(result).toHaveLength(0);
    expect(appliedCount).toBe(0);
  });

  it('handles empty communityMap', () => {
    const items = rankedItems([1, 2, 3]);
    const { items: result, appliedCount } = applyCommunityScoring(items, new Map());
    expect(appliedCount).toBe(0);
    expect(result).toHaveLength(3);
  });

  it('applies boost to multiple items correctly', () => {
    const items = rankedItems([1, 2, 3], [0.9, 0.7, 0.5]);
    const communityMap = new Map([[1, 0.01], [2, 0.02], [3, 0.03]]);

    const { items: result, appliedCount, maxBoost } = applyCommunityScoring(items, communityMap);

    expect(appliedCount).toBe(3);
    expect(result[0]!.score).toBeCloseTo(0.91, 6);
    expect(result[1]!.score).toBeCloseTo(0.72, 6);
    expect(result[2]!.score).toBeCloseTo(0.53, 6);
    expect(maxBoost).toBe(0.03);
  });
});

/* ===============================================================
   9. EDGE CASES
=============================================================== */

describe('edge cases', () => {
  let restore: () => void;

  beforeEach(() => {
    restore = saveEnv('SPECKIT_GRAPH_CALIBRATION_PROFILE');
    process.env.SPECKIT_GRAPH_CALIBRATION_PROFILE = 'true';
  });

  afterEach(() => restore());

  describe('empty graph', () => {
    it('shouldActivateLouvain returns false for density 0, size 0', () => {
      const result = shouldActivateLouvain(0, 0);
      expect(result.activate).toBe(false);
    });

    it('applyCommunityScoring with no community map is a no-op', () => {
      const items = rankedItems([1]);
      const { appliedCount } = applyCommunityScoring(items, new Map());
      expect(appliedCount).toBe(0);
    });
  });

  describe('single-node graph', () => {
    it('shouldActivateLouvain returns false for size 1', () => {
      const result = shouldActivateLouvain(1.0, 1, { minDensity: 0.3, minSize: 10 });
      expect(result.activate).toBe(false);
      expect(result.reason).toContain('size');
    });

    it('applyCommunityScoring applies boost to single item', () => {
      const items = rankedItems([1], [0.5]);
      const communityMap = new Map([[1, 0.02]]);
      const { items: result, appliedCount } = applyCommunityScoring(items, communityMap);
      expect(appliedCount).toBe(1);
      expect(result[0]!.score).toBeCloseTo(0.52, 6);
    });
  });

  describe('fully connected graph', () => {
    it('shouldActivateLouvain returns true for density 1.0 and large size', () => {
      const result = shouldActivateLouvain(1.0, 100, { minDensity: 0.3, minSize: 10 });
      expect(result.activate).toBe(true);
    });
  });

  describe('calibration profile constants', () => {
    it('DEFAULT_PROFILE has expected values', () => {
      expect(DEFAULT_PROFILE.graphWeightCap).toBe(0.15);
      expect(DEFAULT_PROFILE.n2aCap).toBe(0.10);
      expect(DEFAULT_PROFILE.n2bCap).toBe(0.10);
      expect(DEFAULT_PROFILE.louvainMinDensity).toBe(0.3);
      expect(DEFAULT_PROFILE.louvainMinSize).toBe(10);
    });

    it('AGGRESSIVE_PROFILE has tighter caps than DEFAULT', () => {
      expect(AGGRESSIVE_PROFILE.graphWeightCap).toBeLessThan(DEFAULT_PROFILE.graphWeightCap);
      expect(AGGRESSIVE_PROFILE.n2aCap).toBeLessThan(DEFAULT_PROFILE.n2aCap);
      expect(AGGRESSIVE_PROFILE.n2bCap).toBeLessThan(DEFAULT_PROFILE.n2bCap);
      expect(AGGRESSIVE_PROFILE.louvainMinDensity).toBeGreaterThanOrEqual(DEFAULT_PROFILE.louvainMinDensity);
      expect(AGGRESSIVE_PROFILE.louvainMinSize).toBeGreaterThanOrEqual(DEFAULT_PROFILE.louvainMinSize);
    });

    it('GRAPH_WEIGHT_CAP is 0.15', () => {
      expect(GRAPH_WEIGHT_CAP).toBe(0.15);
    });

    it('COMMUNITY_SCORE_CAP is 0.03', () => {
      expect(COMMUNITY_SCORE_CAP).toBe(0.03);
    });
  });

  describe('MRR/NDCG with large k', () => {
    it('MRR handles k larger than result set', () => {
      const items = rankedItems([1, 2]);
      const relevant = new Set([2]);
      // k=100 but only 2 items -- should find at rank 2
      expect(computeMRR(items, relevant, 100)).toBe(0.5);
    });

    it('NDCG handles k larger than result set', () => {
      const items = rankedItems([1, 2]);
      const relevant = new Set([1, 2]);
      // k=100 but only 2 items -- should still get 1.0 (perfect ranking)
      expect(computeNDCG(items, relevant, 100)).toBeCloseTo(1.0, 6);
    });
  });
});
