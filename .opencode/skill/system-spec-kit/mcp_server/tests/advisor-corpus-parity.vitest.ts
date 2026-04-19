import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildSkillAdvisorBrief,
  clearAdvisorBriefCacheForTests,
} from '../lib/skill-advisor/skill-advisor-brief.js';

interface CorpusRow {
  readonly id: string;
  readonly prompt: string;
}

interface DirectAdvisorBatchRow {
  readonly prompt: string;
  readonly recommendations: readonly {
    readonly skill: string;
    readonly confidence: number;
  }[];
}

interface ParityMismatch {
  readonly id: string;
  readonly prompt: string;
  readonly cli_top_1: string | null;
  readonly hook_top_1: string | null;
  readonly confidenceDelta: number | null;
}

const workspaceRoot = resolve(import.meta.dirname, '../../../../..');
const corpusPath = join(
  workspaceRoot,
  '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl',
);
const advisorScriptPath = join(workspaceRoot, '.opencode/skill/skill-advisor/scripts/skill_advisor.py');

function loadCorpus(): CorpusRow[] {
  return readFileSync(corpusPath, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as CorpusRow);
}

function directCliBatch(rows: readonly CorpusRow[]): DirectAdvisorBatchRow[] {
  const tempDir = mkdtempSync(join(tmpdir(), 'advisor-corpus-'));
  const batchPath = join(tempDir, 'prompts.txt');
  try {
    writeFileSync(batchPath, rows.map((row) => row.prompt).join('\n'), 'utf8');
    const output = execFileSync('python3', [
      advisorScriptPath,
      '--batch-file',
      batchPath,
    ], {
      cwd: workspaceRoot,
      env: {
        ...process.env,
        SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
      },
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 120_000,
    });
    return JSON.parse(output) as DirectAdvisorBatchRow[];
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('advisor 200-prompt corpus parity', () => {
  it('matches direct CLI top-1 for every labeled corpus prompt', async () => {
    const previousSemantic = process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC;
    process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
    clearAdvisorBriefCacheForTests();

    try {
      const rows = loadCorpus();
      expect(rows).toHaveLength(200);
      const directRows = directCliBatch(rows);
      expect(directRows).toHaveLength(rows.length);

      const mismatches: ParityMismatch[] = [];
      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];
        const cliRecommendation = directRows[index]?.recommendations[0] ?? null;
        const hook = await buildSkillAdvisorBrief(row.prompt, {
          workspaceRoot,
          runtime: 'codex',
        });
        const hookRecommendation = hook.recommendations[0] ?? null;
        const confidenceDelta = cliRecommendation && hookRecommendation
          ? Number(Math.abs(cliRecommendation.confidence - hookRecommendation.confidence).toFixed(6))
          : null;
        if ((cliRecommendation?.skill ?? null) !== (hookRecommendation?.skill ?? null)) {
          mismatches.push({
            id: row.id,
            prompt: row.prompt,
            cli_top_1: cliRecommendation?.skill ?? null,
            hook_top_1: hookRecommendation?.skill ?? null,
            confidenceDelta,
          });
        }
      }

      expect(mismatches, JSON.stringify(mismatches.slice(0, 10), null, 2)).toEqual([]);
    } finally {
      if (previousSemantic === undefined) {
        delete process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC;
      } else {
        process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = previousSemantic;
      }
    }
  }, 120_000);
});
