// ───────────────────────────────────────────────────────────────
// MODULE: Python TS Parity Tests
// ───────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';
import { runLaneAblation } from '../../lib/scorer/ablation.js';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';

interface CorpusRow {
  readonly id: string;
  readonly prompt: string;
  readonly skill_top_1: string;
}

interface PythonRow {
  readonly prompt: string;
  readonly top: string | null;
}

function findWorkspaceRoot(): string {
  let current = dirname(fileURLToPath(import.meta.url));
  for (let index = 0; index < 12; index += 1) {
    try {
      const marker = resolve(current, '.opencode', 'skill');
      readFileSync(resolve(marker, 'system-spec-kit', 'SKILL.md'), 'utf8');
      return current;
    } catch {
      current = resolve(current, '..');
    }
  }
  throw new Error('Unable to locate workspace root.');
}

const WORKSPACE_ROOT = findWorkspaceRoot();
const CORPUS_PATH = resolve(
  WORKSPACE_ROOT,
  '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl',
);

function loadCorpus(): CorpusRow[] {
  return readFileSync(CORPUS_PATH, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as CorpusRow);
}

function goldSkill(row: CorpusRow): string | null {
  return row.skill_top_1 === 'none' ? null : row.skill_top_1;
}

function runPython(prompts: readonly string[]): PythonRow[] {
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
    out.append({'prompt': prompt, 'top': recs[0]['skill'] if recs else None})
print(json.dumps(out))
`;
  const result = spawnSync('python3', ['-c', script, WORKSPACE_ROOT], {
    input: JSON.stringify(prompts),
    encoding: 'utf8',
    env: {
      ...process.env,
      SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
    },
    maxBuffer: 1024 * 1024 * 10,
  });
  if (result.status !== 0) {
    throw new Error(`Python scorer failed: ${result.stderr || result.stdout}`);
  }
  return JSON.parse(result.stdout) as PythonRow[];
}

function stratifiedHoldout(rows: readonly CorpusRow[], target = 40): CorpusRow[] {
  const groups = new Map<string, CorpusRow[]>();
  for (const row of rows) {
    const key = row.skill_top_1;
    groups.set(key, [...(groups.get(key) ?? []), row]);
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

describe('027/003 AC-1/AC-2 regression-protection parity and §11 gates', () => {
  it('preserves all Python-correct corpus decisions while improving accuracy', () => {
    const rows = loadCorpus();
    const python = runPython(rows.map((row) => row.prompt));
    const ts = rows.map((row) => scoreAdvisorPrompt(row.prompt, { workspaceRoot: WORKSPACE_ROOT }));

    let pythonCorrect = 0;
    let tsAlsoCorrect = 0;
    let regressions = 0;
    let tsAbstainsOnPythonCorrect = 0;
    let pythonIncorrect = 0;
    let tsImproves = 0;
    let tsCorrect = 0;
    let tsUnknown = 0;
    let goldNoneFalseFire = 0;

    for (const [index, row] of rows.entries()) {
      const gold = goldSkill(row);
      const pythonTop = python[index].top;
      const tsTop = ts[index].topSkill;
      if (tsTop === gold) tsCorrect += 1;
      if (tsTop === null) tsUnknown += 1;
      if (gold === null && tsTop !== null) goldNoneFalseFire += 1;

      if (pythonTop === gold) {
        pythonCorrect += 1;
        if (tsTop === gold) tsAlsoCorrect += 1;
        else regressions += 1;
        if (gold !== null && tsTop === null) tsAbstainsOnPythonCorrect += 1;
      } else {
        pythonIncorrect += 1;
        if (tsTop === gold) tsImproves += 1;
      }
    }

    const holdout = stratifiedHoldout(rows);
    const holdoutCorrect = holdout.filter((row) => (
      scoreAdvisorPrompt(row.prompt, { workspaceRoot: WORKSPACE_ROOT }).topSkill === goldSkill(row)
    )).length;

    const report = {
      pythonCorrect,
      tsAlsoCorrect,
      regressions,
      tsAbstainsOnPythonCorrect,
      pythonIncorrect,
      tsImproves,
      tsCorrect,
      tsAccuracy: Number((tsCorrect / rows.length).toFixed(4)),
      tsUnknown,
      goldNoneFalseFire,
      holdoutCorrect,
      holdoutAccuracy: Number((holdoutCorrect / holdout.length).toFixed(4)),
    };
    console.log(`advisor-parity-report ${JSON.stringify(report)}`);

    expect(tsAlsoCorrect).toBe(pythonCorrect);
    expect(regressions).toBe(0);
    expect(tsAbstainsOnPythonCorrect).toBe(0);
    expect(tsCorrect).toBeGreaterThanOrEqual(140);
    expect(tsUnknown).toBeLessThanOrEqual(10);
    expect(goldNoneFalseFire).toBeLessThanOrEqual(10);
    expect(holdoutCorrect).toBeGreaterThanOrEqual(28);
  });

  it('AC-4 ablation disabling lexical reduces corpus accuracy', () => {
    const rows = loadCorpus();
    const report = runLaneAblation({
      workspaceRoot: WORKSPACE_ROOT,
      cases: rows.map((row) => ({ prompt: row.prompt, expectedSkill: goldSkill(row) ?? 'UNKNOWN' }))
        .filter((row) => row.expectedSkill !== 'UNKNOWN'),
    });
    const lexical = report.lanes.find((lane) => lane.disabledLane === 'lexical');
    expect(lexical).toBeDefined();
    expect((lexical?.accuracy ?? 1)).toBeLessThan(report.baseline.accuracy);
  });
});
