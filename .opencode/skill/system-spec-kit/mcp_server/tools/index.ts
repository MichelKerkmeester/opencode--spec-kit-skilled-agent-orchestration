// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------
// Re-exports all tool dispatch modules for context-server (T303).
// ---------------------------------------------------------------

import * as contextTools from './context-tools';
import * as memoryTools from './memory-tools';
import * as causalTools from './causal-tools';
import * as checkpointTools from './checkpoint-tools';
import * as lifecycleTools from './lifecycle-tools';

export { contextTools, memoryTools, causalTools, checkpointTools, lifecycleTools };

export type { MCPResponse } from './types';

/** All tool dispatch modules in priority order */
export const ALL_DISPATCHERS = [
  contextTools,
  memoryTools,
  causalTools,
  checkpointTools,
  lifecycleTools,
] as const;

/** Dispatch a tool call to the appropriate module. Returns null if unrecognized. */
export async function dispatchTool(
  name: string,
  args: Record<string, unknown>,
): Promise<import('./types').MCPResponse | null> {
  for (const dispatcher of ALL_DISPATCHERS) {
    if (dispatcher.TOOL_NAMES.has(name)) {
      return dispatcher.handleTool(name, args);
    }
  }
  return null;
}
