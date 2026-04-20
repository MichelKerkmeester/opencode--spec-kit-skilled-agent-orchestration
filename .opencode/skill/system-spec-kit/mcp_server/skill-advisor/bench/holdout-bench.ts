// ───────────────────────────────────────────────────────────────
// MODULE: Promotion Holdout Benchmark
// ───────────────────────────────────────────────────────────────

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { findWorkspaceRoot, loadPromotionCorpus } from './corpus-bench.js';
import { runShadowCycle } from '../lib/promotion/shadow-cycle.js';
import type { PromotionCorpusCase, PromotionWeights } from '../schemas/promotion-cycle.js';
import type { AdvisorProjection } from '../lib/scorer/types.js';

export function stratifiedHoldout(rows: readonly PromotionCorpusCase[], target = 40): PromotionCorpusCase[] {
  const groups = new Map<string, PromotionCorpusCase[]>();
  for (const row of rows) {
    const key = row.bucket ?? row.expectedSkill ?? 'none';
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  const selected: PromotionCorpusCase[] = [];
  for (const group of [...groups.values()].sort((left, right) => left[0].id.localeCompare(right[0].id))) {
    const take = Math.max(1, Math.round(group.length * 0.2));
    selected.push(...group.filter((_, index) => index % 5 === 0).slice(0, take));
  }
  for (const row of rows) {
    if (selected.length >= target) break;
    if (!selected.some((item) => item.id === row.id)) selected.push(row);
  }
  return selected.slice(0, target);
}

export function runHoldoutBench(args: {
  readonly workspaceRoot?: string;
  readonly projection?: AdvisorProjection;
  readonly candidateWeights?: PromotionWeights;
} = {}) {
  const workspaceRoot = args.workspaceRoot ?? findWorkspaceRoot();
  const cases = stratifiedHoldout(loadPromotionCorpus(workspaceRoot));
  return runShadowCycle({
    cycleId: 'stratified-holdout',
    cases,
    workspaceRoot,
    projection: args.projection,
    candidateWeights: args.candidateWeights,
    minimumAccuracy: 0.725,
  });
}

const invoked = process.argv[1] ? resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false;
if (invoked) {
  const report = runHoldoutBench();
  console.log(`advisor-promotion-holdout-bench ${JSON.stringify(report)}`);
  if (report.candidateAccuracy < 0.725) process.exitCode = 1;
}
