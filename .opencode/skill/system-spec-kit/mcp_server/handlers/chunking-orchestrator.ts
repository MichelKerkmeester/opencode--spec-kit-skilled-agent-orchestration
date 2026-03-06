// ---------------------------------------------------------------
// MODULE: Chunking Orchestrator
// ---------------------------------------------------------------

import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as bm25Index from '../lib/search/bm25-index';
import * as fsrsScheduler from '../lib/cache/cognitive/fsrs-scheduler';
import * as incrementalIndex from '../lib/storage/incremental-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as toolCache from '../lib/cache/tool-cache';
import { classifyEncodingIntent } from '../lib/search/encoding-intent';
import { isEncodingIntentEnabled } from '../lib/search/search-flags';
import { lookupEmbedding, storeEmbedding, computeContentHash as cacheContentHash } from '../lib/cache/embedding-cache';
import { normalizeContentForEmbedding } from '../lib/parsing/content-normalizer';
import { needsChunking, chunkLargeFile } from '../lib/chunking/anchor-chunker';
import { thinChunks } from '../lib/chunking/chunk-thinning';
import { getCanonicalPathKey } from '../lib/utils/canonical-path';
import { requireDb, toErrorMessage } from '../utils';
import { appendMutationLedgerSafe } from './memory-crud-utils';
import { calculateDocumentWeight, isSpecDocumentType } from './pe-gating';
import { detectSpecLevelFromParsed } from './handler-utils';

interface ParsedMemory {
  specFolder: string;
  filePath: string;
  title: string | null;
  triggerPhrases: string[];
  content: string;
  contentHash: string;
  contextType: string;
  importanceTier: string;
  memoryType?: string;
  memoryTypeSource?: string;
  documentType?: string;
  qualityScore?: number;
  qualityFlags?: string[];
}

interface IndexResult extends Record<string, unknown> {
  status: string;
  id: number;
  specFolder: string;
  title: string | null;
  triggerPhrases?: string[];
  contextType?: string;
  importanceTier?: string;
  embeddingStatus?: string;
  message?: string;
}

interface PostInsertMetadataFields {
  content_hash?: string;
  context_type?: string;
  importance_tier?: string;
  memory_type?: string;
  type_inference_source?: string;
  stability?: number;
  difficulty?: number;
  review_count?: number;
  file_mtime_ms?: number | null;
  embedding_status?: string;
  encoding_intent?: string | null;
  document_type?: string;
  spec_level?: number | null;
  quality_score?: number;
  quality_flags?: string;
  parent_id?: number;
  chunk_index?: number;
  chunk_label?: string;
}

interface ChunkingOptions {
  force?: boolean;
  applyPostInsertMetadata?: (
    db: BetterSqlite3.Database,
    memoryId: number,
    fields: PostInsertMetadataFields,
  ) => void;
}

const ALLOWED_METADATA_COLUMNS = new Set([
  'content_hash', 'context_type', 'importance_tier', 'memory_type',
  'type_inference_source', 'stability', 'difficulty', 'review_count',
  'file_mtime_ms', 'embedding_status', 'encoding_intent', 'document_type',
  'spec_level', 'quality_score', 'quality_flags', 'parent_id',
  'chunk_index', 'chunk_label',
]);

function applyPostInsertMetadataFallback(
  db: BetterSqlite3.Database,
  memoryId: number,
  fields: PostInsertMetadataFields,
): void {
  const entries = Object.entries(fields).filter(
    ([col, value]) => ALLOWED_METADATA_COLUMNS.has(col) && value !== undefined
  );
  if (entries.length === 0) {
    return;
  }

  // Use COALESCE for encoding_intent to preserve existing value when new value is null
  const setClause = entries.map(([column]) =>
    column === 'encoding_intent' ? `${column} = COALESCE(?, ${column})` : `${column} = ?`
  ).join(', ');
  const values = entries.map(([, value]) => value);
  db.prepare(`UPDATE memory_index SET ${setClause} WHERE id = ?`).run(...values, memoryId);
}

