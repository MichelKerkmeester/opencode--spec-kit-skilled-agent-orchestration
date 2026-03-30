// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Mutations
// ───────────────────────────────────────────────────────────────
// Feature catalog: Hybrid search pipeline
// Split from vector-index-store.ts — contains ALL mutation functions:
// Index, update, delete, and status/confidence updates.

import * as embeddingsProvider from '../providers/embeddings.js';
import { clearGraphSignalsCache } from '../graph/graph-signals.js';
import { recordHistory } from '../storage/history.js';
import { getCanonicalPathKey } from '../utils/canonical-path.js';
import { createLogger } from '../utils/logger.js';
import { clearDegreeCacheForDb } from './graph-search-fn.js';
import * as bm25Index from './bm25-index.js';
import {
  clear_search_cache,
} from './vector-index-aliases.js';
import {
  get_error_message,
  to_embedding_buffer,
  VectorIndexError,
  VectorIndexErrorCode,
} from './vector-index-types.js';
import {
  clear_constitutional_cache,
  get_embedding_dim,
  initialize_db,
  init_prepared_statements,
  refresh_interference_scores_for_folder,
  sqlite_vec_available as get_sqlite_vec_available,
} from './vector-index-store.js';
import type {
  IndexMemoryParams as SharedIndexMemoryParams,
  UpdateMemoryParams as SharedUpdateMemoryParams,
} from './vector-index-types.js';
import type Database from 'better-sqlite3';

const logger = createLogger('VectorIndex');

function isExpectedMissingVecMemoriesTable(error: unknown): boolean {
  const message = get_error_message(error).toLowerCase();
  return message.includes('no such table') && message.includes('vec_memories');
}

function invalidateGraphCaches(database: Database.Database): void {
  try {
    clearDegreeCacheForDb(database);
  } catch (_error: unknown) {
    // Degree cache invalidation is best-effort for legacy mutation paths.
  }

  try {
    clearGraphSignalsCache();
  } catch (_error: unknown) {
    // Graph signal cache invalidation is best-effort for legacy mutation paths.
  }
}

function deleteAncillaryMemoryRows(database: Database.Database, id: number): void {
  const ancillaryTables = [
    'DELETE FROM degree_snapshots WHERE memory_id = ?',
    'DELETE FROM community_assignments WHERE memory_id = ?',
    'DELETE FROM memory_summaries WHERE memory_id = ?',
    'DELETE FROM memory_entities WHERE memory_id = ?',
    'DELETE FROM memory_lineage WHERE memory_id = ?',
    'DELETE FROM shared_space_conflicts WHERE existing_memory_id = ? OR incoming_memory_id = ?',
  ];

  for (const sql of ancillaryTables) {
    try {
      const paramCount = (sql.match(/\?/g) || []).length;
      if (paramCount === 2) {
        database.prepare(sql).run(id, id);
      } else {
        database.prepare(sql).run(id);
      }
    } catch (_error: unknown) {
      // Best-effort for legacy databases that may not have these tables yet.
    }
  }

  // B10: Clean active_memory_projection rows referencing this memory.
  try {
    database.prepare('DELETE FROM active_memory_projection WHERE active_memory_id = ?').run(id);
  } catch (_error: unknown) {
    // Best-effort for legacy databases that may not have projection tables yet.
  }

  try {
    const memoryIdText = String(id);
    database.prepare(`
      DELETE FROM causal_edges
      WHERE source_id IN (?, ?)
         OR target_id IN (?, ?)
    `).run(id, memoryIdText, id, memoryIdText);
    invalidateGraphCaches(database);
  } catch (_error: unknown) {
    // Best-effort for legacy databases that may not have causal edges yet.
  }
}

function upsert_active_projection(
  database: ReturnType<typeof initialize_db>,
  specFolder: string,
  canonicalFilePath: string,
  anchorId: string | null,
  memoryId: number,
  updatedAt: string,
): void {
  const logicalKey = `${specFolder}::${canonicalFilePath}::${anchorId && anchorId.trim().length > 0 ? anchorId : '_'}`;
  // Evict any stale projection row that maps a *different* logical_key to the
  // same active_memory_id — prevents UNIQUE constraint violation on re-index
  // when the logical_key changes (e.g. anchor or path normalization drift).
  database.prepare(
    'DELETE FROM active_memory_projection WHERE active_memory_id = ? AND logical_key != ?',
  ).run(memoryId, logicalKey);
  database.prepare(`
    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(logical_key) DO UPDATE SET
      root_memory_id = excluded.root_memory_id,
      active_memory_id = excluded.active_memory_id,
      updated_at = excluded.updated_at
  `).run(logicalKey, memoryId, memoryId, updatedAt);
}

