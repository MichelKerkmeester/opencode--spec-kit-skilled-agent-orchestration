import { type SessionTransitionTrace } from '../lib/search/session-transition.js';
import { type MCPResponse } from '../lib/response/envelope.js';
/** Token metrics for anchor-filtered content */
export interface AnchorTokenMetrics {
    originalTokens: number;
    returnedTokens: number;
    savingsPercent: number;
    anchorsRequested: number;
    anchorsFound: number;
}
/** Raw search result from database/vector search */
export interface RawSearchResult {
    id: number | string;
    spec_folder?: string;
    file_path?: string;
    specFolder?: string;
    filePath?: string;
    title?: string | null;
    /** Raw vector cosine similarity (0-100 scale from sqlite-vec). */
    similarity?: number;
    /** Average similarity across multi-concept queries (0-100 scale). */
    averageSimilarity?: number;
    isConstitutional?: boolean;
    importance_tier?: string;
    triggerPhrases?: string | string[];
    created_at?: string;
    [key: string]: unknown;
}
/** Formatted search result */
export interface FormattedSearchResult {
    id: number;
    specFolder: string;
    filePath: string;
    title: string | null;
    /** Raw vector cosine similarity (0-100 scale from sqlite-vec), or averageSimilarity for multi-concept. */
    similarity?: number;
    isConstitutional: boolean;
    importanceTier?: string;
    triggerPhrases: string[];
    createdAt?: string;
    content?: string | null;
    contentError?: string;
    tokenMetrics?: AnchorTokenMetrics;
    isChunk?: boolean;
    parentId?: number | null;
    chunkIndex?: number | null;
    chunkLabel?: string | null;
    chunkCount?: number | null;
    contentSource?: 'reassembled_chunks' | 'file_read_fallback';
}
export interface MemoryResultScores {
    semantic: number | null;
    lexical: number | null;
    fusion: number | null;
    intentAdjusted: number | null;
    composite: number | null;
    rerank: number | null;
    attention: number | null;
}
export interface MemoryResultSource {
    file: string | null;
    anchorIds: string[];
    anchorTypes: string[];
    lastModified: string | null;
    memoryState: string | null;
}
export interface MemoryResultTrace {
    channelsUsed: string[];
    pipelineStages: string[];
    fallbackTier: number | null;
    queryComplexity: string | null;
    expansionTerms: string[];
    budgetTruncated: boolean;
    scoreResolution: 'intentAdjusted' | 'fusion' | 'score' | 'semantic' | 'none';
    graphContribution?: {
        sources: string[];
        totalDelta: number;
        injected: boolean;
        raw?: number;
        normalized?: number;
        appliedBonus?: number;
        capApplied?: boolean;
        rolloutState?: string | null;
    };
    adaptiveMode?: string | null;
    sessionTransition?: SessionTransitionTrace;
}
export interface MemoryResultEnvelope extends FormattedSearchResult {
    scores?: MemoryResultScores;
    source?: MemoryResultSource;
    trace?: MemoryResultTrace;
    /** Phase C T025: Graph evidence provenance — edges, communities, and boost factors. */
    graphEvidence?: {
        edges: Array<{
            sourceId: number;
            targetId: number;
            relation: string;
            strength: number;
        }>;
        communities: Array<{
            communityId: number;
            summary?: string;
        }>;
        boostFactors: Array<{
            type: string;
            delta: number;
        }>;
    };
}
/** Memory parser interface (for optional override) */
export interface MemoryParserLike {
    extractAnchors(content: string): Record<string, string>;
}
export type { MCPResponse };
export declare function validateFilePathLocal(filePath: string): string;
export declare function safeJsonParse<T>(str: string | null | undefined, fallback: T): T;
export declare function formatSearchResults(results: RawSearchResult[] | null, searchType: string, include_content?: boolean, anchors?: string[] | null, parserOverride?: MemoryParserLike | null, startTime?: number | null, extraData?: Record<string, unknown>, includeTrace?: boolean, query?: string | null, specFolder?: string | null): Promise<MCPResponse>;
//# sourceMappingURL=search-results.d.ts.map