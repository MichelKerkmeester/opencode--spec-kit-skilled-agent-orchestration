// ───────────────────────────────────────────────────────────────
// MODULE: Graph Signals
// ───────────────────────────────────────────────────────────────
// Feature catalog: Typed-weighted degree channel
// Active runtime feature — default ON via SPECKIT_GRAPH_SIGNALS (set false to disable)
// ───────────────────────────────────────────────────────────────
// 1. IMPORTS

// ───────────────────────────────────────────────────────────────
import type Database from 'better-sqlite3';
import {
  STAGE2_GRAPH_BONUS_CAP,
  clampStage2GraphBonus,
} from '../search/pipeline/ranking-contract.js';

// ───────────────────────────────────────────────────────────────
// 2. SESSION CACHE

// ───────────────────────────────────────────────────────────────
/** Maximum number of entries allowed in each session-scoped cache. */
const CACHE_MAX_SIZE = 10000;

/** Session-scoped cache for momentum scores (memoryId -> momentum). */
const momentumCache = new Map<number, number>();

/** Session-scoped cache for causal depth scores (memoryId -> normalized depth). */
const depthCache = new Map<number, number>();

const GRAPH_WALK_SECOND_HOP_WEIGHT = 0.5;

type GraphWalkRolloutState = 'off' | 'trace_only' | 'bounded_runtime';

interface GraphWalkMetrics {
  raw: number;
  normalized: number;
}

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

// 3. DEGREE SNAPSHOTS (N2a support)
/**
 * Record the current degree count for every memory node that participates
 * in at least one causal edge. Writes into the `degree_snapshots` table
 * with today's date, using INSERT OR REPLACE to allow idempotent re-runs.
 *
 * @returns The number of nodes snapshotted.
 */
