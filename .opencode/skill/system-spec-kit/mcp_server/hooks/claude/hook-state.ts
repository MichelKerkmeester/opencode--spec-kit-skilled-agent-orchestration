// ───────────────────────────────────────────────────────────────
// MODULE: Hook State Management
// ───────────────────────────────────────────────────────────────
// Per-session state at ${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-hash>.json
import * as crypto from 'node:crypto';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
} from 'node:fs';
import { z } from 'zod';

import { hookLog } from './shared.js';
import { assertNever } from '../../lib/utils/exhaustiveness.js';
import type { SharedPayloadEnvelope } from '../../lib/context/shared-payload.js';

export const CURRENT_HOOK_STATE_SCHEMA_VERSION = 1 as const;

const MAX_RECENT_STATE_AGE_MS = 24 * 60 * 60 * 1000;
const QUARANTINE_SUFFIX = '.bad';

let tempCounter = 0;

const SharedPayloadEnvelopeSchema = z.custom<SharedPayloadEnvelope>(
  (value) => value !== null && typeof value === 'object',
  { message: 'Expected shared payload envelope object' },
);

const HookProducerMetadataSchema = z.object({
  lastClaudeTurnAt: z.string().nullable(),
  transcript: z.object({
    path: z.string().min(1),
    fingerprint: z.string().min(1),
    sizeBytes: z.number().finite().nonnegative(),
    modifiedAt: z.string().min(1),
  }).nullable(),
  cacheTokens: z.object({
    cacheCreationInputTokens: z.number().finite().nonnegative(),
    cacheReadInputTokens: z.number().finite().nonnegative(),
  }).nullable(),
});

const PendingCompactPrimeSchema = z.object({
  payload: z.string(),
  cachedAt: z.string().min(1),
  opaqueId: z.string().min(1).optional(),
  payloadContract: SharedPayloadEnvelopeSchema.nullable().optional(),
});

