// ───────────────────────────────────────────────────────────────
// MODULE: Unified Diff Parser
// ───────────────────────────────────────────────────────────────
// Minimal parser for the standard unified-diff format consumed by
// the `detect_changes` preflight handler. Handles `diff --git`
// sections, `--- a/<path>` / `+++ b/<path>` headers, and
// `@@ -oldStart,oldLines +newStart,newLines @@` hunks.
//
// **Library choice (P1-03 blocker resolution):** *no third-party
// library*. A custom parser was chosen because:
//
//   - Adding a new npm dependency for a 100-line parser violates
//     the project's "trust internal code" + minimal-dep posture.
//     The mcp_server `package.json` deliberately keeps its
//     `dependencies` list short (12 entries; see ADR-016 family).
//   - The unified-diff format is a published, stable POSIX
//     specification. A purpose-built parser handles only the
//     subset `git diff` emits, which keeps the surface tiny and
//     test-coverable.
//   - `detect_changes` is read-only and bounded — it never
//     mutates files based on diff content, so we don't need
//     library-grade patch-application semantics. Hunk metadata
//     is enough.
//   - Clean-room rule (ADR-012-001): a custom parser cannot drag
//     in upstream `diff` package source forms.
//
// Format reference: `man diff` § "Unified format". This parser
// returns `parse_error` on inputs it cannot map to that format
// (R-002-6).

/** A single change hunk: contiguous added/removed/context lines. */
export interface DiffHunk {
  /** Pre-image line where the hunk begins (1-based). */
  readonly oldStart: number;
  /** Number of pre-image lines covered by the hunk (0 for pure-add). */
  readonly oldLines: number;
  /** Post-image line where the hunk begins (1-based). */
  readonly newStart: number;
  /** Number of post-image lines covered by the hunk (0 for pure-delete). */
  readonly newLines: number;
}

/** All hunks for one file, after stripping `a/`/`b/` prefixes. */
export interface DiffFile {
  /** Pre-image path (`/dev/null` for additions). */
  readonly oldPath: string;
  /** Post-image path (`/dev/null` for deletions). */
  readonly newPath: string;
  readonly hunks: DiffHunk[];
}

/** `parse_error` is surfaced via DiffParseResult's discriminant. */
export type DiffParseResult =
  | { readonly status: 'ok'; readonly files: DiffFile[] }
  | { readonly status: 'parse_error'; readonly reason: string };

/** Strip the conventional `a/` or `b/` git prefix from a header path. */
function stripGitPrefix(headerPath: string): string {
  if (headerPath === '/dev/null') return headerPath;
  if (headerPath.startsWith('a/') || headerPath.startsWith('b/')) {
    return headerPath.slice(2);
  }
  return headerPath;
}

/**
 * Parse the `@@ -oldStart[,oldLines] +newStart[,newLines] @@` hunk
 * range header. Returns `null` if the line does not match the
 * expected shape — callers translate this into `parse_error`.
 *
 * Per POSIX unified-diff, the count after the comma is optional
 * and defaults to `1` when absent (single-line hunk).
 */
function parseHunkHeader(line: string): DiffHunk | null {
  const match = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
  if (!match) return null;

  const oldStart = Number.parseInt(match[1], 10);
  const oldLines = match[2] === undefined ? 1 : Number.parseInt(match[2], 10);
  const newStart = Number.parseInt(match[3], 10);
  const newLines = match[4] === undefined ? 1 : Number.parseInt(match[4], 10);

  if ([oldStart, oldLines, newStart, newLines].some((n) => !Number.isFinite(n) || n < 0)) {
    return null;
  }

  return { oldStart, oldLines, newStart, newLines };
}

/**
 * Parse a unified-diff document. Recognized headers:
 *   - `diff --git a/<path> b/<path>` (optional, ignored beyond serving as a section break)
 *   - `--- a/<path>` / `--- /dev/null`
 *   - `+++ b/<path>` / `+++ /dev/null`
 *   - `@@ -oldStart,oldLines +newStart,newLines @@`
 *
 * The body lines (` `, `+`, `-`) inside hunks are not retained —
 * `detect_changes` only needs hunk *ranges*, and discarding line
 * bodies keeps memory bounded for large diffs.
 *
 * Edge cases:
 *   - Empty input → `{ status: 'ok', files: [] }` (no diff = no changes).
 *   - Hunk before any file header → `parse_error`.
 *   - Malformed `@@` header → `parse_error`.
 *   - Files with no hunks (pure rename / mode-only changes) → kept
 *     in `files` with `hunks: []` so callers can still attribute
 *     touched files; they simply produce zero affected symbols.
 */
