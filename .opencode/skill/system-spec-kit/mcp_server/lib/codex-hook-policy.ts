// ───────────────────────────────────────────────────────────────
// MODULE: Codex Hook Policy Detection
// ───────────────────────────────────────────────────────────────
// Probes the local Codex CLI once per process to distinguish native hook
// support from legacy or restricted installs.

import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type CodexHookAvailability = 'live' | 'partial' | 'unavailable';

export interface CodexHookPolicy {
  readonly hooks: CodexHookAvailability;
  readonly probedAt: string;
  readonly diagnostics: {
    readonly probeDurationMs: number;
    readonly codexVersion?: string;
    readonly reason?: string;
  };
}

export interface CodexProbeCommand {
  readonly command: string;
  readonly args: readonly string[];
  readonly timeoutMs: number;
}

export interface CodexProbeResult {
  readonly ok: boolean;
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number | null;
  readonly timedOut: boolean;
  readonly errorCode?: string;
}

export interface CodexHookPolicyOptions {
  readonly command?: string;
  readonly timeoutMs?: number;
  readonly hooksProbeArgs?: readonly string[];
  readonly runCommand?: (command: CodexProbeCommand) => CodexProbeResult;
  readonly useCache?: boolean;
  readonly now?: () => number;
  readonly currentDate?: () => Date;
}

interface CachedCodexHookPolicy {
  readonly cacheKey: string;
  readonly policy: CodexHookPolicy;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const DEFAULT_CODEX_COMMAND = 'codex';
const DEFAULT_TIMEOUT_MS = 500;
const DEFAULT_HOOKS_PROBE_ARGS = ['hooks', 'list'] as const;
const MODULE_LAUNCH_TIME = new Date().toISOString();

let cachedPolicy: CachedCodexHookPolicy | null = null;

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function cacheKey(): string {
  return `${process.pid}:${MODULE_LAUNCH_TIME}`;
}

function cleanOutput(value: string | Buffer | null | undefined): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (Buffer.isBuffer(value)) {
    return value.toString('utf8').trim();
  }
  return '';
}

function defaultRunCommand(command: CodexProbeCommand): CodexProbeResult {
  const result = spawnSync(command.command, [...command.args], {
    encoding: 'utf8',
    timeout: command.timeoutMs,
    windowsHide: true,
  });
  const error = result.error as NodeJS.ErrnoException | undefined;
  const timedOut = error?.code === 'ETIMEDOUT';
  const exitCode = typeof result.status === 'number' ? result.status : null;
  return {
    ok: !timedOut && !error && exitCode === 0,
    stdout: cleanOutput(result.stdout),
    stderr: cleanOutput(result.stderr),
    exitCode,
    timedOut,
    ...(error?.code ? { errorCode: error.code } : {}),
  };
}

function firstOutputLine(output: string): string | undefined {
  const line = output.split(/\r?\n/).map((entry) => entry.trim()).find(Boolean);
  return line;
}

function unavailablePolicy(args: {
  readonly startedAt: number;
  readonly now: () => number;
  readonly currentDate: () => Date;
  readonly reason: string;
  readonly codexVersion?: string;
}): CodexHookPolicy {
  return {
    hooks: 'unavailable',
    probedAt: args.currentDate().toISOString(),
    diagnostics: {
      probeDurationMs: Number((args.now() - args.startedAt).toFixed(3)),
      ...(args.codexVersion ? { codexVersion: args.codexVersion } : {}),
      reason: args.reason,
    },
  };
}

function cachePolicy(policy: CodexHookPolicy, useCache: boolean): CodexHookPolicy {
  if (useCache) {
    cachedPolicy = {
      cacheKey: cacheKey(),
      policy,
    };
  }
  return policy;
}

// ───────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function clearCodexHookPolicyCacheForTests(): void {
  cachedPolicy = null;
}

export function detectCodexHookPolicy(options: CodexHookPolicyOptions = {}): CodexHookPolicy {
  const useCache = options.useCache ?? true;
  const currentCacheKey = cacheKey();
  if (useCache && cachedPolicy?.cacheKey === currentCacheKey) {
    return cachedPolicy.policy;
  }

  const now = options.now ?? (() => performance.now());
  const currentDate = options.currentDate ?? (() => new Date());
  const startedAt = now();
  const command = options.command ?? DEFAULT_CODEX_COMMAND;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const runCommand = options.runCommand ?? defaultRunCommand;

  const versionProbe = runCommand({
    command,
    args: ['--version'],
    timeoutMs,
  });

  if (versionProbe.timedOut) {
    return cachePolicy(unavailablePolicy({
      startedAt,
      now,
      currentDate,
      reason: 'CODEX_VERSION_PROBE_TIMEOUT',
    }), useCache);
  }

  if (!versionProbe.ok) {
    return cachePolicy(unavailablePolicy({
      startedAt,
      now,
      currentDate,
      reason: versionProbe.errorCode ?? 'CODEX_VERSION_PROBE_FAILED',
    }), useCache);
  }

  const codexVersion = firstOutputLine(versionProbe.stdout) ?? firstOutputLine(versionProbe.stderr);
  const hooksProbe = runCommand({
    command,
    args: options.hooksProbeArgs ?? DEFAULT_HOOKS_PROBE_ARGS,
    timeoutMs,
  });

  if (hooksProbe.timedOut) {
    return cachePolicy(unavailablePolicy({
      startedAt,
      now,
      currentDate,
      reason: 'CODEX_HOOKS_PROBE_TIMEOUT',
      codexVersion,
    }), useCache);
  }

  const hooks: CodexHookAvailability = hooksProbe.ok ? 'live' : 'partial';
  return cachePolicy({
    hooks,
    probedAt: currentDate().toISOString(),
    diagnostics: {
      probeDurationMs: Number((now() - startedAt).toFixed(3)),
      ...(codexVersion ? { codexVersion } : {}),
      ...(hooksProbe.ok ? {} : { reason: hooksProbe.errorCode ?? 'CODEX_HOOKS_PROBE_FAILED' }),
    },
  }, useCache);
}

