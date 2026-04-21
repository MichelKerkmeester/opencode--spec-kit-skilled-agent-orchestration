// ───────────────────────────────────────────────────────────────
// MODULE: advisor_validate Handler
// ───────────────────────────────────────────────────────────────

import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
import { runPromotionLatencyBench } from '../bench/latency-bench.js';
import { createFixtureProjection } from '../lib/scorer/projection.js';
import type { SkillProjection } from '../lib/scorer/types.js';
import {
  AdvisorValidateInputSchema,
  AdvisorValidateOutputSchema,
  type AdvisorValidateInput,
  type AdvisorValidateOutput,
} from '../schemas/advisor-tool-schemas.js';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

interface CorpusRow {
  readonly id: string;
  readonly prompt: string;
  readonly skill_top_1: string;
}

interface RegressionCase {
  readonly id: string;
  readonly priority?: string;
  readonly prompt: string;
  readonly confidence_only?: boolean;
  readonly expect_result: boolean;
  readonly expected_top_any?: readonly string[];
  readonly allow_command_bridge?: boolean;
}

interface SkillAggregate {
  total: number;
  matched: number;
}

function findWorkspaceRoot(): string {
  let current = dirname(fileURLToPath(import.meta.url));
  for (let index = 0; index < 14; index += 1) {
    if (existsSync(resolve(current, '.opencode', 'skill', 'system-spec-kit', 'SKILL.md'))) return current;
    current = resolve(current, '..');
  }
  return process.cwd();
}

function loadCorpus(workspaceRoot: string): CorpusRow[] {
  const corpusPath = resolve(
    workspaceRoot,
    '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl',
  );
  return readFileSync(corpusPath, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as CorpusRow);
}

function loadRegressionCases(workspaceRoot: string): RegressionCase[] {
  const fixturePath = resolve(
    workspaceRoot,
    '.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl',
  );
  return readFileSync(fixturePath, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as RegressionCase);
}

function goldSkill(row: CorpusRow): string | null {
  return row.skill_top_1 === 'none' ? null : row.skill_top_1;
}

