import type Database from 'better-sqlite3';
/** Maximum graph traversal depth. Beyond 2 hops, signal degrades and queries become expensive. */
declare const MAX_HOPS = 2;
/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
declare const MAX_BOOST_PER_HOP = 0.05;
/** Graph density threshold below which community detection is disabled
 * and traversal is constrained to typed 1-hop expansion only.
 * Density = edgeCount / totalMemories (see edge-density.ts). */
declare const SPARSE_DENSITY_THRESHOLD = 0.5;
/** Traversal depth used in sparse mode (1-hop typed expansion). */
declare const SPARSE_MAX_HOPS = 1;
/** Default traversal depth for typed traversal helper policies. */
declare const DEFAULT_TYPED_TRAVERSAL_DEPTH = 1;
/**
 * Intent-to-edge-type priority ordering.
 * Maps each query intent to an ordered list of edge relation types.
 * Earlier entries in the list receive higher edge prior scores.
 *
 * Scores are normalized: first-listed relation = 1.0, second = 0.75, remaining = 0.5.
 */
declare const INTENT_EDGE_PRIORITY: Record<string, string[]>;
/** Fallback priority list when intent is unrecognized. */
declare const DEFAULT_EDGE_PRIORITY: string[];
/** Edge prior score tiers: 1st priority = 1.0, 2nd = 0.75, remaining = 0.5. */
declare const EDGE_PRIOR_TIERS: number[];
declare const DEFAULT_EDGE_PRIOR = 1;
/**
 * C138-P2: Relation-type weight multipliers for causal edge traversal.
 * Applied during CTE accumulation so stronger relation types (supersedes)
 * amplify the boost while weaker ones (contradicts) attenuate it.
 *
 * These multipliers serve a DIFFERENT purpose from RELATION_WEIGHTS in
 * causal-edges.ts. causal-edges weights are applied during chain traversal
 * scoring (getCausalChain), while these are applied during the causal-boost
 * CTE walk (getNeighborBoosts) for search result amplification. The value
 * ranges overlap but are tuned independently for their respective contexts:
 *   - causal-edges: traversal strength propagation (range 0.8–1.5)
 *   - causal-boost: search result boost amplitude (range 0.8–1.5)
 */
declare const RELATION_WEIGHT_MULTIPLIERS: Record<string, number>;
interface RankedSearchResult extends Record<string, unknown> {
    id: number;
    score?: number;
    rrfScore?: number;
    intentAdjustedScore?: number;
    attentionScore?: number;
    similarity?: number;
    sessionBoost?: number;
    baseScore?: number;
    causalBoost?: number;
    injectedByCausalBoost?: boolean;
}
interface CausalBoostMetadata {
    enabled: boolean;
    applied: boolean;
    boostedCount: number;
    injectedCount: number;
    maxBoostApplied: number;
    traversalDepth: number;
    /** D3-001: true when sparse-first policy was active (density < threshold) */
    sparseModeActive?: boolean;
    /** D3-002: intent used for edge traversal scoring (if typed traversal enabled) */
    intentUsed?: string;
}
/** Options for applyCausalBoost — extended with D3 Phase A parameters. */
interface CausalBoostOptions {
    /** D3-001/002: Graph density (edgeCount / totalMemories). Used for sparse-first gate. */
    graphDensity?: number;
    /** D3-002: Classified query intent. Used for intent-aware edge priority mapping. */
    intent?: string;
    /** D3-002: Freshness factor [0,1] applied to traversal scoring. Defaults to 1.0. */
    freshness?: number;
}
interface NeighborBoost {
    boost: number;
    hopCount: number;
}
/**
 * Check whether the causal boost feature flag is enabled.
 * Default: ON (graduated). Set SPECKIT_CAUSAL_BOOST=false to disable.
 * When enabled, causal graph traversal amplifies scores for results
 * connected to top-ranked results via causal edges.
 *
 * Delegates to the canonical flag check in search-flags.ts.
 */
declare function isEnabled(): boolean;
/**
 * Check whether the typed traversal feature flag is enabled.
 * Default: ON (graduated). Set SPECKIT_TYPED_TRAVERSAL=false to disable.
 * Activates sparse-first + intent-aware traversal.
 */
declare function isTypedTraversalEnabled(): boolean;
/** Store the database reference used by causal edge traversal queries. */
declare function init(database: Database.Database): void;
/**
 * Determine whether sparse mode should be active for this traversal pass.
 * Sparse mode is active when:
 *   - SPECKIT_TYPED_TRAVERSAL is enabled, AND
 *   - graphDensity is a finite number below SPARSE_DENSITY_THRESHOLD (0.5)
 *
 * When sparse mode is active:
 *   - Community detection is suppressed (caller must respect this)
 *   - Traversal is constrained to SPARSE_MAX_HOPS (1)
 */
declare function isSparseMode(graphDensity: number | undefined): boolean;
interface SparseFirstTraversalPolicy {
    sparseModeActive: boolean;
    communityDetectionEnabled: boolean;
}
/**
 * Resolve the sparse-first policy gate for callers that need a simple
 * community-detection decision without running the full boost pipeline.
 */
declare function resolveSparseFirstTraversalPolicy(graphDensity: number | undefined): SparseFirstTraversalPolicy;
/**
 * Resolve traversal depth for typed traversal helper callers.
 * Typed traversal defaults to 1-hop and stays within the supported range.
 * When the flag is off, preserve the legacy MAX_HOPS behavior.
 */
