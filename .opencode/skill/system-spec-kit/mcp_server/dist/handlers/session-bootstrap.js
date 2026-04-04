// ───────────────────────────────────────────────────────────────
// MODULE: Session Bootstrap Handler
// ───────────────────────────────────────────────────────────────
// Phase 024 / Item 7: Composite tool that runs session_resume
// + session_health in one call, merging results with hints.
import { handleSessionResume } from './session-resume.js';
import { handleSessionHealth } from './session-health.js';
import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import { createSharedPayloadEnvelope, summarizeUnknown, trustStateFromStructuralStatus, } from '../lib/context/shared-payload.js';
import { buildOpenCodeTransportPlan, coerceSharedPayloadEnvelope, } from '../lib/context/opencode-transport.js';
import { buildCodeGraphOpsContract, } from '../lib/code-graph/ops-hardening.js';
/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */
function extractData(response) {
    try {
        const text = response?.content?.[0]?.text;
        if (typeof text === 'string') {
            const parsed = JSON.parse(text);
            return parsed?.data ?? parsed ?? {};
        }
    }
    catch { /* parse failed */ }
    return {};
}
function extractHints(data) {
    if (Array.isArray(data.hints))
        return data.hints;
    return [];
}
function buildNextActions(resumeData, healthData, structuralContext) {
    const nextActions = new Set();
    if (resumeData.error) {
        nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
    }
    if (healthData.error) {
        nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
    }
    if (structuralContext.recommendedAction) {
        nextActions.add(structuralContext.recommendedAction);
    }
    if (structuralContext.status === 'ready') {
        nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
    }
    else if (structuralContext.status === 'stale') {
        nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
    }
    else {
        nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
    }
    const healthStatus = typeof healthData.status === 'string' ? healthData.status : null;
    if (healthStatus === 'warning' || healthStatus === 'stale') {
        nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
    }
    return [...nextActions].slice(0, 3);
}
/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */
/** Handle session_bootstrap tool call — one-call session setup */
export async function handleSessionBootstrap(args) {
    const startMs = Date.now();
    const allHints = [];
    // Sub-call 1: session_resume with full resume payload
    let resumeData = {};
    try {
        const resumeResponse = await handleSessionResume({
            specFolder: args.specFolder,
        });
        resumeData = extractData(resumeResponse);
        allHints.push(...extractHints(resumeData));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        resumeData = { error: message };
        allHints.push('session_resume failed. Try calling it manually.');
    }
    // Sub-call 2: session_health
    let healthData = {};
    try {
        const healthResponse = await handleSessionHealth();
        healthData = extractData(healthResponse);
        allHints.push(...extractHints(healthData));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        healthData = { error: message };
        allHints.push('session_health failed. Try calling it manually.');
    }
    // Phase 027: Structural bootstrap contract
    const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
    if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
        allHints.push(`Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`);
    }
    // Deduplicate hints
    const uniqueHints = [...new Set(allHints)];
    // Record bootstrap telemetry once for the composite call.
    const durationMs = Date.now() - startMs;
    const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
    recordBootstrapEvent('tool', durationMs, completeness);
    const payloadContract = createSharedPayloadEnvelope({
        kind: 'bootstrap',
        sections: [
            {
                key: 'resume-surface',
                title: 'Resume Surface',
                content: summarizeUnknown(resumeData),
                source: 'memory',
            },
            {
                key: 'health-surface',
                title: 'Health Surface',
                content: summarizeUnknown(healthData),
                source: 'operational',
            },
            {
                key: 'structural-context',
                title: 'Structural Context',
                content: structuralContext.summary,
                source: 'code-graph',
            },
            {
                key: 'next-actions',
                title: 'Next Actions',
                content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
                source: 'session',
            },
        ],
        summary: `Bootstrap payload: structural=${structuralContext.status}, resume=${resumeData.error ? 'error' : 'ok'}, health=${healthData.error ? 'error' : 'ok'}`,
        provenance: {
            producer: 'session_bootstrap',
            sourceSurface: 'session_bootstrap',
            trustState: trustStateFromStructuralStatus(structuralContext.status),
            generatedAt: new Date().toISOString(),
            lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
            sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
        },
    });
    const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
    const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
    const graphOps = buildCodeGraphOpsContract({
        graphFreshness: structuralContext.status === 'ready'
            ? 'fresh'
            : structuralContext.status === 'stale'
                ? 'stale'
                : 'empty',
        sourceSurface: 'session_bootstrap',
    });
    const result = {
        resume: resumeData,
        health: healthData,
        structuralContext,
        payloadContract,
        opencodeTransport: buildOpenCodeTransportPlan({
            bootstrapPayload: payloadContract,
            resumePayload,
            healthPayload,
            specFolder: args.specFolder ?? null,
        }),
        graphOps,
        hints: uniqueHints,
        nextActions: buildNextActions(resumeData, healthData, structuralContext),
    };
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({ status: 'ok', data: result }, null, 2),
            }],
        structuredContent: result,
    };
}
//# sourceMappingURL=session-bootstrap.js.map