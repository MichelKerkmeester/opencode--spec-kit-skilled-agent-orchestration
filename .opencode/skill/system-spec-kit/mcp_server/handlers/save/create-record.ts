// ───────────────────────────────────────────────────────────────
// MODULE: Create Record
// ───────────────────────────────────────────────────────────────
import path from 'path';
import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../../lib/search/vector-index.js';
import * as bm25Index from '../../lib/search/bm25-index.js';
import * as predictionErrorGate from '../../lib/cognitive/prediction-error-gate.js';
import * as fsrsScheduler from '../../lib/cognitive/fsrs-scheduler.js';
import * as incrementalIndex from '../../lib/storage/incremental-index.js';
import * as causalEdges from '../../lib/storage/causal-edges.js';
import type * as memoryParser from '../../lib/parsing/memory-parser.js';
import { sanitizeEmbeddingFailureMessage } from '../../lib/providers/retry-manager.js';
import { getCanonicalPathKey } from '../../lib/utils/canonical-path.js';
import { recordLineageTransition } from '../../lib/storage/lineage-state.js';
import { toErrorMessage } from '../../utils/index.js';

import { recordHistory } from '../../lib/storage/history.js';
import { calculateDocumentWeight, isSpecDocumentType } from '../pe-gating.js';
import { detectSpecLevelFromParsed } from '../handler-utils.js';
import { classifyEncodingIntent } from '../../lib/search/encoding-intent.js';
import { isEncodingIntentEnabled } from '../../lib/search/search-flags.js';
import { applyPostInsertMetadata } from './db-helpers.js';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Per-memory history log
// Feature catalog: Prediction-error save arbitration


import type { PeDecision, MemoryScopeMatch } from './types.js';
import { normalizeScopeMatchValue } from './types.js';
export type { MemoryScopeMatch };

interface LineageRoutingDecision {
  predecessorMemoryId: number | null;
  transitionEvent: 'CREATE' | 'UPDATE' | 'SUPERSEDE';
  causalSupersedesMemoryId: number | null;
}

export function resolveCreateRecordLineage(
  peDecision: PeDecision,
  samePathExistingId: number | null,
): LineageRoutingDecision {
  if (peDecision.action === predictionErrorGate.ACTION.SUPERSEDE && peDecision.existingMemoryId != null) {
    return {
      predecessorMemoryId: samePathExistingId,
      transitionEvent: samePathExistingId != null ? 'SUPERSEDE' : 'CREATE',
      causalSupersedesMemoryId: samePathExistingId === peDecision.existingMemoryId
        ? null
        : peDecision.existingMemoryId,
    };
  }

  if (samePathExistingId != null) {
    return {
      predecessorMemoryId: samePathExistingId,
      transitionEvent: 'UPDATE',
      causalSupersedesMemoryId: null,
    };
  }

  return {
    predecessorMemoryId: null,
    transitionEvent: 'CREATE',
    causalSupersedesMemoryId: null,
  };
}

function recordCrossPathSupersedesEdge(
  database: BetterSqlite3.Database,
  memoryId: number,
  supersededMemoryId: number | null,
  reason: string | null | undefined,
): void {
  if (supersededMemoryId == null) {
    return;
  }

  causalEdges.init(database);
  const evidence = reason && reason.trim().length > 0
    ? reason.trim()
    : 'Prediction-error contradiction across different file paths';
  causalEdges.insertEdge(
    String(memoryId),
    String(supersededMemoryId),
    causalEdges.RELATION_TYPES.SUPERSEDES,
    1.0,
    evidence,
    true,
    'auto',
  );
}

