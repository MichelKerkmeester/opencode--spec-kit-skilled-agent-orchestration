#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Codex UserPromptSubmit Hook — Skill Advisor Brief
// ───────────────────────────────────────────────────────────────
// Runs on Codex UserPromptSubmit. Codex hook JSON has appeared via stdin
// and argv across wrappers; stdin is canonical and wins if both are present.

import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_ADVISOR_CONFIDENCE_THRESHOLD,
  DEFAULT_ADVISOR_UNCERTAINTY_THRESHOLD,
  buildSkillAdvisorBrief,
  type AdvisorHookFreshness,
  type AdvisorHookResult,
  type AdvisorHookStatus,
} from '../../skill_advisor/lib/skill-advisor-brief.js';
import { renderAdvisorBrief } from '../../skill_advisor/lib/render.js';
import {
  createAdvisorHookDiagnosticRecord,
  persistAdvisorHookDiagnosticRecord,
  serializeAdvisorHookDiagnosticRecord,
} from '../../skill_advisor/lib/metrics.js';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

export interface CodexUserPromptSubmitInput {
  readonly session_id?: string;
  readonly sessionId?: string;
  readonly hook_event_name?: string;
  readonly hookEventName?: string;
  readonly prompt?: string;
  readonly userPrompt?: string;
  readonly cwd?: string;
  readonly request?: {
    readonly prompt?: string;
    readonly cwd?: string;
    readonly [key: string]: unknown;
  };
  readonly [key: string]: unknown;
}

export interface CodexHookSpecificOutput {
  readonly hookSpecificOutput: {
    readonly hookEventName: 'UserPromptSubmit';
    readonly additionalContext: string;
  };
}

export type CodexUserPromptSubmitOutput = CodexHookSpecificOutput | Record<string, never>;

export interface CodexUserPromptSubmitDependencies {
  readonly buildBrief?: typeof buildSkillAdvisorBrief;
  readonly renderBrief?: typeof renderAdvisorBrief;
  readonly now?: () => number;
  readonly writeDiagnostic?: (line: string) => void;
}

export interface CodexInputDiagnostics {
  readonly source: 'stdin' | 'argv' | 'none';
  readonly dualInputDetected: boolean;
  readonly reason?: 'STDIN_ARGV_BOTH_PRESENT_USING_STDIN'
    | 'STDIN_PARSE_FAILED'
    | 'ARGV_PARSE_FAILED'
    | 'NO_INPUT_PROVIDED';
}

export interface CodexInputParseResult {
  readonly input: CodexUserPromptSubmitInput | null;
  readonly diagnostics: CodexInputDiagnostics;
}

interface HookDiagnosticInput {
  readonly workspaceRoot: string;
  readonly status: AdvisorHookStatus;
  readonly freshness: AdvisorHookFreshness;
  readonly durationMs: number;
  readonly cacheHit: boolean;
  readonly errorCode?: unknown;
  readonly errorDetails?: string;
  readonly skillLabel?: string | null;
  readonly generation?: number;
}

export const DEFAULT_CODEX_HOOK_TIMEOUT_MS = 3000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizePrompt(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function parseJsonRecord(raw: string): CodexUserPromptSubmitInput | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function firstArgvJson(argv: readonly string[]): CodexUserPromptSubmitInput | null {
  for (const value of argv) {
    const trimmed = value.trim();
    if (!trimmed.startsWith('{')) {
      continue;
    }
    const parsed = parseJsonRecord(trimmed);
    if (parsed !== null) {
      return parsed;
    }
  }
  return null;
}

function promptFor(input: CodexUserPromptSubmitInput): string | null {
  return normalizePrompt(input.prompt)
    ?? normalizePrompt(input.userPrompt)
    ?? normalizePrompt(input.request?.prompt);
}

function workspaceRootFor(input: CodexUserPromptSubmitInput): string {
  if (typeof input.cwd === 'string' && input.cwd.trim().length > 0) {
    return input.cwd;
  }
  if (typeof input.request?.cwd === 'string' && input.request.cwd.trim().length > 0) {
    return input.request.cwd;
  }
  return process.cwd();
}

function positiveIntFromEnv(value: string | undefined, fallback: number): number {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function codexHookTimeoutMs(): number {
  return positiveIntFromEnv(process.env.SPECKIT_CODEX_HOOK_TIMEOUT_MS, DEFAULT_CODEX_HOOK_TIMEOUT_MS);
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
    const diagnosticRecord = createAdvisorHookDiagnosticRecord({
      runtime: 'codex',
      ...record,
    });
    const line = serializeAdvisorHookDiagnosticRecord(diagnosticRecord);
    writeDiagnostic(line);
    persistAdvisorHookDiagnosticRecord(record.workspaceRoot, diagnosticRecord);
  } catch {
    // Diagnostics must never affect hook behavior.
  }
}

function timeoutFallbackOutput(): CodexHookSpecificOutput {
  return {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: 'Advisor: stale (cold-start timeout)',
    },
  };
}

async function buildCodexAdvisorBrief(
  prompt: string,
  options: { workspaceRoot: string },
): Promise<AdvisorHookResult> {
  return buildSkillAdvisorBrief(prompt, {
    runtime: 'codex',
    workspaceRoot: options.workspaceRoot,
    subprocessTimeoutMs: codexHookTimeoutMs(),
  });
}