// These mutation-local extensions are intentional until the shared query/store
// contract adopts appendOnly and canonicalFilePath semantics.
type IndexMemoryParams = Readonly<SharedIndexMemoryParams> & {
  readonly appendOnly?: boolean;
};
type IndexMemoryDeferredParams = Omit<IndexMemoryParams, 'embedding'> & {
  readonly failureReason?: string | null;
};
type UpdateMemoryParams = Readonly<SharedUpdateMemoryParams> & {
  readonly canonicalFilePath?: string;
};

/**
 * Indexes a memory with an embedding payload.
 * @param params - The memory values to index.
 * @returns The indexed memory identifier.
 * @throws {VectorIndexError} When embedding validation fails or the mutation cannot be applied.
 * @example
 * ```ts
 * const id = index_memory({
 *   specFolder: 'specs/001-demo',
 *   filePath: 'spec.md',
 *   embedding,
 * });
 * ```
 */
export function index_memory(
  params: IndexMemoryParams,
  database: Database.Database = initialize_db(),
): number {
  const {
    specFolder,
    filePath,
    parentId = null,
    anchorId = null,
    title = null,
    triggerPhrases = [],
    importanceWeight = 0.5,
    embedding,
    encodingIntent,
    documentType = 'memory',
    specLevel = null,
    contentText = null,
    qualityScore = 0,
    qualityFlags = [],
    appendOnly = false,
  } = params;

  if (!embedding) {
    throw new VectorIndexError('Embedding is required', VectorIndexErrorCode.EMBEDDING_VALIDATION);
  }

  const expected_dim = get_embedding_dim();
  if (embedding.length !== expected_dim) {
    console.warn(`[vector-index] Embedding dimension mismatch: expected ${expected_dim}, got ${embedding.length}`);
    throw new VectorIndexError(
      `Embedding must be ${expected_dim} dimensions, got ${embedding.length}`,
      VectorIndexErrorCode.EMBEDDING_VALIDATION,
    );
  }

  const now = new Date().toISOString();
  const triggers_json = JSON.stringify(triggerPhrases);
  const embedding_buffer = to_embedding_buffer(embedding);
  const canonicalFilePath = getCanonicalPathKey(filePath);

  const stmts = init_prepared_statements(database);
  const existing = appendOnly
    ? null
    : stmts.get_by_folder_and_path.get(specFolder, canonicalFilePath, filePath, anchorId, anchorId);

  if (existing && !appendOnly) {
    return update_memory({
      id: existing.id,
      title: title ?? undefined,
      triggerPhrases,
      importanceWeight,
      embedding,
      encodingIntent,
      documentType,
      specLevel,
      contentText,
      qualityScore,
      qualityFlags,
      canonicalFilePath,
    }, database);
  }

  const sqlite_vec = get_sqlite_vec_available();

  const index_memory_tx = database.transaction(() => {
    const embedding_status = sqlite_vec ? 'success' : 'pending';

    const result = database.prepare(`
      INSERT INTO memory_index (
        spec_folder, file_path, canonical_file_path, anchor_id, title, trigger_phrases,
        importance_weight, created_at, updated_at, embedding_model,
        embedding_generated_at, embedding_status, encoding_intent, document_type, spec_level,
        content_text, quality_score, quality_flags, parent_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      specFolder, filePath, canonicalFilePath, anchorId, title, triggers_json,
      importanceWeight, now, now, embeddingsProvider.getModelName(), now, embedding_status,
      encodingIntent ?? 'document', documentType, specLevel, contentText, qualityScore, JSON.stringify(qualityFlags), parentId
    );

    const row_id = BigInt(result.lastInsertRowid);
    const metadata_id = Number(row_id);

    upsert_active_projection(database, specFolder, canonicalFilePath, anchorId, metadata_id, now);

    if (sqlite_vec) {
      // Remove orphaned vec_memories entry before insert
      database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(row_id);
      database.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
      `).run(row_id, embedding_buffer);
    }

    refresh_interference_scores_for_folder(database, specFolder);
    // H3 FIX: Invalidate search cache after insert
    clear_search_cache();

    return metadata_id;
  });

  return index_memory_tx();
}

