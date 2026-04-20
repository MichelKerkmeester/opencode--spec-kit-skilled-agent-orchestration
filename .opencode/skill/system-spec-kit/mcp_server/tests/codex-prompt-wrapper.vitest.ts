import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  createCodexWrappedPrompt,
  handleCodexPromptWrapper,
} from '../hooks/codex/prompt-wrapper.js';
import { normalizeRuntimeOutput } from '../skill-advisor/lib/normalize-adapter-output.js';
import { renderAdvisorBrief } from '../skill-advisor/lib/render.js';
import type { AdvisorHookResult } from '../skill-advisor/lib/skill-advisor-brief.js';

const fixturesDir = join(import.meta.dirname, 'advisor-fixtures');

function fixture(name: string): AdvisorHookResult {
  return JSON.parse(readFileSync(join(fixturesDir, name), 'utf8')) as AdvisorHookResult;
}

function unavailablePolicy() {
  return {
    hooks: 'unavailable' as const,
    probedAt: '2026-04-19T10:00:00.000Z',
    diagnostics: {
      probeDurationMs: 1,
      reason: 'fixture',
    },
  };
}

function livePolicy() {
  return {
    hooks: 'live' as const,
    probedAt: '2026-04-19T10:00:00.000Z',
    diagnostics: {
      probeDurationMs: 1,
    },
  };
}

describe('Codex prompt-wrapper fallback', () => {
  it('wraps outgoing prompt only when hook policy is unavailable', async () => {
    const buildBrief = vi.fn(async () => fixture('livePassingSkill.json'));
    const output = await handleCodexPromptWrapper({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, {
      buildBrief,
      renderBrief: renderAdvisorBrief,
      detectPolicy: unavailablePolicy,
      writeDiagnostic: () => undefined,
    });

    expect(output).toEqual({
      promptWrapper: 'Advisor: live; use sk-code-opencode 0.91/0.23 pass.',
      wrappedPrompt: '<!-- advisor brief: Advisor: live; use sk-code-opencode 0.91/0.23 pass. -->\nimplement a TypeScript hook',
    });
    expect(normalizeRuntimeOutput('codex', output)).toEqual({
      runtime: 'codex',
      transport: 'prompt_wrapper',
      additionalContext: 'Advisor: live; use sk-code-opencode 0.91/0.23 pass.',
      stderrVisible: false,
    });
    expect(buildBrief).toHaveBeenCalledWith('implement a TypeScript hook', {
      runtime: 'codex',
      workspaceRoot: '/workspace/project',
    });
  });

  it('does not wrap when native Codex hooks are live', async () => {
    const buildBrief = vi.fn(async () => fixture('livePassingSkill.json'));
    const output = await handleCodexPromptWrapper({
      prompt: 'implement a TypeScript hook',
      cwd: '/workspace/project',
    }, {
      buildBrief,
      detectPolicy: livePolicy,
      writeDiagnostic: () => undefined,
    });

    expect(output).toEqual({});
    expect(buildBrief).not.toHaveBeenCalled();
  });

  it('does not modify prompt when no brief is rendered', async () => {
    const output = await handleCodexPromptWrapper({
      prompt: '/help',
      cwd: '/workspace/project',
    }, {
      buildBrief: vi.fn(async () => fixture('skippedShortCasual.json')),
      renderBrief: renderAdvisorBrief,
      detectPolicy: unavailablePolicy,
      writeDiagnostic: () => undefined,
    });

    expect(output).toEqual({});
  });

  it('uses the markdown-comment preamble format', () => {
    expect(createCodexWrappedPrompt('hello', 'Advisor: live; use sk-code-opencode 0.91/0.23 pass.'))
      .toBe('<!-- advisor brief: Advisor: live; use sk-code-opencode 0.91/0.23 pass. -->\nhello');
  });
});