/**
 * Index a large memory file by splitting it into chunks.
 * Creates a parent record (metadata only, no embedding) and child records
 * (each with its own embedding) for each chunk.
 *
 * Parent record: embedding_status='partial', content_text=summary
 * Child records: embedding_status='success'|'pending', parent_id=parent.id
 */
async function indexChunkedMemoryFile(
  filePath: string,
  parsed: ParsedMemory,
  { force = false, applyPostInsertMetadata }: ChunkingOptions = {},
): Promise<IndexResult> {
  const database = requireDb();
  const applyMetadata = applyPostInsertMetadata ?? applyPostInsertMetadataFallback;
  const canonicalFilePath = getCanonicalPathKey(filePath);

  const chunkResult = chunkLargeFile(parsed.content);
  const thinningResult = thinChunks(chunkResult.chunks);
  const retainedChunks = thinningResult.retained;
  if (retainedChunks.length === 0) {
    console.warn(`[memory-save] No chunks retained after thinning for ${filePath}`);
    return { status: 'warning', id: 0, specFolder: parsed.specFolder ?? '',
             title: parsed.title ?? '', message: 'Zero chunks retained after thinning' };
  }
  const droppedChunkCount = thinningResult.dropped.length;
  const parentEncodingIntent = isEncodingIntentEnabled()
    ? classifyEncodingIntent(parsed.content)
    : undefined;
  console.error(`[memory-save] Chunking ${filePath}: ${chunkResult.strategy} strategy, ${chunkResult.chunks.length} chunks`);
  if (droppedChunkCount > 0) {
    console.error(`[memory-save] Chunk thinning retained ${retainedChunks.length}/${chunkResult.chunks.length} chunks`);
  }

  // Wrap parent setup in transaction to prevent check-then-delete race condition
  const setupParent = database.transaction(() => {
    const existing = database.prepare(`
      SELECT id FROM memory_index
      WHERE spec_folder = ?
        AND parent_id IS NULL
        AND (canonical_file_path = ? OR file_path = ?)
      ORDER BY id DESC
      LIMIT 1
    `).get(parsed.specFolder, canonicalFilePath, filePath) as { id: number } | undefined;

    let pid: number;

    if (existing && !force) {
      pid = existing.id;

      // Delete existing children to re-index
      database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(pid);

      // Update parent metadata
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
      const specLevel = isSpecDocumentType(parsed.documentType)
        ? detectSpecLevelFromParsed(filePath)
        : null;
      const fileMetadata = incrementalIndex.getFileMetadata(filePath);
      const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

      database.prepare(`
        UPDATE memory_index
        SET content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            importance_weight = ?,
            embedding_status = 'partial',
            encoding_intent = COALESCE(?, encoding_intent),
            content_text = ?,
            updated_at = datetime('now'),
            file_mtime_ms = ?,
            document_type = ?,
            spec_level = ?,
            quality_score = ?,
            quality_flags = ?
        WHERE id = ?
      `).run(
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        importanceWeight,
        parentEncodingIntent,
        chunkResult.parentSummary,
        fileMtimeMs,
        parsed.documentType || 'memory',
        specLevel,
        parsed.qualityScore ?? 0,
        JSON.stringify(parsed.qualityFlags ?? []),
        pid
      );

      return { parentId: pid, isUpdate: true };
    } else {
      // Delete old parent+children if force re-indexing
      if (existing && force) {
        database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(existing.id);
        database.prepare(`DELETE FROM memory_index WHERE id = ?`).run(existing.id);
      }

      // Create parent record (no embedding)
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
      const specLevel = isSpecDocumentType(parsed.documentType)
        ? detectSpecLevelFromParsed(filePath)
        : null;

      pid = vectorIndex.indexMemoryDeferred({
        specFolder: parsed.specFolder,
        filePath,
        title: parsed.title,
        triggerPhrases: parsed.triggerPhrases,
        importanceWeight,
        failureReason: 'Chunked parent: embedding in children',
        encodingIntent: parentEncodingIntent,
        documentType: parsed.documentType || 'memory',
        specLevel,
        contentText: chunkResult.parentSummary,
        qualityScore: parsed.qualityScore,
        qualityFlags: parsed.qualityFlags,
      });

      const fileMetadata = incrementalIndex.getFileMetadata(filePath);
      const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

      applyMetadata(database, pid, {
        content_hash: parsed.contentHash,
        context_type: parsed.contextType,
        importance_tier: parsed.importanceTier,
        memory_type: parsed.memoryType,
        type_inference_source: parsed.memoryTypeSource,
        stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
        file_mtime_ms: fileMtimeMs,
        embedding_status: 'partial',
        quality_score: parsed.qualityScore ?? 0,
        quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
      });

      return { parentId: pid, isUpdate: false };
    }
  });

  const { parentId, isUpdate: existingParentUpdated } = setupParent();
  // Use existingParentUpdated below for mutation ledger (replaces `existing` variable)
  const existing = existingParentUpdated;

  // Index BM25 for parent with summary
  if (bm25Index.isBm25Enabled()) {
    try {
      const bm25 = bm25Index.getIndex();
      bm25.addDocument(String(parentId), chunkResult.parentSummary);
    } catch (bm25_err: unknown) {
      const message = toErrorMessage(bm25_err);
      console.warn(`[memory-save] BM25 indexing failed for parent: ${message}`);
    }
  }

  // Index each chunk as a child record
  let successCount = 0;
  let failedCount = 0;
  const childIds: number[] = [];
  const bm25FailedChunks: number[] = [];

  for (let i = 0; i < retainedChunks.length; i++) {
    const chunk = retainedChunks[i];
    const chunkTitle = `${parsed.title || 'Untitled'} [chunk ${i + 1}/${retainedChunks.length}]`;
    const chunkEncodingIntent = isEncodingIntentEnabled()
      ? classifyEncodingIntent(chunk.content)
      : undefined;

    try {
      // AI-WHY: Persistent embedding cache (REQ-S2-001) avoids re-calling the embedding
      // provider on re-index — content-hash keyed so unchanged chunks skip API entirely.
      let chunkEmbedding: Float32Array | null = null;
      let chunkEmbeddingStatus = 'pending';

      try {
        const chunkHash = cacheContentHash(chunk.content);
        const modelId = embeddings.getModelName();
        const cachedChunkBuf = lookupEmbedding(database, chunkHash, modelId);
        if (cachedChunkBuf) {
          chunkEmbedding = new Float32Array(new Uint8Array(cachedChunkBuf).buffer);
          chunkEmbeddingStatus = 'success';
        } else {
          chunkEmbedding = await embeddings.generateDocumentEmbedding(normalizeContentForEmbedding(chunk.content));
          if (chunkEmbedding) {
            chunkEmbeddingStatus = 'success';
            const chunkBuf = Buffer.from(chunkEmbedding.buffer, chunkEmbedding.byteOffset, chunkEmbedding.byteLength);
            storeEmbedding(database, chunkHash, modelId, chunkBuf, chunkEmbedding.length);
          }
        }
      } catch (embErr: unknown) {
        const message = toErrorMessage(embErr);
        console.warn(`[memory-save] Chunk ${i + 1} embedding failed: ${message}`);
      }

      let childId: number;
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);

      if (chunkEmbedding) {
        childId = vectorIndex.indexMemory({
          specFolder: parsed.specFolder,
          filePath,
          anchorId: chunk.label,
          title: chunkTitle,
          triggerPhrases: [],
          importanceWeight,
          embedding: chunkEmbedding,
          encodingIntent: chunkEncodingIntent,
          documentType: parsed.documentType || 'memory',
          contentText: chunk.content,
        });
      } else {
        childId = vectorIndex.indexMemoryDeferred({
          specFolder: parsed.specFolder,
          filePath,
          title: chunkTitle,
          triggerPhrases: [],
          importanceWeight,
          failureReason: 'Chunk embedding failed',
          encodingIntent: chunkEncodingIntent,
          documentType: parsed.documentType || 'memory',
          contentText: chunk.content,
        });
      }

      // Set parent_id, chunk_index, chunk_label on the child
      applyMetadata(database, childId, {
        parent_id: parentId,
        chunk_index: i,
        chunk_label: chunk.label,
        content_hash: parsed.contentHash,
        context_type: parsed.contextType,
        importance_tier: parsed.importanceTier,
        embedding_status: chunkEmbeddingStatus,
        encoding_intent: chunkEncodingIntent,
        stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
      });

      childIds.push(childId);

      // BM25 index the chunk
      if (bm25Index.isBm25Enabled()) {
        try {
          const bm25 = bm25Index.getIndex();
          bm25.addDocument(String(childId), chunk.content);
        } catch (bm25_err: unknown) {
          const message = toErrorMessage(bm25_err);
          console.error(`[memory-save] BM25 indexing failed for chunk ${i + 1}: ${message}`);
          bm25FailedChunks.push(childId);
        }
      }

      successCount++;
    } catch (chunkErr: unknown) {
      failedCount++;
      const message = toErrorMessage(chunkErr);
      console.error(`[memory-save] Failed to index chunk ${i + 1}: ${message}`);
    }
  }

  if (successCount === 0) {
    const parentRolledBack = !existing;
    const rollbackMessage = parentRolledBack
      ? `Chunked indexing aborted: all ${retainedChunks.length} chunks failed (parent rolled back)`
      : `Chunked indexing aborted: all ${retainedChunks.length} chunks failed (existing parent retained)`;
    console.error(`[memory-save] ${rollbackMessage} for ${filePath}`);

    try {
      const rollbackTx = database.transaction(() => {
        database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(parentId);
        if (parentRolledBack) {
          database.prepare(`DELETE FROM memory_index WHERE id = ?`).run(parentId);
        } else {
          applyMetadata(database, parentId, {
            embedding_status: 'pending',
          });
        }
      });
      rollbackTx();
    } catch (rollbackErr: unknown) {
      const message = toErrorMessage(rollbackErr);
      console.error(`[memory-save] Rollback failed for parent ${parentId}: ${message}`);
    }

    if (parentRolledBack && bm25Index.isBm25Enabled()) {
      try {
        bm25Index.getIndex().removeDocument(String(parentId));
      } catch (bm25Err: unknown) {
        const message = toErrorMessage(bm25Err);
        console.warn(`[memory-save] BM25 rollback failed for parent ${parentId}: ${message}`);
      }
    }

    triggerMatcher.clearCache();
    toolCache.invalidateOnWrite('chunked-save-rollback', { filePath });

    return {
      status: 'warning',
      id: parentRolledBack ? 0 : parentId,
      specFolder: parsed.specFolder,
      title: parsed.title,
      triggerPhrases: parsed.triggerPhrases,
      contextType: parsed.contextType,
      importanceTier: parsed.importanceTier,
      embeddingStatus: parentRolledBack ? 'failed' : 'pending',
      message: rollbackMessage,
    };
  }

  // Mutation ledger
  appendMutationLedgerSafe(database, {
    mutationType: existing ? 'update' : 'create',
    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
    priorHash: null,
    newHash: parsed.contentHash,
    linkedMemoryIds: [parentId, ...childIds],
    decisionMeta: {
      tool: 'memory_save',
      status: 'chunked',
      chunkStrategy: chunkResult.strategy,
      chunkCount: retainedChunks.length,
      droppedCount: droppedChunkCount,
      successCount,
      failedCount,
      specFolder: parsed.specFolder,
      filePath,
    },
    actor: 'mcp:memory_save',
  });

  // AI-WHY: Chunked path must invalidate caches just like the single-record path;
  // otherwise stale trigger/tool-cache entries persist until next non-chunked save.
  triggerMatcher.clearCache();
  toolCache.invalidateOnWrite('chunked-save', { filePath });

  return {
    status: existing ? 'updated' : 'indexed',
    id: parentId,
    specFolder: parsed.specFolder,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    embeddingStatus: 'partial',
    message: `Chunked: ${successCount}/${retainedChunks.length} chunks indexed (${chunkResult.strategy} strategy)` +
      (bm25FailedChunks.length > 0 ? ` (${bm25FailedChunks.length} BM25 failures)` : ''),
  };
}

export {
  indexChunkedMemoryFile,
  needsChunking,
};