// Deferred indexing - entry searchable via BM25/FTS5 only
/**
 * Indexes a memory record without storing an embedding yet.
 * @param params - The deferred memory values to index.
 * @returns The indexed memory identifier.
 */
export function index_memory_deferred(
  params: IndexMemoryDeferredParams,
  database: Database.Database = initialize_db(),
): number {
  const {
    specFolder,
    filePath,
    parentId = null,
    anchorId = null,
    title = null,
    triggerPhrases = [],
    importanceWeight = 0.5,
    failureReason = null,
    encodingIntent,
    documentType = 'memory',
    specLevel = null,
    contentText = null,
    qualityScore = 0,
    qualityFlags = [],
    appendOnly = false,
  } = params;

  const now = new Date().toISOString();
  const triggers_json = JSON.stringify(triggerPhrases);
  const canonicalFilePath = getCanonicalPathKey(filePath);

  const stmts = init_prepared_statements(database);
  const existing = appendOnly
    ? null
    : stmts.get_by_folder_and_path.get(specFolder, canonicalFilePath, filePath, anchorId, anchorId);

  const index_memory_deferred_tx = database.transaction(() => {
    if (existing && !appendOnly) {
      database.prepare(`
        UPDATE memory_index
        SET title = ?,
            trigger_phrases = ?,
            importance_weight = ?,
            canonical_file_path = ?,
            embedding_status = 'pending',
            failure_reason = ?,
            updated_at = ?,
            encoding_intent = COALESCE(?, encoding_intent),
            document_type = ?,
            spec_level = ?,
            content_text = ?,
            quality_score = ?,
            quality_flags = ?,
            retry_count = 0,
            last_retry_at = NULL
        WHERE id = ?
      `).run(title, triggers_json, importanceWeight, canonicalFilePath, failureReason, now, encodingIntent, documentType, specLevel, contentText, qualityScore, JSON.stringify(qualityFlags), existing.id);
      upsert_active_projection(database, specFolder, canonicalFilePath, anchorId, existing.id, now);
      refresh_interference_scores_for_folder(database, specFolder);
      return existing.id;
    }

    const result = database.prepare(`
      INSERT INTO memory_index (
        spec_folder, file_path, canonical_file_path, anchor_id, title, trigger_phrases,
        importance_weight, created_at, updated_at, embedding_status,
        failure_reason, retry_count, encoding_intent, document_type, spec_level,
        content_text, quality_score, quality_flags, parent_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 0, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      specFolder, filePath, canonicalFilePath, anchorId, title, triggers_json,
      importanceWeight, now, now, failureReason, encodingIntent ?? 'document', documentType, specLevel, contentText, qualityScore, JSON.stringify(qualityFlags), parentId
    );

    const row_id = BigInt(result.lastInsertRowid);
    upsert_active_projection(database, specFolder, canonicalFilePath, anchorId, Number(row_id), now);
    refresh_interference_scores_for_folder(database, specFolder);
    logger.info(`Deferred indexing: Memory ${Number(row_id)} saved without embedding (BM25/FTS5 searchable)`);

    return Number(row_id);
  });

  return index_memory_deferred_tx();
}

/**
 * Updates stored memory metadata and embeddings.
 * @param params - The memory values to update.
 * @returns The updated memory identifier.
 * @throws {VectorIndexError} When embedding validation fails or the mutation transaction cannot complete.
 * @example
 * ```ts
 * const id = update_memory({ id: 42, title: 'Updated title', embedding });
 * ```
 */
export function update_memory(
  params: UpdateMemoryParams,
  database: Database.Database = initialize_db(),
): number {
  const {
    id,
    title,
    triggerPhrases,
    importanceWeight,
    importanceTier,
    embedding,
    canonicalFilePath,
    encodingIntent,
    documentType,
    specLevel,
    contentText,
    qualityScore,
    qualityFlags,
  } = params;

  const now = new Date().toISOString();

  const update_memory_tx = database.transaction(() => {
    const existingRow = database.prepare(`
      SELECT spec_folder, anchor_id, canonical_file_path, file_path
      FROM memory_index
      WHERE id = ?
    `).get(id) as {
      spec_folder: string | null;
      anchor_id: string | null;
      canonical_file_path: string | null;
      file_path: string | null;
    } | undefined;
    const updates = ['updated_at = ?'];
    const values: unknown[] = [now];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (triggerPhrases !== undefined) {
      updates.push('trigger_phrases = ?');
      values.push(JSON.stringify(triggerPhrases));
    }
    if (importanceWeight !== undefined) {
      updates.push('importance_weight = ?');
      values.push(importanceWeight);
    }
    if (importanceTier !== undefined) {
      updates.push('importance_tier = ?');
      values.push(importanceTier);
      clear_constitutional_cache();
    }
    if (canonicalFilePath !== undefined) {
      updates.push('canonical_file_path = ?');
      values.push(canonicalFilePath);
    }
    if (encodingIntent !== undefined) {
      updates.push('encoding_intent = ?');
      values.push(encodingIntent);
    }
    if (documentType !== undefined) {
      updates.push('document_type = ?');
      values.push(documentType);
    }
    if (specLevel !== undefined) {
      updates.push('spec_level = ?');
      values.push(specLevel);
    }
    if (contentText !== undefined) {
      updates.push('content_text = ?');
      values.push(contentText);
    }
    if (qualityScore !== undefined) {
      updates.push('quality_score = ?');
      values.push(qualityScore);
    }
    if (qualityFlags !== undefined) {
      updates.push('quality_flags = ?');
      values.push(JSON.stringify(qualityFlags));
    }
    if (embedding) {
      updates.push('embedding_model = ?');
      updates.push('embedding_generated_at = ?');
      // H1 FIX: Set 'pending' until vector write is confirmed
      updates.push('embedding_status = ?');
      values.push(embeddingsProvider.getModelName(), now, 'pending');
    }

    values.push(id);

    const updateResult = database.prepare(`
      UPDATE memory_index SET ${updates.join(', ')} WHERE id = ?
    `).run(...values);

    // B11: Return early if the target row no longer exists.
    if (updateResult.changes === 0) {
      return id;
    }

    const sqlite_vec = get_sqlite_vec_available();
    if (embedding && sqlite_vec) {
      const expected_dim = get_embedding_dim();
      if (embedding.length !== expected_dim) {
        console.warn(`[vector-index] Embedding dimension mismatch in update: expected ${expected_dim}, got ${embedding.length}`);
        throw new VectorIndexError(
          `Embedding must be ${expected_dim} dimensions, got ${embedding.length}`,
          VectorIndexErrorCode.EMBEDDING_VALIDATION,
        );
      }

      const embedding_buffer = to_embedding_buffer(embedding);
      database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
      database.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
      `).run(BigInt(id), embedding_buffer);
      // H1 FIX: Mark success only after vector write confirmed
      database.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('success', id);
    }

    if (existingRow?.spec_folder) {
      const projectionPath = canonicalFilePath
        ?? existingRow.canonical_file_path
        ?? getCanonicalPathKey(existingRow.file_path ?? '');
      upsert_active_projection(database, existingRow.spec_folder, projectionPath, existingRow.anchor_id ?? null, id, now);
    }

    if (existingRow?.spec_folder) {
      refresh_interference_scores_for_folder(database, existingRow.spec_folder);
    }
    // H3 FIX: Invalidate search cache after update
    clear_search_cache();

    return id;
  });

  return update_memory_tx();
}

