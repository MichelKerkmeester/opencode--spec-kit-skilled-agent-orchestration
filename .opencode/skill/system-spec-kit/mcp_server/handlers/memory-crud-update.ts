// ------- MODULE: Memory CRUD Update Handler -------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import type { UpdateMemoryParams } from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as bm25Index from '../lib/search/bm25-index';
import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers';
import { MemoryError, ErrorCodes } from '../lib/errors';
import * as toolCache from '../lib/cache/tool-cache';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils';
import { clearConstitutionalCache } from '../hooks/memory-surface';

import type { MCPResponse } from './types';
import type { UpdateArgs } from './memory-crud-types';

/* ---------------------------------------------------------------
   CORE LOGIC
--------------------------------------------------------------- */

/** Handle memory_update tool -- updates metadata fields and optionally regenerates embeddings. */
async function handleMemoryUpdate(args: UpdateArgs): Promise<MCPResponse> {
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

  if (title !== undefined && title !== existing.title) {
    console.error(`[memory-update] Title changed, regenerating embedding for memory ${id}`);
    let newEmbedding: Float32Array | null = null;

    try {
      // TODO(REQ-S2-001): Could integrate persistent embedding cache here (see memory-save.ts)
      newEmbedding = await embeddings.generateDocumentEmbedding(title);
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      if (allowPartialUpdate) {
        console.warn(`[memory-update] Embedding regeneration failed, marking for re-index: ${message}`);
        vectorIndex.updateEmbeddingStatus(id, 'pending');
        embeddingMarkedForReindex = true;
      } else {
        console.error(`[memory-update] Embedding regeneration failed, rolling back update: ${message}`);
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
        vectorIndex.updateEmbeddingStatus(id, 'pending');
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

  vectorIndex.updateMemory(updateParams);
  triggerMatcher.clearCache();
  toolCache.invalidateOnWrite('update', { memoryId: id });
  clearConstitutionalCache();

  // AI-WHY: BM25 index stores title text; must re-index when title changes
  // so keyword search reflects the updated title.
  if (updateParams.title !== undefined && bm25Index.isBm25Enabled()) {
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
    } catch (e) {
      console.warn(`[memory-crud-update] BM25 re-index after title change failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const fields = Object.keys(updateParams).filter((key) => key !== 'id' && key !== 'embedding');

  appendMutationLedgerSafe(database, {
    mutationType: 'update',
    reason: 'memory_update: metadata update',
    priorHash: priorSnapshot?.content_hash ?? existing.content_hash ?? null,
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

  const data: Record<string, unknown> = {
    updated: id,
    fields,
    embeddingRegenerated,
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
