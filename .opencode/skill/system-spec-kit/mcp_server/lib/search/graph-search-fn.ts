// ───────────────────────────────────────────────────────────────
// MODULE: Graph Search Fn
// ───────────────────────────────────────────────────────────────
// Feature catalog: Unified graph retrieval, deterministic ranking, explainability, and rollback
// Causal graph search channel — uses FTS5 for node matching

import { sanitizeFTS5Query } from './bm25-index';
import { queryHierarchyMemories } from './spec-folder-hierarchy';

import type Database from 'better-sqlite3';
import type { GraphSearchFn } from './search-types';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
interface CausalEdgeRow {
  id: string;
  source_id: string;
  target_id: string;
  relation: string;
  strength: number;
}

// ───────────────────────────────────────────────────────────────
// 2. TYPED-DEGREE CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Edge type weights for typed-degree computation (R4 5th RRF channel) */
const EDGE_TYPE_WEIGHTS: Record<string, number> = {
  caused: 1.0,
  derived_from: 0.9,
  enabled: 0.8,
  contradicts: 0.7,
  supersedes: 0.6,
  supports: 0.5,
};

/** Fallback maximum typed degree when no edges exist in the database */
const DEFAULT_MAX_TYPED_DEGREE = 15;

/** Hard cap on raw typed degree before normalization */
const MAX_TOTAL_DEGREE = 50;

/** Maximum normalized boost score */
const DEGREE_BOOST_CAP = 0.15;

/** Runtime fusion weight for the degree channel. Keep aligned with the boost cap. */
const DEGREE_CHANNEL_WEIGHT = DEGREE_BOOST_CAP;

// ───────────────────────────────────────────────────────────────
// 3. CAUSAL EDGE CHANNEL (FTS5-BACKED)

// ───────────────────────────────────────────────────────────────
/**
 * Check whether the FTS5 table exists in the database.
 * Used to determine if FTS5 matching is available.
 */
function isFtsTableAvailable(database: Database.Database): boolean {
  try {
    const result = (database.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
    ) as Database.Statement).get() as { name: string } | undefined;
    return !!result;
  } catch (_err: unknown) { // SQL parse failure — return empty degree map
    return false;
  }
}

/**
 * Find causal edges connected to memories matching the query.
 *
 * Uses FTS5 full-text search (memory_fts table) instead of naive LIKE matching.
 * Falls back to LIKE only when the FTS5 table is not available.
 */
