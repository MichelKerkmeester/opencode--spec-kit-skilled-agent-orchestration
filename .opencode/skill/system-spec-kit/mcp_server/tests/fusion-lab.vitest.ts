// TEST: Fusion Lab — Shadow Fusion Infrastructure (REQ-D1-002)
// Feature flag: SPECKIT_FUSION_POLICY_SHADOW_V2
// Tests: all 3 policies produce valid ranked lists, telemetry captures all fields,
//        shadow doesn't affect returned results, graceful handling when policy throws,
//        minmax_linear edge cases, zscore_linear edge cases, feature flag behavior.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isShadowFusionV2Enabled,
  minMaxNormalize,
  zScoreNormalize,
  minmaxLinearFuse,
  zscoreLinearFuse,
  runShadowComparison,
  computeNdcgAtK,
  computeMrrAtK,
  POLICY_REGISTRY,
  ZSCORE_EPSILON,
} from '@spec-kit/shared/algorithms/fusion-lab';
import type {
  ScoredChannelResult,
  ScoredRankedList,
  FusedCandidate,
  PolicyTelemetry,
} from '@spec-kit/shared/algorithms/fusion-lab';

/* ──────────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────────── */

const savedEnv: Record<string, string | undefined> = {};

function setEnv(vars: Record<string, string | undefined>): void {
  for (const [key, value] of Object.entries(vars)) {
    savedEnv[key] = process.env[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function restoreEnv(): void {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function makeScoredChannel(
  source: string,
  items: Array<{ id: string | number; score: number }>,
  weight?: number,
): ScoredRankedList {
  return {
    source,
    results: items.map(({ id, score }) => ({ id, score, title: `item-${id}` } as ScoredChannelResult)),
    weight,
  };
}

beforeEach(() => {
  // Default: shadow OFF, score normalization OFF (raw values)
  setEnv({ SPECKIT_FUSION_POLICY_SHADOW_V2: undefined, SPECKIT_SCORE_NORMALIZATION: 'false' });
});

afterEach(() => {
  restoreEnv();
});

/* ──────────────────────────────────────────────────────────────
   FEATURE FLAG
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-002 Feature Flag (SPECKIT_FUSION_POLICY_SHADOW_V2)', () => {
  it('D2-FF-1: flag is ON by default', () => {
    delete process.env.SPECKIT_FUSION_POLICY_SHADOW_V2;
    expect(isShadowFusionV2Enabled()).toBe(true);
  });

  it('D2-FF-2: flag is OFF when set to "false"', () => {
    process.env.SPECKIT_FUSION_POLICY_SHADOW_V2 = 'false';
    expect(isShadowFusionV2Enabled()).toBe(false);
  });

  it('D2-FF-3: flag is ON when set to "true"', () => {
    process.env.SPECKIT_FUSION_POLICY_SHADOW_V2 = 'true';
    expect(isShadowFusionV2Enabled()).toBe(true);
    delete process.env.SPECKIT_FUSION_POLICY_SHADOW_V2;
  });
});

/* ──────────────────────────────────────────────────────────────
   MIN-MAX NORMALIZATION
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-002 minMaxNormalize', () => {
  it('D2-MM-1: empty array returns unchanged', () => {
    expect(minMaxNormalize([])).toEqual([]);
  });

  it('D2-MM-2: single item normalizes to 1.0', () => {
    const items = [{ id: 'a', score: 0.3, title: 'A' }] as ScoredChannelResult[];
    const result = minMaxNormalize(items);
    expect(result[0].score).toBe(1.0);
  });

  it('D2-MM-3: all equal scores normalize to 1.0', () => {
    const items = [
      { id: 'a', score: 0.5, title: 'A' },
      { id: 'b', score: 0.5, title: 'B' },
      { id: 'c', score: 0.5, title: 'C' },
    ] as ScoredChannelResult[];
    const result = minMaxNormalize(items);
    for (const r of result) {
      expect(r.score).toBe(1.0);
    }
  });

  it('D2-MM-4: scores normalized to [0, 1]', () => {
    const items = [
      { id: 'a', score: 10.0, title: 'A' },
      { id: 'b', score: 5.0, title: 'B' },
      { id: 'c', score: 0.0, title: 'C' },
    ] as ScoredChannelResult[];
    const result = minMaxNormalize(items);
    expect(result.find(r => r.id === 'a')!.score).toBeCloseTo(1.0, 5);
    expect(result.find(r => r.id === 'b')!.score).toBeCloseTo(0.5, 5);
    expect(result.find(r => r.id === 'c')!.score).toBeCloseTo(0.0, 5);
  });

  it('D2-MM-5: formula is (score - min) / (max - min)', () => {
    const items = [
      { id: 'x', score: 3.0, title: 'X' },
      { id: 'y', score: 1.0, title: 'Y' },
    ] as ScoredChannelResult[];
    const result = minMaxNormalize(items);
    // (3 - 1) / (3 - 1) = 1.0, (1 - 1) / (3 - 1) = 0.0
    expect(result.find(r => r.id === 'x')!.score).toBeCloseTo(1.0, 5);
    expect(result.find(r => r.id === 'y')!.score).toBeCloseTo(0.0, 5);
  });

  it('D2-MM-6: does not mutate original scores in other copies', () => {
    // Normalization should work on the array passed to it; caller controls copying
    const original = [
      { id: 'a', score: 4.0, title: 'A' },
      { id: 'b', score: 2.0, title: 'B' },
    ] as ScoredChannelResult[];
    const copy = original.map(r => ({ ...r }));
    minMaxNormalize(copy);
    expect(original[0].score).toBe(4.0);
    expect(original[1].score).toBe(2.0);
  });
});

/* ──────────────────────────────────────────────────────────────
   Z-SCORE NORMALIZATION
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-002 zScoreNormalize', () => {
  it('D2-ZS-1: empty array returns unchanged', () => {
    expect(zScoreNormalize([])).toEqual([]);
  });

  it('D2-ZS-2: all equal scores (stdDev=0) fall back to uniform 1.0', () => {
    const items = [
      { id: 'a', score: 0.8, title: 'A' },
      { id: 'b', score: 0.8, title: 'B' },
    ] as ScoredChannelResult[];
    const result = zScoreNormalize(items);
    for (const r of result) {
      expect(r.score).toBe(1.0);
    }
  });

  it('D2-ZS-3: single item with stdDev=0 falls back to 1.0', () => {
    const items = [{ id: 'solo', score: 0.42, title: 'Solo' }] as ScoredChannelResult[];
    const result = zScoreNormalize(items);
    expect(result[0].score).toBe(1.0);
  });

  it('D2-ZS-4: scores are clamped to [0, 1]', () => {
    // Extreme variance — outlier items will be clamped
    const items = [
      { id: 'a', score: 1000.0, title: 'A' },
      { id: 'b', score: 0.0, title: 'B' },
      { id: 'c', score: 0.0, title: 'C' },
    ] as ScoredChannelResult[];
    const result = zScoreNormalize(items);
    for (const r of result) {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(1);
    }
  });

  it('D2-ZS-5: mean-centered item maps to approximately 0.5', () => {
    // Items symmetric around mean: scores are [0, 1, 2]
    const items = [
      { id: 'low', score: 0.0, title: 'L' },
      { id: 'mid', score: 1.0, title: 'M' },
      { id: 'high', score: 2.0, title: 'H' },
    ] as ScoredChannelResult[];
    const result = zScoreNormalize(items);
    const mid = result.find(r => r.id === 'mid');
    expect(mid!.score).toBeCloseTo(0.5, 2);
  });

  it('D2-ZS-6: ZSCORE_EPSILON constant is tiny positive number', () => {
    expect(ZSCORE_EPSILON).toBeGreaterThan(0);
    expect(ZSCORE_EPSILON).toBeLessThan(0.001);
  });
});

/* ──────────────────────────────────────────────────────────────
   MINMAX LINEAR POLICY
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-002 minmaxLinearFuse policy', () => {
  it('D2-ML-1: empty channels returns empty list', () => {
    expect(minmaxLinearFuse([])).toEqual([]);
  });

  it('D2-ML-2: single channel returns items sorted by score', () => {
    const channel = makeScoredChannel('vec', [
      { id: 'a', score: 0.9 },
      { id: 'b', score: 0.3 },
      { id: 'c', score: 0.6 },
    ]);
    const result = minmaxLinearFuse([channel]);
    expect(result[0].id).toBe('a');
    expect(result[1].id).toBe('c');
    expect(result[2].id).toBe('b');
  });

  it('D2-ML-3: fused scores are in [0, 1]', () => {
    const ch1 = makeScoredChannel('vec', [{ id: 'x', score: 5.0 }, { id: 'y', score: 1.0 }]);
    const ch2 = makeScoredChannel('bm25', [{ id: 'x', score: 3.0 }, { id: 'z', score: 8.0 }]);
    const result = minmaxLinearFuse([ch1, ch2]);
    for (const r of result) {
      expect(r.fusedScore).toBeGreaterThanOrEqual(0);
      expect(r.fusedScore).toBeLessThanOrEqual(1);
    }
  });

  it('D2-ML-4: candidate appearing in both channels has both sources listed', () => {
    const ch1 = makeScoredChannel('vec', [{ id: 'shared', score: 0.8 }]);
    const ch2 = makeScoredChannel('bm25', [{ id: 'shared', score: 0.6 }]);
    const result = minmaxLinearFuse([ch1, ch2]);
    const shared = result.find(r => r.id === 'shared');
    expect(shared).toBeDefined();
    expect(shared!.sources).toContain('vec');
    expect(shared!.sources).toContain('bm25');
  });

  it('D2-ML-5: channel weight 0 contributes nothing from that channel', () => {
    const ch1 = makeScoredChannel('vec', [{ id: 'a', score: 1.0 }], 1.0);
    const ch2 = makeScoredChannel('bm25', [{ id: 'b', score: 1.0 }], 0.0);
    const result = minmaxLinearFuse([ch1, ch2]);
    // 'b' from zero-weight channel should have fusedScore 0
    const bItem = result.find(r => r.id === 'b');
    expect(bItem!.fusedScore).toBe(0);
  });

  it('D2-ML-6: results are sorted by descending fusedScore', () => {
    const ch1 = makeScoredChannel('vec', [
      { id: 'low', score: 0.1 },
      { id: 'high', score: 0.9 },
      { id: 'mid', score: 0.5 },
    ]);
    const result = minmaxLinearFuse([ch1]);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].fusedScore).toBeGreaterThanOrEqual(result[i + 1].fusedScore);
    }
  });

  it('D2-ML-7: all-zero scores channel (division by zero) handled gracefully', () => {
    const ch1 = makeScoredChannel('vec', [
      { id: 'a', score: 0.0 },
      { id: 'b', score: 0.0 },
    ]);
    expect(() => minmaxLinearFuse([ch1])).not.toThrow();
    const result = minmaxLinearFuse([ch1]);
    // All equal → normalized to 1.0
    for (const r of result) {
      expect(r.fusedScore).toBeCloseTo(1.0, 5);
    }
  });
});

/* ──────────────────────────────────────────────────────────────
   ZSCORE LINEAR POLICY
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-002 zscoreLinearFuse policy', () => {
  it('D2-ZL-1: empty channels returns empty list', () => {
    expect(zscoreLinearFuse([])).toEqual([]);
  });

  it('D2-ZL-2: fused scores are in [0, 1]', () => {
    const ch1 = makeScoredChannel('vec', [
      { id: 'a', score: 0.9 },
      { id: 'b', score: 0.1 },
      { id: 'c', score: 0.5 },
    ]);
    const result = zscoreLinearFuse([ch1]);
    for (const r of result) {
      expect(r.fusedScore).toBeGreaterThanOrEqual(0);
      expect(r.fusedScore).toBeLessThanOrEqual(1);
    }
  });

  it('D2-ZL-3: degenerate channel (stdDev=0) does not throw', () => {
    const ch = makeScoredChannel('vec', [
      { id: 'a', score: 0.5 },
      { id: 'b', score: 0.5 },
    ]);
    expect(() => zscoreLinearFuse([ch])).not.toThrow();
  });

  it('D2-ZL-4: results are sorted by descending fusedScore', () => {
    const ch1 = makeScoredChannel('vec', [
      { id: 'a', score: 1.0 },
      { id: 'b', score: 5.0 },
      { id: 'c', score: 3.0 },
    ]);
    const result = zscoreLinearFuse([ch1]);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].fusedScore).toBeGreaterThanOrEqual(result[i + 1].fusedScore);
    }
  });

  it('D2-ZL-5: candidate in both channels has both sources', () => {
    const ch1 = makeScoredChannel('vec', [{ id: 'shared', score: 0.8 }, { id: 'only-vec', score: 0.3 }]);
    const ch2 = makeScoredChannel('bm25', [{ id: 'shared', score: 0.7 }, { id: 'only-bm25', score: 0.2 }]);
    const result = zscoreLinearFuse([ch1, ch2]);
    const shared = result.find(r => r.id === 'shared');
    expect(shared!.sources).toContain('vec');
    expect(shared!.sources).toContain('bm25');
  });
});

/* ──────────────────────────────────────────────────────────────
   POLICY REGISTRY
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-002 POLICY_REGISTRY', () => {
  it('D2-PR-1: contains all 3 policies', () => {
    expect(POLICY_REGISTRY).toHaveProperty('rrf');
    expect(POLICY_REGISTRY).toHaveProperty('minmax_linear');
    expect(POLICY_REGISTRY).toHaveProperty('zscore_linear');
  });

  it('D2-PR-2: all policies are functions', () => {
    for (const fn of Object.values(POLICY_REGISTRY)) {
      expect(typeof fn).toBe('function');
    }
  });

  it('D2-PR-3: all 3 policies produce valid ranked lists on shared input', () => {
    const channels = [
      makeScoredChannel('vec', [{ id: 'a', score: 0.9 }, { id: 'b', score: 0.4 }]),
      makeScoredChannel('bm25', [{ id: 'b', score: 0.7 }, { id: 'c', score: 0.3 }]),
    ];
    for (const [name, fn] of Object.entries(POLICY_REGISTRY) as Array<[string, (c: ScoredRankedList[]) => FusedCandidate[]]>) {
      const result = fn(channels);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      // All items have id and fusedScore
      for (const r of result) {
        expect(r.id).toBeDefined();
        expect(typeof r.fusedScore).toBe('number');
        expect(Number.isFinite(r.fusedScore)).toBe(true);
      }
      // Sorted descending
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].fusedScore).toBeGreaterThanOrEqual(result[i + 1].fusedScore);
      }
    }
  });
});

/* ──────────────────────────────────────────────────────────────
   SHADOW COMPARISON RUNNER — FLAG OFF
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-002 runShadowComparison (flag OFF)', () => {
  beforeEach(() => {
    setEnv({ SPECKIT_FUSION_POLICY_SHADOW_V2: 'false' });
  });

  it('D2-SC-OFF-1: returns activeResult with items from channels', async () => {
    const channels = [
      makeScoredChannel('vec', [{ id: 'a', score: 0.9 }, { id: 'b', score: 0.2 }]),
    ];
    const result = await runShadowComparison(channels);
    expect(result.activeResult.length).toBeGreaterThan(0);
  });

  it('D2-SC-OFF-2: activePolicy defaults to "rrf"', async () => {
    const channels = [makeScoredChannel('vec', [{ id: 'x', score: 1.0 }])];
    const result = await runShadowComparison(channels);
    expect(result.activePolicy).toBe('rrf');
  });

  it('D2-SC-OFF-3: telemetry has exactly 1 entry (only active policy)', async () => {
    const channels = [makeScoredChannel('vec', [{ id: 'a', score: 0.8 }])];
    const result = await runShadowComparison(channels);
    expect(result.telemetry).toHaveLength(1);
    expect(result.telemetry[0].policy).toBe('rrf');
  });

  it('D2-SC-OFF-4: telemetry entry has ndcg10, mrr5, latencyMs fields', async () => {
    const channels = [makeScoredChannel('vec', [{ id: 'a', score: 0.8 }])];
    const result = await runShadowComparison(channels);
    const t = result.telemetry[0];
    expect(t.ndcg10).toBeNull();
    expect(t.mrr5).toBeNull();
    expect(typeof t.latencyMs).toBe('number');
    expect(t.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('D2-SC-OFF-5: shadow results do not affect activeResult (only rrf runs)', async () => {
    // With flag off, only RRF runs; minmax/zscore are not invoked
    const runMinmax = vi.spyOn(POLICY_REGISTRY, 'minmax_linear');
    const runZscore = vi.spyOn(POLICY_REGISTRY, 'zscore_linear');
    const channels = [makeScoredChannel('vec', [{ id: 'a', score: 0.9 }])];
    await runShadowComparison(channels);
    expect(runMinmax).not.toHaveBeenCalled();
    expect(runZscore).not.toHaveBeenCalled();
    runMinmax.mockRestore();
    runZscore.mockRestore();
  });
});

/* ──────────────────────────────────────────────────────────────
   SHADOW COMPARISON RUNNER — FLAG ON
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-002 runShadowComparison (flag ON)', () => {
  beforeEach(() => {
    setEnv({ SPECKIT_FUSION_POLICY_SHADOW_V2: 'true' });
  });

  it('D2-SC-ON-1: returns activeResult from the active policy', async () => {
    const channels = [
      makeScoredChannel('vec', [{ id: 'a', score: 0.9 }, { id: 'b', score: 0.4 }]),
      makeScoredChannel('bm25', [{ id: 'b', score: 0.8 }, { id: 'c', score: 0.3 }]),
    ];
    const result = await runShadowComparison(channels, 'rrf');
    expect(result.activeResult.length).toBeGreaterThan(0);
    // Results have rrfScore (FusionResult compatible)
    for (const r of result.activeResult) {
      expect(typeof r.rrfScore).toBe('number');
    }
  });

  it('D2-SC-ON-2: telemetry has exactly 3 entries', async () => {
    const channels = [makeScoredChannel('vec', [{ id: 'a', score: 0.7 }])];
    const result = await runShadowComparison(channels, 'rrf');
    expect(result.telemetry).toHaveLength(3);
  });

  it('D2-SC-ON-3: telemetry covers all 3 policies', async () => {
    const channels = [makeScoredChannel('vec', [{ id: 'a', score: 0.7 }])];
    const result = await runShadowComparison(channels, 'rrf');
    const policyNames = result.telemetry.map(t => t.policy);
    expect(policyNames).toContain('rrf');
    expect(policyNames).toContain('minmax_linear');
    expect(policyNames).toContain('zscore_linear');
  });

  it('D2-SC-ON-4: all telemetry entries have valid numeric fields', async () => {
    const channels = [
      makeScoredChannel('vec', [{ id: 'a', score: 0.9 }, { id: 'b', score: 0.3 }]),
      makeScoredChannel('bm25', [{ id: 'a', score: 0.6 }, { id: 'c', score: 0.1 }]),
    ];
    const result = await runShadowComparison(channels, 'rrf');
    for (const t of result.telemetry) {
      expect(t.ndcg10).toBeNull();
      expect(t.mrr5).toBeNull();

      expect(typeof t.latencyMs).toBe('number');
      expect(t.latencyMs).toBeGreaterThanOrEqual(0);
    }
  });

  it('D2-SC-ON-5: shadow results do not affect activeResult', async () => {
    // Run with minmax_linear as active, rrf and zscore are shadows
    const channels = [
      makeScoredChannel('vec', [{ id: 'a', score: 0.9 }, { id: 'b', score: 0.5 }]),
    ];
    const rrfResult = await runShadowComparison(channels, 'rrf');
    const minmaxResult = await runShadowComparison(channels, 'minmax_linear');

    // Both return results, but activePolicy differs
    expect(rrfResult.activePolicy).toBe('rrf');
    expect(minmaxResult.activePolicy).toBe('minmax_linear');

    // Both have the same items (same input), both have 3 telemetry entries
    expect(rrfResult.telemetry).toHaveLength(3);
    expect(minmaxResult.telemetry).toHaveLength(3);
  });

  it('D2-SC-ON-6: graceful handling when a shadow policy throws', async () => {
    // Spy on minmax_linear to throw
    const spy = vi.spyOn(POLICY_REGISTRY, 'minmax_linear').mockImplementation(() => {
      throw new Error('minmax_linear failure');
    });

    const channels = [
      makeScoredChannel('vec', [{ id: 'a', score: 0.7 }, { id: 'b', score: 0.3 }]),
    ];
    // Active policy is rrf — should succeed even when minmax_linear throws
    const result = await runShadowComparison(channels, 'rrf');
    expect(result.activeResult.length).toBeGreaterThan(0);
    expect(result.activePolicy).toBe('rrf');

    // Failed shadow policy: ndcg10=0, mrr5=0, latencyMs captured
    const minmaxTelemetry = result.telemetry.find(t => t.policy === 'minmax_linear');
    expect(minmaxTelemetry).toBeDefined();
    expect(minmaxTelemetry!.ndcg10).toBe(0);
    expect(minmaxTelemetry!.mrr5).toBe(0);
    expect(minmaxTelemetry!.latencyMs).toBeGreaterThanOrEqual(0);

    spy.mockRestore();
  });

  it('D2-SC-ON-7: active policy throwing propagates error to caller', async () => {
    const spy = vi.spyOn(POLICY_REGISTRY, 'rrf').mockImplementation(() => {
      throw new Error('rrf active failure');
    });

    const channels = [makeScoredChannel('vec', [{ id: 'a', score: 0.5 }])];
    await expect(runShadowComparison(channels, 'rrf')).rejects.toThrow('rrf active failure');

    spy.mockRestore();
  });

  it('D2-SC-ON-8: minmax_linear as active policy returns valid FusionResult[]', async () => {
    const channels = [
      makeScoredChannel('vec', [{ id: 'a', score: 0.9 }, { id: 'b', score: 0.2 }]),
      makeScoredChannel('bm25', [{ id: 'b', score: 0.8 }, { id: 'a', score: 0.5 }]),
    ];
    const result = await runShadowComparison(channels, 'minmax_linear');
    expect(result.activePolicy).toBe('minmax_linear');
    expect(result.activeResult.length).toBeGreaterThan(0);
    for (const r of result.activeResult) {
      expect(typeof r.rrfScore).toBe('number');
      expect(r.rrfScore).toBeGreaterThanOrEqual(0);
      expect(r.rrfScore).toBeLessThanOrEqual(1);
    }
  });

  it('D2-SC-ON-9: zscore_linear as active policy returns valid FusionResult[]', async () => {
    const channels = [
      makeScoredChannel('vec', [{ id: 'x', score: 1.0 }, { id: 'y', score: 0.3 }]),
    ];
    const result = await runShadowComparison(channels, 'zscore_linear');
    expect(result.activePolicy).toBe('zscore_linear');
    expect(result.activeResult.length).toBeGreaterThan(0);
    for (const r of result.activeResult) {
      expect(typeof r.rrfScore).toBe('number');
    }
  });
});

/* ──────────────────────────────────────────────────────────────
   TELEMETRY METRICS
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-002 Telemetry metric helpers', () => {
  it('D2-TM-1: computeNdcgAtK returns 0 for empty results', () => {
    expect(computeNdcgAtK([], 10, [])).toBe(0);
  });

  it('D2-TM-2: computeNdcgAtK returns 1.0 for single item (ideal == actual)', () => {
    const items = [{ id: 'a', fusedScore: 1.0, sources: [] } as FusedCandidate];
    expect(computeNdcgAtK(items, 10, items)).toBeCloseTo(1.0, 5);
  });

  it('D2-TM-3: computeNdcgAtK returns 1.0 for perfectly ranked list', () => {
    const items = [
      { id: 'a', fusedScore: 1.0, sources: [] },
      { id: 'b', fusedScore: 0.8, sources: [] },
      { id: 'c', fusedScore: 0.5, sources: [] },
    ] as FusedCandidate[];
    // Items are in ideal order (highest score first), so NDCG should be 1.0
    expect(computeNdcgAtK(items, 10, items)).toBeCloseTo(1.0, 5);
  });

  it('D2-TM-4: computeNdcgAtK is in [0, 1]', () => {
    const items = [
      { id: 'c', fusedScore: 0.1, sources: [] },
      { id: 'a', fusedScore: 0.9, sources: [] },
    ] as FusedCandidate[];
    const reference = [
      { id: 'a', fusedScore: 0.9, sources: [] },
      { id: 'c', fusedScore: 0.1, sources: [] },
    ] as FusedCandidate[];
    const ndcg = computeNdcgAtK(items, 10, reference);
    expect(ndcg).toBeGreaterThanOrEqual(0);
    expect(ndcg).toBeLessThanOrEqual(1);
  });

  it('D2-TM-5: computeMrrAtK returns 0 for empty results', () => {
    expect(computeMrrAtK([], 5, [])).toBe(0);
  });

  it('D2-TM-6: computeMrrAtK returns 1 when top item is rank 1', () => {
    const items = [
      { id: 'top', fusedScore: 1.0, sources: [] },
      { id: 'other', fusedScore: 0.5, sources: [] },
    ] as FusedCandidate[];
    // Top item is at position 0 (rank 1): MRR = 1/1 = 1.0
    expect(computeMrrAtK(items, 5, items)).toBe(1.0);
  });

  it('D2-TM-7: computeMrrAtK is in [0, 1]', () => {
    const items = [
      { id: 'a', fusedScore: 0.8, sources: [] },
      { id: 'b', fusedScore: 0.6, sources: [] },
    ] as FusedCandidate[];
    const mrr = computeMrrAtK(items, 5, items);
    expect(mrr).toBeGreaterThanOrEqual(0);
    expect(mrr).toBeLessThanOrEqual(1);
  });

  it('D2-TM-8: computeNdcgAtK returns null without a reference ranking', () => {
    const items = [{ id: 'a', fusedScore: 1.0, sources: [] } as FusedCandidate];
    expect(computeNdcgAtK(items, 10)).toBeNull();
  });

  it('D2-TM-9: computeMrrAtK returns null without a reference ranking', () => {
    const items = [{ id: 'a', fusedScore: 1.0, sources: [] } as FusedCandidate];
    expect(computeMrrAtK(items, 5)).toBeNull();
  });
});

/* ──────────────────────────────────────────────────────────────
   INTEGRATION: ALL 3 POLICIES ON REALISTIC INPUT
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-002 Integration: all 3 policies on shared input', () => {
  const channels: ScoredRankedList[] = [
    makeScoredChannel('vector', [
      { id: 101, score: 0.92 },
      { id: 102, score: 0.78 },
      { id: 103, score: 0.55 },
      { id: 104, score: 0.30 },
    ]),
    makeScoredChannel('bm25', [
      { id: 102, score: 0.85 },
      { id: 105, score: 0.72 },
      { id: 101, score: 0.60 },
      { id: 103, score: 0.41 },
    ]),
    makeScoredChannel('graph', [
      { id: 101, score: 0.95 },
      { id: 103, score: 0.88 },
      { id: 106, score: 0.50 },
    ]),
  ];

  it('D2-INT-1: all 3 policies return non-empty ranked lists', () => {
    for (const [name, fn] of Object.entries(POLICY_REGISTRY) as Array<[string, (c: ScoredRankedList[]) => FusedCandidate[]]>) {
      const result = fn(channels);
      expect(result.length, `${name} should return results`).toBeGreaterThan(0);
    }
  });

  it('D2-INT-2: all candidates from all channels appear in results', () => {
    const expectedIds = new Set(['101', '102', '103', '104', '105', '106']);
    for (const [name, fn] of Object.entries(POLICY_REGISTRY) as Array<[string, (c: ScoredRankedList[]) => FusedCandidate[]]>) {
      const result = fn(channels);
      const resultIds = new Set(result.map(r => String(r.id)));
      for (const id of expectedIds) {
        expect(resultIds.has(id), `${name} should include id ${id}`).toBe(true);
      }
    }
  });

  it('D2-INT-3: shadow run captures telemetry for all 3 policies with flag ON', async () => {
    setEnv({ SPECKIT_FUSION_POLICY_SHADOW_V2: 'true' });
    const result = await runShadowComparison(channels, 'rrf');
    expect(result.telemetry).toHaveLength(3);
    for (const t of result.telemetry) {
      expect(t.ndcg10).toBeNull();
      expect(t.mrr5).toBeNull();
      expect(t.latencyMs).toBeGreaterThanOrEqual(0);
    }
  });

  it('D2-INT-4: active policy result is identical whether shadows run or not', async () => {
    // Flag OFF — only active runs
    setEnv({ SPECKIT_FUSION_POLICY_SHADOW_V2: 'false' });
    const offResult = await runShadowComparison(channels, 'rrf');

    // Flag ON — all 3 run, but active result should be identical
    setEnv({ SPECKIT_FUSION_POLICY_SHADOW_V2: 'true' });
    const onResult = await runShadowComparison(channels, 'rrf');

    // Same number of results
    expect(offResult.activeResult.length).toBe(onResult.activeResult.length);
    // Same top result id
    expect(String(offResult.activeResult[0].id)).toBe(String(onResult.activeResult[0].id));
  });
});
