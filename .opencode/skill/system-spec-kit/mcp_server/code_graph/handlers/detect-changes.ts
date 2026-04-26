// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph detect_changes Handler
// ───────────────────────────────────────────────────────────────
// Read-only preflight. Maps a unified-diff input to the structural
// symbols it touches via line-range overlap against `code_nodes`.
//
// Critical safety invariant (P1, pt-02 §12 RISK-03 / R-002-4):
//   When the graph readiness requires a full scan (or readiness
//   probe crashed), this handler MUST return `status: 'blocked'`
//   instead of an empty `affectedSymbols[]`. Returning an empty
//   list against a stale graph would imply false-safe "no impact",
//   which is the rollback trigger documented in pt-02.

import { resolve, sep, isAbsolute, normalize } from 'node:path';
import { ensureCodeGraphReady, type ReadyResult } from '../lib/ensure-ready.js';
import * as graphDb from '../lib/code-graph-db.js';
import { parseUnifiedDiff, rangesOverlap, type DiffFile } from '../lib/diff-parser.js';
import { buildReadinessBlock, type CodeGraphReadinessBlock } from '../lib/readiness-contract.js';
import { canonicalizeWorkspacePaths, isWithinWorkspace } from '../lib/utils/workspace-path.js';

export interface DetectChangesArgs {
  /** Unified-diff text (e.g. `git diff` output). */
  readonly diff: string;
  /** Workspace root; defaults to `process.cwd()`. */
  readonly rootDir?: string;
}

export type DetectChangesStatus = 'ok' | 'blocked' | 'parse_error' | 'error';

export interface AffectedSymbol {
  readonly symbolId: string;
  readonly fqName: string;
  readonly name: string;
  readonly kind: string;
  readonly filePath: string;
  readonly startLine: number;
  readonly endLine: number;
}

export interface DetectChangesResult {
  readonly status: DetectChangesStatus;
  readonly affectedSymbols: AffectedSymbol[];
  /** Populated when `status === 'blocked'` or `status === 'error'`. */
  readonly blockedReason?: string;
  readonly timestamp: string;
  /** Per-file roll-up so callers can see which paths were touched. */
  readonly affectedFiles: string[];
  /** Readiness envelope mirrored from other code-graph handlers. */
  readonly readiness: CodeGraphReadinessBlock;
}

interface MCPResponse {
  content: Array<{ type: 'text'; text: string }>;
}

function ts(): string {
  return new Date().toISOString();
}

function buildResponse(payload: DetectChangesResult): MCPResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(payload, null, 2),
    }],
  };
}

function blockedResponse(
  reason: string,
  readiness: CodeGraphReadinessBlock,
): MCPResponse {
  return buildResponse({
    status: 'blocked',
    affectedSymbols: [],
    affectedFiles: [],
    blockedReason: reason,
    timestamp: ts(),
    readiness,
  });
}

function errorResponse(reason: string, readiness: CodeGraphReadinessBlock): MCPResponse {
  return buildResponse({
    status: 'error',
    affectedSymbols: [],
    affectedFiles: [],
    blockedReason: reason,
    timestamp: ts(),
    readiness,
  });
}

/**
 * Returns `true` iff readiness state means we MUST refuse the
 * query rather than answer over an unreliable graph.
 *
 * Mapping (mirrors pt-02 §4 readiness difference row):
 *   - 'fresh'  → answer
 *   - 'stale'  → block (a full or selective scan is needed first)
 *   - 'empty'  → block (no rows; cannot attribute)
 *   - 'error'  → block (probe crashed / scope unreachable)
 */
function readinessRequiresBlock(readiness: ReadyResult): boolean {
  return readiness.freshness !== 'fresh' || readiness.verificationGate === 'fail';
}

/**
 * Resolve a diff path (post-image preferred) to the absolute path
 * code_nodes rows are keyed under. The structural indexer stores
 * absolute paths, so we resolve relative diff paths against the
 * canonicalized rootDir.
 *
 * Returns `null` for `/dev/null` (pure delete) — the caller must
 * skip such files since deleted symbols are no longer present in
 * the graph anyway.
 *
 * Returns `{ rejected: true, reason }` for paths whose canonical
 * resolution falls outside `canonicalRootDir`. Per R-007-3
 * (sanitization hardening), diff paths are untrusted input — a
 * relative `../../etc/passwd` or absolute `/etc/passwd` MUST be
 * refused explicitly rather than silently resolved against the
 * graph (which would expose unrelated rows or trigger spurious
 * lookups).
 *
 * The check uses path-prefix containment against the already-
 * canonicalized rootDir; we deliberately do NOT call `realpathSync`
 * on the candidate because the candidate file may not exist yet
 * (e.g. a pure-add hunk on a new file). Path-string containment is
 * sufficient for the workspace-boundary invariant.
 */
