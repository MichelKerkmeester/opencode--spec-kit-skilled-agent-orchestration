// ---------------------------------------------------------------
// MODULE: Memory Bulk Delete Handler
// ---------------------------------------------------------------
// Tier-based bulk deletion of memories with safety gates.
// Eliminates the need for direct DB scripts when cleaning up
// deprecated/temporary memories at scale.
// ---------------------------------------------------------------

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as toolCache from '../lib/cache/tool-cache';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { appendMutationLedgerSafe } from './memory-crud-utils';
import { clearConstitutionalCache } from '../hooks/memory-surface';
// AI-WHY: Fix #32 — Dynamic import used because co-activation.ts may not be in tsconfig.
// eslint-disable-next-line @typescript-eslint/no-var-requires

import type { MCPResponse } from './types';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface BulkDeleteArgs {
  tier: string;
  specFolder?: string;
  confirm: boolean;
  olderThanDays?: number;
  skipCheckpoint?: boolean;
}

/* ---------------------------------------------------------------
   2. HANDLER
--------------------------------------------------------------- */

async function handleMemoryBulkDelete(args: BulkDeleteArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  const { tier, specFolder, confirm, olderThanDays, skipCheckpoint = false } = args;

  // Validation
  if (!tier || typeof tier !== 'string') {
    throw new Error('tier is required and must be a string');
  }

  const validTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
  if (!validTiers.includes(tier)) {
    throw new Error(`Invalid tier: "${tier}". Must be one of: ${validTiers.join(', ')}`);
  }

  if (!confirm) {
    throw new Error('Bulk delete requires confirm: true as a safety gate');
  }

  // Safety: refuse to bulk-delete constitutional or critical tiers without explicit specFolder scope
  if ((tier === 'constitutional' || tier === 'critical') && !specFolder) {
    throw new Error(`Bulk delete of "${tier}" tier requires specFolder scope for safety. Use memory_delete for individual deletions.`);
  }

  if ((tier === 'constitutional' || tier === 'critical') && skipCheckpoint) {
    throw new Error(`skipCheckpoint is not allowed for "${tier}" tier. Checkpoint is mandatory for high-safety tiers.`);
  }

  const database = vectorIndex.getDb();
  if (!database) {
    throw new Error('Database not available');
  }

  // Build query to count affected memories
  let countSql = 'SELECT COUNT(*) as count FROM memory_index WHERE importance_tier = ?';
  const countParams: unknown[] = [tier];

  if (specFolder) {
    countSql += ' AND spec_folder = ?';
    countParams.push(specFolder);
  }

  if (olderThanDays !== undefined && olderThanDays > 0) {
    countSql += ` AND created_at < datetime('now', '-' || ? || ' days')`;
    countParams.push(olderThanDays);
  }

  const countResult = database.prepare(countSql).get(...countParams) as { count: number };
  const affectedCount = countResult.count;

  if (affectedCount === 0) {
    return createMCPSuccessResponse({
      tool: 'memory_bulk_delete',
      summary: `No memories found with tier="${tier}"${specFolder ? ` in folder "${specFolder}"` : ''}${olderThanDays ? ` older than ${olderThanDays} days` : ''}`,
      data: { deleted: 0, tier, specFolder: specFolder || null },
      hints: ['Use memory_list() to browse existing memories'],
    });
  }

  // Create auto-checkpoint before bulk deletion (unless explicitly skipped)
  let checkpointName: string | null = null;
  if (!skipCheckpoint) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const proposedCheckpointName = `pre-bulk-delete-${tier}-${timestamp}`;

    try {
      const checkpoint = checkpoints.createCheckpoint({
        name: proposedCheckpointName,
        specFolder,
        metadata: {
          reason: `auto-checkpoint before bulk delete of ${affectedCount} "${tier}" memories`,
          tier,
          affectedCount,
          olderThanDays: olderThanDays || null,
        },
      });

      if (!checkpoint) {
        const checkpointError = `Checkpoint creation failed before deleting ${tier} memories`;
        if (tier === 'constitutional' || tier === 'critical') {
          throw new Error(`${checkpointError}. Aborting high-safety bulk delete.`);
        }
        console.warn(`[memory-bulk-delete] ${checkpointError}. Proceeding without rollback.`);
      } else {
        checkpointName = checkpoint.name;
        console.error(`[memory-bulk-delete] Created checkpoint: ${checkpointName}`);
      }
    } catch (cpErr: unknown) {
      const message = toErrorMessage(cpErr);
      console.error(`[memory-bulk-delete] Failed to create checkpoint: ${message}`);
      // High-safety tiers require a valid checkpoint.
      if (tier === 'constitutional' || tier === 'critical') {
        throw new Error(`Failed to create mandatory checkpoint for "${tier}" tier: ${message}`);
      }
      // Lower tiers can proceed with explicit no-rollback notice.
      checkpointName = null;
    }
  } else {
    console.error('[memory-bulk-delete] Checkpoint creation skipped by caller (skipCheckpoint=true)');
  }

  // Fetch IDs for deletion (needed for causal edge cleanup and ledger)
  let selectSql = 'SELECT id, content_hash, file_path FROM memory_index WHERE importance_tier = ?';
  const selectParams: unknown[] = [tier];

  if (specFolder) {
    selectSql += ' AND spec_folder = ?';
    selectParams.push(specFolder);
  }

  if (olderThanDays !== undefined && olderThanDays > 0) {
    selectSql += ` AND created_at < datetime('now', '-' || ? || ' days')`;
    selectParams.push(olderThanDays);
  }

  const memoriesToDelete = database.prepare(selectSql).all(...selectParams) as Array<{
    id: number;
    content_hash: string | null;
    file_path: string | null;
  }>;

  // Perform deletion in a transaction
  let deletedCount = 0;
  const deletedIds: number[] = [];

  causalEdges.init(database);

  const bulkDeleteTx = database.transaction(() => {
    for (const memory of memoriesToDelete) {
      if (vectorIndex.deleteMemory(memory.id)) {
        deletedCount++;
        deletedIds.push(memory.id);

        // Clean up causal edges
        try {
          causalEdges.deleteEdgesForMemory(String(memory.id));
        } catch (edgeErr: unknown) {
          const msg = toErrorMessage(edgeErr);
          console.warn(`[memory-bulk-delete] Failed to clean up causal edges for memory ${memory.id}: ${msg}`);
        }
      }
    }
  });

  bulkDeleteTx();

  // Record in mutation ledger (single entry for bulk operation)
  appendMutationLedgerSafe(database, {
    mutationType: 'delete',
    reason: `memory_bulk_delete: deleted ${deletedCount} memories with tier="${tier}"`,
    priorHash: null,
    newHash: mutationLedger.computeHash(`bulk-delete-tier:${tier}:${deletedCount}:${Date.now()}`),
    linkedMemoryIds: deletedIds.slice(0, 50), // Cap at 50 to avoid bloating ledger
    decisionMeta: {
      tool: 'memory_bulk_delete',
      tier,
      specFolder: specFolder || null,
      olderThanDays: olderThanDays || null,
      totalDeleted: deletedCount,
      checkpoint: checkpointName,
      skipCheckpoint,
    },
    actor: 'mcp:memory_bulk_delete',
  });

  // Invalidate caches
  if (deletedCount > 0) {
    triggerMatcher.clearCache();
    toolCache.invalidateOnWrite('delete', { specFolder });
    clearConstitutionalCache();
    // AI-WHY: Fix #32 (017-refinement-phase-6) — Clear co-activation cache after bulk ops
    try {
      const coAct = require('../lib/cognitive/co-activation') as { clearRelatedCache?: () => void };
      coAct.clearRelatedCache?.();
    } catch { /* best-effort */ }
  }

  const summary = `Deleted ${deletedCount} "${tier}" memory(s)${specFolder ? ` from "${specFolder}"` : ''}${olderThanDays ? ` older than ${olderThanDays} days` : ''}`;

  const hints: string[] = [];
  if (checkpointName) {
    hints.push(`Restore with: checkpoint_restore({ name: "${checkpointName}" })`);
  } else if (skipCheckpoint) {
    hints.push('Checkpoint skipped: restore is not available for this operation');
  }
  hints.push(`Run memory_index_scan({ force: true }) to re-index if needed`);

  const data: Record<string, unknown> = {
    deleted: deletedCount,
    tier,
    specFolder: specFolder || null,
    olderThanDays: olderThanDays || null,
    skipCheckpoint,
  };
  if (checkpointName) {
    data.checkpoint = checkpointName;
    data.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
  }

  return createMCPSuccessResponse({
    tool: 'memory_bulk_delete',
    summary,
    data,
    hints,
  });
}

/* ---------------------------------------------------------------
   3. EXPORTS
--------------------------------------------------------------- */

export { handleMemoryBulkDelete };
