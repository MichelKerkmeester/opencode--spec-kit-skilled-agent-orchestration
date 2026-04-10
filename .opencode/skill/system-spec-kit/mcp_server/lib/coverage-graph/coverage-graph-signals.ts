// ───────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Signals
// ───────────────────────────────────────────────────────────────
// Server-side signal computation and snapshot generation for
// research and review convergence metrics.
// Follows graph-signals.ts patterns for degree, depth, and momentum.

import type Database from 'better-sqlite3';
import {
  getDb,
  getNodes,
  getEdges,
  createSnapshot,
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
  const d = getDb();
  const { specFolder, loopType } = ns;

  // questionCoverage: questions with >= 2 ANSWERS edges / all questions
  const allQuestions = d.prepare(
    `SELECT COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND kind = 'QUESTION'`,
  ).get(specFolder, loopType) as { c: number };

  const coveredQuestions = d.prepare(`
    SELECT COUNT(*) as c FROM coverage_nodes n
    WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = 'QUESTION'
      AND (SELECT COUNT(*) FROM coverage_edges e WHERE e.target_id = n.id AND e.relation = 'ANSWERS') >= 2
  `).get(specFolder, loopType) as { c: number };

  const questionCoverage = allQuestions.c > 0
    ? coveredQuestions.c / allQuestions.c
    : 0;

  // claimVerificationRate: claims with status != 'unresolved' / all claims
  const allClaims = d.prepare(
    `SELECT id, metadata FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND kind = 'CLAIM'`,
  ).all(specFolder, loopType) as Array<{ id: string; metadata: string | null }>;

  let verifiedClaims = 0;
  for (const claim of allClaims) {
    if (claim.metadata) {
      try {
        const meta = JSON.parse(claim.metadata);
        if (meta.verification_status && meta.verification_status !== 'unresolved') {
          verifiedClaims++;
        }
      } catch { /* skip invalid JSON */ }
    }
  }

  const claimVerificationRate = allClaims.length > 0
    ? verifiedClaims / allClaims.length
    : 0;

  // contradictionDensity: CONTRADICTS edges / all edges
  const allEdgeCount = (d.prepare(
    `SELECT COUNT(*) as c FROM coverage_edges WHERE spec_folder = ? AND loop_type = ?`,
  ).get(specFolder, loopType) as { c: number }).c;

  const contradictEdgeCount = (d.prepare(
    `SELECT COUNT(*) as c FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND relation = 'CONTRADICTS'`,
  ).get(specFolder, loopType) as { c: number }).c;

  const contradictionDensity = allEdgeCount > 0
    ? contradictEdgeCount / allEdgeCount
    : 0;

  // sourceDiversity: average distinct source quality classes per question
  const sourceDiversity = computeSourceDiversity(d, specFolder, loopType);

  // evidenceDepth: average path length from question -> finding -> source
  const evidenceDepth = computeEvidenceDepth(d, specFolder, loopType);

  return {
    questionCoverage,
    claimVerificationRate,
    contradictionDensity,
    sourceDiversity,
    evidenceDepth,
  };
}

function computeSourceDiversity(d: Database.Database, specFolder: string, loopType: string): number {
  // For each question, find all sources reachable via ANSWERS->CITES paths
  // and count distinct quality_class values
  const questions = d.prepare(
    `SELECT id FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND kind = 'QUESTION'`,
  ).all(specFolder, loopType) as Array<{ id: string }>;

  if (questions.length === 0) return 0;

  let totalDiversity = 0;

  for (const q of questions) {
    // Find findings that ANSWER this question
    const findings = d.prepare(
      `SELECT e.source_id FROM coverage_edges e WHERE e.target_id = ? AND e.relation = 'ANSWERS'`,
    ).all(q.id) as Array<{ source_id: string }>;

    const qualityClasses = new Set<string>();
    for (const f of findings) {
      // Find sources cited by this finding
      const sources = d.prepare(`
        SELECT n.metadata FROM coverage_edges e
        JOIN coverage_nodes n ON n.id = e.target_id
        WHERE e.source_id = ? AND e.relation = 'CITES' AND n.kind = 'SOURCE'
      `).all(f.source_id) as Array<{ metadata: string | null }>;

      for (const s of sources) {
        if (s.metadata) {
          try {
            const meta = JSON.parse(s.metadata);
            if (meta.quality_class) qualityClasses.add(meta.quality_class);
          } catch { /* skip */ }
        }
      }
    }

    totalDiversity += qualityClasses.size;
  }

  return questions.length > 0 ? totalDiversity / questions.length : 0;
}

