// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Update Handler
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';
import { checkDatabaseUpdated } from '../core/index.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import type { UpdateMemoryParams } from '../lib/search/vector-index.js';
import * as embeddings from '../lib/providers/embeddings.js';
import * as bm25Index from '../lib/search/bm25-index.js';
import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers.js';
import { MemoryError, ErrorCodes } from '../lib/errors.js';
import * as mutationLedger from '../lib/storage/mutation-ledger.js';
import { runInTransaction } from '../lib/storage/transaction-manager.js';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import { toErrorMessage } from '../utils/index.js';

import { recordHistory } from '../lib/storage/history.js';
import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils.js';
import { runPostMutationHooks } from './mutation-hooks.js';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';

import type { MCPResponse } from './types.js';
import type { UpdateArgs } from './memory-crud-types.js';

// Feature catalog: Memory metadata update (memory_update)
// Feature catalog: Validation feedback (memory_validate)
// Feature catalog: Transaction wrappers on mutation handlers
// Feature catalog: Per-memory history log


/* ───────────────────────────────────────────────────────────────
   CORE LOGIC
──────────────────────────────────────────────────────────────── */

/** Handle memory_update tool -- updates metadata fields and optionally regenerates embeddings. */
async function handleMemoryUpdate(args: UpdateArgs): Promise<MCPResponse> {
  // A7-P2-1: Generate requestId for incident correlation in error responses
  const requestId = randomUUID();
  await checkDatabaseUpdated();

  const {
    id,
    title,
    triggerPhrases,
    importanceWeight,
    importanceTier,
    allowPartialUpdate = false,
  } = args;

  if (typeof id !== 'number') {
    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'id is required', { param: 'id' });
  }

  if (importanceWeight !== undefined && (typeof importanceWeight !== 'number' || importanceWeight < 0 || importanceWeight > 1)) {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      'importanceWeight must be a number between 0 and 1',
      { param: 'importanceWeight', value: importanceWeight }
    );
  }

  if (importanceTier !== undefined && !isValidTier(importanceTier)) {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      `Invalid importance tier: ${importanceTier}. Valid tiers: ${VALID_TIERS.join(', ')}`,
      { param: 'importanceTier', value: importanceTier }
    );
  }

  const existing = vectorIndex.getMemory(id);
  if (!existing) {
    throw new MemoryError(ErrorCodes.FILE_NOT_FOUND, `Memory not found: ${id}`, { id });
  }

  const database = vectorIndex.getDb();
  const priorSnapshot = getMemoryHashSnapshot(database, id);

  const updateParams: UpdateMemoryParams = { id };
  if (title !== undefined) updateParams.title = title;
  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
  if (importanceWeight !== undefined) updateParams.importanceWeight = importanceWeight;
  if (importanceTier !== undefined) updateParams.importanceTier = importanceTier;

  let embeddingRegenerated = false;
  let embeddingMarkedForReindex = false;
  let embeddingStatusNeedsPendingWrite = false;
  let mutationLedgerWarning: string | null = null;

  if (title !== undefined && title !== existing.title) {
    console.error(`[memory-update] Title changed, regenerating embedding for memory ${id} [requestId=${requestId}]`);
    let newEmbedding: Float32Array | null = null;

    try {
      // Embed title + content_text, not title alone.
      // This produces better semantic embeddings that capture the full memory context.
      const contentText = existing.content_text || '';
      const embeddingInput = contentText ? `${title}\n\n${contentText}` : title;
      newEmbedding = await embeddings.generateDocumentEmbedding(embeddingInput);
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      if (allowPartialUpdate) {
        console.warn(`[memory-update] Embedding regeneration failed, marking for re-index [requestId=${requestId}]: ${message}`);
        embeddingStatusNeedsPendingWrite = true;
        embeddingMarkedForReindex = true;
      } else {
        console.error(`[memory-update] Embedding regeneration failed, rolling back update [requestId=${requestId}]: ${message}`);
        throw new MemoryError(
          ErrorCodes.EMBEDDING_FAILED,
          'Embedding regeneration failed, update rolled back. No changes were made.',
          { originalError: message, memoryId: id }
        );
      }
    }

    if (newEmbedding) {
      updateParams.embedding = newEmbedding;
      embeddingRegenerated = true;
    } else if (!embeddingMarkedForReindex) {
      if (allowPartialUpdate) {
        console.warn('[memory-update] Embedding returned null, marking for re-index');
        embeddingStatusNeedsPendingWrite = true;
        embeddingMarkedForReindex = true;
      } else {
        throw new MemoryError(
          ErrorCodes.EMBEDDING_FAILED,
          'Failed to regenerate embedding (null result), update rolled back. No changes were made.',
          { memoryId: id }
        );
      }
    }
  }

  // T2-5 transaction wrapper — wraps all synchronous mutation steps (DB update,
  // Cache invalidation, BM25 re-index, ledger append) in a single transaction for atomicity.
  // Embedding generation (async) runs before this block; its result feeds into updateParams.
  const fields = Object.keys(updateParams).filter((key) => key !== 'id' && key !== 'embedding');

  if (database) {
    runInTransaction(database, () => {
      if (embeddingStatusNeedsPendingWrite) {
        vectorIndex.updateEmbeddingStatus(id, 'pending');
      }

      vectorIndex.updateMemory(updateParams);

      // T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
      // So keyword search reflects the updated content.
      // T-05: BM25 re-index failure now rolls back the transaction when the index is operational.
      // Infrastructure failures (BM25 not available, DB missing prepare) are non-fatal warnings.
      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
        try {
          const bm25Idx = bm25Index.getIndex();
          const row = database.prepare(
            'SELECT title, content_text, trigger_phrases, file_path FROM memory_index WHERE id = ?'
          ).get(id) as { title: string | null; content_text: string | null; trigger_phrases: string | null; file_path: string | null } | undefined;
          if (row) {
            const text = bm25Index.buildBm25DocumentText(row);
            if (text.trim()) {
              bm25Idx.addDocument(String(id), text);
            }
          }
        } catch (e: unknown) {
          const bm25ErrMsg = e instanceof Error ? e.message : String(e);
          // T-05 + P1-02 fix: Distinguish infrastructure failures from data failures.
          // Infrastructure failures mean the BM25 subsystem is unavailable or torn down —
          // These are non-fatal warnings. Data failures mean the index IS operational but rejected
          // The input — those must re-throw to roll back the transaction.
          const isBm25InfraFailure = (msg: string): boolean =>
            msg.includes('not a function') ||
            msg.includes('not initialized') ||
            msg.includes('Cannot read properties') ||
            msg.includes('is not defined') ||
            msg.includes('database is closed') ||
            msg.includes('no such table');
          if (isBm25InfraFailure(bm25ErrMsg)) {
            console.warn(`[memory-crud-update] BM25 infrastructure unavailable, skipping re-index [requestId=${requestId}]: ${bm25ErrMsg}`);
          } else {
            console.error(`[memory-crud-update] BM25 re-index failed, rolling back update [requestId=${requestId}]: ${bm25ErrMsg}`);
            throw new Error(`BM25 re-index failed: ${bm25ErrMsg}`);
          }
        }
      }

      // T-05: Record UPDATE history after successful mutation
      try {
        recordHistory(
          id, 'UPDATE',
          existing.title ?? null,
          updateParams.title ?? existing.title ?? null,
          'mcp:memory_update'
        );
      } catch (_histErr: unknown) {
        // History recording is best-effort
      }

      const ledgerRecorded = appendMutationLedgerSafe(database, {
        mutationType: 'update',
        reason: 'memory_update: metadata update',
        priorHash: priorSnapshot?.content_hash ?? (existing.content_hash as string | null) ?? null,
        newHash: mutationLedger.computeHash(JSON.stringify({
          id,
          title: updateParams.title ?? existing.title ?? null,
          triggerPhrases: updateParams.triggerPhrases ?? null,
          importanceWeight: updateParams.importanceWeight ?? null,
          importanceTier: updateParams.importanceTier ?? null,
        })),
        linkedMemoryIds: [id],
        decisionMeta: {
          tool: 'memory_update',
          fields,
          embeddingRegenerated,
          embeddingMarkedForReindex,
          allowPartialUpdate,
        },
        actor: 'mcp:memory_update',
      });
      if (!ledgerRecorded) {
        mutationLedgerWarning = 'Mutation ledger append failed; audit trail may be incomplete.';
      }
    });
  } else {
    // P1-021 — No database handle means we cannot guarantee transactional
    // Consistency. Abort early rather than risk partial state.
    console.warn('[memory-crud-update] No database handle, aborting update to prevent partial state');
    return createMCPErrorResponse({
      tool: 'memory_update',
      error: `Memory ${id} update aborted: database unavailable`,
      code: 'E_DB_UNAVAILABLE',
      details: { updated: null, fields },
      recovery: {
        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
        severity: 'error',
      },
    });
  }

  let postMutationHooks: import('./mutation-hooks.js').MutationHookResult;
  try {
    postMutationHooks = runPostMutationHooks('update', { memoryId: id });
  } catch (hookError: unknown) {
    const msg = hookError instanceof Error ? hookError.message : String(hookError);
    postMutationHooks = {
      latencyMs: 0, triggerCacheCleared: false,
      constitutionalCacheCleared: false, toolCacheInvalidated: 0,
      graphSignalsCacheCleared: false, coactivationCacheCleared: false,
      errors: [msg],
    };
  }
  const postMutationFeedback = buildMutationHookFeedback('update', postMutationHooks);

  const summary = embeddingMarkedForReindex
    ? `Memory ${id} updated (embedding pending re-index)`
    : `Memory ${id} updated successfully`;

  const hints: string[] = [];
  if (embeddingMarkedForReindex) {
    hints.push('Run memory_index_scan() to regenerate embeddings');
  }
  if (embeddingRegenerated) {
    hints.push('Embedding regenerated - search results may differ');
  }
  if (mutationLedgerWarning) {
    hints.push(mutationLedgerWarning);
  }
  hints.push(...postMutationFeedback.hints);

  const data: Record<string, unknown> = {
    updated: id,
    fields,
    embeddingRegenerated,
    postMutationHooks: postMutationFeedback.data,
  };

  if (embeddingMarkedForReindex) {
    data.warning = 'Embedding regeneration failed, memory marked for re-indexing';
    data.embeddingStatus = 'pending';
  }
  if (mutationLedgerWarning) {
    data.mutationLedgerWarning = mutationLedgerWarning;
  }

  return createMCPSuccessResponse({
    tool: 'memory_update',
    summary,
    data,
    hints,
  });
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export { handleMemoryUpdate };
