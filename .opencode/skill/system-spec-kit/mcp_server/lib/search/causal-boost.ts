// ───────────────────────────────────────────────────────────────
// MODULE: Causal Boost
// ───────────────────────────────────────────────────────────────
// Feature catalog: Causal neighbor boost and injection
// Graph-traversal score boosting via causal edge relationships.
// Walks the causal_edges graph up to MAX_HOPS, amplifying scores
// For results related to top seed results via weighted CTE.
//
// D3 Phase A — Sparse-First + Intent-Aware Traversal:
// - REQ-D3-001: Sparse-first policy — density < 0.5 disables community
//   detection and constrains traversal to typed 1-hop expansion only.
// - REQ-D3-002: Intent-aware edge traversal — maps classified query intents
//   to edge-type priority orderings; computes traversal score as:
//   score = seedScore * edgePrior * hopDecay * freshness
// Both requirements are gated behind SPECKIT_TYPED_TRAVERSAL (default ON, graduated).
import { isCausalBoostEnabled, isTypedTraversalEnabled as _isTypedTraversalEnabled, isGraphContextInjectionEnabled } from './search-flags.js';
import { routeQueryConcepts } from './entity-linker.js';

import type Database from 'better-sqlite3';

/** Maximum graph traversal depth. Beyond 2 hops, signal degrades and queries become expensive. */
const MAX_HOPS = 2;
/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
const MAX_BOOST_PER_HOP = 0.05;
/** Combined causal + session boost ceiling to prevent runaway amplification. */
const MAX_COMBINED_BOOST = 0.20;
/** Top fraction of result set used as graph walk seed nodes. */
const SEED_FRACTION = 0.25;
/** Absolute cap on seed nodes regardless of result set size. */
const MAX_SEED_RESULTS = 5;

// ───────────────────────────────────────────────────────────────
// D3-001: SPARSE-FIRST POLICY CONSTANTS
// ───────────────────────────────────────────────────────────────
/** Graph density threshold below which community detection is disabled
 * and traversal is constrained to typed 1-hop expansion only.
 * Density = edgeCount / totalMemories (see edge-density.ts). */
const SPARSE_DENSITY_THRESHOLD = 0.5;

/** Traversal depth used in sparse mode (1-hop typed expansion). */
const SPARSE_MAX_HOPS = 1;

/** Default traversal depth for typed traversal helper policies. */
const DEFAULT_TYPED_TRAVERSAL_DEPTH = SPARSE_MAX_HOPS;

// ───────────────────────────────────────────────────────────────
// D3-002: INTENT-AWARE EDGE TRAVERSAL
// ───────────────────────────────────────────────────────────────
/** Per-hop decay factor applied to traversal score. 1-hop = 1.0, 2-hop = 0.5. */
const HOP_DECAY_BASE = 1.0;

/**
 * Intent-to-edge-type priority ordering.
 * Maps each query intent to an ordered list of edge relation types.
 * Earlier entries in the list receive higher edge prior scores.
 *
 * Scores are normalized: first-listed relation = 1.0, second = 0.75, remaining = 0.5.
 */
const INTENT_EDGE_PRIORITY: Record<string, string[]> = {
  fix_bug:        ['CORRECTION', 'DEPENDS_ON', 'supersedes', 'caused'],
  add_feature:    ['EXTENDS', 'DEPENDS_ON', 'enabled', 'derived_from'],
  find_decision:  ['PREFERENCE', 'CORRECTION', 'supersedes', 'contradicts'],
  // Defaults for other intents — use existing relation-weight ordering
  understand:     ['caused', 'enabled', 'derived_from', 'supports', 'supersedes', 'contradicts'],
  find_spec:      ['caused', 'enabled', 'derived_from', 'supports', 'supersedes', 'contradicts'],
  refactor:       ['caused', 'derived_from', 'enabled', 'supports', 'supersedes', 'contradicts'],
  security_audit: ['caused', 'contradicts', 'supersedes', 'enabled', 'supports', 'derived_from'],
};