function computeEvidenceDepth(d: Database.Database, specFolder: string, loopType: string): number {
  // Average path length from question -> finding -> source via ANSWERS + CITES
  const questions = d.prepare(
    `SELECT id FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND kind = 'QUESTION'`,
  ).all(specFolder, loopType) as Array<{ id: string }>;

  if (questions.length === 0) return 0;

  let totalDepth = 0;
  let pathCount = 0;

  for (const q of questions) {
    const findings = d.prepare(
      `SELECT e.source_id FROM coverage_edges e WHERE e.target_id = ? AND e.relation = 'ANSWERS'`,
    ).all(q.id) as Array<{ source_id: string }>;

    for (const f of findings) {
      const sources = d.prepare(
        `SELECT COUNT(*) as c FROM coverage_edges e WHERE e.source_id = ? AND e.relation = 'CITES'`,
      ).get(f.source_id) as { c: number };

      if (sources.c > 0) {
        totalDepth += 2; // question -> finding -> source = depth 2
        pathCount++;
      } else {
        totalDepth += 1; // question -> finding only = depth 1
        pathCount++;
      }
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
  const { specFolder, loopType } = ns;

  // dimensionCoverage: dimensions with >= 1 COVERS edge / all dimensions
  const allDimensions = (d.prepare(
    `SELECT COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND kind = 'DIMENSION'`,
  ).get(specFolder, loopType) as { c: number }).c;

  const coveredDimensions = (d.prepare(`
    SELECT COUNT(*) as c FROM coverage_nodes n
    WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = 'DIMENSION'
      AND EXISTS (
        SELECT 1 FROM coverage_edges e WHERE e.source_id = n.id AND e.relation = 'COVERS'
      )
  `).get(specFolder, loopType) as { c: number }).c;

  const dimensionCoverage = allDimensions > 0 ? coveredDimensions / allDimensions : 0;

  // findingStability: findings with 0 CONTRADICTS edges / all findings
  const allFindings = (d.prepare(
    `SELECT COUNT(*) as c FROM coverage_nodes WHERE spec_folder = ? AND loop_type = ? AND kind = 'FINDING'`,
  ).get(specFolder, loopType) as { c: number }).c;

  const stableFindings = (d.prepare(`
    SELECT COUNT(*) as c FROM coverage_nodes n
    WHERE n.spec_folder = ? AND n.loop_type = ? AND n.kind = 'FINDING'
      AND NOT EXISTS (
        SELECT 1 FROM coverage_edges e
        WHERE (e.source_id = n.id OR e.target_id = n.id) AND e.relation = 'CONTRADICTS'
      )
  `).get(specFolder, loopType) as { c: number }).c;

  const findingStability = allFindings > 0 ? stableFindings / allFindings : 0;

  // p0ResolutionRate: P0 findings with RESOLVES edge / P0 findings
  const allP0 = d.prepare(`
    SELECT id, metadata FROM coverage_nodes
    WHERE spec_folder = ? AND loop_type = ? AND kind = 'FINDING'
  `).all(specFolder, loopType) as Array<{ id: string; metadata: string | null }>;

  let p0Count = 0;
  let p0Resolved = 0;

  for (const finding of allP0) {
    if (finding.metadata) {
      try {
        const meta = JSON.parse(finding.metadata);
        if (meta.severity === 'P0') {
          p0Count++;
          const hasResolve = (d.prepare(
            `SELECT COUNT(*) as c FROM coverage_edges WHERE target_id = ? AND relation = 'RESOLVES'`,
          ).get(finding.id) as { c: number }).c;
          if (hasResolve > 0) p0Resolved++;
        }
      } catch { /* skip */ }
    }
  }

  const p0ResolutionRate = p0Count > 0 ? p0Resolved / p0Count : 1.0; // No P0s = fully resolved

  // evidenceDensity: average EVIDENCE_FOR edges per finding
  const totalEvidenceEdges = (d.prepare(
    `SELECT COUNT(*) as c FROM coverage_edges WHERE spec_folder = ? AND loop_type = ? AND relation = 'EVIDENCE_FOR'`,
  ).get(specFolder, loopType) as { c: number }).c;

  const evidenceDensity = allFindings > 0 ? totalEvidenceEdges / allFindings : 0;

  // hotspotSaturation: hotspot files with >= 2 dimension coverage / hotspot files
  const hotspotSaturation = computeHotspotSaturation(d, specFolder, loopType);

  return {
    dimensionCoverage,
    findingStability,
    p0ResolutionRate,
    evidenceDensity,
    hotspotSaturation,
  };
}

function computeHotspotSaturation(d: Database.Database, specFolder: string, loopType: string): number {
  // Find FILE nodes with hotspot_score > 0 in metadata
  const files = d.prepare(`
    SELECT id, metadata FROM coverage_nodes
    WHERE spec_folder = ? AND loop_type = ? AND kind = 'FILE'
  `).all(specFolder, loopType) as Array<{ id: string; metadata: string | null }>;

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
      JOIN coverage_nodes n ON n.id = e.source_id
      WHERE e.target_id = ? AND e.relation = 'COVERS' AND n.kind = 'DIMENSION'
    `).get(fileId) as { c: number }).c;

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

  // Persist to database
  createSnapshot({
    specFolder: ns.specFolder,
    loopType: ns.loopType,
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
export function computeMomentum(specFolder: string, loopType: LoopType): Record<string, number> | null {
  const d = getDb();
  const snapshots = d.prepare(`
    SELECT metrics FROM coverage_snapshots
    WHERE spec_folder = ? AND loop_type = ?
    ORDER BY iteration DESC LIMIT 2
  `).all(specFolder, loopType) as Array<{ metrics: string }>;

  if (snapshots.length < 2) return null;

  const latest = JSON.parse(snapshots[0].metrics) as Record<string, number>;
  const previous = JSON.parse(snapshots[1].metrics) as Record<string, number>;

  const momentum: Record<string, number> = {};
  for (const key of Object.keys(latest)) {
    if (typeof latest[key] === 'number' && typeof previous[key] === 'number') {
      momentum[key] = latest[key] - previous[key];
    }
  }

  return momentum;
}
