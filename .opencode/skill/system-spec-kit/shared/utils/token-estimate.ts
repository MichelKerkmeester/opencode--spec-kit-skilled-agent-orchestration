// ---------------------------------------------------------------
// MODULE: Token Estimate
// ---------------------------------------------------------------

/**
 * Estimate token count using chars/4 approximation.
 * Canonical shared implementation — replaces duplicates in tree-thinning.ts and token-metrics.ts.
 */
export function estimateTokenCount(text: string | null | undefined): number {
  if (!text || typeof text !== 'string' || text.length === 0) {
    return 0;
  }
  return Math.ceil(text.length / 4);
}
