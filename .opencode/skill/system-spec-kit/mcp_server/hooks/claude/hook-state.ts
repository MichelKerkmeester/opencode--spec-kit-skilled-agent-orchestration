// ───────────────────────────────────────────────────────────────
// MODULE: Hook State Management
// ───────────────────────────────────────────────────────────────
// Per-session state at ${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-id>.json
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
  const safe = sessionId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return join(getStateDir(), `${safe}.json`);
}

/** Ensure the state directory exists */
export function ensureStateDir(): void {
  try {
    mkdirSync(getStateDir(), { recursive: true });
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

/** Save state atomically (write to .tmp then rename) */
export function saveState(sessionId: string, state: HookState): void {
  const filePath = getStatePath(sessionId);
  const tmpPath = filePath + '.tmp';
  try {
    state.updatedAt = new Date().toISOString();
    writeFileSync(tmpPath, JSON.stringify(state, null, 2), 'utf-8');
    renameSync(tmpPath, filePath);
  } catch (err: unknown) {
    hookLog('error', 'state', `Failed to save state: ${err instanceof Error ? err.message : String(err)}`);
  }
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
  saveState(sessionId, state);
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
