#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Copilot UserPromptSubmitted Hook — Skill Advisor Brief
// ───────────────────────────────────────────────────────────────
// Preferred path: Copilot SDK onUserPromptSubmitted returns
// { additionalContext }. Local checkout capability on 2026-04-19:
// @github/copilot-cli, @github/copilot-sdk, and @ai-sdk/github-copilot
// were not installed, so the CLI entrypoint routes to wrapper fallback.
// Wrapper fallback keeps rewritten prompts in memory and emits diagnostics
// without prompt text.

import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildSkillAdvisorBrief,
  type AdvisorHookFreshness,
  type AdvisorHookResult,
  type AdvisorHookStatus,
} from '../../lib/skill-advisor/skill-advisor-brief.js';
import { renderAdvisorBrief } from '../../lib/skill-advisor/render.js';
import {
  createAdvisorHookDiagnosticRecord,
  serializeAdvisorHookDiagnosticRecord,
} from '../../lib/skill-advisor/metrics.js';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;
const COPILOT_SDK_MODULE_CANDIDATES = [
  '@github/copilot-cli',
  '@github/copilot-sdk',
  '@ai-sdk/github-copilot',
] as const;

export interface CopilotSdkAvailability {
  readonly available: boolean;
  readonly moduleName: string | null;
  readonly reason: 'available' | 'module_not_found';
}

export interface CopilotUserPromptSubmitInput {
  readonly timestamp?: string;
  readonly cwd?: string;
  readonly prompt?: string;
  readonly userPrompt?: string;
  readonly session_id?: string;
  readonly sessionId?: string;
  readonly [key: string]: unknown;
}

export type CopilotSdkUserPromptSubmitOutput =
  | { readonly additionalContext: string }
  | Record<string, never>;

export type CopilotWrapperUserPromptSubmitOutput =
  | {
    readonly promptWrapper: string;
    readonly modifiedPrompt: string;
  }
  | Record<string, never>;

export type CopilotUserPromptSubmitOutput =
  | CopilotSdkUserPromptSubmitOutput
  | CopilotWrapperUserPromptSubmitOutput;

export interface CopilotUserPromptSubmitDependencies {
  readonly buildBrief?: typeof buildSkillAdvisorBrief;
  readonly renderBrief?: typeof renderAdvisorBrief;
  readonly now?: () => number;
  readonly writeDiagnostic?: (line: string) => void;
  readonly sdkAvailable?: boolean;
}

interface HookDiagnosticInput {
  readonly status: AdvisorHookStatus;
  readonly freshness: AdvisorHookFreshness;
  readonly durationMs: number;
  readonly cacheHit: boolean;
  readonly errorCode?: unknown;
  readonly errorDetails?: string;
  readonly skillLabel?: string | null;
  readonly generation?: number;
}

async function detectCopilotSdkAvailability(): Promise<CopilotSdkAvailability> {
  for (const moduleName of COPILOT_SDK_MODULE_CANDIDATES) {
    try {
      await import(moduleName);
      return {
        available: true,
        moduleName,
        reason: 'available',
      };
    } catch {
      // Try the next known SDK package name.
    }
  }
  return {
    available: false,
    moduleName: null,
    reason: 'module_not_found',
  };
}