export const HookStateSchema = z.object({
  schemaVersion: z.literal(CURRENT_HOOK_STATE_SCHEMA_VERSION).optional().default(CURRENT_HOOK_STATE_SCHEMA_VERSION),
  claudeSessionId: z.string().min(1),
  speckitSessionId: z.string().min(1).nullable(),
  lastSpecFolder: z.string().min(1).nullable(),
  sessionSummary: z.object({
    text: z.string().min(1),
    extractedAt: z.string().min(1),
  }).nullable(),
  pendingCompactPrime: PendingCompactPrimeSchema.nullable(),
  producerMetadata: HookProducerMetadataSchema.nullable(),
  metrics: z.object({
    estimatedPromptTokens: z.number().finite().nonnegative(),
    estimatedCompletionTokens: z.number().finite().nonnegative(),
    lastTranscriptOffset: z.number().int().nonnegative(),
  }),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type HookProducerMetadata = z.output<typeof HookProducerMetadataSchema>;
export type HookState = z.input<typeof HookStateSchema>;
export type PersistedHookState = z.output<typeof HookStateSchema>;

export interface HookStateScope {
  specFolder?: string;
  claudeSessionId?: string;
}

export type HookStateLoadFailureReason =
  | 'not_found'
  | 'parse_error'
  | 'invalid_state'
  | 'schema_mismatch'
  | 'read_error'
  | 'mtime_changed'
  | 'scope_unknown_fail_closed';

export interface HookStateFileError {
  path: string;
  reason: HookStateLoadFailureReason;
  detail?: string;
  quarantinedPath?: string;
}

export type HookStateLoadResult =
  | {
    ok: true;
    state: PersistedHookState;
    path: string;
    migrated: boolean;
    persisted: boolean;
  }
  | {
    ok: false;
    reason: HookStateLoadFailureReason;
    path: string;
    detail: string;
    quarantinedPath?: string;
  };

export type LoadMostRecentStateResult =
  | {
    ok: true;
    state: PersistedHookState;
    path: string;
    errors: HookStateFileError[];
  }
  | {
    ok: false;
    reason: HookStateLoadFailureReason;
    detail?: string;
    errors: HookStateFileError[];
  };

/**
 * T-SRS-03 (R38-001 extension): return ALL matching states (newest-first)
 * so consumers can fall back candidate-by-candidate rather than treating the
 * single newest as an all-or-nothing result.  Mirrors the per-file isolation
 * pattern P0-D landed in `loadMostRecentState()`.
 */
export interface LoadMatchingStatesResult {
  states: Array<{ state: PersistedHookState; path: string; updatedAtMs: number; mtimeMs: number }>;
  errors: HookStateFileError[];
  reason?: HookStateLoadFailureReason;
  detail?: string;
}

export interface CleanStaleStatesResult {
  removed: number;
  skipped: number;
  errors: HookStateFileError[];
}

export interface HookStateUpdateResult {
  ok: boolean;
  merged: PersistedHookState;
  persisted: boolean;
  path: string;
}

export interface HookStateCompactPrimeIdentity {
  cachedAt: string;
  opaqueId?: string | null;
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

function normalizePendingCompactPrime(
  pendingCompactPrime: PersistedHookState['pendingCompactPrime'],
  previousPendingCompactPrime: PersistedHookState['pendingCompactPrime'] = null,
): PersistedHookState['pendingCompactPrime'] {
  if (!pendingCompactPrime) {
    return null;
  }

  if (pendingCompactPrime.opaqueId) {
    return pendingCompactPrime;
  }

  if (
    previousPendingCompactPrime
    && previousPendingCompactPrime.cachedAt === pendingCompactPrime.cachedAt
    && previousPendingCompactPrime.payload === pendingCompactPrime.payload
  ) {
    return previousPendingCompactPrime;
  }

  return {
    ...pendingCompactPrime,
    opaqueId: crypto.randomUUID(),
  };
}

function prepareStateForPersist(
  sessionId: string,
  state: Partial<HookState>,
  existing: PersistedHookState | null = null,
): PersistedHookState {
  const now = new Date().toISOString();
  const existingMetrics = existing?.metrics ?? {
    estimatedPromptTokens: 0,
    estimatedCompletionTokens: 0,
    lastTranscriptOffset: 0,
  };
  const {
    schemaVersion: _ignoredSchemaVersion,
    claudeSessionId: _ignoredSessionId,
    metrics: patchMetrics,
    createdAt: patchCreatedAt,
    updatedAt: _ignoredUpdatedAt,
    ...restState
  } = state;
  const candidate = {
    speckitSessionId: null,
    lastSpecFolder: null,
    sessionSummary: null,
    pendingCompactPrime: null,
    producerMetadata: null,
    ...existing,
    ...restState,
    schemaVersion: CURRENT_HOOK_STATE_SCHEMA_VERSION,
    claudeSessionId: sessionId,
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
    createdAt: existing?.createdAt ?? patchCreatedAt ?? now,
    updatedAt: existing?.updatedAt ?? now,
  };
  const parsed = HookStateSchema.parse(candidate);
  return {
    ...parsed,
    pendingCompactPrime: normalizePendingCompactPrime(
      parsed.pendingCompactPrime,
      existing?.pendingCompactPrime ?? null,
    ),
  };
}

function persistState(
  sessionId: string,
  state: PersistedHookState,
): { persisted: boolean; written: PersistedHookState; path: string } {
  const filePath = getStatePath(sessionId);
  const tmpPath = `${filePath}.tmp-${process.pid}-${tempCounter++}-${crypto.randomBytes(4).toString('hex')}`;
  const written: PersistedHookState = {
    ...state,
    updatedAt: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(tmpPath, JSON.stringify(written, null, 2), {
      encoding: 'utf-8',
      mode: 0o600,
    });
    fs.renameSync(tmpPath, filePath);
    return { persisted: true, written, path: filePath };
  } catch (err: unknown) {
    hookLog('error', 'state', `Failed to save state: ${err instanceof Error ? err.message : String(err)}`);
    try {
      if (fs.existsSync(tmpPath)) {
        fs.rmSync(tmpPath, { force: true });
      }
    } catch {
      // Ignore temp cleanup failures after a write failure.
    }
    return { persisted: false, written, path: filePath };
  }
}

/** Save state atomically (write to .tmp then rename) */
export function saveState(sessionId: string, state: HookState): boolean {
  const prepared = prepareStateForPersist(sessionId, state);
  return persistState(sessionId, prepared).persisted;
}

// Quarantine unreadable or drifted state beside the source file so later hooks skip the poison pill.
function quarantineStateFile(filePath: string): string | undefined {
  const quarantinePath = `${filePath}${QUARANTINE_SUFFIX}`;
  try {
    fs.rmSync(quarantinePath, { force: true });
  } catch {
    // Best effort overwrite of prior quarantine artifact.
  }

  try {
    fs.renameSync(filePath, quarantinePath);
    hookLog('warn', 'state', `Quarantined invalid hook state at ${quarantinePath}`);
    return quarantinePath;
  } catch (error: unknown) {
    hookLog('warn', 'state', `Failed to quarantine invalid hook state ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}

function describeSchemaFailure(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || '<root>'}: ${issue.message}`)
    .join('; ');
}

function parseLoadedState(
  filePath: string,
  parsedValue: unknown,
): Omit<Extract<HookStateLoadResult, { ok: true }>, 'path'> | Omit<Extract<HookStateLoadResult, { ok: false }>, 'path'> {
  const schemaVersion = (
    typeof parsedValue === 'object'
    && parsedValue !== null
    && 'schemaVersion' in parsedValue
  )
    ? (parsedValue as { schemaVersion?: unknown }).schemaVersion
    : undefined;
  const parsed = HookStateSchema.safeParse(parsedValue);
  if (!parsed.success) {
    const reason: HookStateLoadFailureReason = (
      typeof schemaVersion === 'number'
      && schemaVersion !== CURRENT_HOOK_STATE_SCHEMA_VERSION
    )
      ? 'schema_mismatch'
      : 'invalid_state';
    return {
      ok: false,
      reason,
      detail: describeSchemaFailure(parsed.error),
      quarantinedPath: quarantineStateFile(filePath),
    };
  }

  const requiresOpaqueIdMigration = Boolean(
    parsed.data.pendingCompactPrime
    && parsed.data.pendingCompactPrime.opaqueId === undefined,
  );
  const state: PersistedHookState = {
    ...parsed.data,
    pendingCompactPrime: normalizePendingCompactPrime(parsed.data.pendingCompactPrime),
  };
  const migrated = schemaVersion === undefined || requiresOpaqueIdMigration;
  if (!migrated) {
    return {
      ok: true,
      state,
      migrated: false,
      persisted: true,
    };
  }

  const migrationWrite = persistState(state.claudeSessionId, state);
  if (!migrationWrite.persisted) {
    hookLog('warn', 'state', `Lazy migration write-back failed for session ${state.claudeSessionId}`);
  }
  return {
    ok: true,
    state: migrationWrite.written,
    migrated: true,
    persisted: migrationWrite.persisted,
  };
}

function readStateFile(filePath: string): HookStateLoadResult {
  let initialStat: fs.Stats;
  try {
    initialStat = statSync(filePath);
  } catch (error: unknown) {
    const maybeErr = error as NodeJS.ErrnoException;
    return {
      ok: false,
      reason: maybeErr?.code === 'ENOENT' ? 'not_found' : 'read_error',
      path: filePath,
      detail: error instanceof Error ? error.message : String(error),
    };
  }

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf-8');
  } catch (error: unknown) {
    const maybeErr = error as NodeJS.ErrnoException;
    return {
      ok: false,
      reason: maybeErr?.code === 'ENOENT' ? 'not_found' : 'read_error',
      path: filePath,
      detail: error instanceof Error ? error.message : String(error),
    };
  }

  try {
    const afterReadStat = statSync(filePath);
    if (initialStat.mtimeMs !== afterReadStat.mtimeMs) {
      return {
        ok: false,
        reason: 'mtime_changed',
        path: filePath,
        detail: 'State file changed during read; discarding candidate.',
      };
    }
  } catch (error: unknown) {
    const maybeErr = error as NodeJS.ErrnoException;
    return {
      ok: false,
      reason: maybeErr?.code === 'ENOENT' ? 'not_found' : 'read_error',
      path: filePath,
      detail: error instanceof Error ? error.message : String(error),
    };
  }

  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(raw);
  } catch (error: unknown) {
    return {
      ok: false,
      reason: 'parse_error',
      path: filePath,
      detail: error instanceof Error ? error.message : String(error),
      quarantinedPath: quarantineStateFile(filePath),
    };
  }

  const parsed = parseLoadedState(filePath, parsedValue);
  return {
    ...parsed,
    path: filePath,
  };
}

/** Load state for a session. */
export function loadState(sessionId: string): HookStateLoadResult {
  return readStateFile(getStatePath(sessionId));
}

function matchesScope(state: PersistedHookState, scope: HookStateScope): boolean {
  if (scope.specFolder && state.lastSpecFolder !== scope.specFolder) {
    return false;
  }

  if (scope.claudeSessionId && state.claudeSessionId !== scope.claudeSessionId) {
    return false;
  }

  return true;
}

function deriveMostRecentFailureReason(errors: HookStateFileError[]): HookStateLoadFailureReason {
  const getPriority = (reason: HookStateLoadFailureReason): number => {
    switch (reason) {
      case 'schema_mismatch':
        return 0;
      case 'parse_error':
        return 1;
      case 'invalid_state':
        return 2;
      case 'mtime_changed':
        return 3;
      case 'read_error':
        return 4;
      case 'not_found':
        return 5;
      case 'scope_unknown_fail_closed':
        return Number.POSITIVE_INFINITY;
      default:
        return assertNever(reason, 'hook-state-load-failure-reason');
    }
  };

  let bestReason: HookStateLoadFailureReason = 'not_found';
  for (const error of errors) {
    if (getPriority(error.reason) < getPriority(bestReason)) {
      bestReason = error.reason;
    }
  }

  return bestReason;
}

/**
 * T-SRS-03 (R38-001 extension): expose every matching state newest-first so
 * consumers (e.g. `getCachedSessionSummaryDecision`) can retry per-candidate
 * instead of failing when the single newest state happens to fail a later
 * fidelity gate.  This is the shared scan used by `loadMostRecentState`; we
 * factor it out so both single-candidate and multi-candidate consumers share
 * the same per-file isolation logic.
 */
export function loadMatchingStates(
  options: {
    maxAgeMs?: number;
    scope?: HookStateScope;
  } = {},
): LoadMatchingStatesResult {
  const maxAgeMs = options.maxAgeMs ?? MAX_RECENT_STATE_AGE_MS;
  const scope = options.scope;
  const hasScope = Boolean(scope?.specFolder || scope?.claudeSessionId);

  if (!hasScope) {
    hookLog(
      'warn',
      'state',
      JSON.stringify({
        event: 'load_matching_states_rejected',
        reason: 'scope_unknown_fail_closed',
      }),
    );
    return {
      states: [],
      errors: [],
      reason: 'scope_unknown_fail_closed',
      detail: 'Matching-state lookup requires a specFolder or claudeSessionId scope.',
    };
  }

  try {
    const dir = getStateDir();
    const candidates = readdirSync(dir).filter((file) => file.endsWith('.json'));
    if (candidates.length === 0) {
      return { states: [], errors: [], reason: 'not_found' };
    }

    const matchingStates: LoadMatchingStatesResult['states'] = [];
    const errors: HookStateFileError[] = [];
    for (const file of candidates) {
      const filePath = join(dir, file);
      let mtimeMs: number;
      try {
        mtimeMs = statSync(filePath).mtimeMs;
      } catch (error: unknown) {
        errors.push({
          path: filePath,
          reason: 'read_error',
          detail: error instanceof Error ? error.message : String(error),
        });
        continue;
      }

      if (Date.now() - mtimeMs > maxAgeMs) {
        continue;
      }

      const stateResult = readStateFile(filePath);
      if (!stateResult.ok) {
        errors.push({
          path: filePath,
          reason: stateResult.reason,
          detail: stateResult.detail,
          quarantinedPath: stateResult.quarantinedPath,
        });
        continue;
      }
      if (!matchesScope(stateResult.state, scope!)) {
        continue;
      }

      const updatedAtParsed = Date.parse(stateResult.state.updatedAt);
      const updatedAtMs = Number.isFinite(updatedAtParsed) ? updatedAtParsed : mtimeMs;

      matchingStates.push({
        state: stateResult.state,
        path: filePath,
        updatedAtMs,
        mtimeMs,
      });
    }

    // Same primary/tiebreak ordering as loadMostRecentState.
    matchingStates.sort((left, right) => {
      if (right.updatedAtMs !== left.updatedAtMs) {
        return right.updatedAtMs - left.updatedAtMs;
      }
      return right.mtimeMs - left.mtimeMs;
    });

    if (matchingStates.length === 0) {
      return {
        states: [],
        errors,
        reason: deriveMostRecentFailureReason(errors),
        detail: errors[0]?.detail,
      };
    }

    return { states: matchingStates, errors };
  } catch {
    return { states: [], errors: [], reason: 'not_found' };
  }
}

/**
 * Load the most recently updated hook state file for this project.
 * Returns the newest matching state and isolates per-file errors so
 * one poisoned sibling does not mask valid state.
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
    return {
      ok: false,
      reason: 'scope_unknown_fail_closed',
      detail: 'Most-recent state lookup requires a specFolder or claudeSessionId scope.',
      errors: [],
    };
  }

  try {
    const dir = getStateDir();
    const candidates = readdirSync(dir).filter((file) => file.endsWith('.json'));
    if (candidates.length === 0) {
      return { ok: false, reason: 'not_found', errors: [] };
    }

    // T-HST-10 (R4-003): rank by logical `state.updatedAt` rather than filesystem `mtimeMs`.
    // Touch-based operations (backup, rsync --times, fs-level restore) can bump mtime without
    // reflecting a newer logical session update. `updatedAt` is the authoritative write-time
    // marker persisted by `persistState()` and is therefore stable across filesystem touches.
    const matchingStates: Array<{
      state: PersistedHookState;
      path: string;
      mtimeMs: number;
      updatedAtMs: number;
    }> = [];
    const errors: HookStateFileError[] = [];
    for (const file of candidates) {
      const filePath = join(dir, file);
      let mtimeMs: number;
      try {
        mtimeMs = statSync(filePath).mtimeMs;
      } catch (error: unknown) {
        errors.push({
          path: filePath,
          reason: 'read_error',
          detail: error instanceof Error ? error.message : String(error),
        });
        continue;
      }

      if (Date.now() - mtimeMs > maxAgeMs) {
        continue;
      }

      const stateResult = readStateFile(filePath);
      if (!stateResult.ok) {
        errors.push({
          path: filePath,
          reason: stateResult.reason,
          detail: stateResult.detail,
          quarantinedPath: stateResult.quarantinedPath,
        });
        continue;
      }
      if (!matchesScope(stateResult.state, scope!)) {
        continue;
      }

      // Fall back to mtime when `updatedAt` is unparseable (e.g. drift from out-of-band writes).
      const updatedAtParsed = Date.parse(stateResult.state.updatedAt);
      const updatedAtMs = Number.isFinite(updatedAtParsed) ? updatedAtParsed : mtimeMs;

      matchingStates.push({
        state: stateResult.state,
        path: filePath,
        mtimeMs,
        updatedAtMs,
      });
    }

    // Primary sort: logical `updatedAt`; tiebreak on `mtimeMs` to keep ordering deterministic
    // when two states share the same ISO timestamp.
    matchingStates.sort((left, right) => {
      if (right.updatedAtMs !== left.updatedAtMs) {
        return right.updatedAtMs - left.updatedAtMs;
      }
      return right.mtimeMs - left.mtimeMs;
    });
    const newest = matchingStates[0];
    if (!newest) {
      return {
        ok: false,
        reason: deriveMostRecentFailureReason(errors),
        detail: errors[0]?.detail,
        errors,
      };
    }

    return {
      ok: true,
      state: newest.state,
      path: newest.path,
      errors,
    };
  } catch {
    return { ok: false, reason: 'not_found', errors: [] };
  }
}

/** Read pending compact prime without clearing it from state */
export function readCompactPrime(sessionId: string): PersistedHookState['pendingCompactPrime'] {
  const stateResult = loadState(sessionId);
  return stateResult.ok ? stateResult.state.pendingCompactPrime ?? null : null;
}

function matchesCompactPrimeIdentity(
  pendingCompactPrime: PersistedHookState['pendingCompactPrime'],
  expectedIdentity?: HookStateCompactPrimeIdentity,
): boolean {
  if (!pendingCompactPrime || !expectedIdentity) {
    return true;
  }
  if (expectedIdentity.opaqueId && pendingCompactPrime.opaqueId) {
    return pendingCompactPrime.opaqueId === expectedIdentity.opaqueId;
  }
  return pendingCompactPrime.cachedAt === expectedIdentity.cachedAt;
}

/** Clear pending compact prime from state (call after stdout write confirmed) */
export function clearCompactPrime(
  sessionId: string,
  expectedIdentity?: HookStateCompactPrimeIdentity,
): HookStateUpdateResult | null {
  const stateResult = loadState(sessionId);
  if (!stateResult.ok || !stateResult.state.pendingCompactPrime) {
    return null;
  }
  if (!matchesCompactPrimeIdentity(stateResult.state.pendingCompactPrime, expectedIdentity)) {
    hookLog('info', 'state', `Skipped clearing compact payload for session ${sessionId} because the cached payload changed`);
    return null;
  }

  const nextState = updateState(sessionId, { pendingCompactPrime: null });
  if (!nextState.persisted) {
    hookLog('warn', 'state', `Failed to clear pending compact payload for session ${sessionId}`);
  }
  return nextState;
}

/**
 * Read pending compact prime, clear it from state, and return the cached value.
 * @deprecated Use readCompactPrime() + clearCompactPrime() to avoid data loss
 * if the process crashes between clear and stdout write.
 */
export function readAndClearCompactPrime(sessionId: string): PersistedHookState['pendingCompactPrime'] {
  const prime = readCompactPrime(sessionId);
  if (prime) {
    clearCompactPrime(sessionId, {
      cachedAt: prime.cachedAt,
      opaqueId: prime.opaqueId ?? null,
    });
  }
  return prime;
}

/** Load, merge patch, save, and return updated state */
export function updateState(
  sessionId: string,
  patch: Partial<HookState>,
): HookStateUpdateResult {
  const existingResult = loadState(sessionId);
  const existing = existingResult.ok ? existingResult.state : null;
  const merged = prepareStateForPersist(sessionId, patch, existing);
  const writeResult = persistState(sessionId, merged);
  if (!writeResult.persisted) {
    hookLog('warn', 'state', `State update was not persisted for session ${sessionId}`);
  }
  return {
    ok: writeResult.persisted,
    merged: writeResult.written,
    persisted: writeResult.persisted,
    path: writeResult.path,
  };
}

function appendCleanupSkip(
  result: CleanStaleStatesResult,
  filePath: string,
  reason: string,
): void {
  result.skipped += 1;
  result.errors.push({
    path: filePath,
    reason: 'read_error',
    detail: reason,
  });
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
