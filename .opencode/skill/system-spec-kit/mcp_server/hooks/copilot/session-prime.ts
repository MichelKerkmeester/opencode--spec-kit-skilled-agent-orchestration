#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Copilot SessionStart Hook — Session Prime
// ───────────────────────────────────────────────────────────────
// GitHub Copilot CLI surfaces sessionStart hook output as an
// informational banner. This hook preserves the existing startup
// summary while also recovering cached compact payloads when Copilot
// session wrappers forward a compact source event.

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  clearCompactPrime,
  ensureStateDir,
  loadState,
  readCompactPrime,
  validatePendingCompactPrimeSemantics,
  type HookStateCompactPrimeIdentity,
} from '../claude/hook-state.js';
import { wrapRecoveredCompactPayload } from '../shared-provenance.js';
import { writeCopilotCustomInstructions } from './custom-instructions.js';

const CACHE_TTL_MS = 30 * 60 * 1000;
const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

type StartupBrief = {
  startupSurface: string;
  sharedPayloadTransport?: string | null;
};

export interface CopilotHookInput {
  session_id?: string;
  sessionId?: string;
  cwd?: string;
  specFolder?: string;
  source?: 'startup' | 'resume' | 'clear' | 'compact' | string;
  [key: string]: unknown;
}

let buildStartupBrief: ((highlightCount?: number, stateScope?: { specFolder?: string; claudeSessionId?: string }) => StartupBrief) | null = null;
try {
  const mod = await import('../../code-graph/lib/startup-brief.js');
  buildStartupBrief = mod.buildStartupBrief;
} catch {
  // Startup brief builder unavailable — fall back to a minimal banner.
}

async function parseCopilotStdin(): Promise<CopilotHookInput | null> {
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString('utf-8').trim();
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as CopilotHookInput;
  } catch (err: unknown) {
    process.stderr.write(`[copilot:session-prime] Failed to parse stdin: ${err instanceof Error ? err.message : String(err)}\n`);
    return null;
  }
}

function readSessionId(input: CopilotHookInput | null): string | null {
  if (!input) {
    return null;
  }
  if (typeof input.session_id === 'string' && input.session_id.trim().length > 0) {
    return input.session_id;
  }
  if (typeof input.sessionId === 'string' && input.sessionId.trim().length > 0) {
    return input.sessionId;
  }
  return null;
}

function readRequestedSpecFolder(input: CopilotHookInput | null): string | undefined {
  if (typeof input?.specFolder === 'string' && input.specFolder.trim().length > 0) {
    return input.specFolder;
  }
  if (typeof input?.cwd !== 'string' || input.cwd.trim().length === 0) {
    return undefined;
  }
  const normalized = input.cwd.replace(/\\/g, '/');
  const marker = '/.opencode/specs/';
  const markerIndex = normalized.indexOf(marker);
  if (markerIndex === -1) {
    return undefined;
  }
  return normalized.slice(markerIndex + 1);
}

function fallbackBanner(memoryLine = 'startup summary unavailable'): string {
  return [
    'Session context received. Current state:',
    '',
    `- Memory: ${memoryLine}`,
    '- Code Graph: unavailable',
    '- CocoIndex: unknown',
    '',
    'What would you like to work on?',
  ].join('\n');
}

function readCompactPrimeIdentity(sessionId: string): HookStateCompactPrimeIdentity | null {
  const pendingCompactPrime = readCompactPrime(sessionId);
  if (!pendingCompactPrime) {
    return null;
  }
  return {
    cachedAt: pendingCompactPrime.cachedAt,
    opaqueId: pendingCompactPrime.opaqueId ?? null,
  };
}

