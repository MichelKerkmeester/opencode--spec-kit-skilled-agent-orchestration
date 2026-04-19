import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { handleClaudeUserPromptSubmit } from '../hooks/claude/user-prompt-submit.js';
import { handleGeminiUserPromptSubmit } from '../hooks/gemini/user-prompt-submit.js';
import {
  handleCopilotSdkUserPromptSubmitted,
  handleCopilotWrapperFallback,
} from '../hooks/copilot/user-prompt-submit.js';
import {
  normalizeRuntimeOutput,
  type NormalizedAdvisorRuntimeOutput,
} from '../lib/skill-advisor/normalize-adapter-output.js';
import { renderAdvisorBrief } from '../lib/skill-advisor/render.js';
import type {
  AdvisorHookResult,
  AdvisorRuntime,
} from '../lib/skill-advisor/skill-advisor-brief.js';

export const RUNTIMES = ['claude', 'gemini', 'copilot'] as const;
type RuntimeId = (typeof RUNTIMES)[number];
type RuntimeVariant = RuntimeId | 'copilot-wrapper';

const fixturesDir = join(import.meta.dirname, 'advisor-fixtures');
const CANONICAL_FIXTURES = [
  'livePassingSkill.json',
  'staleHighConfidenceSkill.json',
  'noPassingSkill.json',
  'failOpenTimeout.json',
  'skippedShortCasual.json',
] as const;

function fixture(name: string): AdvisorHookResult {
  return JSON.parse(readFileSync(join(fixturesDir, name), 'utf8')) as AdvisorHookResult;
}

function runtimeForVariant(variant: RuntimeVariant): AdvisorRuntime {
  return variant === 'copilot-wrapper' ? 'copilot' : variant;
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
    default: {
      const exhaustive: never = runtime;
      return exhaustive;
    }
  }
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

  const output = await handleCopilotWrapperFallback(promptInput('copilot'), dependencies);
  return normalizeRuntimeOutput(runtime, output);
}

describe('advisor runtime parity', () => {
  it('keeps the runtime list as the single extension point for 008 Codex integration', () => {
    expect(RUNTIMES).toEqual(['claude', 'gemini', 'copilot']);
  });

  it.each(CANONICAL_FIXTURES)('%s produces identical visible brief text across Claude, Gemini, and Copilot', async (fixtureName) => {
    const result = fixture(fixtureName);
    const variants: readonly RuntimeVariant[] = [...RUNTIMES, 'copilot-wrapper'];
    const outputs = await Promise.all(
      variants.map(async (variant) => [variant, await runRuntimeVariant(variant, result)] as const),
    );
    const visibleBriefs = outputs.map(([, output]) => output.additionalContext);

    expect(new Set(visibleBriefs).size).toBe(1);
    expect(Object.fromEntries(outputs)).toMatchObject({
      claude: { additionalContext: visibleBriefs[0] },
      gemini: { additionalContext: visibleBriefs[0] },
      copilot: { additionalContext: visibleBriefs[0] },
      'copilot-wrapper': { additionalContext: visibleBriefs[0] },
    });
  });
});
