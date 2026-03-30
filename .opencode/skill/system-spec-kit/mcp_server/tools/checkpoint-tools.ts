// ───────────────────────────────────────────────────────────────
// MODULE: Checkpoint Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for L5 checkpoint tools: create, list, restore,
// Delete (T303).
import {
  handleCheckpointCreate,
  handleCheckpointList,
  handleCheckpointRestore,
  handleCheckpointDelete,
} from '../handlers/index.js';
import { validateToolArgs } from '../schemas/tool-input-schemas.js';

import { parseArgs } from './types.js';
import type {
  MCPResponse,
  CheckpointCreateArgs,
  CheckpointListArgs,
  CheckpointRestoreArgs,
  CheckpointDeleteArgs,
} from './types.js';

/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
  'checkpoint_create',
  'checkpoint_list',
  'checkpoint_restore',
  'checkpoint_delete',
]);

/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
  switch (name) {
    case 'checkpoint_create':  return handleCheckpointCreate(parseArgs<CheckpointCreateArgs>(validateToolArgs('checkpoint_create', args)));
    case 'checkpoint_list':    return handleCheckpointList(parseArgs<CheckpointListArgs>(validateToolArgs('checkpoint_list', args)));
    case 'checkpoint_restore': return handleCheckpointRestore(parseArgs<CheckpointRestoreArgs>(validateToolArgs('checkpoint_restore', args)));
    case 'checkpoint_delete':  return handleCheckpointDelete(parseArgs<CheckpointDeleteArgs>(validateToolArgs('checkpoint_delete', args)));
    default: return null;
  }
}
