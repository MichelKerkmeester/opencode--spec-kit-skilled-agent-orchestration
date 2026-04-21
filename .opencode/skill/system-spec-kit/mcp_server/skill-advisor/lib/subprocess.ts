// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Subprocess Runner
// ───────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';

import type { ChildProcess } from 'node:child_process';
import type { AdvisorThresholds } from './prompt-cache.js';

export interface AdvisorRecommendation {
  readonly skill: string;
  readonly kind?: string;
  readonly confidence: number;
  readonly uncertainty: number;
  readonly passes_threshold?: boolean;
  readonly reason?: string;
}

export type AdvisorSubprocessErrorCode =
  | 'PYTHON_MISSING'
  | 'SCRIPT_MISSING'
  | 'SIGNAL_KILLED'
  | 'TIMEOUT'
  | 'JSON_PARSE_FAILED'
  | 'INVALID_JSON_SHAPE'
  | 'NON_ZERO_EXIT'
  | 'SQLITE_BUSY_EXHAUSTED'
  | 'SPAWN_ERROR';

export interface AdvisorSubprocessResult {
  readonly ok: boolean;
  readonly recommendations: AdvisorRecommendation[];
  readonly errorCode: AdvisorSubprocessErrorCode | null;
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly stderr: string | null;
  readonly durationMs: number;
  readonly retriesAttempted: number;
}

export interface AdvisorSubprocessOptions {
  readonly workspaceRoot: string;
  readonly timeoutMs?: number;
  readonly thresholdConfig?: AdvisorThresholds;
  readonly pythonBin?: string;
  readonly scriptPath?: string;
  readonly retryJitterMs?: () => number;
}

interface SpawnAttemptResult {
  readonly ok: boolean;
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly errorCode: AdvisorSubprocessErrorCode | null;
  readonly durationMs: number;
}

const DEFAULT_TIMEOUT_MS = 1000;
const SQLITE_BUSY_PATTERN = /\bSQLITE_BUSY\b|database is locked/i;

function thresholdArgs(thresholdConfig: AdvisorThresholds | undefined): string[] {
  const confidenceThreshold = String(thresholdConfig?.confidenceThreshold ?? 0.8);
  const uncertaintyThreshold = String(thresholdConfig?.uncertaintyThreshold ?? 0.35);
  const args = ['--threshold', confidenceThreshold, '--uncertainty', uncertaintyThreshold];
  if (thresholdConfig?.confidenceOnly) {
    args.push('--confidence-only');
  }
  if (thresholdConfig?.showRejections) {
    args.push('--show-rejections');
  }
  return args;
}

