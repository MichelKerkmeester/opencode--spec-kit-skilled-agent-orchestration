// ───────────────────────────────────────────────────────────────
// MODULE: Promotion Gate Bundle
// ───────────────────────────────────────────────────────────────

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import type {
  PromotionGateBundleResult,
  PromotionGateResult,
} from '../../schemas/promotion-cycle.js';

export const PROMOTION_GATE_THRESHOLDS = {
  fullCorpusAccuracy: 0.75,
  holdoutAccuracy: 0.725,
  cacheHitP95Ms: 50,
  uncachedP95Ms: 60,
  exactParityRegressions: 0,
  regressionP0PassRate: 1.0,
  regressionFailedCases: 0,
  commandBridgeFpRate: 0.05,
} as const;

export interface PromotionGateBundleInput {
  readonly fullCorpus: {
    readonly accuracy: number;
    readonly goldNoneFalseFire: number;
    readonly baselineGoldNoneFalseFire: number;
  };
  readonly holdout: {
    readonly accuracy: number;
  };
  readonly safety: {
    readonly regressionCount: number;
    readonly baselineRegressionCount: number;
  };
  readonly latency: {
    readonly cacheHitP95Ms: number;
    readonly uncachedP95Ms: number;
    readonly baselineCacheHitP95Ms?: number;
    readonly baselineUncachedP95Ms?: number;
  };
  readonly exactParity: {
    readonly pythonCorrect: number;
    readonly preservedPythonCorrect: number;
    readonly regressions: number;
  };
  readonly regressionSuite: {
    readonly p0PassRate: number;
    readonly failedCases: number;
    readonly commandBridgeFpRate: number;
  };
  readonly now?: () => string;
}

function gate(
  name: string,
  passed: boolean,
  threshold: string,
  measured: string,
  details: readonly string[] = [],
): PromotionGateResult {
  return {
    gate: name,
    status: passed ? 'pass' : 'fail',
    threshold,
    measured,
    details: [...details],
  };
}

export function evaluatePromotionGateBundle(input: PromotionGateBundleInput): PromotionGateBundleResult {
  const latencyNoRegression = (
    input.latency.baselineCacheHitP95Ms === undefined
    || input.latency.cacheHitP95Ms <= input.latency.baselineCacheHitP95Ms
  ) && (
    input.latency.baselineUncachedP95Ms === undefined
    || input.latency.uncachedP95Ms <= input.latency.baselineUncachedP95Ms
  );

  const gates: PromotionGateResult[] = [
    gate(
      'full-corpus-top1',
      input.fullCorpus.accuracy >= PROMOTION_GATE_THRESHOLDS.fullCorpusAccuracy,
      '>=75%',
      `${(input.fullCorpus.accuracy * 100).toFixed(1)}%`,
    ),
    gate(
      'stratified-holdout-top1',
      input.holdout.accuracy >= PROMOTION_GATE_THRESHOLDS.holdoutAccuracy,
      '>=72.5%',
      `${(input.holdout.accuracy * 100).toFixed(1)}%`,
    ),
    gate(
      'gold-none-false-fire-no-increase',
      input.fullCorpus.goldNoneFalseFire <= input.fullCorpus.baselineGoldNoneFalseFire,
      'candidate <= baseline',
      `${input.fullCorpus.goldNoneFalseFire} <= ${input.fullCorpus.baselineGoldNoneFalseFire}`,
    ),
    gate(
      'safety-regression-no-increase',
      input.safety.regressionCount <= input.safety.baselineRegressionCount,
      'candidate safety regressions <= baseline',
      `${input.safety.regressionCount} <= ${input.safety.baselineRegressionCount}`,
    ),
    gate(
      'latency-no-regression',
      input.latency.cacheHitP95Ms <= PROMOTION_GATE_THRESHOLDS.cacheHitP95Ms
        && input.latency.uncachedP95Ms <= PROMOTION_GATE_THRESHOLDS.uncachedP95Ms
        && latencyNoRegression,
      'cache-hit p95 <=50ms and uncached p95 <=60ms; no baseline regression when supplied',
      `cache=${input.latency.cacheHitP95Ms}ms, uncached=${input.latency.uncachedP95Ms}ms`,
    ),
    gate(
      'exact-parity-preservation',
      input.exactParity.regressions === 0
        && input.exactParity.preservedPythonCorrect === input.exactParity.pythonCorrect,
      '0 regressions on Python-correct prompts',
      `${input.exactParity.preservedPythonCorrect}/${input.exactParity.pythonCorrect}, regressions=${input.exactParity.regressions}`,
    ),
    gate(
      'regression-suite',
      input.regressionSuite.p0PassRate >= PROMOTION_GATE_THRESHOLDS.regressionP0PassRate
        && input.regressionSuite.failedCases === PROMOTION_GATE_THRESHOLDS.regressionFailedCases
        && input.regressionSuite.commandBridgeFpRate <= PROMOTION_GATE_THRESHOLDS.commandBridgeFpRate,
      'P0 pass-rate=1.0, failed=0, command-bridge FP <=0.05',
      `p0=${input.regressionSuite.p0PassRate}, failed=${input.regressionSuite.failedCases}, commandFp=${input.regressionSuite.commandBridgeFpRate}`,
    ),
  ];
  const failedGates = gates.filter((item) => item.status === 'fail').map((item) => item.gate);
  return {
    passed: failedGates.length === 0,
    gates,
    failedGates,
    evaluatedAt: input.now?.() ?? new Date().toISOString(),
  };
}

export function writeGateBundleAuditArtifact(
  result: PromotionGateBundleResult,
  artifactPath: string,
): void {
  mkdirSync(dirname(artifactPath), { recursive: true });
  writeFileSync(artifactPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
}
