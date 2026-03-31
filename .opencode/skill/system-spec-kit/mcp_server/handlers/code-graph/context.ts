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
  seeds?: Array<{ filePath: string; startLine?: number; endLine?: number; query?: string }>;
  budgetTokens?: number;
}

/** Handle code_graph_context tool call */
export async function handleCodeGraphContext(args: ContextHandlerArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  const queryMode = (['neighborhood', 'outline', 'impact'].includes(args.queryMode ?? '')
    ? args.queryMode as QueryMode
    : 'neighborhood');

  const seeds: CodeGraphSeed[] = (args.seeds ?? []).map(s => ({
    filePath: s.filePath,
    startLine: s.startLine,
    endLine: s.endLine,
    query: s.query,
  }));

  const contextArgs: ContextArgs = {
    input: args.input,
    queryMode,
    subject: args.subject,
    seeds,
    budgetTokens: args.budgetTokens ?? 1200,
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
            anchors: result.resolvedAnchors.map(a => ({
              file: a.filePath,
              line: a.startLine,
              symbol: a.fqName,
              resolution: a.resolution,
              confidence: a.confidence,
            })),
            textBrief: result.textBrief,
            metadata: result.metadata,
          },
        }, null, 2),
      }],
    };
  } catch (err) {
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
