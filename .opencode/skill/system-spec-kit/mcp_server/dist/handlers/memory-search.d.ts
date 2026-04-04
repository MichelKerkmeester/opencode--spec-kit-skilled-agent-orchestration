import { collapseAndReassembleChunkResults } from '../lib/search/chunk-reassembly.js';
import { filterByMinQualityScore, resolveQualityThreshold, buildCacheArgs, resolveRowContextType, resolveArtifactRoutingQuery, applyArtifactRouting } from '../lib/search/search-utils.js';
import { collectEvalChannelsFromRow, buildEvalChannelPayloads } from '../lib/telemetry/eval-channel-tracking.js';
import type { MCPResponse } from './types.js';
import { type SessionTransitionTrace } from '../lib/search/session-transition.js';
interface SearchArgs {
    cursor?: string;
    query?: string;
    concepts?: string[];
    specFolder?: string;
    folderBoost?: {
        folder: string;
        factor: number;
    };
    tenantId?: string;
    userId?: string;
    agentId?: string;
    sharedSpaceId?: string;
    limit?: number;
    tier?: string;
    contextType?: string;
    useDecay?: boolean;
    includeContiguity?: boolean;
    includeConstitutional?: boolean;
    includeContent?: boolean;
    anchors?: string[];
    bypassCache?: boolean;
    sessionId?: string;
    enableDedup?: boolean;
    intent?: string;
    autoDetectIntent?: boolean;
    minState?: string;
    applyStateLimits?: boolean;
    rerank?: boolean;
    applyLengthPenalty?: boolean;
    trackAccess?: boolean;
    includeArchived?: boolean;
    enableSessionBoost?: boolean;
    enableCausalBoost?: boolean;
    minQualityScore?: number;
    min_quality_score?: number;
    mode?: string;
    includeTrace?: boolean;
    sessionTransition?: SessionTransitionTrace;
    /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
    profile?: string;
    /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
    retrievalLevel?: 'local' | 'global' | 'auto';
}
/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
 * @param args - Search arguments (query, concepts, mode, specFolder, etc.)
 * @returns MCP response with ranked search results
 */
declare function handleMemorySearch(args: SearchArgs): Promise<MCPResponse>;
export { handleMemorySearch, };
export declare const __testables: {
    filterByMinQualityScore: typeof filterByMinQualityScore;
    resolveQualityThreshold: typeof resolveQualityThreshold;
    buildCacheArgs: typeof buildCacheArgs;
    resolveRowContextType: typeof resolveRowContextType;
    resolveArtifactRoutingQuery: typeof resolveArtifactRoutingQuery;
    applyArtifactRouting: typeof applyArtifactRouting;
    collapseAndReassembleChunkResults: typeof collapseAndReassembleChunkResults;
    collectEvalChannelsFromRow: typeof collectEvalChannelsFromRow;
    buildEvalChannelPayloads: typeof buildEvalChannelPayloads;
};
declare const handle_memory_search: typeof handleMemorySearch;
export { handle_memory_search, };
//# sourceMappingURL=memory-search.d.ts.map