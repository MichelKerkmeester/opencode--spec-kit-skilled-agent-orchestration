// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Auto-Trigger (Ensure Ready)
// ───────────────────────────────────────────────────────────────
// Checks if the code graph needs reindexing before a query and
// performs the reindex automatically. Shared helper for context,
// query, and status handlers.

import { execSync } from 'node:child_process';
import { relative } from 'node:path';
import { getDb, getStats, getLastGitHead, setLastGitHead, ensureFreshFiles, isFileStale } from './code-graph-db.js';
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

/** Detect graph state without triggering any reindex */
function detectState(rootDir: string): { freshness: GraphFreshness; action: ReadyAction; staleFiles: string[]; reason: string } {
  const d = getDb();

  // Condition (a): Graph is empty
  const nodeCount = (d.prepare('SELECT COUNT(*) as c FROM code_nodes').get() as { c: number }).c;
  if (nodeCount === 0) {
    return { freshness: 'empty', action: 'full_scan', staleFiles: [], reason: 'graph is empty (0 nodes)' };
  }

  // Condition (b): Git HEAD changed
  const currentHead = getCurrentGitHead(rootDir);
  const storedHead = getLastGitHead();
  if (currentHead && storedHead && currentHead !== storedHead) {
    return {
      freshness: 'stale',
      action: 'full_scan',
      staleFiles: [],
      reason: `git HEAD changed: ${storedHead.slice(0, 8)} -> ${currentHead.slice(0, 8)}`,
    };
  }

  // Condition (c): Check file mtime drift on tracked files
  const trackedFiles = d.prepare('SELECT file_path FROM code_files').all() as Array<{ file_path: string }>;
  const paths = trackedFiles.map(r => r.file_path);
  if (paths.length === 0) {
    return { freshness: 'empty', action: 'full_scan', staleFiles: [], reason: 'no tracked files in code_files table' };
  }

  const { stale } = ensureFreshFiles(paths);
  if (stale.length === 0) {
    return { freshness: 'fresh', action: 'none', staleFiles: [], reason: 'all tracked files are up-to-date' };
  }

  // Too many stale files => full scan is more efficient
  if (stale.length > SELECTIVE_REINDEX_THRESHOLD) {
    return {
      freshness: 'stale',
      action: 'full_scan',
      staleFiles: stale,
      reason: `${stale.length} stale files exceed selective threshold (${SELECTIVE_REINDEX_THRESHOLD})`,
    };
  }

  return {
    freshness: 'stale',
    action: 'selective_reindex',
    staleFiles: stale,
    reason: `${stale.length} file(s) have newer mtime than indexed_at`,
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

export async function ensureCodeGraphReady(rootDir: string): Promise<ReadyResult> {
  // Debounce: skip if checked recently (prevents redundant work on rapid queries)
  const now = Date.now();
  if (lastCheckResult && (now - lastCheckAt) < DEBOUNCE_MS) {
    return lastCheckResult;
  }
  lastCheckAt = now;

  const state = detectState(rootDir);

  if (state.action === 'none') {
    lastCheckResult = { action: 'none', reason: state.reason };
    return lastCheckResult;
  }

  try {
    if (state.action === 'full_scan') {
      const config = getDefaultConfig(rootDir);
      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS);

      // Update stored git HEAD after full scan
      const head = getCurrentGitHead(rootDir);
      if (head) setLastGitHead(head);

      lastCheckResult = { action: 'full_scan', reason: state.reason };
      return lastCheckResult;
    }

    // selective_reindex: only re-parse stale files
    if (state.action === 'selective_reindex' && state.staleFiles.length > 0) {
      const config = getDefaultConfig(rootDir);
      // F048: Convert absolute stale file paths to rootDir-relative globs
      config.includeGlobs = state.staleFiles.map(f => relative(rootDir, f));
      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS);

      lastCheckResult = { action: 'selective_reindex', files: state.staleFiles, reason: state.reason };
      return lastCheckResult;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[ensure-ready] Auto-index failed: ${msg}`);
    lastCheckResult = { action: state.action, files: state.staleFiles, reason: `${state.reason} (auto-index failed: ${msg})` };
    return lastCheckResult;
  }

  lastCheckResult = { action: 'none', reason: state.reason };
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
