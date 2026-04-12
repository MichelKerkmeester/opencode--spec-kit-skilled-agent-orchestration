// ───────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Signals
// ───────────────────────────────────────────────────────────────
// Server-side signal computation and snapshot generation for
// research and review convergence metrics.
// Follows graph-signals.ts patterns for degree, depth, and momentum.

import Database from 'better-sqlite3';
import {
  getDb,
  getNodes,
  getEdges,
  createSnapshot,
  getSnapshots,
  getStats,
  type Namespace,
  type LoopType,
  type CoverageNode,
  type CoverageEdge,
} from './coverage-graph-db.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface NodeSignal {
  nodeId: string;
  kind: string;
  degree: number;
  inDegree: number;
  outDegree: number;
  depth: number;
  weightSum: number;
}

export interface ResearchConvergenceSignals {
  questionCoverage: number;
  claimVerificationRate: number;
  contradictionDensity: number;
  sourceDiversity: number;
  evidenceDepth: number;
}

export interface ReviewConvergenceSignals {
  dimensionCoverage: number;
  findingStability: number;
  p0ResolutionRate: number;
  evidenceDensity: number;
  hotspotSaturation: number;
}

export type ConvergenceSignals = ResearchConvergenceSignals | ReviewConvergenceSignals;

export interface SignalSnapshot {
  iteration: number;
  signals: ConvergenceSignals;
  nodeSignals: NodeSignal[];
  nodeCount: number;
  edgeCount: number;
}

type ResearchSignalNodeLike = {
  id: string;
  kind: string;
  metadata?: CoverageNode['metadata'] | string | null;
};

type ResearchSignalEdgeLike = {
  sourceId: string;
  targetId: string;
  relation: string;
};

interface SqlFragment {
  clause: string;
  params: unknown[];
}

function buildNamespacePredicate(alias: string, ns: Namespace): SqlFragment {
  const prefix = alias ? `${alias}.` : '';
  const clauses = [`${prefix}spec_folder = ?`, `${prefix}loop_type = ?`];
  const params: unknown[] = [ns.specFolder, ns.loopType];

  if (ns.sessionId) {
    clauses.push(`${prefix}session_id = ?`);
    params.push(ns.sessionId);
  }

  return {
    clause: clauses.join(' AND '),
    params,
  };
}

function buildCompositeNodeJoin(
  nodeAlias: string,
  edgeAlias: string,
  edgeNodeColumn: 'source_id' | 'target_id',
): string {
  return `${nodeAlias}.spec_folder = ${edgeAlias}.spec_folder
      AND ${nodeAlias}.loop_type = ${edgeAlias}.loop_type
      AND ${nodeAlias}.session_id = ${edgeAlias}.session_id
      AND ${nodeAlias}.id = ${edgeAlias}.${edgeNodeColumn}`;
}

// ───────────────────────────────────────────────────────────────
// 2. NODE-LEVEL SIGNALS
// ───────────────────────────────────────────────────────────────

/**
 * Compute degree, depth, and weight signals for all nodes in a namespace.
 */
export function computeNodeSignals(ns: Namespace): NodeSignal[] {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);

  // Build adjacency maps
  const inDegreeMap = new Map<string, number>();
  const outDegreeMap = new Map<string, number>();
  const weightSumMap = new Map<string, number>();

  for (const edge of edges) {
    outDegreeMap.set(edge.sourceId, (outDegreeMap.get(edge.sourceId) ?? 0) + 1);
    inDegreeMap.set(edge.targetId, (inDegreeMap.get(edge.targetId) ?? 0) + 1);
    weightSumMap.set(edge.sourceId, (weightSumMap.get(edge.sourceId) ?? 0) + edge.weight);
    weightSumMap.set(edge.targetId, (weightSumMap.get(edge.targetId) ?? 0) + edge.weight);
  }

  // BFS depth from root nodes (nodes with no incoming edges)
  const depthMap = computeDepths(nodes, edges);

  return nodes.map(node => ({
    nodeId: node.id,
    kind: node.kind,
    degree: (inDegreeMap.get(node.id) ?? 0) + (outDegreeMap.get(node.id) ?? 0),
    inDegree: inDegreeMap.get(node.id) ?? 0,
    outDegree: outDegreeMap.get(node.id) ?? 0,
    depth: depthMap.get(node.id) ?? 0,
    weightSum: weightSumMap.get(node.id) ?? 0,
  }));
}

