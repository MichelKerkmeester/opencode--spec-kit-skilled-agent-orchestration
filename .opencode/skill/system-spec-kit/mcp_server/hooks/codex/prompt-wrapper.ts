#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Codex Prompt Wrapper Fallback
// ───────────────────────────────────────────────────────────────
// Fallback path for Codex installs where native hooks are unavailable.
// The wrapper keeps prompt rewriting in memory and never logs prompt text.

import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  detectCodexHookPolicy,
  type CodexHookPolicy,
} from '../../lib/codex-hook-policy.js';
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
import {
  codexHookTimeoutMs,
  parseCodexUserPromptSubmitInputSources,
  type CodexUserPromptSubmitInput,
} from './user-prompt-submit.js';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

export type CodexPromptWrapperOutput =
  | {
    readonly promptWrapper: string;
    readonly wrappedPrompt: string;
  }
  | Record<string, never>;

export interface CodexPromptWrapperDependencies {
  readonly buildBrief?: typeof buildSkillAdvisorBrief;
  readonly renderBrief?: typeof renderAdvisorBrief;
  readonly detectPolicy?: typeof detectCodexHookPolicy;
  readonly now?: () => number;
  readonly writeDiagnostic?: (line: string) => void;
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

function normalizePrompt(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
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

export function createCodexWrappedPrompt(prompt: string, brief: string): string {
  return `<!-- advisor brief: ${brief} -->\n${prompt}`;
}

export async function handleCodexPromptWrapper(
  input: CodexUserPromptSubmitInput | null,
  dependencies: CodexPromptWrapperDependencies = {},
): Promise<CodexPromptWrapperOutput> {
  const startedAt = dependencies.now?.() ?? performance.now();
  const elapsed = (): number => Number(((dependencies.now?.() ?? performance.now()) - startedAt).toFixed(3));

  try {
    const detectPolicy = dependencies.detectPolicy ?? detectCodexHookPolicy;
    const policy: CodexHookPolicy = detectPolicy();
    if (policy.hooks !== 'unavailable') {
      return {};
    }

    if (process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1') {
      emitDiagnostic({
        workspaceRoot: process.cwd(),
        status: 'skipped',
        freshness: 'unavailable',
        durationMs: elapsed(),
        cacheHit: false,
      }, dependencies.writeDiagnostic);
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
        errorDetails: 'Invalid Codex prompt-wrapper JSON payload',
      }, dependencies.writeDiagnostic);
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
      }, dependencies.writeDiagnostic);
      return {};
    }

    const buildBrief = dependencies.buildBrief ?? buildSkillAdvisorBrief;
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
    emitDiagnostic({
      workspaceRoot,
      status: result.status,
      freshness: result.freshness,
      durationMs: result.metrics.durationMs,
      cacheHit: result.metrics.cacheHit,
      errorCode: result.diagnostics?.errorCode,
      errorDetails: result.diagnostics?.policyReason ?? result.diagnostics?.staleReason,
      skillLabel: skillLabelFor(result),
    }, dependencies.writeDiagnostic);

    if (!brief) {
      return {};
    }

    return {
      promptWrapper: brief,
      wrappedPrompt: createCodexWrappedPrompt(prompt, brief),
    };
  } catch {
    emitDiagnostic({
      workspaceRoot: input ? workspaceRootFor(input) : process.cwd(),
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled Codex prompt-wrapper exception',
    }, dependencies.writeDiagnostic);
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

function writeHookOutput(output: CodexPromptWrapperOutput): Promise<void> {
  return new Promise<void>((resolvePromise) => {
    process.stdout.write(`${JSON.stringify(output)}\n`, () => {
      resolvePromise();
    });
  });
}

async function main(): Promise<void> {
  const rawInput = await readStdin();
  const parsed = parseCodexUserPromptSubmitInputSources(rawInput, process.argv.slice(2));
  const output = await handleCodexPromptWrapper(parsed.input, {
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
      errorDetails: 'Unhandled Codex prompt-wrapper CLI exception',
    });
    process.stdout.write('{}\n');
  }).finally(() => {
    process.exit(0);
  });
}
