// ───────────────────────────────────────────────────────────────
// MODULE: Hook State Management
// ───────────────────────────────────────────────────────────────
// Per-session state at ${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-hash>.json
import * as crypto from 'node:crypto';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import {
  mkdirSync, readFileSync,
  readdirSync, statSync, unlinkSync,
} from 'node:fs';
import { hookLog } from './shared.js';
import type { SharedPayloadEnvelope } from '../../lib/context/shared-payload.js';

/** Per-session hook state persisted to temp directory */
export interface HookProducerMetadata {
  lastClaudeTurnAt: string | null;
  transcript: {
    path: string;
    fingerprint: string;
    sizeBytes: number;
    modifiedAt: string;
  } | null;
  cacheTokens: {
    cacheCreationInputTokens: number;
    cacheReadInputTokens: number;
  } | null;
}

export interface HookState {
  claudeSessionId: string;
  speckitSessionId: string | null;
  lastSpecFolder: string | null;
  sessionSummary: { text: string; extractedAt: string } | null;
  pendingCompactPrime: {
    payload: string;
    cachedAt: string;
    payloadContract?: SharedPayloadEnvelope | null;
  } | null;
  producerMetadata: HookProducerMetadata | null;
  metrics: {
    estimatedPromptTokens: number;
    estimatedCompletionTokens: number;
    lastTranscriptOffset: number;
  };
  createdAt: string;
  updatedAt: string;
}

const MAX_RECENT_STATE_AGE_MS = 24 * 60 * 60 * 1000;
let tempCounter = 0;

export interface HookStateScope {
  specFolder?: string;
  claudeSessionId?: string;
}

export interface HookStateFileError {
  path: string;
  reason: string;
}

export interface LoadMostRecentStateResult {
  states: HookState[];
  errors: HookStateFileError[];
}

export interface CleanStaleStatesResult {
  removed: number;
  skipped: number;
  errors: HookStateFileError[];
}

/** SHA-256 hash of cwd, first 12 chars */
export function getProjectHash(): string {
  return crypto.createHash('sha256').update(process.cwd()).digest('hex').slice(0, 12);
}

/** Get the state directory path */
function getStateDir(): string {
  return join(tmpdir(), 'speckit-claude-hooks', getProjectHash());
}

/** Get the state file path for a session */
export function getStatePath(sessionId: string): string {
  const safe = crypto.createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
  return join(getStateDir(), `${safe}.json`);
}

