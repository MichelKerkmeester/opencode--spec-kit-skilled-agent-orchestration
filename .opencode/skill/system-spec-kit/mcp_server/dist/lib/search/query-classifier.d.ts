type QueryComplexityTier = 'simple' | 'moderate' | 'complex';
interface ClassificationResult {
    tier: QueryComplexityTier;
    features: {
        termCount: number;
        charCount: number;
        hasTriggerMatch: boolean;
        stopWordRatio: number;
    };
    confidence: 'high' | 'medium' | 'low' | 'fallback';
}
/** Config-driven thresholds */
declare const SIMPLE_TERM_THRESHOLD = 3;
declare const COMPLEX_TERM_THRESHOLD = 8;
/** Common English stop words for semantic complexity heuristic */
declare const STOP_WORDS: ReadonlySet<string>;
/**
 * Check if the complexity router feature flag is enabled.
 * Default: TRUE (graduated). Set SPECKIT_COMPLEXITY_ROUTER=false to disable.
 *
 * @returns True when SPECKIT_COMPLEXITY_ROUTER is not explicitly disabled.
 */
declare function isComplexityRouterEnabled(): boolean;
/**
 * Split query into terms by whitespace, filtering empty strings.
 *
 * @param query - Raw query string to tokenize.
 * @returns Array of non-empty whitespace-delimited terms.
 */
declare function extractTerms(query: string): string[];
/**
 * Calculate the ratio of stop words in the query terms.
 * Returns 0 for empty term lists.
 *
 * @param terms - Array of query terms to analyse.
 * @returns Ratio in [0, 1] of stop words to total terms.
 */
declare function calculateStopWordRatio(terms: string[]): number;
/**
 * Check if the query exactly matches any known trigger phrase (case-insensitive).
 *
 * @param query          - Raw query string to test.
 * @param triggerPhrases - Known trigger phrases to match against.
 * @returns True when the query matches a trigger phrase exactly.
 */
declare function hasTriggerMatch(query: string, triggerPhrases: string[]): boolean;
/**
 * Classify a query's complexity into one of three tiers: simple, moderate, or complex.
 *
 * Classification boundaries:
 * - Simple: ≤3 terms OR trigger phrase match
 * - Complex: >8 terms AND no trigger match
 * - Moderate: everything else (interior)
 *
 * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled (enabled by default,
 * graduated), all queries classify as "complex" (safe fallback — full pipeline).
 *
 * On any error, returns "complex" (safe fallback per spec).
 *
 * @param query          - Raw user query string.
 * @param triggerPhrases - Optional array of known trigger phrases.
 * @returns ClassificationResult with tier, features, and confidence.
 */
declare function classifyQueryComplexity(query: string, triggerPhrases?: string[]): ClassificationResult;
export { type QueryComplexityTier, type ClassificationResult, SIMPLE_TERM_THRESHOLD, COMPLEX_TERM_THRESHOLD, STOP_WORDS, classifyQueryComplexity, isComplexityRouterEnabled, extractTerms, calculateStopWordRatio, hasTriggerMatch, };
//# sourceMappingURL=query-classifier.d.ts.map