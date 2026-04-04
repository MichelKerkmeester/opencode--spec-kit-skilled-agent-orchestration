import type { CausalChainNode } from '../lib/storage/causal-edges.js';
import type { MCPResponse } from './types.js';
/** Flat edge representation for API responses */
export interface FlatEdge {
    id: number;
    from: string;
    to: string;
    relation: string;
    strength: number;
    depth: number;
    direction: 'incoming' | 'outgoing';
}
/** Flattened chain produced from CausalChainNode tree */
export interface FlattenedChain {
    all: FlatEdge[];
    by_cause: FlatEdge[];
    by_enabled: FlatEdge[];
    by_supersedes: FlatEdge[];
    by_contradicts: FlatEdge[];
    by_derived_from: FlatEdge[];
    by_supports: FlatEdge[];
    total_edges: number;
    max_depth_reached: boolean;
    truncated: boolean;
    truncation_limit: number | null;
}
interface DriftWhyArgs {
    memoryId: string | number;
    maxDepth?: number;
    direction?: string;
    relations?: string[] | null;
    includeMemoryDetails?: boolean;
}
interface CausalLinkArgs {
    sourceId: string | number;
    targetId: string | number;
    relation: string;
    strength?: number;
    evidence?: string | null;
}
interface CausalStatsArgs {
    _?: never;
}
interface CausalUnlinkArgs {
    edgeId: number;
}
/**
 * Flatten a CausalChainNode tree into flat edge lists grouped by relation.
 * The tree from getCausalChain() encodes parent→child relationships;
 * for 'forward' direction: parent=source, child=target.
 * For 'backward' direction: parent=target, child=source.
 */
declare function flattenCausalTree(root: CausalChainNode, maxDepth: number, direction: 'forward' | 'backward'): FlattenedChain;
/** Handle memory_drift_why tool - traces causal relationships for a given memory */
declare function handleMemoryDriftWhy(args: DriftWhyArgs): Promise<MCPResponse>;
/** Handle memory_causal_link tool - creates a causal edge between two memories */
declare function handleMemoryCausalLink(args: CausalLinkArgs): Promise<MCPResponse>;
/** Handle memory_causal_stats tool - returns graph coverage and health metrics */
declare function handleMemoryCausalStats(_args: CausalStatsArgs): Promise<MCPResponse>;
/** Handle memory_causal_unlink tool - deletes a causal edge by ID */
declare function handleMemoryCausalUnlink(args: CausalUnlinkArgs): Promise<MCPResponse>;
export { handleMemoryDriftWhy, handleMemoryCausalLink, handleMemoryCausalStats, handleMemoryCausalUnlink, flattenCausalTree, };
declare const handle_memory_drift_why: typeof handleMemoryDriftWhy;
declare const handle_memory_causal_link: typeof handleMemoryCausalLink;
declare const handle_memory_causal_stats: typeof handleMemoryCausalStats;
declare const handle_memory_causal_unlink: typeof handleMemoryCausalUnlink;
export { handle_memory_drift_why, handle_memory_causal_link, handle_memory_causal_stats, handle_memory_causal_unlink, };
//# sourceMappingURL=causal-graph.d.ts.map