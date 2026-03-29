// ───────────────────────────────────────────────────────────────
// MODULE: Confidence Truncation
// ───────────────────────────────────────────────────────────────
// Feature catalog: Confidence-based result truncation
import { isConfidenceTruncationEnabled } from './search-flags.js';

/* --- 1. TYPES & CONSTANTS --- */

/** Generic scored result for truncation — supports both numeric and string IDs. */
interface ScoredResult {
  id: number | string;
  score: number;
  [key: string]: unknown;
}

/** Result of a truncation operation with full audit metadata. */
interface TruncationResult {
  results: ScoredResult[];
  truncated: boolean;
  originalCount: number;
  truncatedCount: number;
  /** Inclusive index of the last kept result (0-based). */
  cutoffIndex: number;
  medianGap: number;
  cutoffGap: number;
}

/** Options for truncation behaviour. */
interface TruncationOptions {
  /** Minimum number of results to always return, regardless of gap. Default: 3. */
  minResults?: number;
}

/** Default minimum result count. */
const DEFAULT_MIN_RESULTS = 3;

/** Gap multiplier: gap must exceed this multiple of the median gap to trigger truncation.
 * 2x median is the elbow heuristic — a gap twice the typical spread signals a relevance cliff. */
const GAP_THRESHOLD_MULTIPLIER = 2;

/* --- 2. GAP ANALYSIS HELPERS --- */

/**
 * Compute consecutive score gaps for a sorted (descending) score array.
 * gap[i] = scores[i] - scores[i+1]   for i in [0, n-2]
 * NaN and Infinity scores are filtered out before gap computation.
 * Returns empty array when fewer than 2 finite scores.
 *
 * @param scores - Descending-sorted array of raw scores.
 * @returns Array of consecutive score gaps (length = scores.length - 1).
 */
function computeGaps(scores: number[]): number[] {
  // NaN/Infinity from upstream bugs would corrupt gap statistics — filter them first
  const finite = scores.filter(s => Number.isFinite(s));
  if (finite.length < 2) return [];
  const gaps: number[] = [];
  for (let i = 0; i < finite.length - 1; i++) {
    gaps.push(finite[i] - finite[i + 1]);
  }
  return gaps;
}

/**
 * Compute the median of an array of numbers.
 * Returns 0 for an empty array.
 *
 * @param values - Array of numeric values.
 * @returns Median value, or 0 for empty input.
 */
function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/* --- 3. CORE TRUNCATION LOGIC --- */

/**
 * Truncate results based on confidence gap analysis.
 *
 * Algorithm:
 * 1. If fewer than minResults results, return unchanged.
 * 2. Compute consecutive score gaps.
 * 3. Compute median gap.
 * 4. Find first index >= (minResults - 1) where gap > 2 * medianGap.
 * 5. Truncate at that index + 1 (keep results 0..cutoffIndex inclusive).
 * 6. If no threshold-exceeding gap found, return all results unchanged.
 *
 * When SPECKIT_CONFIDENCE_TRUNCATION is disabled, passes results through unchanged.
 *
 * Results are expected to be pre-sorted by score descending. This function
 * does NOT sort; it operates on the input order.
 *
 * @param results - Array of scored results (expected descending by score).
 * @param options - Optional truncation options (minResults).
 * @returns TruncationResult with the (possibly shortened) result array and audit metadata.
 */
function truncateByConfidence(
  results: ScoredResult[],
  options?: TruncationOptions,
): TruncationResult {
  const minResults = options?.minResults ?? DEFAULT_MIN_RESULTS;

  // Defensive: filter out results with NaN/Infinity scores
  const validResults = results.filter(r => Number.isFinite(r.score));

  // Defensive: sort descending by score. Callers should pre-sort for efficiency.
  validResults.sort((a, b) => b.score - a.score);

  const originalCount = validResults.length;

  // Feature flag gate: pass through when disabled
  if (!isConfidenceTruncationEnabled()) {
    return {
      results: [...validResults],
      truncated: false,
      originalCount,
      truncatedCount: originalCount,
      cutoffIndex: originalCount - 1,
      medianGap: 0,
      cutoffGap: 0,
    };
  }

  // Not enough results to truncate
  if (validResults.length <= minResults) {
    return {
      results: [...validResults],
      truncated: false,
      originalCount,
      truncatedCount: originalCount,
      cutoffIndex: originalCount - 1,
      medianGap: 0,
      cutoffGap: 0,
    };
  }

  const scores = validResults.map(r => r.score);
  const gaps = computeGaps(scores);
  const medianGap = computeMedian(gaps);
  const threshold = GAP_THRESHOLD_MULTIPLIER * medianGap;

  // When medianGap is 0 (all same scores), no meaningful gap exists — return all
  if (medianGap === 0) {
    return {
      results: [...validResults],
      truncated: false,
      originalCount,
      truncatedCount: originalCount,
      cutoffIndex: originalCount - 1,
      medianGap: 0,
      cutoffGap: 0,
    };
  }

  // Search for the first gap that exceeds the threshold, starting from minResults - 1.
  // Gap[i] is the gap between result i and result i+1.
  // If gap[i] > threshold, we keep results 0..i (cutoffIndex = i).
  let cutoffIndex = -1;
  let cutoffGap = 0;

  for (let i = minResults - 1; i < gaps.length; i++) {
    if (gaps[i] > threshold) {
      cutoffIndex = i;
      cutoffGap = gaps[i];
      break;
    }
  }

  // No significant gap found — return all results
  if (cutoffIndex === -1) {
    return {
      results: [...validResults],
      truncated: false,
      originalCount,
      truncatedCount: originalCount,
      cutoffIndex: originalCount - 1,
      medianGap,
      cutoffGap: 0,
    };
  }

  // Truncate: keep validResults[0..cutoffIndex] inclusive
  const truncatedResults = validResults.slice(0, cutoffIndex + 1);

  return {
    results: truncatedResults,
    truncated: true,
    originalCount,
    truncatedCount: truncatedResults.length,
    cutoffIndex,
    medianGap,
    cutoffGap,
  };
}

/* --- 5. EXPORTS --- */

export {
  // Types
  type ScoredResult,
  type TruncationResult,
  type TruncationOptions,

  // Constants
  DEFAULT_MIN_RESULTS,
  GAP_THRESHOLD_MULTIPLIER,

  // Functions
  truncateByConfidence,
  isConfidenceTruncationEnabled,

  // Internal helpers (exported for testing)
  computeGaps,
  computeMedian,
};
