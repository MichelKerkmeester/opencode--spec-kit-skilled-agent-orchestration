import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { handleClaudeUserPromptSubmit } from '../../../hooks/claude/user-prompt-submit.js';
import { handleGeminiUserPromptSubmit } from '../../../hooks/gemini/user-prompt-submit.js';
import {
  handleCopilotSdkUserPromptSubmitted,
  handleCopilotWrapperFallback,
} from '../../../hooks/copilot/user-prompt-submit.js';
import { handleCodexUserPromptSubmit } from '../../../hooks/codex/user-prompt-submit.js';
import {
  normalizeRuntimeOutput,
  type NormalizedAdvisorRuntimeOutput,
} from '../../lib/normalize-adapter-output.js';
import { renderAdvisorBrief } from '../../lib/render.js';
import type {
  AdvisorHookResult,
  AdvisorRuntime,
} from '../../lib/skill-advisor-brief.js';
import { buildSkillAdvisorBrief } from '../../lib/skill-advisor-brief.js';

const mockedBridge = vi.hoisted(() => ({
  spawn: vi.fn(),
}));

vi.mock('node:child_process', () => ({
  spawn: mockedBridge.spawn,
}));

export const RUNTIMES = ['claude', 'gemini', 'copilot', 'codex'] as const;
type RuntimeId = (typeof RUNTIMES)[number];
type RuntimeVariant = RuntimeId | 'copilot-wrapper' | 'opencode-plugin';
type SpecKitSkillAdvisorPluginFactory = (
  context: { directory: string },
  options: { sourceSignatureOverride: string },
) => Promise<{ onUserPromptSubmitted: (input: unknown) => Promise<unknown> }>;

const fixturesDir = join(import.meta.dirname, 'advisor-fixtures');
const CANONICAL_FIXTURES = [
  'livePassingSkill.json',
  'staleHighConfidenceSkill.json',
  'noPassingSkill.json',
  'failOpenTimeout.json',
  'skippedShortCasual.json',
  'ambiguousTopTwo.json',
] as const;

function fixture(name: string): AdvisorHookResult {
  return JSON.parse(readFileSync(join(fixturesDir, name), 'utf8')) as AdvisorHookResult;
}

function runtimeForVariant(variant: RuntimeVariant): AdvisorRuntime {
  if (variant === 'copilot-wrapper' || variant === 'opencode-plugin') {
    return 'copilot';
  }
  return variant;
}

function promptInput(runtime: RuntimeId) {
  switch (runtime) {
    case 'claude':
      return {
        session_id: 's1',
        hook_event_name: 'UserPromptSubmit',
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
      };
    case 'gemini':
      return {
        session_id: 's1',
        hook_event_name: 'BeforeAgent',
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
      };
    case 'copilot':
      return {
        sessionId: 's1',
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
      };
    case 'codex':
      return {
        session_id: 's1',
        hook_event_name: 'UserPromptSubmit',
        prompt: 'implement a TypeScript hook',
        cwd: '/workspace/project',
      };
    default: {
      const exhaustive: never = runtime;
      return exhaustive;
    }
  }
}

function makePluginChild(result: AdvisorHookResult) {
  const child = new EventEmitter() as EventEmitter & {
    stdout: EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
    stderr: EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
    stdin: { end: ReturnType<typeof vi.fn> };
  };
  child.stdout = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
  child.stderr = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
  child.stdout.setEncoding = vi.fn();
  child.stderr.setEncoding = vi.fn();
  child.stdin = { end: vi.fn() };
  queueMicrotask(() => {
    child.stdout.emit('data', JSON.stringify({
      brief: renderAdvisorBrief(result),
      status: result.status,
      metadata: {
        freshness: result.freshness,
        durationMs: result.metrics.durationMs,
        cacheHit: result.metrics.cacheHit,
        subprocessInvoked: result.metrics.subprocessInvoked,
        recommendationCount: result.metrics.recommendationCount,
        tokenCap: result.metrics.tokenCap,
      },
    }));
    child.emit('close', 0);
  });
  return child;
}

function makeAdvisorSubprocessChild() {
  const child = new EventEmitter() as EventEmitter & {
    stdout: EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
    stderr: EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
    stdin: {
      write: ReturnType<typeof vi.fn>;
      end: ReturnType<typeof vi.fn>;
    };
    kill: ReturnType<typeof vi.fn>;
  };
  child.stdout = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
  child.stderr = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
  child.stdout.setEncoding = vi.fn();
  child.stderr.setEncoding = vi.fn();
  child.stdin = {
    write: vi.fn(),
    end: vi.fn(),
  };
  child.kill = vi.fn();
  queueMicrotask(() => {
    child.stdout.emit('data', JSON.stringify([{
      skill: 'sk-code-opencode',
      confidence: 0.91,
      uncertainty: 0.1,
      passes_threshold: true,
    }]));
    child.emit('close', 0, null);
  });
  return child;
}