/**
 * Deletes a memory and its related index records.
 * @param id - The memory identifier.
 * @returns True when a memory was deleted.
 * @throws {VectorIndexError} Propagates mutation or store initialization failures from the delete pipeline.
 * @example
 * ```ts
 * const deleted = delete_memory(42);
 * ```
 */
export function delete_memory(id: number, database: Database.Database = initialize_db()): boolean {
  return delete_memory_from_database(database, id);
}

/**
 * Deletes a memory and related index records using the provided database handle.
 * @param database - The database containing the target memory.
 * @param id - The memory identifier.
 * @returns True when a memory was deleted.
 * @throws {VectorIndexError} Propagates mutation failures encountered while deleting the memory.
 * @example
 * ```ts
 * const deleted = delete_memory_from_database(database, 42);
 * ```
 */
export function delete_memory_from_database(database: Database.Database, id: number): boolean {
  const sqlite_vec = get_sqlite_vec_available();

  const delete_memory_tx = database.transaction(() => {
    // Memory_history rows are intentionally preserved after deletion
    // So DELETE audit events recorded by handlers persist as audit trail.

    if (sqlite_vec) {
      try {
        database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
      } catch (e: unknown) {
        if (!isExpectedMissingVecMemoriesTable(e)) {
          throw new VectorIndexError(
            `Vector deletion failed for memory ${id}: ${get_error_message(e)}`,
            VectorIndexErrorCode.MUTATION_FAILED,
          );
        }
      }
    }

    // BUG-020: Clean ancillary records so deletes do not leave graph residue behind.
    deleteAncillaryMemoryRows(database, id);

    const result = database.prepare('DELETE FROM memory_index WHERE id = ?').run(id);

    clear_search_cache();
    clear_constitutional_cache();

    return result.changes > 0;
  });

  // BUG-021: Remove the BM25 document only after the source row is deleted.
  const deleted = delete_memory_tx();
  if (deleted) {
    try {
      if (bm25Index.isBm25Enabled()) {
        bm25Index.getIndex().removeDocument(String(id));
      }
    } catch (_error: unknown) {
      // BEST-EFFORT BM25 CLEANUP MUST NOT MASK A SUCCESSFUL PRIMARY DELETE.
    }
  }
  return deleted;
}

