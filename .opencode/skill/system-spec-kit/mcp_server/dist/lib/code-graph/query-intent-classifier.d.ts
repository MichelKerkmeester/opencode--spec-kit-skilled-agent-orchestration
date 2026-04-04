export type QueryIntent = 'structural' | 'semantic' | 'hybrid';
export interface ClassificationResult {
    intent: QueryIntent;
    confidence: number;
    structuralScore: number;
    semanticScore: number;
    matchedKeywords: string[];
}
/**
 * Classify a query's intent for routing between structural
 * (code graph) and semantic (CocoIndex) retrieval backends.
 *
 * Returns intent + confidence score. Hybrid intent means
 * both backends should be queried and results merged.
 */
export declare function classifyQueryIntent(query: string): ClassificationResult;
//# sourceMappingURL=query-intent-classifier.d.ts.map