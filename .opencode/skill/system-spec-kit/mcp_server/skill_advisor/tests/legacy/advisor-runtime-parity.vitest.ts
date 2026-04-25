// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Runtime Parity Tests
// ───────────────────────────────────────────────────────────────

import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { handleClaudeUserPromptSubmit } from '../../../hooks/claude/user-prompt-submit.js';
import { handleGeminiUserPromptSubmit } from '../../../hooks/gemini/user-prompt-submit.js';
import { handleCopilotUserPromptSubmit } from '../../../hooks/copilot/user-prompt-submit.js';
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
// 'opencode-plugin' was removed from the parity matrix: the plugin uses
// OpenCode's `experimental.chat.system.transform` hook (system-message
// injection), not the Claude-style `additionalContext` shape this matrix
// asserts. The OpenCode plugin path is covered by
// `mcp_server/skill_advisor/tests/compat/plugin-bridge.vitest.ts`.
type RuntimeVariant = RuntimeId | 'copilot-wrapper';

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
  if (variant === 'copilot-wrapper') {
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
    const output = await handleCopilotUserPromptSubmit(promptInput('copilot'), {
      ...dependencies,
      writeInstructions: vi.fn(async () => ({
        path: '/tmp/copilot-instructions.md',
        written: true,
        changed: true,
      })),
    });
    return normalizeRuntimeOutput(runtime, output);
  }

  if (variant === 'codex') {
    const output = await handleCodexUserPromptSubmit(promptInput('codex'), dependencies);
    return normalizeRuntimeOutput(runtime, output);
  }

  const output = await handleCopilotUserPromptSubmit(promptInput('copilot'), {
    ...dependencies,
    writeInstructions: vi.fn(async () => ({
      path: '/tmp/copilot-instructions.md',
      written: true,
      changed: true,
    })),
  });
  return normalizeRuntimeOutput(runtime, output);
}

describe('advisor runtime parity', () => {
  it('keeps the runtime list as the single extension point for 008 Codex integration', () => {
    expect(RUNTIMES).toEqual(['claude', 'gemini', 'copilot', 'codex']);
  });

  it.each(CANONICAL_FIXTURES)('%s preserves visible brief parity where hooks can inject and keeps Copilot file-only', async (fixtureName) => {
    const result = fixture(fixtureName);
    const variants: readonly RuntimeVariant[] = [...RUNTIMES, 'copilot-wrapper'];
    const outputs = await Promise.all(
      variants.map(async (variant) => [variant, await runRuntimeVariant(variant, result)] as const),
    );
    const directInjectionOutputs = outputs.filter(([variant]) => variant !== 'copilot' && variant !== 'copilot-wrapper');
    const visibleBriefs = directInjectionOutputs.map(([, output]) => output.additionalContext);

    if (fixtureName === 'failOpenTimeout.json') {
      expect(Object.fromEntries(outputs)).toMatchObject({
        claude: { additionalContext: null },
        gemini: { additionalContext: null },
        copilot: { additionalContext: null },
        codex: { additionalContext: 'Advisor: stale (cold-start timeout)' },
        'copilot-wrapper': { additionalContext: null },
      });
      return;
    }

    expect(new Set(visibleBriefs).size).toBe(1);
    expect(Object.fromEntries(outputs)).toMatchObject({
      claude: { additionalContext: visibleBriefs[0] },
      gemini: { additionalContext: visibleBriefs[0] },
      copilot: { additionalContext: null },
      codex: { additionalContext: visibleBriefs[0] },
      'copilot-wrapper': { additionalContext: null },
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