/**
 * Deletes the latest memory for a file path and optional anchor.
 * @param spec_folder - The owning spec folder.
 * @param file_path - The file path to delete.
 * @param anchor_id - The optional anchor identifier.
 * @returns True when a memory was deleted.
 * @throws {VectorIndexError} Propagates delete failures from the underlying mutation helpers.
 * @example
 * ```ts
 * const deleted = delete_memory_by_path('specs/001-demo', 'spec.md');
 * ```
 */
export function delete_memory_by_path(
  spec_folder: string,
  file_path: string,
  anchor_id: string | null = null,
  database: Database.Database = initialize_db(),
): boolean {
  const canonicalPath = getCanonicalPathKey(file_path);

  const row = database.prepare(`
    SELECT id, spec_folder FROM memory_index
    WHERE spec_folder = ?
      AND (canonical_file_path = ? OR file_path = ?)
      AND (anchor_id = ? OR (anchor_id IS NULL AND ? IS NULL))
    ORDER BY id DESC
    LIMIT 1
  `).get(spec_folder, canonicalPath, file_path, anchor_id, anchor_id) as { id: number; spec_folder?: string | null } | undefined;

  if (row) {
    const deleted = delete_memory_from_database(database, row.id);
    if (deleted) {
      // Self-record DELETE history only after the delete succeeded.
      try {
        recordHistory(row.id, 'DELETE', file_path ?? null, null, 'mcp:delete_by_path', row.spec_folder ?? spec_folder);
      } catch (_histErr: unknown) {
        // BEST-EFFORT HISTORY WRITES MUST NOT MASK A SUCCESSFUL DELETE.
      }
    }
    return deleted;
  }
  return false;
}

/**
 * Deletes multiple memories in a single transaction.
 * @param memory_ids - The memory identifiers to delete.
 * @returns Counts for deleted and failed items.
 * @throws {VectorIndexError} When one or more deletes fail and the transaction is rolled back.
 * @example
 * ```ts
 * const outcome = delete_memories([1, 2, 3]);
 * ```
 */
