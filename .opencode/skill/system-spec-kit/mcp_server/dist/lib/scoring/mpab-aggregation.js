// ───────────────────────────────────────────────────────────────
// MODULE: Mpab Aggregation
// ───────────────────────────────────────────────────────────────
// Feature catalog: MPAB chunk-to-memory aggregation
// Multi-Parent Aggregated Bonus (MPAB) for chunk-to-memory score aggregation.
// Pipeline position: after RRF fusion, before state filtering.
// Feature flag: SPECKIT_DOCSCORE_AGGREGATION (graduated default ON)
// Runtime pipeline gating uses isDocscoreAggregationEnabled() in search-flags.ts.
/* --- 2. CONFIGURATION --- */
/**
 * Bonus coefficient for MPAB aggregation.
 * Provisional value; may be tuned based on retrieval evaluation results.
 */
export const MPAB_BONUS_COEFFICIENT = 0.3;
/* --- 3. FEATURE FLAG --- */
/**
 * Check if MPAB chunk-to-memory aggregation is enabled.
 * Local helper behavior: disabled only when SPECKIT_DOCSCORE_AGGREGATION is
 * explicitly set to "false". Runtime pipeline gating uses search-flags
 * isDocscoreAggregationEnabled() (which also treats "0" as disabled).
 *
 * @returns True if MPAB aggregation is enabled for this local helper
 */
export function isMpabEnabled() {
    return process.env.SPECKIT_DOCSCORE_AGGREGATION?.toLowerCase() !== 'false';
}
/* --- 4. CORE ALGORITHM --- */
/**
 * Compute the Multi-Parent Aggregated Bonus (MPAB) score from an array
 * of per-chunk retrieval scores.
 *
 * Algorithm:
 * 1. Sort scores descending
 * 2. sMax = sorted[0] (highest score)
 * 3. remaining = sorted.slice(1)
 * 4. bonus = 0.3 * sum(remaining) / sqrt(N)  where N = scores.length
 * 5. return sMax + bonus
 *
 * Guards:
 * - N=0: return 0 (no chunks = no signal)
 * - N=1: return scores[0] as-is (single chunk = raw score, no bonus)
 *
 * Uses index-based max removal (not value-based) to handle tied scores
 * correctly: sorting descending and taking index 0 always removes exactly
 * one element, even when multiple elements share the maximum value.
 *
 * @param scores - Array of per-chunk retrieval scores
 * @returns MPAB aggregated score (may exceed 1.0 for multi-chunk documents)
 */
export function computeMPAB(scores) {
    const safeScores = scores.map(score => Number.isFinite(score) ? score : 0);
    const N = safeScores.length;
    // Guard: no chunks = no signal
    if (N === 0)
        return 0;
    // Guard: single chunk = raw score, no bonus
    if (N === 1)
        return safeScores[0];
    // Sort descending (copy to avoid mutating input)
    const sorted = [...safeScores].sort((a, b) => b - a);
    // Index-based max removal: sorted[0] is always the max
    const sMax = sorted[0];
    const remaining = sorted.slice(1);
    // Bonus = coefficient * sum(remaining) / sqrt(N) rewards documents
    // With multiple relevant chunks while dampening the contribution of each
    // Additional chunk via sqrt(N) to prevent score inflation.
    const sumRemaining = remaining.reduce((acc, s) => acc + s, 0);
    const bonus = MPAB_BONUS_COEFFICIENT * sumRemaining / Math.sqrt(N);
    const aggregated = sMax + bonus;
    return Number.isFinite(aggregated) ? aggregated : 0;
}
/* --- 5. CHUNK COLLAPSE & REASSEMBLY --- */
/**
 * Collapse chunk-level retrieval results into parent-memory-level results
 * using MPAB aggregation, then reassemble chunks in original document
 * position order.
 *
 * When MPAB is disabled via feature flag, returns an empty array (passthrough
 * to the existing non-aggregated pipeline).
 *
 * Steps:
 * 1. Group chunks by parentMemoryId
 * 2. For each group, compute MPAB score from chunk scores
 * 3. Sort groups by MPAB score (descending)
 * 4. Within each group, sort chunks by chunkIndex (ascending) to restore
 *    original document position order
 *
 * @param chunkResults - Array of chunk-level retrieval results
 * @returns Collapsed results sorted by MPAB score, chunks in document order
 */
export function collapseAndReassembleChunkResults(chunkResults) {
    if (chunkResults.length === 0)
        return [];
    // Step 1: Group chunks by parent memory ID
    const groups = new Map();
    for (const chunk of chunkResults) {
        const key = chunk.parentMemoryId;
        const group = groups.get(key);
        if (group) {
            group.push(chunk);
        }
        else {
            groups.set(key, [chunk]);
        }
    }
    // Step 2: Compute MPAB for each group
    const collapsed = [];
    for (const [parentMemoryId, chunks] of groups) {
        const scores = chunks.map(c => c.score);
        const mpabScore = computeMPAB(scores);
        // Step 4: Sort chunks by chunkIndex (document position order)
        const sortedChunks = [...chunks].sort((a, b) => a.chunkIndex - b.chunkIndex);
        collapsed.push({
            parentMemoryId,
            mpabScore,
            _chunkHits: scores.length,
            chunks: sortedChunks,
        });
    }
    // Step 3: Sort groups by MPAB score (descending)
    collapsed.sort((a, b) => b.mpabScore - a.mpabScore);
    return collapsed;
}
//# sourceMappingURL=mpab-aggregation.js.map