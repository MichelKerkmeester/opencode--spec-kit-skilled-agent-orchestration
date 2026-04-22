#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Codex SessionStart Hook — Startup Context
// ───────────────────────────────────────────────────────────────
// Runs on Codex SessionStart. Emits startup context through Codex's
// hookSpecificOutput.additionalContext envelope for model-visible injection.

import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  calculatePressureAdjustedBudget,
  formatHookOutput,
  SESSION_PRIME_TOKEN_BUDGET,
  truncateToTokenBudget,
  type OutputSection,
} from '../claude/shared.js';
import { loadState } from '../claude/hook-state.js';
import { handleStartup as buildStartupSections } from '../claude/session-prime.js';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

export interface CodexSessionStartInput {
  readonly session_id?: string;
  readonly sessionId?: string;
  readonly hook_event_name?: string;
  readonly hookEventName?: string;
  readonly source?: 'startup' | 'resume' | 'clear' | string;
  readonly cwd?: string;
  readonly specFolder?: string;
  readonly context_window_tokens?: number;
  readonly context_window_max?: number;
  readonly [key: string]: unknown;
}

export interface CodexSessionStartOutput {
  readonly hookSpecificOutput: {
    readonly hookEventName: 'SessionStart';
    readonly additionalContext: string;
  };
}

export interface CodexSessionStartDependencies {
  readonly startupSections?: (input: CodexSessionStartInput) => OutputSection[];
  readonly resumeSections?: (sessionId: string | null) => OutputSection[];
  readonly clearSections?: () => OutputSection[];
  readonly now?: () => number;
  readonly writeDiagnostic?: (line: string) => void;
}

type CodexSessionStartSource = 'startup' | 'resume' | 'clear';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseJsonRecord(raw: string): CodexSessionStartInput | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function sessionIdFor(input: CodexSessionStartInput | null): string | null {
  if (!input) {
    return null;
  }
  if (typeof input.session_id === 'string' && input.session_id.trim().length > 0) {
    return input.session_id.trim();
  }
  if (typeof input.sessionId === 'string' && input.sessionId.trim().length > 0) {
    return input.sessionId.trim();
  }
  return null;
}

function sourceFor(input: CodexSessionStartInput | null): CodexSessionStartSource {
  if (input?.source === 'resume' || input?.source === 'clear') {
    return input.source;
  }
  return 'startup';
}

function defaultResumeSections(sessionId: string | null): OutputSection[] {
  if (sessionId) {
    const stateResult = loadState(sessionId);
    const state = stateResult.ok ? stateResult.state : null;
    if (state?.lastSpecFolder) {
      return [{
        title: 'Session Continuity',
        content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
      }];
    }
  }
  return [{
    title: 'Session Resume',
    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
  }];
}

function defaultClearSections(): OutputSection[] {
  return [{
    title: 'Fresh Context',
    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
  }];
}

function adjustedBudgetFor(input: CodexSessionStartInput | null): number {
  return calculatePressureAdjustedBudget(
    input?.context_window_tokens,
    input?.context_window_max,
    SESSION_PRIME_TOKEN_BUDGET,
  );
}

function emitDiagnostic(
  status: 'ok' | 'fail_open',
  input: CodexSessionStartInput | null,
  durationMs: number,
  writeDiagnostic?: (line: string) => void,
): void {
  if (!writeDiagnostic) {
    return;
  }
  try {
    writeDiagnostic(JSON.stringify({
      surface: 'codex-session-start',
      status,
      source: sourceFor(input),
      durationMs,
    }));
  } catch {
    // Diagnostics must never affect hook behavior.
  }
}

export function parseCodexSessionStartInput(raw: string): CodexSessionStartInput | null {
  return parseJsonRecord(raw);
}

export async function handleCodexSessionStart(
  input: CodexSessionStartInput | null,
  dependencies: CodexSessionStartDependencies = {},
): Promise<CodexSessionStartOutput | Record<string, never>> {
  const startedAt = dependencies.now?.() ?? performance.now();
  const elapsed = (): number => Number(((dependencies.now?.() ?? performance.now()) - startedAt).toFixed(3));
  const sessionId = sessionIdFor(input);

  try {
    const source = sourceFor(input);
    const sections = source === 'resume'
      ? (dependencies.resumeSections ?? defaultResumeSections)(sessionId)
      : source === 'clear'
        ? (dependencies.clearSections ?? defaultClearSections)()
        : (dependencies.startupSections ?? buildStartupSections)(input ?? {});
    const additionalContext = truncateToTokenBudget(
      formatHookOutput(sections),
      adjustedBudgetFor(input),
    );

    if (additionalContext.trim().length === 0) {
      emitDiagnostic('fail_open', input, elapsed(), dependencies.writeDiagnostic);
      return {};
    }

    emitDiagnostic('ok', input, elapsed(), dependencies.writeDiagnostic);
    return {
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext,
      },
    };
  } catch {
    emitDiagnostic('fail_open', input, elapsed(), dependencies.writeDiagnostic);
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

function writeHookOutput(output: CodexSessionStartOutput | Record<string, never>): Promise<void> {
  return new Promise<void>((resolvePromise) => {
    process.stdout.write(`${JSON.stringify(output)}\n`, () => {
      resolvePromise();
    });
  });
}

async function main(): Promise<void> {
  const rawInput = await readStdin();
  const input = rawInput ? parseCodexSessionStartInput(rawInput) : null;
  const output = await handleCodexSessionStart(input, {
    writeDiagnostic: (line) => process.stderr.write(`${line}\n`),
  });
  await writeHookOutput(output);
}

if (IS_CLI_ENTRY) {
  main().catch(() => {
    process.stdout.write('{}\n');
  }).finally(() => {
    process.exit(0);
  });
}
