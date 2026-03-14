// ───────────────────────────────────────────────────────────────
// MODULE: Community Detection
// ───────────────────────────────────────────────────────────────
// Deferred feature — gated via SPECKIT_COMMUNITY_DETECTION
// ───────────────────────────────────────────────────────────────
// 1. IMPORTS

// ───────────────────────────────────────────────────────────────
import type Database from "better-sqlite3";

// Feature catalog: Community detection


// ───────────────────────────────────────────────────────────────
// 2. TYPES

// ───────────────────────────────────────────────────────────────
/** Adjacency list: node ID (string) -> set of neighbor node IDs */
type AdjacencyList = Map<string, Set<string>>;

// ───────────────────────────────────────────────────────────────
// 3. CONSTANTS

// ───────────────────────────────────────────────────────────────
/**
 * Community co-retrieval boost factor — 0.3 balances surfacing
 * related community members without overwhelming the primary result set.
 * Lower values (e.g. 0.1) make community neighbours nearly invisible;
 * higher values (e.g. 0.5+) risk promoting loosely-related memories above
 * stronger direct matches.  0.3 was chosen empirically during N2c
 * development as the sweet-spot that keeps community signals additive
 * rather than dominant.  (A4-P2-3)
 */
const COMMUNITY_EDGE_WEIGHT_THRESHOLD = 0.3;

// ───────────────────────────────────────────────────────────────
// 4. MODULE-LEVEL DEBOUNCE STATE

// ───────────────────────────────────────────────────────────────
let lastDebounceHash: string = '';
let computedThisSession: boolean = false;

/**
 * Reset module-level debounce state. Exported for testing only.
 */
export function resetCommunityDetectionState(): void {
  lastDebounceHash = '';
  computedThisSession = false;
}

// ───────────────────────────────────────────────────────────────
// 5. INTERNAL HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Build an undirected adjacency list from the `causal_edges` table.
 * Each edge (source_id, target_id) produces links in both directions.
 */
