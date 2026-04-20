#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Gemini UserPromptSubmit Hook — Skill Advisor Brief
// ───────────────────────────────────────────────────────────────
// Runs on Gemini's prompt-equivalent BeforeAgent surface. Emits JSON
// hookSpecificOutput.additionalContext for model-visible advisor guidance
// and fails open on all errors.

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

export interface GeminiUserPromptSubmitInput {
  readonly session_id?: string;
  readonly hook_event_name?: string;
  readonly prompt?: string;
  readonly userPrompt?: string;
  readonly cwd?: string;
  readonly transcript_path?: string;
  readonly request?: {
    readonly prompt?: string;
    readonly cwd?: string;
    readonly [key: string]: unknown;
  };
  readonly [key: string]: unknown;
}

export interface GeminiHookSpecificOutput {
  readonly hookSpecificOutput: {
    readonly hookEventName: 'UserPromptSubmit';
    readonly additionalContext: string;
  };
}

export type GeminiUserPromptSubmitOutput = GeminiHookSpecificOutput | Record<string, never>;

export interface GeminiUserPromptSubmitDependencies {
  readonly buildBrief?: typeof buildSkillAdvisorBrief;
  readonly renderBrief?: typeof renderAdvisorBrief;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizePrompt(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function workspaceRootFor(input: GeminiUserPromptSubmitInput): string {
  if (typeof input.cwd === 'string' && input.cwd.trim().length > 0) {
    return input.cwd;
  }
  if (typeof input.request?.cwd === 'string' && input.request.cwd.trim().length > 0) {
    return input.request.cwd;
  }
  return process.cwd();
}

function promptFor(input: GeminiUserPromptSubmitInput): string | null {
  return normalizePrompt(input.prompt)
    ?? normalizePrompt(input.userPrompt)
    ?? normalizePrompt(input.request?.prompt);
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
      runtime: 'gemini',
      ...record,
    }));
    writeDiagnostic(line);
  } catch {
    // Diagnostics must never affect hook behavior.
  }
}

export function parseGeminiUserPromptSubmitInput(raw: string): GeminiUserPromptSubmitInput | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function handleGeminiUserPromptSubmit(
  input: GeminiUserPromptSubmitInput | null,
  dependencies: GeminiUserPromptSubmitDependencies = {},
): Promise<GeminiUserPromptSubmitOutput> {
  const startedAt = dependencies.now?.() ?? performance.now();
  const elapsed = (): number => Number(((dependencies.now?.() ?? performance.now()) - startedAt).toFixed(3));
  const writeDiagnostic = dependencies.writeDiagnostic;

  try {
    if (process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1') {
      emitDiagnostic({
        status: 'skipped',
        freshness: 'unavailable',
        durationMs: elapsed(),
        cacheHit: false,
      }, writeDiagnostic);
      return {};
    }

    if (!input) {
      emitDiagnostic({
        status: 'fail_open',
        freshness: 'unavailable',
        durationMs: elapsed(),
        cacheHit: false,
        errorCode: 'PARSE_FAIL',
        errorDetails: 'Invalid Gemini prompt hook JSON payload',
      }, writeDiagnostic);
      return {};
    }

    const prompt = promptFor(input);
    if (prompt === null) {
      emitDiagnostic({
        status: 'fail_open',
        freshness: 'unavailable',
        durationMs: elapsed(),
        cacheHit: false,
        errorCode: 'PARSE_FAIL',
        errorDetails: 'GEMINI_UNKNOWN_SCHEMA',
      }, writeDiagnostic);
      return {};
    }

    const buildBrief = dependencies.buildBrief ?? buildSkillAdvisorBrief;
    const renderBrief = dependencies.renderBrief ?? renderAdvisorBrief;
    const result = await buildBrief(prompt, {
      runtime: 'gemini',
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

    if (!brief) {
      return {};
    }

    return {
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: brief,
      },
    };
  } catch {
    emitDiagnostic({
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled Gemini UserPromptSubmit hook exception',
    }, writeDiagnostic);
    return {};
  }
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf-8').trim();
}

function writeHookOutput(output: GeminiUserPromptSubmitOutput): Promise<void> {
  return new Promise<void>((resolvePromise) => {
    process.stdout.write(`${JSON.stringify(output)}\n`, () => {
      resolvePromise();
    });
  });
}

async function main(): Promise<void> {
  const rawInput = await readStdin();
  const input = rawInput ? parseGeminiUserPromptSubmitInput(rawInput) : null;
  const output = await handleGeminiUserPromptSubmit(input, {
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
      errorDetails: 'Unhandled Gemini UserPromptSubmit CLI exception',
    });
    process.stdout.write('{}\n');
  }).finally(() => {
    process.exit(0);
  });
}
