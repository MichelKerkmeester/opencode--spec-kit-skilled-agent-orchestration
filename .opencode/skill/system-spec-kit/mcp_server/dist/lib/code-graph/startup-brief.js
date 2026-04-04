// ───────────────────────────────────────────────────────────────
// MODULE: Startup Brief Builder
// ───────────────────────────────────────────────────────────────
// Phase 026: Build a compact startup brief for hook-capable runtimes
// from local code graph + hook state (no MCP round-trip).
import { getStats, queryStartupHighlights } from './code-graph-db.js';
import { getGraphFreshness } from './ensure-ready.js';
import { loadMostRecentState } from '../../hooks/claude/hook-state.js';
import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
import { createSharedPayloadEnvelope, trustStateFromGraphState, } from '../context/shared-payload.js';
const SUMMARY_MAX_CHARS = 240;
function truncateInline(text, maxChars) {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxChars) {
        return normalized;
    }
    return normalized.slice(0, maxChars - 3).trimEnd() + '...';
}
function compactPath(filePath) {
    const parts = filePath.replace(/\\/g, '/').split('/').filter(Boolean);
    if (parts.length <= 3) {
        return parts.join('/');
    }
    return parts.slice(-3).join('/');
}
function formatHighlight(highlight) {
    const callSuffix = highlight.callCount > 0 ? ` [calls: ${highlight.callCount}]` : '';
    return `- ${highlight.name} (${highlight.kind}) - ${compactPath(highlight.filePath)}${callSuffix}`;
}
function formatCompactNumber(value) {
    return new Intl.NumberFormat('en-US', {
        notation: value >= 1000 ? 'compact' : 'standard',
        maximumFractionDigits: value >= 1000 ? 1 : 0,
    }).format(value);
}
function describeLastScan(lastScan) {
    if (!lastScan) {
        return 'last scan unknown';
    }
    const scanDate = new Date(lastScan);
    if (Number.isNaN(scanDate.getTime())) {
        return 'last scan unknown';
    }
    const now = new Date();
    const sameDay = scanDate.getFullYear() === now.getFullYear()
        && scanDate.getMonth() === now.getMonth()
        && scanDate.getDate() === now.getDate();
    if (sameDay) {
        return 'scanned today';
    }
    return `last scan ${scanDate.toISOString().slice(0, 10)}`;
}
function buildStartupSurface(args) {
    const memoryLine = args.sessionContinuity
        ? 'session continuity available'
        : 'startup summary only (resume on demand)';
    let codeGraphLine = 'unavailable';
    if (args.graphState === 'ready' && args.graphSummary) {
        codeGraphLine = [
            'healthy',
            `${args.graphSummary.files.toLocaleString('en-US')} files`,
            `${formatCompactNumber(args.graphSummary.nodes)} nodes`,
            `${formatCompactNumber(args.graphSummary.edges)} edges`,
            `(${describeLastScan(args.graphSummary.lastScan)})`,
        ].join(' -- ').replace(' -- (', ' (');
    }
    else if (args.graphState === 'stale' && args.graphSummary) {
        codeGraphLine = [
            'stale',
            `${args.graphSummary.files.toLocaleString('en-US')} files`,
            `${formatCompactNumber(args.graphSummary.nodes)} nodes`,
            `${formatCompactNumber(args.graphSummary.edges)} edges`,
            `(${describeLastScan(args.graphSummary.lastScan)}; first structural read may refresh inline)`,
        ].join(' -- ').replace(' -- (', ' (');
    }
    else if (args.graphState === 'empty') {
        codeGraphLine = 'empty -- run `code_graph_scan`';
    }
    return [
        'Session context received. Current state:',
        '',
        `- Memory: ${memoryLine}`,
        `- Code Graph: ${codeGraphLine}`,
        `- CocoIndex: ${args.cocoIndexAvailable ? 'available' : 'missing'}`,
        '- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
        '',
        'What would you like to work on?',
    ].join('\n');
}
function buildGraphOutline(highlightCount = 5) {
    try {
        const stats = getStats();
        const freshness = getGraphFreshness(process.cwd());
        const graphSummary = {
            files: stats.totalFiles,
            nodes: stats.totalNodes,
            edges: stats.totalEdges,
            lastScan: stats.lastScanTimestamp,
        };
        if (stats.totalFiles <= 0 || stats.totalNodes <= 0) {
            return {
                graphOutline: null,
                graphSummary,
                graphState: 'empty',
            };
        }
        // Keep startup highlights small by default so graph context stays useful without crowding the token budget.
        const highlights = queryStartupHighlights(highlightCount);
        const lines = [
            `${stats.totalFiles} files, ${stats.totalNodes} nodes, ${stats.totalEdges} edges.`,
            `Last scan: ${stats.lastScanTimestamp ?? 'unknown'}`,
        ];
        if (freshness === 'stale') {
            lines.push('Freshness: stale — first structural read may trigger bounded inline refresh or recommend code_graph_scan.');
        }
        if (highlights.length > 0) {
            lines.push('Orientation: use code graph highlights for structural entry points and call paths; use CocoIndex for semantic discovery when the symbol or file is still unknown.');
            lines.push('Highlights:');
            lines.push(...highlights.map(formatHighlight));
        }
        return {
            graphOutline: lines.join('\n'),
            graphSummary,
            graphState: freshness === 'stale' ? 'stale' : 'ready',
        };
    }
    catch {
        return {
            graphOutline: null,
            graphSummary: null,
            graphState: 'missing',
        };
    }
}
function buildSessionContinuity() {
    const state = loadMostRecentState();
    if (!state) {
        return null;
    }
    const parts = [];
    if (state.lastSpecFolder) {
        parts.push(`Last session worked on: ${state.lastSpecFolder}`);
    }
    if (state.sessionSummary?.text) {
        parts.push(`Summary: ${truncateInline(state.sessionSummary.text, SUMMARY_MAX_CHARS)}`);
    }
    return parts.length > 0 ? parts.join('\n') : null;
}
/** Build the startup brief used by runtime hooks and transport startup digests. */
export function buildStartupBrief(highlightCount) {
    const graph = buildGraphOutline(highlightCount);
    const sessionContinuity = buildSessionContinuity();
    const cocoIndexAvailable = isCocoIndexAvailable();
    const sections = [];
    if (graph.graphOutline) {
        sections.push({
            key: 'structural-context',
            title: 'Structural Context',
            content: graph.graphOutline,
            source: 'code-graph',
        });
    }
    if (sessionContinuity) {
        sections.push({
            key: 'session-continuity',
            title: 'Session Continuity',
            content: sessionContinuity,
            source: 'session',
        });
    }
    const startupSurface = buildStartupSurface({
        sessionContinuity,
        graphSummary: graph.graphSummary,
        graphState: graph.graphState,
        cocoIndexAvailable,
    });
    const sharedPayload = sections.length > 0
        ? createSharedPayloadEnvelope({
            kind: 'startup',
            sections,
            summary: graph.graphOutline
                ? `Startup brief with ${graph.graphState} structural context and ${sessionContinuity ? 'session continuity' : 'no continuity notes'}`
                : `Startup brief without structural highlights (${graph.graphState})`,
            provenance: {
                producer: 'startup_brief',
                sourceSurface: 'session_start',
                trustState: trustStateFromGraphState(graph.graphState),
                generatedAt: new Date().toISOString(),
                lastUpdated: graph.graphSummary?.lastScan ?? null,
                sourceRefs: ['code-graph-db', 'hook-state'],
            },
        })
        : null;
    return {
        graphOutline: graph.graphOutline,
        sessionContinuity,
        graphSummary: graph.graphSummary,
        graphState: graph.graphState,
        cocoIndexAvailable,
        startupSurface,
        sharedPayload,
    };
}
//# sourceMappingURL=startup-brief.js.map