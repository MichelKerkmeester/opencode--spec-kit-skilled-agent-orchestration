// ───────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Convergence Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for deep_loop_graph_convergence — composite
// convergence assessment with typed decision, signals, blockers,
// and trace.

import {
  getStats,
  type LoopType,
} from '../../lib/coverage-graph/coverage-graph-db.js';
import {
  computeSignals,
  computeMomentum,
  createSignalSnapshot,
  type Namespace,
  type ResearchConvergenceSignals,
  type ReviewConvergenceSignals,
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

export interface ConvergenceArgs {
  specFolder: string;
  loopType: LoopType;
  iteration?: number;
  persistSnapshot?: boolean;
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

    const ns: Namespace = { specFolder: args.specFolder, loopType: args.loopType };
    const stats = getStats(args.specFolder, args.loopType);

    // Empty graph: can't make convergence decisions
    if (stats.totalNodes === 0) {
      return okResponse({
        decision: 'CONTINUE' as ConvergenceDecision,
        reason: 'Graph is empty; insufficient data for convergence assessment',
        signals: null,
        blockers: [],
        trace: [],
        namespace: { specFolder: args.specFolder, loopType: args.loopType },
        nodeCount: 0,
        edgeCount: 0,
      });
    }

    // Compute signals
    const signals = computeSignals(ns);
    const momentum = computeMomentum(args.specFolder, args.loopType);

    // Persist snapshot if requested
    if (args.persistSnapshot && args.iteration !== undefined) {
      createSignalSnapshot(ns, args.iteration);
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

    return okResponse({
      decision,
      reason,
      signals,
      blockers,
      trace,
      momentum,
      namespace: { specFolder: args.specFolder, loopType: args.loopType },
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
    role: 'weighted',
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

  // Check dimension coverage
  if (signals.dimensionCoverage < t.dimensionCoverage) {
    const gaps = findCoverageGaps(ns);
    blockers.push({
      type: 'uncovered_dimensions',
      description: `Dimension coverage (${(signals.dimensionCoverage * 100).toFixed(0)}%) is below threshold. ${gaps.length} gap(s) found.`,
      count: gaps.length,
      severity: 'warning',
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
