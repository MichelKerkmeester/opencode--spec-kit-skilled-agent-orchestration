import type Database from 'better-sqlite3';

// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Mutations
// ───────────────────────────────────────────────────────────────
// Feature catalog: Hybrid search pipeline
// Split from vector-index-store.ts — contains ALL mutation functions:
// Index, update, delete, and status/confidence updates.

import { getCanonicalPathKey } from '../utils/canonical-path';
import { createLogger } from '../utils/logger';
import * as embeddingsProvider from '../providers/embeddings';
import {
  to_embedding_buffer,
  get_error_message,
} from './vector-index-types';
import {
  initialize_db,
  get_embedding_dim,
  init_prepared_statements,
  clear_constitutional_cache,
  refresh_interference_scores_for_folder,
  sqlite_vec_available as get_sqlite_vec_available,
} from './vector-index-store';
import {
  clear_search_cache,
} from './vector-index-aliases';
import * as bm25Index from './bm25-index';
import { recordHistory } from '../storage/history';

const logger = createLogger('VectorIndex');

function isExpectedMissingVecMemoriesTable(error: unknown): boolean {
  const message = get_error_message(error).toLowerCase();
  return message.includes('no such table') && message.includes('vec_memories');
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
  database.prepare(`
    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(logical_key) DO UPDATE SET
      root_memory_id = excluded.root_memory_id,
      active_memory_id = excluded.active_memory_id,
      updated_at = excluded.updated_at
  `).run(logicalKey, memoryId, memoryId, updatedAt);
}

type EmbeddingInput = Float32Array | number[];
type IndexMemoryParams = {
  readonly specFolder: string;
  readonly filePath: string;
  readonly anchorId?: string | null;
  readonly title?: string | null;
  readonly triggerPhrases?: string[];
  readonly importanceWeight?: number;
  readonly embedding: EmbeddingInput;
  readonly encodingIntent?: string;
  readonly documentType?: string;
  readonly specLevel?: number | null;
  readonly contentText?: string | null;
  readonly qualityScore?: number;
  readonly qualityFlags?: string[];
  readonly appendOnly?: boolean;
};
type IndexMemoryDeferredParams = Omit<IndexMemoryParams, 'embedding'> & {
  readonly failureReason?: string | null;
};
type UpdateMemoryParams = {
  readonly id: number;
  readonly title?: string;
  readonly triggerPhrases?: string[];
  readonly importanceWeight?: number;
  readonly importanceTier?: string;
  readonly embedding?: EmbeddingInput;
  readonly canonicalFilePath?: string;
  readonly encodingIntent?: string;
  readonly documentType?: string;
  readonly specLevel?: number | null;
  readonly contentText?: string | null;
  readonly qualityScore?: number;
  readonly qualityFlags?: string[];
};

/**
 * Indexes a memory with an embedding payload.
 * @param params - The memory values to index.
 * @returns The indexed memory identifier.
 */