/** Fallback priority list when intent is unrecognized. */
const DEFAULT_EDGE_PRIORITY = ['caused', 'enabled', 'derived_from', 'supports', 'supersedes', 'contradicts'];

/** Edge prior score tiers: 1st priority = 1.0, 2nd = 0.75, remaining = 0.5. */
const EDGE_PRIOR_TIERS = [1.0, 0.75, 0.5];
const DEFAULT_EDGE_PRIOR = 1.0;
const FRESHNESS_DECAY_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

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
const RELATION_WEIGHT_MULTIPLIERS: Record<string, number> = {
  supersedes: 1.5,
  contradicts: 0.8,
  caused: 1.0,
  enabled: 1.0,
  derived_from: 1.0,
  supports: 1.0,
};

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

let db: Database.Database | null = null;

/**
 * Check whether the causal boost feature flag is enabled.
 * Default: ON (graduated). Set SPECKIT_CAUSAL_BOOST=false to disable.
 * When enabled, causal graph traversal amplifies scores for results
 * connected to top-ranked results via causal edges.
 *
 * Delegates to the canonical flag check in search-flags.ts.
 */
function isEnabled(): boolean {
  return isCausalBoostEnabled();
}

/**
 * Check whether the typed traversal feature flag is enabled.
 * Default: ON (graduated). Set SPECKIT_TYPED_TRAVERSAL=false to disable.
 * Activates sparse-first + intent-aware traversal.
 */
function isTypedTraversalEnabled(): boolean {
  return _isTypedTraversalEnabled();
}

/** Store the database reference used by causal edge traversal queries. */
function init(database: Database.Database): void {
  db = database;
}

// ───────────────────────────────────────────────────────────────
// D3-001: SPARSE-FIRST POLICY
// ───────────────────────────────────────────────────────────────

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
function isSparseMode(graphDensity: number | undefined): boolean {
  if (!isTypedTraversalEnabled()) return false;
  if (typeof graphDensity !== 'number' || !Number.isFinite(graphDensity)) return false;
  return graphDensity < SPARSE_DENSITY_THRESHOLD;
}

interface SparseFirstTraversalPolicy {
  sparseModeActive: boolean;
  communityDetectionEnabled: boolean;
}

/**
 * Resolve the sparse-first policy gate for callers that need a simple
 * community-detection decision without running the full boost pipeline.
 */
function resolveSparseFirstTraversalPolicy(graphDensity: number | undefined): SparseFirstTraversalPolicy {
  const sparseModeActive = isSparseMode(graphDensity);
  return {
    sparseModeActive,
    communityDetectionEnabled: !sparseModeActive,
  };
}

/**
 * Resolve traversal depth for typed traversal helper callers.
 * Typed traversal defaults to 1-hop and stays within the supported range.
 * When the flag is off, preserve the legacy MAX_HOPS behavior.
 */
function resolveTraversalDepth(depth: number = DEFAULT_TYPED_TRAVERSAL_DEPTH): number {
  if (!isTypedTraversalEnabled()) {
    return MAX_HOPS;
  }

  if (!Number.isFinite(depth)) {
    return DEFAULT_TYPED_TRAVERSAL_DEPTH;
  }

  return Math.max(DEFAULT_TYPED_TRAVERSAL_DEPTH, Math.min(MAX_HOPS, Math.trunc(depth)));
}

// ───────────────────────────────────────────────────────────────
// D3-002: INTENT-AWARE EDGE TRAVERSAL HELPERS
// ───────────────────────────────────────────────────────────────

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
const EDGE_LABEL_ALIASES: Record<string, string[]> = {
  CORRECTION:  ['supersedes', 'contradicts'],
  DEPENDS_ON:  ['caused', 'enabled', 'derived_from'],
  EXTENDS:     ['enabled', 'derived_from'],
  PREFERENCE:  ['supports'],
};