function buildAdjacencyList(db: Database.Database): AdjacencyList {
  const adj: AdjacencyList = new Map();

  try {
    const rows = db
      .prepare("SELECT source_id, target_id FROM causal_edges")
      .all() as Array<{ source_id: string; target_id: string }>;

    for (const row of rows) {
      const s = String(row.source_id);
      const t = String(row.target_id);

      if (!adj.has(s)) adj.set(s, new Set());
      if (!adj.has(t)) adj.set(t, new Set());
      const sourceNeighbors = adj.get(s);
      const targetNeighbors = adj.get(t);
      if (!sourceNeighbors || !targetNeighbors) continue;

      sourceNeighbors.add(t);
      targetNeighbors.add(s);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] Failed to build adjacency list: ${message}`);
  }

  return adj;
}

// ───────────────────────────────────────────────────────────────
// 6. BFS CONNECTED COMPONENTS

// ───────────────────────────────────────────────────────────────
/**
 * Detect communities using BFS connected-component labelling.
 * Returns a map of nodeId -> communityId (0-indexed).
 *
 * Uses index-based queue traversal instead of queue.shift() to avoid
 * O(n) per-dequeue cost, keeping BFS at O(V+E).
 */
export function detectCommunitiesBFS(
  db: Database.Database,
): Map<string, number> {
  const adj = buildAdjacencyList(db);
  const visited = new Set<string>();
  const assignments = new Map<string, number>();
  let communityId = 0;

  for (const node of adj.keys()) {
    if (visited.has(node)) continue;

    // BFS from this unvisited node — index-based to avoid O(n) shift()
    const queue: string[] = [node];
    let queueIdx = 0;
    visited.add(node);

    while (queueIdx < queue.length) {
      const current = queue[queueIdx++];
      assignments.set(current, communityId);

      const neighbors = adj.get(current);
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }

    communityId++;
  }

  return assignments;
}

// ───────────────────────────────────────────────────────────────
// 7. ESCALATION CHECK

// ───────────────────────────────────────────────────────────────
/**
 * Check whether the largest connected component contains >50% of all nodes.
 * If true, the graph is poorly partitioned and Louvain should be attempted.
 */
export function shouldEscalateToLouvain(
  components: Map<string, number>,
): boolean {
  if (components.size === 0) return false;

  const counts = new Map<number, number>();
  for (const cid of components.values()) {
    counts.set(cid, (counts.get(cid) ?? 0) + 1);
  }

  let maxSize = 0;
  for (const size of counts.values()) {
    if (size > maxSize) maxSize = size;
  }

  return maxSize > components.size * 0.5;
}

// 8. SIMPLIFIED LOUVAIN (single-level, no hierarchical passes)
/**
 * Pure-TypeScript single-level Louvain modularity optimisation.
 *
 * Algorithm:
 *  1. Each node starts in its own community.
 *  2. For each node, evaluate the modularity gain of moving it to each
 *     neighbour's community.
 *  3. Move to the community with the best positive gain.
 *  4. Repeat until no improvement (or max 10 iterations).
 *
 * Modularity:
 *   Q = Σ_c [ (edges_within_c / m) - (degree_sum_c / (2m))^2 ]
 *   where m = total edges.
 *
 * Gain of moving node i from community A to community B:
 *   ΔQ = [ (e_B_with_i / m) - ( (Σ_B + k_i) / (2m) )^2 ]
 *       - [ (e_B / m) - (Σ_B / (2m))^2 ]
 *       - [ (e_A_without_i / m) - ( (Σ_A - k_i) / (2m) )^2 ]
 *       + [ (e_A / m) - (Σ_A / (2m))^2 ]
 *   simplified to the standard Louvain ΔQ formula.
 */
export function detectCommunitiesLouvain(
  adjacency: AdjacencyList,
): Map<string, number> {
  const nodes = Array.from(adjacency.keys());
  if (nodes.length === 0) return new Map();

  // Community assignment: node -> communityId
  const community = new Map<string, number>();
  nodes.forEach((n, i) => community.set(n, i));

  // Total number of edges (each undirected edge counted once)
  let totalEdges = 0;
  for (const neighbors of adjacency.values()) {
    totalEdges += neighbors.size;
  }
  totalEdges = totalEdges / 2; // undirected: halve the sum of degrees

  if (totalEdges === 0) return community;

  const m = totalEdges;
  const m2 = 2 * m;

  // Degree of each node (number of edges)
  const degree = new Map<string, number>();
  for (const [node, neighbors] of adjacency) {
    degree.set(node, neighbors.size);
  }

  // Sum of degrees per community (Σ_tot)
  const sigmaTot = new Map<number, number>();
  for (const node of nodes) {
    const cid = community.get(node);
    const nodeDegree = degree.get(node);
    if (cid === undefined || nodeDegree === undefined) continue;

    sigmaTot.set(cid, (sigmaTot.get(cid) ?? 0) + nodeDegree);
  }

  // Iterate
  const MAX_ITERATIONS = 10;
  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    let moved = false;

    for (const node of nodes) {
      const currentCommunity = community.get(node);
      const ki = degree.get(node);
      if (currentCommunity === undefined || ki === undefined) continue;

      const neighbors = adjacency.get(node);
      if (!neighbors || neighbors.size === 0) continue;

      // Count edges from node to each neighbouring community
      const edgesToCommunity = new Map<number, number>();
      for (const neighbor of neighbors) {
        const nc = community.get(neighbor);
        if (nc === undefined) continue;
        edgesToCommunity.set(nc, (edgesToCommunity.get(nc) ?? 0) + 1);
      }

      // Edges from node to its own community (for removal gain)
      const edgesToOwn = edgesToCommunity.get(currentCommunity) ?? 0;

      // Gain of removing node from its current community
      const sigmaOld = sigmaTot.get(currentCommunity) ?? 0;
      const removeGain =
        -edgesToOwn / m + ((sigmaOld - ki) / m2) ** 2 - (sigmaOld / m2) ** 2;

      let bestGain = 0;
      let bestCommunity = currentCommunity;

      for (const [targetCommunity, edgesIn] of edgesToCommunity) {
        if (targetCommunity === currentCommunity) continue;

        const sigmaTarget = sigmaTot.get(targetCommunity) ?? 0;

        // Gain of inserting node into target community
        const insertGain =
          edgesIn / m -
          ((sigmaTarget + ki) / m2) ** 2 +
          (sigmaTarget / m2) ** 2;

        const totalGain = removeGain + insertGain;

        if (totalGain > bestGain) {
          bestGain = totalGain;
          bestCommunity = targetCommunity;
        }
      }

      if (bestCommunity !== currentCommunity && bestGain > 1e-10) {
        // Move node
        community.set(node, bestCommunity);

        // Update sigma totals
        sigmaTot.set(
          currentCommunity,
          (sigmaTot.get(currentCommunity) ?? 0) - ki,
        );
        sigmaTot.set(
          bestCommunity,
          (sigmaTot.get(bestCommunity) ?? 0) + ki,
        );

        moved = true;
      }
    }

    if (!moved) break;
  }

  // Re-label communities to contiguous 0-based IDs
  const labelMap = new Map<number, number>();
  let nextLabel = 0;
  const result = new Map<string, number>();

  for (const [node, cid] of community) {
    if (!labelMap.has(cid)) {
      labelMap.set(cid, nextLabel++);
    }
    result.set(node, labelMap.get(cid)!);
  }

  return result;
}

// ───────────────────────────────────────────────────────────────
// 8. ORCHESTRATOR

// ───────────────────────────────────────────────────────────────
/**
 * Top-level community detection orchestrator.
 *
 * 1. BFS connected components first (fast, O(V+E)).
 * 2. If the largest component holds >50 % of nodes, escalate to Louvain
 *    for finer-grained sub-community detection.
 * 3. Debounced: skips re-computation if edge count is unchanged or
 *    already computed this session.
 */
export function detectCommunities(db: Database.Database): Map<string, number> {
  try {
    // Replace edge-count-only debounce
    // With count:maxId hash. Edge count alone can't detect deletions followed by
    // Insertions that maintain the same count.
    const edgeStatsRow = db
      .prepare("SELECT COUNT(*) AS cnt, MAX(id) AS maxId FROM causal_edges")
      .get() as { cnt: number; maxId: number | null } | undefined;
    const currentEdgeCount = edgeStatsRow?.cnt ?? 0;
    // Fix F22 — include SUM of source/target IDs for update-sensitive fingerprint.
    const edgeChecksumRow = db
      .prepare("SELECT COALESCE(SUM(CAST(source_id AS INTEGER) + CAST(target_id AS INTEGER)), 0) AS cksum FROM causal_edges")
      .get() as { cksum: number } | undefined;
    const currentDebounceHash = `${currentEdgeCount}:${edgeStatsRow?.maxId ?? 0}:${edgeChecksumRow?.cksum ?? 0}`;

    if (
      computedThisSession &&
      currentDebounceHash === lastDebounceHash
    ) {
      // Graph unchanged and already computed — return stored assignments
      return loadStoredAssignments(db);
    }

    // --- Step 1: BFS -------------------------------------------------------
    // Build adjacency list once and reuse for both BFS and potential Louvain
    const adj = buildAdjacencyList(db);
    const bfsResult = detectCommunitiesBFSFromAdj(adj);

    let finalResult: Map<string, number>;

    // --- Step 2: Escalate? --------------------------------------------------
    if (shouldEscalateToLouvain(bfsResult)) {
      // Reuse the adjacency list already built — no second DB query needed
      finalResult = detectCommunitiesLouvain(adj);
    } else {
      finalResult = bfsResult;
    }

    // --- Update debounce state -----------------------------------------------
    lastDebounceHash = currentDebounceHash;
    computedThisSession = true;

    return finalResult;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] detectCommunities failed: ${message}`);
    return new Map();
  }
}