/**
 * Compute longest-path depth for each node from any root node.
 * Mirrors the in-memory CJS implementation so both layers report
 * the same structural depth for DAG-shaped coverage graphs.
 */
function computeDepths(nodes: CoverageNode[], edges: CoverageEdge[]): Map<string, number> {
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const node of nodes) {
    adjacency.set(node.id, []);
    inDegree.set(node.id, 0);
  }

  for (const edge of edges) {
    if (!adjacency.has(edge.sourceId)) adjacency.set(edge.sourceId, []);
    adjacency.get(edge.sourceId)!.push(edge.targetId);
    inDegree.set(edge.targetId, (inDegree.get(edge.targetId) ?? 0) + 1);
    if (!inDegree.has(edge.sourceId)) inDegree.set(edge.sourceId, 0);
  }

  const depthMap = new Map<string, number>();
  const remaining = new Map(inDegree);
  const queue: string[] = [];

  for (const [id, degree] of remaining) {
    if (degree === 0) {
      depthMap.set(id, 0);
      queue.push(id);
    }
  }

  let queueIndex = 0;
  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];
    const currentDepth = depthMap.get(current) ?? 0;

    for (const childId of adjacency.get(current) ?? []) {
      const candidateDepth = currentDepth + 1;
      if (candidateDepth > (depthMap.get(childId) ?? 0)) {
        depthMap.set(childId, candidateDepth);
      }

      const nextDegree = (remaining.get(childId) ?? 0) - 1;
      remaining.set(childId, nextDegree);
      if (nextDegree === 0) {
        queue.push(childId);
      }
    }
  }

  for (const node of nodes) {
    if (!depthMap.has(node.id)) depthMap.set(node.id, 0);
  }

  return depthMap;
}

// ───────────────────────────────────────────────────────────────
// 3. RESEARCH CONVERGENCE SIGNALS
// ───────────────────────────────────────────────────────────────

/**
 * Compute research convergence signals.
 */
export function computeResearchSignals(ns: Namespace): ResearchConvergenceSignals {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);

  const questionCoverage = computeResearchQuestionCoverageFromData(nodes, edges);
  const claimVerificationRate = computeResearchClaimVerificationRateFromData(nodes);
  const contradictionDensity = computeResearchContradictionDensityFromData(edges);
  const sourceDiversity = computeResearchSourceDiversityFromData(nodes, edges);
  const evidenceDepth = computeResearchEvidenceDepthFromData(nodes, edges);

  return {
    questionCoverage,
    claimVerificationRate,
    contradictionDensity,
    sourceDiversity,
    evidenceDepth,
  };
}

function parseNodeMetadata(metadata: CoverageNode['metadata'] | string | null | undefined): Record<string, unknown> | null {
  if (!metadata) return null;
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata) as unknown;
      return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null;
    } catch {
      return null;
    }
  }
  return typeof metadata === 'object' ? metadata as Record<string, unknown> : null;
}

function buildAnsweringFindingsByQuestion(edges: ReadonlyArray<ResearchSignalEdgeLike>): Map<string, string[]> {
  const answeringFindings = new Map<string, string[]>();

  for (const edge of edges) {
    if (edge.relation !== 'ANSWERS') continue;
    if (!answeringFindings.has(edge.targetId)) answeringFindings.set(edge.targetId, []);
    answeringFindings.get(edge.targetId)!.push(edge.sourceId);
  }

  return answeringFindings;
}

function buildCitedSourcesByFinding(edges: ReadonlyArray<ResearchSignalEdgeLike>): Map<string, string[]> {
  const citedSources = new Map<string, string[]>();

  for (const edge of edges) {
    if (edge.relation !== 'CITES') continue;
    if (!citedSources.has(edge.sourceId)) citedSources.set(edge.sourceId, []);
    citedSources.get(edge.sourceId)!.push(edge.targetId);
  }

  return citedSources;
}

/**
 * Canonical research question coverage: questions with at least two ANSWERS
 * edges divided by all research questions in the graph.
 */
