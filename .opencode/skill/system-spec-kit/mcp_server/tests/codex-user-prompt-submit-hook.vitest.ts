import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  handleCodexUserPromptSubmit,
  parseCodexUserPromptSubmitInput,
  parseCodexUserPromptSubmitInputSources,
  type CodexUserPromptSubmitInput,
} from '../hooks/codex/user-prompt-submit.js';
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

async function runHook(input: CodexUserPromptSubmitInput, result: AdvisorHookResult) {
  const diagnostics = diagnosticsSink();
  const buildBrief = vi.fn(async () => result);
  const output = await handleCodexUserPromptSubmit(input, {
    buildBrief,
    renderBrief: renderAdvisorBrief,
    writeDiagnostic: diagnostics.writeDiagnostic,
  });
  return { output, buildBrief, diagnostics };
}

afterEach(() => {
  delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
});

describe('Codex UserPromptSubmit advisor hook', () => {
  it('AS1 emits JSON hookSpecificOutput.additionalContext for stdin payloads', async () => {
    const parsed = parseCodexUserPromptSubmitInputSources(JSON.stringify({
      session_id: 's1',
      hook_event_name: 'UserPromptSubmit',
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }), []);

    expect(parsed.diagnostics).toEqual({
      source: 'stdin',
      dualInputDetected: false,
    });

    const { output, buildBrief, diagnostics } = await runHook(
      parsed.input ?? {},
      fixture('livePassingSkill.json'),
    );

    expect(output).toEqual({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: 'Advisor: live; use sk-code-opencode 0.91/0.23 pass.',
      },
    });
    expect(buildBrief).toHaveBeenCalledWith('implement a TypeScript hook', {
      runtime: 'codex',
      workspaceRoot: '/workspace/project',
      subprocessTimeoutMs: 3000,
    });
    const diagnostic = parseDiagnostic(diagnostics.records[0] ?? '{}');
    expect(validateAdvisorHookDiagnosticRecord(diagnostic)).toBe(true);
    expect(diagnostic.runtime).toBe('codex');
    expect(diagnostics.records[0]).not.toMatch(/prompt|stdout|stderr|promptFingerprint|promptExcerpt/);
  });

  it('AS2 parses argv JSON when stdin is empty', async () => {
    const parsed = parseCodexUserPromptSubmitInputSources('', [
      '--event',
      JSON.stringify({
        sessionId: 's1',
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
      }),
    ]);

    expect(parsed.diagnostics).toEqual({
      source: 'argv',
      dualInputDetected: false,
    });

    const { output, buildBrief } = await runHook(parsed.input ?? {}, fixture('livePassingSkill.json'));
    expect(output).toHaveProperty('hookSpecificOutput.additionalContext');
    expect(buildBrief).toHaveBeenCalledWith('implement a TypeScript hook', {
      runtime: 'codex',
      workspaceRoot: '/workspace/project',
      subprocessTimeoutMs: 3000,
    });
  });

  it('AS3 prefers stdin when stdin and argv JSON are both present', async () => {
    const parsed = parseCodexUserPromptSubmitInputSources(
      JSON.stringify({
        prompt: 'stdin prompt wins',
        cwd: '/workspace/stdin',
      }),
      [
        JSON.stringify({
          prompt: 'argv prompt loses',
          cwd: '/workspace/argv',
        }),
      ],
    );

    expect(parsed.diagnostics).toEqual({
      source: 'stdin',
      dualInputDetected: true,
      reason: 'STDIN_ARGV_BOTH_PRESENT_USING_STDIN',
    });

    const { buildBrief } = await runHook(parsed.input ?? {}, fixture('livePassingSkill.json'));
    expect(buildBrief).toHaveBeenCalledWith('stdin prompt wins', {
      runtime: 'codex',
      workspaceRoot: '/workspace/stdin',
      subprocessTimeoutMs: 3000,
    });
  });

  it('AS4 fails open when stdin is unparseable even if argv JSON is valid', async () => {
    const parsed = parseCodexUserPromptSubmitInputSources('{not-json', [
      JSON.stringify({
        prompt: 'argv prompt must not mask stdin failure',
        cwd: '/workspace/argv',
      }),
    ]);
    const diagnostics = diagnosticsSink();

    const output = await handleCodexUserPromptSubmit(parsed.input, {
      writeDiagnostic: diagnostics.writeDiagnostic,
    });

    expect(parsed.diagnostics).toEqual({
      source: 'stdin',
      dualInputDetected: true,
      reason: 'STDIN_PARSE_FAILED',
    });
    expect(output).toEqual({});
    expect(parseDiagnostic(diagnostics.records[0] ?? '{}').errorCode).toBe('PARSE_FAIL');
  });

  it('AS5 emits {} when the rendered brief is null or the hook is disabled', async () => {
    const skipped = await runHook({
      prompt: '/help',
      cwd: '/workspace/project',
    }, fixture('skippedShortCasual.json'));
    expect(skipped.output).toEqual({});

    process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = '1';
    const diagnostics = diagnosticsSink();
    const buildBrief = vi.fn(async () => fixture('livePassingSkill.json'));
    const disabled = await handleCodexUserPromptSubmit({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, {
      buildBrief,
      writeDiagnostic: diagnostics.writeDiagnostic,
    });

    expect(disabled).toEqual({});
    expect(buildBrief).not.toHaveBeenCalled();
    expect(validateAdvisorHookDiagnosticRecord(parseDiagnostic(diagnostics.records[0] ?? '{}'))).toBe(true);
  });

  it('AS6 normalizes Codex JSON additionalContext via the 005 comparator', async () => {
    const { output } = await runHook({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'));

    expect(normalizeRuntimeOutput('codex', output)).toEqual({
      runtime: 'codex',
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
      const output = await handleCodexUserPromptSubmit({
        sessionId: `s-${index}`,
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

  it('T012 preserves direct parse helper compatibility', () => {
    expect(parseCodexUserPromptSubmitInput('{not-json')).toBeNull();
    expect(parseCodexUserPromptSubmitInput('{"prompt":"hello"}')).toEqual({ prompt: 'hello' });
  });

  it('execs the compiled Codex hook and emits non-empty additionalContext', () => {
    const workspaceRoot = resolve(import.meta.dirname, '../../../../..');
    const hookPath = join(workspaceRoot, '.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js');
    const result = spawnSync(process.execPath, [hookPath], {
      cwd: workspaceRoot,
      input: JSON.stringify({
        prompt: 'implement TypeScript hook remediation',
        cwd: workspaceRoot,
      }),
      encoding: 'utf8',
      env: {
        ...process.env,
        SPECKIT_CODEX_HOOK_TIMEOUT_MS: '3000',
      },
      timeout: 10000,
      maxBuffer: 1024 * 1024,
    });

    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout) as {
      hookSpecificOutput?: {
        additionalContext?: string;
      };
    };
    expect(parsed.hookSpecificOutput?.additionalContext).toBeTruthy();
    expect(parsed.hookSpecificOutput?.additionalContext?.trim().length).toBeGreaterThan(0);
  });
});
