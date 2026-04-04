// ───────────────────────────────────────────────────────────────
// MODULE: Session Health Handler
// ───────────────────────────────────────────────────────────────
// T018: MCP tool handler for session_health — reports session
// readiness, code graph freshness, and priming status.
import { isSessionPrimed, getSessionTimestamps, getLastActiveSessionId, getCodeGraphStatusSnapshot, } from '../hooks/memory-surface.js';
import { computeQualityScore, getLastToolCallAt } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import { createSharedPayloadEnvelope, trustStateFromStructuralStatus, } from '../lib/context/shared-payload.js';
import { buildCodeGraphOpsContract, } from '../lib/code-graph/ops-hardening.js';
/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const SIXTY_MINUTES_MS = 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */
/** Handle session_health tool call */
export async function handleSessionHealth() {
    const now = Date.now();
    const { serverStartedAt } = getSessionTimestamps();
    // F047: Use context-metrics as single source of truth for lastToolCallAt
    // to eliminate dual-state drift with memory-surface's separate timestamp.
    const metricsLastToolCall = getLastToolCallAt();
    const lastToolCallAt = metricsLastToolCall ?? serverStartedAt;
    const primingSessionId = getLastActiveSessionId();
    const primed = primingSessionId ? isSessionPrimed(primingSessionId) : false;
    // Determine graph freshness
    let graphFreshness = 'error';
    // Wire specFolder from context-metrics (fixes P1: dead field)
    let specFolder = null;
    try {
        const { getSessionMetrics } = await import('../lib/session/context-metrics.js');
        specFolder = getSessionMetrics().currentSpecFolder;
    }
    catch { /* metrics module may not be loaded */ }
    try {
        const snapshot = getCodeGraphStatusSnapshot();
        if (snapshot.status === 'ok' && snapshot.data) {
            const totalFiles = snapshot.data.totalFiles ?? 0;
            const lastScan = snapshot.data.lastScanAt;
            if (totalFiles === 0) {
                graphFreshness = 'empty';
            }
            else if (!lastScan || (now - new Date(lastScan).getTime() > TWENTY_FOUR_HOURS_MS)) {
                graphFreshness = 'stale';
            }
            else {
                graphFreshness = 'fresh';
            }
        }
    }
    catch {
        graphFreshness = 'error';
    }
    // Phase 027: Structural bootstrap contract for health surface
    const structuralContext = buildStructuralBootstrapContract('session_health');
    const sessionAgeMs = now - serverStartedAt;
    const lastToolCallAgoMs = now - lastToolCallAt;
    // Status determination logic
    let status;
    if (!primed || lastToolCallAgoMs > SIXTY_MINUTES_MS) {
        status = 'stale';
    }
    else if (graphFreshness === 'stale' || graphFreshness === 'empty' || lastToolCallAgoMs > FIFTEEN_MINUTES_MS) {
        status = 'warning';
    }
    else {
        status = 'ok';
    }
    // Build human-readable hints
    const hints = [];
    if (!primed) {
        hints.push('Session has not been primed yet. Make any tool call to trigger auto-priming.');
    }
    if (structuralContext.status === 'stale') {
        hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
    }
    else if (structuralContext.status === 'missing') {
        hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
    }
    if (lastToolCallAgoMs > SIXTY_MINUTES_MS) {
        hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
    }
    else if (lastToolCallAgoMs > FIFTEEN_MINUTES_MS) {
        hints.push('No tool calls in >15 min. Session context may be drifting.');
    }
    // Phase 023: Compute quality score from context metrics
    const qualityScore = computeQualityScore();
    const payloadContract = createSharedPayloadEnvelope({
        kind: 'health',
        sections: [
            {
                key: 'session-health',
                title: 'Session Health',
                content: `status=${status}; priming=${primed ? 'primed' : 'not_primed'}; graph=${graphFreshness}; specFolder=${specFolder ?? 'none'}`,
                source: 'session',
            },
            {
                key: 'quality-score',
                title: 'Quality Score',
                content: `level=${qualityScore.level}; score=${qualityScore.score}`,
                source: 'operational',
            },
            {
                key: 'structural-context',
                title: 'Structural Context',
                content: structuralContext.summary,
                source: 'code-graph',
            },
        ],
        summary: `Session health is ${status}; graph freshness is ${graphFreshness}; structural status is ${structuralContext.status}`,
        provenance: {
            producer: 'session_health',
            sourceSurface: 'session_health',
            trustState: trustStateFromStructuralStatus(structuralContext.status),
            generatedAt: new Date().toISOString(),
            lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
            sourceRefs: ['memory-surface', 'context-metrics', 'session-snapshot'],
        },
    });
    const graphOps = buildCodeGraphOpsContract({
        graphFreshness,
        sourceSurface: 'session_health',
    });
    const result = {
        status,
        details: {
            sessionAgeMs,
            lastToolCallAgoMs,
            graphFreshness,
            specFolder,
            primingStatus: primed ? 'primed' : 'not_primed',
        },
        qualityScore,
        structuralContext,
        payloadContract,
        graphOps,
        hints,
    };
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({ status: 'ok', data: result }, null, 2),
            }],
    };
}
//# sourceMappingURL=session-health.js.map