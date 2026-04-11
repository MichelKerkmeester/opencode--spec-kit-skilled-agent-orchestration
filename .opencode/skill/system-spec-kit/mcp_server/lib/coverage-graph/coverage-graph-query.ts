// ───────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Query Helpers
// ───────────────────────────────────────────────────────────────
// Structured query helpers for coverage gap detection, contradiction
// lookup, provenance chains, unverified claims, and hot-node ranking.
// Called by the coverage-graph MCP query handler.

import {
  getDb,
  type Namespace,
  type CoverageNode,
  type CoverageEdge,
} from './coverage-graph-db.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface CoverageGap {
  nodeId: string;
  kind: string;
  name: string;
  reason: string;
}

export interface ContradictionPair {
  edgeId: string;
  sourceId: string;
  targetId: string;
  sourceName: string;
  targetName: string;
  weight: number;
  metadata?: Record<string, unknown>;
}

export interface ProvenanceStep {
  nodeId: string;
  kind: string;
  name: string;
  depth: number;
  edgeRelation: string;
  cumulativeWeight: number;
}

export interface HotNode {
  nodeId: string;
  kind: string;
  name: string;
  edgeCount: number;
  weightSum: number;
  score: number;
}

function buildSessionFilter(column: string, sessionId?: string): { clause: string; params: unknown[] } {
  if (!sessionId) return { clause: '', params: [] };
  return {
    clause: ` AND ${column} = ?`,
    params: [sessionId],
  };
}

// ───────────────────────────────────────────────────────────────
// 2. COVERAGE GAPS
// ───────────────────────────────────────────────────────────────

/**
 * Find nodes with coverage gaps.
 * For research: questions that have no incoming ANSWERS or COVERS edges.
 * For review: dimensions/files that are not sources of outgoing COVERS or EVIDENCE_FOR edges.
 */
export function findCoverageGaps(ns: Namespace): CoverageGap[] {
  const d = getDb();
  const { specFolder, loopType, sessionId } = ns;

  const coverageRelations = loopType === 'research'
    ? ['ANSWERS', 'COVERS']
    : ['COVERS', 'EVIDENCE_FOR'];

  const targetKinds = loopType === 'research'
    ? ['QUESTION']
    : ['DIMENSION', 'FILE'];

  const gaps: CoverageGap[] = [];

  if (loopType === 'review') {
    // Review mode: dimensions/files are sources of outgoing COVERS edges.
    // A gap means the node has no outgoing coverage edges.
    for (const kind of targetKinds) {
      const nodeFilter = buildSessionFilter('n.session_id', sessionId);
      const edgeFilter = buildSessionFilter('e.session_id', sessionId);
      const nodeRows = d.prepare(`
        SELECT n.id, n.kind, n.name
        FROM coverage_nodes n
        WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = ?
          ${nodeFilter.clause}
          AND NOT EXISTS (
            SELECT 1 FROM coverage_edges e
            WHERE e.source_id = n.id
              ${edgeFilter.clause}
              AND e.relation IN (${coverageRelations.map(() => '?').join(',')})
          )
      `).all(
        specFolder,
        loopType,
        kind,
        ...nodeFilter.params,
        ...edgeFilter.params,
        ...coverageRelations,
      ) as Array<{ id: string; kind: string; name: string }>;

      for (const row of nodeRows) {
        gaps.push({
          nodeId: row.id,
          kind: row.kind,
          name: row.name,
          reason: `No outgoing ${coverageRelations.join(' or ')} edges`,
        });
      }
    }
  } else {
    // Research mode: questions should have incoming ANSWERS edges.
    for (const kind of targetKinds) {
      const nodeFilter = buildSessionFilter('n.session_id', sessionId);
      const edgeFilter = buildSessionFilter('e.session_id', sessionId);
      const nodeRows = d.prepare(`
        SELECT n.id, n.kind, n.name
        FROM coverage_nodes n
        WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = ?
          ${nodeFilter.clause}
          AND NOT EXISTS (
            SELECT 1 FROM coverage_edges e
            WHERE e.target_id = n.id
              ${edgeFilter.clause}
              AND e.relation IN (${coverageRelations.map(() => '?').join(',')})
          )
      `).all(
        specFolder,
        loopType,
        kind,
        ...nodeFilter.params,
        ...edgeFilter.params,
        ...coverageRelations,
      ) as Array<{ id: string; kind: string; name: string }>;

      for (const row of nodeRows) {
        gaps.push({
          nodeId: row.id,
          kind: row.kind,
          name: row.name,
          reason: `No incoming ${coverageRelations.join(' or ')} edges`,
        });
      }
    }
  }

  return gaps;
}

// ───────────────────────────────────────────────────────────────
// 3. CONTRADICTIONS
// ───────────────────────────────────────────────────────────────

/**
 * Find all CONTRADICTS edge pairs in a namespace.
 */
