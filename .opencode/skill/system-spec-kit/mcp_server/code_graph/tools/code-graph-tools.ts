// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for code graph MCP tools: scan, query, status, context, detect_changes.
import {
  handleCodeGraphScan,
  handleCodeGraphQuery,
  handleCodeGraphStatus,
  handleCodeGraphContext,
  handleCccStatus,
  handleCccReindex,
  handleCccFeedback,
  handleDetectChanges,
} from '../handlers/index.js';

import type { MCPResponse } from '../../tools/types.js';
import { parseArgs } from '../../tools/types.js';

/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
  'code_graph_scan',
  'code_graph_query',
  'code_graph_status',
  'code_graph_context',
  'detect_changes',
  'ccc_status',
  'ccc_reindex',
  'ccc_feedback',
]);

/** Coerce handler response to MCPResponse (fix type literal narrowing) */
function toMCP(result: { content: Array<{ type: string; text: string }> }): MCPResponse {
  return {
    content: result.content.map(c => ({ type: 'text' as const, text: c.text })),
  };
}

function getMissingRequiredStringArgs(args: Record<string, unknown>, requiredKeys: string[]): string[] {
  return requiredKeys.filter((key) => {
    const value = args[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });
}

function validationError(tool: string, missingKeys: string[]): MCPResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        status: 'error',
        error: `Missing required field${missingKeys.length === 1 ? '' : 's'}: ${missingKeys.join(', ')}`,
        tool,
      }),
    }],
  };
}

/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
  switch (name) {
    case 'code_graph_scan':
      return toMCP(await handleCodeGraphScan(parseArgs<Parameters<typeof handleCodeGraphScan>[0]>(args)));
    case 'code_graph_query': {
      const missingKeys = getMissingRequiredStringArgs(args, ['operation', 'subject']);
      if (missingKeys.length > 0) {
        return validationError(name, missingKeys);
      }
      return toMCP(await handleCodeGraphQuery(parseArgs<Parameters<typeof handleCodeGraphQuery>[0]>(args)));
    }
    case 'code_graph_status':
      parseArgs<Record<string, never>>(args);
      return toMCP(await handleCodeGraphStatus());
    case 'code_graph_context':
      return toMCP(await handleCodeGraphContext(parseArgs<Parameters<typeof handleCodeGraphContext>[0]>(args)));
    case 'detect_changes': {
      const missingKeys = getMissingRequiredStringArgs(args, ['diff']);
      if (missingKeys.length > 0) {
        return validationError(name, missingKeys);
      }
      return toMCP(await handleDetectChanges(parseArgs<Parameters<typeof handleDetectChanges>[0]>(args)));
    }
    case 'ccc_status':
      parseArgs<Record<string, never>>(args);
      return toMCP(await handleCccStatus());
    case 'ccc_reindex':
      return toMCP(await handleCccReindex(parseArgs<Parameters<typeof handleCccReindex>[0]>(args)));
    case 'ccc_feedback': {
      const missingKeys = getMissingRequiredStringArgs(args, ['query', 'rating']);
      if (missingKeys.length > 0) {
        return validationError(name, missingKeys);
      }
      return toMCP(await handleCccFeedback(parseArgs<Parameters<typeof handleCccFeedback>[0]>(args)));
    }
    default:
      return null;
  }
}
