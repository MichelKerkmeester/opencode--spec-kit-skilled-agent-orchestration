// ---------------------------------------------------------------
// MODULE: Graph Signals
// ---------------------------------------------------------------
// Deferred feature — gated via SPECKIT_GRAPH_SIGNALS
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. IMPORTS
// ---------------------------------------------------------------------------

import type Database from 'better-sqlite3';

// ---------------------------------------------------------------------------
// 2. SESSION CACHE
// ---------------------------------------------------------------------------

/** Maximum number of entries allowed in each session-scoped cache. */
const CACHE_MAX_SIZE = 10000;

/** Session-scoped cache for momentum scores (memoryId -> momentum). */
const momentumCache = new Map<number, number>();

/** Session-scoped cache for causal depth scores (memoryId -> normalized depth). */
const depthCache = new Map<number, number>();

/**
 * Evict entries from a cache when it exceeds the size bound.
 * Clears the entire cache when the limit is exceeded, since Map
 * iteration order is insertion order and partial eviction of
 * "oldest" entries would require iterating anyway.
 */
function enforceCacheBound(cache: Map<number, number>): void {
  if (cache.size > CACHE_MAX_SIZE) {
    cache.clear();
  }
}

/**
 * Clear both session-scoped caches. Call at session boundaries or when
 * the causal graph has been mutated.
 */
export function clearGraphSignalsCache(): void {
  momentumCache.clear();
  depthCache.clear();
}

// ---------------------------------------------------------------------------
// 3. DEGREE SNAPSHOTS (N2a support)
// ---------------------------------------------------------------------------

/**
 * Record the current degree count for every memory node that participates
 * in at least one causal edge. Writes into the `degree_snapshots` table
 * with today's date, using INSERT OR REPLACE to allow idempotent re-runs.
 *
 * @returns The number of nodes snapshotted.
 */
export function snapshotDegrees(db: Database.Database): { snapshotted: number } {
  try {
    // AI-GUARD: Collect all unique memory node IDs and their degree counts from causal_edges.
    // source_id and target_id are TEXT columns, so we cast to ensure numeric comparison.
    const rows = db.prepare(`
      SELECT node_id, COUNT(*) AS degree_count
      FROM (
        SELECT source_id AS node_id FROM causal_edges
        UNION ALL
        SELECT target_id AS node_id FROM causal_edges
      )
      GROUP BY node_id
    `).all() as Array<{ node_id: string; degree_count: number }>;

    if (rows.length === 0) {
      return { snapshotted: 0 };
    }

    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO degree_snapshots (memory_id, degree_count, snapshot_date)
      VALUES (?, ?, date('now'))
    `);

    const insertMany = db.transaction((entries: Array<{ node_id: string; degree_count: number }>) => {
      let count = 0;
      for (const entry of entries) {
        const memoryId = Number(entry.node_id);
        if (!Number.isInteger(memoryId)) continue;
        insertStmt.run(memoryId, entry.degree_count);
        count++;
      }
      return count;
    });

    const snapshotted = insertMany(rows);
    return { snapshotted };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[graph-signals] snapshotDegrees failed: ${message}`);
    return { snapshotted: 0 };
  }
}

// ---------------------------------------------------------------------------
// 4. MOMENTUM (N2a)
// ---------------------------------------------------------------------------

/**
 * Get the current degree of a memory node (total edges where node appears
 * as source or target in causal_edges).
 */
function getCurrentDegree(db: Database.Database, memoryId: number): number {
  try {
    const idStr = String(memoryId);
    const row = db.prepare(`
      SELECT COUNT(*) AS degree
      FROM causal_edges
      WHERE source_id = ? OR target_id = ?
    `).get(idStr, idStr) as { degree: number } | undefined;
    return row?.degree ?? 0;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[graph-signals] getCurrentDegree failed for ${memoryId}: ${message}`);
    return 0;
  }
}

/**
 * Get the degree of a memory node from 7 days ago, as recorded in the
 * degree_snapshots table.
 */
function getPastDegree(db: Database.Database, memoryId: number): number | null {
  try {
    const row = db.prepare(`
      SELECT degree_count
      FROM degree_snapshots
      WHERE memory_id = ? AND snapshot_date = date('now', '-7 days')
    `).get(memoryId) as { degree_count: number } | undefined;
    return row?.degree_count ?? null;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[graph-signals] getPastDegree failed for ${memoryId}: ${message}`);
    return null;
  }
}

