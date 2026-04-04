// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Context Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_context — LLM-oriented graph neighborhoods.
import { buildContext } from '../../lib/code-graph/code-graph-context.js';
import { ensureCodeGraphReady } from '../../lib/code-graph/ensure-ready.js';
function resolveSeedSource(args, anchor) {
    const normalizedSeeds = (args.seeds ?? []).map((seed) => ({
        source: typeof seed.source === 'string' && seed.source.trim().length > 0
            ? seed.source
            : seed.provider,
        filePath: seed.provider === 'cocoindex'
            ? (seed.file ?? seed.filePath ?? '')
            : (seed.filePath ?? seed.file ?? ''),
        startLine: seed.provider === 'cocoindex' ? seed.range?.start : seed.startLine,
        endLine: seed.provider === 'cocoindex' ? seed.range?.end : seed.endLine,
        symbolId: seed.symbolId,
        symbolName: seed.symbolName,
    }));
    const match = normalizedSeeds.find((seed) => {
        if (seed.symbolId && anchor.symbolId) {
            return seed.symbolId === anchor.symbolId;
        }
        if (seed.symbolName && anchor.fqName) {
            return seed.symbolName === anchor.fqName || anchor.fqName.endsWith(`.${seed.symbolName}`);
        }
        if (seed.filePath !== anchor.filePath) {
            return false;
        }
        if (typeof seed.startLine === 'number' && seed.startLine !== anchor.startLine) {
            return false;
        }
        if (typeof seed.endLine === 'number' && seed.endLine !== anchor.endLine) {
            return false;
        }
        return true;
    });
    return match?.source;
}
/** Handle code_graph_context tool call */
export async function handleCodeGraphContext(args) {
    let readiness = {
        freshness: 'empty',
        action: 'none',
        inlineIndexPerformed: false,
        reason: 'readiness check not run',
    };
    try {
        // Auto-trigger: ensure graph is fresh before querying
        try {
            readiness = await ensureCodeGraphReady(process.cwd(), {
                allowInlineIndex: true,
                allowInlineFullScan: false,
            });
        }
        catch {
            // Non-blocking: continue with potentially stale data
        }
        const queryMode = (['neighborhood', 'outline', 'impact'].includes(args.queryMode ?? '')
            ? args.queryMode
            : 'neighborhood');
        const seeds = (args.seeds ?? []).map((seed) => {
            const source = typeof seed.source === 'string' && seed.source.trim().length > 0
                ? seed.source
                : seed.provider;
            if (seed.provider === 'cocoindex' && seed.file) {
                return {
                    provider: 'cocoindex',
                    file: seed.file,
                    range: seed.range ?? { start: seed.startLine ?? 1, end: seed.endLine ?? seed.startLine ?? 1 },
                    score: seed.score ?? 0,
                    snippet: seed.snippet,
                    source,
                };
            }
            if (seed.provider === 'manual' && seed.symbolName) {
                return {
                    provider: 'manual',
                    symbolName: seed.symbolName,
                    filePath: seed.filePath,
                    kind: seed.kind,
                    source,
                };
            }
            if (seed.provider === 'graph' && seed.symbolId) {
                return {
                    provider: 'graph',
                    nodeId: seed.nodeId ?? seed.symbolId,
                    symbolId: seed.symbolId,
                    source,
                };
            }
            return {
                filePath: seed.filePath ?? seed.file ?? '',
                startLine: seed.startLine ?? seed.range?.start,
                endLine: seed.endLine ?? seed.range?.end,
                query: seed.query,
                source,
            };
        });
        const profile = (['quick', 'research', 'debug'].includes(args.profile ?? '') ? args.profile : undefined);
        const contextArgs = {
            input: args.input,
            queryMode,
            subject: args.subject,
            seeds,
            budgetTokens: args.budgetTokens ?? 1200,
            profile,
            includeTrace: args.includeTrace,
        };
        const result = buildContext(contextArgs);
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        status: 'ok',
                        data: {
                            queryMode: result.queryMode,
                            combinedSummary: result.combinedSummary,
                            nextActions: result.nextActions,
                            readiness,
                            anchors: result.resolvedAnchors.map(a => ({
                                file: a.filePath,
                                line: a.startLine,
                                symbol: a.fqName,
                                resolution: a.resolution,
                                confidence: a.confidence,
                                source: resolveSeedSource(args, a),
                            })),
                            graphContext: result.graphContext,
                            textBrief: result.textBrief,
                            metadata: result.metadata,
                        },
                    }, null, 2),
                }],
        };
    }
    catch (err) {
        console.error('[code-graph-context] Unexpected failure:', err);
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        status: 'error',
                        error: 'code_graph_context failed',
                    }),
                }],
        };
    }
}
//# sourceMappingURL=context.js.map