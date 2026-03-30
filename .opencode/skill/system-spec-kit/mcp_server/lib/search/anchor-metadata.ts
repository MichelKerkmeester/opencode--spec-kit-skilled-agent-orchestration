// ───────────────────────────────────────────────────────────────
// MODULE: Anchor Metadata
// ───────────────────────────────────────────────────────────────
// Feature catalog: ANCHOR tags as graph nodes
// S2 template anchor optimization
//
// PURPOSE: Parse ANCHOR tags from memory content and attach the
// Resulting metadata to search pipeline rows. This is a PURE
// ANNOTATION step — no scores are modified.
//
// ANCHOR FORMAT:
// <!-- ANCHOR:id --> ... content ... <!-- /ANCHOR:id -->
//
// ANCHOR ID CONVENTION (for type extraction):
// Structured IDs follow the pattern: TYPE-keywords-NNN
// e.g.  DECISION-pipeline-003  → type = "DECISION"
// State                  → type = "state"
// Summary                → type = "summary"
//
// Integration point: called at the end of Stage 2 fusion, after
// All scoring signals have been applied (signals 1-7). Adding
// Anchor metadata here keeps Stage 3 (rerank) and Stage 4
// (filter/annotate) aware of anchor structure without any score
// Side-effects.
import type { PipelineRow } from './pipeline/types.js';

// Feature catalog: Template anchor optimization


// -- Public Interface --

/**
 * Metadata describing a single ANCHOR region found in a memory file.
 */
export interface AnchorMetadata {
  /** The raw anchor ID as written in the tag, e.g. "DECISION-pipeline-003". */
  id: string;
  /**
   * The semantic type extracted from the anchor ID.
   * For structured IDs (TYPE-keywords-NNN) this is the leading segment in
   * UPPERCASE, e.g. "DECISION". For simple IDs (e.g. "summary") the whole
   * ID is returned as-is.
   */
  type: string;
  /** 1-based line number of the opening <!-- ANCHOR:id --> tag. */
  startLine: number;
  /** 1-based line number of the closing <!-- /ANCHOR:id --> tag. */
  endLine: number;
}

// -- Regex constants --

/**
 * Matches an opening ANCHOR comment.
 * Group 1: anchor ID (trimmed, no whitespace inside the ID itself).
 * Allows optional whitespace around the colon and before `-->`.
 */
const ANCHOR_OPEN_RE = /<!--\s*ANCHOR:\s*(\S+)\s*-->/;

/**
 * Matches a closing ANCHOR comment.
 * Group 1: anchor ID.
 */
const ANCHOR_CLOSE_RE = /<!--\s*\/ANCHOR:\s*(\S+)\s*-->/;

// -- Internal helpers --

/**
 * Derive the semantic type from an anchor ID.
 *
 * Rules (in priority order):
 *   1. If the ID contains a hyphen and the first segment is all-uppercase
 *      ASCII letters → return that segment as the type (e.g. "DECISION").
 *   2. Otherwise → return the entire ID (e.g. "summary", "state").
 *
 * This keeps the heuristic simple and avoids false positives for
 * kebab-case IDs like "next-steps" that should map to type "next-steps".
 */
function extractType(id: string): string {
  const hyphenIdx = id.indexOf('-');
  if (hyphenIdx > 0) {
    const firstSegment = id.slice(0, hyphenIdx);
    if (/^[A-Z]+$/.test(firstSegment)) {
      return firstSegment;
    }
  }
  return id;
}

// -- Exported functions --

/**
 * Parse ANCHOR tags from memory content and return metadata for each found region.
 *
 * The function walks the content line-by-line. When an opening tag is found,
 * it is pushed onto an open-anchors stack. When a matching closing tag is
 * found, the pair is resolved and an AnchorMetadata record is emitted.
 *
 * Unmatched opening or closing tags are silently ignored — malformed content
 * must not crash the retrieval pipeline.
 *
 * @param content - Raw text content of a memory file (may be empty or null).
 * @returns Array of AnchorMetadata, one per complete anchor pair found.
 *          Returns an empty array when content is empty, null, or has no anchors.
 */
export function extractAnchorMetadata(content: string): AnchorMetadata[] {
  if (!content || typeof content !== 'string') return [];

  const lines = content.split('\n');
  const results: AnchorMetadata[] = [];

  /** Stack of { id, startLine } for currently-open anchors (supports nesting). */
  const openStack: Array<{ id: string; startLine: number }> = [];

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1; // 1-based
    const line = lines[i];

    // F-01 — Parse open tag BEFORE close tag so same-line anchors
    // (<!-- ANCHOR:x -->...<!-- /ANCHOR:x -->) are captured. The old logic
    // Checked close first, found no matching open on the stack, skipped it,
    // Then `continue` prevented the open-tag check from running.

    // Check for opening tag first (push to stack before close check)
    const openMatch = ANCHOR_OPEN_RE.exec(line);
    if (openMatch) {
      openStack.push({ id: openMatch[1], startLine: lineNumber });
    }

    // Then check for closing tag (now same-line open+close works because
    // The open tag was already pushed to the stack above)
    const closeMatch = ANCHOR_CLOSE_RE.exec(line);
    if (closeMatch) {
      const closeId = closeMatch[1];
      // Find the most recent matching open anchor (supports nested anchors)
      const stackIdx = [...openStack].reverse().findIndex((e) => e.id === closeId);
      if (stackIdx !== -1) {
        // Convert reversed index to forward index
        const forwardIdx = openStack.length - 1 - stackIdx;
        const { id, startLine } = openStack[forwardIdx];
        openStack.splice(forwardIdx, 1);
        results.push({
          id,
          type: extractType(id),
          startLine,
          endLine: lineNumber,
        });
      }
      // If no matching open was found, skip silently (malformed content)
    }
  }

  // Any remaining open anchors have no closing tag — ignore silently.
  return results;
}

/**
 * Annotate pipeline rows with anchor metadata extracted from their content.
 *
 * For each row that has a non-empty `content` field, the ANCHOR tags in that
 * content are parsed and the resulting metadata array is attached to the row
 * as `anchorMetadata`. Rows without content (or with no anchors) are returned
 * unchanged.
 *
 * This function does NOT mutate any score fields. It is safe to call after
 * all scoring signals have been applied.
 *
 * @param results - Pipeline rows to annotate (may be empty).
 * @returns New array — each row is either a new object (when anchors were
 *          found) or the original reference (when no anchors were found).
 */
export function enrichResultsWithAnchorMetadata(results: PipelineRow[]): PipelineRow[] {
  if (!Array.isArray(results)) return [];
  if (results.length === 0) return results;

  return results.map((row) => {
    const content = typeof row.content === 'string' ? row.content : '';
    if (!content) return row;

    const anchors = extractAnchorMetadata(content);
    if (anchors.length === 0) return row;

    return {
      ...row,
      anchorMetadata: anchors,
    };
  });
}