export const copilotSdkAvailability = await detectCopilotSdkAvailability();
export const sdkAvailable = copilotSdkAvailability.available;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizePrompt(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function promptFor(input: CopilotUserPromptSubmitInput): string | null {
  return normalizePrompt(input.prompt) ?? normalizePrompt(input.userPrompt);
}

function workspaceRootFor(input: CopilotUserPromptSubmitInput): string {
  return typeof input.cwd === 'string' && input.cwd.trim().length > 0
    ? input.cwd
    : process.cwd();
}

function skillLabelFor(result: AdvisorHookResult): string | null {
  const metadataLabel = result.sharedPayload?.metadata?.skillLabel;
  if (typeof metadataLabel === 'string') {
    return metadataLabel;
  }
  return result.recommendations[0]?.skill ?? null;
}

function emitDiagnostic(
  record: HookDiagnosticInput,
  writeDiagnostic: (line: string) => void = (line) => process.stderr.write(`${line}\n`),
): void {
  try {
    const line = serializeAdvisorHookDiagnosticRecord(createAdvisorHookDiagnosticRecord({
      runtime: 'copilot',
      ...record,
    }));
    writeDiagnostic(line);
  } catch {
    // Diagnostics must never affect hook behavior.
  }
}

async function buildRenderedBrief(
  input: CopilotUserPromptSubmitInput | null,
  dependencies: CopilotUserPromptSubmitDependencies,
  elapsed: () => number,
): Promise<{
  readonly prompt: string;
  readonly brief: string | null;
  readonly failOpen: false;
} | {
  readonly failOpen: true;
}> {
  const writeDiagnostic = dependencies.writeDiagnostic;
  if (process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1') {
    emitDiagnostic({
      status: 'skipped',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
    }, writeDiagnostic);
    return { failOpen: true };
  }

  if (!input) {
    emitDiagnostic({
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
      errorCode: 'PARSE_FAIL',
      errorDetails: 'Invalid Copilot userPromptSubmitted JSON payload',
    }, writeDiagnostic);
    return { failOpen: true };
  }

  const prompt = promptFor(input);
  if (prompt === null) {
    emitDiagnostic({
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
      errorCode: 'PARSE_FAIL',
      errorDetails: 'Missing Copilot prompt string',
    }, writeDiagnostic);
    return { failOpen: true };
  }

  const buildBrief = dependencies.buildBrief ?? buildSkillAdvisorBrief;
  const renderBrief = dependencies.renderBrief ?? renderAdvisorBrief;
  const result = await buildBrief(prompt, {
    runtime: 'copilot',
    workspaceRoot: workspaceRootFor(input),
  });
  const brief = renderBrief(result);
  emitDiagnostic({
    status: result.status,
    freshness: result.freshness,
    durationMs: result.metrics.durationMs,
    cacheHit: result.metrics.cacheHit,
    errorCode: result.diagnostics?.errorCode,
    errorDetails: result.diagnostics?.policyReason ?? result.diagnostics?.staleReason,
    skillLabel: skillLabelFor(result),
  }, writeDiagnostic);
  return {
    prompt,
    brief,
    failOpen: false,
  };
}

export function parseCopilotUserPromptSubmitInput(raw: string): CopilotUserPromptSubmitInput | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function createCopilotWrappedPrompt(prompt: string, brief: string): string {
  return [
    '[Advisor brief]',
    brief,
    '[/Advisor brief]',
    '',
    prompt,
  ].join('\n');
}

export async function handleCopilotSdkUserPromptSubmitted(
  input: CopilotUserPromptSubmitInput | null,
  dependencies: CopilotUserPromptSubmitDependencies = {},
): Promise<CopilotSdkUserPromptSubmitOutput> {
  const startedAt = dependencies.now?.() ?? performance.now();
  const elapsed = (): number => Number(((dependencies.now?.() ?? performance.now()) - startedAt).toFixed(3));

  try {
    const result = await buildRenderedBrief(input, dependencies, elapsed);
    if (result.failOpen || !result.brief) {
      return {};
    }
    return {
      additionalContext: result.brief,
    };
  } catch {
    emitDiagnostic({
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled Copilot SDK UserPromptSubmitted hook exception',
    }, dependencies.writeDiagnostic);
    return {};
  }
}

export async function handleCopilotWrapperFallback(
  input: CopilotUserPromptSubmitInput | null,
  dependencies: CopilotUserPromptSubmitDependencies = {},
): Promise<CopilotWrapperUserPromptSubmitOutput> {
  const startedAt = dependencies.now?.() ?? performance.now();
  const elapsed = (): number => Number(((dependencies.now?.() ?? performance.now()) - startedAt).toFixed(3));

  try {
    const result = await buildRenderedBrief(input, dependencies, elapsed);
    if (result.failOpen || !result.brief) {
      return {};
    }
    return {
      promptWrapper: result.brief,
      modifiedPrompt: createCopilotWrappedPrompt(result.prompt, result.brief),
    };
  } catch {
    emitDiagnostic({
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled Copilot wrapper UserPromptSubmitted hook exception',
    }, dependencies.writeDiagnostic);
    return {};
  }
}

export async function handleCopilotUserPromptSubmit(
  input: CopilotUserPromptSubmitInput | null,
  dependencies: CopilotUserPromptSubmitDependencies = {},
): Promise<CopilotUserPromptSubmitOutput> {
  const shouldUseSdk = dependencies.sdkAvailable ?? sdkAvailable;
  return shouldUseSdk
    ? handleCopilotSdkUserPromptSubmitted(input, dependencies)
    : handleCopilotWrapperFallback(input, dependencies);
}

export const onUserPromptSubmitted = handleCopilotSdkUserPromptSubmitted;

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf-8').trim();
}

function writeHookOutput(output: CopilotUserPromptSubmitOutput): Promise<void> {
  return new Promise<void>((resolvePromise) => {
    process.stdout.write(`${JSON.stringify(output)}\n`, () => {
      resolvePromise();
    });
  });
}

async function main(): Promise<void> {
  const rawInput = await readStdin();
  const input = rawInput ? parseCopilotUserPromptSubmitInput(rawInput) : null;
  const output = await handleCopilotUserPromptSubmit(input, {
    writeDiagnostic: (line) => process.stderr.write(`${line}\n`),
  });
  await writeHookOutput(output);
}

if (IS_CLI_ENTRY) {
  main().catch(() => {
    emitDiagnostic({
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: 0,
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled Copilot UserPromptSubmitted CLI exception',
    });
    process.stdout.write('{}\n');
  }).finally(() => {
    process.exit(0);
  });
}
