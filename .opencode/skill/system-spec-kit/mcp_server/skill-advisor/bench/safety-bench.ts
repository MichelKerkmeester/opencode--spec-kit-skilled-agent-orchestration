// ───────────────────────────────────────────────────────────────
// MODULE: Promotion Safety Benchmark
// ───────────────────────────────────────────────────────────────

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { findWorkspaceRoot, loadPromotionCorpus } from './corpus-bench.js';
import { runShadowCycle } from '../lib/promotion/shadow-cycle.js';
import type { PromotionWeights } from '../schemas/promotion-cycle.js';
import type { AdvisorProjection } from '../lib/scorer/types.js';

export function runSafetyBench(args: {
  readonly workspaceRoot?: string;
  readonly projection?: AdvisorProjection;
  readonly candidateWeights?: PromotionWeights;
  readonly baselineGoldNoneFalseFire?: number;
} = {}) {
  const workspaceRoot = args.workspaceRoot ?? findWorkspaceRoot();
  const report = runShadowCycle({
    cycleId: 'safety-slices',
    cases: loadPromotionCorpus(workspaceRoot),
    workspaceRoot,
    projection: args.projection,
    candidateWeights: args.candidateWeights,
  });
  const baselineGoldNoneFalseFire = args.baselineGoldNoneFalseFire ?? report.goldNoneFalseFire;
  return {
    goldNoneFalseFire: report.goldNoneFalseFire,
    baselineGoldNoneFalseFire,
    regressionCount: Math.max(0, report.goldNoneFalseFire - baselineGoldNoneFalseFire),
    unknownCount: report.unknownCount,
    gatePassed: report.goldNoneFalseFire <= baselineGoldNoneFalseFire,
  };
}

const invoked = process.argv[1] ? resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false;
if (invoked) {
  const report = runSafetyBench();
  console.log(`advisor-promotion-safety-bench ${JSON.stringify(report)}`);
  if (!report.gatePassed) process.exitCode = 1;
}
