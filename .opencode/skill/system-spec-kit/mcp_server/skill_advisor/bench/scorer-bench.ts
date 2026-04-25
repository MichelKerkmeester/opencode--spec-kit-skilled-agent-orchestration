// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Scorer Benchmark
// ───────────────────────────────────────────────────────────────

import { performance } from 'node:perf_hooks';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
import { loadAdvisorProjection } from '../lib/scorer/projection.js';

const CACHE_HIT_P95_GATE_MS = 50;
const UNCACHED_P95_GATE_MS = 60;

function percentile(values: readonly number[], pct: number): number {
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * pct) - 1);
  return Number((sorted[index] ?? 0).toFixed(3));
}

function workspaceRoot(): string {
  let current = dirname(fileURLToPath(import.meta.url));
  for (let index = 0; index < 12; index += 1) {
    if (existsSync(resolve(current, '.opencode', 'skill', 'system-spec-kit', 'SKILL.md'))) return current;
    current = resolve(current, '..');
  }
  return resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
}

function runSeries(count: number, fn: () => void): number[] {
  const durations: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const started = performance.now();
    fn();
    durations.push(performance.now() - started);
  }
  return durations;
}

export function runScorerBench(root = workspaceRoot()): {
  readonly cacheHitP95Ms: number;
  readonly uncachedP95Ms: number;
  readonly passed: boolean;
} {
  const prompt = 'Implement a Vitest for gate-3-classifier.ts and run targeted tests.';
  const projection = loadAdvisorProjection(root);
  const cacheHit = runSeries(150, () => {
    scoreAdvisorPrompt(prompt, { workspaceRoot: root, projection });
  });
  const uncached = runSeries(75, () => {
    scoreAdvisorPrompt(`${prompt} ${Math.random().toString(16).slice(2)}`, { workspaceRoot: root });
  });
  const cacheHitP95Ms = percentile(cacheHit, 0.95);
  const uncachedP95Ms = percentile(uncached, 0.95);
  return {
    cacheHitP95Ms,
    uncachedP95Ms,
    passed: cacheHitP95Ms <= CACHE_HIT_P95_GATE_MS && uncachedP95Ms <= UNCACHED_P95_GATE_MS,
  };
}

const invoked = process.argv[1] ? resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false;
if (invoked) {
  const report = runScorerBench();
  console.log(`advisor-scorer-bench ${JSON.stringify(report)}`);
  if (!report.passed) {
    process.exitCode = 1;
  }
}
