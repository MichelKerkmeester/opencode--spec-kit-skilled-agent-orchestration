import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  handleClaudeUserPromptSubmit,
  parseClaudeUserPromptSubmitInput,
  type ClaudeUserPromptSubmitInput,
} from '../hooks/claude/user-prompt-submit.js';
import { normalizeRuntimeOutput } from '../skill_advisor/lib/normalize-adapter-output.js';
import { renderAdvisorBrief } from '../skill_advisor/lib/render.js';
import { validateAdvisorHookDiagnosticRecord } from '../skill_advisor/lib/metrics.js';
import type { AdvisorHookResult } from '../skill_advisor/lib/skill-advisor-brief.js';

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

async function runHook(input: ClaudeUserPromptSubmitInput, result: AdvisorHookResult) {
  const diagnostics = diagnosticsSink();
  const buildBrief = vi.fn(async () => result);
  const output = await handleClaudeUserPromptSubmit(input, {
    buildBrief,
    renderBrief: renderAdvisorBrief,
    writeDiagnostic: diagnostics.writeDiagnostic,
  });
  return { output, buildBrief, diagnostics };
}

afterEach(() => {
  delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
});

describe('Claude UserPromptSubmit advisor hook', () => {
  it('AS1 emits hookSpecificOutput.additionalContext for a work-intent prompt', async () => {
    const { output, buildBrief, diagnostics } = await runHook({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
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
      runtime: 'claude',
      workspaceRoot: '/workspace/project',
    });
    expect(diagnostics.records).toHaveLength(1);
    const diagnostic = parseDiagnostic(diagnostics.records[0] ?? '{}');
    expect(validateAdvisorHookDiagnosticRecord(diagnostic)).toBe(true);
    expect(diagnostic.runtime).toBe('claude');
    expect(diagnostic.status).toBe('ok');
    expect(diagnostics.records[0]).not.toMatch(/prompt|stdout|stderr|promptFingerprint|promptExcerpt/);
  });

  it('AS2 emits {} for an empty prompt skipped by the producer', async () => {
    const { output, buildBrief } = await runHook({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: '',
      cwd: '/workspace/project',
    }, fixture('skipPolicyEmptyPrompt.json'));

    expect(output).toEqual({});
    expect(buildBrief).toHaveBeenCalledTimes(1);
  });

  it('AS3 emits {} for /help skipped by the producer', async () => {
    const { output, buildBrief } = await runHook({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: '/help',
      cwd: '/workspace/project',
    }, fixture('skipPolicyCommandOnly.json'));

    expect(output).toEqual({});
    expect(buildBrief).toHaveBeenCalledTimes(1);
  });

  it('AS4 respects SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 without calling the producer', async () => {
    process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = '1';
    const diagnostics = diagnosticsSink();
    const buildBrief = vi.fn(async () => fixture('livePassingSkill.json'));

    const output = await handleClaudeUserPromptSubmit({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
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

  it('AS5 emits {} for invalid JSON stdin without throwing', async () => {
    const diagnostics = diagnosticsSink();
    const input = parseClaudeUserPromptSubmitInput('{not-json');

    const output = await handleClaudeUserPromptSubmit(input, {
      writeDiagnostic: diagnostics.writeDiagnostic,
    });

    expect(input).toBeNull();
    expect(output).toEqual({});
    const diagnostic = parseDiagnostic(diagnostics.records[0] ?? '{}');
    expect(diagnostic.status).toBe('fail_open');
    expect(diagnostic.errorCode).toBe('PARSE_FAIL');
    expect(validateAdvisorHookDiagnosticRecord(diagnostic)).toBe(true);
  });

  it('AS6 emits {} for producer timeout/fail-open and never emits a block decision', async () => {
    const result = fixture('failOpenTimeout.json');
    result.diagnostics = {
      errorCode: 'TIMEOUT',
      errorClass: 'timeout',
      errorMessage: 'timed out after 1000ms\nsee logs',
    };
    const { output, diagnostics } = await runHook({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, result);

    expect(output).toEqual({});
    expect(JSON.stringify(output)).not.toMatch(/"decision"\s*:\s*"(block|deny)"/);
    const diagnostic = parseDiagnostic(diagnostics.records[0] ?? '{}');
    expect(diagnostic.status).toBe('fail_open');
    expect(diagnostic.errorCode).toBe('TIMEOUT');
    expect(diagnostic.errorDetails).toBe('timed out after 1000ms see logs');
  });

  it('CHK-021 emits {} for Python-missing fail-open', async () => {
    const result = fixture('failOpenTimeout.json');
    result.diagnostics = { errorCode: 'PYTHON_MISSING' };
    const { output, diagnostics } = await runHook({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, result);

    expect(output).toEqual({});
    const diagnostic = parseDiagnostic(diagnostics.records[0] ?? '{}');
    expect(diagnostic.status).toBe('fail_open');
    expect(diagnostic.errorCode).toBe('PYTHON_MISSING');
  });

  it('CHK-028 keeps adapter cache-hit p95 under 60 ms with cached producer output', async () => {
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
      const output = await handleClaudeUserPromptSubmit({
        session_id: `s-${index}`,
        hook_event_name: 'UserPromptSubmit',
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

  it('T014 normalizes Claude JSON additionalContext via the 005 comparator', async () => {
    const { output } = await runHook({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'));

    expect(normalizeRuntimeOutput('claude', output)).toEqual({
      runtime: 'claude',
      transport: 'json_additional_context',
      additionalContext: 'Advisor: live; use sk-code-opencode 0.91/0.23 pass.',
      stderrVisible: false,
    });
  });
});