declare function resolveTraversalDepth(depth?: number): number;
/**
 * Compute the edge prior score for a given relation type and intent.
 * Returns a normalized score in [0.5, 1.0] based on priority position.
 *
 * Canonical relation names from causal-boost are lower-cased (e.g. 'supersedes').
 * Intent priority lists may include upper-case semantic labels (e.g. 'CORRECTION').
 * Matching is case-insensitive against both the label and any alias.
 *
 * Alias map: CORRECTION → supersedes | contradicts
 *            DEPENDS_ON → caused | enabled | derived_from
 *            EXTENDS    → enabled | derived_from
 *            PREFERENCE → supports
 */
declare const EDGE_LABEL_ALIASES: Record<string, string[]>;
declare function resolveEdgePrior(relation: string, intent: string): number;
/**
 * Compute hop decay factor. Formula: HOP_DECAY_BASE / hopDistance.
 * 1-hop → 1.0, 2-hop → 0.5, etc. Capped at 1.0.
 */
declare function computeHopDecay(hopDistance: number): number;
/**
 * Compute the D3-002 intent-aware traversal score.
 * Formula: seedScore * edgePrior * hopDecay * freshness
 *
 * @param seedScore  - Base score of the seed node (0–1)
 * @param relation   - Edge relation type (e.g. 'supersedes', 'caused')
 * @param hopDistance - Hop distance from seed (1 = direct neighbor)
 * @param freshness  - Recency factor (0–1, default 1.0)
 * @param intent     - Classified query intent (default 'understand')
 */
declare function computeIntentTraversalScore(seedScore: number, relation: string, hopDistance: number, freshness: number, intent: string): number;
declare function getIntentEdgePriorities(intent: string): string[];
declare function computeIntentEdgePrior(intent: string, edgeType: string): number;
declare function computeTraversalHopDecay(hopDistance: number): number;
declare function computeTraversalFreshnessFactor(updatedAt: Date | string, now?: Date | string): number;
declare function computeIntentAwareTraversalScore(params: {
    seedScore: number;
    intent: string;
    edgeType: string;
    hopDistance: number;
    updatedAt: Date | string;
    now?: Date | string;
}): number;
/**
 * Walk causal edges up to maxHops from the given seed memory IDs,
 * returning a map of neighbor ID to boost score.
 *
 * D3-001: Accepts an optional maxHops override. When sparse mode is active
 * (density < 0.5 and SPECKIT_TYPED_TRAVERSAL enabled), the caller passes
 * SPARSE_MAX_HOPS (1) to constrain traversal depth.
 */
declare function getNeighborBoosts(memoryIds: number[], maxHops?: number): Map<number, NeighborBoost>;
/**
 * Apply causal graph boost to ranked search results, injecting
 * graph-discovered neighbors and amplifying scores for connected nodes.
 *
 * D3 Phase A extensions:
 * - REQ-D3-001: When SPECKIT_TYPED_TRAVERSAL is enabled and graphDensity < 0.5,
 *   activates sparse mode: traversal depth = 1, community detection suppressed.
 * - REQ-D3-002: When SPECKIT_TYPED_TRAVERSAL is enabled and intent is provided,
 *   applies intent-aware edge traversal scoring using the formula:
 *   score = seedScore * edgePrior * hopDecay * freshness
 *
 * @param results - Ranked search results from prior pipeline stages
 * @param options - Optional D3 parameters (graphDensity, intent, freshness)
 */
declare function applyCausalBoost(results: RankedSearchResult[], options?: CausalBoostOptions): {
    results: RankedSearchResult[];
    metadata: CausalBoostMetadata;
};
/**
 * Graph context metadata returned by injectGraphContext.
 * Contains related memory IDs and edge types discovered from the graph
 * even when the causal boost has no seed results.
 */
interface GraphContextResult {
    /** Whether graph context injection was active and produced results. */
    activated: boolean;
    /** Canonical concept names matched from the query. */
    matchedConcepts: string[];
    /** Memory IDs of graph neighbors related to matched concepts. */
    relatedMemoryIds: number[];
    /** Edge relation types connecting seeds to neighbors. */
    edgeTypes: string[];
}
/**
 * Phase B T020: Always-on graph context injection.
 *
 * Runs concept routing on the query and finds graph neighbors for matched
 * concepts, returning graph context metadata (related memory IDs, edge types).
 * Unlike applyCausalBoost, this runs even when there are no seed results,
 * enabling proactive graph-guided context discovery.
 *
 * Feature-gated by SPECKIT_GRAPH_CONTEXT_INJECTION (default ON).
 * Fail-open: returns empty result on any error.
 *
 * @param query - The search query string.
 * @param database - SQLite database instance for graph lookups.
 * @returns GraphContextResult with related memory IDs and edge types.
 */
declare function injectGraphContext(query: string, database: Database.Database): GraphContextResult;
export { MAX_HOPS, MAX_BOOST_PER_HOP, RELATION_WEIGHT_MULTIPLIERS, SPARSE_DENSITY_THRESHOLD, SPARSE_MAX_HOPS, DEFAULT_TYPED_TRAVERSAL_DEPTH, INTENT_EDGE_PRIORITY, DEFAULT_EDGE_PRIORITY, DEFAULT_EDGE_PRIOR, EDGE_PRIOR_TIERS, EDGE_LABEL_ALIASES, init, isEnabled, isTypedTraversalEnabled, isSparseMode, resolveSparseFirstTraversalPolicy, resolveTraversalDepth, resolveEdgePrior, computeHopDecay, computeIntentTraversalScore, getIntentEdgePriorities, computeIntentEdgePrior, computeTraversalHopDecay, computeTraversalFreshnessFactor, computeIntentAwareTraversalScore, getNeighborBoosts, applyCausalBoost, injectGraphContext, };
export type { RankedSearchResult, CausalBoostMetadata, CausalBoostOptions, SparseFirstTraversalPolicy, GraphContextResult, };
//# sourceMappingURL=causal-boost.d.ts.map