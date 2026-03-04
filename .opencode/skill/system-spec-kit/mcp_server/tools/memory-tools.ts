// ---------------------------------------------------------------
// MODULE: Memory Tools
// ---------------------------------------------------------------
// Dispatch for L2-L4 memory tools: search, triggers, save,
// list, stats, health, delete, update, validate (T303).
// ---------------------------------------------------------------

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
} from '../handlers';
import { validateToolArgs } from '../tool-schemas';

import {
  MCPResponse, parseArgs,
  SearchArgs, TriggerArgs, SaveArgs,
  ListArgs, StatsArgs, HealthArgs,
  DeleteArgs, UpdateArgs, MemoryValidateArgs,
  BulkDeleteArgs,
} from './types';

/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
  'memory_search',
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