function resolveEdgePrior(relation: string, intent: string): number {
  if (!isTypedTraversalEnabled()) return 1.0;

  const priority = INTENT_EDGE_PRIORITY[intent] ?? DEFAULT_EDGE_PRIORITY;
  const relLower = relation.toLowerCase();

  for (let i = 0; i < priority.length; i++) {
    const entry = priority[i];
    if (!entry) continue;
    // Exact match (case-insensitive)
    if (entry.toLowerCase() === relLower) {
      return EDGE_PRIOR_TIERS[Math.min(i, EDGE_PRIOR_TIERS.length - 1)] ?? 0.5;
    }
    // Alias expansion: check if this priority label maps to the relation
    const aliases = EDGE_LABEL_ALIASES[entry.toUpperCase()];
    if (aliases && aliases.includes(relLower)) {
      return EDGE_PRIOR_TIERS[Math.min(i, EDGE_PRIOR_TIERS.length - 1)] ?? 0.5;
    }
  }

  // Relation not found in priority list — assign minimum tier
  return EDGE_PRIOR_TIERS[EDGE_PRIOR_TIERS.length - 1] ?? 0.5;
}

/**
 * Compute hop decay factor. Formula: HOP_DECAY_BASE / hopDistance.
 * 1-hop → 1.0, 2-hop → 0.5, etc. Capped at 1.0.
 */
function computeHopDecay(hopDistance: number): number {
  if (!Number.isFinite(hopDistance) || hopDistance <= 0) return 0;
  return Math.min(1.0, HOP_DECAY_BASE / hopDistance);
}

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
function computeIntentTraversalScore(
  seedScore: number,
  relation: string,
  hopDistance: number,
  freshness: number,
  intent: string
): number {
  const edgePrior = resolveEdgePrior(relation, intent);
  const hopDecay = computeHopDecay(hopDistance);
  return seedScore * edgePrior * hopDecay * freshness;
}

function getIntentEdgePriorities(intent: string): string[] {
  return (INTENT_EDGE_PRIORITY[intent] ?? []).slice(0, 2);
}

function computeIntentEdgePrior(intent: string, edgeType: string): number {
  const priorities = getIntentEdgePriorities(intent);
  if (priorities.length === 0) {
    return DEFAULT_EDGE_PRIOR;
  }

  const normalizedEdgeType = edgeType.toUpperCase();
  const directMatchIndex = priorities.findIndex(
    (priority) => priority.toUpperCase() === normalizedEdgeType,
  );
  if (directMatchIndex >= 0) {
    return EDGE_PRIOR_TIERS[Math.min(directMatchIndex, EDGE_PRIOR_TIERS.length - 1)] ?? 0.5;
  }

  return resolveEdgePrior(edgeType, intent);
}

function computeTraversalHopDecay(hopDistance: number): number {
  return computeHopDecay(hopDistance);
}

function computeTraversalFreshnessFactor(
  updatedAt: Date | string,
  now: Date | string = new Date(),
): number {
  const updatedAtMs = new Date(updatedAt).getTime();
  const nowMs = new Date(now).getTime();
  if (!Number.isFinite(updatedAtMs) || !Number.isFinite(nowMs) || nowMs <= updatedAtMs) {
    return 1;
  }

  const ageMs = nowMs - updatedAtMs;
  return Math.exp(-(ageMs / FRESHNESS_DECAY_WINDOW_MS));
}

function computeIntentAwareTraversalScore(params: {
  seedScore: number;
  intent: string;
  edgeType: string;
  hopDistance: number;
  updatedAt: Date | string;
  now?: Date | string;
}): number {
  return params.seedScore *
    computeIntentEdgePrior(params.intent, params.edgeType) *
    computeTraversalHopDecay(params.hopDistance) *
    computeTraversalFreshnessFactor(params.updatedAt, params.now);
}

/**
 * Resolve the primary numeric score from a result, checking score, rrfScore,
 * and similarity (normalized to 0–1) in precedence order. Returns 0 if none present.
 */
function resolveBaseScore(result: RankedSearchResult): number {
  if (typeof result.score === 'number' && Number.isFinite(result.score)) return result.score;
  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore)) return result.rrfScore;
  if (typeof result.similarity === 'number' && Number.isFinite(result.similarity)) return result.similarity / 100;
  return 0;
}

