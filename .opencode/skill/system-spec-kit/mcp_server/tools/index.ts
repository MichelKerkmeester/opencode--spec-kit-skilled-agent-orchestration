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

export { contextTools, memoryTools, causalTools, checkpointTools, lifecycleTools, codeGraphTools };

export type { MCPResponse } from './types.js';

/** All tool dispatch modules in priority order */
export const ALL_DISPATCHERS = [
  contextTools,
  memoryTools,
  causalTools,
  checkpointTools,
  lifecycleTools,
  codeGraphTools,
] as const;

/** Dispatch a tool call to the appropriate module. Returns null if unrecognized. */
export async function dispatchTool(
  name: string,
  args: Record<string, unknown>,
): Promise<import('./types.js').MCPResponse | null> {
  for (const dispatcher of ALL_DISPATCHERS) {
    if (dispatcher.TOOL_NAMES.has(name)) {
      return dispatcher.handleTool(name, args);
    }
  }
  return null;
}
