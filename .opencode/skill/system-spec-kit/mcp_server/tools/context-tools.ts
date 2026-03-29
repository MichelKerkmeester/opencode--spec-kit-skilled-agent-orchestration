// ───────────────────────────────────────────────────────────────
// MODULE: Context Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for L1 Orchestration tool: memory_context (T303).
import { handleMemoryContext } from '../handlers/index.js';
import { validateToolArgs } from '../schemas/tool-input-schemas.js';
import { parseArgs } from './types.js';
import type { MCPResponse, ContextArgs } from './types.js';

/** Tool names handled by this module */
export const TOOL_NAMES = new Set(['memory_context']);

/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
  switch (name) {
    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
    default: return null;
  }
}
