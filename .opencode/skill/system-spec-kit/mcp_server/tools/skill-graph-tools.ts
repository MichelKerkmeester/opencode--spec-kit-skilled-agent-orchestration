// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for skill graph MCP tools: scan, query, status, validate.
import {
  handleSkillGraphScan,
  handleSkillGraphQuery,
  handleSkillGraphStatus,
  handleSkillGraphValidate,
} from '../handlers/skill-graph/index.js';

import { parseArgs } from './types.js';
import type { MCPResponse } from './types.js';
import type { MCPCallerContext } from '../lib/context/caller-context.js';

/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
  'skill_graph_scan',
  'skill_graph_query',
  'skill_graph_status',
  'skill_graph_validate',
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
export async function handleTool(
  name: string,
  args: Record<string, unknown>,
  callerContext?: MCPCallerContext | null,
): Promise<MCPResponse | null> {
  switch (name) {
    case 'skill_graph_scan':
      return toMCP(await handleSkillGraphScan(
        parseArgs<Parameters<typeof handleSkillGraphScan>[0]>(args),
        callerContext,
      ));
    case 'skill_graph_query': {
      const missingKeys = getMissingRequiredStringArgs(args, ['queryType']);
      if (missingKeys.length > 0) {
        return validationError(name, missingKeys);
      }
      return toMCP(await handleSkillGraphQuery(parseArgs<Parameters<typeof handleSkillGraphQuery>[0]>(args)));
    }
    case 'skill_graph_status':
      parseArgs<Record<string, never>>(args);
      return toMCP(await handleSkillGraphStatus());
    case 'skill_graph_validate':
      parseArgs<Record<string, never>>(args);
      return toMCP(await handleSkillGraphValidate());
    default:
      return null;
  }
}
