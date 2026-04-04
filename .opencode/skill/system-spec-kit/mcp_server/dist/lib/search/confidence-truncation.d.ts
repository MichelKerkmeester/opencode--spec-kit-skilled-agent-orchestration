import { isConfidenceTruncationEnabled } from './search-flags.js';
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
declare const DEFAULT_MIN_RESULTS = 3;
/** Gap multiplier: gap must exceed this multiple of the median gap to trigger truncation.
 * 2x median is the elbow heuristic — a gap twice the typical spread signals a relevance cliff. */
declare const GAP_THRESHOLD_MULTIPLIER = 2;
/**
 * Compute consecutive score gaps for a sorted (descending) score array.
 * gap[i] = scores[i] - scores[i+1]   for i in [0, n-2]
 * NaN and Infinity scores are filtered out before gap computation.
 * Returns empty array when fewer than 2 finite scores.
 *
 * @param scores - Descending-sorted array of raw scores.
 * @returns Array of consecutive score gaps (length = scores.length - 1).
 */
declare function computeGaps(scores: number[]): number[];
/**
 * Compute the median of an array of numbers.
 * Returns 0 for an empty array.
 *
 * @param values - Array of numeric values.
 * @returns Median value, or 0 for empty input.
 */
declare function computeMedian(values: number[]): number;
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
declare function truncateByConfidence(results: ScoredResult[], options?: TruncationOptions): TruncationResult;
export { type ScoredResult, type TruncationResult, type TruncationOptions, DEFAULT_MIN_RESULTS, GAP_THRESHOLD_MULTIPLIER, truncateByConfidence, isConfidenceTruncationEnabled, computeGaps, computeMedian, };
//# sourceMappingURL=confidence-truncation.d.ts.map