/** Ensure the state directory exists */
export function ensureStateDir(): void {
  try {
    mkdirSync(getStateDir(), { recursive: true, mode: 0o700 });
  } catch (err: unknown) {
    hookLog('error', 'state', `Failed to create state dir: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** Load state for a session. Returns null if not found. */
export function loadState(sessionId: string): HookState | null {
  try {
    const raw = readFileSync(getStatePath(sessionId), 'utf-8');
    return JSON.parse(raw) as HookState;
  } catch {
    return null;
  }
}

function matchesScope(state: HookState, scope: HookStateScope): boolean {
  if (scope.specFolder && state.lastSpecFolder !== scope.specFolder) {
    return false;
  }

  if (scope.claudeSessionId && state.claudeSessionId !== scope.claudeSessionId) {
    return false;
  }

  return true;
}

/**
 * Load the most recently updated hook state file for this project.
 * Returns matching states in newest-first order and isolates per-file errors
 * so one poisoned sibling does not mask valid state.
 */
export function loadMostRecentState(
  options: {
    maxAgeMs?: number;
    scope?: HookStateScope;
  } = {},
): LoadMostRecentStateResult {
  const maxAgeMs = options.maxAgeMs ?? MAX_RECENT_STATE_AGE_MS;
  const scope = options.scope;
  const hasScope = Boolean(scope?.specFolder || scope?.claudeSessionId);

  if (!hasScope) {
    hookLog(
      'warn',
      'state',
      JSON.stringify({
        event: 'load_most_recent_state_rejected',
        reason: 'scope_unknown_fail_closed',
      }),
    );
    return { states: [], errors: [] };
  }

  try {
    const dir = getStateDir();
    const candidates = readdirSync(dir).filter((file) => file.endsWith('.json'));
    if (candidates.length === 0) {
      return { states: [], errors: [] };
    }

    const matchingStates: Array<{ state: HookState; mtimeMs: number }> = [];
    const errors: HookStateFileError[] = [];
    for (const file of candidates) {
      const filePath = join(dir, file);
      try {
        const mtimeMs = statSync(filePath).mtimeMs;
        if (Date.now() - mtimeMs > maxAgeMs) {
          continue;
        }

        const raw = readFileSync(filePath, 'utf-8');
        const state = JSON.parse(raw) as HookState;
        if (!matchesScope(state, scope!)) {
          continue;
        }

        matchingStates.push({ state, mtimeMs });
      } catch (error: unknown) {
        errors.push({
          path: filePath,
          reason: error instanceof Error ? error.message : String(error),
        });
      }
    }

    matchingStates.sort((left, right) => right.mtimeMs - left.mtimeMs);
    return {
      states: matchingStates.map(({ state }) => state),
      errors,
    };
  } catch {
    return { states: [], errors: [] };
  }
}

/** Save state atomically (write to .tmp then rename) */
export function saveState(sessionId: string, state: HookState): boolean {
  const filePath = getStatePath(sessionId);
  const tmpPath = `${filePath}.tmp-${process.pid}-${tempCounter++}-${crypto.randomBytes(4).toString('hex')}`;
  try {
    state.updatedAt = new Date().toISOString();
    fs.writeFileSync(tmpPath, JSON.stringify(state, null, 2), { encoding: 'utf-8', mode: 0o600 });
    fs.renameSync(tmpPath, filePath);
    return true;
  } catch (err: unknown) {
    hookLog('error', 'state', `Failed to save state: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

/** Read pending compact prime without clearing it from state */
export function readCompactPrime(sessionId: string): HookState['pendingCompactPrime'] {
  const state = loadState(sessionId);
  return state?.pendingCompactPrime ?? null;
}

/** Clear pending compact prime from state (call after stdout write confirmed) */
export function clearCompactPrime(sessionId: string): void {
  const state = loadState(sessionId);
  if (!state || !state.pendingCompactPrime) {
    return;
  }

  const nextState: HookState = {
    ...state,
    pendingCompactPrime: null,
  };

  if (!saveState(sessionId, nextState)) {
    hookLog('warn', 'state', `Failed to clear pending compact payload for session ${sessionId}`);
  }
}

/**
 * Read pending compact prime, clear it from state, and return the cached value.
 * @deprecated Use readCompactPrime() + clearCompactPrime() to avoid data loss
 * if the process crashes between clear and stdout write.
 */
export function readAndClearCompactPrime(sessionId: string): HookState['pendingCompactPrime'] {
  const prime = readCompactPrime(sessionId);
  if (prime) {
    clearCompactPrime(sessionId);
  }
  return prime;
}

/** Load, merge patch, save, and return updated state */
export function updateState(sessionId: string, patch: Partial<HookState>): HookState {
  const existing = loadState(sessionId);
  const now = new Date().toISOString();
  const existingMetrics = existing?.metrics ?? {
    estimatedPromptTokens: 0,
    estimatedCompletionTokens: 0,
    lastTranscriptOffset: 0,
  };
  const patchMetrics = patch.metrics;
  const state: HookState = {
    claudeSessionId: sessionId,
    speckitSessionId: null,
    lastSpecFolder: null,
    sessionSummary: null,
    pendingCompactPrime: null,
    producerMetadata: null,
    createdAt: now,
    updatedAt: now,
    ...existing,
    ...patch,
    metrics: patchMetrics
      ? {
        ...existingMetrics,
        ...patchMetrics,
        lastTranscriptOffset: Math.max(
          existingMetrics.lastTranscriptOffset ?? 0,
          patchMetrics.lastTranscriptOffset ?? 0,
        ),
      }
      : existingMetrics,
  };
  if (!saveState(sessionId, state)) {
    hookLog('warn', 'state', `State update was not persisted for session ${sessionId}`);
  }
  return state;
}

function appendCleanupSkip(
  result: CleanStaleStatesResult,
  filePath: string,
  reason: string,
): void {
  result.skipped += 1;
  result.errors.push({ path: filePath, reason });
  hookLog('warn', 'state', JSON.stringify({
    event: 'clean_stale_states_skipped',
    file: basename(filePath),
    path: filePath,
    reason,
  }));
}

function isSameFileIdentity(previous: fs.Stats, current: fs.Stats): boolean {
  return previous.dev === current.dev && previous.ino === current.ino;
}

/** Remove stale state files with per-file isolation and a pre-delete identity check. */
export function cleanStaleStates(maxAgeMs: number): CleanStaleStatesResult {
  const result: CleanStaleStatesResult = {
    removed: 0,
    skipped: 0,
    errors: [],
  };

  let removed = 0;
  try {
    const dir = getStateDir();
    const files = readdirSync(dir);
    const cutoff = Date.now() - maxAgeMs;
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const filePath = join(dir, file);
      try {
        const stat = statSync(filePath);
        if (stat.mtimeMs >= cutoff) {
          continue;
        }

        let descriptor: number | null = null;
        try {
          descriptor = fs.openSync(filePath, 'r');
          const liveStat = fs.fstatSync(descriptor);
          if (!isSameFileIdentity(stat, liveStat)) {
            appendCleanupSkip(result, filePath, 'identity_changed_before_cleanup');
            continue;
          }
        } finally {
          if (descriptor !== null) {
            fs.closeSync(descriptor);
          }
        }

        unlinkSync(filePath);
        removed++;
      } catch (error: unknown) {
        appendCleanupSkip(result, filePath, error instanceof Error ? error.message : String(error));
      }
    }
  } catch {
    // Directory may not exist yet
  }
  result.removed = removed;
  return result;
}
