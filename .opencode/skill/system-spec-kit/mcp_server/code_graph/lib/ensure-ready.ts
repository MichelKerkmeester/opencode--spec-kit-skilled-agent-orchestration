// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Auto-Trigger (Ensure Ready)
// ───────────────────────────────────────────────────────────────
// Checks if the code graph needs reindexing before a query and
// performs the reindex automatically. Shared helper for context,
// query, and status handlers.

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { getDb, getLastGitHead, setLastGitHead, ensureFreshFiles } from './code-graph-db.js';
import { indexFiles } from './structural-indexer.js';
import { getDefaultConfig } from './indexer-types.js';
import type { IndexerConfig, ParseResult } from './indexer-types.js';
import * as graphDb from './code-graph-db.js';

// ───────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────

export type ReadyAction = 'none' | 'full_scan' | 'selective_reindex';
// PR 4 / F71 / F17 / F18: Re-export the canonical GraphFreshness union from
// ops-hardening (V2 superset: includes 'error' for unreachable/crashed scopes).
// The local 3-value alias is gone; ensure-ready callers pick up the widened
// union automatically via this re-export so the codebase stays on a single
// vocabulary (see plan §6 PR 4 step 1).
export type { GraphFreshness } from './ops-hardening.js';
import type { GraphFreshness } from './ops-hardening.js';

export interface ReadyResult {
  freshness: GraphFreshness;
  action: ReadyAction;
  files?: string[];
  inlineIndexPerformed: boolean;
  reason: string;
  selfHealAttempted?: boolean;
  selfHealResult?: 'ok' | 'failed' | 'skipped';
  verificationGate?: 'pass' | 'fail' | 'absent';
  lastSelfHealAt?: string;
}

export interface EnsureReadyOptions {
  allowInlineIndex?: boolean;
  allowInlineFullScan?: boolean;
}

// ───────────────────────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────────────────────

/** Maximum time (ms) before auto-indexing is aborted */
const AUTO_INDEX_TIMEOUT_MS = 10_000;

/** Maximum stale files before we switch from selective to full reindex */
const SELECTIVE_REINDEX_THRESHOLD = 50;

// ───────────────────────────────────────────────────────────────
// Internal helpers
// ───────────────────────────────────────────────────────────────