export function computeResearchQuestionCoverageFromData(
  nodes: ReadonlyArray<ResearchSignalNodeLike>,
  edges: ReadonlyArray<ResearchSignalEdgeLike>,
): number {
  const questionIds = nodes
    .filter(node => node.kind === 'QUESTION')
    .map(node => node.id);

  if (questionIds.length === 0) return 0;

  const answeringFindings = buildAnsweringFindingsByQuestion(edges);
  let coveredQuestions = 0;

  for (const questionId of questionIds) {
    if ((answeringFindings.get(questionId) ?? []).length >= 2) {
      coveredQuestions++;
    }
  }

  return coveredQuestions / questionIds.length;
}

/**
 * Canonical research claim verification rate: verified claims divided by all
 * claim nodes, where verified means verification_status exists and is not
 * "unresolved".
 */
export function computeResearchClaimVerificationRateFromData(
  nodes: ReadonlyArray<ResearchSignalNodeLike>,
): number {
  const claims = nodes.filter(node => node.kind === 'CLAIM');
  if (claims.length === 0) return 0;

  let verifiedClaims = 0;
  for (const claim of claims) {
    const meta = parseNodeMetadata(claim.metadata);
    if (meta?.verification_status && meta.verification_status !== 'unresolved') {
      verifiedClaims++;
    }
  }

  return verifiedClaims / claims.length;
}

/**
 * Canonical research contradiction density: CONTRADICTS edges divided by all
 * research edges in the graph.
 */
export function computeResearchContradictionDensityFromData(
  edges: ReadonlyArray<ResearchSignalEdgeLike>,
): number {
  if (edges.length === 0) return 0;
  let contradictionCount = 0;

  for (const edge of edges) {
    if (edge.relation === 'CONTRADICTS') contradictionCount++;
  }

  return contradictionCount / edges.length;
}

/**
 * Canonical research source diversity: for each question, count distinct
 * source metadata quality classes reachable through ANSWERS -> CITES paths,
 * then average that count across all questions.
 */
export function computeResearchSourceDiversityFromData(
  nodes: ReadonlyArray<ResearchSignalNodeLike>,
  edges: ReadonlyArray<ResearchSignalEdgeLike>,
): number {
  const questionIds = nodes
    .filter(node => node.kind === 'QUESTION')
    .map(node => node.id);

  if (questionIds.length === 0) return 0;

  const answeringFindings = buildAnsweringFindingsByQuestion(edges);
  const citedSources = buildCitedSourcesByFinding(edges);
  const sourceMetadataById = new Map<string, Record<string, unknown>>();

  for (const node of nodes) {
    if (node.kind !== 'SOURCE') continue;
    const meta = parseNodeMetadata(node.metadata);
    if (meta) sourceMetadataById.set(node.id, meta);
  }

  let totalDiversity = 0;

  for (const questionId of questionIds) {
    const qualityClasses = new Set<string>();

    for (const findingId of answeringFindings.get(questionId) ?? []) {
      for (const sourceId of citedSources.get(findingId) ?? []) {
        const qualityClass = sourceMetadataById.get(sourceId)?.quality_class;
        if (typeof qualityClass === 'string' && qualityClass.length > 0) {
          qualityClasses.add(qualityClass);
        }
      }
    }

    totalDiversity += qualityClasses.size;
  }

  return totalDiversity / questionIds.length;
}

/**
 * Canonical research evidence depth: average path length across all
 * question -> finding paths, scoring 2 when the finding cites at least one
 * source and 1 when it does not.
 */
export function computeResearchEvidenceDepthFromData(
  nodes: ReadonlyArray<ResearchSignalNodeLike>,
  edges: ReadonlyArray<ResearchSignalEdgeLike>,
): number {
  const questionIds = nodes
    .filter(node => node.kind === 'QUESTION')
    .map(node => node.id);

  if (questionIds.length === 0) return 0;

  const answeringFindings = buildAnsweringFindingsByQuestion(edges);
  const citedSources = buildCitedSourcesByFinding(edges);
  let totalDepth = 0;
  let pathCount = 0;

  for (const questionId of questionIds) {
    for (const findingId of answeringFindings.get(questionId) ?? []) {
      totalDepth += (citedSources.get(findingId) ?? []).length > 0 ? 2 : 1;
      pathCount++;
    }
  }

  return pathCount > 0 ? totalDepth / pathCount : 0;
}

