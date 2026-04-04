import type Database from 'better-sqlite3';
/**
 * Default co-activation boost strength when SPECKIT_COACTIVATION_STRENGTH is not set.
 *
 * Intentional deviation from the original spec (which listed 0.2): empirical tuning raised
 * this to 0.25 for better discovery recall. The R17 fan-effect divisor (sqrt scaling)
 * keeps hub-node inflation in check, so a higher raw factor remains safe. Tests are
 * written against 0.25 and serve as the authoritative contract going forward.
 */
declare const DEFAULT_COACTIVATION_STRENGTH = 0.25;
declare function resolveCoActivationBoostFactor(): number;
declare const CO_ACTIVATION_CONFIG: Readonly<{
    readonly enabled: boolean;
    readonly boostFactor: number;
    maxRelated: 5;
    minSimilarity: 70;
    decayPerHop: 0.5;
    maxHops: 2;
    maxSpreadResults: 20;
}>;
interface RelatedMemory {
    id: number;
    similarity: number;
    title?: string;
    spec_folder?: string;
    [key: string]: unknown;
}
interface SpreadResult {
    id: number;
    activationScore: number;
    hop: number;
    path: number[];
}
/** Clear the getRelatedMemories cache (called on init to avoid stale data across DB reloads). */
declare function clearRelatedCache(): void;
declare function init(database: Database.Database): void;
declare function isEnabled(): boolean;
/**
 * Boost a search result's score based on co-activation with related memories.
 */
declare function boostScore(baseScore: number, relatedCount: number, avgSimilarity: number): number;
/**
 * Get related memories for a given memory ID from stored relations.
 *
 * Results are cached by memoryId for up to 30 seconds (RELATED_CACHE_TTL_MS) and
 * the cache is capped at 100 entries to bound memory usage. This avoids the O(N*E)
 * repeated DB round-trips when spreadActivation() traverses multiple hops.
 */
declare function getRelatedMemories(memoryId: number, limit?: number): RelatedMemory[];
declare function getRelatedMemoryCounts(memoryIds: number[], limit?: number): Map<number, number>;
/**
 * Populate related memories field for a given memory.
 */
declare function populateRelatedMemories(memoryId: number, vectorSearchFn: (embedding: Float32Array, options: Record<string, unknown>) => Array<{
    id: number;
    similarity: number;
    [key: string]: unknown;
}>): Promise<number>;
/**
 * Get causally related memories for a given memory ID from the causal_edges table.
 * This surfaces memories connected by causal relationships (caused, enabled, supports, etc.)
 * which may be semantically dissimilar but contextually important.
 */
declare function getCausalNeighbors(memoryId: number, limit?: number): RelatedMemory[];
/**
 * Spreading activation: traverse both pre-computed similarity graph
 * and causal_edges graph from seed memories. Merging both sources
 * surfaces causally related but semantically dissimilar memories
 * that pure vector similarity would miss.
 */
declare function spreadActivation(seedIds: number[], maxHops?: number, limit?: number): SpreadResult[];
export { CO_ACTIVATION_CONFIG, DEFAULT_COACTIVATION_STRENGTH, init, isEnabled, resolveCoActivationBoostFactor, boostScore, getRelatedMemories, getRelatedMemoryCounts, getCausalNeighbors, populateRelatedMemories, spreadActivation, clearRelatedCache, };
export type { RelatedMemory, SpreadResult, };
//# sourceMappingURL=co-activation.d.ts.map