export function findContradictions(ns: Namespace): ContradictionPair[] {
  const d = getDb();
  const { specFolder, loopType, sessionId } = ns;
  const edgeFilter = buildSessionFilter('e.session_id', sessionId);

  const rows = d.prepare(`
    SELECT e.id, e.source_id, e.target_id, e.weight, e.metadata,
           s.name AS source_name, t.name AS target_name
    FROM coverage_edges e
    JOIN coverage_nodes s ON s.id = e.source_id
    JOIN coverage_nodes t ON t.id = e.target_id
    WHERE e.spec_folder = ? AND e.loop_type = ? AND e.relation = 'CONTRADICTS'
      ${edgeFilter.clause}
  `).all(specFolder, loopType, ...edgeFilter.params) as Array<{
    id: string;
    source_id: string;
    target_id: string;
    weight: number;
    metadata: string | null;
    source_name: string;
    target_name: string;
  }>;

  return rows.map(row => ({
    edgeId: row.id,
    sourceId: row.source_id,
    targetId: row.target_id,
    sourceName: row.source_name,
    targetName: row.target_name,
    weight: row.weight,
    metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
  }));
}

// ───────────────────────────────────────────────────────────────
// 4. PROVENANCE CHAIN
// ───────────────────────────────────────────────────────────────

/**
 * BFS from a node following CITES/EVIDENCES/DERIVED_FROM/SUPPORTS edges.
 * Detects cycles and returns cumulative path strength.
 */
export function findProvenanceChain(ns: Namespace, nodeId: string, maxDepth: number = 10): ProvenanceStep[] {
  const provenanceRelations = ns.loopType === 'research'
    ? ['CITES', 'DERIVED_FROM', 'SUPPORTS']
    : ['EVIDENCE_FOR', 'CONFIRMS'];

  const visited = new Set<string>();
  const results: ProvenanceStep[] = [];
  let frontier: Array<{ id: string; depth: number; cumulativeWeight: number }> = [
    { id: nodeId, depth: 0, cumulativeWeight: 1.0 },
  ];

  while (frontier.length > 0) {
    const next: typeof frontier = [];

    for (const item of frontier) {
      if (visited.has(item.id) || item.depth >= maxDepth) continue;
      visited.add(item.id);

      const edges = getEdgesFromNode(item.id, ns.sessionId);
      for (const edge of edges) {
        if (!provenanceRelations.includes(edge.relation)) continue;
        if (visited.has(edge.targetId)) continue;

        const targetNode = getNodeById(edge.targetId, ns.sessionId);
        if (!targetNode) continue;

        const cumWeight = item.cumulativeWeight * edge.weight;
        results.push({
          nodeId: edge.targetId,
          kind: targetNode.kind,
          name: targetNode.name,
          depth: item.depth + 1,
          edgeRelation: edge.relation,
          cumulativeWeight: cumWeight,
        });

        next.push({ id: edge.targetId, depth: item.depth + 1, cumulativeWeight: cumWeight });
      }
    }

    frontier = next;
  }

  return results;
}

/** Internal helper: get node by ID for provenance chain */
function getNodeById(id: string, sessionId?: string): { kind: string; name: string } | null {
  const d = getDb();
  const sessionFilter = buildSessionFilter('session_id', sessionId);
  const row = d.prepare(`
    SELECT kind, name
    FROM coverage_nodes
    WHERE id = ?${sessionFilter.clause}
  `).get(id, ...sessionFilter.params) as { kind: string; name: string } | undefined;
  return row ?? null;
}

function getEdgesFromNode(sourceId: string, sessionId?: string): CoverageEdge[] {
  const d = getDb();
  const sessionFilter = buildSessionFilter('session_id', sessionId);
  const rows = d.prepare(`
    SELECT *
    FROM coverage_edges
    WHERE source_id = ?${sessionFilter.clause}
  `).all(sourceId, ...sessionFilter.params) as Record<string, unknown>[];

  return rows.map(row => ({
    id: row.id as string,
    specFolder: row.spec_folder as string,
    loopType: row.loop_type as Namespace['loopType'],
    sessionId: row.session_id as string,
    sourceId: row.source_id as string,
    targetId: row.target_id as string,
    relation: row.relation as CoverageEdge['relation'],
    weight: row.weight as number,
    metadata: row.metadata ? JSON.parse(row.metadata as string) : undefined,
    createdAt: row.created_at as string | undefined,
  }));
}

// ───────────────────────────────────────────────────────────────
// 5. UNVERIFIED CLAIMS
// ───────────────────────────────────────────────────────────────

/**
 * Find claim nodes whose metadata verification_status is not 'verified'.
 * For research: CLAIM nodes with status != 'verified'.
 * For review: FINDING nodes with no RESOLVES edges.
 */