export function handleCompact(sessionId: string): string {
  const stateResult = loadState(sessionId);
  const state = stateResult.ok ? stateResult.state : null;
  const pendingCompactPrime = readCompactPrime(sessionId);
  if (!pendingCompactPrime) {
    return [
      'Context Recovery',
      'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    ].join('\n\n');
  }

  const { payload, cachedAt } = pendingCompactPrime;
  const cachedAtMs = new Date(cachedAt).getTime();
  const cacheAgeMs = Date.now() - cachedAtMs;
  if (Number.isNaN(cachedAtMs) || cacheAgeMs >= CACHE_TTL_MS) {
    return [
      'Context Recovery',
      'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    ].join('\n\n');
  }
  const semanticValidation = validatePendingCompactPrimeSemantics(pendingCompactPrime);
  if (!semanticValidation.ok) {
    clearCompactPrime(sessionId, {
      cachedAt: pendingCompactPrime.cachedAt,
      opaqueId: pendingCompactPrime.opaqueId ?? null,
    });
    return [
      'Context Recovery',
      'Context was compacted, but the cached compact brief was quarantined by semantic validation. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    ].join('\n\n');
  }

  const wrappedPayload = wrapRecoveredCompactPayload(payload, cachedAt, {
    producer: pendingCompactPrime.payloadContract?.provenance.producer,
    trustState: pendingCompactPrime.payloadContract?.provenance.trustState,
    sourceSurface: pendingCompactPrime.payloadContract?.provenance.sourceSurface,
    sanitizerVersion: pendingCompactPrime.payloadContract?.provenance.sanitizerVersion,
    runtimeFingerprint: pendingCompactPrime.payloadContract?.provenance.runtimeFingerprint,
  });

  const sections = [
    'Recovered Context (Post-Compression)',
    wrappedPayload,
    '',
    'Recovery Instructions',
    'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
  ];
  if (state?.lastSpecFolder) {
    sections.push('', 'Active Spec Folder', `Last active: ${state.lastSpecFolder}`);
  }
  return sections.join('\n');
}

function buildStartupBanner(input: CopilotHookInput | null): string {
  let startupBrief: StartupBrief | null = null;
  try {
    const sessionId = readSessionId(input);
    const specFolder = readRequestedSpecFolder(input);
    startupBrief = buildStartupBrief
      ? buildStartupBrief(undefined, sessionId || specFolder
        ? {
          ...(sessionId ? { claudeSessionId: sessionId } : {}),
          ...(specFolder ? { specFolder } : {}),
        }
        : undefined)
      : null;
  } catch (err: unknown) {
    process.stderr.write(`[copilot:session-prime] buildStartupBrief threw: ${err instanceof Error ? err.message : String(err)}\n`);
  }
  if (!buildStartupBrief) {
    process.stderr.write('[copilot:session-prime] WARNING: Startup brief module unavailable — using fallback surface\n');
  } else if (!startupBrief?.startupSurface) {
    process.stderr.write('[copilot:session-prime] WARNING: startupBrief missing or empty — possible startup-brief regression\n');
  }
  if (!startupBrief?.startupSurface) {
    return fallbackBanner();
  }

  if (!startupBrief.sharedPayloadTransport) {
    return startupBrief.startupSurface;
  }

  return [
    startupBrief.startupSurface,
    '',
    'Startup Payload Contract',
    startupBrief.sharedPayloadTransport,
  ].join('\n');
}

async function refreshStartupInstructions(startupSurface: string): Promise<void> {
  await writeCopilotCustomInstructions({
    startupSurface,
    advisorBrief: null,
    source: 'system-spec-kit copilot sessionStart hook',
  });
}

async function main(): Promise<void> {
  ensureStateDir();
  const input = await parseCopilotStdin();
  const source = input?.source ?? 'startup';
  const sessionId = readSessionId(input);
  const compactIdentity = source === 'compact' && sessionId
    ? readCompactPrimeIdentity(sessionId)
    : null;
  const output = source === 'compact' && sessionId
    ? handleCompact(sessionId)
    : buildStartupBanner(input);

  if (source !== 'compact') {
    await refreshStartupInstructions(output);
  }

  process.stdout.write(`${output}\n`);
  if (source === 'compact' && sessionId) {
    clearCompactPrime(sessionId, compactIdentity ?? undefined);
  }
}

if (IS_CLI_ENTRY) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`[copilot:session-prime] ${message}\n`);
    process.exit(0);
  });
}