/**
 * Compute momentum for a single memory node.
 * Momentum = current degree - degree 7 days ago.
 * A positive value means the node is gaining connections; negative means losing them.
 * Returns 0 if no historical data is available.
 */
export function computeMomentum(db: Database.Database, memoryId: number): number {
  try {
    const currentDegree = getCurrentDegree(db, memoryId);
    const pastDegree = getPastDegree(db, memoryId);
    if (pastDegree === null) return 0;
    return currentDegree - pastDegree;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[graph-signals] computeMomentum failed for ${memoryId}: ${message}`);
    return 0;
  }
}

/**
 * Batch-compute momentum scores for a set of memory IDs.
 * Uses the session cache to avoid redundant DB queries within a session.
 */
export function computeMomentumScores(db: Database.Database, memoryIds: number[]): Map<number, number> {
  const results = new Map<number, number>();

  for (const memoryId of memoryIds) {
    // Check session cache first
    const cached = momentumCache.get(memoryId);
    if (cached !== undefined) {
      results.set(memoryId, cached);
      continue;
    }

    const momentum = computeMomentum(db, memoryId);
    momentumCache.set(memoryId, momentum);
    results.set(memoryId, momentum);
  }

  // Enforce cache size bound after batch insert
  enforceCacheBound(momentumCache);

  return results;
}

// ---------------------------------------------------------------------------
// 5. CAUSAL DEPTH (N2b)
// ---------------------------------------------------------------------------

/**
 * Build the full adjacency list from causal_edges, keyed by node ID (as number).
 * Returns both forward adjacency (for BFS) and a set of all node IDs.
 */
function buildAdjacencyList(db: Database.Database): { adjacency: Map<number, number[]>; allNodes: Set<number>; inDegree: Map<number, number> } {
  const adjacency = new Map<number, number[]>();
  const allNodes = new Set<number>();
  const inDegree = new Map<number, number>();

  try {
    const edges = db.prepare(`
      SELECT source_id, target_id FROM causal_edges
    `).all() as Array<{ source_id: string; target_id: string }>;

    for (const edge of edges) {
      const source = Number(edge.source_id);
      const target = Number(edge.target_id);
      if (!Number.isInteger(source) || !Number.isInteger(target)) continue;

      allNodes.add(source);
      allNodes.add(target);

      // Forward adjacency: source -> target
      if (!adjacency.has(source)) adjacency.set(source, []);
      const sourceTargets = adjacency.get(source);
      if (!sourceTargets) continue;
      sourceTargets.push(target);

      // Track in-degree for root detection
      inDegree.set(target, (inDegree.get(target) ?? 0) + 1);
      if (!inDegree.has(source)) inDegree.set(source, 0);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[graph-signals] buildAdjacencyList failed: ${message}`);
  }

  return { adjacency, allNodes, inDegree };
}

/**
 * Batch-compute causal depth scores for a set of memory IDs.
 * Uses the session cache to avoid redundant graph traversals within a session.
 *
 * Optimisation: when multiple IDs are requested, we build the adjacency list
 * and run BFS once, then cache all results.
 *
 * Uses index-based queue traversal instead of queue.shift() to avoid
 * O(n) per-dequeue cost.
 */