export function findSamePathExistingMemory(
  database: BetterSqlite3.Database,
  specFolder: string,
  canonicalFilePath: string,
  filePath: string,
  scope: MemoryScopeMatch = {},
): { id: number; title: string | null; content_hash?: string | null } | undefined {
  const tenantId = normalizeScopeMatchValue(scope.tenantId);
  const userId = normalizeScopeMatchValue(scope.userId);
  const agentId = normalizeScopeMatchValue(scope.agentId);
  const sessionId = normalizeScopeMatchValue(scope.sessionId);
  const sharedSpaceId = normalizeScopeMatchValue(scope.sharedSpaceId);

  return database.prepare(`
    SELECT id, title, content_hash
    FROM memory_index
    WHERE spec_folder = ?
      AND parent_id IS NULL
      AND (canonical_file_path = ? OR file_path = ?)
      AND ((? IS NULL AND tenant_id IS NULL) OR tenant_id = ?)
      AND ((? IS NULL AND user_id IS NULL) OR user_id = ?)
      AND ((? IS NULL AND agent_id IS NULL) OR agent_id = ?)
      AND ((? IS NULL AND session_id IS NULL) OR session_id = ?)
      AND ((? IS NULL AND shared_space_id IS NULL) OR shared_space_id = ?)
    ORDER BY id DESC
    LIMIT 1
  `).get(
    specFolder,
    canonicalFilePath,
    filePath,
    tenantId,
    tenantId,
    userId,
    userId,
    agentId,
    agentId,
    sessionId,
    sessionId,
    sharedSpaceId,
    sharedSpaceId,
  ) as { id: number; title: string | null; content_hash?: string | null } | undefined;
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
  scope: MemoryScopeMatch = {},
): number {
  if (!embedding) {
    console.error(`[memory-save] Using deferred indexing for ${path.basename(filePath)}`);
  }

  // Detect spec level for spec documents.
  const specLevel = isSpecDocumentType(parsed.documentType)
    ? detectSpecLevelFromParsed(filePath)
    : null;
  const encodingIntent = isEncodingIntentEnabled()
    ? classifyEncodingIntent(parsed.content)
    : undefined;
  const canonicalFilePath = getCanonicalPathKey(filePath);
  // Security: raw provider errors sanitized before persistence/response
  const persistedEmbeddingFailureReason = sanitizeEmbeddingFailureMessage(embeddingFailureReason);

  const indexWithMetadata = database.transaction(() => {
    // Determine importance weight based on document type.
    const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
    const samePathExisting = findSamePathExistingMemory(
      database,
      parsed.specFolder,
      canonicalFilePath,
      filePath,
      scope,
    );
    const lineageRouting = resolveCreateRecordLineage(peDecision, samePathExisting?.id ?? null);
    const predecessorMemoryId = lineageRouting.predecessorMemoryId;
    const transitionEvent = lineageRouting.transitionEvent;

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
          appendOnly: predecessorMemoryId != null,
        })
      : vectorIndex.indexMemoryDeferred({
          specFolder: parsed.specFolder,
          filePath,
          title: parsed.title,
          triggerPhrases: parsed.triggerPhrases,
          importanceWeight,
          failureReason: persistedEmbeddingFailureReason,
          encodingIntent,
          documentType: parsed.documentType || 'memory',
          specLevel,
          contentText: parsed.content,
          qualityScore: parsed.qualityScore,
          qualityFlags: parsed.qualityFlags,
          appendOnly: predecessorMemoryId != null,
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

    if (predecessorMemoryId != null) {
      database.prepare(`
        UPDATE memory_index
        SET importance_tier = 'deprecated',
            updated_at = ?
        WHERE id = ?
      `).run(new Date().toISOString(), predecessorMemoryId);
    }

    recordLineageTransition(database, memory_id, {
      actor: 'mcp:memory_save',
      predecessorMemoryId,
      transitionEvent,
    });
    recordCrossPathSupersedesEdge(
      database,
      memory_id,
      lineageRouting.causalSupersedesMemoryId,
      peDecision.reason,
    );

    if (bm25Index.isBm25Enabled()) {
      try {
        const bm25 = bm25Index.getIndex();
        bm25.addDocument(String(memory_id), bm25Index.buildBm25DocumentText({
          title: parsed.title,
          content_text: parsed.content,
          trigger_phrases: parsed.triggerPhrases,
          file_path: filePath,
        }));
      } catch (bm25_err: unknown) {
        const message = toErrorMessage(bm25_err);
        console.warn(embedding
          ? `[memory-save] BM25 indexing failed: ${message}`
          : `[memory-save] BM25 indexing failed (deferred path): ${message}`);
      }
    }

    // Append-first writes add a new row for every new current version.
    try {
      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
      if (predecessorMemoryId != null) {
        recordHistory(
          predecessorMemoryId,
          'UPDATE',
          samePathExisting?.title ?? null,
          parsed.title ?? filePath,
          'mcp:memory_save',
        );
      }
    } catch (_histErr: unknown) {
      // History recording is best-effort during save
    }

    return memory_id;
  });

  return indexWithMetadata();
}