export function parseCodexUserPromptSubmitInput(raw: string): CodexUserPromptSubmitInput | null {
  return parseJsonRecord(raw);
}

export function parseCodexUserPromptSubmitInputSources(
  rawStdin: string,
  argv: readonly string[],
): CodexInputParseResult {
  const stdin = rawStdin.trim();
  const argvInput = firstArgvJson(argv);
  const dualInputDetected = stdin.length > 0 && argvInput !== null;

  if (stdin.length > 0) {
    const input = parseJsonRecord(stdin);
    if (input === null) {
      return {
        input: null,
        diagnostics: {
          source: 'stdin',
          dualInputDetected,
          reason: 'STDIN_PARSE_FAILED',
        },
      };
    }
    return {
      input,
      diagnostics: {
        source: 'stdin',
        dualInputDetected,
        ...(dualInputDetected ? { reason: 'STDIN_ARGV_BOTH_PRESENT_USING_STDIN' } : {}),
      },
    };
  }

  if (argvInput !== null) {
    return {
      input: argvInput,
      diagnostics: {
        source: 'argv',
        dualInputDetected: false,
      },
    };
  }

  const hasJsonLookingArg = argv.some((value) => value.trim().startsWith('{'));
  return {
    input: null,
    diagnostics: {
      source: hasJsonLookingArg ? 'argv' : 'none',
      dualInputDetected: false,
      reason: hasJsonLookingArg ? 'ARGV_PARSE_FAILED' : 'NO_INPUT_PROVIDED',
    },
  };
}

export async function handleCodexUserPromptSubmit(
  input: CodexUserPromptSubmitInput | null,
  dependencies: CodexUserPromptSubmitDependencies = {},
): Promise<CodexUserPromptSubmitOutput> {
  const startedAt = dependencies.now?.() ?? performance.now();
  const elapsed = (): number => Number(((dependencies.now?.() ?? performance.now()) - startedAt).toFixed(3));
  const writeDiagnostic = dependencies.writeDiagnostic;

  try {
    if (process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1') {
      emitDiagnostic({
        workspaceRoot: process.cwd(),
        status: 'skipped',
        freshness: 'unavailable',
        durationMs: elapsed(),
        cacheHit: false,
      }, writeDiagnostic);
      return {};
    }

    if (!input) {
      emitDiagnostic({
        workspaceRoot: process.cwd(),
        status: 'fail_open',
        freshness: 'unavailable',
        durationMs: elapsed(),
        cacheHit: false,
        errorCode: 'PARSE_FAIL',
        errorDetails: 'Invalid Codex UserPromptSubmit JSON payload',
      }, writeDiagnostic);
      return {};
    }

    const prompt = promptFor(input);
    const workspaceRoot = workspaceRootFor(input);
    if (prompt === null) {
      emitDiagnostic({
        workspaceRoot,
        status: 'fail_open',
        freshness: 'unavailable',
        durationMs: elapsed(),
        cacheHit: false,
        errorCode: 'PARSE_FAIL',
        errorDetails: 'CODEX_UNKNOWN_SCHEMA',
      }, writeDiagnostic);
      return {};
    }

    const buildBrief = dependencies.buildBrief ?? buildCodexAdvisorBrief;
    const renderBrief = dependencies.renderBrief ?? renderAdvisorBrief;
    const result = await buildBrief(prompt, {
      runtime: 'codex',
      workspaceRoot,
      subprocessTimeoutMs: codexHookTimeoutMs(),
    });
    const brief = renderBrief(result, {
      thresholdConfig: {
        confidenceThreshold: DEFAULT_ADVISOR_CONFIDENCE_THRESHOLD,
        uncertaintyThreshold: DEFAULT_ADVISOR_UNCERTAINTY_THRESHOLD,
      },
    });
    if (result.status === 'fail_open' && result.diagnostics?.errorCode === 'TIMEOUT') {
      emitDiagnostic({
        workspaceRoot,
        status: 'stale',
        freshness: 'stale',
        durationMs: result.metrics.durationMs,
        cacheHit: result.metrics.cacheHit,
        errorCode: 'TIMEOUT',
        errorDetails: 'cold-start timeout',
        skillLabel: skillLabelFor(result),
      }, writeDiagnostic);
      return timeoutFallbackOutput();
    }

    emitDiagnostic({
      workspaceRoot,
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
      workspaceRoot: input ? workspaceRootFor(input) : process.cwd(),
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled Codex UserPromptSubmit hook exception',
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

function writeHookOutput(output: CodexUserPromptSubmitOutput): Promise<void> {
  return new Promise<void>((resolvePromise) => {
    process.stdout.write(`${JSON.stringify(output)}\n`, () => {
      resolvePromise();
    });
  });
}

async function main(): Promise<void> {
  const rawInput = await readStdin();
  const parsed = parseCodexUserPromptSubmitInputSources(rawInput, process.argv.slice(2));
  const output = await handleCodexUserPromptSubmit(parsed.input, {
    writeDiagnostic: (line) => process.stderr.write(`${line}\n`),
  });
  await writeHookOutput(output);
}

if (IS_CLI_ENTRY) {
  main().catch(() => {
    emitDiagnostic({
      workspaceRoot: process.cwd(),
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: 0,
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled Codex UserPromptSubmit CLI exception',
    });
    process.stdout.write('{}\n');
  }).finally(() => {
    process.exit(0);
  });
}