async function runRuntimeVariant(
  variant: RuntimeVariant,
  result: AdvisorHookResult,
): Promise<NormalizedAdvisorRuntimeOutput> {
  const runtime = runtimeForVariant(variant);
  const buildBrief = vi.fn(async () => result);
  const dependencies = {
    buildBrief,
    renderBrief: renderAdvisorBrief,
    writeDiagnostic: () => undefined,
  };

  if (variant === 'claude') {
    const output = await handleClaudeUserPromptSubmit(promptInput('claude'), dependencies);
    return normalizeRuntimeOutput(runtime, output);
  }

  if (variant === 'gemini') {
    const output = await handleGeminiUserPromptSubmit(promptInput('gemini'), dependencies);
    return normalizeRuntimeOutput(runtime, output);
  }

  if (variant === 'copilot') {
    const output = await handleCopilotSdkUserPromptSubmitted(promptInput('copilot'), dependencies);
    return normalizeRuntimeOutput(runtime, output);
  }

  if (variant === 'codex') {
    const output = await handleCodexUserPromptSubmit(promptInput('codex'), dependencies);
    return normalizeRuntimeOutput(runtime, output);
  }

  if (variant === 'opencode-plugin') {
    mockedBridge.spawn.mockImplementationOnce(() => makePluginChild(result) as never);
    const pluginUrl = pathToFileURL(join(
      import.meta.dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'plugins',
      'spec-kit-skill-advisor.js',
    )).href;
    const { default: SpecKitSkillAdvisorPlugin } = await import(pluginUrl) as {
      default: SpecKitSkillAdvisorPluginFactory;
    };
    const hooks = await SpecKitSkillAdvisorPlugin({ directory: process.cwd() }, {
      sourceSignatureOverride: `${result.generatedAt}:${result.brief ?? ''}`,
    });
    const output = await hooks.onUserPromptSubmitted(promptInput('copilot'));
    return normalizeRuntimeOutput(runtime, output);
  }

  const output = await handleCopilotWrapperFallback(promptInput('copilot'), dependencies);
  return normalizeRuntimeOutput(runtime, output);
}

describe('advisor runtime parity', () => {
  it('keeps the runtime list as the single extension point for 008 Codex integration', () => {
    expect(RUNTIMES).toEqual(['claude', 'gemini', 'copilot', 'codex']);
  });

  it.each(CANONICAL_FIXTURES)('%s produces identical visible brief text across Claude, Gemini, Copilot, Codex, and plugin', async (fixtureName) => {
    const result = fixture(fixtureName);
    const variants: readonly RuntimeVariant[] = [...RUNTIMES, 'copilot-wrapper', 'opencode-plugin'];
    const outputs = await Promise.all(
      variants.map(async (variant) => [variant, await runRuntimeVariant(variant, result)] as const),
    );
    const visibleBriefs = outputs.map(([, output]) => output.additionalContext);

    expect(new Set(visibleBriefs).size).toBe(1);
    expect(Object.fromEntries(outputs)).toMatchObject({
      claude: { additionalContext: visibleBriefs[0] },
      gemini: { additionalContext: visibleBriefs[0] },
      copilot: { additionalContext: visibleBriefs[0] },
      codex: { additionalContext: visibleBriefs[0] },
      'copilot-wrapper': { additionalContext: visibleBriefs[0] },
      'opencode-plugin': { additionalContext: visibleBriefs[0] },
    });
  });

  it('exercises the real builder-to-renderer path for one runtime output', async () => {
    const workspaceRoot = join(import.meta.dirname, '..', '..', '..', '..', '..', '..', '..');
    mockedBridge.spawn.mockImplementationOnce(() => makeAdvisorSubprocessChild() as never);
    const result = await buildSkillAdvisorBrief('implement a TypeScript hook', {
      workspaceRoot,
      runtime: 'codex',
      maxTokens: 80,
      thresholdConfig: {
        confidenceThreshold: 0.8,
        uncertaintyThreshold: 0.35,
      },
    });
    const output = normalizeRuntimeOutput('codex', {
      hookSpecificOutput: {
        additionalContext: renderAdvisorBrief(result),
      },
    });

    expect(result.status).toBe('ok');
    expect(output.additionalContext).toContain('Advisor:');
  });
});
