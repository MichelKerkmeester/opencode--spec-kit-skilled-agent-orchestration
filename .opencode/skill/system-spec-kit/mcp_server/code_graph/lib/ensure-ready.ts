// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Auto-Trigger (Ensure Ready)
// ───────────────────────────────────────────────────────────────
// Checks if the code graph needs reindexing before a query and
// performs the reindex automatically. Shared helper for context,
// query, and status handlers.

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { getDb, getLastGitHead, setLastGitHead, ensureFreshFiles } from './code-graph-db.js';
import { indexFiles } from './structural-indexer.js';
import { getDefaultConfig } from './indexer-types.js';
import type { IndexerConfig, ParseResult } from './indexer-types.js';
import { isRecord } from './query-result-adapter.js';
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
export const SELECTIVE_REINDEX_THRESHOLD = 50;

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

/**
 * F-014-C4-02: return the file-paths touched by `git diff` between two HEAD
 * shas. Returns null on git failure (caller falls back to the existing
 * full-scan behavior — no regression). Returns an empty array when both shas
 * are valid but no files changed between them.
 *
 * The diff is `--name-only` and includes added/modified/deleted/renamed paths
 * so the caller can intersect against `getTrackedFiles()` to determine
 * whether a HEAD pointer change actually affects the indexed set.
 */