export function index_memory(params: IndexMemoryParams): number {
  const database = initialize_db();

  const {
    specFolder,
    filePath,
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
    throw new Error('Embedding is required');
  }

  const expected_dim = get_embedding_dim();
  if (embedding.length !== expected_dim) {
    console.warn(`[vector-index] Embedding dimension mismatch: expected ${expected_dim}, got ${embedding.length}`);
    throw new Error(`Embedding must be ${expected_dim} dimensions, got ${embedding.length}`);
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
    const updatedId = update_memory({
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
    });
    try {
      upsert_active_projection(database, specFolder, canonicalFilePath, anchorId, updatedId, now);
    } catch (_error: unknown) {
      // Best-effort for legacy databases that may not have lineage projection tables.
    }
    return updatedId;
  }

  const sqlite_vec = get_sqlite_vec_available();

  const index_memory_tx = database.transaction(() => {
    const embedding_status = sqlite_vec ? 'success' : 'pending';

    const result = database.prepare(`
      INSERT INTO memory_index (
        spec_folder, file_path, canonical_file_path, anchor_id, title, trigger_phrases,
        importance_weight, created_at, updated_at, embedding_model,
        embedding_generated_at, embedding_status, encoding_intent, document_type, spec_level,
        content_text, quality_score, quality_flags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      specFolder, filePath, canonicalFilePath, anchorId, title, triggers_json,
      importanceWeight, now, now, embeddingsProvider.getModelName(), now, embedding_status,
      encodingIntent ?? 'document', documentType, specLevel, contentText, qualityScore, JSON.stringify(qualityFlags)
    );

    const row_id = BigInt(result.lastInsertRowid);
    const metadata_id = Number(row_id);

    try {
      upsert_active_projection(database, specFolder, canonicalFilePath, anchorId, metadata_id, now);
    } catch (_error: unknown) {
      // Best-effort for legacy databases that may not have lineage projection tables.
    }

    if (sqlite_vec) {
      // Remove orphaned vec_memories entry before insert
      database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(row_id);
      database.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
      `).run(row_id, embedding_buffer);
    }

    refresh_interference_scores_for_folder(database, specFolder);

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
export function index_memory_deferred(params: IndexMemoryDeferredParams): number {
  const database = initialize_db();

  const {
    specFolder,
    filePath,
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
    try {
      upsert_active_projection(database, specFolder, canonicalFilePath, anchorId, existing.id, now);
    } catch (_error: unknown) {
      // Best-effort for legacy databases that may not have lineage projection tables.
    }
    refresh_interference_scores_for_folder(database, specFolder);
    return existing.id;
  }

  const result = database.prepare(`
    INSERT INTO memory_index (
      spec_folder, file_path, canonical_file_path, anchor_id, title, trigger_phrases,
      importance_weight, created_at, updated_at, embedding_status,
      failure_reason, retry_count, encoding_intent, document_type, spec_level,
      content_text, quality_score, quality_flags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 0, ?, ?, ?, ?, ?, ?)
  `).run(
    specFolder, filePath, canonicalFilePath, anchorId, title, triggers_json,
    importanceWeight, now, now, failureReason, encodingIntent ?? 'document', documentType, specLevel, contentText, qualityScore, JSON.stringify(qualityFlags)
  );

  const row_id = BigInt(result.lastInsertRowid);
  try {
    upsert_active_projection(database, specFolder, canonicalFilePath, anchorId, Number(row_id), now);
  } catch (_error: unknown) {
    // Best-effort for legacy databases that may not have lineage projection tables.
  }
  refresh_interference_scores_for_folder(database, specFolder);
  logger.info(`Deferred indexing: Memory ${Number(row_id)} saved without embedding (BM25/FTS5 searchable)`);

  return Number(row_id);
}

/**
 * Updates stored memory metadata and embeddings.
 * @param params - The memory values to update.
 * @returns The updated memory identifier.
 */
export function update_memory(params: UpdateMemoryParams): number {
  const database = initialize_db();

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
    const existingRow = database.prepare('SELECT spec_folder FROM memory_index WHERE id = ?').get(id) as { spec_folder: string | null } | undefined;
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
      updates.push('embedding_status = ?');
      values.push(embeddingsProvider.getModelName(), now, 'success');
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
        throw new Error(`Embedding must be ${expected_dim} dimensions, got ${embedding.length}`);
      }

      const embedding_buffer = to_embedding_buffer(embedding);
      database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
      database.prepare(`
        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
      `).run(BigInt(id), embedding_buffer);
    }

    if (existingRow?.spec_folder) {
      refresh_interference_scores_for_folder(database, existingRow.spec_folder);
    }

    return id;
  });

  return update_memory_tx();
}

/**
 * Deletes a memory and its related index records.
 * @param id - The memory identifier.
 * @returns True when a memory was deleted.
 */
export function delete_memory(id: number): boolean {
  const database = initialize_db();
  return delete_memory_from_database(database, id);
}

/**
 * Deletes a memory and related index records using the provided database handle.
 * @param database - The database containing the target memory.
 * @param id - The memory identifier.
 * @returns True when a memory was deleted.
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
          console.warn(`[vector-index] Vector deletion failed for memory ${id}: ${get_error_message(e)}`);
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
    } catch (_error: unknown) { /* BM25 cleanup is best-effort */ }
  }
  return deleted;
}

/**
 * Deletes the latest memory for a file path and optional anchor.
 * @param spec_folder - The owning spec folder.
 * @param file_path - The file path to delete.
 * @param anchor_id - The optional anchor identifier.
 * @returns True when a memory was deleted.
 */
export function delete_memory_by_path(spec_folder: string, file_path: string, anchor_id: string | null = null): boolean {
  const database = initialize_db();
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
    const deleted = delete_memory(row.id);
    if (deleted) {
      // Self-record DELETE history only after the delete succeeded.
      try {
        recordHistory(row.id, 'DELETE', file_path ?? null, null, 'mcp:delete_by_path', row.spec_folder ?? spec_folder);
      } catch (_histErr: unknown) { /* best-effort */ }
    }
    return deleted;
  }
  return false;
}

/**
 * Deletes multiple memories in a single transaction.
 * @param memory_ids - The memory identifiers to delete.
 * @returns Counts for deleted and failed items.
 */
export function delete_memories(memory_ids: number[]): { deleted: number; failed: number } {
  if (!memory_ids || memory_ids.length === 0) {
    return { deleted: 0, failed: 0 };
  }

  const database = initialize_db();
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
          } catch (_histErr: unknown) { /* best-effort */ }
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
      throw new Error(`Failed to delete memories: ${failed_ids.join(', ')}. Transaction rolled back.`);
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
export function update_embedding_status(id: number, status: string): boolean {
  const valid_statuses = ['pending', 'success', 'failed', 'retry', 'partial'];
  if (!valid_statuses.includes(status)) {
    console.warn(`[vector-index] Invalid embedding status: ${status}`);
    return false;
  }

  try {
    const database = initialize_db();
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
export function update_confidence(memory_id: number, confidence: number): boolean {
  if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
    console.warn(`[vector-index] Invalid confidence value: ${confidence}`);
    return false;
  }

  try {
    const database = initialize_db();
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
