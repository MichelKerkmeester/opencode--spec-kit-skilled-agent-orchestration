import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

import type { ChildProcess } from 'node:child_process';

export type HookRuntime = 'claude' | 'codex' | 'copilot' | 'gemini' | 'opencode';
export type HookTestStatus = 'PASS' | 'FAIL' | 'SKIPPED' | 'TIMEOUT_CELL';

export interface HookTestInput {
  readonly runtime: HookRuntime;
  readonly event: string;
  readonly prompt: string;
  readonly timeoutSeconds?: number;
  readonly workspaceRoot?: string;
}

export interface CommandEvidence {
  readonly command: string;
  readonly args: readonly string[];
  readonly exitCode: number;
  readonly durationMs: number;
  readonly stdoutSnippet: string;
  readonly stderrSnippet: string;
  readonly timedOut: boolean;
}

export interface HookTestResult {
  readonly runtime: HookRuntime;
  readonly event: string;
  readonly status: HookTestStatus;
  readonly reason: string;
  readonly assertion: string;
  readonly prompt: string;
  readonly configPath?: string;
  readonly sourceCitations: readonly string[];
  readonly evidence: {
    readonly cli?: CommandEvidence;
    readonly hook?: CommandEvidence;
    readonly files?: Record<string, string>;
    readonly observations?: Record<string, unknown>;
  };
  readonly recordedAt: string;
}

export const DEFAULT_TIMEOUT_SECONDS = 300;
export const SNIPPET_LIMIT = 4000;
export const REPO_ROOT = resolve(fileURLToPath(new URL('../../../../../../', import.meta.url)));
export const PACKET_ROOT = resolve(fileURLToPath(new URL('../', import.meta.url)));
export const RESULTS_DIR = join(PACKET_ROOT, 'results');
export const TRIGGER_PROMPT = [
  '043-hook-plugin-per-runtime-testing runtime hook tests.',
  'Report whether a Spec Kit hook/advisor/startup context is visible.',
  'Reply tersely and do not edit files.',
].join(' ');

export function resolveHomePath(path: string): string {
  return path.startsWith('~/') ? join(homedir(), path.slice(2)) : path;
}

export function fileExists(path: string): boolean {
  return existsSync(resolveHomePath(path));
}

