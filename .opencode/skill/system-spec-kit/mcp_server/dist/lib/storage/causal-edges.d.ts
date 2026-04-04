import type Database from 'better-sqlite3';
declare const RELATION_TYPES: Readonly<{
    readonly CAUSED: "caused";
    readonly ENABLED: "enabled";
    readonly SUPERSEDES: "supersedes";
    readonly CONTRADICTS: "contradicts";
    readonly DERIVED_FROM: "derived_from";
    readonly SUPPORTS: "supports";
}>;
type RelationType = typeof RELATION_TYPES[keyof typeof RELATION_TYPES];
/**
 * C138: Relation weight multipliers applied during traversal scoring.
 * Higher values amplify the propagated strength; values < 1.0 dampen it.
 */
declare const RELATION_WEIGHTS: Record<string, number>;
declare const DEFAULT_MAX_DEPTH = 3;
declare const MAX_EDGES_LIMIT = 100;
declare const MAX_EDGES_PER_NODE = 20;
declare const MAX_AUTO_STRENGTH = 0.5;
declare const MAX_STRENGTH_INCREASE_PER_CYCLE = 0.05;
declare const STALENESS_THRESHOLD_DAYS = 90;
declare const DECAY_STRENGTH_AMOUNT = 0.1;
declare const DECAY_PERIOD_DAYS = 30;
interface CausalEdge {
    id: number;
    source_id: string;
    target_id: string;
    relation: RelationType;
    strength: number;
    evidence: string | null;
    extracted_at: string;
    created_by: string;
    last_accessed: string | null;
}
type EdgeQueryResult = CausalEdge[] & {
    truncated: boolean;
    limit: number;
};
interface WeightHistoryEntry {
    id: number;
    edge_id: number;
    old_strength: number;
    new_strength: number;
    changed_by: string;
    changed_at: string;
    reason: string | null;
}
interface GraphStats {
    totalEdges: number;
    byRelation: Record<string, number>;
    avgStrength: number;
    uniqueSources: number;
    uniqueTargets: number;
}
interface CausalChainNode {
    id: string;
    edgeId?: number;
    depth: number;
    relation: RelationType;
    strength: number;
    children: CausalChainNode[];
    truncated?: boolean;
    truncationLimit?: number | null;
}
declare function init(database: Database.Database): void;
declare function insertEdge(sourceId: string, targetId: string, relation: RelationType, strength?: number, evidence?: string | null, shouldInvalidateCache?: boolean, createdBy?: string): number | null;
declare function insertEdgesBatch(edges: Array<{
    sourceId: string;
    targetId: string;
    relation: RelationType;
    strength?: number;
    evidence?: string | null;
    createdBy?: string;
}>): {
    inserted: number;
    failed: number;
};
declare function bulkInsertEdges(edges: Array<Record<string, unknown>>): {
    inserted: number;
    failed: number;
};
declare function getEdgesFrom(sourceId: string, limit?: number): EdgeQueryResult;
declare function getEdgesTo(targetId: string, limit?: number): EdgeQueryResult;
declare function getAllEdges(limit?: number): EdgeQueryResult;
declare function getCausalChain(rootId: string, maxDepth?: number, direction?: 'forward' | 'backward', edgeLimit?: number): CausalChainNode;
declare function updateEdge(edgeId: number, updates: {
    strength?: number;
    evidence?: string;
}, changedBy?: string, reason?: string | null): boolean;
declare function deleteEdge(edgeId: number): boolean;
declare function deleteEdgesForMemory(memoryId: string): number;
declare function getGraphStats(): GraphStats;
declare function findOrphanedEdges(): CausalEdge[];
declare function cleanupOrphanedEdges(): {
    deleted: number;
};
/**
 * Create causal relationship chain between spec folder documents.
 * Links: spec -> plan (CAUSED), plan -> tasks (CAUSED), tasks -> impl-summary (CAUSED)
 * Also: checklist SUPPORTS spec, decision-record SUPPORTS plan, research SUPPORTS spec
 *
 * @param documentIds Map of document_type -> memory_index.id for documents in the same spec folder
 */
declare function createSpecDocumentChain(documentIds: Record<string, number>): {
    inserted: number;
    failed: number;
};
declare function logWeightChange(edgeId: number, oldStrength: number, newStrength: number, changedBy?: string, reason?: string | null): void;
declare function getWeightHistory(edgeId: number, limit?: number): WeightHistoryEntry[];
declare function rollbackWeights(edgeId: number, toTimestamp: string): boolean;
declare function countEdgesForNode(nodeId: string): number;
declare function touchEdgeAccess(edgeId: number): void;
declare function getStaleEdges(thresholdDays?: number): CausalEdge[];
export { RELATION_TYPES, RELATION_WEIGHTS, DEFAULT_MAX_DEPTH, MAX_EDGES_LIMIT, MAX_EDGES_PER_NODE, MAX_AUTO_STRENGTH, MAX_STRENGTH_INCREASE_PER_CYCLE, STALENESS_THRESHOLD_DAYS, DECAY_STRENGTH_AMOUNT, DECAY_PERIOD_DAYS, init, insertEdge, insertEdgesBatch, bulkInsertEdges, getEdgesFrom, getEdgesTo, getAllEdges, getCausalChain, updateEdge, deleteEdge, deleteEdgesForMemory, getGraphStats, findOrphanedEdges, cleanupOrphanedEdges, createSpecDocumentChain, logWeightChange, getWeightHistory, rollbackWeights, countEdgesForNode, touchEdgeAccess, getStaleEdges, };
/**
 * Re-exports related public types.
 */
export type { RelationType, CausalEdge, EdgeQueryResult, WeightHistoryEntry, GraphStats, CausalChainNode, };
//# sourceMappingURL=causal-edges.d.ts.map