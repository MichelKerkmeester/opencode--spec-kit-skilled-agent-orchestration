// ───────────────────────────────────────────────────────────────
// MODULE: Session Snapshot
// ───────────────────────────────────────────────────────────────
// Phase 024: Lightweight read-only snapshot of session state.
// Aggregates metrics, graph freshness, and priming status into a
// single object for buildServerInstructions() and agent bootstrap.

import { getSessionMetrics, computeQualityScore, getLastToolCallAt } from './context-metrics.js';
import { isSessionPrimed, getLastActiveSessionId } from '../../hooks/memory-surface.js';
import { getStats as getGraphStats } from '../code-graph/code-graph-db.js';
import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export interface SessionSnapshot {
  specFolder: string | null;
  currentTask: string | null;
  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
  cocoIndexAvailable: boolean;
  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
  lastToolCallAgoMs: number | null;
  primed: boolean;
  routingRecommendation: string;
}

/**
 * Phase 027: Structural Bootstrap Contract — shared by all non-hook surfaces.
 * Single source of truth for structural context in startup/recovery flows.
 * Token budget: 250-400 tokens (hard ceiling 500 including guidance).
 */
export interface StructuralBootstrapContract {
  status: 'ready' | 'stale' | 'missing';
  summary: string;
  highlights?: string[];
  recommendedAction: string;
  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

const GRAPH_STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours
const STRUCTURAL_CONTRACT_MAX_TOKENS = 500;

/* ───────────────────────────────────────────────────────────────
   3. HELPERS
──────────────────────────────────────────────────────────────── */

function resolveGraphFreshness(): SessionSnapshot['graphFreshness'] {
  try {
    const stats = getGraphStats();
    if (stats.totalFiles === 0) return 'empty';
    if (!stats.lastScanTimestamp) return 'stale';
    const age = Date.now() - new Date(stats.lastScanTimestamp).getTime();
    return age <= GRAPH_STALE_THRESHOLD_MS ? 'fresh' : 'stale';
  } catch {
    return 'error';
  }
}

function estimateTextTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function truncateTextToTokenBudget(text: string, maxTokens: number): string {
  if (maxTokens <= 0) {
    return '';
  }

  if (estimateTextTokens(text) <= maxTokens) {
    return text;
  }

  const maxChars = Math.max(0, (maxTokens * 4) - 3);
  return `${text.slice(0, maxChars).trimEnd()}...`;
}

function estimateStructuralContractTokens(
  summary: string,
  highlights: string[] | undefined,
  recommendedAction: string,
): number {
  return estimateTextTokens([
    summary,
    ...(highlights ?? []),
    recommendedAction,
  ].join('\n'));
}

function fitStructuralContractBudget(
  summary: string,
  highlights: string[] | undefined,
  recommendedAction: string,
): {
  summary: string;
  highlights: string[] | undefined;
  recommendedAction: string;
} {
  let fittedSummary = summary;
  let fittedHighlights = highlights ? [...highlights] : undefined;
  let fittedRecommendedAction = recommendedAction;

  while (fittedHighlights && fittedHighlights.length > 0
    && estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
    fittedHighlights = fittedHighlights.slice(0, -1);
  }

  if (estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
    const reservedTokens = estimateStructuralContractTokens('', fittedHighlights, fittedRecommendedAction);
    const summaryBudget = Math.max(40, STRUCTURAL_CONTRACT_MAX_TOKENS - reservedTokens);
    fittedSummary = truncateTextToTokenBudget(fittedSummary, summaryBudget);
  }

  if (estimateStructuralContractTokens(fittedSummary, fittedHighlights, fittedRecommendedAction) > STRUCTURAL_CONTRACT_MAX_TOKENS) {
    const reservedTokens = estimateStructuralContractTokens(fittedSummary, fittedHighlights, '');
    const actionBudget = Math.max(20, STRUCTURAL_CONTRACT_MAX_TOKENS - reservedTokens);
    fittedRecommendedAction = truncateTextToTokenBudget(fittedRecommendedAction, actionBudget);
  }

  return {
    summary: fittedSummary,
    highlights: fittedHighlights,
    recommendedAction: fittedRecommendedAction,
  };
}

/* ───────────────────────────────────────────────────────────────
   4. PUBLIC API
──────────────────────────────────────────────────────────────── */

/** Build a read-only snapshot of the current session state. */
export function getSessionSnapshot(): SessionSnapshot {
  const now = Date.now();

  // Metrics (safe — in-memory only)
  let specFolder: string | null = null;
  let currentTask: string | null = null;
  try {
    const metrics = getSessionMetrics() as ReturnType<typeof getSessionMetrics> & {
      currentTask?: unknown;
    };
    specFolder = metrics.currentSpecFolder;
    if (typeof metrics.currentTask === 'string' || metrics.currentTask === null) {
      currentTask = metrics.currentTask;
    }
  } catch { /* metrics unavailable */ }

  // Graph freshness
  const graphFreshness = resolveGraphFreshness();

  // CocoIndex availability
  let cocoIndexAvailable = false;
  try {
    cocoIndexAvailable = isCocoIndexAvailable();
  } catch { /* unavailable */ }

  // Quality score
  let sessionQuality: SessionSnapshot['sessionQuality'] = 'unknown';
  try {
    const qs = computeQualityScore();
    sessionQuality = qs.level;
  } catch { /* unknown */ }

  // Last tool call
  let lastToolCallAgoMs: number | null = null;
  try {
    const last = getLastToolCallAt();
    if (last !== null) lastToolCallAgoMs = now - last;
  } catch { /* null */ }

  // Priming status
  let primed = false;
  try {
    const primingSessionId = getLastActiveSessionId();
    primed = primingSessionId ? isSessionPrimed(primingSessionId) : false;
  } catch { /* not primed */ }

  // Build routing recommendation
  const routingParts: string[] = [];
  if (cocoIndexAvailable) {
    routingParts.push('semantic/concept search → mcp__cocoindex_code__search');
  }
  if (graphFreshness === 'fresh') {
    routingParts.push('structural queries (callers, deps) → code_graph_query');
  }
  routingParts.push('exact text/regex → Grep');
  const routingRecommendation = routingParts.join(' | ');

  return {
    specFolder,
    currentTask,
    graphFreshness,
    cocoIndexAvailable,
    sessionQuality,
    lastToolCallAgoMs,
    primed,
    routingRecommendation,
  };
}

/**
 * Phase 027: Build a structural bootstrap contract for a given surface.
 * Reuses resolveGraphFreshness() and getGraphStats() from this module.
 * Keeps output compact (targets 250-400 tokens, ceiling 500).
 */
export function buildStructuralBootstrapContract(
  sourceSurface: StructuralBootstrapContract['sourceSurface']
): StructuralBootstrapContract {
  const graphFreshness = resolveGraphFreshness();

  let status: StructuralBootstrapContract['status'];
  if (graphFreshness === 'fresh') {
    status = 'ready';
  } else if (graphFreshness === 'stale') {
    status = 'stale';
  } else {
    status = 'missing';
  }

  let summary: string;
  let highlights: string[] | undefined;

  if (status === 'ready') {
    try {
      const stats = getGraphStats();
      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes, ${stats.totalEdges} edges (fresh)`;
      const topKinds = Object.entries(stats.nodesByKind)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      if (topKinds.length > 0) {
        highlights = topKinds.map(([kind, count]) => `${kind}: ${count}`);
      }
    } catch {
      summary = 'Code graph available (structural context ready)';
    }
  } else if (status === 'stale') {
    try {
      const stats = getGraphStats();
      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — >24h since last scan)`;
    } catch {
      summary = 'Code graph data is stale — structural context may be outdated';
    }
  } else {
    summary = 'No structural context available — code graph is empty or unavailable';
  }

  let recommendedAction: string;
  if (status === 'ready') {
    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
  } else if (status === 'stale') {
    recommendedAction = 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.';
  } else {
    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
  }

  const fittedContract = fitStructuralContractBudget(summary, highlights, recommendedAction);

  return {
    status,
    summary: fittedContract.summary,
    highlights: fittedContract.highlights,
    recommendedAction: fittedContract.recommendedAction,
    sourceSurface,
  };
}
