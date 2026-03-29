// ───────────────────────────────────────────────────────────────
// MODULE: Memory Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for L2-L4 memory tools: search, triggers, save,
// List, stats, health, delete, update, validate (T303).
import {
  handleMemorySearch,
  handleMemoryMatchTriggers,
  handleMemorySave,
  handleMemoryList,
  handleMemoryStats,
  handleMemoryHealth,
  handleMemoryDelete,
  handleMemoryUpdate,
  handleMemoryValidate,
  handleMemoryBulkDelete,
} from '../handlers/index.js';
import { validateToolArgs } from '../schemas/tool-input-schemas.js';

import { parseArgs } from './types.js';
import type {
  MCPResponse,
  SearchArgs,
  TriggerArgs,
  SaveArgs,
  ListArgs,
  StatsArgs,
  HealthArgs,
  DeleteArgs,
  UpdateArgs,
  MemoryValidateArgs,
  BulkDeleteArgs,
} from './types.js';

function relabelResponseTool(response: MCPResponse, toolName: string): MCPResponse {
  const firstEntry = response?.content?.[0];
  if (!firstEntry || firstEntry.type !== 'text' || typeof firstEntry.text !== 'string') {
    return response;
  }

  try {
    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
    const meta = envelope.meta && typeof envelope.meta === 'object'
      ? envelope.meta as Record<string, unknown>
      : {};
    envelope.meta = {
      ...meta,
      tool: toolName,
    };

    return {
      ...response,
      content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
    };
  } catch {
    return response;
  }
}

/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
  'memory_search',
  'memory_quick_search',
  'memory_match_triggers',
  'memory_save',
  'memory_list',
  'memory_stats',
  'memory_health',
  'memory_delete',
  'memory_update',
  'memory_validate',
  'memory_bulk_delete',
]);

/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
  switch (name) {
    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
    case 'memory_quick_search': {
      // E3: Delegate to memory_search with sensible defaults
      const validated = validateToolArgs('memory_quick_search', args);
      const quickArgs: SearchArgs = {
        query: validated.query as string,
        limit: typeof validated.limit === 'number' ? validated.limit : 10,
        specFolder: validated.specFolder as string | undefined,
        tenantId: validated.tenantId as string | undefined,
        userId: validated.userId as string | undefined,
        agentId: validated.agentId as string | undefined,
        sharedSpaceId: validated.sharedSpaceId as string | undefined,
        autoDetectIntent: true,
        enableDedup: true,
        includeContent: true,
        includeConstitutional: true,
        rerank: true,
      };
      const response = await handleMemorySearch(quickArgs);
      return relabelResponseTool(response, 'memory_quick_search');
    }
    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
    case 'memory_list':           return handleMemoryList(parseArgs<ListArgs>(validateToolArgs('memory_list', args)));
    case 'memory_stats':          return handleMemoryStats(parseArgs<StatsArgs>(validateToolArgs('memory_stats', args)));
    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
    case 'memory_delete':         return handleMemoryDelete(parseArgs<DeleteArgs>(validateToolArgs('memory_delete', args)));
    case 'memory_update':         return handleMemoryUpdate(parseArgs<UpdateArgs>(validateToolArgs('memory_update', args)));
    case 'memory_validate':       return handleMemoryValidate(parseArgs<MemoryValidateArgs>(validateToolArgs('memory_validate', args)));
    case 'memory_bulk_delete':    return handleMemoryBulkDelete(parseArgs<BulkDeleteArgs>(validateToolArgs('memory_bulk_delete', args)));
    default: return null;
  }
}