export function snapshotDegrees(db: Database.Database): { snapshotted: number } {
  try {
    // Collect all unique memory node IDs and their degree counts from causal_edges.
    // Source_id and target_id are TEXT columns, so we cast to ensure numeric comparison.
    const rows = db.prepare(`
      SELECT node_id, COUNT(*) AS degree_count
      FROM (
        SELECT source_id AS node_id FROM causal_edges
        UNION ALL
        SELECT target_id AS node_id
        FROM causal_edges
        WHERE target_id != source_id
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

// 4. MOMENTUM (N2a)
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

// 5. CAUSAL DEPTH (N2b)
/**
 * Build the full adjacency list from causal_edges, keyed by node ID (as number).
 * Returns forward adjacency, the full node set, and in-degree counts.
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

function buildUndirectedAdjacency(adjacency: Map<number, number[]>): Map<number, Set<number>> {
  const undirected = new Map<number, Set<number>>();

  const ensureNode = (nodeId: number): Set<number> => {
    const existing = undirected.get(nodeId);
    if (existing) return existing;
    const created = new Set<number>();
    undirected.set(nodeId, created);
    return created;
  };

  for (const [source, targets] of adjacency.entries()) {
    const sourceNeighbors = ensureNode(source);
    for (const target of targets) {
      sourceNeighbors.add(target);
      ensureNode(target).add(source);
    }
  }

  return undirected;
}

function computeGraphWalkMetrics(
  db: Database.Database,
  memoryIds: number[],
): Map<number, GraphWalkMetrics> {
  const uniqueIds = Array.from(new Set(memoryIds.filter((memoryId) => Number.isInteger(memoryId))));
  const scores = new Map<number, GraphWalkMetrics>(
    uniqueIds.map((memoryId) => [memoryId, { raw: 0, normalized: 0 }])
  );

  if (uniqueIds.length < 2) {
    return scores;
  }

  const { adjacency } = buildAdjacencyList(db);
  const graph = buildUndirectedAdjacency(adjacency);
  const candidateSet = new Set(uniqueIds);
  const candidateSpan = uniqueIds.length - 1;

  for (const memoryId of uniqueIds) {
    const directNeighbors = graph.get(memoryId) ?? new Set<number>();
    let directHits = 0;
    const secondHopHits = new Set<number>();

    for (const neighbor of directNeighbors) {
      if (neighbor !== memoryId && candidateSet.has(neighbor)) {
        directHits += 1;
      }

      const neighborAdjacency = graph.get(neighbor);
      if (!neighborAdjacency) {
        continue;
      }

      for (const secondHop of neighborAdjacency) {
        if (
          secondHop === memoryId
          || !candidateSet.has(secondHop)
          || directNeighbors.has(secondHop)
        ) {
          continue;
        }
        secondHopHits.add(secondHop);
      }
    }

    const weightedReach = directHits + (secondHopHits.size * GRAPH_WALK_SECOND_HOP_WEIGHT);
    const normalizedReach = clamp(weightedReach / candidateSpan, 0, 1);
    scores.set(memoryId, { raw: weightedReach, normalized: normalizedReach });
  }

  return scores;
}

function computeGraphWalkScores(
  db: Database.Database,
  memoryIds: number[],
): Map<number, number> {
  const metrics = computeGraphWalkMetrics(db, memoryIds);
  return new Map(Array.from(metrics.entries()).map(([memoryId, value]) => [memoryId, value.normalized]));
}

type StronglyConnectedComponents = {
  componentByNode: Map<number, number>;
  components: number[][];
};

/**
 * Collapse cyclic subgraphs into strongly connected components so we can
 * compute longest-path depth on the resulting DAG without revisit drift.
 */
function buildStronglyConnectedComponents(
  adjacency: Map<number, number[]>,
  allNodes: Set<number>,
): StronglyConnectedComponents {
  const componentByNode = new Map<number, number>();
  const components: number[][] = [];
  const indices = new Map<number, number>();
  const lowLinks = new Map<number, number>();
  const stack: number[] = [];
  const inStack = new Set<number>();
  let nextIndex = 0;

  function strongConnect(nodeId: number): void {
    indices.set(nodeId, nextIndex);
    lowLinks.set(nodeId, nextIndex);
    nextIndex++;

    stack.push(nodeId);
    inStack.add(nodeId);

    for (const neighbor of adjacency.get(nodeId) ?? []) {
      if (!indices.has(neighbor)) {
        strongConnect(neighbor);
        lowLinks.set(
          nodeId,
          Math.min(lowLinks.get(nodeId) ?? 0, lowLinks.get(neighbor) ?? 0),
        );
      } else if (inStack.has(neighbor)) {
        lowLinks.set(
          nodeId,
          Math.min(lowLinks.get(nodeId) ?? 0, indices.get(neighbor) ?? 0),
        );
      }
    }

    if ((lowLinks.get(nodeId) ?? -1) !== (indices.get(nodeId) ?? -2)) {
      return;
    }

    const componentId = components.length;
    const members: number[] = [];

    while (stack.length > 0) {
      const member = stack.pop();
      if (member === undefined) break;

      inStack.delete(member);
      componentByNode.set(member, componentId);
      members.push(member);

      if (member === nodeId) break;
    }

    components.push(members);
  }

  for (const nodeId of allNodes) {
    if (!indices.has(nodeId)) {
      strongConnect(nodeId);
    }
  }

  return { componentByNode, components };
}

/**
 * Compute longest-path depths on the DAG formed by strongly connected
 * components. Nodes within the same cycle share one bounded depth layer.
 */
function computeComponentDepths(
  adjacency: Map<number, number[]>,
  allNodes: Set<number>,
): { depthByNode: Map<number, number>; maxDepth: number } {
  const { componentByNode, components } = buildStronglyConnectedComponents(adjacency, allNodes);
  const componentAdjacency = new Map<number, Set<number>>();
  const componentInDegree = new Map<number, number>();

  for (let componentId = 0; componentId < components.length; componentId++) {
    componentAdjacency.set(componentId, new Set<number>());
    componentInDegree.set(componentId, 0);
  }

  for (const [sourceId, neighbors] of adjacency.entries()) {
    const sourceComponent = componentByNode.get(sourceId);
    if (sourceComponent === undefined) continue;

    const componentNeighbors = componentAdjacency.get(sourceComponent);
    if (!componentNeighbors) continue;

    for (const neighborId of neighbors) {
      const targetComponent = componentByNode.get(neighborId);
      if (targetComponent === undefined || targetComponent === sourceComponent || componentNeighbors.has(targetComponent)) {
        continue;
      }

      componentNeighbors.add(targetComponent);
      componentInDegree.set(targetComponent, (componentInDegree.get(targetComponent) ?? 0) + 1);
    }
  }

  const remainingInDegree = new Map(componentInDegree);
  const componentDepths = new Map<number, number>();
  const queue: number[] = [];

  for (let componentId = 0; componentId < components.length; componentId++) {
    if ((remainingInDegree.get(componentId) ?? 0) === 0) {
      componentDepths.set(componentId, 0);
      queue.push(componentId);
    }
  }

  let maxDepth = 0;
  let queueIndex = 0;

  while (queueIndex < queue.length) {
    const componentId = queue[queueIndex++];
    const componentDepth = componentDepths.get(componentId) ?? 0;

    for (const neighborComponent of componentAdjacency.get(componentId) ?? []) {
      const candidateDepth = componentDepth + 1;
      if (candidateDepth > (componentDepths.get(neighborComponent) ?? 0)) {
        componentDepths.set(neighborComponent, candidateDepth);
        if (candidateDepth > maxDepth) {
          maxDepth = candidateDepth;
        }
      }

      const nextInDegree = (remainingInDegree.get(neighborComponent) ?? 0) - 1;
      remainingInDegree.set(neighborComponent, nextInDegree);
      if (nextInDegree === 0) {
        queue.push(neighborComponent);
      }
    }
  }

  const depthByNode = new Map<number, number>();
  for (const nodeId of allNodes) {
    const componentId = componentByNode.get(nodeId);
    if (componentId === undefined) continue;
    depthByNode.set(nodeId, componentDepths.get(componentId) ?? 0);
  }

  return { depthByNode, maxDepth };
}

/**
 * Batch-compute causal depth scores for a set of memory IDs.
 * Uses the session cache to avoid redundant graph traversals within a session.
 *
 * Optimisation: when multiple IDs are requested, we build the adjacency list
 * and compute component depths once, then cache all results.
 *
 * Shortcut edges should not collapse deeper causal chains to the nearest-root
 * distance. We therefore compute longest-path depth on the DAG of strongly
 * connected components, which also keeps cyclic subgraphs bounded.
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
    const { adjacency, allNodes } = buildAdjacencyList(db);

    if (allNodes.size === 0) {
      for (const id of uncached) {
        depthCache.set(id, 0);
        results.set(id, 0);
      }
      return results;
    }

    const { depthByNode, maxDepth } = computeComponentDepths(adjacency, allNodes);

    // Normalize and cache all uncached IDs
    for (const id of uncached) {
      let normalizedDepth = 0;
      if (maxDepth > 0 && depthByNode.has(id)) {
        normalizedDepth = (depthByNode.get(id) ?? 0) / maxDepth;
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

// ───────────────────────────────────────────────────────────────
// 3. COMBINED APPLICATION

// ───────────────────────────────────────────────────────────────
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
  options: { rolloutState?: GraphWalkRolloutState } = {},
): Array<{ id: number; score?: number; [key: string]: unknown }> {
  if (!rows || rows.length === 0) return rows;

  try {
    const ids = rows.map((row) => row.id);
    const momentumScores = computeMomentumScores(db, ids);
    const depthScores = computeCausalDepthScores(db, ids);
    const graphWalkScores = computeGraphWalkMetrics(db, ids);
    const rolloutState = options.rolloutState ?? 'bounded_runtime';

    return rows.map((row) => {
      const baseScore = typeof row.score === 'number' && Number.isFinite(row.score) ? row.score : 0;
      const momentum = momentumScores.get(row.id) ?? 0;
      const depth = depthScores.get(row.id) ?? 0;
      const graphWalk = graphWalkScores.get(row.id) ?? { raw: 0, normalized: 0 };

      // Momentum bonus: up to +0.05
      const momentumBonus = clamp(momentum * 0.01, 0, 0.05);
      // Depth bonus: up to +0.05
      const depthBonus = depth * 0.05;
      // Graph-walk bonus: bounded local connectivity bonus across candidate rows
      const unclampedGraphWalkBonus = graphWalk.normalized * STAGE2_GRAPH_BONUS_CAP;
      const graphWalkBonus = rolloutState === 'bounded_runtime'
        ? clampStage2GraphBonus(unclampedGraphWalkBonus)
        : 0;
      const capApplied = rolloutState === 'bounded_runtime'
        && graphWalk.raw > 0
        && graphWalk.normalized >= 1;

      const adjustedScore = baseScore + momentumBonus + depthBonus + graphWalkBonus;
      const existingContribution = (row.graphContribution && typeof row.graphContribution === 'object')
        ? row.graphContribution as Record<string, unknown>
        : {};

      return {
        ...row,
        score: adjustedScore,
        graphContribution: {
          ...existingContribution,
          raw: graphWalk.raw,
          normalized: graphWalk.normalized,
          appliedBonus: graphWalkBonus,
          capApplied,
          rolloutState,
        },
      };
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[graph-signals] applyGraphSignals failed: ${message}`);
    return rows;
  }
}

// ───────────────────────────────────────────────────────────────
// 4. TEST EXPORTS

// ───────────────────────────────────────────────────────────────
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
  buildUndirectedAdjacency,
  computeGraphWalkMetrics,
  computeGraphWalkScores,
  clamp,
  momentumCache,
  depthCache,
};
