// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Runner Adapter Common
// ───────────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

import type { ChildProcess } from 'node:child_process';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export type AdapterStatus = 'PASS' | 'FAIL' | 'TIMEOUT_CELL' | 'NA' | 'BLOCKED';

export interface AdapterInput {
  readonly featureId: string;
  readonly promptTemplate: string;
  readonly expectedSignal: string;
  readonly timeoutSeconds: number;
  readonly workingDir: string;
}

export interface AdapterResult {
  readonly status: AdapterStatus;
  readonly durationMs: number;
  readonly evidence: {
    readonly stdout: string;
    readonly stderr: string;
    readonly exitCode: number;
  };
  readonly reason?: string;
}

export interface CliInvocation {
  readonly command: string;
  readonly args: readonly string[];
  readonly stdin?: string;
}

export interface RunCliAdapterInput {
  readonly adapterName: string;
  readonly input: AdapterInput;
  readonly invocation: CliInvocation;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const DEFAULT_TIMEOUT_SECONDS = 300;
const SPAWN_BLOCKED_CODES = new Set(['EAGAIN', 'ENOSPC', 'ENOENT', 'EACCES']);

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function timeoutMs(seconds: number): number {
  return Math.max(1, Math.trunc(seconds || DEFAULT_TIMEOUT_SECONDS)) * 1000;
}

function exitCodeFromSignal(signal: NodeJS.Signals | null): number {
  return signal === null ? -1 : -128;
}

function errorCode(error: NodeJS.ErrnoException): string {
  return typeof error.code === 'string' && error.code.length > 0 ? error.code : 'SPAWN_ERROR';
}

function isExpectedSignal(stdout: string, expectedSignal: string): boolean {
  const signal = expectedSignal.trim();
  if (signal.length === 0) {
    return false;
  }
  if (stdout.includes(signal)) {
    return true;
  }
  const slashMatch = /^\/(.+)\/([a-z]*)$/i.exec(signal);
  try {
    const pattern = slashMatch === null
      ? new RegExp(signal)
      : new RegExp(slashMatch[1], slashMatch[2]);
    return pattern.test(stdout);
  } catch {
    return false;
  }
}

function normalizeChunk(chunk: string | Buffer): string {
  return typeof chunk === 'string' ? chunk : chunk.toString('utf8');
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

export async function runCliAdapter(args: RunCliAdapterInput): Promise<AdapterResult> {
  const startedAt = performance.now();
  const timeout = timeoutMs(args.input.timeoutSeconds);

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    let child: ChildProcess;

    const finish = (result: Omit<AdapterResult, 'durationMs'>): void => {
      if (settled) {
        return;
      }
      settled = true;
      resolve({
        ...result,
        durationMs: Math.round(performance.now() - startedAt),
      });
    };

    try {
      child = spawn(args.invocation.command, [...args.invocation.args], {
        cwd: args.input.workingDir,
        env: process.env,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'spawn failed';
      finish({
        status: 'BLOCKED',
        evidence: { stdout, stderr: message, exitCode: -1 },
        reason: `${args.adapterName} spawn failed: ${message}`,
      });
      return;
    }

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish({
        status: 'TIMEOUT_CELL',
        evidence: { stdout, stderr, exitCode: -1 },
        reason: `${args.adapterName} exceeded ${Math.trunc(timeout / 1000)}s timeout`,
      });
    }, timeout);

    child.stdout?.setEncoding('utf8');
    child.stderr?.setEncoding('utf8');
    child.stdout?.on('data', (chunk: string | Buffer) => {
      stdout += normalizeChunk(chunk);
    });
    child.stderr?.on('data', (chunk: string | Buffer) => {
      stderr += normalizeChunk(chunk);
    });
    child.on('error', (error: NodeJS.ErrnoException) => {
      clearTimeout(timer);
      const code = errorCode(error);
      finish({
        status: SPAWN_BLOCKED_CODES.has(code) ? 'BLOCKED' : 'BLOCKED',
        evidence: { stdout, stderr: stderr || error.message, exitCode: -1 },
        reason: `${args.adapterName} spawn error ${code}: ${error.message}`,
      });
    });
    child.on('close', (exitCode: number | null, signal: NodeJS.Signals | null) => {
      clearTimeout(timer);
      const normalizedExitCode = exitCode ?? exitCodeFromSignal(signal);
      const passed = normalizedExitCode === 0 && isExpectedSignal(stdout, args.input.expectedSignal);
      finish({
        status: passed ? 'PASS' : 'FAIL',
        evidence: { stdout, stderr, exitCode: normalizedExitCode },
        ...(passed
          ? {}
          : { reason: `${args.adapterName} did not emit expected signal '${args.input.expectedSignal}'` }),
      });
    });

    if (typeof args.invocation.stdin === 'string') {
      child.stdin?.write(args.invocation.stdin);
    }
    child.stdin?.end();
  });
}