export function delete_memories(
  memory_ids: number[],
  database: Database.Database = initialize_db(),
): { deleted: number; failed: number } {
  if (!memory_ids || memory_ids.length === 0) {
    return { deleted: 0, failed: 0 };
  }
  const sqlite_vec = get_sqlite_vec_available();
  let deleted = 0;
  let failed = 0;
  const deletedIds: number[] = [];

  const specFolderById = new Map<number, string | null>();
  for (const id of memory_ids) {
    if (!Number.isInteger(id) || id <= 0) {
      continue;
    }
    try {
      const row = database.prepare('SELECT spec_folder FROM memory_index WHERE id = ?').get(id) as { spec_folder?: string | null } | undefined;
      specFolderById.set(id, row?.spec_folder ?? null);
    } catch (_error: unknown) {
      specFolderById.set(id, null);
    }
  }

  const delete_transaction = database.transaction(() => {
    let transactionDeleted = 0;
    let transactionFailed = 0;
    const failed_ids: number[] = [];

    for (const id of memory_ids) {
      try {
        if (sqlite_vec) {
          try {
            database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
          } catch (vec_error: unknown) {
            console.warn(`[VectorIndex] Failed to delete vector for memory ${id}: ${get_error_message(vec_error)}`);
          }
        }

        deleteAncillaryMemoryRows(database, id);
        const result = database.prepare('DELETE FROM memory_index WHERE id = ?').run(id);
        if (result.changes > 0) {
          // Memory_history rows are intentionally preserved after deletion
          // So DELETE audit events recorded here persist as audit trail.
          try {
            recordHistory(id, 'DELETE', null, null, 'mcp:delete_memories', specFolderById.get(id) ?? null);
          } catch (_histErr: unknown) {
            // BEST-EFFORT HISTORY WRITES MUST NOT MASK A SUCCESSFUL DELETE.
          }
          transactionDeleted++;
          deletedIds.push(id);
        } else {
          transactionFailed++;
          failed_ids.push(id);
        }
      } catch (e: unknown) {
        console.warn(`[vector-index] Failed to delete memory ${id}: ${get_error_message(e)}`);
        transactionFailed++;
        failed_ids.push(id);
      }
    }

    if (failed_ids.length > 0) {
      throw new VectorIndexError(
        `Failed to delete memories: ${failed_ids.join(', ')}. Transaction rolled back.`,
        VectorIndexErrorCode.MUTATION_FAILED,
      );
    }

    return {
      deleted: transactionDeleted,
      failed: transactionFailed,
    };
  });

  try {
    const outcome = delete_transaction();
    deleted = outcome.deleted;
    failed = outcome.failed;
    if (deleted > 0) {
      clear_constitutional_cache();
      clear_search_cache();
      try {
        if (bm25Index.isBm25Enabled()) {
          const bm25 = bm25Index.getIndex();
          for (const id of deletedIds) {
            bm25.removeDocument(String(id));
          }
        }
      } catch (_error: unknown) {
        // BM25 cleanup is best-effort for bulk deletes as well.
      }
    }
  } catch (e: unknown) {
    console.warn(`[vector-index] delete_memories transaction error: ${get_error_message(e)}`);
    deleted = 0;
    failed = memory_ids.length;
  }

  return { deleted, failed };
}

// Valid statuses: 'pending', 'success', 'failed', 'retry', 'partial'
/**
 * Updates the embedding status for a memory.
 * @param id - The memory identifier.
 * @param status - The new embedding status.
 * @returns True when the status was updated.
 */
export function update_embedding_status(
  id: number,
  status: string,
  database: Database.Database = initialize_db(),
): boolean {
  const valid_statuses = ['pending', 'success', 'failed', 'retry', 'partial'];
  if (!valid_statuses.includes(status)) {
    console.warn(`[vector-index] Invalid embedding status: ${status}`);
    return false;
  }

  try {
    const result = database.prepare(`
      UPDATE memory_index
      SET embedding_status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(status, id);

    return result.changes > 0;
  } catch (error: unknown) {
    console.warn(`[vector-index] Failed to update embedding status for ${id}: ${get_error_message(error)}`);
    return false;
  }
}

/**
 * Updates the confidence value for a memory.
 * @param memory_id - The memory identifier.
 * @param confidence - The confidence value to store.
 * @returns True when the confidence was updated.
 */
export function update_confidence(
  memory_id: number,
  confidence: number,
  database: Database.Database = initialize_db(),
): boolean {
  if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
    console.warn(`[vector-index] Invalid confidence value: ${confidence}`);
    return false;
  }

  try {
    const result = database.prepare(`
      UPDATE memory_index
      SET confidence = ?
      WHERE id = ?
    `).run(confidence, memory_id);

    return result.changes > 0;
  } catch (error: unknown) {
    console.warn(`[vector-index] Failed to update confidence for ${memory_id}: ${get_error_message(error)}`);
    return false;
  }
}

// CamelCase aliases
export { index_memory as indexMemory };
export { index_memory_deferred as indexMemoryDeferred };
export { update_memory as updateMemory };
export { delete_memory as deleteMemory };
export { delete_memory_by_path as deleteMemoryByPath };
export { delete_memories as deleteMemories };
export { update_embedding_status as updateEmbeddingStatus };
export { update_confidence as updateConfidence };
