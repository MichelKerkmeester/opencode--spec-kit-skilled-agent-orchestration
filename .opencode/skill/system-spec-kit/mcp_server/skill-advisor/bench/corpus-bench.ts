// ───────────────────────────────────────────────────────────────
// MODULE: Promotion Corpus Benchmark
// ───────────────────────────────────────────────────────────────

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { runShadowCycle } from '../lib/promotion/shadow-cycle.js';
import type { PromotionCorpusCase, PromotionWeights } from '../schemas/promotion-cycle.js';
import type { AdvisorProjection } from '../lib/scorer/types.js';

interface CorpusRow {
  readonly id: string;
  readonly prompt: string;
  readonly skill_top_1: string;
  readonly bucket?: string;
}

export function findWorkspaceRoot(): string {
  let current = dirname(fileURLToPath(import.meta.url));
  for (let index = 0; index < 12; index += 1) {
    if (existsSync(resolve(current, '.opencode', 'skill', 'system-spec-kit', 'SKILL.md'))) return current;
    current = resolve(current, '..');
  }
  throw new Error('Unable to locate workspace root.');
}

export function promotionCorpusPath(workspaceRoot = findWorkspaceRoot()): string {
  return resolve(
    workspaceRoot,
    '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl',
  );
}

export function loadPromotionCorpus(workspaceRoot = findWorkspaceRoot()): PromotionCorpusCase[] {
  return readFileSync(promotionCorpusPath(workspaceRoot), 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as CorpusRow)
    .map((row) => ({
      id: row.id,
      prompt: row.prompt,
      expectedSkill: row.skill_top_1 === 'none' ? null : row.skill_top_1,
      bucket: row.bucket ?? row.skill_top_1,
    }));
}

export function runCorpusBench(args: {
  readonly workspaceRoot?: string;
  readonly projection?: AdvisorProjection;
  readonly candidateWeights?: PromotionWeights;
} = {}) {
  const workspaceRoot = args.workspaceRoot ?? findWorkspaceRoot();
  return runShadowCycle({
    cycleId: 'full-corpus',
    cases: loadPromotionCorpus(workspaceRoot),
    workspaceRoot,
    projection: args.projection,
    candidateWeights: args.candidateWeights,
    minimumAccuracy: 0.75,
  });
}

const invoked = process.argv[1] ? resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false;
if (invoked) {
  const report = runCorpusBench();
  console.log(`advisor-promotion-corpus-bench ${JSON.stringify(report)}`);
  if (report.candidateAccuracy < 0.75) process.exitCode = 1;
}
