// ───────────────────────────────────────────────────────────────
// MODULE: Causal Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for L6 causal memory graph tools: drift_why,
// Causal_link, causal_stats, causal_unlink (T303).
import {
  handleMemoryDriftWhy,
  handleMemoryCausalLink,
  handleMemoryCausalStats,
  handleMemoryCausalUnlink,
} from '../handlers/index.js';
import { validateToolArgs } from '../schemas/tool-input-schemas.js';

import { parseArgs } from './types.js';
import type {
  MCPResponse,
  DriftWhyArgs,
  CausalLinkArgs,
  CausalStatsArgs,
  CausalUnlinkArgs,
} from './types.js';

/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
  'memory_drift_why',
  'memory_causal_link',
  'memory_causal_stats',
  'memory_causal_unlink',
]);

/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
  switch (name) {
    case 'memory_drift_why':     return handleMemoryDriftWhy(parseArgs<DriftWhyArgs>(validateToolArgs('memory_drift_why', args)));
    case 'memory_causal_link':   return handleMemoryCausalLink(parseArgs<CausalLinkArgs>(validateToolArgs('memory_causal_link', args)));
    case 'memory_causal_stats':  return handleMemoryCausalStats(parseArgs<CausalStatsArgs>(validateToolArgs('memory_causal_stats', args)));
    case 'memory_causal_unlink': return handleMemoryCausalUnlink(parseArgs<CausalUnlinkArgs>(validateToolArgs('memory_causal_unlink', args)));
    default: return null;
  }
}
