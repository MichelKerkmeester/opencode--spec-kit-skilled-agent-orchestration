// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Context Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_context — LLM-oriented graph neighborhoods.

import { buildContext, type ContextArgs, type QueryMode } from '../../lib/code-graph/code-graph-context.js';
import type { CodeGraphSeed } from '../../lib/code-graph/seed-resolver.js';

export interface ContextHandlerArgs {
  input?: string;
  queryMode?: string;
  subject?: string;
  seeds?: Array<{
    filePath?: string;
    startLine?: number;
    endLine?: number;
    query?: string;
    provider?: string;
    file?: string;
    range?: { start: number; end: number };
    score?: number;
    snippet?: string;
    symbolName?: string;
    kind?: string;
    nodeId?: string;
    symbolId?: string;
  }>;
  budgetTokens?: number;
  profile?: string;
  includeTrace?: boolean;
}

/** Handle code_graph_context tool call */
export async function handleCodeGraphContext(args: ContextHandlerArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  const queryMode = (['neighborhood', 'outline', 'impact'].includes(args.queryMode ?? '')
    ? args.queryMode as QueryMode
    : 'neighborhood');

  // Map seeds — support both CodeGraphSeed format and provider-typed seeds
  const seeds: CodeGraphSeed[] = (args.seeds ?? []).map(s => {
    if (s.provider === 'cocoindex' && s.file) {
      return { filePath: s.file, startLine: s.range?.start, endLine: s.range?.end, query: s.query };
    }
    return { filePath: s.filePath ?? s.file ?? '', startLine: s.startLine, endLine: s.endLine, query: s.query };
  });

  const profile = (['quick', 'research', 'debug'].includes(args.profile ?? '') ? args.profile : undefined) as ContextArgs['profile'];

  const contextArgs: ContextArgs = {
    input: args.input,
    queryMode,
    subject: args.subject,
    seeds,
    budgetTokens: args.budgetTokens ?? 1200,
    profile,
    includeTrace: args.includeTrace,
  };

  try {
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
            anchors: result.resolvedAnchors.map(a => ({
              file: a.filePath,
              line: a.startLine,
              symbol: a.fqName,
              resolution: a.resolution,
              confidence: a.confidence,
            })),
            graphContext: result.graphContext,
            textBrief: result.textBrief,
            metadata: result.metadata,
          },
        }, null, 2),
      }],
    };
  } catch (err: unknown) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: `code_graph_context failed: ${err instanceof Error ? err.message : String(err)}`,
        }),
      }],
    };
  }
}
