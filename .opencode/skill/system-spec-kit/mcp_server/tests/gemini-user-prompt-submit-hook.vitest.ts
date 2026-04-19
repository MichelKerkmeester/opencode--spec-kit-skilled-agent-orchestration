import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  handleGeminiUserPromptSubmit,
  parseGeminiUserPromptSubmitInput,
  type GeminiUserPromptSubmitInput,
} from '../hooks/gemini/user-prompt-submit.js';
import { normalizeRuntimeOutput } from '../lib/skill-advisor/normalize-adapter-output.js';
import { renderAdvisorBrief } from '../lib/skill-advisor/render.js';
import { validateAdvisorHookDiagnosticRecord } from '../lib/skill-advisor/metrics.js';
import type { AdvisorHookResult } from '../lib/skill-advisor/skill-advisor-brief.js';

const fixturesDir = join(import.meta.dirname, 'advisor-fixtures');

function fixture(name: string): AdvisorHookResult {
  return JSON.parse(readFileSync(join(fixturesDir, name), 'utf8')) as AdvisorHookResult;
}

function diagnosticsSink(): { records: string[]; writeDiagnostic: (line: string) => void } {
  const records: string[] = [];
  return {
    records,
    writeDiagnostic: (line: string) => records.push(line),
  };
}

function parseDiagnostic(line: string): Record<string, unknown> {
  return JSON.parse(line) as Record<string, unknown>;
}

async function runHook(input: GeminiUserPromptSubmitInput, result: AdvisorHookResult) {
  const diagnostics = diagnosticsSink();
  const buildBrief = vi.fn(async () => result);
  const output = await handleGeminiUserPromptSubmit(input, {
    buildBrief,
    renderBrief: renderAdvisorBrief,
    writeDiagnostic: diagnostics.writeDiagnostic,
  });
  return { output, buildBrief, diagnostics };
}

afterEach(() => {
  delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
});

describe('Gemini UserPromptSubmit advisor hook', () => {
  it('AS1 emits JSON hookSpecificOutput.additionalContext for schema-v1 prompt payloads', async () => {
    const { output, buildBrief, diagnostics } = await runHook({
      session_id: 's1',
      hook_event_name: 'BeforeAgent',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'));

    expect(output).toEqual({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: 'Advisor: live; use sk-code-opencode 0.91/0.23 pass.',
      },
    });
    expect(buildBrief).toHaveBeenCalledWith('implement a TypeScript hook', {
      runtime: 'gemini',
      workspaceRoot: '/workspace/project',
    });
    const diagnostic = parseDiagnostic(diagnostics.records[0] ?? '{}');
    expect(validateAdvisorHookDiagnosticRecord(diagnostic)).toBe(true);
    expect(diagnostic.runtime).toBe('gemini');
    expect(diagnostics.records[0]).not.toMatch(/prompt|stdout|stderr|promptFingerprint|promptExcerpt/);
  });

  it('AS2 emits the same JSON additionalContext for schema-v2 request.prompt payloads', async () => {
    const { output, buildBrief } = await runHook({
      session_id: 's1',
      hook_event_name: 'BeforeAgent',
      request: {
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
      },
    }, fixture('livePassingSkill.json'));

    expect(output).toHaveProperty('hookSpecificOutput.additionalContext');
    expect(buildBrief).toHaveBeenCalledWith('implement a TypeScript hook', {
      runtime: 'gemini',
      workspaceRoot: '/workspace/project',
    });
  });

  it('AS3 emits {} with no additionalContext key when the rendered brief is null', async () => {
    const { output, buildBrief } = await runHook({
      session_id: 's1',
      hook_event_name: 'BeforeAgent',
      prompt: '/help',
      cwd: '/workspace/project',
    }, fixture('skippedShortCasual.json'));

    expect(output).toEqual({});
    expect(JSON.stringify(output)).not.toContain('additionalContext');
    expect(buildBrief).toHaveBeenCalledTimes(1);
  });

  it('AS4 respects SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 without calling the producer', async () => {
    process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = '1';
    const diagnostics = diagnosticsSink();
    const buildBrief = vi.fn(async () => fixture('livePassingSkill.json'));

    const output = await handleGeminiUserPromptSubmit({
      session_id: 's1',
      hook_event_name: 'BeforeAgent',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, {
      buildBrief,
      writeDiagnostic: diagnostics.writeDiagnostic,
    });

    expect(output).toEqual({});
    expect(buildBrief).not.toHaveBeenCalled();
    expect(validateAdvisorHookDiagnosticRecord(parseDiagnostic(diagnostics.records[0] ?? '{}'))).toBe(true);
  });

  it('AS5 emits {} for invalid JSON and unknown schema without throwing', async () => {
    const invalidDiagnostics = diagnosticsSink();
    const input = parseGeminiUserPromptSubmitInput('{not-json');
    const invalidOutput = await handleGeminiUserPromptSubmit(input, {
      writeDiagnostic: invalidDiagnostics.writeDiagnostic,
    });

    expect(input).toBeNull();
    expect(invalidOutput).toEqual({});
    expect(parseDiagnostic(invalidDiagnostics.records[0] ?? '{}').errorCode).toBe('PARSE_FAIL');

    const unknownDiagnostics = diagnosticsSink();
    const unknownOutput = await handleGeminiUserPromptSubmit({
      session_id: 's1',
      hook_event_name: 'BeforeAgent',
      cwd: '/workspace/project',
    }, {
      writeDiagnostic: unknownDiagnostics.writeDiagnostic,
    });
    expect(unknownOutput).toEqual({});
    expect(parseDiagnostic(unknownDiagnostics.records[0] ?? '{}').errorDetails).toBe('GEMINI_UNKNOWN_SCHEMA');
  });

  it('AS6 emits {} for producer timeout/fail-open and normalizes via the 005 comparator', async () => {
    const failOpen = await runHook({
      session_id: 's1',
      hook_event_name: 'BeforeAgent',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('failOpenTimeout.json'));

    expect(failOpen.output).toEqual({});
    expect(parseDiagnostic(failOpen.diagnostics.records[0] ?? '{}').status).toBe('fail_open');

    const live = await runHook({
      session_id: 's1',
      hook_event_name: 'BeforeAgent',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'));
    expect(normalizeRuntimeOutput('gemini', live.output)).toEqual({
      runtime: 'gemini',
      transport: 'json_additional_context',
      additionalContext: 'Advisor: live; use sk-code-opencode 0.91/0.23 pass.',
      stderrVisible: false,
    });
  });

  it('CHK-008 keeps adapter cache-hit p95 under 60 ms with cached producer output', async () => {
    const result = fixture('livePassingSkill.json');
    result.metrics = {
      ...result.metrics,
      cacheHit: true,
      durationMs: 1,
    };
    const buildBrief = vi.fn(async () => result);
    const durations: number[] = [];

    for (let index = 0; index < 30; index += 1) {
      const diagnostics = diagnosticsSink();
      const startedAt = performance.now();
      const output = await handleGeminiUserPromptSubmit({
        session_id: `s-${index}`,
        hook_event_name: 'BeforeAgent',
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
      }, {
        buildBrief,
        renderBrief: renderAdvisorBrief,
        writeDiagnostic: diagnostics.writeDiagnostic,
      });
      durations.push(performance.now() - startedAt);
      expect(output).toHaveProperty('hookSpecificOutput');
    }

    const sorted = [...durations].sort((left, right) => left - right);
    const p95 = sorted[Math.ceil(0.95 * sorted.length) - 1] ?? 0;
    expect(p95).toBeLessThanOrEqual(60);
  });
});
