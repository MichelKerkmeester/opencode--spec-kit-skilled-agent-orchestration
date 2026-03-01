// ------- MODULE: Memory CRUD Delete Handler -------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as toolCache from '../lib/cache/tool-cache';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils';
import { clearConstitutionalCache } from '../hooks/memory-surface';

import type { MCPResponse } from './types';
import type { DeleteArgs, MemoryHashSnapshot } from './memory-crud-types';

/* ---------------------------------------------------------------
   CORE LOGIC
--------------------------------------------------------------- */

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
  const database = vectorIndex.getDb();

  if (numericId !== null) {
    const singleSnapshot = getMemoryHashSnapshot(database, numericId);
    deletedCount = vectorIndex.deleteMemory(numericId) ? 1 : 0;

    if (deletedCount > 0) {
      try {
        if (database) {
          causalEdges.init(database);
          causalEdges.deleteEdgesForMemory(String(numericId));
        }
      } catch (edgeErr: unknown) {
        const msg = toErrorMessage(edgeErr);
        console.warn(`[memory-delete] Failed to clean up causal edges for memory ${numericId}: ${msg}`);
      }

      appendMutationLedgerSafe(database, {
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
    }
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
        // Non-fatal: bulk delete still proceeds without per-memory hash snapshots
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
        // confirm is always true here (validated at function entry)
        console.warn('[memory-delete] Proceeding without backup (user confirmed)');
        checkpointName = null;
      }
    }

    // AI-WHY: snapshot-then-delete is safe under single-process better-sqlite3; re-evaluate if multi-process support is added
    if (database) {
      causalEdges.init(database);
      const bulkDeleteTx = database.transaction(() => {
        for (const memory of memories) {
          if (vectorIndex.deleteMemory(memory.id)) {
            deletedCount++;
            deletedIds.push(memory.id);
            try {
              causalEdges.deleteEdgesForMemory(String(memory.id));
            } catch (edgeErr: unknown) {
              const msg = toErrorMessage(edgeErr);
              console.warn(`[memory-delete] Failed to clean up causal edges for memory ${memory.id}: ${msg}`);
            }
          }
        }

        // Mutation ledger entries inside transaction for atomicity
        for (const deletedId of deletedIds) {
          const snapshot = hashById.get(deletedId) ?? null;
          appendMutationLedgerSafe(database, {
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
        }
      });
      bulkDeleteTx();
    } else {
      for (const memory of memories) {
        if (vectorIndex.deleteMemory(memory.id)) {
          deletedCount++;
          deletedIds.push(memory.id);
        }
      }
    }
  }

  if (deletedCount > 0) {
    triggerMatcher.clearCache();
    toolCache.invalidateOnWrite('delete', { specFolder });
    clearConstitutionalCache();
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

  const data: Record<string, unknown> = { deleted: deletedCount };
  if (checkpointName) {
    data.checkpoint = checkpointName;
    data.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
  }

  return createMCPSuccessResponse({
    tool: 'memory_delete',
    summary,
    data,
    hints,
  });
}

/* ---------------------------------------------------------------
   EXPORTS
--------------------------------------------------------------- */

export { handleMemoryDelete };