export function readSnippet(path: string): string {
  try {
    return snippet(redactSensitive(readFileSync(resolveHomePath(path), 'utf8')));
  } catch (error) {
    return `READ_ERROR: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export function snippet(value: string, limit = SNIPPET_LIMIT): string {
  const safeValue = redactSensitive(value);
  if (safeValue.length <= limit) {
    return safeValue;
  }
  return `${safeValue.slice(0, limit)}\n...[truncated ${safeValue.length - limit} chars]`;
}

export function redactSensitive(value: string): string {
  return value
    .replace(/(API_KEY\s*=\s*")[^"]+(")/g, '$1[REDACTED]$2')
    .replace(/((?:VOYAGE|OPENAI|ANTHROPIC|GEMINI|GOOGLE|GH|GITHUB|COPILOT)[A-Z0-9_]*KEY[^=\n]*=\s*)[^\s\n]+/gi, '$1[REDACTED]')
    .replace(/\bsk-(?:proj-)?[A-Za-z0-9]{16,}\b/g, '[REDACTED_SECRET]')
    .replace(/\bpa-[A-Za-z0-9_\-]{16,}\b/g, '[REDACTED_SECRET]')
    .replace(/\bghp_[A-Za-z0-9_]{16,}\b/g, '[REDACTED_SECRET]')
    .replace(/\bgithub_pat_[A-Za-z0-9_]{16,}\b/g, '[REDACTED_SECRET]')
    .replace(/\bAIza[A-Za-z0-9_\-]{16,}\b/g, '[REDACTED_SECRET]');
}

export function hasAny(value: string, needles: readonly string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}

export function binaryPath(binary: string): string | null {
  const pathDirs = (process.env.PATH ?? '').split(':').filter(Boolean);
  for (const dir of pathDirs) {
    const candidate = join(dir, binary);
    try {
      const stat = statSync(candidate);
      if (stat.isFile()) {
        return candidate;
      }
    } catch {
      // Continue scanning PATH.
    }
  }
  return null;
}

export function skipResult(input: HookTestInput, reason: string, assertion: string, configPath?: string): HookTestResult {
  return {
    runtime: input.runtime,
    event: input.event,
    status: 'SKIPPED',
    reason,
    assertion,
    prompt: input.prompt,
    ...(configPath ? { configPath } : {}),
    sourceCitations: [],
    evidence: {},
    recordedAt: new Date().toISOString(),
  };
}

export function classify(
  input: HookTestInput,
  passed: boolean,
  reason: string,
  assertion: string,
  evidence: HookTestResult['evidence'],
  sourceCitations: readonly string[],
  configPath?: string,
): HookTestResult {
  const timedOut = Boolean(evidence.cli?.timedOut || evidence.hook?.timedOut);
  return {
    runtime: input.runtime,
    event: input.event,
    status: timedOut ? 'TIMEOUT_CELL' : (passed ? 'PASS' : 'FAIL'),
    reason,
    assertion,
    prompt: input.prompt,
    ...(configPath ? { configPath } : {}),
    sourceCitations,
    evidence,
    recordedAt: new Date().toISOString(),
  };
}

export async function runCommand(args: {
  readonly command: string;
  readonly args?: readonly string[];
  readonly stdin?: string;
  readonly cwd?: string;
  readonly env?: NodeJS.ProcessEnv;
  readonly timeoutSeconds?: number;
}): Promise<CommandEvidence> {
  const timeoutMs = Math.max(1, Math.trunc(args.timeoutSeconds ?? DEFAULT_TIMEOUT_SECONDS)) * 1000;
  const startedAt = performance.now();

  return new Promise((resolvePromise) => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    let child: ChildProcess;

    const finish = (exitCode: number, timedOut: boolean): void => {
      if (settled) {
        return;
      }
      settled = true;
      resolvePromise({
        command: args.command,
        args: args.args ?? [],
        exitCode,
        durationMs: Math.round(performance.now() - startedAt),
        stdoutSnippet: snippet(stdout),
        stderrSnippet: snippet(stderr),
        timedOut,
      });
    };

    try {
      child = spawn(args.command, [...(args.args ?? [])], {
        cwd: args.cwd ?? REPO_ROOT,
        env: args.env ?? process.env,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      stderr = message;
      finish(-1, false);
      return;
    }

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish(-1, true);
    }, timeoutMs);

    child.stdout?.setEncoding('utf8');
    child.stderr?.setEncoding('utf8');
    child.stdout?.on('data', (chunk: string | Buffer) => {
      stdout += String(chunk);
    });
    child.stderr?.on('data', (chunk: string | Buffer) => {
      stderr += String(chunk);
    });
    child.on('error', (error: NodeJS.ErrnoException) => {
      clearTimeout(timer);
      stderr += error.message;
      finish(-1, false);
    });
    child.on('close', (code: number | null, signal: NodeJS.Signals | null) => {
      clearTimeout(timer);
      finish(code ?? (signal ? -128 : -1), false);
    });

    if (typeof args.stdin === 'string') {
      child.stdin?.write(args.stdin);
    }
    child.stdin?.end();
  });
}

export function writeJsonl(result: HookTestResult): void {
  mkdirSync(dirname(resultPath(result)), { recursive: true });
  writeFileSync(resultPath(result), `${JSON.stringify(result)}\n`, 'utf8');
}

export function resultPath(result: Pick<HookTestResult, 'runtime' | 'event'>): string {
  return join(RESULTS_DIR, `${result.runtime}-${result.event}.jsonl`);
}

export function writeResults(results: readonly HookTestResult[]): void {
  mkdirSync(RESULTS_DIR, { recursive: true });
  for (const result of results) {
    writeJsonl(result);
  }
}

export function compactStatusCounts(results: readonly HookTestResult[]): Record<HookTestStatus, number> {
  return results.reduce<Record<HookTestStatus, number>>((acc, result) => {
    acc[result.status] += 1;
    return acc;
  }, { PASS: 0, FAIL: 0, SKIPPED: 0, TIMEOUT_CELL: 0 });
}

export function isDirectRun(metaUrl: string): boolean {
  if (!process.argv[1]) {
    return false;
  }
  try {
    return realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(metaUrl));
  } catch {
    return resolve(process.argv[1]) === fileURLToPath(metaUrl);
  }
}