function getGitDiffFilePaths(rootDir: string, fromSha: string, toSha: string): string[] | null {
  try {
    const out = execSync(`git diff --name-only ${fromSha}..${toSha}`, {
      cwd: rootDir,
      encoding: 'utf-8',
      timeout: 5_000,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return out.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
  } catch {
    return null;
  }
}

/**
 * F-014-C4-02: Decide whether a raw HEAD pointer change actually touches the
 * indexed file set. Returns:
 *   - 'unknown' if git is unavailable or one sha is missing (caller keeps
 *     existing full-scan behavior so we never silently downgrade safety)
 *   - 'in-scope' if the diff touches at least one tracked file
 *   - 'out-of-scope' if the diff touches no tracked files (HEAD pointer can be
 *     advanced without a full reindex)
 */
function classifyHeadDriftScope(
  rootDir: string,
  storedHead: string | null,
  currentHead: string | null,
  trackedFiles: string[],
): 'unknown' | 'in-scope' | 'out-of-scope' {
  if (!storedHead || !currentHead || storedHead === currentHead) {
    return 'unknown';
  }
  const diffPaths = getGitDiffFilePaths(rootDir, storedHead, currentHead);
  if (diffPaths === null) {
    return 'unknown';
  }
  if (diffPaths.length === 0) {
    return 'out-of-scope';
  }
  // Intersect with tracked files. Compare against both bare paths (relative
  // to rootDir) and absolute paths since `getTrackedFiles()` may store either.
  const trackedSet = new Set(trackedFiles);
  for (const candidate of diffPaths) {
    if (trackedSet.has(candidate)) return 'in-scope';
    // Try absolute resolution (rootDir + candidate)
    const absCandidate = candidate.startsWith('/') ? candidate : `${rootDir.replace(/\/$/, '')}/${candidate}`;
    if (trackedSet.has(absCandidate)) return 'in-scope';
  }
  return 'out-of-scope';
}

// ─── F-014-C4-03: Candidate manifest for untracked indexable file discovery ───
//
// Rationale: `detectState()` only looks at files already in `code_files`, so a
// brand-new `src/new.ts` is invisible until something else triggers a full
// scan. We persist a compact `{count, digest}` manifest of the indexable file
// universe in `code_graph_metadata.candidate_manifest`; on `detectState()`,
// if the on-disk indexable count or digest diverges, we flip to stale +
// full_scan. The manifest is bounded (no per-path storage) so monorepos with
// 10k+ files don't bloat the metadata table.

const CANDIDATE_MANIFEST_KEY = 'candidate_manifest';

interface CandidateManifest {
  readonly count: number;
  readonly digest: string;
  readonly recordedAt: string;
}

/**
 * Load the persisted candidate manifest. Returns null if no manifest exists
 * (first run) or if the stored value is malformed.
 */
function loadCandidateManifest(): CandidateManifest | null {
  // F-014-C4-03: bounded read of the persisted manifest
  const raw = graphDb.getCodeGraphMetadata(CANDIDATE_MANIFEST_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return null;
    if (typeof parsed.count !== 'number' || typeof parsed.digest !== 'string' || typeof parsed.recordedAt !== 'string') {
      return null;
    }
    return { count: parsed.count, digest: parsed.digest, recordedAt: parsed.recordedAt };
  } catch {
    return null;
  }
}

/**
 * Persist a candidate manifest. Called after any successful full or selective
 * scan so the next `detectState()` has a baseline to compare against.
 */
function recordCandidateManifest(filePaths: string[]): void {
  // F-014-C4-03: persist {count, digest} only — no per-path storage.
  const sorted = [...filePaths].sort();
  const digest = createHash('sha256').update(sorted.join('\n'), 'utf-8').digest('hex').slice(0, 16);
  const manifest: CandidateManifest = {
    count: sorted.length,
    digest,
    recordedAt: new Date().toISOString(),
  };
  graphDb.setCodeGraphMetadata(CANDIDATE_MANIFEST_KEY, JSON.stringify(manifest));
}

/**
 * Compare on-disk tracked file paths against the stored candidate manifest.
 * Returns true when divergence is detected (count differs OR digest differs);
 * false when the manifest matches OR no manifest exists yet.
 *
 * Bounded compare: no filesystem walk happens here — we use the same
 * `getTrackedFiles()` set that `detectState()` already loads, plus existence
 * checks already performed by `partitionTrackedFiles()`. The manifest just
 * pins the cardinality + digest so a rebuild that adds N untracked files at
 * once flips to stale even if the per-file mtime check would miss them.
 */
function detectCandidateManifestDrift(filePaths: string[]): boolean {
  const stored = loadCandidateManifest();
  if (!stored) return false; // no baseline = no drift signal yet
  const sorted = [...filePaths].sort();
  if (sorted.length !== stored.count) return true;
  const digest = createHash('sha256').update(sorted.join('\n'), 'utf-8').digest('hex').slice(0, 16);
  return digest !== stored.digest;
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

  // F-014-C4-02: Classify HEAD drift by index scope. Raw HEAD drift no longer
  // triggers full_scan if the diff touches no path in `getTrackedFiles()`.
  // 'unknown' means git was unavailable or shas are missing — we keep the
  // existing safe behavior (treat headChanged as significant).
  const headScope = headChanged
    ? classifyHeadDriftScope(rootDir, storedHead, currentHead, trackedFiles)
    : 'unknown';
  const headChangedSignificant = headChanged && headScope !== 'out-of-scope';

  const { existingFiles, deletedFiles } = partitionTrackedFiles(trackedFiles);
  const { stale } = ensureFreshFiles(existingFiles);

  // F-014-C4-03: Detect untracked-indexable drift via the candidate manifest.
  // If the on-disk indexable cardinality or digest diverges from the stored
  // baseline, flip to stale + full_scan even when individual mtimes look fine.
  const manifestDrift = detectCandidateManifestDrift(trackedFiles);

  if (stale.length === 0) {
    if (headChangedSignificant) {
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

    if (manifestDrift) {
      return {
        freshness: 'stale',
        action: 'full_scan',
        staleFiles: [],
        deletedFiles,
        reason: 'candidate manifest drift: indexable file set has changed since last scan',
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

    // F-014-C4-02: HEAD pointer may have advanced without touching tracked
    // files. Update the stored HEAD so we don't re-classify on every probe.
    if (headChanged && headScope === 'out-of-scope' && currentHead) {
      setLastGitHead(currentHead);
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
 *
 * F-002-A2-01: Wrap the four storage operations (stage upsert, replaceNodes,
 * replaceEdges, finalize upsert) in a single per-file transaction so a crash
 * mid-persistence rolls all four back atomically. Per-file scope keeps the
 * lock window short (3-4 statements) so concurrent readers/writers on the
 * same DB are not starved during a long scan.
 */
export function persistIndexedFileResult(result: ParseResult): void {
  // F-002-A2-01: atomic per-file persistence boundary
  const tx = graphDb.getDb().transaction(() => {
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
  });
  tx();
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
export async function ensureCodeGraphReady(rootDir: string, options: EnsureReadyOptions = {}): Promise<ReadyResult> {
  const allowInlineIndex = options.allowInlineIndex ?? true;
  const allowInlineFullScan = options.allowInlineFullScan ?? allowInlineIndex;

  const state = detectState(rootDir);
  const removedDeletedCount = cleanupDeletedTrackedFiles(state.deletedFiles);
  const verificationGate = getVerificationGate(graphDb.getLastGoldVerification());

  if (state.action === 'none') {
    return {
      freshness: state.freshness,
      action: 'none',
      inlineIndexPerformed: false,
      reason: appendCleanupReason(state.reason, removedDeletedCount),
      verificationGate,
    };
  }

  if (state.action === 'selective_reindex' && !allowInlineIndex) {
    return {
      freshness: state.freshness,
      action: state.action,
      ...(state.action === 'selective_reindex' ? { files: state.staleFiles } : {}),
      inlineIndexPerformed: false,
      reason: appendCleanupReason(`${state.reason}; inline auto-index skipped for read path`, removedDeletedCount),
      selfHealAttempted: true,
      selfHealResult: 'skipped',
      verificationGate,
    };
  }

  if (state.action === 'full_scan' && !allowInlineFullScan) {
    return {
      freshness: state.freshness,
      action: state.action,
      inlineIndexPerformed: false,
      reason: appendCleanupReason(`${state.reason}; inline full scan skipped for read path`, removedDeletedCount),
      verificationGate,
    };
  }

  try {
    if (state.action === 'full_scan') {
      const config = getDefaultConfig(rootDir);
      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS);

      // Update stored git HEAD after full scan
      const head = getCurrentGitHead(rootDir);
      if (head) setLastGitHead(head);
      // F-014-C4-03: refresh candidate manifest after a full scan so the next
      // detectState() has a current baseline to compare against.
      try {
        recordCandidateManifest(graphDb.getTrackedFiles());
      } catch {
        // Best-effort: manifest recording must never block a successful scan
      }

      const refreshedState = detectState(rootDir);
      return {
        freshness: refreshedState.freshness,
        action: refreshedState.action,
        ...(refreshedState.action === 'selective_reindex' ? { files: refreshedState.staleFiles } : {}),
        inlineIndexPerformed: true,
        reason: appendCleanupReason(refreshedState.reason, removedDeletedCount),
        verificationGate,
      };
    }

    // selective_reindex: only re-parse stale files
    if (state.action === 'selective_reindex' && state.staleFiles.length > 0) {
      const lastSelfHealAt = new Date().toISOString();
      const config = getDefaultConfig(rootDir);
      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS, { specificFiles: state.staleFiles });

      const head = getCurrentGitHead(rootDir);
      if (head) setLastGitHead(head);
      // F-014-C4-03: refresh candidate manifest after a selective reindex too
      // (the tracked-file set may have grown if the scan added new files).
      try {
        recordCandidateManifest(graphDb.getTrackedFiles());
      } catch {
        // Best-effort: manifest recording must never block a successful scan
      }

      const refreshedState = detectState(rootDir);
      const selfHealResult = refreshedState.freshness === 'fresh' && refreshedState.action === 'none'
        ? 'ok'
        : 'failed';
      return {
        freshness: refreshedState.freshness,
        action: refreshedState.action,
        ...(refreshedState.action === 'selective_reindex' ? { files: refreshedState.staleFiles } : {}),
        inlineIndexPerformed: true,
        reason: appendCleanupReason(refreshedState.reason, removedDeletedCount),
        selfHealAttempted: true,
        selfHealResult,
        verificationGate,
        lastSelfHealAt,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[ensure-ready] Auto-index failed: ${msg}`);
    return {
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
    };
  }

  return {
    freshness: state.freshness,
    action: 'none',
    inlineIndexPerformed: false,
    reason: appendCleanupReason(state.reason, removedDeletedCount),
    verificationGate,
  };
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

// ───────────────────────────────────────────────────────────────
// Read-only readiness snapshot (Packet 014)
// ───────────────────────────────────────────────────────────────
// Surfaces the same `action` + `freshness` + `reason` triplet that
// `ensureCodeGraphReady` would emit, but WITHOUT mutating any state:
//   - no debounce cache writes
//   - no cleanup of deleted tracked files
//   - no inline indexing (full or selective)
//   - no `setLastGitHead` updates
//
// Used by `code_graph_status` so operators can distinguish
// "needs full scan" vs "needs selective reindex" vs "fresh"
// without invoking `code_graph_scan` (which mutates).
//
// See:
//   .opencode/specs/system-spec-kit/026-graph-and-context-optimization/
//   011-mcp-runtime-stress-remediation/011-post-stress-followup-research/
//   research/research.md §5 (Q-P2)

export interface GraphReadinessSnapshot {
  freshness: GraphFreshness;
  action: ReadyAction;
  reason: string;
}

/**
 * Compute the readiness action that `ensureCodeGraphReady` WOULD take,
 * without performing any mutation. Safe to call from `code_graph_status`
 * and any other read-only diagnostic surface.
 *
 * Reuses the detection-only branch of {@link detectState}; intentionally
 * does NOT touch the cache (`readinessDebounce`), the deleted-file cleanup
 * (`cleanupDeletedTrackedFiles`), or the inline indexer.
 *
 * On probe crash, returns `{ freshness: 'error', action: 'none', reason }`
 * so the consumer can render an unavailable state instead of inheriting an
 * exception.
 */
export function getGraphReadinessSnapshot(rootDir: string): GraphReadinessSnapshot {
  try {
    const state = detectState(rootDir);
    return {
      freshness: state.freshness,
      action: state.action,
      reason: state.reason,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      freshness: 'error',
      action: 'none',
      reason: `readiness probe crashed: ${msg}`,
    };
  }
}