function queryCausalEdges(
  database: Database.Database,
  query: string,
  limit: number,
  specFolder?: string,
): Array<Record<string, unknown>> {
  const graphResults: Array<Record<string, unknown>> = [];

  try {
    // Prefer FTS5 matching for proper full-text search
    if (isFtsTableAvailable(database)) {
      graphResults.push(...queryCausalEdgesFTS5(database, query, limit));
    } else {
      // Fallback: LIKE matching when FTS5 table is unavailable
      graphResults.push(...queryCausalEdgesLikeFallback(database, query, limit));
    }

    // Hierarchy-aware fallback/augmentation for spec-scoped retrieval.
    if (typeof specFolder === 'string' && specFolder.trim().length > 0) {
      const hierarchyRows = queryHierarchyMemories(database, specFolder, Math.max(5, Math.ceil(limit / 2)));
      for (const row of hierarchyRows) {
        graphResults.push({
          id: row.id,
          score: Math.max(0, Math.min(1, row.relevance * 0.75)),
          source: 'graph' as const,
          sourceId: row.spec_folder,
          targetId: specFolder,
          relation: 'hierarchy',
          title: row.title ?? `Hierarchy memory ${row.id}`,
          specFolder: row.spec_folder,
        });
      }
    }

    // Deduplicate by memory id while preserving the highest score.
    const deduped = new Map<number | string, Record<string, unknown>>();
    for (const candidate of graphResults) {
      const existing = deduped.get(candidate.id as number | string);
      const existingScore = typeof existing?.score === 'number' ? existing.score : 0;
      const nextScore = typeof candidate.score === 'number' ? candidate.score : 0;
      if (!existing || nextScore > existingScore) {
        deduped.set(candidate.id as number | string, candidate);
      }
    }

    return Array.from(deduped.values())
      .sort((a, b) => ((typeof b.score === 'number' ? b.score : 0) - (typeof a.score === 'number' ? a.score : 0)))
      .slice(0, limit);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[graph-search-fn] Causal edge query failed: ${msg}`);
    return [];
  }
}

/**
 * FTS5-backed causal edge query. Finds memory IDs via the memory_fts
 * virtual table, then retrieves causal edges connected to those memories.
 * Scores incorporate both edge strength and FTS5 BM25 relevance.
 */
function queryCausalEdgesFTS5(
  database: Database.Database,
  query: string,
  limit: number
): Array<Record<string, unknown>> {
  const sanitized = sanitizeFTS5Query(query);
  if (!sanitized) return [];
  const oversampleLimit = limit * 3;

  // BM25-inspired weights: title(10) highest signal, content(5), triggers(2), folder(1)
  // Find memory IDs matching the query via FTS5, then join to causal_edges
  const rows = (database.prepare(`
    SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength,
           -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
    FROM causal_edges ce
    JOIN memory_fts ON (
      memory_fts.rowid = CAST(ce.source_id AS INTEGER)
      OR memory_fts.rowid = CAST(ce.target_id AS INTEGER)
    )
    WHERE memory_fts MATCH ?
    ORDER BY (ce.strength * (-bm25(memory_fts, 10.0, 5.0, 2.0, 1.0))) DESC
    LIMIT ?
  `) as Database.Statement).all(sanitized, oversampleLimit) as Array<CausalEdgeRow & { fts_score: number }>;

  const seen = new Set<string>();
  const dedupedRows = rows.filter((row) => {
    const key = `${row.source_id}-${row.target_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Return one candidate entry per memory node (source_id and target_id) with
  // Numeric IDs matching memory_index.id (INTEGER column) in the hybrid search
  // Pipeline (MMR reranking filters with typeof id === 'number').
  const candidates: Array<Record<string, unknown>> = [];
  for (const row of dedupedRows) {
    const edgeStrength = typeof row.strength === 'number'
      ? Math.min(1, Math.max(0, row.strength))
      : 0;
    const ftsScore = typeof row.fts_score === 'number' && Number.isFinite(row.fts_score)
      ? row.fts_score
      : 0;
    const score = edgeStrength * ftsScore;
    const title = `${row.source_id} -> ${row.target_id}`;

    const sourceNum = Number(row.source_id);
    if (!Number.isNaN(sourceNum)) {
      candidates.push({
        id: sourceNum,
        score,
        edgeStrength,
        ftsScore,
        source: 'graph' as const,
        title,
        relation: row.relation,
        sourceId: row.source_id,
        targetId: row.target_id,
      });
    }

    const targetNum = Number(row.target_id);
    if (!Number.isNaN(targetNum) && targetNum !== sourceNum) {
      candidates.push({
        id: targetNum,
        score,
        edgeStrength,
        ftsScore,
        source: 'graph' as const,
        title,
        relation: row.relation,
        sourceId: row.source_id,
        targetId: row.target_id,
      });
    }
  }
  return candidates.slice(0, limit);
}

/**
 * Legacy LIKE-based fallback when FTS5 table is unavailable.
 */
function queryCausalEdgesLikeFallback(
  database: Database.Database,
  query: string,
  limit: number
): Array<Record<string, unknown>> {
  const escaped = query.replace(/[%_]/g, '\\$&');
  const likeParam = `%${escaped}%`;
  const oversampleLimit = limit * 3;

  const rows = (database.prepare(`
    SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength
    FROM causal_edges ce
    WHERE ce.source_id IN (
      SELECT id
      FROM memory_index
      WHERE (content_text LIKE ? ESCAPE '\\' OR title LIKE ? ESCAPE '\\')
    )
       OR ce.target_id IN (
      SELECT id
      FROM memory_index
      WHERE (content_text LIKE ? ESCAPE '\\' OR title LIKE ? ESCAPE '\\')
    )
    ORDER BY ce.strength DESC
    LIMIT ?
  `) as Database.Statement).all(
    likeParam,
    likeParam,
    likeParam,
    likeParam,
    oversampleLimit,
  ) as CausalEdgeRow[];

  // Return one candidate entry per memory node (source_id and target_id) with
  // Numeric IDs matching memory_index.id (INTEGER column).
  const candidates: Array<Record<string, unknown>> = [];
  for (const row of rows) {
    const score = typeof row.strength === 'number' ? Math.min(1, Math.max(0, row.strength)) : 0;
    const title = `${row.source_id} -> ${row.target_id}`;

    const sourceNum = Number(row.source_id);
    if (!Number.isNaN(sourceNum)) {
      candidates.push({
        id: sourceNum,
        score,
        source: 'graph' as const,
        title,
        relation: row.relation,
        sourceId: row.source_id,
        targetId: row.target_id,
      });
    }

    const targetNum = Number(row.target_id);
    if (!Number.isNaN(targetNum) && targetNum !== sourceNum) {
      candidates.push({
        id: targetNum,
        score,
        source: 'graph' as const,
        title,
        relation: row.relation,
        sourceId: row.source_id,
        targetId: row.target_id,
      });
    }
  }
  return candidates;
}

// ───────────────────────────────────────────────────────────────
// 4. TYPED-DEGREE COMPUTATION

// ───────────────────────────────────────────────────────────────
/**
 * In-memory degree cache. Keys are stringified memory IDs.
 * Invalidated via clearDegreeCache() on causal edge mutations.
 *
 * A4-P2-1: Edge materialization optimization — investigated and found adequate.
 * Degree scores are cached per-session via this Map and invalidated on edge
 * mutations (insert/update/delete) through clearDegreeCache() called from
 * causal-edges.ts.  Community detection in community-detection.ts uses a
 * separate debounce (lastEdgeCount + computedThisSession) to skip
 * re-computation when the graph is unchanged.  No additional optimization
 * is needed at this time.
 *
 * Cache warmup strategy:
 *   - The cache is populated lazily: entries are written on first access via
 *     computeDegreeScores() as each memory ID is encountered during a search.
 *   - Cold-start (empty cache): every ID in a batch triggers a DB query
 *     (computeTypedDegree SQL). The global max degree is recomputed per-batch
 *     since it is not cached separately.
 *   - Subsequent requests: hits are served from the Map without touching the DB.
 *   - Invalidation: clearDegreeCache() wipes all entries on causal edge
 *     insert/update/delete so the next batch recomputes from current DB state.
 */
// H20 FIX: Scope degree cache per database instance to prevent cross-DB score leaks
let degreeCachePerDb = new WeakMap<Database.Database, Map<string, number>>();
function getDegreeCacheForDb(database: Database.Database): Map<string, number> {
  let cache = degreeCachePerDb.get(database);
  if (!cache) {
    cache = new Map<string, number>();
    degreeCachePerDb.set(database, cache);
  }
  return cache;
}

/**
 * Compute the raw typed-weighted degree for a single memory node.
 *
 * Counts edges where the memory appears as source OR target,
 * weighting each edge by its relation type weight * edge strength.
 *
 * Formula: typed_degree(node) = SUM(weight_t * strength) for all connected edges
 */
function computeTypedDegree(
  database: Database.Database,
  memoryId: string | number
): number {
  const id = String(memoryId);

  // Single SQL: UNION ALL of source and target participation
  const rows = (database.prepare(`
    SELECT relation, strength FROM causal_edges WHERE source_id = ?
    UNION ALL
    SELECT relation, strength FROM causal_edges WHERE target_id = ?
  `) as Database.Statement).all(id, id) as Array<{ relation: string; strength: number }>;

  let total = 0;
  for (const row of rows) {
    const weight = EDGE_TYPE_WEIGHTS[row.relation] ?? 0;
    const strength = typeof row.strength === 'number' ? row.strength : 1.0;
    total += weight * strength;
  }

  // Apply hard cap before normalization
  return Math.min(total, MAX_TOTAL_DEGREE);
}

/**
 * Normalize a raw typed degree into a bounded boost score.
 *
 * Uses logarithmic scaling: log(1 + raw) / log(1 + max)
 * Then caps at DEGREE_BOOST_CAP (0.15).
 *
 * @param rawDegree - The raw typed-weighted degree
 * @param maxDegree - The maximum observed typed degree (for normalization base)
 * @returns A score in [0, DEGREE_BOOST_CAP]
 */
function normalizeDegreeToBoostedScore(
  rawDegree: number,
  maxDegree: number
): number {
  if (rawDegree <= 0 || maxDegree <= 0) return 0;
  const normalized = Math.log(1 + rawDegree) / Math.log(1 + maxDegree);
  return Math.min(normalized * DEGREE_BOOST_CAP, DEGREE_BOOST_CAP);
}

/**
 * Compute the global maximum typed degree across all memories in the database.
 * Used as the normalization denominator.
 *
 * Falls back to DEFAULT_MAX_TYPED_DEGREE if no edges exist.
 */
function computeMaxTypedDegree(database: Database.Database): number {
  try {
    const statement = database.prepare(`
      SELECT MAX(typed_degree) AS max_degree FROM (
        SELECT DISTINCT node_id, typed_degree FROM (
          SELECT
            node_id,
            MIN(SUM(
              CASE relation
                WHEN 'caused' THEN 1.0
                WHEN 'derived_from' THEN 0.9
                WHEN 'enabled' THEN 0.8
                WHEN 'contradicts' THEN 0.7
                WHEN 'supersedes' THEN 0.6
                WHEN 'supports' THEN 0.5
                ELSE 0
              END * COALESCE(strength, 1.0)
            ), 50) AS typed_degree
          FROM (
            SELECT source_id AS node_id, relation, strength FROM causal_edges
            UNION
            ALL
            SELECT target_id AS node_id, relation, strength FROM causal_edges
          )
          GROUP BY node_id
        )
      )
    `) as Database.Statement;

    if (typeof statement.get === 'function') {
      const row = statement.get() as { max_degree: number | null } | undefined;
      return row?.max_degree ?? DEFAULT_MAX_TYPED_DEGREE;
    }

    // Test doubles may only expose .all() for the legacy distinct-node query shape.
    const rows = typeof statement.all === 'function'
      ? statement.all() as Array<{ node_id: string }>
      : [];

    if (rows.length === 0) return DEFAULT_MAX_TYPED_DEGREE;

    let maxDegree = 0;
    for (const row of rows) {
      const degree = computeTypedDegree(database, row.node_id);
      if (degree > maxDegree) maxDegree = degree;
    }

    return maxDegree > 0 ? maxDegree : DEFAULT_MAX_TYPED_DEGREE;
  } catch (_err: unknown) { // Subgraph computation failure — return default weights
    return DEFAULT_MAX_TYPED_DEGREE;
  }
}

/**
 * Batch compute degree boost scores for multiple memory IDs.
 *
 * - Excludes constitutional memories (returns 0 to prevent artificial inflation)
 * - Uses in-memory cache for repeated lookups
 * - Computes global max once per batch for normalization
 *
 * @param database  - An open better-sqlite3 Database instance
 * @param memoryIds - Array of memory IDs to compute scores for
 * @returns Map of memoryId (string) to normalized boost score in [0, 0.15]
 */
function computeDegreeScores(
  database: Database.Database,
  memoryIds: Array<string | number>
): Map<string, number> {
  const results = new Map<string, number>();
  if (memoryIds.length === 0) return results;

  // Identify constitutional memories (excluded from degree boosting)
  const constitutionalIds = new Set<string>();
  try {
    const placeholders = memoryIds.map(() => '?').join(',');
    const constitutionalRows = (database.prepare(
      `SELECT id FROM memory_index WHERE id IN (${placeholders}) AND importance_tier = 'constitutional'`
    ) as Database.Statement).all(...memoryIds.map(String)) as Array<{ id: number | string }>;
    for (const row of constitutionalRows) {
      constitutionalIds.add(String(row.id));
    }
  } catch (_err: unknown) {
    // Fail closed — if we can't identify constitutional IDs, zero all scores
    console.warn('[graph-search-fn] Constitutional exclusion lookup failed; returning zero scores for safety');
    for (const id of memoryIds) {
      results.set(String(id), 0);
    }
    return results;
  }

  // Compute global max for normalization (not cached — recomputed per batch)
  const maxDegree = computeMaxTypedDegree(database);

  for (const id of memoryIds) {
    const key = String(id);

    // Constitutional memories always get 0
    if (constitutionalIds.has(key)) {
      results.set(key, 0);
      continue;
    }

    // Check cache — H20 FIX: use per-DB cache
    const dbDegreeCache = getDegreeCacheForDb(database);
    if (dbDegreeCache.has(key)) {
      results.set(key, dbDegreeCache.get(key)!);
      continue;
    }

    // Compute, normalize, cache
    const rawDegree = computeTypedDegree(database, key);
    const boostedScore = normalizeDegreeToBoostedScore(rawDegree, maxDegree);
    dbDegreeCache.set(key, boostedScore);
    results.set(key, boostedScore);
  }

  return results;
}

/**
 * Clear the in-memory degree cache.
 * Call this on causal edge mutations (insert, update, delete)
 * to ensure stale scores are not served.
 */
// H20 FIX: Clear degree cache — clears for all DB instances
function clearDegreeCache(): void {
  degreeCachePerDb = new WeakMap<Database.Database, Map<string, number>>();
}

/** Clear degree cache for a specific database instance. */
function clearDegreeCacheForDb(database: Database.Database): void {
  degreeCachePerDb.delete(database);
}

// ───────────────────────────────────────────────────────────────
// 5. FACTORY FUNCTION

// ───────────────────────────────────────────────────────────────
/**
 * Creates a graph search function backed by causal_edges only.
 *
 * @param database  - An open better-sqlite3 Database instance
 * @returns A GraphSearchFn over causal edges
 */
function createUnifiedGraphSearchFn(
  database: Database.Database,
  _legacyArg?: string
): GraphSearchFn {
  return function unifiedGraphSearch(
    query: string,
    options: Record<string, unknown>
  ): Array<Record<string, unknown>> {
    const limit = typeof options['limit'] === 'number' ? options['limit'] : 20;

    const specFolder = typeof options['specFolder'] === 'string' ? options['specFolder'] : undefined;

    return queryCausalEdges(database, query, limit, specFolder)
      .map((result) => ({
        ...result,
        score: (typeof result['score'] === 'number' ? result['score'] : 0),
      }))
      .sort((a, b) => {
        const scoreA = typeof a['score'] === 'number' ? a['score'] : 0;
        const scoreB = typeof b['score'] === 'number' ? b['score'] : 0;
        return scoreB - scoreA;
      });
  };
}

// ───────────────────────────────────────────────────────────────
// 6. EXPORTS

// ───────────────────────────────────────────────────────────────
export {
  createUnifiedGraphSearchFn,
  // Typed-degree computation (R4 5th RRF channel)
  EDGE_TYPE_WEIGHTS,
  DEFAULT_MAX_TYPED_DEGREE,
  MAX_TOTAL_DEGREE,
  DEGREE_BOOST_CAP,
  DEGREE_CHANNEL_WEIGHT,
  computeTypedDegree,
  normalizeDegreeToBoostedScore,
  computeMaxTypedDegree,
  computeDegreeScores,
  clearDegreeCache,
  clearDegreeCacheForDb,
};