function getCurrentGitHead(rootDir: string): string | null {
  try {
    return execSync('git rev-parse HEAD', {
      cwd: rootDir,
      encoding: 'utf-8',
      timeout: 5_000,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

function partitionTrackedFiles(filePaths: string[]): { existingFiles: string[]; deletedFiles: string[] } {
  const existingFiles: string[] = [];
  const deletedFiles: string[] = [];

  for (const filePath of filePaths) {
    if (existsSync(filePath)) {
      existingFiles.push(filePath);
      continue;
    }

    deletedFiles.push(filePath);
  }

  return { existingFiles, deletedFiles };
}

function cleanupDeletedTrackedFiles(filePaths: string[]): number {
  for (const filePath of filePaths) {
    graphDb.removeFile(filePath);
  }

  return filePaths.length;
}

function appendCleanupReason(reason: string, removedDeletedCount: number): string {
  if (removedDeletedCount === 0) {
    return reason;
  }

  return `${reason}; removed ${removedDeletedCount} deleted tracked file(s)`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getVerificationGate(
  verification: object | null,
): ReadyResult['verificationGate'] {
  if (!isRecord(verification)) {
    return 'absent';
  }

  if (verification.passed === false) {
    return 'fail';
  }

  if (!isRecord(verification.pass_policy)) {
    return verification.passed === true ? 'pass' : 'absent';
  }

  const overallThreshold = verification.pass_policy.overall_pass_rate;
  const edgeThreshold = verification.pass_policy.edge_focus_pass_rate;
  const overallPassRate = verification.overall_pass_rate ?? verification.overallPassRate;
  const edgeFocusPassRate = verification.edge_focus_pass_rate;

  if (
    typeof overallThreshold !== 'number'
    || typeof edgeThreshold !== 'number'
    || typeof overallPassRate !== 'number'
    || typeof edgeFocusPassRate !== 'number'
  ) {
    return verification.passed === true ? 'pass' : 'absent';
  }

  return overallPassRate >= overallThreshold && edgeFocusPassRate >= edgeThreshold
    ? 'pass'
    : 'fail';
}

/** Detect graph state without triggering any reindex */
function detectState(rootDir: string): {
  freshness: GraphFreshness;
  action: ReadyAction;
  staleFiles: string[];
  deletedFiles: string[];
  reason: string;
} {
  const d = getDb();

  // Condition (a): Graph is empty
  const nodeCount = (d.prepare('SELECT COUNT(*) as c FROM code_nodes').get() as { c: number }).c;
  if (nodeCount === 0) {
    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'graph is empty (0 nodes)' };
  }

  // Condition (b): Git HEAD changed
  const currentHead = getCurrentGitHead(rootDir);
  const storedHead = getLastGitHead();
  const headChanged = Boolean(currentHead && storedHead && currentHead !== storedHead);
  // headChanged proves both git refs are present before formatting the transition.
  const headChangedReason = headChanged
    ? `git HEAD changed: ${storedHead!.slice(0, 8)} -> ${currentHead!.slice(0, 8)}`
    : null;

  // Condition (c): Check file mtime drift on tracked files
  const trackedFiles = graphDb.getTrackedFiles();
  if (trackedFiles.length === 0) {
    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'no tracked files in code_files table' };
  }

  const { existingFiles, deletedFiles } = partitionTrackedFiles(trackedFiles);
  const { stale } = ensureFreshFiles(existingFiles);
  if (stale.length === 0) {
    if (headChanged) {
      return {
        freshness: 'stale',
        action: 'full_scan',
        staleFiles: [],
        deletedFiles,
        reason: deletedFiles.length > 0
          ? `${headChangedReason}; tracked files appear up-to-date on disk; ${deletedFiles.length} tracked file(s) no longer exist on disk`
          : `${headChangedReason}; tracked files appear up-to-date on disk`,
      };
    }

    if (deletedFiles.length > 0) {
      return {
        freshness: 'stale',
        action: 'none',
        staleFiles: [],
        deletedFiles,
        reason: `${deletedFiles.length} tracked file(s) no longer exist on disk`,
      };
    }

    return { freshness: 'fresh', action: 'none', staleFiles: [], deletedFiles: [], reason: 'all tracked files are up-to-date' };
  }

  // Too many stale files => full scan is more efficient
  if (stale.length > SELECTIVE_REINDEX_THRESHOLD) {
    return {
      freshness: 'stale',
      action: 'full_scan',
      staleFiles: stale,
      deletedFiles,
      reason: [
        headChangedReason,
        `${stale.length} stale files exceed selective threshold (${SELECTIVE_REINDEX_THRESHOLD})`,
        deletedFiles.length > 0 ? `${deletedFiles.length} tracked file(s) no longer exist on disk` : null,
      ].filter(Boolean).join('; '),
    };
  }

  return {
    freshness: 'stale',
    action: 'selective_reindex',
    staleFiles: stale,
    deletedFiles,
    reason: [
      headChangedReason,
      `${stale.length} file(s) have newer mtime than indexed_at`,
      deletedFiles.length > 0 ? `${deletedFiles.length} tracked file(s) no longer exist on disk` : null,
    ].filter(Boolean).join('; '),
  };
}

/** Run indexFiles with a timeout guard */
async function indexWithTimeout(
  config: IndexerConfig,
  timeoutMs: number,
  indexOptions?: Parameters<typeof indexFiles>[1],
): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const results = await Promise.race([
      indexFiles(config, indexOptions),
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener('abort', () =>
          reject(new Error(`Auto-indexing timed out after ${timeoutMs}ms`)),
        );
      }),
    ]);

    let persistedDetectorProvenance: ReturnType<typeof graphDb.getLastDetectorProvenance> = null;
    for (const result of results) {
      try {
        persistIndexedFileResult(result);
        persistedDetectorProvenance ??= result.detectorProvenance;
      } catch {
        // Best-effort: skip files that fail to persist.  File remains stale
        // (mtime=0 from Stage 1) so the next scan will retry structural rows.
      }
    }

    if (persistedDetectorProvenance) {
      graphDb.setLastDetectorProvenance(persistedDetectorProvenance);
    }
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Persist one indexed file without marking it fresh until structural rows land.
 *
 * T-ENR-02 (R5-002): Stage `file_mtime_ms=0`, write nodes/edges, then finalize
 * with the real mtime so persistence failures leave the file stale for retry.
 */
export function persistIndexedFileResult(result: ParseResult): void {
  const fileId = graphDb.upsertFile(
    result.filePath, result.language, result.contentHash,
    result.nodes.length, result.edges.length,
    result.parseHealth, result.parseDurationMs,
    { fileMtimeMs: 0 },
  );
  graphDb.replaceNodes(fileId, result.nodes);
  const sourceIds = result.nodes.map((node) => node.symbolId);
  graphDb.replaceEdges(sourceIds, result.edges);
  graphDb.upsertFile(
    result.filePath, result.language, result.contentHash,
    result.nodes.length, result.edges.length,
    result.parseHealth, result.parseDurationMs,
  );
}

// ───────────────────────────────────────────────────────────────
// Public API
// ───────────────────────────────────────────────────────────────

/**
 * Check whether the code graph is ready and, if not, perform
 * the minimum necessary reindexing before returning.
 *
 * Has a 10-second timeout guard so auto-indexing never blocks
 * queries forever.
 */
/** Debounce: skip re-check if last check was within this window */
const DEBOUNCE_MS = 5_000;
interface ReadyDebounceEntry {
  checkedAt: number;
  result: ReadyResult;
}

const readinessDebounce = new Map<string, ReadyDebounceEntry>();

function buildReadinessDebounceKey(
  rootDir: string,
  allowInlineIndex: boolean,
  allowInlineFullScan: boolean,
): string {
  return JSON.stringify({
    rootDir: resolve(rootDir),
    allowInlineIndex,
    allowInlineFullScan,
  });
}

function cacheReadyResult(cacheKey: string, result: ReadyResult): ReadyResult {
  readinessDebounce.set(cacheKey, {
    checkedAt: Date.now(),
    result,
  });
  return result;
}

export async function ensureCodeGraphReady(rootDir: string, options: EnsureReadyOptions = {}): Promise<ReadyResult> {
  const allowInlineIndex = options.allowInlineIndex ?? true;
  const allowInlineFullScan = options.allowInlineFullScan ?? allowInlineIndex;
  const cacheKey = buildReadinessDebounceKey(rootDir, allowInlineIndex, allowInlineFullScan);

  // Debounce: skip if the same workspace + option shape was checked recently.
  const now = Date.now();
  const cachedEntry = readinessDebounce.get(cacheKey);
  if (cachedEntry && (now - cachedEntry.checkedAt) < DEBOUNCE_MS) {
    return cachedEntry.result;
  }

  const state = detectState(rootDir);
  const removedDeletedCount = cleanupDeletedTrackedFiles(state.deletedFiles);
  const verificationGate = getVerificationGate(graphDb.getLastGoldVerification());

  if (state.action === 'none') {
    return cacheReadyResult(cacheKey, {
      freshness: state.freshness,
      action: 'none',
      inlineIndexPerformed: false,
      reason: appendCleanupReason(state.reason, removedDeletedCount),
      verificationGate,
    });
  }

  if (state.action === 'selective_reindex' && !allowInlineIndex) {
    return cacheReadyResult(cacheKey, {
      freshness: state.freshness,
      action: state.action,
      ...(state.action === 'selective_reindex' ? { files: state.staleFiles } : {}),
      inlineIndexPerformed: false,
      reason: appendCleanupReason(`${state.reason}; inline auto-index skipped for read path`, removedDeletedCount),
      selfHealAttempted: true,
      selfHealResult: 'skipped',
      verificationGate,
    });
  }

  if (state.action === 'full_scan' && !allowInlineFullScan) {
    return cacheReadyResult(cacheKey, {
      freshness: state.freshness,
      action: state.action,
      inlineIndexPerformed: false,
      reason: appendCleanupReason(`${state.reason}; inline full scan skipped for read path`, removedDeletedCount),
      verificationGate,
    });
  }

  try {
    if (state.action === 'full_scan') {
      const config = getDefaultConfig(rootDir);
      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS);

      // Update stored git HEAD after full scan
      const head = getCurrentGitHead(rootDir);
      if (head) setLastGitHead(head);

      const refreshedState = detectState(rootDir);
      return cacheReadyResult(cacheKey, {
        freshness: refreshedState.freshness,
        action: refreshedState.action,
        ...(refreshedState.action === 'selective_reindex' ? { files: refreshedState.staleFiles } : {}),
        inlineIndexPerformed: true,
        reason: appendCleanupReason(refreshedState.reason, removedDeletedCount),
        verificationGate,
      });
    }

    // selective_reindex: only re-parse stale files
    if (state.action === 'selective_reindex' && state.staleFiles.length > 0) {
      const lastSelfHealAt = new Date().toISOString();
      const config = getDefaultConfig(rootDir);
      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS, { specificFiles: state.staleFiles });

      const head = getCurrentGitHead(rootDir);
      if (head) setLastGitHead(head);

      const refreshedState = detectState(rootDir);
      const selfHealResult = refreshedState.freshness === 'fresh' && refreshedState.action === 'none'
        ? 'ok'
        : 'failed';
      return cacheReadyResult(cacheKey, {
        freshness: refreshedState.freshness,
        action: refreshedState.action,
        ...(refreshedState.action === 'selective_reindex' ? { files: refreshedState.staleFiles } : {}),
        inlineIndexPerformed: true,
        reason: appendCleanupReason(refreshedState.reason, removedDeletedCount),
        selfHealAttempted: true,
        selfHealResult,
        verificationGate,
        lastSelfHealAt,
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[ensure-ready] Auto-index failed: ${msg}`);
    return cacheReadyResult(cacheKey, {
      freshness: state.freshness,
      action: state.action,
      files: state.staleFiles,
      inlineIndexPerformed: false,
      reason: appendCleanupReason(`${state.reason} (auto-index failed: ${msg})`, removedDeletedCount),
      verificationGate,
      ...(state.action === 'selective_reindex'
        ? {
            selfHealAttempted: true,
            selfHealResult: 'failed' as const,
            lastSelfHealAt: new Date().toISOString(),
          }
        : {}),
    });
  }

  return cacheReadyResult(cacheKey, {
    freshness: state.freshness,
    action: 'none',
    inlineIndexPerformed: false,
    reason: appendCleanupReason(state.reason, removedDeletedCount),
    verificationGate,
  });
}

/**
 * Non-mutating freshness check for status display.
 * Does NOT trigger reindexing.
 *
 * PR 4 / F71 / F17 / F18: returns 'error' on probe crash so callers can
 * canonically distinguish "scope is unreachable" from "scope is empty".
 * The widened union flows through readiness-contract → trustStateFromGraphState
 * to emit `trustState: 'unavailable'` per the V5-widened contract.
 */
export function getGraphFreshness(rootDir: string): GraphFreshness {
  try {
    const state = detectState(rootDir);
    return state.freshness;
  } catch {
    return 'error';
  }
}
