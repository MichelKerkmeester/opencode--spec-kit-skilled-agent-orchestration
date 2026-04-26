// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Adapter Output Normalizer
// ───────────────────────────────────────────────────────────────

import { isRecord } from './utils/json-guard.js';
import type { AdvisorRuntime } from './skill-advisor-brief.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type AdvisorRuntimeTransport =
  | 'plain_stdout'
  | 'json_additional_context'
  | 'prompt_wrapper';

export type AdvisorRuntimeDecision = 'allow' | 'block' | 'deny';

/** Runtime-neutral shape used by adapter parity tests. */
export interface NormalizedAdvisorRuntimeOutput {
  readonly runtime: AdvisorRuntime;
  readonly transport: AdvisorRuntimeTransport;
  readonly additionalContext: string | null;
  readonly stderrVisible: boolean;
  readonly decision?: AdvisorRuntimeDecision;
}

// ───────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────

function normalizeText(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeDecision(value: unknown): AdvisorRuntimeDecision | undefined {
  if (value === 'allow' || value === 'block' || value === 'deny') {
    return value;
  }
  return undefined;
}

function hookSpecificAdditionalContext(rawOutput: Record<string, unknown>): string | null {
  const hookSpecificOutput = rawOutput.hookSpecificOutput;
  if (!isRecord(hookSpecificOutput)) {
    return null;
  }
  return normalizeText(hookSpecificOutput.additionalContext);
}

// ───────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function normalizeRuntimeOutput(
  runtime: AdvisorRuntime,
  rawOutput: unknown,
): NormalizedAdvisorRuntimeOutput {
  if (typeof rawOutput === 'string') {
    return {
      runtime,
      transport: 'plain_stdout',
      additionalContext: normalizeText(rawOutput),
      stderrVisible: true,
    };
  }

  if (!isRecord(rawOutput)) {
    return {
      runtime,
      transport: 'plain_stdout',
      additionalContext: null,
      stderrVisible: true,
    };
  }

  const additionalContext = hookSpecificAdditionalContext(rawOutput)
    ?? normalizeText(rawOutput.additionalContext);
  const decision = normalizeDecision(rawOutput.decision);
  if (additionalContext !== null) {
    return {
      runtime,
      transport: 'json_additional_context',
      additionalContext,
      stderrVisible: false,
      ...(decision ? { decision } : {}),
    };
  }

  const promptWrapper = normalizeText(rawOutput.promptWrapper)
    ?? normalizeText(rawOutput.wrappedPrompt);
  if (promptWrapper !== null) {
    return {
      runtime,
      transport: 'prompt_wrapper',
      additionalContext: promptWrapper,
      stderrVisible: false,
      ...(decision ? { decision } : {}),
    };
  }

  return {
    runtime,
    transport: 'json_additional_context',
    additionalContext: null,
    stderrVisible: false,
    ...(decision ? { decision } : {}),
  };
}

/** @deprecated Use `normalizeRuntimeOutput` for runtime-neutral adapter comparisons. */
export const normalizeAdapterOutput = normalizeRuntimeOutput;
