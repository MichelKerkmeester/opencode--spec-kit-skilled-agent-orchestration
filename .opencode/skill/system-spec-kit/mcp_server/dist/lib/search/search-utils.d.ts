import type { RoutingResult } from './artifact-routing.js';
/**
 * Minimal row shape for search utility functions.
 * Mirrors the subset of MemorySearchRow fields that these helpers access.
 */
interface SearchUtilRow extends Record<string, unknown> {
    id: number;
    contextType?: string;
    context_type?: string;
    quality_score?: number;
}
interface CacheArgsInput {
    normalizedQuery: string | null;
    hasValidConcepts: boolean;
    concepts?: string[];
    specFolder?: string;
    tenantId?: string;
    userId?: string;
    agentId?: string;
    sharedSpaceId?: string;
    limit: number;
    mode?: string;
    tier?: string;
    contextType?: string;
    useDecay: boolean;
    includeArchived: boolean;
    qualityThreshold?: number;
    applyStateLimits: boolean | undefined;
    includeContiguity: boolean;
    includeConstitutional: boolean;
    includeContent: boolean;
    anchors?: string[] | string;
    detectedIntent: string | null;
    minState: string;
    rerank: boolean;
    applyLengthPenalty: boolean;
    sessionId?: string;
    enableSessionBoost: boolean;
    enableCausalBoost: boolean;
    includeTrace?: boolean;
}
/**
 * Resolve the context type from a row, preferring camelCase over snake_case.
 */
declare function resolveRowContextType(row: SearchUtilRow): string | undefined;
/**
 * Filter results by minimum quality score.
 * Returns all results if no valid threshold is provided.
 */
declare function filterByMinQualityScore(results: SearchUtilRow[], minQualityScore?: number): SearchUtilRow[];
/**
 * Resolve the quality threshold from camelCase or snake_case parameter.
 */
declare function resolveQualityThreshold(minQualityScore?: number, minQualityScoreSnake?: number): number | undefined;
/**
 * Build a cache key arguments object from search parameters.
 */
declare function buildCacheArgs({ normalizedQuery, hasValidConcepts, concepts, specFolder, tenantId, userId, agentId, sharedSpaceId, limit, mode, tier, contextType, useDecay, includeArchived, qualityThreshold, applyStateLimits, includeContiguity, includeConstitutional, includeContent, anchors, detectedIntent, minState, rerank, applyLengthPenalty, sessionId, enableSessionBoost, enableCausalBoost, includeTrace, }: CacheArgsInput): Record<string, unknown>;
/**
 * Resolve the best available query string for artifact routing.
 * Falls back to joining concepts if no query string is provided.
 */
declare function resolveArtifactRoutingQuery(query: string | null, concepts?: string[]): string;
/**
 * Apply artifact routing weights to search results.
 * No-op if routing result is absent, unknown, or zero-confidence.
 */
declare function applyArtifactRouting(results: SearchUtilRow[], routingResult?: RoutingResult): SearchUtilRow[];
export { resolveRowContextType, filterByMinQualityScore, resolveQualityThreshold, buildCacheArgs, resolveArtifactRoutingQuery, applyArtifactRouting, };
export type { SearchUtilRow, CacheArgsInput, };
//# sourceMappingURL=search-utils.d.ts.map