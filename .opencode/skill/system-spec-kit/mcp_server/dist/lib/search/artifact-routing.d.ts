type ArtifactClass = 'spec' | 'plan' | 'tasks' | 'checklist' | 'decision-record' | 'implementation-summary' | 'memory' | 'research' | 'unknown';
interface RetrievalStrategy {
    artifactClass: ArtifactClass;
    /** Weight for semantic (vector) search component, 0-1 */
    semanticWeight: number;
    /** Weight for keyword (BM25) search component, 0-1 */
    keywordWeight: number;
    /** Recency bias factor, 0-1 (higher = prefer newer) */
    recencyBias: number;
    /** Maximum results to return */
    maxResults: number;
    /** Boost factor applied to final scores, 0-2 */
    boostFactor: number;
}
interface RoutingResult {
    strategy: RetrievalStrategy;
    detectedClass: ArtifactClass;
    confidence: number;
}
interface WeightedResult extends Record<string, unknown> {
    id: number;
    score?: number;
    similarity?: number;
    artifactBoostApplied?: number;
}
declare const ROUTING_TABLE: Record<ArtifactClass, RetrievalStrategy>;
/**
 * Ordered classification patterns. First match wins.
 * More specific patterns precede generic ones.
 */
declare const FILE_PATH_PATTERNS: Array<{
    pattern: RegExp;
    artifactClass: ArtifactClass;
}>;
/**
 * Query keyword/pattern mapping for artifact class detection from
 * natural language queries. Scored by match count.
 */
declare const QUERY_PATTERNS: Array<{
    keywords: string[];
    patterns: RegExp[];
    artifactClass: ArtifactClass;
}>;
/**
 * Intent-based fallback mapping for artifact class detection.
 * Used when keyword/pattern scoring yields zero matches but an
 * intent classifier result is available. Confidence: 0.4.
 */
declare const INTENT_TO_ARTIFACT: Record<string, ArtifactClass>;
/**
 * Classify artifact class from a file path.
 * Uses ordered pattern matching; first match wins.
 * Returns 'unknown' if no pattern matches.
 */
declare function classifyArtifact(filePath: string): ArtifactClass;
/**
 * Get retrieval strategy for an artifact class.
 * Always returns a valid strategy (falls back to 'unknown').
 */
declare function getStrategy(artifactClass: ArtifactClass): RetrievalStrategy;
/**
 * Detect artifact class from a natural language query and optional specFolder.
 * Returns a RoutingResult with the detected class, strategy, and confidence.
 */
declare function getStrategyForQuery(query: string, specFolder?: string, intent?: string): RoutingResult;
/**
 * Apply routing-based weight adjustments to search results.
 * Modifies scores based on the artifact class strategy:
 * - Applies boostFactor to final scores
 * - Deterministic: same inputs always produce same outputs
 */
declare function applyRoutingWeights(results: WeightedResult[], strategy: RetrievalStrategy): WeightedResult[];
export { ROUTING_TABLE, FILE_PATH_PATTERNS, QUERY_PATTERNS, INTENT_TO_ARTIFACT, classifyArtifact, getStrategy, getStrategyForQuery, applyRoutingWeights, };
export type { ArtifactClass, RetrievalStrategy, RoutingResult, WeightedResult, };
//# sourceMappingURL=artifact-routing.d.ts.map