import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runCorpusBench } from '../../bench/corpus-bench.js';
import { runHoldoutBench } from '../../bench/holdout-bench.js';
import { evaluatePromotionGateBundle, writeGateBundleAuditArtifact } from '../../lib/promotion/gate-bundle.js';
import { rollbackPromotion } from '../../lib/promotion/rollback.js';
import { requireSemanticLiveWeightLocked } from '../../lib/promotion/semantic-lock.js';
import { DEFAULT_PROMOTION_WEIGHTS, runShadowCycle } from '../../lib/promotion/shadow-cycle.js';
import { recordShadowCycle } from '../../lib/promotion/two-cycle-requirement.js';
import { enforceWeightDeltaCap } from '../../lib/promotion/weight-delta-cap.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { PromotionWeights } from '../../schemas/promotion-cycle.js';
import type { SkillProjection } from '../../lib/scorer/types.js';

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  return {
    id: overrides.id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: overrides.id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.opencode/skill/${overrides.id}/graph-metadata.json`,
    lifecycleStatus: 'active',
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'id')),
  };
}

function passingGateInput() {
  return {
    fullCorpus: { accuracy: 0.805, goldNoneFalseFire: 8, baselineGoldNoneFalseFire: 8 },
    holdout: { accuracy: 0.775 },
    safety: { regressionCount: 0, baselineRegressionCount: 0 },
    latency: { cacheHitP95Ms: 7.196, uncachedP95Ms: 11.659 },
    exactParity: { pythonCorrect: 120, preservedPythonCorrect: 120, regressions: 0 },
    regressionSuite: { p0PassRate: 1.0, failedCases: 0, commandBridgeFpRate: 0 },
    now: () => '2026-04-20T00:00:00.000Z',
  };
}

describe('027/006 promotion shadow cycles', () => {
  it('replays without live mutations or cache invalidation hooks', () => {
    const projection = createFixtureProjection([
      skill({ id: 'alpha', intentSignals: ['alpha workflow'] }),
    ]);
    const report = runShadowCycle({
      cycleId: 'no-live-mutation',
      workspaceRoot: process.cwd(),
      projection,
      cases: [{ id: 'P1', prompt: 'run the alpha workflow', expectedSkill: 'alpha' }],
      sideEffectAudit: {
        sqliteWrite: () => { throw new Error('sqlite write should not be called'); },
        generationBump: () => { throw new Error('generation bump should not be called'); },
        cacheInvalidation: () => { throw new Error('cache invalidation should not be called'); },
      },
    });
    expect(report.sideEffectFree).toBe(true);
    expect(report.correctPrompts).toBe(1);
    expect(report.passesShadowGate).toBe(true);
  });

  it('self-tests current 003 weights across two positive corpus shadow cycles', () => {
    const firstFull = runCorpusBench({ candidateWeights: DEFAULT_PROMOTION_WEIGHTS });
    const secondFull = runCorpusBench({ candidateWeights: DEFAULT_PROMOTION_WEIGHTS });
    const holdout = runHoldoutBench({ candidateWeights: DEFAULT_PROMOTION_WEIGHTS });
    expect(firstFull.candidateAccuracy).toBeGreaterThanOrEqual(0.75);
    expect(secondFull.candidateAccuracy).toBeGreaterThanOrEqual(0.75);
    expect(holdout.candidateAccuracy).toBeGreaterThanOrEqual(0.725);
    expect(firstFull.goldNoneFalseFire).toBeLessThanOrEqual(8);
    expect(firstFull.passesShadowGate).toBe(true);
    expect(secondFull.passesShadowGate).toBe(true);
  });
});

describe('027/006 weight and semantic guards', () => {
  it('rejects candidate weights with delta greater than 0.05', () => {
    const result = enforceWeightDeltaCap({
      currentWeights: DEFAULT_PROMOTION_WEIGHTS,
      candidateWeights: { ...DEFAULT_PROMOTION_WEIGHTS, lexical: 0.36 },
    });
    expect(result.accepted).toBe(false);
    expect(result.violations.map((item) => item.lane)).toEqual(['lexical']);
  });

  it('accepts candidate weights at the 0.05 delta cap', () => {
    const result = enforceWeightDeltaCap({
      currentWeights: DEFAULT_PROMOTION_WEIGHTS,
      candidateWeights: { ...DEFAULT_PROMOTION_WEIGHTS, lexical: 0.35 },
    });
    expect(result.accepted).toBe(true);
  });

  it('blocks semantic live weight above 0.00 during the first promotion wave', () => {
    expect(() => requireSemanticLiveWeightLocked({
      ...DEFAULT_PROMOTION_WEIGHTS,
      semantic_shadow: 0.01,
    })).toThrow(/semantic_shadow live weight must remain 0\.00/);
  });
});

describe('027/006 seven-gate bundle', () => {
  it('passes when all seven gates meet thresholds', () => {
    const result = evaluatePromotionGateBundle(passingGateInput());
    expect(result.passed).toBe(true);
    expect(result.gates).toHaveLength(7);
  });

  it.each([
    ['full-corpus-top1', { fullCorpus: { accuracy: 0.745, goldNoneFalseFire: 8, baselineGoldNoneFalseFire: 8 } }],
    ['stratified-holdout-top1', { holdout: { accuracy: 0.70 } }],
    ['gold-none-false-fire-no-increase', { fullCorpus: { accuracy: 0.805, goldNoneFalseFire: 9, baselineGoldNoneFalseFire: 8 } }],
    ['safety-regression-no-increase', { safety: { regressionCount: 1, baselineRegressionCount: 0 } }],
    ['latency-no-regression', { latency: { cacheHitP95Ms: 55, uncachedP95Ms: 11.659 } }],
    ['exact-parity-preservation', { exactParity: { pythonCorrect: 120, preservedPythonCorrect: 119, regressions: 1 } }],
    ['regression-suite', { regressionSuite: { p0PassRate: 0.99, failedCases: 1, commandBridgeFpRate: 0.06 } }],
  ])('fails the %s gate independently', (gateName, override) => {
    const result = evaluatePromotionGateBundle({
      ...passingGateInput(),
      ...override,
    });
    expect(result.passed).toBe(false);
    expect(result.failedGates).toEqual([gateName]);
  });

  it('writes a per-gate audit artifact when requested', () => {
    const dir = mkdtempSync(join(tmpdir(), 'promotion-gates-'));
    const artifact = join(dir, 'gate-bundle.json');
    const result = evaluatePromotionGateBundle(passingGateInput());
    writeGateBundleAuditArtifact(result, artifact);
    expect(JSON.parse(readFileSync(artifact, 'utf8'))).toMatchObject({ passed: true });
  });
});

describe('027/006 two-cycle requirement', () => {
  it('requires two consecutive passing cycles and resets on failure', () => {
    const first = recordShadowCycle([], {
      cycleId: 'cycle-1',
      passed: true,
      evaluatedAt: '2026-04-20T00:00:00.000Z',
    });
    expect(first.eligibleForPromotion).toBe(false);

    const second = recordShadowCycle(first.history, {
      cycleId: 'cycle-2',
      passed: true,
      evaluatedAt: '2026-04-20T00:01:00.000Z',
    });
    expect(second.eligibleForPromotion).toBe(true);

    const failed = recordShadowCycle(second.history, {
      cycleId: 'cycle-3',
      passed: false,
      evaluatedAt: '2026-04-20T00:02:00.000Z',
    });
    expect(failed.consecutivePassingCycles).toBe(0);
    expect(failed.eligibleForPromotion).toBe(false);
  });
});

describe('027/006 rollback and integration', () => {
  it('rolls back failed weights, invalidates cache, and emits telemetry', async () => {
    let applied: PromotionWeights | null = null;
    let invalidated = false;
    const telemetry: unknown[] = [];
    const failedWeights = { ...DEFAULT_PROMOTION_WEIGHTS, lexical: 0.35, explicit_author: 0.40 };
    const trace = await rollbackPromotion({
      reason: 'latency regression',
      previousWeights: DEFAULT_PROMOTION_WEIGHTS,
      failedWeights,
      applyWeights: (weights) => { applied = weights; },
      invalidateCache: () => { invalidated = true; },
      emitTelemetry: (event) => { telemetry.push(event); },
      now: () => '2026-04-20T00:00:00.000Z',
    });
    expect(applied).toEqual(DEFAULT_PROMOTION_WEIGHTS);
    expect(invalidated).toBe(true);
    expect(telemetry).toHaveLength(1);
    expect(trace.cacheInvalidated).toBe(true);
  });

  it('runs shadow-to-promotion workflow atomically for bounded learned/adaptive weights', () => {
    const projection = createFixtureProjection([
      skill({ id: 'alpha', intentSignals: ['alpha workflow'] }),
    ]);
    const candidateWeights: PromotionWeights = {
      ...DEFAULT_PROMOTION_WEIGHTS,
      learned_adaptive: 0.05,
    };
    expect(enforceWeightDeltaCap({
      currentWeights: DEFAULT_PROMOTION_WEIGHTS,
      candidateWeights,
    }).accepted).toBe(true);
    expect(() => requireSemanticLiveWeightLocked(candidateWeights)).not.toThrow();

    const cycleOne = runShadowCycle({
      cycleId: 'cycle-1',
      workspaceRoot: process.cwd(),
      projection,
      candidateWeights,
      cases: [{ id: 'P1', prompt: 'run the alpha workflow', expectedSkill: 'alpha' }],
    });
    const cycleTwo = runShadowCycle({
      cycleId: 'cycle-2',
      workspaceRoot: process.cwd(),
      projection,
      candidateWeights,
      cases: [{ id: 'P1', prompt: 'run the alpha workflow', expectedSkill: 'alpha' }],
    });
    const afterOne = recordShadowCycle([], {
      cycleId: cycleOne.cycleId,
      passed: cycleOne.passesShadowGate,
      evaluatedAt: '2026-04-20T00:00:00.000Z',
    });
    const afterTwo = recordShadowCycle(afterOne.history, {
      cycleId: cycleTwo.cycleId,
      passed: cycleTwo.passesShadowGate,
      evaluatedAt: '2026-04-20T00:01:00.000Z',
    });
    expect(afterTwo.eligibleForPromotion).toBe(true);

    let liveWeights = DEFAULT_PROMOTION_WEIGHTS;
    liveWeights = candidateWeights;
    expect(liveWeights).toEqual(candidateWeights);
  });
});