// ───────────────────────────────────────────────────────────────
// 4. REVIEW CONVERGENCE SIGNALS
// ───────────────────────────────────────────────────────────────

/**
 * Compute review convergence signals.
 */
export function computeReviewSignals(ns: Namespace): ReviewConvergenceSignals {
  const d = getDb();
  const nodeNamespace = buildNamespacePredicate('', ns);
  const scopedNodeNamespace = buildNamespacePredicate('n', ns);
  const edgeNamespace = buildNamespacePredicate('e', ns);
  const bareEdgeNamespace = buildNamespacePredicate('', ns);

  // dimensionCoverage: dimensions with >= 1 COVERS edge / all dimensions
  const allDimensions = (d.prepare(
    `SELECT COUNT(*) as c FROM coverage_nodes WHERE ${nodeNamespace.clause} AND kind = 'DIMENSION'`,
  ).get(...nodeNamespace.params) as { c: number }).c;

  const coveredDimensions = (d.prepare(`
    SELECT COUNT(*) as c FROM coverage_nodes n
    WHERE ${scopedNodeNamespace.clause} AND n.kind = 'DIMENSION'
      AND EXISTS (
        SELECT 1 FROM coverage_edges e
        WHERE ${edgeNamespace.clause}
          AND e.source_id = n.id
          AND e.relation = 'COVERS'
      )
  `).get(...scopedNodeNamespace.params, ...edgeNamespace.params) as { c: number }).c;

  const dimensionCoverage = allDimensions > 0 ? coveredDimensions / allDimensions : 0;

  // findingStability: findings with 0 CONTRADICTS edges / all findings
  const allFindings = (d.prepare(
    `SELECT COUNT(*) as c FROM coverage_nodes WHERE ${nodeNamespace.clause} AND kind = 'FINDING'`,
  ).get(...nodeNamespace.params) as { c: number }).c;

  const stableFindings = (d.prepare(`
    SELECT COUNT(*) as c FROM coverage_nodes n
    WHERE ${scopedNodeNamespace.clause} AND n.kind = 'FINDING'
      AND NOT EXISTS (
        SELECT 1 FROM coverage_edges e
        WHERE ${edgeNamespace.clause}
          AND (e.source_id = n.id OR e.target_id = n.id)
          AND e.relation = 'CONTRADICTS'
      )
  `).get(...scopedNodeNamespace.params, ...edgeNamespace.params) as { c: number }).c;

  const findingStability = allFindings > 0 ? stableFindings / allFindings : 0;

  // p0ResolutionRate: P0 findings with RESOLVES edge / P0 findings
  const allP0 = d.prepare(`
    SELECT id, metadata FROM coverage_nodes
    WHERE ${nodeNamespace.clause} AND kind = 'FINDING'
  `).all(...nodeNamespace.params) as Array<{ id: string; metadata: string | null }>;

  let p0Count = 0;
  let p0Resolved = 0;

  for (const finding of allP0) {
    if (finding.metadata) {
      try {
        const meta = JSON.parse(finding.metadata);
        if (meta.severity === 'P0') {
          p0Count++;
          const hasResolve = (d.prepare(
            `SELECT COUNT(*) as c FROM coverage_edges e WHERE ${edgeNamespace.clause} AND e.target_id = ? AND e.relation = 'RESOLVES'`,
          ).get(...edgeNamespace.params, finding.id) as { c: number }).c;
          if (hasResolve > 0) p0Resolved++;
        }
      } catch { /* skip */ }
    }
  }

  const p0ResolutionRate = p0Count > 0 ? p0Resolved / p0Count : 1.0; // No P0s = fully resolved

  // evidenceDensity: average EVIDENCE_FOR edges per finding
  const totalEvidenceEdges = (d.prepare(
    `SELECT COUNT(*) as c FROM coverage_edges WHERE ${bareEdgeNamespace.clause} AND relation = 'EVIDENCE_FOR'`,
  ).get(...bareEdgeNamespace.params) as { c: number }).c;

  const evidenceDensity = allFindings > 0 ? totalEvidenceEdges / allFindings : 0;

  // hotspotSaturation: hotspot files with >= 2 dimension coverage / hotspot files
  const hotspotSaturation = computeHotspotSaturation(d, ns);

  return {
    dimensionCoverage,
    findingStability,
    p0ResolutionRate,
    evidenceDensity,
    hotspotSaturation,
  };
}

