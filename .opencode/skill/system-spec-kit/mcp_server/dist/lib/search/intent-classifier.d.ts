type IntentType = 'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand' | 'find_spec' | 'find_decision';
interface RankedIntent {
    intent: IntentType;
    confidence: number;
    score: number;
}
interface IntentResult {
    intent: IntentType;
    confidence: number;
    scores: Record<IntentType, number>;
    keywords: string[];
    rankedIntents: RankedIntent[];
}
interface IntentWeights {
    recency: number;
    importance: number;
    similarity: number;
    contextType: string | null;
}
type IntentCentroids = Record<IntentType, Float32Array>;
declare const INTENT_TYPES: Record<string, IntentType>;
declare const INTENT_KEYWORDS: Record<IntentType, string[]>;
declare const INTENT_PATTERNS: Record<IntentType, RegExp[]>;
declare const INTENT_WEIGHT_ADJUSTMENTS: Record<IntentType, IntentWeights>;
declare const INTENT_CENTROIDS: IntentCentroids;
/**
 * Score a query against an intent's keyword list, returning normalized score and matched keywords.
 *
 * @param query - Raw user query string
 * @param intent - Intent type to score against
 * @returns Object with normalized score and array of matched keywords
 */
declare function calculateKeywordScore(query: string, intent: IntentType): {
    score: number;
    matches: string[];
};
/**
 * Score a query against an intent's regex patterns, returning fraction of patterns matched.
 *
 * @param query - Raw user query string
 * @param intent - Intent type to score against
 * @returns Fraction of patterns matched (0-1)
 */
declare function calculatePatternScore(query: string, intent: IntentType): number;
/**
 * Compute a deterministic normalized embedding for text.
 *
 * @param text - Input text to embed
 * @returns Normalized Float32Array embedding vector
 */
declare function toDeterministicEmbedding(text: string): Float32Array;
/**
 * Dot product similarity for normalized vectors.
 *
 * @param a - First vector
 * @param b - Second vector
 * @returns Dot product (cosine similarity for unit vectors)
 */
declare function dotProduct(a: Float32Array | number[], b: Float32Array | number[]): number;
/**
 * Score query-to-intent using centroid embeddings.
 *
 * @param query - Raw user query string
 * @param intent - Intent type to score against
 * @returns Cosine similarity score (0-1)
 */
declare function calculateCentroidScore(query: string, intent: IntentType): number;
/**
 * Classify a query string into one of 7 intent types with confidence and keyword evidence.
 *
 * @param query - Raw user query string
 * @returns Intent result with type, confidence, per-intent scores, and matched keywords
 */
declare function classifyIntent(query: string): IntentResult;
/**
 * Detect intent (alias for classifyIntent).
 *
 * @param query - Raw user query string
 * @returns Intent result with type, confidence, scores, and keywords
 */
declare function detectIntent(query: string): IntentResult;
/**
 * Get weight adjustments for an intent.
 *
 * @param intent - Intent type to get weights for
 * @returns Weight adjustments for recency, importance, similarity, and context type
 */
declare function getIntentWeights(intent: IntentType): IntentWeights;
/**
 * Apply intent-based weight adjustments to search results.
 *
 * @param results - Array of search result records
 * @param intent - Classified intent type to apply
 * @returns Results sorted by intent-adjusted score
 */
declare function applyIntentWeights(results: Array<Record<string, unknown>>, intent: IntentType): Array<Record<string, unknown>>;
/**
 * Get search query weights based on detected intent.
 *
 * @param query - Raw user query string
 * @returns Weight adjustments derived from auto-detected intent
 */
declare function getQueryWeights(query: string): IntentWeights;
/**
 * Check if an intent type is valid.
 *
 * @param intent - String to validate as an IntentType
 * @returns True if the string is a valid IntentType
 */
declare function isValidIntent(intent: string): intent is IntentType;
/**
 * Get all valid intent types.
 *
 * @returns Array of all valid IntentType values
 */
declare function getValidIntents(): IntentType[];
/**
 * Get human-readable description for an intent.
 *
 * @param intent - Intent type to describe
 * @returns Human-readable description string
 */
declare function getIntentDescription(intent: IntentType): string;
/**
 * Phase C: Intent-to-profile auto-routing.
 * Maps detected intent types to the most appropriate response profile.
 * Used when no explicit profile is specified by the caller.
 */
declare const INTENT_TO_PROFILE: Readonly<Record<IntentType, 'quick' | 'research' | 'debug'>>;
/**
 * Get the auto-routed response profile for a detected intent.
 *
 * @param intent - Detected intent type
 * @returns Response profile name or null if no mapping exists
 */
declare function getProfileForIntent(intent: IntentType): 'quick' | 'research' | 'debug' | null;
/**
 * C138: Intent-to-MMR-lambda mapping.
 * Controls the trade-off between relevance and diversity for each intent.
 * Lower lambda → more diversity. Higher lambda → more relevance.
 * Per spec: understand→0.5 (diversity), fix_bug→0.85 (relevance).
 */
declare const INTENT_LAMBDA_MAP: Readonly<Record<string, number>>;
export { INTENT_TYPES, INTENT_KEYWORDS, INTENT_PATTERNS, INTENT_WEIGHT_ADJUSTMENTS, INTENT_LAMBDA_MAP, INTENT_TO_PROFILE, calculateKeywordScore, calculatePatternScore, calculateCentroidScore, dotProduct, toDeterministicEmbedding, INTENT_CENTROIDS, classifyIntent, detectIntent, getIntentWeights, applyIntentWeights, getQueryWeights, isValidIntent, getValidIntents, getIntentDescription, getProfileForIntent, };
export type { IntentType, IntentResult, RankedIntent, IntentWeights, };
//# sourceMappingURL=intent-classifier.d.ts.map