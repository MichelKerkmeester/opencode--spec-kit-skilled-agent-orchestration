// ───────────────────────────────────────────────────────────────
// MODULE: Codex Hook Policy Detection
// ───────────────────────────────────────────────────────────────
// Probes the local Codex CLI once per process to distinguish native hook
// support from restricted installs.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
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
  readonly env?: NodeJS.ProcessEnv;
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
  readonly configPath?: string;
  readonly hooksPath?: string;
  readonly settingsPath?: string;
  readonly workspaceRoot?: string;
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
    ...(command.env ? { env: command.env } : {}),
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

function scrubCodexProbeEnv(env: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const scrubbed: NodeJS.ProcessEnv = { ...env };
  for (const key of Object.keys(scrubbed)) {
    if (key.startsWith('CODEX_TUI_')) {
      delete scrubbed[key];
    }
  }
  delete scrubbed.CODEX_CI;
  delete scrubbed.CODEX_THREAD_ID;
  return scrubbed;
}

function settingsPathFor(options: CodexHookPolicyOptions): string {
  return options.settingsPath
    ?? join(options.workspaceRoot ?? process.cwd(), '.codex', 'settings.json');
}

function configPathFor(options: CodexHookPolicyOptions): string {
  if (options.configPath) {
    return options.configPath;
  }
  const workspacePath = join(options.workspaceRoot ?? process.cwd(), '.codex', 'config.toml');
  return existsSync(workspacePath)
    ? workspacePath
    : join(homedir(), '.codex', 'config.toml');
}

function hooksPathFor(options: CodexHookPolicyOptions): string {
  if (options.hooksPath) {
    return options.hooksPath;
  }
  const homePath = join(homedir(), '.codex', 'hooks.json');
  return existsSync(homePath)
    ? homePath
    : join(options.workspaceRoot ?? process.cwd(), '.codex', 'hooks.json');
}

function hasCodexHooksFeatureEnabled(configPath: string): boolean {
  if (!existsSync(configPath)) {
    return false;
  }

  try {
    const lines = readFileSync(configPath, 'utf8').split(/\r?\n/);
    let inFeatures = false;
    for (const line of lines) {
      const stripped = line.replace(/#.*$/, '').trim();
      if (!stripped) {
        continue;
      }
      if (stripped.startsWith('[') && stripped.endsWith(']')) {
        inFeatures = stripped === '[features]';
        continue;
      }
      if (!inFeatures) {
        continue;
      }
      if (/^codex_hooks\s*=\s*true\b/i.test(stripped)) {
        return true;
      }
      if (/^codex_hooks\s*=/.test(stripped)) {
        return false;
      }
    }
  } catch {
    return false;
  }

  return false;
}

function hasValidHookRegistration(hooksPath: string): boolean {
  if (!existsSync(hooksPath)) {
    return false;
  }

  try {
    const parsed = JSON.parse(readFileSync(hooksPath, 'utf8')) as unknown;
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
}

function partialReason(hasFeatureFlag: boolean, hasHooksRegistration: boolean): string {
  if (!hasFeatureFlag && !hasHooksRegistration) {
    return 'CODEX_HOOKS_FLAG_AND_REGISTRATION_MISSING';
  }
  if (!hasFeatureFlag) {
    return 'CODEX_HOOKS_FEATURE_DISABLED';
  }
  return 'CODEX_HOOKS_REGISTRATION_MISSING_OR_INVALID';
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
    env: scrubCodexProbeEnv(),
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
  const settingsPath = settingsPathFor(options);
  const configPath = configPathFor(options);
  const hooksPath = hooksPathFor(options);
  const hasFeatureFlag = hasCodexHooksFeatureEnabled(configPath);
  const hasHooksRegistration = hasValidHookRegistration(hooksPath);
  const hooks: CodexHookAvailability = hasFeatureFlag && hasHooksRegistration ? 'live' : 'partial';
  return cachePolicy({
    hooks,
    probedAt: currentDate().toISOString(),
    diagnostics: {
      probeDurationMs: Number((now() - startedAt).toFixed(3)),
      ...(codexVersion ? { codexVersion } : {}),
      ...(hooks === 'live'
        ? {}
        : {
          reason: [
            partialReason(hasFeatureFlag, hasHooksRegistration),
            ...(existsSync(settingsPath) ? [] : ['CODEX_SETTINGS_MISSING_OR_INVALID']),
          ].join(';'),
        }),
    },
  }, useCache);
}