function buildPipelineRow(
  row: RankedSearchResult,
  baseScore: number,
  causalBoost: number
): RankedSearchResult {
  const allowedBoost = Math.max(0, Math.min(causalBoost, MAX_COMBINED_BOOST));
  const score = Math.min(1, Math.max(0, baseScore * (1 + allowedBoost)));
  return {
    ...row,
    score,
    rrfScore: score,
    intentAdjustedScore: score,
    attentionScore: score,
    causalBoost: allowedBoost,
    baseScore,
    injectedByCausalBoost: true,
  };
}

/**
 * Deduplicate and validate a list of numeric IDs, truncating to integers
 * and dropping non-finite values to guard against DB query injection.
 */
function normalizeIds(inputIds: number[]): number[] {
  const ids = new Set<number>();
  for (const candidate of inputIds) {
    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      ids.add(Math.trunc(candidate));
    }
  }
  return Array.from(ids);
}

/**
 * Compute the hop-distance decay boost: MAX_BOOST_PER_HOP / hopDistance,
 * capped at MAX_BOOST_PER_HOP so closer neighbors get the full signal.
 */
function computeBoostByHop(hopDistance: number): number {
  if (!Number.isFinite(hopDistance) || hopDistance <= 0) return 0;
  const rawBoost = MAX_BOOST_PER_HOP / hopDistance;
  return Math.min(MAX_BOOST_PER_HOP, rawBoost);
}

/**
 * Walk causal edges up to maxHops from the given seed memory IDs,
 * returning a map of neighbor ID to boost score.
 *
 * D3-001: Accepts an optional maxHops override. When sparse mode is active
 * (density < 0.5 and SPECKIT_TYPED_TRAVERSAL enabled), the caller passes
 * SPARSE_MAX_HOPS (1) to constrain traversal depth.
 */
