// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Delete
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { checkDatabaseUpdated } from '../core/index.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import * as checkpoints from '../lib/storage/checkpoints.js';
import * as mutationLedger from '../lib/storage/mutation-ledger.js';
import * as causalEdges from '../lib/storage/causal-edges.js';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import { toErrorMessage } from '../utils/index.js';

import { recordHistory } from '../lib/storage/history.js';
import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils.js';
import { runPostMutationHooks } from './mutation-hooks.js';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';
import { clearDegreeCacheForDb } from '../lib/search/graph-search-fn.js';

import type { MCPResponse } from './types.js';
import type { DeleteArgs, MemoryHashSnapshot } from './memory-crud-types.js';

// Feature catalog: Single and folder delete (memory_delete)
// Feature catalog: Validation feedback (memory_validate)
// Feature catalog: Transaction wrappers on mutation handlers
// Feature catalog: Per-memory history log


/* ───────────────────────────────────────────────────────────────
   CORE LOGIC
──────────────────────────────────────────────────────────────── */

function parseMemoryId(rawId: number | string): number {
  const numericId = typeof rawId === 'string'
    ? Number.parseInt(rawId.trim(), 10)
    : rawId;

  if (
    typeof numericId !== 'number' ||
    !Number.isSafeInteger(numericId) ||
    numericId <= 0 ||
    (typeof rawId === 'string' && !/^\d+$/.test(rawId.trim()))
  ) {
    throw new Error('Invalid memory ID: must be a positive integer');
  }

  return numericId;
}

function createDatabaseUnavailableDeleteResponse(): MCPResponse {
  return createMCPErrorResponse({
    tool: 'memory_delete',
    error: 'Delete aborted: database unavailable',
    code: 'E_DB_UNAVAILABLE',
    details: { deleted: 0 },
    recovery: {
      hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
      actions: ['Restart the MCP server', 'Call memory_index_scan()'],
      severity: 'error',
    },
  });
}