export function parseUnifiedDiff(diff: string): DiffParseResult {
  if (typeof diff !== 'string') {
    return { status: 'parse_error', reason: 'diff input is not a string' };
  }
  if (diff.length === 0) {
    return { status: 'ok', files: [] };
  }

  const lines = diff.split(/\r?\n/);
  const files: DiffFile[] = [];
  let currentOldPath: string | null = null;
  let currentNewPath: string | null = null;
  let currentHunks: DiffHunk[] = [];
  let inHunkBody = false;

  const finalizeCurrentFile = (): void => {
    if (currentOldPath !== null && currentNewPath !== null) {
      files.push({
        oldPath: currentOldPath,
        newPath: currentNewPath,
        hunks: currentHunks,
      });
    }
    currentOldPath = null;
    currentNewPath = null;
    currentHunks = [];
    inHunkBody = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Section break: `diff --git a/<old> b/<new>`. We don't trust
    // the paths embedded here — `---`/`+++` are the canonical
    // source — but we use it to flush any prior pending file.
    if (line.startsWith('diff --git ')) {
      finalizeCurrentFile();
      inHunkBody = false;
      continue;
    }

    if (line.startsWith('--- ')) {
      // A new `---` always starts a new file section. If we were
      // mid-file from a previous block, flush it first so we never
      // mix headers across files.
      if (currentOldPath !== null || currentNewPath !== null) {
        finalizeCurrentFile();
      }
      currentOldPath = stripGitPrefix(line.slice(4).trim());
      inHunkBody = false;
      continue;
    }

    if (line.startsWith('+++ ')) {
      if (currentOldPath === null) {
        return { status: 'parse_error', reason: `'+++ ' header before '--- ' header at line ${i + 1}` };
      }
      currentNewPath = stripGitPrefix(line.slice(4).trim());
      inHunkBody = false;
      continue;
    }

    if (line.startsWith('@@ ')) {
      if (currentOldPath === null || currentNewPath === null) {
        return { status: 'parse_error', reason: `hunk header before file headers at line ${i + 1}` };
      }
      const hunk = parseHunkHeader(line);
      if (!hunk) {
        return { status: 'parse_error', reason: `malformed hunk header at line ${i + 1}: ${line}` };
      }
      currentHunks.push(hunk);
      inHunkBody = true;
      continue;
    }

    if (inHunkBody) {
      // Hunk body lines are ' ', '+', '-', '\\' (no-newline marker)
      // or empty (trailing blank). We don't retain them — only
      // ranges matter for symbol mapping.
      if (line.length === 0) continue;
      const ch = line[0];
      if (ch === ' ' || ch === '+' || ch === '-' || ch === '\\') continue;
      // Anything else inside the hunk body terminates it; the
      // line might be `diff --git`, `index`, etc. for the next
      // file. Re-process the line in the outer loop.
      inHunkBody = false;
      i--;
      continue;
    }

    // Lines outside hunk bodies that we don't recognize are
    // tolerated — `index ...`, `new file mode ...`,
    // `Binary files differ`, etc. Skipping them keeps the parser
    // tolerant of git's varied preamble lines without dropping
    // structural correctness.
  }

  finalizeCurrentFile();

  return { status: 'ok', files };
}

/**
 * Compute whether two 1-based half-open line ranges overlap.
 * `aStart`..`aStart+aLines-1` overlaps `bStart`..`bStart+bLines-1`.
 *
 * Pure-add hunks (oldLines=0) and pure-delete hunks (newLines=0)
 * are handled by the caller — both sides are checked against the
 * same node range so an addition between two nodes can still be
 * attributed to whichever node covers `oldStart`.
 */
export function rangesOverlap(
  aStart: number,
  aLines: number,
  bStart: number,
  bLines: number,
): boolean {
  if (aLines <= 0 || bLines <= 0) {
    // Zero-length on one side: treat as a single-line marker at
    // `aStart` (or `bStart`) and check point-in-range.
    const aPoint = aStart;
    const bPoint = bStart;
    if (aLines <= 0 && bLines <= 0) return aPoint === bPoint;
    if (aLines <= 0) {
      return aPoint >= bStart && aPoint <= bStart + bLines - 1;
    }
    return bPoint >= aStart && bPoint <= aStart + aLines - 1;
  }

  const aEnd = aStart + aLines - 1;
  const bEnd = bStart + bLines - 1;
  return aStart <= bEnd && bStart <= aEnd;
}
