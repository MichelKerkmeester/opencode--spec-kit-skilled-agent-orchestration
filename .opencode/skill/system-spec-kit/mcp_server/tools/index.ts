// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
// Re-exports all tool dispatch modules for context-server (T303).
import * as contextTools from './context-tools.js';
import * as memoryTools from './memory-tools.js';
import * as causalTools from './causal-tools.js';
import * as checkpointTools from './checkpoint-tools.js';
import * as lifecycleTools from './lifecycle-tools.js';
import * as codeGraphTools from './code-graph-tools.js';
import * as skillGraphTools from './skill-graph-tools.js';
import { validateToolArgs } from '../schemas/tool-input-schemas.js';
import { handleCoverageGraphConvergence } from '../handlers/coverage-graph/convergence.js';
import { handleCoverageGraphQuery } from '../handlers/coverage-graph/query.js';
import { handleCoverageGraphStatus } from '../handlers/coverage-graph/status.js';
import { handleCoverageGraphUpsert } from '../handlers/coverage-graph/upsert.js';
import { parseArgs, type MCPResponse } from './types.js';

function toMCP(result: { content: Array<{ type: string; text: string }> }): MCPResponse {
  return {
    content: result.content.map((entry) => ({ type: 'text' as const, text: entry.text })),
  };
}

export const coverageGraphTools = {
  TOOL_NAMES: new Set([
    'deep_loop_graph_upsert',
    'deep_loop_graph_query',
    'deep_loop_graph_status',
    'deep_loop_graph_convergence',
  ]),
  async handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
    switch (name) {
      case 'deep_loop_graph_upsert':
        return toMCP(await handleCoverageGraphUpsert(parseArgs<Parameters<typeof handleCoverageGraphUpsert>[0]>(args)));
      case 'deep_loop_graph_query':
        return toMCP(await handleCoverageGraphQuery(parseArgs<Parameters<typeof handleCoverageGraphQuery>[0]>(args)));
      case 'deep_loop_graph_status':
        return toMCP(await handleCoverageGraphStatus(parseArgs<Parameters<typeof handleCoverageGraphStatus>[0]>(args)));
      case 'deep_loop_graph_convergence':
        return toMCP(await handleCoverageGraphConvergence(parseArgs<Parameters<typeof handleCoverageGraphConvergence>[0]>(args)));
      default:
        return null;
    }
  },
};

const SCHEMA_VALIDATED_TOOL_NAMES = new Set<string>([
  ...codeGraphTools.TOOL_NAMES,
  ...skillGraphTools.TOOL_NAMES,
  ...coverageGraphTools.TOOL_NAMES,
]);

export { contextTools, memoryTools, causalTools, checkpointTools, lifecycleTools, codeGraphTools, skillGraphTools };

export type { MCPResponse } from './types.js';

/** All tool dispatch modules in priority order */
export const ALL_DISPATCHERS = [
  contextTools,
  memoryTools,
  causalTools,
  checkpointTools,
  lifecycleTools,
  codeGraphTools,
  skillGraphTools,
  coverageGraphTools,
] as const;

/** Dispatch a tool call to the appropriate module. Returns null if unrecognized. */
export async function dispatchTool(
  name: string,
  args: Record<string, unknown>,
): Promise<import('./types.js').MCPResponse | null> {
  for (const dispatcher of ALL_DISPATCHERS) {
    if (dispatcher.TOOL_NAMES.has(name)) {
      const validatedArgs = SCHEMA_VALIDATED_TOOL_NAMES.has(name)
        ? validateToolArgs(name, args)
        : args;
      return dispatcher.handleTool(name, validatedArgs);
    }
  }
  return null;
}
