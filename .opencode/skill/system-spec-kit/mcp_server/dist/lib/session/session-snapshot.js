// ───────────────────────────────────────────────────────────────
// MODULE: Session Snapshot
// ───────────────────────────────────────────────────────────────
// Phase 024: Lightweight read-only snapshot of session state.
// Aggregates metrics, graph freshness, and priming status into a
// single object for buildServerInstructions() and agent bootstrap.
import { getSessionMetrics, computeQualityScore, getLastToolCallAt } from './context-metrics.js';
import { isSessionPrimed, getLastActiveSessionId } from '../../hooks/memory-surface.js';
import { getStats as getGraphStats } from '../code-graph/code-graph-db.js';
import { getGraphFreshness } from '../code-graph/ensure-ready.js';
import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
import { trustStateFromStructuralStatus, } from '../context/shared-payload.js';
/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */
const STRUCTURAL_CONTRACT_MAX_TOKENS = 500;
/* ───────────────────────────────────────────────────────────────
   3. HELPERS
──────────────────────────────────────────────────────────────── */
function resolveGraphFreshness() {
    try {
        return getGraphFreshness(process.cwd());
    }
    catch {
        return 'error';
    }
}
function estimateTextTokens(text) {
    return Math.ceil(text.length / 4);
}
function truncateTextToTokenBudget(text, maxTokens) {
    if (maxTokens <= 0) {
        return '';
    }
    if (estimateTextTokens(text) <= maxTokens) {
        return text;
    }
    const maxChars = Math.max(0, (maxTokens * 4) - 3);
    return `${text.slice(0, maxChars).trimEnd()}...`;
}
function estimateStructuralContractTokens(summary, highlights, recommendedAction) {
    return estimateTextTokens([
        summary,
        ...(highlights ?? []),
        recommendedAction,
    ].join('\n'));
}
function fitStructuralContractBudget(summary, highlights, recommendedAction) {
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
export function getSessionSnapshot() {
    const now = Date.now();
    // Metrics (safe — in-memory only)
    let specFolder = null;
    let currentTask = null;
    try {
        const metrics = getSessionMetrics();
        specFolder = metrics.currentSpecFolder;
        if (typeof metrics.currentTask === 'string' || metrics.currentTask === null) {
            currentTask = metrics.currentTask;
        }
    }
    catch { /* metrics unavailable */ }
    // Graph freshness
    const graphFreshness = resolveGraphFreshness();
    // CocoIndex availability
    let cocoIndexAvailable = false;
    try {
        cocoIndexAvailable = isCocoIndexAvailable();
    }
    catch { /* unavailable */ }
    // Quality score
    let sessionQuality = 'unknown';
    try {
        const qs = computeQualityScore();
        sessionQuality = qs.level;
    }
    catch { /* unknown */ }
    // Last tool call
    let lastToolCallAgoMs = null;
    try {
        const last = getLastToolCallAt();
        if (last !== null)
            lastToolCallAgoMs = now - last;
    }
    catch { /* null */ }
    // Priming status
    let primed = false;
    try {
        const primingSessionId = getLastActiveSessionId();
        primed = primingSessionId ? isSessionPrimed(primingSessionId) : false;
    }
    catch { /* not primed */ }
    // Build routing recommendation
    const routingParts = [];
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
export function buildStructuralBootstrapContract(sourceSurface) {
    const graphFreshness = resolveGraphFreshness();
    let status;
    if (graphFreshness === 'fresh') {
        status = 'ready';
    }
    else if (graphFreshness === 'stale') {
        status = 'stale';
    }
    else {
        status = 'missing';
    }
    let summary;
    let highlights;
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
        }
        catch {
            summary = 'Code graph available (structural context ready)';
        }
    }
    else if (status === 'stale') {
        try {
            const stats = getGraphStats();
            summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
        }
        catch {
            summary = 'Code graph data is stale — structural context may be outdated';
        }
    }
    else {
        summary = 'No structural context available — code graph is empty or unavailable';
    }
    let recommendedAction;
    if (status === 'ready') {
        recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
    }
    else if (status === 'stale') {
        recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
    }
    else {
        recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
    }
    const fittedContract = fitStructuralContractBudget(summary, highlights, recommendedAction);
    return {
        status,
        summary: fittedContract.summary,
        highlights: fittedContract.highlights,
        recommendedAction: fittedContract.recommendedAction,
        sourceSurface,
        provenance: {
            producer: 'session_snapshot',
            sourceSurface,
            trustState: trustStateFromStructuralStatus(status),
            generatedAt: new Date().toISOString(),
            lastUpdated: status === 'ready' || status === 'stale'
                ? (() => {
                    try {
                        const stats = getGraphStats();
                        return stats.lastScanTimestamp ?? null;
                    }
                    catch {
                        return null;
                    }
                })()
                : null,
            sourceRefs: ['code-graph-db', 'session-snapshot'],
        },
    };
}
//# sourceMappingURL=session-snapshot.js.map