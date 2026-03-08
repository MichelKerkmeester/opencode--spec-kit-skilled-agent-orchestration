// ---------------------------------------------------------------
// MODULE: Causal Boost
// ---------------------------------------------------------------
// Graph-traversal score boosting via causal edge relationships.
// Walks the causal_edges graph up to MAX_HOPS, amplifying scores
// for results related to top seed results via weighted CTE.
// ---------------------------------------------------------------

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

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

/**
 * C138-P2: Relation-type weight multipliers for causal edge traversal.
 * Applied during CTE accumulation so stronger relation types (supersedes)
 * amplify the boost while weaker ones (contradicts) attenuate it.
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
  similarity?: number;
  sessionBoost?: number;
}

interface CausalBoostMetadata {
  enabled: boolean;
  applied: boolean;
  boostedCount: number;
  injectedCount: number;
  maxBoostApplied: number;
  traversalDepth: number;
}

let db: Database.Database | null = null;

/** Check whether the causal boost feature flag is enabled. */
function isEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CAUSAL_BOOST');
}

/** Store the database reference used by causal edge traversal queries. */
function init(database: Database.Database): void {
  db = database;
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
 * Walk causal edges up to MAX_HOPS from the given seed memory IDs,
 * returning a map of neighbor ID to boost score.
 */
function getNeighborBoosts(memoryIds: number[]): Map<number, number> {
  const neighborBoosts = new Map<number, number>();
  if (!db) return neighborBoosts;

  const ids = normalizeIds(memoryIds);
  if (ids.length === 0) return neighborBoosts;

  const originIds = ids.map((value) => String(value));
  const placeholders = originIds.map(() => '?').join(', ');

  // C138-P2: Relation-weighted CTE — accumulates score with multiplier
  // based on edge relation type and edge strength column.
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
      MAX_HOPS,
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
      const current = neighborBoosts.get(neighborId) ?? 0;
      neighborBoosts.set(neighborId, Math.max(current, boost));
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
 */
function applyCausalBoost(results: RankedSearchResult[]): { results: RankedSearchResult[]; metadata: CausalBoostMetadata } {
  const metadata: CausalBoostMetadata = {
    enabled: isEnabled(),
    applied: false,
    boostedCount: 0,
    injectedCount: 0,
    maxBoostApplied: 0,
    traversalDepth: MAX_HOPS,
  };

  if (!metadata.enabled || !Array.isArray(results) || results.length === 0 || !db) {
    return { results, metadata };
  }

  const seedLimit = Math.max(1, Math.min(MAX_SEED_RESULTS, Math.ceil(results.length * SEED_FRACTION)));
  const seedIds = results.slice(0, seedLimit).map((item) => item.id);
  const neighborBoosts = getNeighborBoosts(seedIds);
  if (neighborBoosts.size === 0) {
    return { results, metadata };
  }

  const existingIds = new Set(results.map((item) => item.id));
  // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
  const lowestScore = Math.max(0.0001, results.map((item) => resolveBaseScore(item)).reduce((a, b) => Math.min(a, b), Infinity));

  const boosted = results.map((item) => {
    const causalBoost = neighborBoosts.get(item.id) ?? 0;
    if (causalBoost <= 0) {
      return item;
    }

    const sessionBoost = typeof item.sessionBoost === 'number' ? Math.max(0, item.sessionBoost) : 0;
    const allowedBoost = Math.max(0, Math.min(causalBoost, MAX_COMBINED_BOOST - sessionBoost));
    if (allowedBoost <= 0) {
      return item;
    }

    const baseScore = resolveBaseScore(item);
    const score = baseScore * (1 + allowedBoost);
    metadata.boostedCount += 1;
    metadata.maxBoostApplied = Math.max(metadata.maxBoostApplied, allowedBoost);
    return {
      ...item,
      score,
      causalBoost: allowedBoost,
      baseScore,
    };
  });

  const injectIds: number[] = [];
  for (const [neighborId] of neighborBoosts) {
    if (!existingIds.has(neighborId)) {
      injectIds.push(neighborId);
    }
  }

  const injectedRows = fetchNeighborRows(injectIds).map((row) => {
    const causalBoost = neighborBoosts.get(row.id) ?? 0;
    const baseScore = lowestScore * 0.5;
    return {
      ...row,
      score: baseScore * (1 + causalBoost),
      causalBoost,
      baseScore,
      injectedByCausalBoost: true,
    };
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

export {
  MAX_HOPS,
  MAX_BOOST_PER_HOP,
  RELATION_WEIGHT_MULTIPLIERS,
  init,
  isEnabled,
  getNeighborBoosts,
  applyCausalBoost,
};

export type {
  RankedSearchResult,
  CausalBoostMetadata,
};
