// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Auto-Trigger (Ensure Ready)
// ───────────────────────────────────────────────────────────────
// Checks if the code graph needs reindexing before a query and
// performs the reindex automatically. Shared helper for context,
// query, and status handlers.

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { relative } from 'node:path';
import { getDb, getLastGitHead, setLastGitHead, ensureFreshFiles } from './code-graph-db.js';
import { indexFiles } from './structural-indexer.js';
import { getDefaultConfig } from './indexer-types.js';
import type { IndexerConfig } from './indexer-types.js';
import * as graphDb from './code-graph-db.js';

// ───────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────

export type ReadyAction = 'none' | 'full_scan' | 'selective_reindex';
export type GraphFreshness = 'fresh' | 'stale' | 'empty';

export interface ReadyResult {
  action: ReadyAction;
  files?: string[];
  reason: string;
}

export interface EnsureReadyOptions {
  allowInlineIndex?: boolean;
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
  if (currentHead && storedHead && currentHead !== storedHead) {
      return {
        freshness: 'stale',
        action: 'full_scan',
        staleFiles: [],
        deletedFiles: [],
        reason: `git HEAD changed: ${storedHead.slice(0, 8)} -> ${currentHead.slice(0, 8)}`,
      };
  }

  // Condition (c): Check file mtime drift on tracked files
  const trackedFiles = graphDb.getTrackedFiles();
  if (trackedFiles.length === 0) {
    return { freshness: 'empty', action: 'full_scan', staleFiles: [], deletedFiles: [], reason: 'no tracked files in code_files table' };
  }

  const { existingFiles, deletedFiles } = partitionTrackedFiles(trackedFiles);
  const { stale } = ensureFreshFiles(existingFiles);
  if (stale.length === 0) {
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
      reason: deletedFiles.length > 0
        ? `${stale.length} stale files exceed selective threshold (${SELECTIVE_REINDEX_THRESHOLD}); ${deletedFiles.length} tracked file(s) no longer exist on disk`
        : `${stale.length} stale files exceed selective threshold (${SELECTIVE_REINDEX_THRESHOLD})`,
    };
  }

  return {
    freshness: 'stale',
    action: 'selective_reindex',
    staleFiles: stale,
    deletedFiles,
    reason: deletedFiles.length > 0
      ? `${stale.length} file(s) have newer mtime than indexed_at; ${deletedFiles.length} tracked file(s) no longer exist on disk`
      : `${stale.length} file(s) have newer mtime than indexed_at`,
  };
}

/** Run indexFiles with a timeout guard */
async function indexWithTimeout(config: IndexerConfig, timeoutMs: number): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const results = await Promise.race([
      indexFiles(config),
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener('abort', () =>
          reject(new Error(`Auto-indexing timed out after ${timeoutMs}ms`)),
        );
      }),
    ]);

    // Persist results to DB
    for (const result of results) {
      try {
        const fileId = graphDb.upsertFile(
          result.filePath, result.language, result.contentHash,
          result.nodes.length, result.edges.length,
          result.parseHealth, result.parseDurationMs,
        );
        graphDb.replaceNodes(fileId, result.nodes);
        const sourceIds = result.nodes.map(n => n.symbolId);
        graphDb.replaceEdges(sourceIds, result.edges);
      } catch {
        // Best-effort: skip files that fail to persist
      }
    }
  } finally {
    clearTimeout(timer);
  }
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
let lastCheckAt = 0;
let lastCheckResult: ReadyResult | null = null;

export async function ensureCodeGraphReady(rootDir: string, options: EnsureReadyOptions = {}): Promise<ReadyResult> {
  // Debounce: skip if checked recently (prevents redundant work on rapid queries)
  const now = Date.now();
  if (lastCheckResult && (now - lastCheckAt) < DEBOUNCE_MS) {
    return lastCheckResult;
  }
  lastCheckAt = now;
  const allowInlineIndex = options.allowInlineIndex ?? true;

  const state = detectState(rootDir);
  const removedDeletedCount = cleanupDeletedTrackedFiles(state.deletedFiles);

  if (state.action === 'none') {
    lastCheckResult = { action: 'none', reason: appendCleanupReason(state.reason, removedDeletedCount) };
    return lastCheckResult;
  }

  if (!allowInlineIndex) {
    lastCheckResult = {
      action: state.action,
      ...(state.action === 'selective_reindex' ? { files: state.staleFiles } : {}),
      reason: appendCleanupReason(`${state.reason}; inline auto-index skipped for read path`, removedDeletedCount),
    };
    return lastCheckResult;
  }

  try {
    if (state.action === 'full_scan') {
      const config = getDefaultConfig(rootDir);
      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS);

      // Update stored git HEAD after full scan
      const head = getCurrentGitHead(rootDir);
      if (head) setLastGitHead(head);

      lastCheckResult = { action: 'full_scan', reason: appendCleanupReason(state.reason, removedDeletedCount) };
      return lastCheckResult;
    }

    // selective_reindex: only re-parse stale files
    if (state.action === 'selective_reindex' && state.staleFiles.length > 0) {
      const config = getDefaultConfig(rootDir);
      // F048: Convert absolute stale file paths to rootDir-relative globs
      config.includeGlobs = state.staleFiles.map(f => relative(rootDir, f));
      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS);

      lastCheckResult = {
        action: 'selective_reindex',
        files: state.staleFiles,
        reason: appendCleanupReason(state.reason, removedDeletedCount),
      };
      return lastCheckResult;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[ensure-ready] Auto-index failed: ${msg}`);
    lastCheckResult = {
      action: state.action,
      files: state.staleFiles,
      reason: appendCleanupReason(`${state.reason} (auto-index failed: ${msg})`, removedDeletedCount),
    };
    return lastCheckResult;
  }

  lastCheckResult = { action: 'none', reason: appendCleanupReason(state.reason, removedDeletedCount) };
  return lastCheckResult;
}

/**
 * Non-mutating freshness check for status display.
 * Does NOT trigger reindexing.
 */
export function getGraphFreshness(rootDir: string): GraphFreshness {
  try {
    const state = detectState(rootDir);
    return state.freshness;
  } catch {
    return 'empty';
  }
}
