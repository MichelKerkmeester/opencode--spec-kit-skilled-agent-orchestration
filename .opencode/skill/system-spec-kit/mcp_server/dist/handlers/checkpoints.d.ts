import type { MCPResponse } from './types.js';
interface CheckpointCreateArgs {
    name: string;
    specFolder?: string;
    tenantId?: string;
    userId?: string;
    agentId?: string;
    sharedSpaceId?: string;
    metadata?: Record<string, unknown>;
}
interface CheckpointListArgs {
    specFolder?: string;
    tenantId?: string;
    userId?: string;
    agentId?: string;
    sharedSpaceId?: string;
    limit?: number;
}
interface CheckpointRestoreArgs {
    name: string;
    tenantId?: string;
    userId?: string;
    agentId?: string;
    sharedSpaceId?: string;
    clearExisting?: boolean;
}
interface CheckpointDeleteArgs {
    name: string;
    tenantId?: string;
    userId?: string;
    agentId?: string;
    sharedSpaceId?: string;
    confirmName: string;
}
interface MemoryValidateArgs {
    id: number | string;
    wasUseful: boolean;
    queryId?: string;
    queryTerms?: string[];
    resultRank?: number;
    totalResultsShown?: number;
    searchMode?: string;
    intent?: string;
    sessionId?: string;
    notes?: string;
}
/** Handle checkpoint_create tool — snapshots the current memory state for rollback.
 * @param args - Checkpoint creation arguments (name, note)
 * @returns MCP response with checkpoint metadata
 */
declare function handleCheckpointCreate(args: CheckpointCreateArgs): Promise<MCPResponse>;
/** Handle checkpoint_list tool - returns available checkpoints filtered by spec folder */
declare function handleCheckpointList(args: CheckpointListArgs): Promise<MCPResponse>;
/** Handle checkpoint_restore tool - restores memory state from a named checkpoint */
declare function handleCheckpointRestore(args: CheckpointRestoreArgs): Promise<MCPResponse>;
/** Handle checkpoint_delete tool - permanently removes a named checkpoint */
declare function handleCheckpointDelete(args: CheckpointDeleteArgs): Promise<MCPResponse>;
/** Handle memory_validate tool - records user validation feedback to adjust confidence */
declare function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse>;
export { handleCheckpointCreate, handleCheckpointList, handleCheckpointRestore, handleCheckpointDelete, handleMemoryValidate, };
declare const handle_checkpoint_create: typeof handleCheckpointCreate;
declare const handle_checkpoint_list: typeof handleCheckpointList;
declare const handle_checkpoint_restore: typeof handleCheckpointRestore;
declare const handle_checkpoint_delete: typeof handleCheckpointDelete;
declare const handle_memory_validate: typeof handleMemoryValidate;
export { handle_checkpoint_create, handle_checkpoint_list, handle_checkpoint_restore, handle_checkpoint_delete, handle_memory_validate, };
//# sourceMappingURL=checkpoints.d.ts.map