function getNeighborBoosts(memoryIds: number[], maxHops: number = MAX_HOPS): Map<number, NeighborBoost> {
  const neighborBoosts = new Map<number, NeighborBoost>();
  if (!db) return neighborBoosts;

  const ids = normalizeIds(memoryIds);
  if (ids.length === 0) return neighborBoosts;

  const originIds = ids.map((value) => String(value));
  const placeholders = originIds.map(() => '?').join(', ');

  // C138-P2: Relation-weighted CTE — accumulates score with multiplier
  // Based on edge relation type and edge strength column.
  // 'supersedes' edges get 1.5x, 'contradicts' 0.8x, others 1.0x.
  const query = `
    WITH RECURSIVE causal_walk(origin_id, node_id, hop_distance, walk_score) AS (
      SELECT ce.source_id, ce.target_id, 1,
             (CASE WHEN ce.relation = 'supersedes' THEN 1.5
                   WHEN ce.relation = 'contradicts' THEN 0.8
                   ELSE 1.0 END * COALESCE(ce.strength, 1.0))
      FROM causal_edges ce
      WHERE ce.source_id IN (${placeholders})

      UNION

      SELECT ce.target_id, ce.source_id, 1,
             (CASE WHEN ce.relation = 'supersedes' THEN 1.5
                   WHEN ce.relation = 'contradicts' THEN 0.8
                   ELSE 1.0 END * COALESCE(ce.strength, 1.0))
      FROM causal_edges ce
      WHERE ce.target_id IN (${placeholders})

      UNION

      SELECT cw.origin_id,
             CASE
               WHEN ce.source_id = cw.node_id THEN ce.target_id
               ELSE ce.source_id
             END,
             cw.hop_distance + 1,
             (cw.walk_score * CASE WHEN ce.relation = 'supersedes' THEN 1.5
                                   WHEN ce.relation = 'contradicts' THEN 0.8
                                   ELSE 1.0 END * COALESCE(ce.strength, 1.0))
      FROM causal_walk cw
      JOIN causal_edges ce
        ON ce.source_id = cw.node_id OR ce.target_id = cw.node_id
      WHERE cw.hop_distance < ?
        AND (CASE WHEN ce.source_id = cw.node_id THEN ce.target_id ELSE ce.source_id END) != cw.origin_id
    )
    SELECT node_id, MIN(hop_distance) AS min_hop, MAX(walk_score) AS max_walk_score
    FROM causal_walk
    WHERE node_id NOT IN (${placeholders})
    GROUP BY node_id
  `;

  try {
    const rows = (db.prepare(query) as Database.Statement).all(
      ...originIds,
      ...originIds,
      maxHops,
      ...originIds
    ) as Array<{ node_id: string; min_hop: number; max_walk_score: number }>;

    for (const row of rows) {
      const neighborId = Number.parseInt(row.node_id, 10);
      if (!Number.isFinite(neighborId)) continue;
      // C138-P2: Combine hop-distance decay with relation-weighted walk score
      const hopBoost = computeBoostByHop(row.min_hop);
      const walkMultiplier = typeof row.max_walk_score === 'number' && Number.isFinite(row.max_walk_score)
        ? Math.max(0.1, Math.min(2.0, row.max_walk_score))
        : 1.0;
      const boost = hopBoost * walkMultiplier;
      if (boost <= 0) continue;
      const current = neighborBoosts.get(neighborId);
      if (!current || boost > current.boost) {
        neighborBoosts.set(neighborId, {
          boost,
          hopCount: Math.max(1, Math.min(maxHops, row.min_hop)),
        });
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-boost] Traversal failed: ${message}`);
  }

  return neighborBoosts;
}

function fetchNeighborRows(memoryIds: number[]): RankedSearchResult[] {
  if (!db || memoryIds.length === 0) return [];

  const placeholders = memoryIds.map(() => '?').join(', ');
  const rows = (db.prepare(`
    SELECT id, spec_folder, file_path, title, importance_tier, trigger_phrases, created_at
    FROM memory_index
    WHERE id IN (${placeholders})
  `) as Database.Statement).all(...memoryIds) as RankedSearchResult[];

  return rows;
}

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
function applyCausalBoost(
  results: RankedSearchResult[],
  options: CausalBoostOptions = {}
): { results: RankedSearchResult[]; metadata: CausalBoostMetadata } {
  const { graphDensity, intent = 'understand', freshness = 1.0 } = options;

  // D3-001: Determine sparse mode and effective hop depth
  const sparseMode = isSparseMode(graphDensity);
  const effectiveMaxHops = sparseMode ? SPARSE_MAX_HOPS : MAX_HOPS;

  const metadata: CausalBoostMetadata = {
    enabled: isEnabled(),
    applied: false,
    boostedCount: 0,
    injectedCount: 0,
    maxBoostApplied: 0,
    traversalDepth: effectiveMaxHops,
    sparseModeActive: sparseMode,
    intentUsed: isTypedTraversalEnabled() ? intent : undefined,
  };

  if (!metadata.enabled || !Array.isArray(results) || results.length === 0 || !db) {
    return { results, metadata };
  }

  const seedLimit = Math.max(1, Math.min(MAX_SEED_RESULTS, Math.ceil(results.length * SEED_FRACTION)));
  const seedResults = results.slice(0, seedLimit);
  const seedIds = seedResults.map((item) => item.id);
  // D3-001: Pass effectiveMaxHops to constrain traversal in sparse mode
  const neighborBoosts = getNeighborBoosts(seedIds, effectiveMaxHops);
  if (neighborBoosts.size === 0) {
    return { results, metadata };
  }

  // D3-002: When SPECKIT_TYPED_TRAVERSAL is enabled, re-score neighbor boosts
  // using the intent-aware traversal formula: seedScore * edgePrior * hopDecay * freshness.
  // We use the average seed score as the seedScore proxy and the actual hop distance
  // returned by getNeighborBoosts(). This preserves backward compatibility: when flag
  // is OFF, the original boost values from getNeighborBoosts() are used unchanged.
  const intentBoosts: Map<number, number> = new Map();
  if (isTypedTraversalEnabled()) {
    const avgSeedScore = seedResults.length > 0
      ? seedResults.map((s) => resolveBaseScore(s)).reduce((a, b) => a + b, 0) / seedResults.length
      : 1.0;
    const clampedFreshness = Math.max(0, Math.min(1, Number.isFinite(freshness) ? freshness : 1.0));

    for (const [neighborId, neighborBoost] of neighborBoosts) {
      // We don't have the per-edge relation type at this aggregation level,
      // so we use the seed's dominant relation by querying the first-hop edge from the DB.
      // Fall back to 'caused' (neutral default) if unavailable.
      let dominantRelation = 'caused';
      if (db) {
        try {
          const edgeRow = (db.prepare(`
            SELECT relation FROM causal_edges
            WHERE source_id IN (${seedIds.map(() => '?').join(',')})
              AND target_id = ?
            LIMIT 1
          `) as Database.Statement).get(...seedIds.map(String), String(neighborId)) as
            { relation: string } | undefined;
          if (edgeRow?.relation) dominantRelation = edgeRow.relation;
        } catch (_err: unknown) {
          // Fall back to default relation on query failure
        }
      }

      const intentScore = computeIntentTraversalScore(
        avgSeedScore,
        dominantRelation,
        neighborBoost.hopCount,
        clampedFreshness,
        intent
      );
      intentBoosts.set(neighborId, intentScore);
    }
  }

  // Select the active boost map: intent-aware when D3-002 flag is on, classic otherwise
  const classicBoosts = new Map<number, number>();
  for (const [neighborId, neighborBoost] of neighborBoosts) {
    classicBoosts.set(neighborId, neighborBoost.boost);
  }
  const activeBoosts = isTypedTraversalEnabled() ? intentBoosts : classicBoosts;

  const existingIds = new Set(results.map((item) => item.id));
  // Reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
  const lowestScore = Math.max(0.0001, results.map((item) => resolveBaseScore(item)).reduce((a, b) => Math.min(a, b), Infinity));

  const boosted = results.map((item) => {
    const causalBoost = activeBoosts.get(item.id) ?? 0;
    if (causalBoost <= 0) {
      return item;
    }

    const sessionBoost = typeof item.sessionBoost === 'number' ? Math.max(0, item.sessionBoost) : 0;
    const allowedBoost = Math.max(0, Math.min(causalBoost, MAX_COMBINED_BOOST - sessionBoost));
    if (allowedBoost <= 0) {
      return item;
    }

    const baseScore = resolveBaseScore(item);
    const score = Math.min(1, Math.max(0, baseScore * (1 + allowedBoost)));
    metadata.boostedCount += 1;
    metadata.maxBoostApplied = Math.max(metadata.maxBoostApplied, allowedBoost);
    return {
      ...item,
      score,
      rrfScore: score,
      intentAdjustedScore: score,
      attentionScore: score,
      causalBoost: allowedBoost,
      baseScore,
    };
  });

  const injectIds: number[] = [];
  for (const [neighborId] of activeBoosts) {
    if (!existingIds.has(neighborId)) {
      injectIds.push(neighborId);
    }
  }

  const injectedRows = fetchNeighborRows(injectIds).map((row) => {
    const causalBoost = Math.max(0, Math.min(activeBoosts.get(row.id) ?? 0, MAX_COMBINED_BOOST));
    metadata.maxBoostApplied = Math.max(metadata.maxBoostApplied, causalBoost);
    const baseScore = lowestScore * 0.5;
    return buildPipelineRow(row, baseScore, causalBoost);
  });

  metadata.injectedCount = injectedRows.length;
  metadata.applied = metadata.boostedCount > 0 || metadata.injectedCount > 0;

  const merged = [...boosted, ...injectedRows].sort((left, right) => {
    const leftScore = resolveBaseScore(left);
    const rightScore = resolveBaseScore(right);
    if (rightScore === leftScore) {
      return left.id - right.id;
    }
    return rightScore - leftScore;
  });

  return { results: merged, metadata };
}

// ───────────────────────────────────────────────────────────────
// Phase B T020: ALWAYS-ON GRAPH CONTEXT INJECTION
// ───────────────────────────────────────────────────────────────

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
function injectGraphContext(
  query: string,
  database: Database.Database,
): GraphContextResult {
  const empty: GraphContextResult = {
    activated: false,
    matchedConcepts: [],
    relatedMemoryIds: [],
    edgeTypes: [],
  };

  if (!isGraphContextInjectionEnabled()) return empty;

  try {
    const routing = routeQueryConcepts(query, database);
    if (!routing.graphActivated || routing.concepts.length === 0) return empty;

    // Find seed memory IDs whose titles contain matched concept keywords
    const likeClauses = routing.concepts.map(() => 'LOWER(title) LIKE ?').join(' OR ');
    const likeParams = routing.concepts.map((c) => `%${c.toLowerCase()}%`);

    const seedRows = (database.prepare(`
      SELECT id FROM memory_index WHERE (${likeClauses}) LIMIT 10
    `) as Database.Statement).all(...likeParams) as Array<{ id: number }>;

    if (seedRows.length === 0) {
      return { ...empty, activated: true, matchedConcepts: routing.concepts };
    }

    const seedIds = seedRows.map((r) => String(r.id));
    const seedPlaceholders = seedIds.map(() => '?').join(', ');

    // Walk 1-hop causal edges to find neighbor nodes and edge types
    const neighborRows = (database.prepare(`
      SELECT DISTINCT
        CASE
          WHEN ce.source_id IN (${seedPlaceholders}) THEN CAST(ce.target_id AS INTEGER)
          ELSE CAST(ce.source_id AS INTEGER)
        END AS neighbor_id,
        ce.relation
      FROM causal_edges ce
      WHERE ce.source_id IN (${seedPlaceholders}) OR ce.target_id IN (${seedPlaceholders})
      LIMIT 20
    `) as Database.Statement).all(
      ...seedIds,
      ...seedIds,
      ...seedIds,
    ) as Array<{ neighbor_id: number; relation: string }>;

    const relatedMemoryIds: number[] = [];
    const edgeTypes = new Set<string>();
    const seedIdSet = new Set(seedRows.map((r) => r.id));

    for (const row of neighborRows) {
      if (!seedIdSet.has(row.neighbor_id) && Number.isFinite(row.neighbor_id)) {
        relatedMemoryIds.push(row.neighbor_id);
      }
      if (row.relation) {
        edgeTypes.add(row.relation);
      }
    }

    return {
      activated: true,
      matchedConcepts: routing.concepts,
      relatedMemoryIds: [...new Set(relatedMemoryIds)].slice(0, 10),
      edgeTypes: Array.from(edgeTypes),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-boost] injectGraphContext failed (fail-open): ${message}`);
    return empty;
  }
}

