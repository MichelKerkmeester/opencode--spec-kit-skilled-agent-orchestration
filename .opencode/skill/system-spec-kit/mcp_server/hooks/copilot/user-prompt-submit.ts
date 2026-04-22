#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Copilot UserPromptSubmitted Hook — Custom Instructions
// ───────────────────────────────────────────────────────────────
// Copilot CLI ignores userPromptSubmitted hook output for prompt
// mutation. The hook therefore refreshes Copilot's local custom
// instructions file and returns an empty JSON object.

import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildStartupBrief } from '../../code-graph/lib/startup-brief.js';
import {
  buildSkillAdvisorBrief,
  type AdvisorHookFreshness,
  type AdvisorHookResult,
  type AdvisorHookStatus,
} from '../../skill-advisor/lib/skill-advisor-brief.js';
import { renderAdvisorBrief } from '../../skill-advisor/lib/render.js';
import {
  createAdvisorHookDiagnosticRecord,
  serializeAdvisorHookDiagnosticRecord,
} from '../../skill-advisor/lib/metrics.js';
import {
  writeCopilotCustomInstructions,
  type CopilotCustomInstructionsWriteResult,
} from './custom-instructions.js';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

export interface CopilotUserPromptSubmitInput {
  readonly timestamp?: string | number;
  readonly cwd?: string;
  readonly prompt?: string;
  readonly userPrompt?: string;
  readonly session_id?: string;
  readonly sessionId?: string;
  readonly [key: string]: unknown;
}

export type CopilotUserPromptSubmitOutput = Record<string, never>;

export interface CopilotUserPromptSubmitDependencies {
  readonly buildBrief?: typeof buildSkillAdvisorBrief;
  readonly renderBrief?: typeof renderAdvisorBrief;
  readonly buildStartup?: typeof buildStartupBrief;
  readonly writeInstructions?: typeof writeCopilotCustomInstructions;
  readonly instructionsPath?: string;
  readonly now?: () => number;
  readonly writeDiagnostic?: (line: string) => void;
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

export interface CopilotInstructionsRefreshResult {
  readonly brief: string | null;
  readonly writeResult: CopilotCustomInstructionsWriteResult;
}

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

function buildStartupSurface(dependencies: CopilotUserPromptSubmitDependencies): string | null {
  try {
    return (dependencies.buildStartup ?? buildStartupBrief)().startupSurface;
  } catch {
    return null;
  }
}

async function refreshCopilotInstructions(
  brief: string | null,
  dependencies: CopilotUserPromptSubmitDependencies,
): Promise<CopilotCustomInstructionsWriteResult> {
  const writeInstructions = dependencies.writeInstructions ?? writeCopilotCustomInstructions;
  return writeInstructions({
    advisorBrief: brief,
    startupSurface: buildStartupSurface(dependencies),
    source: 'system-spec-kit copilot userPromptSubmitted hook',
  }, {
    instructionsPath: dependencies.instructionsPath,
  });
}

export function parseCopilotUserPromptSubmitInput(raw: string): CopilotUserPromptSubmitInput | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function refreshCopilotAdvisorInstructions(
  input: CopilotUserPromptSubmitInput | null,
  dependencies: CopilotUserPromptSubmitDependencies = {},
): Promise<CopilotInstructionsRefreshResult | null> {
  const startedAt = dependencies.now?.() ?? performance.now();
  const elapsed = (): number => Number(((dependencies.now?.() ?? performance.now()) - startedAt).toFixed(3));
  const writeDiagnostic = dependencies.writeDiagnostic;

  if (process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1') {
    emitDiagnostic({
      status: 'skipped',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
    }, writeDiagnostic);
    return null;
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
    return null;
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
    return null;
  }

  try {
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
      errorDetails: result.diagnostics?.errorMessage ?? result.diagnostics?.policyReason ?? result.diagnostics?.staleReason,
      skillLabel: skillLabelFor(result),
    }, writeDiagnostic);

    return {
      brief,
      writeResult: await refreshCopilotInstructions(brief, dependencies),
    };
  } catch {
    emitDiagnostic({
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled Copilot custom-instructions refresh exception',
    }, writeDiagnostic);
    return null;
  }
}

export async function handleCopilotUserPromptSubmit(
  input: CopilotUserPromptSubmitInput | null,
  dependencies: CopilotUserPromptSubmitDependencies = {},
): Promise<CopilotUserPromptSubmitOutput> {
  await refreshCopilotAdvisorInstructions(input, dependencies);
  return {};
}

export const onUserPromptSubmitted = handleCopilotUserPromptSubmit;

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