/**
 * BFS connected-component labelling from a pre-built adjacency list.
 * Used by the orchestrator to avoid rebuilding the adjacency list when
 * escalation to Louvain is needed.
 *
 * Uses index-based queue traversal instead of queue.shift() to avoid
 * O(n) per-dequeue cost, keeping BFS at O(V+E).
 */
function detectCommunitiesBFSFromAdj(
  adj: AdjacencyList,
): Map<string, number> {
  const visited = new Set<string>();
  const assignments = new Map<string, number>();
  let communityId = 0;

  for (const node of adj.keys()) {
    if (visited.has(node)) continue;

    const queue: string[] = [node];
    let queueIdx = 0;
    visited.add(node);

    while (queueIdx < queue.length) {
      const current = queue[queueIdx++];
      assignments.set(current, communityId);

      const neighbors = adj.get(current);
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }

    communityId++;
  }

  return assignments;
}

// ───────────────────────────────────────────────────────────────
// 9. PERSISTENCE HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Load previously stored community assignments from the database.
 */
function loadStoredAssignments(db: Database.Database): Map<string, number> {
  const result = new Map<string, number>();
  try {
    const rows = db
      .prepare("SELECT memory_id, community_id FROM community_assignments")
      .all() as Array<{ memory_id: number; community_id: number }>;

    for (const row of rows) {
      result.set(String(row.memory_id), row.community_id);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] Failed to load stored assignments: ${message}`);
  }
  return result;
}

/**
 * Persist community assignments into the `community_assignments` table.
 * Uses INSERT OR REPLACE to handle existing rows (memory_id is UNIQUE).
 */
export function storeCommunityAssignments(
  db: Database.Database,
  assignments: Map<string, number>,
  algorithm: string = "bfs",
): { stored: number } {
  let stored = 0;

  try {
    // P1-014: Clean up stale assignments for deleted memories
    db.prepare(
      "DELETE FROM community_assignments WHERE memory_id NOT IN (SELECT id FROM memory_index)",
    ).run();

    const insert = db.prepare(
      `INSERT OR REPLACE INTO community_assignments
         (memory_id, community_id, algorithm, computed_at)
       VALUES (?, ?, ?, ?)`,
    );

    const now = new Date().toISOString();

    const runAll = db.transaction(() => {
      for (const [nodeId, communityId] of assignments) {
        const numId = Number(nodeId);
        if (!Number.isFinite(numId)) continue;
        insert.run(numId, communityId, algorithm, now);
        stored++;
      }
    });

    runAll();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] Failed to store assignments: ${message}`);
  }

  return { stored };
}

