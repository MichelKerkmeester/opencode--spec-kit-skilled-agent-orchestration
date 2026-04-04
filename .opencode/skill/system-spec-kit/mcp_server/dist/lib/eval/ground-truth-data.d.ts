export type IntentType = 'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand' | 'find_spec' | 'find_decision';
export type ComplexityTier = 'simple' | 'moderate' | 'complex';
export type QueryCategory = 'factual' | 'temporal' | 'graph_relationship' | 'cross_document' | 'hard_negative' | 'anchor_based' | 'scope_filtered';
export type QuerySource = 'manual' | 'trigger_derived' | 'pattern_derived' | 'seed';
export interface GroundTruthQuery {
    id: number;
    query: string;
    intentType: IntentType;
    complexityTier: ComplexityTier;
    category: QueryCategory;
    source: QuerySource;
    expectedResultDescription: string;
    notes?: string;
}
export interface GroundTruthRelevance {
    queryId: number;
    memoryId: number;
    relevance: 0 | 1 | 2 | 3;
}
export declare const GROUND_TRUTH_QUERIES: GroundTruthQuery[];
export declare const GROUND_TRUTH_RELEVANCES: GroundTruthRelevance[];
export declare const QUERY_DISTRIBUTION: {
    readonly total: number;
    readonly bySource: {
        readonly seed: number;
        readonly pattern_derived: number;
        readonly trigger_derived: number;
        readonly manual: number;
    };
    readonly byIntentType: Record<string, number>;
    readonly byComplexityTier: Record<string, number>;
    readonly byCategory: Record<string, number>;
    readonly hardNegativeCount: number;
    readonly manualQueryCount: number;
};
//# sourceMappingURL=ground-truth-data.d.ts.map