function sanitizeStderr(stderr: string): string | null {
  const compact = stderr.replace(/\s+/g, ' ').trim();
  if (!compact) {
    return null;
  }
  return compact.slice(0, 240);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseRecommendations(stdout: string): AdvisorRecommendation[] {
  const parsed: unknown = JSON.parse(stdout);
  if (!Array.isArray(parsed)) {
    throw new Error(`advisor stdout: expected JSON array; actual ${typeof parsed}.`);
  }
  return parsed.map((item, index) => {
    const path = `advisor stdout[${index}]`;
    if (!isRecord(item)) {
      throw new Error(`${path}: expected object recommendation; actual ${typeof item}.`);
    }
    if (typeof item.skill !== 'string' || item.skill.trim().length === 0) {
      throw new Error(`${path}.skill: expected non-empty string; actual ${typeof item.skill}.`);
    }
    if (typeof item.confidence !== 'number' || Number.isNaN(item.confidence)) {
      throw new Error(`${path}.confidence: expected finite number; actual ${typeof item.confidence}.`);
    }
    if (typeof item.uncertainty !== 'number' || Number.isNaN(item.uncertainty)) {
      throw new Error(`${path}.uncertainty: expected finite number; actual ${typeof item.uncertainty}.`);
    }
    return {
      skill: item.skill,
      ...(typeof item.kind === 'string' ? { kind: item.kind } : {}),
      confidence: item.confidence,
      uncertainty: item.uncertainty,
      ...(typeof item.passes_threshold === 'boolean' ? { passes_threshold: item.passes_threshold } : {}),
      ...(typeof item.reason === 'string' ? { reason: item.reason } : {}),
    };
  });
}

function runSpawnAttempt(args: {
  command: string;
  commandArgs: readonly string[];
  prompt: string;
  cwd: string;
  timeoutMs: number;
}): Promise<SpawnAttemptResult> {
  const startedAt = performance.now();
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    let timedOut = false;
    let child: ChildProcess;

    try {
      child = spawn(args.command, args.commandArgs, {
        cwd: args.cwd,
        env: process.env,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (error: unknown) {
      resolve({
        ok: false,
        stdout,
        stderr: error instanceof Error ? error.message : 'spawn failed',
        exitCode: null,
        signal: null,
        errorCode: 'SPAWN_ERROR',
        durationMs: performance.now() - startedAt,
      });
      return;
    }

    child.stdin?.write(args.prompt);
    child.stdin?.end();
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, args.timeoutMs);

    child.stdout?.setEncoding('utf8');
    child.stderr?.setEncoding('utf8');
    child.stdout?.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr?.on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.on('error', (error: NodeJS.ErrnoException) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolve({
        ok: false,
        stdout,
        stderr: error.message,
        exitCode: null,
        signal: null,
        errorCode: error.code === 'ENOENT' ? 'PYTHON_MISSING' : 'SPAWN_ERROR',
        durationMs: performance.now() - startedAt,
      });
    });
    child.on('close', (exitCode: number | null, signal: NodeJS.Signals | null) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolve({
        ok: exitCode === 0 && signal === null && !timedOut,
        stdout,
        stderr,
        exitCode,
        signal,
        errorCode: timedOut || signal === 'SIGKILL' ? 'SIGNAL_KILLED' : null,
        durationMs: performance.now() - startedAt,
      });
    });
  });
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Run the Python skill advisor with prompt input carried over stdin. */
export async function runAdvisorSubprocess(
  prompt: string,
  options: AdvisorSubprocessOptions,
): Promise<AdvisorSubprocessResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const scriptPath = options.scriptPath
    ?? join(
      options.workspaceRoot,
      '.opencode',
      'skill',
      'system-spec-kit',
      'mcp_server',
      'skill-advisor',
      'scripts',
      'skill_advisor.py',
    );
  const startedAt = performance.now();
  let retriesAttempted = 0;

  if (!existsSync(scriptPath)) {
    return {
      ok: false,
      recommendations: [],
      errorCode: 'SCRIPT_MISSING',
      exitCode: null,
      signal: null,
      stderr: null,
      durationMs: performance.now() - startedAt,
      retriesAttempted,
    };
  }

  const commandArgs = [
    scriptPath,
    ...thresholdArgs(options.thresholdConfig),
    '--stdin',
  ];
  const command = options.pythonBin ?? 'python3';

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const elapsedMs = performance.now() - startedAt;
    const remainingMs = Math.max(0, timeoutMs - elapsedMs);
    const attemptResult = await runSpawnAttempt({
      command,
      commandArgs,
      prompt,
      cwd: options.workspaceRoot,
      timeoutMs: Math.max(1, remainingMs),
    });

    if (!attemptResult.ok) {
      const busy = SQLITE_BUSY_PATTERN.test(attemptResult.stderr);
      const budgetRemaining = timeoutMs - (performance.now() - startedAt);
      if (busy && attempt === 0 && budgetRemaining >= 500) {
        retriesAttempted = 1;
        await delay(options.retryJitterMs?.() ?? 75 + Math.floor(Math.random() * 51));
        continue;
      }
      return {
        ok: false,
        recommendations: [],
        errorCode: busy ? 'SQLITE_BUSY_EXHAUSTED' : attemptResult.errorCode ?? 'NON_ZERO_EXIT',
        exitCode: attemptResult.exitCode,
        signal: attemptResult.signal,
        stderr: sanitizeStderr(attemptResult.stderr),
        durationMs: performance.now() - startedAt,
        retriesAttempted,
      };
    }

    try {
      return {
        ok: true,
        recommendations: parseRecommendations(attemptResult.stdout),
        errorCode: null,
        exitCode: attemptResult.exitCode,
        signal: attemptResult.signal,
        stderr: sanitizeStderr(attemptResult.stderr),
        durationMs: performance.now() - startedAt,
        retriesAttempted,
      };
    } catch (error: unknown) {
      return {
        ok: false,
        recommendations: [],
        errorCode: error instanceof SyntaxError ? 'JSON_PARSE_FAILED' : 'INVALID_JSON_SHAPE',
        exitCode: attemptResult.exitCode,
        signal: attemptResult.signal,
        stderr: null,
        durationMs: performance.now() - startedAt,
        retriesAttempted,
      };
    }
  }

  return {
    ok: false,
    recommendations: [],
    errorCode: 'SQLITE_BUSY_EXHAUSTED',
    exitCode: null,
    signal: null,
    stderr: null,
    durationMs: performance.now() - startedAt,
    retriesAttempted,
  };
}
