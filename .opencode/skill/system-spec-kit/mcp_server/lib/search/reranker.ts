// ───────────────────────────────────────────────────────────────
// MODULE: Reranker
// ───────────────────────────────────────────────────────────────
// Feature catalog: Stage 3 effectiveScore fallback chain
// Simple score-based reranking utility. Sorts results by score
// Descending and optionally truncates to a limit.
//
// For neural/ML-based reranking see cross-encoder.ts.

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
----------------------------------------------------------------*/

export interface RerankResult {
  id: string | number;
  score: number;
  [key: string]: unknown;
}

export interface RerankOptions {
  limit?: number;
}

/* ───────────────────────────────────────────────────────────────
   2. CORE FUNCTION
----------------------------------------------------------------*/

/**
 * Rerank results by score (descending). Preserves all fields on
 * each result object. Returns a new array — does not mutate input.
 *
 * @param results - Array of scored result objects
 * @param options - Optional config (limit: max results to return)
 * @returns Sorted (and optionally truncated) results
 */
export function rerankResults(
  results: Array<RerankResult>,
  options?: RerankOptions,
): Array<RerankResult> {
  if (!results || results.length === 0) {
    return [];
  }

  // Sort by score descending (stable sort preserves insertion order for ties)
  const sorted = [...results].sort((a, b) => b.score - a.score);

  // Apply limit if provided
  if (options?.limit !== undefined && options.limit >= 0) {
    return sorted.slice(0, options.limit);
  }

  return sorted;
}