type CandidatePathResult =
  | { readonly kind: 'ok'; readonly path: string }
  | { readonly kind: 'skip' }
  | { readonly kind: 'reject'; readonly reason: string };

// 008/D2 — Diff path byte-safety contract.
// Reject paths containing NUL, C0/C1 control characters, DEL, raw newlines
// or tabs, or exceeding the platform's reasonable path-length cap. These
// inputs cannot escape the workspace by themselves (containment handles
// that) but they would propagate corrupted attribution into downstream
// rendering, logging, and graph storage.
const DIFF_PATH_MAX_LENGTH = 4096;
const DIFF_PATH_BLOCKED_BYTES = /[\x00-\x1F\x7F]/;

function checkPathByteSafety(
  candidate: string,
): { kind: 'ok' } | { kind: 'reject'; reason: string } {
  if (candidate.length > DIFF_PATH_MAX_LENGTH) {
    return {
      kind: 'reject',
      reason: `diff path exceeds ${DIFF_PATH_MAX_LENGTH}-byte cap (D2 byte-safety)`,
    };
  }
  if (DIFF_PATH_BLOCKED_BYTES.test(candidate)) {
    return {
      kind: 'reject',
      reason: 'diff path contains control characters (D2 byte-safety)',
    };
  }
  return { kind: 'ok' };
}

function checkPathContainment(
  candidate: string,
  canonicalRootDir: string,
): { kind: 'ok'; path: string } | { kind: 'reject'; reason: string } {
  // 008/D2: byte-safety check FIRST so corrupt strings never reach
  // path normalization (which can produce surprising results on inputs
  // with embedded NULs or control characters).
  const safety = checkPathByteSafety(candidate);
  if (safety.kind === 'reject') return safety;

  const normalized = normalize(candidate);
  const resolved = isAbsolute(normalized) ? normalized : resolve(canonicalRootDir, normalized);
  const rootWithSep = canonicalRootDir.endsWith(sep) ? canonicalRootDir : `${canonicalRootDir}${sep}`;
  if (resolved !== canonicalRootDir && !resolved.startsWith(rootWithSep)) {
    return {
      kind: 'reject',
      reason: `diff path resolved outside workspace root: ${candidate}`,
    };
  }
  return { kind: 'ok', path: resolved };
}

function resolveCandidatePath(
  diffFile: DiffFile,
  canonicalRootDir: string,
): CandidatePathResult {
  // R-007-3 mixed-header bypass fix (D1, P1):
  // Validate BOTH oldPath and newPath independently against the canonical
  // root, ignoring only `/dev/null`. Previously only the chosen path was
  // validated, which let an adversarial diff smuggle an out-of-root pre-
  // image header (`--- a/../../etc/passwd`) while attribution proceeded
  // against an in-root post-image (`+++ b/src/safe.ts`).
  for (const candidate of [diffFile.oldPath, diffFile.newPath]) {
    if (!candidate || candidate === '/dev/null') continue;
    const containment = checkPathContainment(candidate, canonicalRootDir);
    if (containment.kind === 'reject') return containment;
  }

  const path = diffFile.newPath !== '/dev/null' ? diffFile.newPath : diffFile.oldPath;
  if (!path || path === '/dev/null') return { kind: 'skip' };

  // Re-resolve the chosen path now that both sides are confirmed in-root.
  const containment = checkPathContainment(path, canonicalRootDir);
  if (containment.kind === 'reject') return containment;
  return containment;
}