// ───────────────────────────────────────────────────────────────
// 10. QUERY HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Return the memory IDs that share the same community as `memoryId`.
 * Excludes the queried memory itself from the result.
 */
export function getCommunityMembers(
  db: Database.Database,
  memoryId: number,
): number[] {
  try {
    const row = db
      .prepare(
        "SELECT community_id FROM community_assignments WHERE memory_id = ?",
      )
      .get(memoryId) as { community_id: number } | undefined;

    if (!row) return [];

    const members = db
      .prepare(
        `SELECT memory_id FROM community_assignments
         WHERE community_id = ? AND memory_id != ?`,
      )
      .all(row.community_id, memoryId) as Array<{ memory_id: number }>;

    return members.map((m) => m.memory_id);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] getCommunityMembers failed: ${message}`);
    return [];
  }
}

/**
 * Inject community co-members into a result set with a co-retrieval bonus.
 *
 * For each row in `rows`, find community co-members that are not already
 * present. Inject them with `score = 0.3 * originalRow.score`.
 * Maximum 3 injected co-members total across all rows.
 */
export function applyCommunityBoost(
  rows: Array<{ id: number; score?: number; [key: string]: unknown }>,
  db: Database.Database,
): Array<{ id: number; score?: number; [key: string]: unknown }> {
  try {
    const existingIds = new Set(rows.map((r) => r.id));
    const injected: Array<{ id: number; score?: number; [key: string]: unknown }> = [];
    const MAX_INJECTED = 3;

    for (const row of rows) {
      if (injected.length >= MAX_INJECTED) break;

      const coMembers = getCommunityMembers(db, row.id);
      const baseScore = row.score ?? 1.0;
      const boostScore = COMMUNITY_EDGE_WEIGHT_THRESHOLD * baseScore;

      for (const memberId of coMembers) {
        if (injected.length >= MAX_INJECTED) break;
        if (existingIds.has(memberId)) continue;

        existingIds.add(memberId);
        injected.push({
          id: memberId,
          score: boostScore,
          _communityBoosted: true,
        });
      }
    }

    return [...rows, ...injected];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] applyCommunityBoost failed: ${message}`);
    return rows;
  }
}

// ───────────────────────────────────────────────────────────────
// 11. TEST-ONLY EXPORTS

// ───────────────────────────────────────────────────────────────
/**
 * Defines the __testables constant.
 */
export const __testables = {
  buildAdjacencyList,
  loadStoredAssignments,
};

// Self-governance: Opus-C agent, TCB=10, 3 findings addressed (A4-P2-2, A4-P2-1, A4-P2-3)
