// ───────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Convergence Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for deep_loop_graph_convergence — composite
// convergence assessment with typed decision, signals, blockers,
// and trace.

import {
  createSnapshot,
  getEdges,
  getNodes,
  getSnapshots,
  type LoopType,
  type CoverageNode,
  type Namespace,
} from '../../lib/coverage-graph/coverage-graph-db.js';
import {
  computeSignals,
  type ConvergenceSignals,
  type ResearchConvergenceSignals,
  type ReviewConvergenceSignals,
  computeResearchQuestionCoverageFromData,
  computeResearchClaimVerificationRateFromData,
  computeResearchContradictionDensityFromData,
  computeResearchSourceDiversityFromData,
  computeResearchEvidenceDepthFromData,
} from '../../lib/coverage-graph/coverage-graph-signals.js';
import {
  findCoverageGaps,
  findContradictions,
  findUnverifiedClaims,
} from '../../lib/coverage-graph/coverage-graph-query.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type ConvergenceDecision = 'CONTINUE' | 'STOP_ALLOWED' | 'STOP_BLOCKED';

export interface ConvergenceBlocker {
  type: string;
  description: string;
  count: number;
  severity: 'blocking' | 'warning';
}

export interface ConvergenceTraceEntry {
  signal: string;
  value: number;
  threshold: number;
  passed: boolean;
  role: 'weighted' | 'blocking_guard';
}

/**
 * Compute a canonical numeric composite score from convergence signals.
 *
 * Phase 008 P1-01 closure: reducers previously either recorded 0 (research)
 * or averaged raw signal values (review) because the handler did not emit a
 * composite score. This helper produces the single authoritative numeric
 * value the reducer-owned `graphConvergenceScore` field should expose.
 *
 * Research signals are weighted as: questionCoverage 0.30, claimVerification
 * 0.25, (1 - contradictionDensity) 0.15, sourceDiversity (capped /3) 0.15,
 * evidenceDepth (capped /5) 0.15. All output is clamped to [0.0, 1.0].
 *
 * Review signals are weighted as: dimensionCoverage 0.25, findingStability
 * 0.20, p0ResolutionRate 0.25, evidenceDensity 0.15, hotspotSaturation 0.15.
 */
function computeCompositeScore(
  signals: ConvergenceSignals,
  loopType: LoopType,
): number {
  if (!signals || typeof signals !== 'object') return 0;

  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  const safe = (value: unknown): number =>
    typeof value === 'number' && Number.isFinite(value) ? value : 0;

  if (loopType === 'research') {
    const r = signals as ResearchConvergenceSignals;
    const normalizedDiversity = Math.min(safe(r.sourceDiversity) / 3.0, 1.0);
    const normalizedDepth = Math.min(safe(r.evidenceDepth) / 5.0, 1.0);
    const invertedContradictions = 1.0 - clamp(safe(r.contradictionDensity));
    const score =
      clamp(safe(r.questionCoverage)) * 0.30 +
      clamp(safe(r.claimVerificationRate)) * 0.25 +
      invertedContradictions * 0.15 +
      normalizedDiversity * 0.15 +
      normalizedDepth * 0.15;
    return Math.round(clamp(score) * 1000) / 1000;
  }

  const v = signals as ReviewConvergenceSignals;
  const score =
    clamp(safe(v.dimensionCoverage)) * 0.25 +
    clamp(safe(v.findingStability)) * 0.20 +
    clamp(safe(v.p0ResolutionRate)) * 0.25 +
    clamp(safe(v.evidenceDensity)) * 0.15 +
    clamp(safe(v.hotspotSaturation)) * 0.15;
  return Math.round(clamp(score) * 1000) / 1000;
}

export interface ConvergenceArgs {
  specFolder: string;
  loopType: LoopType;
  sessionId: string;
  iteration?: number;
  persistSnapshot?: boolean;
}

export interface ScopedCoverageStats {
  totalNodes: number;
  totalEdges: number;
  nodesByKind: Record<string, number>;
  edgesByRelation: Record<string, number>;
  lastIteration: number | null;
}

// ───────────────────────────────────────────────────────────────
// 2. THRESHOLDS
// ───────────────────────────────────────────────────────────────

