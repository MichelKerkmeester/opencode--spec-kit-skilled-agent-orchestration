// ───────────────────────────────────────────────────────────────
// 1. RECONSOLIDATION BRIDGE
// ───────────────────────────────────────────────────────────────
import path from 'path';
import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../../lib/search/vector-index';
import * as embeddings from '../../lib/providers/embeddings';
import * as bm25Index from '../../lib/search/bm25-index';
import * as fsrsScheduler from '../../lib/cache/cognitive/fsrs-scheduler';
import * as incrementalIndex from '../../lib/storage/incremental-index';
import { reconsolidate } from '../../lib/storage/reconsolidation';
import type { ReconsolidationResult } from '../../lib/storage/reconsolidation';
import { classifyEncodingIntent } from '../../lib/search/encoding-intent';
import {
  isEncodingIntentEnabled,
  isReconsolidationEnabled as isReconsolidationFlagEnabled,
} from '../../lib/search/search-flags';
import type * as memoryParser from '../../lib/parsing/memory-parser';
import { toErrorMessage } from '../../utils';

import { recordHistory } from '../../lib/storage/history';
import { appendMutationLedgerSafe } from '../memory-crud-utils';
import { calculateDocumentWeight, isSpecDocumentType } from '../pe-gating';
import { detectSpecLevelFromParsed } from '../handler-utils';
import { applyPostInsertMetadata, hasReconsolidationCheckpoint } from './db-helpers';
import type { IndexResult } from './types';

/**
 * Result payload from reconsolidation pre-checks during memory_save.
 */
export interface ReconsolidationBridgeResult {
  earlyReturn: IndexResult | null;
  warnings: string[];
}

/**
 * Runs reconsolidation when enabled and returns either an early tool response
 * or a signal to continue the standard create-record path.
 */