export function computeCausalDepthScores(db: Database.Database, memoryIds: number[]): Map<number, number> {
  const results = new Map<number, number>();

  // Separate cached from uncached
  const uncached: number[] = [];
  for (const memoryId of memoryIds) {
    const cached = depthCache.get(memoryId);
    if (cached !== undefined) {
      results.set(memoryId, cached);
    } else {
      uncached.push(memoryId);
    }
  }

  if (uncached.length === 0) return results;

  // Build graph once for all uncached IDs
  try {
    const { adjacency, allNodes, inDegree } = buildAdjacencyList(db);

    if (allNodes.size === 0) {
      for (const id of uncached) {
        depthCache.set(id, 0);
        results.set(id, 0);
      }
      return results;
    }

    // Find root nodes
    const roots: number[] = [];
    for (const nodeId of allNodes) {
      if ((inDegree.get(nodeId) ?? 0) === 0) {
        roots.push(nodeId);
      }
    }

    if (roots.length === 0) {
      for (const id of uncached) {
        depthCache.set(id, 0);
        results.set(id, 0);
      }
      return results;
    }

    // BFS from all roots simultaneously — index-based to avoid O(n) shift()
    const depthMap = new Map<number, number>();
    const queue: Array<{ nodeId: number; depth: number }> = [];

    for (const root of roots) {
      depthMap.set(root, 0);
      queue.push({ nodeId: root, depth: 0 });
    }

    let maxDepth = 0;
    const maxTraversalDepth = 1000;
    let queueIdx = 0;

    while (queueIdx < queue.length) {
      const { nodeId, depth } = queue[queueIdx++];
      const neighbors = adjacency.get(nodeId) ?? [];

      for (const neighbor of neighbors) {
        const neighborDepth = depth + 1;
        if (
          neighborDepth <= maxTraversalDepth &&
          (!depthMap.has(neighbor) || neighborDepth > depthMap.get(neighbor)!)
        ) {
          depthMap.set(neighbor, neighborDepth);
          if (neighborDepth > maxDepth) maxDepth = neighborDepth;
          queue.push({ nodeId: neighbor, depth: neighborDepth });
        }
      }
    }

    // Normalize and cache all uncached IDs
    for (const id of uncached) {
      let normalizedDepth = 0;
      if (maxDepth > 0 && depthMap.has(id)) {
        normalizedDepth = (depthMap.get(id) ?? 0) / maxDepth;
      }
      depthCache.set(id, normalizedDepth);
      results.set(id, normalizedDepth);
    }

    // Enforce cache size bound after batch insert
    enforceCacheBound(depthCache);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[graph-signals] computeCausalDepthScores failed: ${message}`);
    // Fill uncached with 0 on error
    for (const id of uncached) {
      depthCache.set(id, 0);
      results.set(id, 0);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// 6. COMBINED APPLICATION
// ---------------------------------------------------------------------------

/**
 * Clamp a value to [min, max].
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Apply graph signal adjustments to scored search result rows.
 *
 * For each row:
 * - Momentum bonus: clamp(momentum * 0.01, 0, 0.05) — rewards nodes gaining connections
 * - Depth bonus: normalizedDepth * 0.05 — rewards structurally deep nodes
 *
 * Both bonuses are additive to the existing score.
 *
 * @param rows - Array of result rows with at least `id` and optional `score`.
 * @param db   - Database instance for graph queries.
 * @returns The same rows with adjusted scores.
 */
export function applyGraphSignals(
  rows: Array<{ id: number; score?: number; [key: string]: unknown }>,
  db: Database.Database,
): Array<{ id: number; score?: number; [key: string]: unknown }> {
  if (!rows || rows.length === 0) return rows;

  try {
    const ids = rows.map((row) => row.id);
    const momentumScores = computeMomentumScores(db, ids);
    const depthScores = computeCausalDepthScores(db, ids);

    return rows.map((row) => {
      const baseScore = typeof row.score === 'number' && Number.isFinite(row.score) ? row.score : 0;
      const momentum = momentumScores.get(row.id) ?? 0;
      const depth = depthScores.get(row.id) ?? 0;

      // Momentum bonus: up to +0.05
      const momentumBonus = clamp(momentum * 0.01, 0, 0.05);
      // Depth bonus: up to +0.05
      const depthBonus = depth * 0.05;

      const adjustedScore = baseScore + momentumBonus + depthBonus;

      return {
        ...row,
        score: adjustedScore,
      };
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[graph-signals] applyGraphSignals failed: ${message}`);
    return rows;
  }
}

// ---------------------------------------------------------------------------
// 7. TEST EXPORTS
// ---------------------------------------------------------------------------

/**
 * Internal functions exposed for unit testing.
 * These are NOT part of the public API and may change without notice.
 * Access only from `*.test.ts` / `*.vitest.ts` files.
 *
 * @internal
 */
export const __testables = {
  getCurrentDegree,
  getPastDegree,
  buildAdjacencyList,
  clamp,
  momentumCache,
  depthCache,
};