/** Research convergence thresholds */
const RESEARCH_THRESHOLDS = {
  questionCoverage: 0.7,
  claimVerificationRate: 0.6,
  contradictionDensity: 0.15, // max allowed
  sourceDiversity: 1.5,      // blocking guard
  evidenceDepth: 1.5,        // blocking guard
};

/** Review convergence thresholds */
const REVIEW_THRESHOLDS = {
  dimensionCoverage: 0.8,
  findingStability: 0.7,
  p0ResolutionRate: 0.9,
  evidenceDensity: 1.0,
  hotspotSaturation: 0.6,
};

// ───────────────────────────────────────────────────────────────
// 3. HANDLER
// ───────────────────────────────────────────────────────────────

/** Handle deep_loop_graph_convergence tool call */
export async function handleCoverageGraphConvergence(
  args: ConvergenceArgs,
): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    if (!args.specFolder || typeof args.specFolder !== 'string') {
      return errorResponse('specFolder is required');
    }
    if (args.loopType !== 'research' && args.loopType !== 'review') {
      return errorResponse('loopType must be "research" or "review"');
    }
    if (!args.sessionId || typeof args.sessionId !== 'string') {
      return errorResponse('sessionId is required for non-admin reads');
    }

    const ns: Namespace = {
      specFolder: args.specFolder,
      loopType: args.loopType,
      sessionId: args.sessionId,
    };
    const stats = computeScopedStats(ns);

    // Empty graph: can't make convergence decisions
    if (stats.totalNodes === 0) {
      return okResponse({
        decision: 'CONTINUE' as ConvergenceDecision,
        reason: 'Graph is empty; insufficient data for convergence assessment',
        signals: null,
        blockers: [],
        trace: [],
        namespace: buildNamespacePayload(ns),
        scopeMode: 'session',
        nodeCount: 0,
        edgeCount: 0,
      });
    }

    // Compute signals
    const signals = computeScopedSignals(ns);
    const momentum = computeScopedMomentum(ns);

    // Persist snapshot if requested
    if (args.persistSnapshot && args.iteration !== undefined) {
      createSnapshot({
        specFolder: args.specFolder,
        loopType: args.loopType,
        sessionId: args.sessionId,
        iteration: args.iteration,
        metrics: {
          ...signals,
          nodeCount: stats.totalNodes,
          edgeCount: stats.totalEdges,
        },
        nodeCount: stats.totalNodes,
        edgeCount: stats.totalEdges,
      });
    }

    // Evaluate convergence
    const blockers: ConvergenceBlocker[] = [];
    const trace: ConvergenceTraceEntry[] = [];

    if (args.loopType === 'research') {
      evaluateResearchConvergence(
        signals as ResearchConvergenceSignals,
        ns,
        blockers,
        trace,
      );
    } else {
      evaluateReviewConvergence(
        signals as ReviewConvergenceSignals,
        ns,
        blockers,
        trace,
      );
    }

    // Determine decision
    const blockingBlockers = blockers.filter(b => b.severity === 'blocking');
    let decision: ConvergenceDecision;

    if (blockingBlockers.length > 0) {
      decision = 'STOP_BLOCKED';
    } else if (trace.every(t => t.passed)) {
      decision = 'STOP_ALLOWED';
    } else {
      decision = 'CONTINUE';
    }

    const reason = buildDecisionReason(decision, blockingBlockers, trace);

    // Phase 008 P1-01: emit a single canonical numeric score alongside the
    // raw signals so reducer-owned `graphConvergenceScore` can consume it
    // directly without fallback math.
    const score = computeCompositeScore(signals, args.loopType);
    const signalsWithScore = { ...signals, score };

    return okResponse({
      decision,
      reason,
      score,
      signals: signalsWithScore,
      blockers,
      trace,
      momentum,
      namespace: buildNamespacePayload(ns),
      scopeMode: 'session',
      notes: ['Convergence signals were computed from the session-scoped subgraph only.'],
      snapshotPersistence: args.persistSnapshot ? 'persisted' : 'not_requested',
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
      lastIteration: stats.lastIteration,
    });
  } catch (err: unknown) {
    return errorResponse(
      `Convergence assessment failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

function buildNamespacePayload(ns: Namespace): Record<string, unknown> {
  return {
    specFolder: ns.specFolder,
    loopType: ns.loopType,
    ...(ns.sessionId ? { sessionId: ns.sessionId } : {}),
  };
}

function parseMetadata(metadata: CoverageNode['metadata']): Record<string, unknown> {
  return metadata && typeof metadata === 'object' ? metadata : {};
}

export function computeScopedStats(ns: Namespace): ScopedCoverageStats {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);
  const snapshots = getSnapshots(ns.specFolder, ns.loopType, ns.sessionId);

  const nodesByKind: Record<string, number> = {};
  for (const node of nodes) {
    nodesByKind[node.kind] = (nodesByKind[node.kind] ?? 0) + 1;
  }

  const edgesByRelation: Record<string, number> = {};
  for (const edge of edges) {
    edgesByRelation[edge.relation] = (edgesByRelation[edge.relation] ?? 0) + 1;
  }

  return {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    nodesByKind,
    edgesByRelation,
    lastIteration: snapshots.length > 0 ? snapshots[snapshots.length - 1].iteration : null,
  };
}

function computeScopedResearchSignals(ns: Namespace): ResearchConvergenceSignals {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);

  return {
    questionCoverage: computeResearchQuestionCoverageFromData(nodes, edges),
    claimVerificationRate: computeResearchClaimVerificationRateFromData(nodes),
    contradictionDensity: computeResearchContradictionDensityFromData(edges),
    sourceDiversity: computeResearchSourceDiversityFromData(nodes, edges),
    evidenceDepth: computeResearchEvidenceDepthFromData(nodes, edges),
  };
}

function computeScopedReviewSignals(ns: Namespace): ReviewConvergenceSignals {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);

  const dimensionIds = new Set(nodes.filter(node => node.kind === 'DIMENSION').map(node => node.id));
  const findingNodes = nodes.filter(node => node.kind === 'FINDING');
  const fileNodes = nodes.filter(node => node.kind === 'FILE');

  const coversEdges = edges.filter(edge => edge.relation === 'COVERS');
  const contradictionEdges = edges.filter(edge => edge.relation === 'CONTRADICTS');
  const evidenceEdges = edges.filter(edge => edge.relation === 'EVIDENCE_FOR');
  const resolvesTargetIds = new Set(
    edges.filter(edge => edge.relation === 'RESOLVES').map(edge => edge.targetId),
  );

  const coveredDimensionIds = new Set(
    coversEdges.map(edge => edge.sourceId).filter(sourceId => dimensionIds.has(sourceId)),
  );

  const contradictionNodeIds = new Set<string>();
  for (const edge of contradictionEdges) {
    contradictionNodeIds.add(edge.sourceId);
    contradictionNodeIds.add(edge.targetId);
  }

  const p0Findings = findingNodes.filter(node => parseMetadata(node.metadata).severity === 'P0');

  const hotspotFiles = fileNodes.filter(node => {
    const hotspotScore = parseMetadata(node.metadata).hotspot_score;
    return typeof hotspotScore === 'number' && hotspotScore > 0;
  });

  let saturatedHotspots = 0;
  for (const file of hotspotFiles) {
    const coveringDimensions = new Set(
      coversEdges
        .filter(edge => edge.targetId === file.id)
        .map(edge => edge.sourceId)
        .filter(sourceId => dimensionIds.has(sourceId)),
    );
    if (coveringDimensions.size >= 2) saturatedHotspots++;
  }

  return {
    dimensionCoverage: dimensionIds.size > 0 ? coveredDimensionIds.size / dimensionIds.size : 0,
    findingStability: findingNodes.length > 0
      ? findingNodes.filter(node => !contradictionNodeIds.has(node.id)).length / findingNodes.length
      : 0,
    p0ResolutionRate: p0Findings.length > 0
      ? p0Findings.filter(node => resolvesTargetIds.has(node.id)).length / p0Findings.length
      : 1,
    evidenceDensity: findingNodes.length > 0 ? evidenceEdges.length / findingNodes.length : 0,
    hotspotSaturation: hotspotFiles.length > 0 ? saturatedHotspots / hotspotFiles.length : 1,
  };
}

export function computeScopedSignals(ns: Namespace): ConvergenceSignals {
  if (!ns.sessionId) {
    return computeSignals(ns);
  }
  return ns.loopType === 'research'
    ? computeScopedResearchSignals(ns)
    : computeScopedReviewSignals(ns);
}

export function computeScopedMomentum(ns: Namespace): Record<string, number> | null {
  const snapshots = getSnapshots(ns.specFolder, ns.loopType, ns.sessionId);
  if (snapshots.length < 2) return null;

  const latest = snapshots[snapshots.length - 1]?.metrics ?? {};
  const previous = snapshots[snapshots.length - 2]?.metrics ?? {};
  const momentum: Record<string, number> = {};

  for (const key of Object.keys(latest)) {
    const latestValue = latest[key];
    const previousValue = previous[key];
    if (typeof latestValue === 'number' && typeof previousValue === 'number') {
      momentum[key] = latestValue - previousValue;
    }
  }

  return Object.keys(momentum).length > 0 ? momentum : null;
}

// ───────────────────────────────────────────────────────────────
// 4. RESEARCH CONVERGENCE EVALUATION
// ───────────────────────────────────────────────────────────────

function evaluateResearchConvergence(
  signals: ResearchConvergenceSignals,
  ns: Namespace,
  blockers: ConvergenceBlocker[],
  trace: ConvergenceTraceEntry[],
): void {
  const t = RESEARCH_THRESHOLDS;

  // Weighted signals
  trace.push({
    signal: 'questionCoverage',
    value: signals.questionCoverage,
    threshold: t.questionCoverage,
    passed: signals.questionCoverage >= t.questionCoverage,
    role: 'weighted',
  });

  trace.push({
    signal: 'claimVerificationRate',
    value: signals.claimVerificationRate,
    threshold: t.claimVerificationRate,
    passed: signals.claimVerificationRate >= t.claimVerificationRate,
    role: 'weighted',
  });

  trace.push({
    signal: 'contradictionDensity',
    value: signals.contradictionDensity,
    threshold: t.contradictionDensity,
    passed: signals.contradictionDensity <= t.contradictionDensity,
    role: 'weighted',
  });

  // Blocking guards
  trace.push({
    signal: 'sourceDiversity',
    value: signals.sourceDiversity,
    threshold: t.sourceDiversity,
    passed: signals.sourceDiversity >= t.sourceDiversity,
    role: 'blocking_guard',
  });

  trace.push({
    signal: 'evidenceDepth',
    value: signals.evidenceDepth,
    threshold: t.evidenceDepth,
    passed: signals.evidenceDepth >= t.evidenceDepth,
    role: 'blocking_guard',
  });

  // Check blocking guards
  if (signals.sourceDiversity < t.sourceDiversity) {
    blockers.push({
      type: 'source_diversity_guard',
      description: `Source diversity (${signals.sourceDiversity.toFixed(2)}) is below the blocking threshold (${t.sourceDiversity}). STOP is blocked until diverse sources cover key questions.`,
      count: 1,
      severity: 'blocking',
    });
  }

  if (signals.evidenceDepth < t.evidenceDepth) {
    blockers.push({
      type: 'evidence_depth_guard',
      description: `Evidence depth (${signals.evidenceDepth.toFixed(2)}) is below the blocking threshold (${t.evidenceDepth}). STOP is blocked until question->finding->source chains are deeper.`,
      count: 1,
      severity: 'blocking',
    });
  }

  // Check for uncovered questions as warnings
  const gaps = findCoverageGaps(ns);
  if (gaps.length > 0) {
    blockers.push({
      type: 'uncovered_questions',
      description: `${gaps.length} question(s) have no coverage edges`,
      count: gaps.length,
      severity: signals.questionCoverage < t.questionCoverage ? 'blocking' : 'warning',
    });
  }

  // Check for active contradictions
  const contradictions = findContradictions(ns);
  if (contradictions.length > 0 && signals.contradictionDensity > t.contradictionDensity) {
    blockers.push({
      type: 'high_contradiction_density',
      description: `${contradictions.length} contradiction(s) detected with density above threshold`,
      count: contradictions.length,
      severity: 'blocking',
    });
  }

  // Check for unverified claims
  const unverified = findUnverifiedClaims(ns);
  if (unverified.length > 0) {
    blockers.push({
      type: 'unverified_claims',
      description: `${unverified.length} claim(s) remain unverified`,
      count: unverified.length,
      severity: signals.claimVerificationRate < t.claimVerificationRate ? 'blocking' : 'warning',
    });
  }
}

// ───────────────────────────────────────────────────────────────
// 5. REVIEW CONVERGENCE EVALUATION
// ───────────────────────────────────────────────────────────────

function evaluateReviewConvergence(
  signals: ReviewConvergenceSignals,
  ns: Namespace,
  blockers: ConvergenceBlocker[],
  trace: ConvergenceTraceEntry[],
): void {
  const t = REVIEW_THRESHOLDS;

  trace.push({
    signal: 'dimensionCoverage',
    value: signals.dimensionCoverage,
    threshold: t.dimensionCoverage,
    passed: signals.dimensionCoverage >= t.dimensionCoverage,
    role: 'blocking_guard',
  });

  trace.push({
    signal: 'findingStability',
    value: signals.findingStability,
    threshold: t.findingStability,
    passed: signals.findingStability >= t.findingStability,
    role: 'weighted',
  });

  trace.push({
    signal: 'p0ResolutionRate',
    value: signals.p0ResolutionRate,
    threshold: t.p0ResolutionRate,
    passed: signals.p0ResolutionRate >= t.p0ResolutionRate,
    role: 'weighted',
  });

  trace.push({
    signal: 'evidenceDensity',
    value: signals.evidenceDensity,
    threshold: t.evidenceDensity,
    passed: signals.evidenceDensity >= t.evidenceDensity,
    role: 'weighted',
  });

  trace.push({
    signal: 'hotspotSaturation',
    value: signals.hotspotSaturation,
    threshold: t.hotspotSaturation,
    passed: signals.hotspotSaturation >= t.hotspotSaturation,
    role: 'weighted',
  });

  // Check for unresolved P0 findings
  if (signals.p0ResolutionRate < t.p0ResolutionRate) {
    blockers.push({
      type: 'unresolved_p0_findings',
      description: `P0 resolution rate (${(signals.p0ResolutionRate * 100).toFixed(0)}%) is below threshold (${(t.p0ResolutionRate * 100).toFixed(0)}%)`,
      count: 1,
      severity: 'blocking',
    });
  }

  // Check dimension coverage — blocking gate for review mode.
  // Incomplete dimension coverage means the review is not yet comprehensive
  // enough to stop, even if finding stability looks favorable.
  if (signals.dimensionCoverage < t.dimensionCoverage) {
    const gaps = findCoverageGaps(ns);
    blockers.push({
      type: 'uncovered_dimensions',
      description: `Dimension coverage (${(signals.dimensionCoverage * 100).toFixed(0)}%) is below threshold (${(t.dimensionCoverage * 100).toFixed(0)}%). ${gaps.length} gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.`,
      count: gaps.length,
      severity: 'blocking',
    });
  }

  // Check contradictions
  const contradictions = findContradictions(ns);
  if (contradictions.length > 0 && signals.findingStability < t.findingStability) {
    blockers.push({
      type: 'unstable_findings',
      description: `${contradictions.length} contradiction(s) are lowering finding stability below threshold`,
      count: contradictions.length,
      severity: 'blocking',
    });
  }
}

// ───────────────────────────────────────────────────────────────
// 6. HELPERS
// ───────────────────────────────────────────────────────────────

function buildDecisionReason(
  decision: ConvergenceDecision,
  blockingBlockers: ConvergenceBlocker[],
  trace: ConvergenceTraceEntry[],
): string {
  switch (decision) {
    case 'STOP_ALLOWED':
      return 'All convergence signals pass thresholds; STOP is allowed pending newInfoRatio agreement.';
    case 'STOP_BLOCKED': {
      const blockerTypes = blockingBlockers.map(b => b.type).join(', ');
      return `STOP is blocked by ${blockingBlockers.length} blocker(s): ${blockerTypes}`;
    }
    case 'CONTINUE': {
      const failing = trace.filter(t => !t.passed).map(t => t.signal).join(', ');
      return `Convergence signals not yet met: ${failing}. Continue iterating.`;
    }
  }
}

function okResponse(data: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data }, null, 2),
    }],
  };
}

function errorResponse(error: string): { content: Array<{ type: string; text: string }> } {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'error', error }),
    }],
  };
}