/** Handle memory_delete tool -- deletes a single memory by ID or bulk-deletes by spec folder. */
async function handleMemoryDelete(args: DeleteArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  const { id, specFolder, confirm } = args;
  if (!id && !specFolder) throw new Error('Either id or specFolder is required');
  if (specFolder !== undefined && typeof specFolder !== 'string') throw new Error('specFolder must be a string');
  if (specFolder && !id && !confirm) throw new Error('Bulk delete requires confirm: true');

  let numericId: number | null = null;
  if (id !== undefined && id !== null) {
    numericId = parseMemoryId(id);
  }

  let deletedCount = 0;
  let checkpointName: string | null = null;
  let mutationLedgerWarning: string | null = null;
  const database = vectorIndex.getDb();

  if (!database) {
    // Unified DB-unavailable contract for single and bulk delete paths.
    return createDatabaseUnavailableDeleteResponse();
  }

  if (numericId !== null) {
    const singleSnapshot = getMemoryHashSnapshot(database, numericId);

    // T2-5 transaction wrapper — wraps single-delete path (memory delete, causal edge
    // Cleanup, ledger append) in a transaction for atomicity on error.
    database.transaction(() => {
      deletedCount = vectorIndex.deleteMemory(numericId) ? 1 : 0;

      if (deletedCount > 0) {
        // Record DELETE history after confirmed delete (no FK, history rows survive).
        // Placed after deleteMemory to avoid false audit rows for non-existent IDs.
        try {
          recordHistory(
            numericId,
            'DELETE',
            singleSnapshot?.file_path ?? null,
            null,
            'mcp:memory_delete',
            singleSnapshot?.spec_folder ?? null,
          );
        } catch (_histErr: unknown) {
          // History recording is best-effort
        }

        causalEdges.init(database);
        causalEdges.deleteEdgesForMemory(String(numericId));
        // H1 FIX: Use db-specific invalidation instead of the no-op global version
        clearDegreeCacheForDb(database);

        const ledgerRecorded = appendMutationLedgerSafe(database, {
          mutationType: 'delete',
          reason: 'memory_delete: single memory delete',
          priorHash: singleSnapshot?.content_hash ?? null,
          newHash: mutationLedger.computeHash(`delete:${numericId}:${Date.now()}`),
          linkedMemoryIds: [numericId],
          decisionMeta: {
            tool: 'memory_delete',
            bulk: false,
            memoryId: numericId,
            specFolder: singleSnapshot?.spec_folder ?? null,
            filePath: singleSnapshot?.file_path ?? null,
          },
          actor: 'mcp:memory_delete',
        });
        if (!ledgerRecorded) {
          mutationLedgerWarning = 'Mutation ledger append failed; audit trail may be incomplete.';
        }
      }
    })();
  } else {
    const memories: { id: number }[] = vectorIndex.getMemoriesByFolder(specFolder as string);
    const deletedIds: number[] = [];
    const hashById = new Map<number, MemoryHashSnapshot>();

    if (database && 'prepare' in database) {
      try {
        const rows = database.prepare(`
          SELECT id, content_hash, spec_folder, file_path
          FROM memory_index
          WHERE spec_folder = ?
        `).all(specFolder as string) as MemoryHashSnapshot[];

        for (const row of rows) {
          hashById.set(row.id, row);
        }
      } catch (_err: unknown) {
        // Non-fatal — bulk delete proceeds without per-memory hash snapshots; ledger entries will lack prior hashes.
      }
    }

    if (memories.length > 0) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const proposedCheckpointName = `pre-cleanup-${timestamp}`;
      try {
        const checkpoint = checkpoints.createCheckpoint({
          name: proposedCheckpointName,
          specFolder,
          metadata: {
            reason: 'auto-checkpoint before bulk delete',
            memoryCount: memories.length,
          },
        });

        if (checkpoint) {
          checkpointName = checkpoint.name;
          console.error(`[memory-delete] Created checkpoint: ${checkpointName}`);
        } else {
          console.warn('[memory-delete] Checkpoint creation returned no checkpoint; proceeding without rollback.');
          checkpointName = null;
        }
      } catch (cpErr: unknown) {
        const message = toErrorMessage(cpErr);
        console.error(`[memory-delete] Failed to create checkpoint: ${message}`);
        // Confirm is always true here (validated at function entry) — safe to proceed without checkpoint.
        console.warn('[memory-delete] Proceeding without backup (user confirmed)');
        checkpointName = null;
      }
    }

    // Snapshot-then-delete is safe under single-process better-sqlite3; re-evaluate if multi-process support is added
    causalEdges.init(database);
    const bulkDeleteTx = database.transaction(() => {
      for (const memory of memories) {
        if (vectorIndex.deleteMemory(memory.id)) {
          // Record DELETE history after confirmed delete (no FK, history rows survive).
          try {
            const snapshot = hashById.get(memory.id);
            recordHistory(
              memory.id,
              'DELETE',
              snapshot?.file_path ?? null,
              null,
              'mcp:memory_delete',
              snapshot?.spec_folder ?? null,
            );
          } catch (_histErr: unknown) {
            // History recording is best-effort inside bulk delete
          }
          deletedCount++;
          deletedIds.push(memory.id);
          causalEdges.deleteEdgesForMemory(String(memory.id));
        }
      }

      // Mutation ledger entries written inside bulk transaction for atomicity with deletes.
      for (const deletedId of deletedIds) {
        const snapshot = hashById.get(deletedId) ?? null;
        const ledgerRecorded = appendMutationLedgerSafe(database, {
          mutationType: 'delete',
          reason: 'memory_delete: bulk delete by spec folder',
          priorHash: snapshot?.content_hash ?? null,
          newHash: mutationLedger.computeHash(`bulk-delete:${deletedId}:${Date.now()}`),
          linkedMemoryIds: [deletedId],
          decisionMeta: {
            tool: 'memory_delete',
            bulk: true,
            specFolder,
            checkpoint: checkpointName,
            memoryId: deletedId,
            filePath: snapshot?.file_path ?? null,
          },
          actor: 'mcp:memory_delete',
        });
        if (!ledgerRecorded) {
          mutationLedgerWarning = 'Mutation ledger append failed; audit trail may be incomplete.';
        }
      }
    });
    bulkDeleteTx();
  }

  let postMutationFeedback: ReturnType<typeof buildMutationHookFeedback> | null = null;
  if (deletedCount > 0) {
    let postMutationHooks: import('./mutation-hooks.js').MutationHookResult;
    try {
      postMutationHooks = runPostMutationHooks('delete', { specFolder, deletedCount });
    } catch (hookError: unknown) {
      const msg = hookError instanceof Error ? hookError.message : String(hookError);
      postMutationHooks = {
        latencyMs: 0, triggerCacheCleared: false,
        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
        graphSignalsCacheCleared: false, coactivationCacheCleared: false,
        errors: [msg],
      };
    }
    postMutationFeedback = buildMutationHookFeedback('delete', postMutationHooks);
  }

  const summary = deletedCount > 0
    ? `Deleted ${deletedCount} memory(s)`
    : 'No memories found to delete';

  const hints: string[] = [];
  if (checkpointName) {
    hints.push(`Restore with: checkpoint_restore({ name: "${checkpointName}" })`);
  }
  if (deletedCount === 0) {
    hints.push('Use memory_list() to find existing memories');
  }
  if (postMutationFeedback) {
    hints.push(...postMutationFeedback.hints);
  }
  if (mutationLedgerWarning) {
    hints.push(mutationLedgerWarning);
  }

  const data: Record<string, unknown> = { deleted: deletedCount };
  if (checkpointName) {
    data.checkpoint = checkpointName;
    data.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
  }
  if (postMutationFeedback) {
    data.postMutationHooks = postMutationFeedback.data;
  }
  if (mutationLedgerWarning) {
    data.warning = mutationLedgerWarning;
  }

  return createMCPSuccessResponse({
    tool: 'memory_delete',
    summary,
    data,
    hints,
  });
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export { handleMemoryDelete };