export {
  MAX_HOPS,
  MAX_BOOST_PER_HOP,
  RELATION_WEIGHT_MULTIPLIERS,
  // D3 Phase A exports
  SPARSE_DENSITY_THRESHOLD,
  SPARSE_MAX_HOPS,
  DEFAULT_TYPED_TRAVERSAL_DEPTH,
  INTENT_EDGE_PRIORITY,
  DEFAULT_EDGE_PRIORITY,
  DEFAULT_EDGE_PRIOR,
  EDGE_PRIOR_TIERS,
  EDGE_LABEL_ALIASES,
  init,
  isEnabled,
  isTypedTraversalEnabled,
  isSparseMode,
  resolveSparseFirstTraversalPolicy,
  resolveTraversalDepth,
  resolveEdgePrior,
  computeHopDecay,
  computeIntentTraversalScore,
  getIntentEdgePriorities,
  computeIntentEdgePrior,
  computeTraversalHopDecay,
  computeTraversalFreshnessFactor,
  computeIntentAwareTraversalScore,
  getNeighborBoosts,
  applyCausalBoost,
  // Phase B T020
  injectGraphContext,
};

export type {
  RankedSearchResult,
  CausalBoostMetadata,
  CausalBoostOptions,
  SparseFirstTraversalPolicy,
  GraphContextResult,
};