export async function runReconsolidationIfEnabled(
  database: BetterSqlite3.Database,
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  filePath: string,
  force: boolean,
  embedding: Float32Array | null,
): Promise<ReconsolidationBridgeResult> {
  // BUG-2 fix: Track reconsolidation warnings for structured MCP response (not just console.warn)
  const reconWarnings: string[] = [];

  // T-04: search-flags.ts is the canonical caller-visible opt-in gate.
  // Reconsolidation.ts keeps an internal guard as a defensive fallback for
  // Direct callers and future entry points.
  if (!force && isReconsolidationFlagEnabled() && embedding) {
    try {
      const hasCheckpoint = hasReconsolidationCheckpoint(database, parsed.specFolder);
      if (!hasCheckpoint) {
        const reconMsg = 'TM-06: reconsolidation skipped — create checkpoint "pre-reconsolidation" first';
        console.warn(`[memory-save] ${reconMsg}`);
        reconWarnings.push(reconMsg);
        // Continue normal create path without reconsolidation.
      } else {
        const reconResult: ReconsolidationResult | null = await reconsolidate(
          {
            title: parsed.title,
            content: parsed.content,
            specFolder: parsed.specFolder,
            filePath,
            embedding,
            triggerPhrases: parsed.triggerPhrases,
            importanceTier: parsed.importanceTier,
          },
          database,
          {
            findSimilar: (emb, opts) => {
              const results = vectorIndex.vectorSearch(emb as Float32Array, {
                limit: opts.limit,
                specFolder: opts.specFolder,
                minSimilarity: 50,
                includeConstitutional: false,
              });
              return results.map((r: Record<string, unknown>) => ({
                id: r.id as number,
                file_path: r.file_path as string,
                title: (r.title as string) ?? null,
                content_text: (r.content as string) ?? null,
                similarity: ((r.similarity as number) ?? 0) / 100,
                spec_folder: parsed.specFolder,
                importance_weight: typeof (r.importance_weight as unknown) === 'number'
                  ? (r.importance_weight as number)
                  : 0.5,
              }));
            },
            storeMemory: (memory) => {
              const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
              const callbackSpecLevel = isSpecDocumentType(parsed.documentType)
                ? detectSpecLevelFromParsed(memory.filePath)
                : null;
              const memoryEncodingIntent = isEncodingIntentEnabled()
                ? classifyEncodingIntent(memory.content)
                : undefined;

              // P1-01 fix — wrap all DB writes (index, metadata, BM25, history) in a
              // Single transaction for atomicity. better-sqlite3 supports nested transactions
              // Via savepoints, so this is safe even if indexMemory uses its own transaction.
              const fileMetadata = incrementalIndex.getFileMetadata(memory.filePath);
              const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

              const memoryId = database.transaction(() => {
                const id = vectorIndex.indexMemory({
                  specFolder: memory.specFolder,
                  filePath: memory.filePath,
                  title: memory.title,
                  triggerPhrases: memory.triggerPhrases ?? [],
                  importanceWeight,
                  embedding: memory.embedding as Float32Array,
                  encodingIntent: memoryEncodingIntent,
                  documentType: parsed.documentType || 'memory',
                  specLevel: callbackSpecLevel,
                  contentText: memory.content,
                  qualityScore: parsed.qualityScore,
                  qualityFlags: parsed.qualityFlags,
                });

                applyPostInsertMetadata(database, id, {
                  content_hash: parsed.contentHash,
                  context_type: parsed.contextType,
                  importance_tier: parsed.importanceTier,
                  memory_type: parsed.memoryType,
                  type_inference_source: parsed.memoryTypeSource,
                  stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
                  difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
                  file_mtime_ms: fileMtimeMs,
                  encoding_intent: memoryEncodingIntent,
                  document_type: parsed.documentType || 'memory',
                  spec_level: callbackSpecLevel,
                  quality_score: parsed.qualityScore ?? 0,
                  quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
                });

                if (bm25Index.isBm25Enabled()) {
                  try {
                    const bm25 = bm25Index.getIndex();
                    bm25.addDocument(String(id), memory.content);
                  } catch (bm25Err: unknown) {
                    const message = toErrorMessage(bm25Err);
                    console.warn(`[memory-save] BM25 indexing failed (recon conflict store): ${message}`);
                  }
                }

                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');

                return id;
              })();

              return memoryId;
            },
            generateEmbedding: async (content: string) => {
              return embeddings.generateDocumentEmbedding(content);
            },
          }
        );

        if (reconResult && reconResult.action !== 'complement') {
          // Reconsolidation handled the memory (merge or conflict) — skip normal CREATE path
          console.error(`[memory-save] TM-06: Reconsolidation ${reconResult.action} for ${path.basename(filePath)}`);

          const reconId = reconResult.action === 'merge'
            ? reconResult.existingMemoryId
            : reconResult.action === 'conflict'
              ? reconResult.newMemoryId
              : 0;

          appendMutationLedgerSafe(database, {
            mutationType: 'update',
            reason: `memory_save: reconsolidation ${reconResult.action}`,
            priorHash: null,
            newHash: parsed.contentHash,
            linkedMemoryIds: reconResult.action === 'conflict'
              ? [reconResult.newMemoryId, reconResult.existingMemoryId]
              : [reconId],
            decisionMeta: {
              tool: 'memory_save',
              action: `reconsolidation_${reconResult.action}`,
              similarity: reconResult.similarity,
              specFolder: parsed.specFolder,
              filePath,
            },
            actor: 'mcp:memory_save',
          });

          return {
            earlyReturn: {
              status: reconResult.action === 'merge' ? 'merged' : 'superseded',
              id: reconId,
              specFolder: parsed.specFolder,
              title: parsed.title ?? '',
              reconsolidation: reconResult,
              message: `Reconsolidation: ${reconResult.action} (similarity: ${reconResult.similarity?.toFixed(3) ?? 'N/A'})`,
            },
            warnings: reconWarnings,
          };
        }
        // ReconResult is null or complement — fall through to normal CREATE path
      }
    } catch (reconErr: unknown) {
      const message = toErrorMessage(reconErr);
      console.warn(`[memory-save] TM-06: Reconsolidation error (proceeding with normal save): ${message}`);
      // Reconsolidation errors must not block saves
    }
  }

  return {
    earlyReturn: null,
    warnings: reconWarnings,
  };
}