function computeHotspotSaturation(d: Database.Database, ns: Namespace): number {
  const nodeNamespace = buildNamespacePredicate('', ns);
  const edgeNamespace = buildNamespacePredicate('e', ns);
  // Find FILE nodes with hotspot_score > 0 in metadata
  const files = d.prepare(`
    SELECT id, metadata FROM coverage_nodes
    WHERE ${nodeNamespace.clause} AND kind = 'FILE'
  `).all(...nodeNamespace.params) as Array<{ id: string; metadata: string | null }>;

  const hotspotFiles: string[] = [];
  for (const f of files) {
    if (f.metadata) {
      try {
        const meta = JSON.parse(f.metadata);
        if (meta.hotspot_score && meta.hotspot_score > 0) {
          hotspotFiles.push(f.id);
        }
      } catch { /* skip */ }
    }
  }

  if (hotspotFiles.length === 0) return 1.0; // No hotspots = fully saturated

  let saturated = 0;
  for (const fileId of hotspotFiles) {
    // Count distinct dimensions that COVER this file
    const dimCoverage = (d.prepare(`
      SELECT COUNT(DISTINCT e.source_id) as c
      FROM coverage_edges e
      JOIN coverage_nodes n ON ${buildCompositeNodeJoin('n', 'e', 'source_id')}
      WHERE ${edgeNamespace.clause}
        AND e.target_id = ?
        AND e.relation = 'COVERS'
        AND n.kind = 'DIMENSION'
    `).get(...edgeNamespace.params, fileId) as { c: number }).c;

    if (dimCoverage >= 2) saturated++;
  }

  return hotspotFiles.length > 0 ? saturated / hotspotFiles.length : 1.0;
}

// ───────────────────────────────────────────────────────────────
// 5. COMPOSITE SIGNAL COMPUTATION
// ───────────────────────────────────────────────────────────────

/**
 * Compute all convergence signals for a namespace.
 * Dispatches to research or review signal computation based on loop type.
 */
export function computeSignals(ns: Namespace): ConvergenceSignals {
  if (ns.loopType === 'research') {
    return computeResearchSignals(ns);
  }
  return computeReviewSignals(ns);
}

/**
 * Create a signal snapshot for a given iteration.
 * Persists convergence signals and node-level signals.
 */
export function createSignalSnapshot(ns: Namespace, iteration: number): SignalSnapshot {
  const signals = computeSignals(ns);
  const nodeSignals = computeNodeSignals(ns);
  const stats = getStats(ns.specFolder, ns.loopType);

  const snapshot: SignalSnapshot = {
    iteration,
    signals,
    nodeSignals,
    nodeCount: stats.totalNodes,
    edgeCount: stats.totalEdges,
  };

  // Persist to database. CoverageSnapshot requires a concrete sessionId; the
  // Namespace may still carry undefined in bootstrap/debug contexts, so fall
  // back to a 'legacy' sentinel so pre-ADR-001 aggregations still persist
  // without violating the type.
  createSnapshot({
    specFolder: ns.specFolder,
    loopType: ns.loopType,
    sessionId: ns.sessionId ?? 'legacy',
    iteration,
    metrics: {
      ...signals,
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
    },
    nodeCount: stats.totalNodes,
    edgeCount: stats.totalEdges,
  });

  return snapshot;
}

// ───────────────────────────────────────────────────────────────
// 6. MOMENTUM (DELTA BETWEEN SNAPSHOTS)
// ───────────────────────────────────────────────────────────────

/**
 * Compute momentum (change rate) between the latest and previous snapshots.
 */
export function computeMomentum(
  specFolder: string,
  loopType: LoopType,
  sessionId?: string,
): Record<string, number> | null {
  const snapshots = getSnapshots(specFolder, loopType, sessionId);
  if (snapshots.length < 2) return null;

  const latest = snapshots[snapshots.length - 1]?.metrics ?? {};
  const previous = snapshots[snapshots.length - 2]?.metrics ?? {};

  const momentum: Record<string, number> = {};
  for (const key of Object.keys(latest)) {
    if (typeof latest[key] === 'number' && typeof previous[key] === 'number') {
      momentum[key] = latest[key] - previous[key];
    }
  }

  return momentum;
}
