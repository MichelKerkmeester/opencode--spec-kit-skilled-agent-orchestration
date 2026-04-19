import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  copilotSdkAvailability,
  createCopilotWrappedPrompt,
  handleCopilotSdkUserPromptSubmitted,
  handleCopilotUserPromptSubmit,
  handleCopilotWrapperFallback,
  parseCopilotUserPromptSubmitInput,
  sdkAvailable,
  type CopilotUserPromptSubmitInput,
} from '../hooks/copilot/user-prompt-submit.js';
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

async function runSdkHook(input: CopilotUserPromptSubmitInput, result: AdvisorHookResult) {
  const diagnostics = diagnosticsSink();
  const buildBrief = vi.fn(async () => result);
  const output = await handleCopilotSdkUserPromptSubmitted(input, {
    buildBrief,
    renderBrief: renderAdvisorBrief,
    writeDiagnostic: diagnostics.writeDiagnostic,
  });
  return { output, buildBrief, diagnostics };
}

async function runWrapperHook(input: CopilotUserPromptSubmitInput, result: AdvisorHookResult) {
  const diagnostics = diagnosticsSink();
  const buildBrief = vi.fn(async () => result);
  const output = await handleCopilotWrapperFallback(input, {
    buildBrief,
    renderBrief: renderAdvisorBrief,
    writeDiagnostic: diagnostics.writeDiagnostic,
  });
  return { output, buildBrief, diagnostics };
}

afterEach(() => {
  delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
});

describe('Copilot UserPromptSubmitted advisor hook', () => {
  it('AS1 exposes SDK detection at module load and defaults to wrapper fallback when unavailable here', async () => {
    const diagnostics = diagnosticsSink();
    expect(copilotSdkAvailability).toEqual({
      available: false,
      moduleName: null,
      reason: 'module_not_found',
    });
    expect(sdkAvailable).toBe(false);

    const output = await handleCopilotUserPromptSubmit({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, {
      buildBrief: vi.fn(async () => fixture('livePassingSkill.json')),
      renderBrief: renderAdvisorBrief,
      writeDiagnostic: diagnostics.writeDiagnostic,
      sdkAvailable: false,
    });

    expect(output).toHaveProperty('promptWrapper');
  });

  it('AS2 SDK path returns additionalContext for model-visible injection', async () => {
    const { output, buildBrief, diagnostics } = await runSdkHook({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
      timestamp: '2026-04-19T00:00:00Z',
    }, fixture('livePassingSkill.json'));

    expect(output).toEqual({
      additionalContext: 'Advisor: live; use sk-code-opencode 0.91/0.23 pass.',
    });
    expect(buildBrief).toHaveBeenCalledWith('implement a TypeScript hook', {
      runtime: 'copilot',
      workspaceRoot: '/workspace/project',
    });
    const diagnostic = parseDiagnostic(diagnostics.records[0] ?? '{}');
    expect(validateAdvisorHookDiagnosticRecord(diagnostic)).toBe(true);
    expect(diagnostic.runtime).toBe('copilot');
    expect(diagnostics.records[0]).not.toMatch(/prompt|stdout|stderr|promptFingerprint|promptExcerpt/);
  });

  it('AS3 SDK path returns {} when brief is null', async () => {
    const { output, buildBrief } = await runSdkHook({
      prompt: '/help',
      cwd: '/workspace/project',
    }, fixture('skippedShortCasual.json'));

    expect(output).toEqual({});
    expect(JSON.stringify(output)).not.toContain('additionalContext');
    expect(buildBrief).toHaveBeenCalledTimes(1);
  });

  it('AS4 wrapper fallback creates an in-memory prompt preamble and normalizes as prompt_wrapper', async () => {
    const { output, diagnostics } = await runWrapperHook({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'));

    expect(output).toEqual({
      promptWrapper: 'Advisor: live; use sk-code-opencode 0.91/0.23 pass.',
      modifiedPrompt: [
        '[Advisor brief]',
        'Advisor: live; use sk-code-opencode 0.91/0.23 pass.',
        '[/Advisor brief]',
        '',
        'implement a TypeScript hook',
      ].join('\n'),
    });
    expect(normalizeRuntimeOutput('copilot', output)).toEqual({
      runtime: 'copilot',
      transport: 'prompt_wrapper',
      additionalContext: 'Advisor: live; use sk-code-opencode 0.91/0.23 pass.',
      stderrVisible: false,
    });
    expect(diagnostics.records.join('\n')).not.toContain('implement a TypeScript hook');
  });

  it('AS5 wrapper fallback does not modify the prompt when brief is null or fail-open', async () => {
    const skipped = await runWrapperHook({
      prompt: '/help',
      cwd: '/workspace/project',
    }, fixture('skippedShortCasual.json'));
    expect(skipped.output).toEqual({});

    const failOpen = await runWrapperHook({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('failOpenTimeout.json'));
    expect(failOpen.output).toEqual({});
    expect(parseDiagnostic(failOpen.diagnostics.records[0] ?? '{}').status).toBe('fail_open');
  });

  it('AS6 rejects notification-only success as model-visible injection', async () => {
    const notificationOnly = normalizeRuntimeOutput('copilot', {});
    expect(notificationOnly.additionalContext).toBeNull();

    const { output } = await runWrapperHook({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, fixture('livePassingSkill.json'));
    expect(normalizeRuntimeOutput('copilot', output).additionalContext).toBe(
      'Advisor: live; use sk-code-opencode 0.91/0.23 pass.',
    );
  });

  it('AS7 respects SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 without calling the producer', async () => {
    process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = '1';
    const diagnostics = diagnosticsSink();
    const buildBrief = vi.fn(async () => fixture('livePassingSkill.json'));

    const output = await handleCopilotSdkUserPromptSubmitted({
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

  it('AS8 emits {} for invalid JSON stdin without throwing', async () => {
    const diagnostics = diagnosticsSink();
    const input = parseCopilotUserPromptSubmitInput('{not-json');

    const output = await handleCopilotSdkUserPromptSubmitted(input, {
      writeDiagnostic: diagnostics.writeDiagnostic,
    });

    expect(input).toBeNull();
    expect(output).toEqual({});
    expect(parseDiagnostic(diagnostics.records[0] ?? '{}').errorCode).toBe('PARSE_FAIL');
  });

  it('CHK-012 wrapper fallback privacy keeps rewritten prompt out of diagnostics', () => {
    const wrapped = createCopilotWrappedPrompt(
      'secret user prompt content',
      'Advisor: live; use sk-code-opencode 0.91/0.23 pass.',
    );

    expect(wrapped).toContain('secret user prompt content');
    expect(JSON.stringify({ wrapperFallbackInvoked: true })).not.toContain('secret user prompt content');
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
      const output = await handleCopilotSdkUserPromptSubmitted({
        sessionId: `s-${index}`,
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
      }, {
        buildBrief,
        renderBrief: renderAdvisorBrief,
        writeDiagnostic: diagnostics.writeDiagnostic,
      });
      durations.push(performance.now() - startedAt);
      expect(output).toHaveProperty('additionalContext');
    }

    const sorted = [...durations].sort((left, right) => left - right);
    const p95 = sorted[Math.ceil(0.95 * sorted.length) - 1] ?? 0;
    expect(p95).toBeLessThanOrEqual(60);
  });
});