/** Handle the `detect_changes` MCP tool call. */
export async function handleDetectChanges(args: DetectChangesArgs): Promise<MCPResponse> {
  const rootDir = args.rootDir ?? process.cwd();

  // SECURITY (parity with handlers/scan.ts): canonicalize via realpathSync
  // so a symlink inside the workspace can't escape the workspace root.
  const canonical = canonicalizeWorkspacePaths(rootDir);
  if (!canonical) {
    // Compute a placeholder readiness so the contract shape stays
    // consistent even on input failure.
    const readiness = buildReadinessBlock({
      freshness: 'error',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'rootDir invalid or contains a broken symlink',
    });
    return errorResponse(`rootDir invalid or contains a broken symlink: ${rootDir}`, readiness);
  }
  const { canonicalWorkspace, canonicalRootDir } = canonical;

  if (!isWithinWorkspace(canonicalWorkspace, canonicalRootDir)) {
    const readiness = buildReadinessBlock({
      freshness: 'error',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'rootDir escaped workspace root',
    });
    return errorResponse(`rootDir must stay within the workspace root: ${canonicalWorkspace}`, readiness);
  }

  // CRITICAL ORDER (R-002-4 / RISK-03): probe readiness BEFORE
  // any diff parsing or graph lookup. If the graph is not 'fresh',
  // we MUST return `status: 'blocked'` — never `affectedSymbols: []`
  // on stale/empty/error state.
  //
  // We pass `allowInlineIndex: false` so this read-only handler
  // never silently triggers a full reindex on the request path.
  // Operators choose when scans run via `code_graph_scan`.
  const readiness = await ensureCodeGraphReady(canonicalRootDir, {
    allowInlineIndex: false,
    allowInlineFullScan: false,
  });
  const readinessBlock = buildReadinessBlock(readiness);

  if (readinessRequiresBlock(readiness)) {
    const blockedFreshness = readiness.verificationGate === 'fail'
      ? 'fresh-with-failed-verification'
      : readiness.freshness;
    return blockedResponse(
      `graph readiness is "${blockedFreshness}" (action: ${readiness.action}); run code_graph_scan before detect_changes. Reason: ${readiness.reason}`,
      readinessBlock,
    );
  }

  // Validate diff input before any DB work.
  if (typeof args.diff !== 'string') {
    return buildResponse({
      status: 'parse_error',
      affectedSymbols: [],
      affectedFiles: [],
      blockedReason: '`diff` argument is required and must be a string',
      timestamp: ts(),
      readiness: readinessBlock,
    });
  }

  const parsed = parseUnifiedDiff(args.diff);
  if (parsed.status === 'parse_error') {
    return buildResponse({
      status: 'parse_error',
      affectedSymbols: [],
      affectedFiles: [],
      blockedReason: parsed.reason,
      timestamp: ts(),
      readiness: readinessBlock,
    });
  }

  const affectedSymbolsById = new Map<string, AffectedSymbol>();
  const affectedFiles = new Set<string>();

  for (const diffFile of parsed.files) {
    const candidate = resolveCandidatePath(diffFile, canonicalRootDir);
    if (candidate.kind === 'skip') continue;
    if (candidate.kind === 'reject') {
      // R-007-3: never silently drop a path that escaped the
      // workspace root. Surface a parse_error with the offending
      // path so callers can see exactly why the diff was refused.
      return buildResponse({
        status: 'parse_error',
        affectedSymbols: [],
        affectedFiles: [],
        blockedReason: candidate.reason,
        timestamp: ts(),
        readiness: readinessBlock,
      });
    }

    // Resolve the diff path through the same canonical-path lookup
    // that `code_files` rows use, falling back to the raw resolved
    // path. We never invent a row — if the file is unknown to the
    // graph, the file is reported as touched with zero symbols.
    const resolvedPath = graphDb.resolveSubjectFilePath(candidate.path) ?? candidate.path;
    affectedFiles.add(resolvedPath);

    if (diffFile.hunks.length === 0) continue;

    const fileNodes = graphDb.queryOutline(resolvedPath);
    if (fileNodes.length === 0) continue;

    for (const hunk of diffFile.hunks) {
      // Use the post-image range for attribution because that's
      // what callers will read in the working tree. The pre-image
      // range is also covered for pure-delete hunks (newLines=0).
      for (const node of fileNodes) {
        // Skip the synthetic 'module' node — every file has one
        // and any change would always overlap it, drowning the
        // signal in noise.
        if (node.kind === 'module') continue;
        const nodeLines = Math.max(1, node.endLine - node.startLine + 1);

        const overlapsPostImage = hunk.newLines > 0 && rangesOverlap(
          node.startLine, nodeLines,
          hunk.newStart, hunk.newLines,
        );
        const overlapsPreImage = hunk.oldLines > 0 && rangesOverlap(
          node.startLine, nodeLines,
          hunk.oldStart, hunk.oldLines,
        );

        if (!overlapsPostImage && !overlapsPreImage) continue;
        if (affectedSymbolsById.has(node.symbolId)) continue;

        affectedSymbolsById.set(node.symbolId, {
          symbolId: node.symbolId,
          fqName: node.fqName,
          name: node.name,
          kind: node.kind,
          filePath: node.filePath,
          startLine: node.startLine,
          endLine: node.endLine,
        });
      }
    }
  }

  const affectedSymbols = [...affectedSymbolsById.values()].sort((a, b) => {
    if (a.filePath !== b.filePath) return a.filePath.localeCompare(b.filePath);
    return a.startLine - b.startLine;
  });

  return buildResponse({
    status: 'ok',
    affectedSymbols,
    affectedFiles: [...affectedFiles].sort(),
    timestamp: ts(),
    readiness: readinessBlock,
  });
}
