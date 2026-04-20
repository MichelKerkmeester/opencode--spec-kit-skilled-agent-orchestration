import { execFileSync } from 'node:child_process';
import {
  readFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';

interface CorpusRow {
  readonly id: string;
  readonly prompt: string;
  readonly skill_top_1: string;
}

interface ParityRegression {
  readonly id: string;
  readonly prompt: string;
  readonly expected_top_1: string | null;
  readonly cli_top_1: string | null;
  readonly hook_top_1: string | null;
}

const workspaceRoot = resolve(import.meta.dirname, '../../../../../../..');
const corpusPath = join(
  workspaceRoot,
  '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl',
);
function loadCorpus(): CorpusRow[] {
  return readFileSync(corpusPath, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as CorpusRow);
}

function directPythonTopSkills(rows: readonly CorpusRow[]): Array<string | null> {
  const script = `
import importlib.util, json, os, sys
workspace = sys.argv[1]
path = os.path.join(workspace, '.opencode/skill/skill-advisor/scripts/skill_advisor.py')
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
  const output = execFileSync('python3', ['-c', script, workspaceRoot], {
    input: JSON.stringify(rows.map((row) => row.prompt)),
    cwd: workspaceRoot,
    env: {
      ...process.env,
      SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
    },
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
    timeout: 120_000,
  });
  return JSON.parse(output) as Array<string | null>;
}

function goldSkill(row: CorpusRow): string | null {
  return row.skill_top_1 === 'none' ? null : row.skill_top_1;
}

describe('advisor 200-prompt corpus regression-protection parity', () => {
  it('preserves Python-correct top-1 decisions while allowing native improvements', async () => {
    const previousSemantic = process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC;
    process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';

    try {
      const rows = loadCorpus();
      expect(rows).toHaveLength(200);
      const pythonTopSkills = directPythonTopSkills(rows);
      expect(pythonTopSkills).toHaveLength(rows.length);

      const regressions: ParityRegression[] = [];
      let pythonCorrect = 0;
      let hookPreservedPythonCorrect = 0;
      let pythonGoldNoneFalseFire = 0;
      let hookGoldNoneFalseFire = 0;
      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];
        const expected = goldSkill(row);
        const cliTopSkill = pythonTopSkills[index] ?? null;
        const hookTopSkill = scoreAdvisorPrompt(row.prompt, { workspaceRoot }).topSkill;
        if (expected === null && cliTopSkill !== null) {
          pythonGoldNoneFalseFire += 1;
        }
        if (expected === null && hookTopSkill !== null) {
          hookGoldNoneFalseFire += 1;
        }
        if (cliTopSkill === expected) {
          pythonCorrect += 1;
          if (hookTopSkill === expected) {
            hookPreservedPythonCorrect += 1;
          } else {
            regressions.push({
              id: row.id,
              prompt: row.prompt,
              expected_top_1: expected,
              cli_top_1: cliTopSkill,
              hook_top_1: hookTopSkill,
            });
          }
        }
      }

      expect(hookPreservedPythonCorrect).toBe(pythonCorrect);
      expect(hookGoldNoneFalseFire).toBeLessThanOrEqual(pythonGoldNoneFalseFire);
      expect(regressions, JSON.stringify(regressions.slice(0, 10), null, 2)).toEqual([]);
    } finally {
      if (previousSemantic === undefined) {
        delete process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC;
      } else {
        process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = previousSemantic;
      }
    }
  }, 240_000);
});