export function findUnverifiedClaims(ns: Namespace): CoverageNode[] {
  const d = getDb();
  const { specFolder, loopType, sessionId } = ns;
  const nodeFilter = buildSessionFilter('session_id', sessionId);

  if (loopType === 'research') {
    // Schema note: coverage graph tables already include a real session_id
    // column, so session-scoped reads can stay in SQL.
    // Research: CLAIM nodes where metadata.verification_status != 'verified'
    const rows = d.prepare(`
      SELECT * FROM coverage_nodes
      WHERE spec_folder = ? AND loop_type = ? AND kind = 'CLAIM'
        ${nodeFilter.clause}
    `).all(specFolder, loopType, ...nodeFilter.params) as Record<string, unknown>[];

    return rows
      .map(r => ({
        id: r.id as string,
        specFolder: r.spec_folder as string,
        loopType: r.loop_type as string,
        sessionId: r.session_id as string,
        kind: r.kind as string,
        name: r.name as string,
        contentHash: r.content_hash as string | undefined,
        iteration: r.iteration as number | undefined,
        metadata: r.metadata ? JSON.parse(r.metadata as string) : undefined,
        createdAt: r.created_at as string | undefined,
        updatedAt: r.updated_at as string | undefined,
      }))
      .filter(n => {
        const status = n.metadata?.verification_status;
        return status !== 'verified';
      }) as CoverageNode[];
  }

  // Review: FINDING nodes with no RESOLVES incoming edge
  const reviewNodeFilter = buildSessionFilter('n.session_id', sessionId);
  const reviewEdgeFilter = buildSessionFilter('e.session_id', sessionId);
  const rows = d.prepare(`
    SELECT n.* FROM coverage_nodes n
    WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = 'FINDING'
      ${reviewNodeFilter.clause}
      AND NOT EXISTS (
        SELECT 1 FROM coverage_edges e
        WHERE e.target_id = n.id
          ${reviewEdgeFilter.clause}
          AND e.relation = 'RESOLVES'
      )
  `).all(
    specFolder,
    loopType,
    ...reviewNodeFilter.params,
    ...reviewEdgeFilter.params,
  ) as Record<string, unknown>[];

  return rows.map(r => ({
    id: r.id as string,
    specFolder: r.spec_folder as string,
    loopType: r.loop_type as string,
    sessionId: r.session_id as string,
    kind: r.kind as string,
    name: r.name as string,
    contentHash: r.content_hash as string | undefined,
    iteration: r.iteration as number | undefined,
    metadata: r.metadata ? JSON.parse(r.metadata as string) : undefined,
    createdAt: r.created_at as string | undefined,
    updatedAt: r.updated_at as string | undefined,
  })) as CoverageNode[];
}

// ───────────────────────────────────────────────────────────────
// 6. HOT NODES
// ───────────────────────────────────────────────────────────────

/**
 * Rank nodes by edge count + weight sum.
 * Hot nodes are those with the most connections and highest total edge weight.
 */
export function rankHotNodes(ns: Namespace, limit: number = 10): HotNode[] {
  const d = getDb();
  const { specFolder, loopType, sessionId } = ns;
  const edgeFilter = buildSessionFilter('e.session_id', sessionId);
  const nodeFilter = buildSessionFilter('n.session_id', sessionId);

  const rows = d.prepare(`
    WITH node_edges AS (
      SELECT n.id, n.kind, n.name,
        (
          SELECT COUNT(*) FROM coverage_edges e
          WHERE (e.source_id = n.id OR e.target_id = n.id)
            AND e.spec_folder = ? AND e.loop_type = ?
            ${edgeFilter.clause}
        ) AS edge_count,
        (
          SELECT COALESCE(SUM(e.weight), 0) FROM coverage_edges e
          WHERE (e.source_id = n.id OR e.target_id = n.id)
            AND e.spec_folder = ? AND e.loop_type = ?
            ${edgeFilter.clause}
        ) AS weight_sum
      FROM coverage_nodes n
      WHERE n.spec_folder = ? AND n.loop_type = ?
        ${nodeFilter.clause}
    )
    SELECT id, kind, name, edge_count, weight_sum,
      (edge_count * 1.0 + weight_sum * 0.5) AS score
    FROM node_edges
    WHERE edge_count > 0
    ORDER BY score DESC
    LIMIT ?
  `).all(
    specFolder,
    loopType,
    ...edgeFilter.params,
    specFolder,
    loopType,
    ...edgeFilter.params,
    specFolder,
    loopType,
    ...nodeFilter.params,
    limit,
  ) as Array<{
    id: string;
    kind: string;
    name: string;
    edge_count: number;
    weight_sum: number;
    score: number;
  }>;

  return rows.map(row => ({
    nodeId: row.id,
    kind: row.kind,
    name: row.name,
    edgeCount: row.edge_count,
    weightSum: row.weight_sum,
    score: row.score,
  }));
}
