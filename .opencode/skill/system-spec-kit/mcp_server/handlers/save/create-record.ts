// ---------------------------------------------------------------
// MODULE: Create Record
// ---------------------------------------------------------------

import path from 'path';
import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../../lib/search/vector-index';
import * as bm25Index from '../../lib/search/bm25-index';
import * as predictionErrorGate from '../../lib/cache/cognitive/prediction-error-gate';
import * as fsrsScheduler from '../../lib/cache/cognitive/fsrs-scheduler';
import * as incrementalIndex from '../../lib/storage/incremental-index';
import type * as memoryParser from '../../lib/parsing/memory-parser';
import { toErrorMessage } from '../../utils';

import { recordHistory } from '../../lib/storage/history';
import { calculateDocumentWeight, isSpecDocumentType } from '../pe-gating';
import { detectSpecLevelFromParsed } from '../handler-utils';
import { classifyEncodingIntent } from '../../lib/search/encoding-intent';
import { isEncodingIntentEnabled } from '../../lib/search/search-flags';
import { applyPostInsertMetadata } from './db-helpers';

interface PeDecision {
  action: string;
  similarity: number;
  existingMemoryId?: number | null;
  reason?: string;
  contradiction?: { detected: boolean; type: string | null; description: string | null; confidence: number } | null;
}

/**
 * Creates a memory row with metadata, optional BM25 entry, and save history.
 * Returns the persisted memory id for downstream save handlers.
 */
export function createMemoryRecord(
  database: BetterSqlite3.Database,
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  filePath: string,
  embedding: Float32Array | null,
  embeddingFailureReason: string | null,
  peDecision: PeDecision,
): number {
  if (!embedding) {
    console.error(`[memory-save] Using deferred indexing for ${path.basename(filePath)}`);
  }

  // Spec 126: Detect spec level for spec documents
  const specLevel = isSpecDocumentType(parsed.documentType)
    ? detectSpecLevelFromParsed(filePath)
    : null;
  const encodingIntent = isEncodingIntentEnabled()
    ? classifyEncodingIntent(parsed.content)
    : undefined;

  const indexWithMetadata = database.transaction(() => {
    // Determine importance weight based on document type (Spec 126)
    const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);

    const memory_id: number = embedding
      ? vectorIndex.indexMemory({
          specFolder: parsed.specFolder,
          filePath,
          title: parsed.title,
          triggerPhrases: parsed.triggerPhrases,
          importanceWeight,
          embedding,
          encodingIntent,
          documentType: parsed.documentType || 'memory',
          specLevel,
          contentText: parsed.content,
          qualityScore: parsed.qualityScore,
          qualityFlags: parsed.qualityFlags,
        })
      : vectorIndex.indexMemoryDeferred({
          specFolder: parsed.specFolder,
          filePath,
          title: parsed.title,
          triggerPhrases: parsed.triggerPhrases,
          importanceWeight,
          failureReason: embeddingFailureReason,
          encodingIntent,
          documentType: parsed.documentType || 'memory',
          specLevel,
          contentText: parsed.content,
          qualityScore: parsed.qualityScore,
          qualityFlags: parsed.qualityFlags,
        });

    const fileMetadata = incrementalIndex.getFileMetadata(filePath);
    const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

    applyPostInsertMetadata(database, memory_id, {
      content_hash: parsed.contentHash,
      context_type: parsed.contextType,
      importance_tier: parsed.importanceTier,
      memory_type: parsed.memoryType,
      type_inference_source: parsed.memoryTypeSource,
      stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
      difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
      file_mtime_ms: fileMtimeMs,
      encoding_intent: encodingIntent,
      document_type: parsed.documentType || 'memory',
      spec_level: specLevel,
      quality_score: parsed.qualityScore ?? 0,
      quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
    });

    if (embedding && peDecision.action === predictionErrorGate.ACTION.CREATE_LINKED && peDecision.existingMemoryId != null) {
      try {
        database.prepare(`
          UPDATE memory_index
          SET related_memories = ?
          WHERE id = ?
        `).run(JSON.stringify([peDecision.existingMemoryId]), memory_id);
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        console.error('[PE-Gate] Could not store related memories:', message);
      }
    }

    if (bm25Index.isBm25Enabled()) {
      try {
        const bm25 = bm25Index.getIndex();
        bm25.addDocument(String(memory_id), parsed.content);
      } catch (bm25_err: unknown) {
        const message = toErrorMessage(bm25_err);
        console.warn(embedding
          ? `[memory-save] BM25 indexing failed: ${message}`
          : `[memory-save] BM25 indexing failed (deferred path): ${message}`);
      }
    }

    // T-03: Record ADD history for the newly created memory
    try {
      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
    } catch (_histErr: unknown) {
      // history recording is best-effort during save
    }

    return memory_id;
  });

  return indexWithMetadata();
}
