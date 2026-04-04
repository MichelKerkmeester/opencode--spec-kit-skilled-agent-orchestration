import type { ExtractionResult } from '@spec-kit/shared/types';
export type SemanticSignalMode = 'topics' | 'triggers' | 'summary' | 'all';
export type StopwordProfile = 'balanced' | 'aggressive';
export type NgramDepth = 1 | 2 | 3 | 4;
export interface SemanticSignalExtractOptions {
    text: string;
    mode: SemanticSignalMode;
    stopwordProfile?: StopwordProfile;
    ngramDepth?: NgramDepth;
    maxPhrases?: number;
    minPhraseCount?: number;
}
export interface SemanticSignalResult {
    mode: SemanticSignalMode;
    stopwordProfile: StopwordProfile;
    ngramDepth: NgramDepth;
    cleanedText: string;
    tokens: string[];
    filteredTokens: string[];
    phrases: string[];
    topics: string[];
    rankedTerms: string[];
    stats: ExtractionResult['stats'];
    breakdown: ExtractionResult['breakdown'];
}
/**
 * Unified semantic signal extraction engine.
 * Provides mode-aware extraction for topics, triggers, summaries, or all signals combined.
 * All script-side extractors (trigger, topic, session, summary) delegate to this class.
 */
export declare class SemanticSignalExtractor {
    /** Extracts semantic signals from text based on the specified mode and stopword profile. */
    static extract(options: SemanticSignalExtractOptions): SemanticSignalResult;
    /** Extracts trigger phrases from text using balanced stopwords and ngram depth 2 by default. */
    static extractTriggerPhrases(text: string, overrides?: Omit<SemanticSignalExtractOptions, 'text' | 'mode'>): string[];
    /** Extracts trigger phrases with extraction stats and breakdown metadata. */
    static extractTriggerPhrasesWithStats(text: string, overrides?: Omit<SemanticSignalExtractOptions, 'text' | 'mode'>): ExtractionResult;
    /** Extracts topic terms from text using aggressive stopwords and ngram depth 2 by default. */
    static extractTopicTerms(text: string, overrides?: Omit<SemanticSignalExtractOptions, 'text' | 'mode'>): string[];
}
//# sourceMappingURL=semantic-signal-extractor.d.ts.map