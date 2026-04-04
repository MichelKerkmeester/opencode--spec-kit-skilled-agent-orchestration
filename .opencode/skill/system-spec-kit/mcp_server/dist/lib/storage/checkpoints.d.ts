import type Database from 'better-sqlite3';
import { type ScopeContext } from '../governance/scope-governance.js';
declare const MAX_CHECKPOINTS = 10;
interface CheckpointEntry {
    id: number;
    name: string;
    created_at: string;
    spec_folder: string | null;
    git_branch: string | null;
    memory_snapshot: Buffer | null;
    file_snapshot: Buffer | null;
    metadata: string | null;
}
interface CheckpointInfo {
    id: number;
    name: string;
    createdAt: string;
    specFolder: string | null;
    gitBranch: string | null;
    snapshotSize: number;
    metadata: Record<string, unknown>;
    [key: string]: unknown;
}
interface CreateCheckpointOptions {
    name?: string;
    specFolder?: string | null;
    includeEmbeddings?: boolean;
    metadata?: Record<string, unknown>;
    scope?: ScopeContext;
}
interface RestoreResult {
    restored: number;
    skipped: number;
    errors: string[];
    workingMemoryRestored: number;
    partialFailure?: boolean;
    rolledBackTables?: string[];
}
interface RestoreBarrierStatus {
    code: string;
    message: string;
}
interface RestoreBarrierHooks {
    afterAcquire?: (() => void) | null;
    beforeRelease?: (() => void) | null;
}
declare const RESTORE_IN_PROGRESS_ERROR_CODE = "E_RESTORE_IN_PROGRESS";
declare const RESTORE_IN_PROGRESS_ERROR_MESSAGE = "Checkpoint restore maintenance is in progress. Retry after the restore lifecycle completes.";
declare function init(database: Database.Database): void;
declare function getDatabase(): Database.Database;
declare function isRestoreInProgress(): boolean;
declare function getRestoreBarrierStatus(): RestoreBarrierStatus | null;
declare function setRestoreBarrierHooks(hooks: RestoreBarrierHooks | null): void;
declare function getGitBranch(): string | null;
/**
 * Validates a single memory row from a checkpoint snapshot.
 * Throws on invalid data — caller should reject the entire restore.
 *
 * Strict on identity fields (id, file_path, spec_folder).
 * Required-but-lenient on INSERT-needed fields (must be present, type flexible).
 * Optional fields (anchor_id, embedding_*, etc.) may be null/undefined for
 * backwards compatibility with older checkpoint formats.
 */
declare function validateMemoryRow(row: unknown, index: number): void;
declare function createCheckpoint(options?: CreateCheckpointOptions): CheckpointInfo | null;
declare function listCheckpoints(specFolder?: string | null, limit?: number, scope?: ScopeContext): CheckpointInfo[];
declare function getCheckpoint(nameOrId: string | number, scope?: ScopeContext): CheckpointEntry | null;
declare function restoreCheckpoint(nameOrId: string | number, clearExisting?: boolean, scope?: ScopeContext): RestoreResult;
declare function deleteCheckpoint(nameOrId: string | number, scope?: ScopeContext): boolean;
export { MAX_CHECKPOINTS, init, getDatabase, getGitBranch, isRestoreInProgress, getRestoreBarrierStatus, setRestoreBarrierHooks, validateMemoryRow, createCheckpoint, listCheckpoints, getCheckpoint, restoreCheckpoint, deleteCheckpoint, RESTORE_IN_PROGRESS_ERROR_CODE, RESTORE_IN_PROGRESS_ERROR_MESSAGE, };
/**
 * Re-exports related public types.
 */
export type { CheckpointEntry, CheckpointInfo, CreateCheckpointOptions, RestoreResult, };
//# sourceMappingURL=checkpoints.d.ts.map