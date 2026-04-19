#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Codex PreToolUse Hook — Bash Deny Policy
// ───────────────────────────────────────────────────────────────
// Codex PreToolUse is intentionally narrow here: only Bash commands can
// be denied, and only when they match the repo-local denylist.

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

export interface CodexPreToolUseInput {
  readonly tool?: string;
  readonly tool_name?: string;
  readonly toolName?: string;
  readonly command?: string;
  readonly tool_input?: {
    readonly command?: string;
    readonly [key: string]: unknown;
  };
  readonly input?: {
    readonly command?: string;
    readonly [key: string]: unknown;
  };
  readonly [key: string]: unknown;
}

export interface BashDenylistEntry {
  readonly pattern: string;
  readonly reason?: string;
}

export interface CodexPolicyFile {
  readonly bashDenylist?: readonly (string | BashDenylistEntry)[];
}

export type CodexPreToolUseOutput =
  | {
    readonly decision: 'deny';
    readonly reason: string;
  }
  | Record<string, never>;

export interface CodexPreToolUseDependencies {
  readonly policyPath?: string;
  readonly readPolicy?: () => CodexPolicyFile;
}

const DEFAULT_POLICY: CodexPolicyFile = {
  bashDenylist: [],
};

let cachedPolicyPath: string | null = null;
let cachedPolicy: CodexPolicyFile | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseCodexPreToolUseInput(raw: string): CodexPreToolUseInput | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function defaultPolicyPath(): string {
  return resolve(process.cwd(), '.codex', 'policy.json');
}

function ensurePolicyFile(policyPath: string): void {
  if (existsSync(policyPath)) {
    return;
  }
  mkdirSync(dirname(policyPath), { recursive: true });
  writeFileSync(policyPath, `${JSON.stringify(DEFAULT_POLICY, null, 2)}\n`, 'utf8');
}

function loadPolicy(policyPath: string): CodexPolicyFile {
  if (cachedPolicy && cachedPolicyPath === policyPath) {
    return cachedPolicy;
  }
  ensurePolicyFile(policyPath);
  try {
    const parsed = JSON.parse(readFileSync(policyPath, 'utf8')) as unknown;
    cachedPolicy = isRecord(parsed) ? parsed as CodexPolicyFile : DEFAULT_POLICY;
  } catch {
    cachedPolicy = DEFAULT_POLICY;
  }
  cachedPolicyPath = policyPath;
  return cachedPolicy;
}

function toolNameFor(input: CodexPreToolUseInput): string | null {
  const toolName = input.tool ?? input.tool_name ?? input.toolName;
  return typeof toolName === 'string' ? toolName : null;
}

function bashCommandFor(input: CodexPreToolUseInput): string | null {
  const command = input.command ?? input.tool_input?.command ?? input.input?.command;
  return typeof command === 'string' ? command : null;
}

function normalizeEntry(entry: string | BashDenylistEntry): BashDenylistEntry | null {
  if (typeof entry === 'string' && entry.trim().length > 0) {
    return { pattern: entry.trim() };
  }
  if (typeof entry !== 'object' || entry === null) {
    return null;
  }
  if (typeof entry.pattern === 'string' && entry.pattern.trim().length > 0) {
    return {
      pattern: entry.pattern.trim(),
      ...(entry.reason ? { reason: entry.reason } : {}),
    };
  }
  return null;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function commandMatchesPattern(command: string, pattern: string): boolean {
  const escaped = escapeRegex(pattern).replace(/\s+/g, '\\s+');
  const startsWithWord = /^\w/.test(pattern);
  const endsWithWord = /\w$/.test(pattern);
  const prefix = startsWithWord ? '(?<![\\w-])' : '';
  const suffix = endsWithWord ? '(?![\\w-])' : '(?=$|[\\s;&|])';
  return new RegExp(`${prefix}${escaped}${suffix}`).test(command);
}

function denylistMatch(
  command: string,
  entries: readonly (string | BashDenylistEntry)[] | undefined,
): BashDenylistEntry | null {
  for (const rawEntry of entries ?? []) {
    const entry = normalizeEntry(rawEntry);
    if (!entry) {
      continue;
    }
    if (commandMatchesPattern(command, entry.pattern)) {
      return entry;
    }
  }
  return null;
}

export function clearCodexPreToolUsePolicyCacheForTests(): void {
  cachedPolicy = null;
  cachedPolicyPath = null;
}

export function handleCodexPreToolUse(
  input: CodexPreToolUseInput | null,
  dependencies: CodexPreToolUseDependencies = {},
): CodexPreToolUseOutput {
  try {
    if (!input) {
      return {};
    }

    if (toolNameFor(input) !== 'Bash') {
      return {};
    }

    const command = bashCommandFor(input);
    if (command === null) {
      return {};
    }

    const policy = dependencies.readPolicy?.() ?? loadPolicy(dependencies.policyPath ?? defaultPolicyPath());
    const match = denylistMatch(command, policy.bashDenylist);
    if (!match) {
      return {};
    }

    return {
      decision: 'deny',
      reason: match.reason ?? `Codex PreToolUse denied Bash command matching ${match.pattern}`,
    };
  } catch {
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

function writeHookOutput(output: CodexPreToolUseOutput): Promise<void> {
  return new Promise<void>((resolvePromise) => {
    process.stdout.write(`${JSON.stringify(output)}\n`, () => {
      resolvePromise();
    });
  });
}

async function main(): Promise<void> {
  const rawInput = await readStdin();
  const input = rawInput ? parseCodexPreToolUseInput(rawInput) : null;
  await writeHookOutput(handleCodexPreToolUse(input));
}

if (IS_CLI_ENTRY) {
  main().catch(() => {
    process.stdout.write('{}\n');
  }).finally(() => {
    process.exit(0);
  });
}
