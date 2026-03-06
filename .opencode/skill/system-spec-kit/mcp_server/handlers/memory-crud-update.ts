// ---------------------------------------------------------------
// MODULE: Memory CRUD Update Handler
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import { randomUUID } from 'node:crypto';
import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import type { UpdateMemoryParams } from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as bm25Index from '../lib/search/bm25-index';
import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers';
import { MemoryError, ErrorCodes } from '../lib/errors';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils';
import { runPostMutationHooks } from './mutation-hooks';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback';

import type { MCPResponse } from './types';
import type { UpdateArgs } from './memory-crud-types';

/* ---------------------------------------------------------------
   CORE LOGIC
--------------------------------------------------------------- */

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

  if (title !== undefined && title !== existing.title) {
    console.error(`[memory-update] Title changed, regenerating embedding for memory ${id} [requestId=${requestId}]`);
    let newEmbedding: Float32Array | null = null;

    try {
      // AI-WHY: Fix #19 (017-refinement-phase-6) — Embed title + content_text, not title alone.
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

  // AI-WHY: T2-5 transaction wrapper — wraps all synchronous mutation steps (DB update,
  // cache invalidation, BM25 re-index, ledger append) in a single transaction for atomicity.
  // AI-WHY: Embedding generation (async) runs before this block; its result feeds into updateParams.
  const fields = Object.keys(updateParams).filter((key) => key !== 'id' && key !== 'embedding');

  if (database) {
    database.transaction(() => {
      if (embeddingStatusNeedsPendingWrite) {
        vectorIndex.updateEmbeddingStatus(id, 'pending');
      }

      vectorIndex.updateMemory(updateParams);

      // AI-WHY: T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
      // so keyword search reflects the updated content.
      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
        try {
          const row = database.prepare(
            'SELECT title, content_text, trigger_phrases, file_path FROM memory_index WHERE id = ?'
          ).get(id) as { title: string | null; content_text: string | null; trigger_phrases: string | null; file_path: string | null } | undefined;
          if (row) {
            const textParts: string[] = [];
            if (row.title) textParts.push(row.title);
            if (row.content_text) textParts.push(row.content_text);
            if (row.trigger_phrases) textParts.push(row.trigger_phrases);
            if (row.file_path) textParts.push(row.file_path);
            const text = textParts.join(' ');
            if (text.trim()) {
              bm25Index.getIndex().addDocument(String(id), text);
            }
          }
        } catch (e: unknown) {
          console.warn(`[memory-crud-update] BM25 re-index failed [requestId=${requestId}]: ${e instanceof Error ? e.message : String(e)}`);
        }
      }

      appendMutationLedgerSafe(database, {
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
    })();
  } else {
    // AI-RISK: No database handle — running without transaction; prior behavior preserved but not atomic.
    if (embeddingStatusNeedsPendingWrite) {
      vectorIndex.updateEmbeddingStatus(id, 'pending');
    }

    vectorIndex.updateMemory(updateParams);

    if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
      try {
        const db = vectorIndex.getDb();
        if (db) {
          const row = db.prepare(
            'SELECT title, content_text, trigger_phrases, file_path FROM memory_index WHERE id = ?'
          ).get(id) as { title: string | null; content_text: string | null; trigger_phrases: string | null; file_path: string | null } | undefined;
          if (row) {
            const textParts: string[] = [];
            if (row.title) textParts.push(row.title);
            if (row.content_text) textParts.push(row.content_text);
            if (row.trigger_phrases) textParts.push(row.trigger_phrases);
            if (row.file_path) textParts.push(row.file_path);
            const text = textParts.join(' ');
            if (text.trim()) {
              bm25Index.getIndex().addDocument(String(id), text);
            }
          }
        }
      } catch (e: unknown) {
        console.warn(`[memory-crud-update] BM25 re-index failed [requestId=${requestId}]: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    appendMutationLedgerSafe(database, {
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
  }

  const postMutationHooks = runPostMutationHooks('update', { memoryId: id });
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

  return createMCPSuccessResponse({
    tool: 'memory_update',
    summary,
    data,
    hints,
  });
}

/* ---------------------------------------------------------------
   EXPORTS
--------------------------------------------------------------- */

export { handleMemoryUpdate };
