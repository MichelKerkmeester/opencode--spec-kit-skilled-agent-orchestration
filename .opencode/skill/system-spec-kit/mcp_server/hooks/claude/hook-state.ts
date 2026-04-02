// ───────────────────────────────────────────────────────────────
// MODULE: Hook State Management
// ───────────────────────────────────────────────────────────────
// Per-session state at ${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-hash>.json
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  mkdirSync, readFileSync, writeFileSync, renameSync,
  readdirSync, statSync, unlinkSync,
} from 'node:fs';
import { hookLog } from './shared.js';

/** Per-session hook state persisted to temp directory */
export interface HookState {
  claudeSessionId: string;
  speckitSessionId: string;
  lastSpecFolder: string | null;
  sessionSummary: { text: string; extractedAt: string } | null;
  pendingCompactPrime: { payload: string; cachedAt: string } | null;
  metrics: {
    estimatedPromptTokens: number;
    estimatedCompletionTokens: number;
    lastTranscriptOffset: number;
  };
  createdAt: string;
  updatedAt: string;
}

const MAX_RECENT_STATE_AGE_MS = 24 * 60 * 60 * 1000;

/** SHA-256 hash of cwd, first 12 chars */
export function getProjectHash(): string {
  return createHash('sha256').update(process.cwd()).digest('hex').slice(0, 12);
}

/** Get the state directory path */
function getStateDir(): string {
  return join(tmpdir(), 'speckit-claude-hooks', getProjectHash());
}

/** Get the state file path for a session */
export function getStatePath(sessionId: string): string {
  const safe = createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
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

/**
 * Load the most recently updated hook state file for this project.
 * Returns null when no state exists or the newest state is older than maxAgeMs.
 */
export function loadMostRecentState(maxAgeMs: number = MAX_RECENT_STATE_AGE_MS): HookState | null {
  try {
    const dir = getStateDir();
    const candidates = readdirSync(dir).filter((file) => file.endsWith('.json'));
    if (candidates.length === 0) {
      return null;
    }

    let newestPath: string | null = null;
    let newestMtimeMs = -1;
    for (const file of candidates) {
      const filePath = join(dir, file);
      const mtimeMs = statSync(filePath).mtimeMs;
      if (mtimeMs > newestMtimeMs) {
        newestMtimeMs = mtimeMs;
        newestPath = filePath;
      }
    }

    if (!newestPath) {
      return null;
    }

    if (Date.now() - newestMtimeMs > maxAgeMs) {
      return null;
    }

    const raw = readFileSync(newestPath, 'utf-8');
    return JSON.parse(raw) as HookState;
  } catch {
    return null;
  }
}

/** Save state atomically (write to .tmp then rename) */
export function saveState(sessionId: string, state: HookState): boolean {
  const filePath = getStatePath(sessionId);
  const tmpPath = filePath + '.tmp';
  try {
    state.updatedAt = new Date().toISOString();
    writeFileSync(tmpPath, JSON.stringify(state, null, 2), { encoding: 'utf-8', mode: 0o600 });
    renameSync(tmpPath, filePath);
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
  const state: HookState = {
    claudeSessionId: sessionId,
    speckitSessionId: '',
    lastSpecFolder: null,
    sessionSummary: null,
    pendingCompactPrime: null,
    metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
    createdAt: now,
    updatedAt: now,
    ...existing,
    ...patch,
  };
  if (!saveState(sessionId, state)) {
    hookLog('warn', 'state', `State update was not persisted for session ${sessionId}`);
  }
  return state;
}

/** Remove state files older than maxAgeMs. Returns count removed. */
export function cleanStaleStates(maxAgeMs: number): number {
  let removed = 0;
  try {
    const dir = getStateDir();
    const files = readdirSync(dir);
    const cutoff = Date.now() - maxAgeMs;
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      if (stat.mtimeMs < cutoff) {
        unlinkSync(filePath);
        removed++;
      }
    }
  } catch {
    // Directory may not exist yet
  }
  return removed;
}