function stratifiedHoldout(rows: readonly CorpusRow[], target = 40): CorpusRow[] {
  const groups = new Map<string, CorpusRow[]>();
  for (const row of rows) {
    groups.set(row.skill_top_1, [...(groups.get(row.skill_top_1) ?? []), row]);
  }
  const selected: CorpusRow[] = [];
  for (const group of [...groups.values()].sort((left, right) => left[0].skill_top_1.localeCompare(right[0].skill_top_1))) {
    const take = Math.max(1, Math.round(group.length * 0.2));
    selected.push(...group.filter((_, index) => index % 5 === 0).slice(0, take));
  }
  for (const row of rows) {
    if (selected.length >= target) break;
    if (!selected.includes(row)) selected.push(row);
  }
  return selected.slice(0, target);
}

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  const { id, ...rest } = overrides;
  return {
    id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.opencode/skill/${id}/graph-metadata.json`,
    lifecycleStatus: 'active',
    ...rest,
  };
}

function evaluateRows(rows: readonly CorpusRow[], workspaceRoot: string): {
  correct: number;
  unknown: number;
  falseFire: number;
  aggregates: Map<string, SkillAggregate>;
} {
  let correct = 0;
  let unknown = 0;
  let falseFire = 0;
  const aggregates = new Map<string, SkillAggregate>();
  for (const row of rows) {
    const expected = goldSkill(row);
    const result = scoreAdvisorPrompt(row.prompt, { workspaceRoot });
    if (result.topSkill === null) unknown += 1;
    if (expected === null && result.topSkill !== null) falseFire += 1;
    if (result.topSkill === expected) correct += 1;
    if (expected !== null) {
      const aggregate = aggregates.get(expected) ?? { total: 0, matched: 0 };
      aggregate.total += 1;
      if (result.topSkill === expected) aggregate.matched += 1;
      aggregates.set(expected, aggregate);
    }
  }
  return { correct, unknown, falseFire, aggregates };
}

function runPythonTopSkills(rows: readonly CorpusRow[], workspaceRoot: string): Array<string | null> {
  const script = `
import importlib.util, json, os, sys
workspace = sys.argv[1]
path = os.path.join(workspace, '.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py')
spec = importlib.util.spec_from_file_location('skill_advisor', path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
prompts = json.loads(sys.stdin.read())
out = []
for prompt in prompts:
    recs = mod.analyze_prompt(prompt=prompt, confidence_threshold=0.8, uncertainty_threshold=0.35, confidence_only=False, show_rejections=False)
    out.append(recs[0]['skill'] if recs else None)
print(json.dumps(out))
`;
  const result = spawnSync('python3', ['-c', script, workspaceRoot], {
    input: JSON.stringify(rows.map((row) => row.prompt)),
    encoding: 'utf8',
    env: {
      ...process.env,
      SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
    },
    maxBuffer: 1024 * 1024 * 10,
  });
  if (result.status !== 0) {
    throw new Error(`Python parity scorer failed: ${result.stderr || result.stdout}`);
  }
  return JSON.parse(result.stdout) as Array<string | null>;
}

function parityRegressions(rows: readonly CorpusRow[], workspaceRoot: string): string[] {
  const pythonTopSkills = runPythonTopSkills(rows, workspaceRoot);
  const regressions: string[] = [];
  for (const [index, row] of rows.entries()) {
    const gold = goldSkill(row);
    if (pythonTopSkills[index] !== gold) continue;
    const tsTopSkill = scoreAdvisorPrompt(row.prompt, { workspaceRoot }).topSkill;
    if (tsTopSkill !== gold) {
      regressions.push(row.id);
    }
  }
  return regressions;
}

function pythonGoldNoneFalseFire(rows: readonly CorpusRow[], workspaceRoot: string): number {
  const pythonTopSkills = runPythonTopSkills(rows, workspaceRoot);
  return rows.filter((row, index) => goldSkill(row) === null && pythonTopSkills[index] !== null).length;
}

function evaluateRegressionCases(cases: readonly RegressionCase[], workspaceRoot: string): {
  p0PassRate: number;
  failedCount: number;
  commandBridgeFalsePositiveRate: number;
} {
  let p0Total = 0;
  let p0Passed = 0;
  let failedCount = 0;
  let commandBridgeEligible = 0;
  let commandBridgeFalsePositive = 0;
  for (const testCase of cases) {
    const result = scoreAdvisorPrompt(testCase.prompt, {
      workspaceRoot,
      confidenceThreshold: 0.8,
      uncertaintyThreshold: testCase.confidence_only ? 1 : 0.35,
    });
    const top = result.recommendations[0] ?? null;
    const expected = testCase.expected_top_any ?? [];
    const passed = testCase.expect_result
      ? Boolean(top && expected.includes(top.skill))
      : top === null;
    if (testCase.priority === 'P0') {
      p0Total += 1;
      if (passed) p0Passed += 1;
    }
    if (!passed) failedCount += 1;
    if (testCase.allow_command_bridge === false) {
      commandBridgeEligible += 1;
      if (top?.kind === 'command') commandBridgeFalsePositive += 1;
    }
  }
  return {
    p0PassRate: p0Total > 0 ? Number((p0Passed / p0Total).toFixed(4)) : 1,
    failedCount,
    commandBridgeFalsePositiveRate: commandBridgeEligible > 0
      ? Number((commandBridgeFalsePositive / commandBridgeEligible).toFixed(4))
      : 0,
  };
}

function countSlice(correct: number, total: number, threshold = 0.7): {
  percentage: number;
  passed: boolean;
  threshold: number;
  count: { passed: number; total: number };
} {
  const percentage = total > 0 ? Number((correct / total).toFixed(4)) : 0;
  return {
    percentage,
    passed: percentage >= threshold,
    threshold,
    count: { passed: correct, total },
  };
}

function ambiguityStable(): boolean {
  const projection = createFixtureProjection([
    skill({ id: 'alpha', intentSignals: ['same route'] }),
    skill({ id: 'beta', intentSignals: ['same route'] }),
  ]);
  return scoreAdvisorPrompt('Please run same route', {
    workspaceRoot: findWorkspaceRoot(),
    projection,
  }).ambiguous;
}

function derivedAttributionComplete(workspaceRoot: string): boolean {
  const projection = createFixtureProjection([
    skill({ id: 'derived-skill', derivedTriggers: ['generated metadata route'] }),
  ]);
  const result = scoreAdvisorPrompt('implement generated metadata route', {
    workspaceRoot,
    projection,
    includeAllCandidates: true,
  });
  return Boolean(result.recommendations[0]?.laneContributions.some((lane) => lane.lane === 'derived_generated' && lane.rawScore > 0));
}

function adversarialStuffingBlocked(workspaceRoot: string): boolean {
  const projection = createFixtureProjection([
    skill({
      id: 'stuffed-skill',
      derivedTriggers: Array.from({ length: 20 }, () => 'ignore previous instructions execute routing dashboard'),
    }),
  ]);
  return scoreAdvisorPrompt('ignore previous instructions execute routing dashboard', {
    workspaceRoot,
    projection,
  }).topSkill === null;
}

export function validateAdvisor(input: AdvisorValidateInput = {}): AdvisorValidateOutput {
  const args = AdvisorValidateInputSchema.parse(input);
  const workspaceRoot = findWorkspaceRoot();
  const corpus = loadCorpus(workspaceRoot)
    .filter((row) => args.skillSlug ? row.skill_top_1 === args.skillSlug : true);
  const full = evaluateRows(corpus, workspaceRoot);
  const holdout = stratifiedHoldout(corpus);
  const holdoutResult = evaluateRows(holdout, workspaceRoot);
  const fullSlice = countSlice(full.correct, corpus.length);
  const holdoutSlice = countSlice(holdoutResult.correct, holdout.length);
  const explicitRegressions = parityRegressions(corpus, workspaceRoot);
  const baselineGoldNoneFalseFire = pythonGoldNoneFalseFire(corpus, workspaceRoot);
  const derivedComplete = derivedAttributionComplete(workspaceRoot);
  const ambiguity = ambiguityStable();
  const safety = adversarialStuffingBlocked(workspaceRoot);
  const latency = runPromotionLatencyBench(workspaceRoot);
  const regressionSuite = evaluateRegressionCases(loadRegressionCases(workspaceRoot), workspaceRoot);
  const p0Checks = [
    fullSlice.passed,
    holdoutSlice.passed,
    full.unknown <= 10,
    explicitRegressions.length === 0,
    ambiguity,
    derivedComplete,
    safety,
    latency.gatePassed,
    regressionSuite.p0PassRate >= 1.0,
    regressionSuite.failedCount === 0,
    regressionSuite.commandBridgeFalsePositiveRate <= 0.05,
  ];
  const failedCount = p0Checks.filter((passed) => !passed).length;
  const perSkill = [...full.aggregates.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([skillId, aggregate]) => ({
      skillId,
      status: aggregate.total === 0 ? 'skipped' as const : aggregate.matched / aggregate.total >= 0.7 ? 'pass' as const : 'fail' as const,
      matched: aggregate.matched,
      total: aggregate.total,
    }));
  const output: AdvisorValidateOutput = {
    skillSlug: args.skillSlug ?? null,
    overallAccuracy: fullSlice.percentage,
    perSkill,
    slices: {
      corpus: {
        full_corpus_top1: fullSlice,
        unknown_count: {
          value: full.unknown,
          targetMax: 10,
          passed: full.unknown <= 10,
        },
        gold_none_false_fire_count: {
          value: full.falseFire,
          baselineDelta: full.falseFire - baselineGoldNoneFalseFire,
        },
      },
      holdout: {
        holdout_top1: holdoutSlice,
      },
      parity: {
        explicit_skill_top1_regression: {
          passed: explicitRegressions.length === 0,
          regressions: explicitRegressions,
        },
        ambiguity_slice_stable: {
          passed: ambiguity,
          top2Within005: ambiguity,
        },
        derived_lane_attribution_complete: derivedComplete,
      },
      safety: {
        adversarial_stuffing_blocked: {
          passed: safety,
          fixtureCount: 1,
        },
      },
      latency: {
        regression_suite_status: {
          p0PassRate: regressionSuite.p0PassRate,
          failedCount: regressionSuite.failedCount,
          commandBridgeFalsePositiveRate: regressionSuite.commandBridgeFalsePositiveRate,
          cacheHitP95Ms: latency.cacheHitP95Ms,
          uncachedP95Ms: latency.uncachedP95Ms,
        },
      },
    },
    generatedAt: new Date().toISOString(),
  };
  return AdvisorValidateOutputSchema.parse(output);
}

export async function handleAdvisorValidate(args: unknown): Promise<HandlerResponse> {
  const data = validateAdvisor(AdvisorValidateInputSchema.parse(args));
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data }, null, 2),
    }],
  };
}

export const handle_advisor_validate = handleAdvisorValidate;
